import { renderToStaticMarkup } from "react-dom/server";
import { describe, expect, it } from "vitest";
import { InlineCta, StoreCta } from "./StoreCta";

describe("StoreCta renders each launch state (brief §7.2)", () => {
  it("prelaunch: the waitlist, and never a store badge", () => {
    const html = renderToStaticMarkup(<StoreCta placement="hero" state="prelaunch" />);
    expect(html).toContain("Join the waitlist");
    expect(html).toContain('type="email"');
    expect(html).not.toContain("apps.apple.com");
    expect(html).not.toContain("on the App Store");
  });

  it("preorder: the pre-order badge, linking to the App Store", () => {
    const html = renderToStaticMarkup(<StoreCta placement="hero" state="preorder" />);
    expect(html).toContain("Pre-order on the App Store");
    expect(html).toContain("https://apps.apple.com/app/apple-store/id");
    expect(html).not.toContain("Join the waitlist");
  });

  it("live: the download badge, linking to the App Store", () => {
    const html = renderToStaticMarkup(<StoreCta placement="doors" state="live" />);
    expect(html).toContain("Download on the App Store");
    expect(html).toContain("https://apps.apple.com/app/apple-store/id");
  });

  it("in-slide pills lead to the waitlist before launch and to the store after", () => {
    expect(renderToStaticMarkup(<InlineCta placement="prints" label="Choose yours in the app" state="prelaunch" />)).toContain(
      'href="#doors"',
    );
    expect(renderToStaticMarkup(<InlineCta placement="prints" label="Choose yours in the app" state="live" />)).toContain(
      "Choose yours in the app",
    );
  });
});
