import { Crest } from "@/components/Crest";
import { Rich } from "@/components/Rich";
import { Slide, stagger, type SlideProps } from "@/components/Slide";
import { StoreCta } from "@/components/StoreCta";
import { COPY, roomEyebrow } from "@/content/copy";

/** Room IX: the final, easy yes (brief §6, Slide IX). */
export function Doors({ index }: SlideProps) {
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
    </Slide>
  );
}
