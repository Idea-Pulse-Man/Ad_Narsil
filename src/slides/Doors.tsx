import { Crest } from "@/components/Crest";
import { Framed } from "@/components/Framed";
import { Rich } from "@/components/Rich";
import { Slide, stagger, type SlideProps } from "@/components/Slide";
import { StoreCta } from "@/components/StoreCta";
import { ARTWORKS } from "@/content/art";
import { COPY, roomEyebrow } from "@/content/copy";

/** One work from each corner of the collection, for the ribbon under the doors. */
const RIBBON = [
  "night-watch",
  "hokusai-south-wind",
  "akotantos-icon",
  "van-gogh-plane-trees",
  "fayum-portrait-woman",
  "turner-burning-parliament",
  "woman-reading-letter",
  "shah-jahan",
  "church-twilight",
  "bronzino-woman",
  "fish-plate",
  "manet-morisot",
];

/** Room IX: the final, easy yes (brief §6, Slide IX), with the collection glimpsed through the doors. */
export function Doors({ index }: SlideProps) {
  const ribbon = RIBBON.map((slug) => ARTWORKS.find((w) => w.slug === slug)!);
  return (
    <Slide id="doors" index={index} className="doors spotlight">
      <div className="slide-inner grid justify-items-center gap-4 text-center lg:gap-6">
        <Crest size={168} className="doors-crest crest-glow crest-breathe reveal" />
        <p className="eyebrow eyebrow-center reveal" style={stagger(1)}>
          {roomEyebrow(index, "doors")}
        </p>
        <h2 id="doors-title" className="display-2 reveal" style={stagger(2)}>
          <Rich text={COPY.doors.title} />
        </h2>
        <p className="lede reveal" style={stagger(3)}>
          {COPY.doors.sub}
        </p>
        <div className="cta-frame reveal mt-2 w-full max-w-xl" style={stagger(4)} data-cta-anchor="doors">
          <StoreCta placement="doors" qr align="center" />
          <p className="fine mt-3">{COPY.doors.note}</p>
        </div>
      </div>
      <section className="ribbon reveal" style={stagger(5)} aria-label={COPY.doors.ribbonLabel}>
        <div className="ribbon-track">
          {[0, 1].map((copy) =>
            ribbon.map((w) => <Framed key={`${copy}-${w.slug}`} work={w} sizes="200px" decorative={copy === 1} className="ribbon-tile" />),
          )}
        </div>
      </section>
    </Slide>
  );
}
