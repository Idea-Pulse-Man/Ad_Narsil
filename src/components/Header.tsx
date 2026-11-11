"use client";

import { COPY } from "@/content/copy";
import { track } from "@/lib/analytics";
import { useExhibition } from "@/lib/exhibition-store";
import { SITE } from "@/config/site";
import { Crest } from "./Crest";

/**
 * Transparent over the hero, ink with a blur after 80 px (brief §5.4). One
 * goal, no exits: the crest and wordmark, plus a desktop "Get the app" once
 * the hero's own CTA has scrolled away.
 */
export function Header({ exhibition = true }: { exhibition?: boolean }) {
  const scrolled = useExhibition((s) => s.scrolled);
  const showCta = useExhibition((s) => !s.heroCtaVisible);

  return (
    <header className="site-header" data-scrolled={exhibition ? scrolled : true}>
      <div className="mx-auto flex h-12 max-w-[1336px] items-center justify-between px-4 min-[390px]:px-5 lg:h-16 lg:px-12">
        <a href={exhibition ? "#entrance" : "/"} className="-m-2 flex min-h-11 items-center gap-2.5 p-2 no-underline">
          <Crest size={28} className="crest-glow" />
          <span className="wordmark">Narsil</span>
        </a>
        {exhibition && (
          <a
            href="#doors"
            className="header-cta btn-gold hidden min-h-10 px-5 text-sm lg:inline-flex"
            data-shown={showCta}
            tabIndex={showCta ? undefined : -1}
            onClick={() =>
              track("cta_click", { placement: "header", store: SITE.launchState === "prelaunch" ? "waitlist" : "app_store" })
            }
          >
            {COPY.header.cta}
          </a>
        )}
      </div>
    </header>
  );
}
