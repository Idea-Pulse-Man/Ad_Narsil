import { SITE, type LaunchState } from "@/config/site";
import type { Utm } from "./utm";

export type Platform = "ios" | "android" | "desktop";
export type Store = "app_store" | "play" | "web" | "waitlist";

/** iPadOS reports itself as a Mac; only touch support gives it away. */
export function detectPlatform(ua: string, maxTouchPoints = 0): Platform {
  if (/iPhone|iPad|iPod/.test(ua)) return "ios";
  if (/Macintosh/.test(ua) && maxTouchPoints > 1) return "ios";
  if (/Android/.test(ua)) return "android";
  return "desktop";
}

const MAX_TOKEN = 40;
const part = (s: string | undefined) =>
  (s ?? "")
    .toLowerCase()
    .replace(/[^a-z0-9-]+/g, "-")
    .replace(/-{2,}/g, "-")
    .replace(/^-|-$/g, "");

/**
 * utm_source + utm_campaign + placement → "ig_launch1_hero"; only [a-z0-9_-],
 * at most 40 characters. With no UTMs: "organic_<placement>". On a campaign
 * variant (/quiz, /prints, /learn) the variant stands in for a missing
 * utm_campaign. The placement is never truncated.
 */
export function campaignToken(placement: string, utm: Utm = {}, variant?: string): string {
  const tail =
    placement
      .toLowerCase()
      .replace(/[^a-z0-9_-]+/g, "-")
      .slice(0, MAX_TOKEN) || "unknown";
  const room = MAX_TOKEN - tail.length - 1;
  if (room < 1) return tail;
  const head = [part(utm.source) || "organic", part(utm.campaign) || part(variant)].filter(Boolean).join("_");
  return `${head.slice(0, room).replace(/[-_]+$/, "")}_${tail}`;
}

type AppStoreConfig = { id: string; providerToken: string };

export function appStoreUrl(placement: string, utm?: Utm, variant?: string, store: AppStoreConfig = SITE.appStore): string {
  const u = new URL(`https://apps.apple.com/app/apple-store/id${store.id}`);
  if (store.providerToken) {
    u.searchParams.set("pt", store.providerToken);
    u.searchParams.set("ct", campaignToken(placement, utm, variant));
  }
  u.searchParams.set("mt", "8");
  return u.toString();
}

export type Cta =
  | { kind: "waitlist" }
  | { kind: "app-store"; badge: "download" | "preorder" }
  | { kind: "play" }
  | { kind: "iphone-first" };

/** Which CTA a visitor sees (brief §7.5). */
export function resolveCta(platform: Platform, state: LaunchState, googlePlayUrl: string = SITE.googlePlayUrl): Cta {
  if (state === "prelaunch") return { kind: "waitlist" };
  if (platform === "android") return googlePlayUrl ? { kind: "play" } : { kind: "iphone-first" };
  return { kind: "app-store", badge: state === "live" ? "download" : "preorder" };
}

export type GetAction =
  | { kind: "redirect"; url: string; store: Store }
  | { kind: "page"; cta: Cta; platform: Platform };

type GetConfig = { launchState: LaunchState; googlePlayUrl: string; appStore: AppStoreConfig };

/**
 * The /get smart link (brief §7.4), decided on the server from the user agent.
 * An iPad that reports itself as a Mac lands on the desktop page, whose inline
 * script sends it on to the App Store.
 */
export function resolveGet(ua: string, utm: Utm, campaign?: string, site: GetConfig = SITE): GetAction {
  const platform = detectPlatform(ua);
  const cta = resolveCta(platform, site.launchState, site.googlePlayUrl);
  if (cta.kind === "app-store" && platform === "ios") {
    const credited = { ...utm, campaign: utm.campaign ?? campaign };
    return { kind: "redirect", url: appStoreUrl("get", credited, undefined, site.appStore), store: "app_store" };
  }
  if (cta.kind === "play") return { kind: "redirect", url: site.googlePlayUrl, store: "play" };
  return { kind: "page", cta, platform };
}
