import type { CSSProperties } from "react";
import { Framed } from "@/components/Framed";
import { Slide, SlideHeading, stagger, type SlideProps } from "@/components/Slide";
import { artworksWithRole, type Artwork } from "@/content/art";
import { CLIPS } from "@/content/clips";
import { COPY } from "@/content/copy";
import { GestureList, HoldStage, PhoneDemo } from "./GalleryDemo";

const COLUMNS = 3;
/** Seconds per loop, per column: a little out of step so the wall never looks mechanical. */
const SPEEDS = [70, 88, 76];

/**
 * Room II: the feed is endless, and it's art (brief §6, Slide II).
 *
 * With the app recordings in place (src/content/clips.ts) a real iPhone plays
 * them, driven by the gesture list. Until then the wall itself scrolls: three
 * columns of works drifting up and down. Each column holds its works twice
 * so the loop is seamless; the repeat is hidden from screen readers. It
 * pauses on hover or focus and stands still under reduced motion. Either
 * way, pressing and holding shows only the art, as in the app.
 */
export function Gallery({ index }: SlideProps) {
  const t = COPY.gallery;
  const works = artworksWithRole("gallery");
  const columns: Artwork[][] = Array.from({ length: COLUMNS }, (_, c) => works.filter((_, i) => i % COLUMNS === c));

  return (
    <Slide id="gallery" index={index}>
      {/* Phones: the wall comes straight after the kicker, the gestures under it. */}
      <div className="slide-inner room-grid max-lg:gap-8">
        <div className="room-copy grid gap-8 max-lg:contents">
          <SlideHeading id="gallery" index={index} title={t.title} sub={t.sub} />
          <p className="reveal m-0 font-serif text-xl italic text-gilt-light" style={stagger(3)}>
            {t.kicker}
          </p>
          <div className="contents" style={stagger(4)}>
            <GestureList />
          </div>
          <p className="fine reveal max-lg:order-2" style={stagger(5)}>
            {t.small}
          </p>
        </div>

        <section className="room-art reveal max-lg:order-1" style={stagger(2)} aria-label={t.wallLabel}>
          <HoldStage label={t.wallLabel}>
            {CLIPS.ready ? (
              <PhoneDemo />
            ) : (
              <div className="wall">
                {columns.map((col, c) => (
                  <div key={c} className="wall-col" style={{ "--dur": `${SPEEDS[c]}s` } as CSSProperties} data-dir={c === 1 ? "down" : "up"}>
                    {[0, 1].map((copy) =>
                      col.map((w) => (
                        <Framed
                          key={`${copy}-${w.slug}`}
                          work={w}
                          sizes="(min-width: 1024px) 200px, (min-width: 640px) 30vw, 45vw"
                          decorative={copy === 1}
                          className="wall-tile"
                        />
                      )),
                    )}
                  </div>
                ))}
              </div>
            )}
          </HoldStage>
        </section>
      </div>
    </Slide>
  );
}
