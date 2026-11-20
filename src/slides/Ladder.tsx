import type { CSSProperties } from "react";
import { ArtPicture } from "@/components/ArtPicture";
import { Seal } from "@/components/Seal";
import { Slide, SlideHeading, stagger, type SlideProps } from "@/components/Slide";
import { artworksWithRole, shortTitle } from "@/content/art";
import { COPY, ROMAN } from "@/content/copy";

/**
 * Where the portrait sits inside each frame (the ring's opening, measured
 * from the PNG): centre x, centre y and diameter, in % of the frame.
 */
const OPENINGS: [number, number, number][] = [
  [50.9, 49.2, 42],
  [50.5, 51, 42],
  [49.9, 47.6, 44],
  [50, 46, 43],
  [50, 51.5, 44],
  [49.5, 52, 42],
  [50, 47, 40],
];

/** The square crop for each portrait, so the sitter's face is in the ring. */
const FACES = ["50% 22%", "50% 26%", "50% 4%", "50% 10%", "50% 9%", "50% 14%", "50% 4%"];

/** Room VI: seven ranks, each a portrait that grows grander, in the app's heraldic frames (brief §6, Slide VI). */
export function Ladder({ index }: SlideProps) {
  const t = COPY.ladder;
  return (
    <Slide id="ladder" index={index}>
      <div className="slide-inner grid gap-10">
        {/* Desktop: Seals and Halls beside the headline, above the low end of the staircase. Phones: under the ladder. */}
        <div className="max-lg:contents lg:grid lg:grid-cols-12 lg:items-start lg:gap-6">
          <div className="lg:col-span-7">
            <SlideHeading id="ladder" index={index} title={t.title} sub={t.sub} />
          </div>
          <div className="grid gap-3 max-lg:order-last lg:col-span-4 lg:col-start-9 lg:pt-8" data-reveal-self>
            <section className="placard ladder-note reveal" style={stagger(2)} aria-labelledby="ladder-seals">
              <Seal size={48} className="shrink-0" />
              <div>
                <h3 id="ladder-seals" className="m-0 font-serif text-lg font-medium text-canvas">
                  {t.seals.title}
                </h3>
                <p className="m-0 text-[14px] text-canvas-muted">{t.seals.names}</p>
                <p className="fine m-0 mt-1 font-serif italic">“{t.seals.line}”</p>
              </div>
            </section>
            <section className="placard ladder-note reveal" style={stagger(3)} aria-labelledby="ladder-halls">
              <div>
                <h3 id="ladder-halls" className="m-0 font-serif text-lg font-medium text-canvas">
                  {t.halls.title}
                </h3>
                <ul className="m-0 mt-1 grid list-none gap-0.5 p-0 text-[14px] text-canvas-muted">
                  {t.halls.items.map((h) => (
                    <li key={h}>{h}</li>
                  ))}
                </ul>
              </div>
            </section>
            <p className="fine reveal m-0" style={stagger(4)}>
              {t.small}
            </p>
          </div>
        </div>
        <ol className="ladder" aria-label={t.ladderLabel}>
          {t.ranks.map((rank, i) => {
            const work = artworksWithRole(`rank:${i + 1}`)[0];
            const [x, y, d] = OPENINGS[i];
            return (
              <li key={rank} className="rank reveal" data-reveal-self style={{ ...stagger(i % 2), "--step": i } as CSSProperties}>
                <div className="rank-medal">
                  <div
                    className="rank-portrait"
                    style={{ left: `${x - d / 2}%`, top: `${y - d / 2}%`, width: `${d}%`, backgroundImage: `url(${work.image.placeholder})` }}
                  >
                    <ArtPicture work={{ ...work, focal: FACES[i] }} sizes="(min-width: 1024px) 90px, 18vw" className="h-full w-full object-cover" />
                  </div>
                  <img
                    src={`/ranks/level-${i + 1}-320.webp`}
                    srcSet={`/ranks/level-${i + 1}-320.webp 320w, /ranks/level-${i + 1}-640.webp 640w`}
                    sizes="(min-width: 1024px) 170px, 30vw"
                    width={320}
                    height={320}
                    alt=""
                    loading="lazy"
                    decoding="async"
                    className="rank-frame"
                  />
                </div>
                <p className="m-0 font-serif text-sm text-accent">{ROMAN[i]}</p>
                <p className="m-0 font-serif text-base font-medium text-canvas lg:text-lg">{rank}</p>
                <p className="art-caption m-0">
                  <i>{shortTitle(work)}</i> · {work.artist}
                </p>
              </li>
            );
          })}
        </ol>
      </div>
    </Slide>
  );
}
