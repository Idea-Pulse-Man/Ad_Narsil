import type { CSSProperties } from "react";
import { Framed } from "@/components/Framed";
import { Slide, SlideHeading, stagger, type SlideProps } from "@/components/Slide";
import { artworksWithRole, type Artwork } from "@/content/art";
import { COPY } from "@/content/copy";

const COLUMNS = 3;
/** Seconds per loop, per column: a little out of step so the wall never looks mechanical. */
const SPEEDS = [70, 88, 76];

/**
 * Room II: the feed is endless, and it's art. Until the phone recordings
 * arrive (step 2), the wall itself scrolls: three columns of works drifting
 * up and down. Each column holds its works twice so the loop is seamless;
 * the repeat is hidden from screen readers. It pauses on hover or focus and
 * stands still under reduced motion.
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
          {/* Chips on phones (brief §6, Slide II), a list on desktop. */}
          <ul className="reveal m-0 flex max-w-xl list-none flex-wrap gap-2 p-0 max-lg:order-2 lg:grid" style={stagger(4)}>
            {t.gestures.map((g) => (
              <li key={g.action} className="placard px-3 py-2 text-[13px] text-canvas-muted lg:px-4 lg:py-3 lg:text-[15px]">
                <span className="font-medium text-canvas">{g.action}:</span> {g.result}
              </li>
            ))}
          </ul>
          <p className="fine reveal max-lg:order-2" style={stagger(5)}>
            {t.small}
          </p>
        </div>

        <section className="room-art reveal max-lg:order-1" style={stagger(2)} aria-label={t.wallLabel}>
          <div className="wall" tabIndex={0}>
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
        </section>
      </div>
    </Slide>
  );
}
