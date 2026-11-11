import { Slide, SlideHeading, stagger, type SlideProps } from "@/components/Slide";
import { InlineCta } from "@/components/StoreCta";
import { artwork } from "@/content/art";
import { COPY } from "@/content/copy";
import { SampleQuiz } from "./SampleQuiz";

/** Room V: the hook. Two sample questions now; the five-question Assessment and its verdict come in step 2. */
export function Assessment({ index }: SlideProps) {
  const t = COPY.assessment;
  const [a, b] = t.sample.older.slugs;
  return (
    <Slide id="assessment" index={index}>
      <div className="slide-inner room-grid">
        <div className="room-copy grid gap-8">
          <SlideHeading id="assessment" index={index} title={t.title} sub={t.sub} />
          <p className="fine reveal max-w-xl" style={stagger(3)}>
            {t.small}
          </p>
        </div>
        <div className="room-art quiz-stage reveal" style={stagger(2)}>
          <SampleQuiz
            who={artwork(t.sample.who.slug)}
            older={[artwork(a), artwork(b)]}
            cta={<InlineCta placement="quiz_verdict" label={t.sample.cta} />}
          />
        </div>
      </div>
    </Slide>
  );
}
