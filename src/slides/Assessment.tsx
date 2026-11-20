import { Rich } from "@/components/Rich";
import { Slide, SlideHeading, stagger, type SlideProps } from "@/components/Slide";
import { InlineCta } from "@/components/StoreCta";
import { artwork } from "@/content/art";
import { COPY } from "@/content/copy";
import { QUIZ_BANK, QUIZ_LENGTH, quizSlugs } from "@/content/quiz";
import { RoyalAssessment, type ResolvedQuestion } from "./RoyalAssessment";

const bank = (): ResolvedQuestion[] => QUIZ_BANK.map((q) => ({ ...q, works: quizSlugs(q).map(artwork) }));

/**
 * Room V: the hook (brief §6, Slide V). Play five questions, get the court's
 * verdict, share it. On /quiz the Assessment is the hero itself (brief §8):
 * the variant's headline becomes the page's h1 and the quiz sits beside it.
 */
export function Assessment({ index, hero }: SlideProps & { hero?: { eyebrow: string; title: string; sub: string } }) {
  const t = COPY.assessment;
  const quiz = (
    <RoyalAssessment
      bank={bank()}
      length={QUIZ_LENGTH}
      level={hero ? 2 : 3}
      cta={<InlineCta placement="quiz_verdict" label={t.quiz.cta} />}
    />
  );

  if (hero) {
    return (
      <Slide id="assessment" index={index} className="spotlight" labelledBy="assessment-hero-title">
        <div className="slide-inner room-grid">
          <div className="room-copy grid gap-5">
            <p className="eyebrow">{hero.eyebrow}</p>
            <h1 id="assessment-hero-title" className="display-1 text-[clamp(2.4rem,1.3rem+4.6vw,5rem)]">
              <Rich text={hero.title} />
            </h1>
            <p className="lede">{hero.sub}</p>
            <p className="fine max-lg:hidden">{t.small}</p>
          </div>
          <div className="room-art quiz-stage">{quiz}</div>
        </div>
      </Slide>
    );
  }

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
          {quiz}
        </div>
      </div>
    </Slide>
  );
}
