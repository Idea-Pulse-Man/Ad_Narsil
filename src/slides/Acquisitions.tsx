import { ArtPicture } from "@/components/ArtPicture";
import { Slide, SlideHeading, stagger, type SlideProps } from "@/components/Slide";
import { InlineCta } from "@/components/StoreCta";
import { artworksWithRole, shortTitle } from "@/content/art";
import { COPY } from "@/content/copy";

/**
 * Room VII: works you can order, hung salon-style as unframed canvases (no
 * frames or mats: they aren't sold). The true-scale wall preview is step 3.
 */
export function Acquisitions({ index }: SlideProps) {
  const t = COPY.acquisitions;
  const prints = artworksWithRole("print");
  return (
    <Slide id="acquisitions" index={index}>
      <div className="slide-inner room-grid">
        <div className="room-copy grid gap-8">
          <SlideHeading id="acquisitions" index={index} title={t.title} sub={t.sub} />
          <div className="reveal grid justify-items-start gap-3" style={stagger(3)}>
            <InlineCta placement="prints" label={t.cta} />
            <p className="fine max-w-xl">{t.small}</p>
          </div>
        </div>
        <section className="room-art print-wall reveal" style={stagger(2)} aria-label={t.wallLabel}>
          {prints.map((w) => (
            <figure key={w.slug} className="print">
              <div className="print-canvas" style={{ aspectRatio: `${w.image.width} / ${w.image.height}`, backgroundImage: `url(${w.image.placeholder})` }}>
                <ArtPicture work={w} sizes="(min-width: 1024px) 220px, 45vw" className="block h-full w-full" />
              </div>
              <figcaption className="art-caption">
                <i>{shortTitle(w)}</i> · {w.artist}
                <span className="block text-accent">{t.formats}</span>
              </figcaption>
            </figure>
          ))}
        </section>
      </div>
    </Slide>
  );
}
