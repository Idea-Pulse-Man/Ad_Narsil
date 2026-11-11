import { Slide, SlideHeading, stagger, type SlideProps } from "@/components/Slide";
import { InlineCta } from "@/components/StoreCta";
import { COPY } from "@/content/copy";

/*
 * Rooms II–VIII with their real headlines and copy. The demos (phone
 * recordings, quiz, era track, ladder, print preview, comparison table) are
 * added in steps 2 and 3 and will each move to their own file.
 */

export function Gallery({ index }: SlideProps) {
  const t = COPY.gallery;
  return (
    <Slide id="gallery" index={index}>
      <div className="slide-inner grid gap-8">
        <SlideHeading id="gallery" index={index} title={t.title} sub={t.sub} />
        <p className="reveal m-0 font-serif text-xl italic text-gilt-light" style={stagger(3)}>
          {t.kicker}
        </p>
        <ul className="reveal m-0 grid max-w-xl list-none gap-2 p-0" style={stagger(4)}>
          {t.gestures.map((g) => (
            <li key={g.action} className="placard px-4 py-3 text-[15px] text-canvas-muted">
              <span className="font-medium text-canvas">{g.action}:</span> {g.result}
            </li>
          ))}
        </ul>
        <p className="fine reveal" style={stagger(5)}>
          {t.small}
        </p>
      </div>
    </Slide>
  );
}

export function Placard({ index }: SlideProps) {
  const t = COPY.placard;
  return (
    <Slide id="placard" index={index}>
      <div className="slide-inner grid gap-8">
        <SlideHeading id="placard" index={index} title={t.title} sub={t.sub} />
        <p className="fine reveal max-w-xl" style={stagger(3)}>
          {t.source}
        </p>
      </div>
    </Slide>
  );
}

export function Ages({ index }: SlideProps) {
  const t = COPY.ages;
  return (
    <Slide id="ages" index={index}>
      <div className="slide-inner grid gap-8">
        <SlideHeading id="ages" index={index} title={t.title} sub={t.sub} />
        <p className="fine reveal max-w-xl" style={stagger(3)}>
          {t.small}
        </p>
      </div>
    </Slide>
  );
}

export function Assessment({ index }: SlideProps) {
  const t = COPY.assessment;
  return (
    <Slide id="assessment" index={index}>
      <div className="slide-inner grid gap-8">
        <SlideHeading id="assessment" index={index} title={t.title} sub={t.sub} />
      </div>
    </Slide>
  );
}

export function Ladder({ index }: SlideProps) {
  const t = COPY.ladder;
  return (
    <Slide id="ladder" index={index}>
      <div className="slide-inner grid gap-8">
        <SlideHeading id="ladder" index={index} title={t.title} sub={t.sub} />
        <p className="fine reveal max-w-xl" style={stagger(3)}>
          {t.small}
        </p>
      </div>
    </Slide>
  );
}

export function Acquisitions({ index }: SlideProps) {
  const t = COPY.acquisitions;
  return (
    <Slide id="acquisitions" index={index}>
      <div className="slide-inner grid gap-8">
        <SlideHeading id="acquisitions" index={index} title={t.title} sub={t.sub} />
        <div className="reveal grid justify-items-start gap-3" style={stagger(3)}>
          <InlineCta placement="prints" label={t.cta} />
          <p className="fine max-w-xl">{t.small}</p>
        </div>
      </div>
    </Slide>
  );
}

export function Guild({ index }: SlideProps) {
  const t = COPY.guild;
  return (
    <Slide id="guild" index={index}>
      <div className="slide-inner grid gap-8">
        <SlideHeading id="guild" index={index} title={t.title} sub={t.sub} />
        <div className="reveal grid justify-items-start gap-3" style={stagger(3)}>
          <InlineCta placement="guild" label={t.cta} />
          <p className="fine max-w-xl">{t.small}</p>
        </div>
      </div>
    </Slide>
  );
}
