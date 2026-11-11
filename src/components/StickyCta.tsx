"use client";

import { SITE } from "@/config/site";
import { COPY } from "@/content/copy";
import { track } from "@/lib/analytics";
import { useExhibition } from "@/lib/exhibition-store";
import { appStoreUrl } from "@/lib/store-links";
import { Crest } from "./Crest";
import { StoreLink } from "./StoreLink";

/**
 * Phones only (brief §5.5): mini crest, a line and a gold pill. Hidden while
 * the hero's or the doors' own CTA is on screen. Before launch the pill takes
 * the visitor to the waitlist at the doors.
 */
export function StickyCta() {
  const shown = useExhibition((s) => !s.heroCtaVisible && !s.doorsCtaVisible);
  const prelaunch = SITE.launchState === "prelaunch";

  return (
    <div className="sticky-cta" data-shown={shown} inert={!shown}>
      <Crest size={28} className="crest-glow shrink-0" />
      <p className="m-0 min-w-0 flex-1 truncate text-sm font-medium text-canvas">{COPY.sticky.label}</p>
      {prelaunch ? (
        <a
          href="#doors"
          className="btn-gold px-5 text-sm"
          onClick={() => {
            track("cta_click", { placement: "sticky", store: "waitlist" });
            // Once the scroll lands, put the cursor in the doors' email field.
            setTimeout(() => document.querySelector<HTMLInputElement>("#doors input[type=email]")?.focus({ preventScroll: true }), 700);
          }}
        >
          {COPY.sticky.cta}
        </a>
      ) : (
        <StoreLink placement="sticky" store="app_store" href={appStoreUrl("sticky")} className="btn-gold px-5 text-sm">
          {COPY.sticky.cta}
        </StoreLink>
      )}
    </div>
  );
}
