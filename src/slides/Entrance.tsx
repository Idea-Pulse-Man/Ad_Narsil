import { preload } from "react-dom";
import { Rich } from "@/components/Rich";
import { Slide, type SlideProps } from "@/components/Slide";
import { StoreCta } from "@/components/StoreCta";
import { artworksWithRole, fallbackSrc, srcSet } from "@/content/art";
import { COPY } from "@/content/copy";
import { HeroStage } from "./HeroStage";

/** Room I: what Narsil is in 5 seconds, and the download (brief §6, Slide I). */
export function Entrance({ index, title = COPY.entrance.title, sub = COPY.entrance.sub }: SlideProps & { title?: string; sub?: string }) {
  const works = artworksWithRole("hero");
  const first = works[0].image;
  // The first work is the LCP element: nothing may delay it.
  preload(fallbackSrc(first.avif), {
    as: "image",
    type: "image/avif",
    fetchPriority: "high",
    imageSrcSet: srcSet(first.avif),
    imageSizes: "(min-width: 1024px) 40vw, 320px",
  });

  return (
    <Slide id="entrance" index={index} className="entrance">
      <div className="slide-inner">
        <HeroStage works={works}>
          <div className="grid gap-4 lg:gap-6">
            <p className="eyebrow">{COPY.entrance.eyebrow}</p>
            <h1 id="entrance-title" className="display-1">
              <Rich text={title} />
            </h1>
            <p className="lede">{sub}</p>
            <div className="cta-frame mt-1 lg:mt-2 lg:w-fit" data-cta-anchor="hero">
              <StoreCta placement="hero" qr />
              <p className="fine mt-3">{COPY.cta.note}</p>
            </div>
          </div>
        </HeroStage>
        <a
          href="#gallery"
          className="scroll-cue absolute inset-x-0 bottom-6 mx-auto w-fit flex-col items-center gap-1 text-xs tracking-[0.2em] text-stone uppercase"
        >
          {COPY.entrance.scrollCue}
          <svg width="16" height="10" viewBox="0 0 16 10" aria-hidden="true" className="text-accent">
            <path d="M1 1l7 7 7-7" fill="none" stroke="currentColor" strokeWidth="1.5" />
          </svg>
        </a>
      </div>
    </Slide>
  );
}
