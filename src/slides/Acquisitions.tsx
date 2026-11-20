import { Slide, SlideHeading, stagger, type SlideProps } from "@/components/Slide";
import { InlineCta } from "@/components/StoreCta";
import { artwork } from "@/content/art";
import { COPY } from "@/content/copy";
import { PRINT_SIZES } from "@/content/prices";
import { PrintPreview } from "./PrintPreview";

/**
 * Room VII: make people want a print, then send them to the app to buy it
 * (brief §6, Slide VII), with the true-scale wall preview.
 */
export function Acquisitions({ index }: SlideProps) {
  const t = COPY.acquisitions;
  return (
    <Slide id="acquisitions" index={index}>
      <div className="slide-inner room-grid">
        <div className="room-copy grid gap-8">
          <SlideHeading id="acquisitions" index={index} title={t.title} sub={t.sub} />
          <p className="fine reveal max-w-xl" style={stagger(3)}>
            {t.small}
          </p>
        </div>
        <section className="room-art reveal" style={stagger(2)} aria-label={t.label}>
          <PrintPreview works={t.preview.map(artwork)} sizes={PRINT_SIZES} cta={<InlineCta placement="prints" label={t.cta} />} />
        </section>
      </div>
    </Slide>
  );
}
