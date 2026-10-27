import { describe, expect, it } from "vitest";
import { appStoreUrl, campaignToken, detectPlatform, resolveCta, resolveGet } from "./store-links";

const IPHONE = "Mozilla/5.0 (iPhone; CPU iPhone OS 18_0 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Mobile/15E148 Instagram 350.0";
const ANDROID = "Mozilla/5.0 (Linux; Android 14; Pixel 8) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/130.0 Mobile Safari/537.36";
const MAC = "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/18.0 Safari/605.1.15";
const WINDOWS = "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/130.0 Safari/537.36";

describe("campaignToken", () => {
  it("joins source, campaign and placement", () => {
    expect(campaignToken("hero", { source: "ig", campaign: "launch1" })).toBe("ig_launch1_hero");
  });

  it("falls back to organic_<placement> without UTMs", () => {
    expect(campaignToken("hero")).toBe("organic_hero");
    expect(campaignToken("quiz_verdict", {})).toBe("organic_quiz_verdict");
  });

  it("uses the variant when there's no utm_campaign", () => {
    expect(campaignToken("hero", {}, "quiz")).toBe("organic_quiz_hero");
    expect(campaignToken("hero", { source: "tt" }, "prints")).toBe("tt_prints_hero");
    expect(campaignToken("hero", { source: "tt", campaign: "fall" }, "prints")).toBe("tt_fall_hero");
  });

  it("keeps only [a-z0-9_-], with underscores reserved as separators", () => {
    expect(campaignToken("hero", { source: "Instagram Stories!", campaign: "Fall_Launch 2026" })).toBe(
      "instagram-stories_fall-launch-2026_hero",
    );
    expect(campaignToken("hero", { source: "ïg", campaign: "--x--" })).toBe("g_x_hero");
  });

  it("truncates to 40 characters without cutting the placement", () => {
    const token = campaignToken("quiz_verdict", { source: "facebook-and-instagram", campaign: "autumn-launch-wave-two" });
    expect(token.length).toBeLessThanOrEqual(40);
    expect(token.endsWith("_quiz_verdict")).toBe(true);
    expect(token).toMatch(/^[a-z0-9_-]+$/);
    expect(token).not.toMatch(/[-_]_/);
  });

  it("survives a placement longer than the limit", () => {
    expect(campaignToken("x".repeat(50))).toBe("x".repeat(40));
  });
});

describe("appStoreUrl", () => {
  it("adds pt and ct only when a provider token exists", () => {
    const plain = new URL(appStoreUrl("hero", { source: "ig" }, undefined, { id: "123", providerToken: "" }));
    expect(plain.pathname).toBe("/app/apple-store/id123");
    expect(plain.searchParams.get("mt")).toBe("8");
    expect(plain.searchParams.has("pt")).toBe(false);
    expect(plain.searchParams.has("ct")).toBe(false);

    const tracked = new URL(appStoreUrl("hero", { source: "ig", campaign: "launch1" }, undefined, { id: "123", providerToken: "999" }));
    expect(tracked.searchParams.get("pt")).toBe("999");
    expect(tracked.searchParams.get("ct")).toBe("ig_launch1_hero");
  });
});

describe("detectPlatform", () => {
  it("recognises phones, desktops and iPadOS posing as a Mac", () => {
    expect(detectPlatform(IPHONE)).toBe("ios");
    expect(detectPlatform(ANDROID)).toBe("android");
    expect(detectPlatform(WINDOWS)).toBe("desktop");
    expect(detectPlatform(MAC, 0)).toBe("desktop");
    expect(detectPlatform(MAC, 5)).toBe("ios");
  });
});

describe("resolveCta (brief §7.5)", () => {
  it("shows the waitlist to everyone before launch", () => {
    for (const p of ["ios", "android", "desktop"] as const) expect(resolveCta(p, "prelaunch", "")).toEqual({ kind: "waitlist" });
  });

  it("shows the pre-order or download badge on iPhone and desktop", () => {
    expect(resolveCta("ios", "preorder", "")).toEqual({ kind: "app-store", badge: "preorder" });
    expect(resolveCta("desktop", "live", "")).toEqual({ kind: "app-store", badge: "download" });
  });

  it("gives Android the Play badge only when a Play URL is set", () => {
    expect(resolveCta("android", "live", "")).toEqual({ kind: "iphone-first" });
    expect(resolveCta("android", "live", "https://play.google.com/store/apps/details?id=x")).toEqual({ kind: "play" });
  });
});

describe("resolveGet (/get in every launch state)", () => {
  const site = (launchState: "prelaunch" | "preorder" | "live", googlePlayUrl = "") => ({
    launchState,
    googlePlayUrl,
    appStore: { id: "123", providerToken: "999" },
  });

  it("prelaunch: the waitlist page for everyone", () => {
    for (const ua of [IPHONE, ANDROID, WINDOWS]) {
      expect(resolveGet(ua, {}, "ig1", site("prelaunch"))).toMatchObject({ kind: "page", cta: { kind: "waitlist" } });
    }
  });

  it("preorder and live: iPhones go straight to the store, credited to the campaign", () => {
    for (const state of ["preorder", "live"] as const) {
      const action = resolveGet(IPHONE, { source: "ig" }, "launch1", site(state));
      expect(action.kind).toBe("redirect");
      if (action.kind !== "redirect") continue;
      expect(action.store).toBe("app_store");
      expect(new URL(action.url).searchParams.get("ct")).toBe("ig_launch1_get");
    }
  });

  it("live: a utm_campaign wins over ?c=", () => {
    const action = resolveGet(IPHONE, { source: "ig", campaign: "fall" }, "launch1", site("live"));
    expect(action.kind === "redirect" && new URL(action.url).searchParams.get("ct")).toBe("ig_fall_get");
  });

  it("live: Android goes to Play when it exists, otherwise to the iPhone-first page", () => {
    expect(resolveGet(ANDROID, {}, undefined, site("live", "https://play.google.com/x"))).toEqual({
      kind: "redirect",
      url: "https://play.google.com/x",
      store: "play",
    });
    expect(resolveGet(ANDROID, {}, undefined, site("live"))).toMatchObject({ kind: "page", cta: { kind: "iphone-first" } });
  });

  it("live: desktops get the badge and QR page", () => {
    expect(resolveGet(WINDOWS, {}, undefined, site("live"))).toMatchObject({ kind: "page", platform: "desktop", cta: { kind: "app-store" } });
  });
});
