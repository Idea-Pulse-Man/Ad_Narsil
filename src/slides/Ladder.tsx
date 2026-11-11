import type { CSSProperties } from "react";
import { ArtPicture } from "@/components/ArtPicture";
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
        <SlideHeading id="ladder" index={index} title={t.title} sub={t.sub} />
        <ol className="ladder" aria-label={t.ladderLabel}>
          {t.ranks.map((rank, i) => {
            const work = artworksWithRole(`rank:${i + 1}`)[0];
            const [x, y, d] = OPENINGS[i];
            return (
              <li key={rank} className="rank reveal" style={{ ...stagger(3 + i), "--step": i } as CSSProperties}>
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
        <p className="fine reveal max-w-xl" style={stagger(10)}>
          {t.small}
        </p>
      </div>
    </Slide>
  );
}
