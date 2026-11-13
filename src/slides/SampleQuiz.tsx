"use client";

import { useRef, useState, type ReactNode } from "react";
import { ArtPicture } from "@/components/ArtPicture";
import { shortTitle, type Artwork } from "@/content/art-utils";
import { COPY, ROMAN } from "@/content/copy";
import { track } from "@/lib/analytics";

/** `cta` is rendered on the server: the store badge reads its SVG from disk. */
type Props = { who: Artwork; older: [Artwork, Artwork]; cta: ReactNode };

const TOTAL = 2;

/**
 * Two sample questions in the app's styles: "Who made this?" and "Which is
 * older?". Captions stay hidden until the answer, since they'd give it away.
 * The full five-question Assessment with its verdict arrives in step 2.
 */
export function SampleQuiz({ who, older, cta }: Props) {
  const t = COPY.assessment.sample;
  const [step, setStep] = useState(0);
  const [picked, setPicked] = useState<number | null>(null);
  const [score, setScore] = useState(0);
  const [announce, setAnnounce] = useState("");
  const heading = useRef<HTMLHeadingElement>(null);
  const done = step === TOTAL;
  const answer = step === 0 ? t.who.answer : t.older.answer;

  const choose = (i: number) => {
    if (picked !== null) return;
    const correct = i === answer;
    setPicked(i);
    if (correct) setScore((s) => s + 1);
    setAnnounce(`${correct ? t.right : t.wrong} ${step === 0 ? t.who.fact : t.older.fact}`);
    track("quiz_answer", { index: step, correct, sample: true });
  };

  const next = () => {
    setPicked(null);
    setAnnounce("");
    setStep((s) => s + 1);
    requestAnimationFrame(() => heading.current?.focus());
  };

  const restart = () => {
    setStep(0);
    setPicked(null);
    setScore(0);
    setAnnounce("");
    requestAnimationFrame(() => heading.current?.focus());
  };

  const state = (i: number) => (picked === null ? undefined : i === answer ? "right" : i === picked ? "wrong" : "idle");
  const mark = (i: number) => (picked === null ? null : i === answer ? " ✓" : i === picked ? " ✗" : null);

  return (
    <div className="quiz-card placard" data-native-keys>
      <div className="flex items-baseline justify-between gap-4">
        <p className="eyebrow">{t.label}</p>
        <p className="fine tabular m-0 font-serif">{done ? t.score(score, TOTAL) : `${ROMAN[step]} / ${ROMAN[TOTAL - 1]}`}</p>
      </div>

      {step === 0 && (
        <div className="mt-5 grid gap-4">
          <div className="gilt-frame quiz-box" style={{ backgroundImage: `url(${who.image.placeholder})` }}>
            <ArtPicture work={who} sizes="(min-width: 1024px) 560px, 88vw" className="h-full w-full object-contain" />
          </div>
          <h3 ref={heading} tabIndex={-1} className="m-0 font-serif text-2xl font-medium text-canvas">
            {t.who.prompt}
          </h3>
          <div className="grid grid-cols-2 gap-2">
            {t.who.options.map((name, i) => (
              <button key={name} type="button" className="quiz-option" data-state={state(i)} aria-disabled={picked !== null} onClick={() => choose(i)}>
                {name}
                {mark(i)}
              </button>
            ))}
          </div>
          {picked !== null && (
            <p className="fine m-0">
              <i className="font-serif text-canvas-muted">{who.title}</i> · {who.artist}, {who.date}. {t.who.fact}
            </p>
          )}
        </div>
      )}

      {step === 1 && (
        <div className="mt-5 grid gap-4">
          <h3 ref={heading} tabIndex={-1} className="m-0 font-serif text-2xl font-medium text-canvas">
            {t.older.prompt}
          </h3>
          <div className="grid grid-cols-2 gap-3">
            {older.map((w, i) => (
              <button
                key={w.slug}
                type="button"
                className="quiz-pick"
                data-state={state(i)}
                aria-disabled={picked !== null}
                aria-label={picked === null ? `${i === 0 ? "Left" : "Right"} work: ${w.alt.split(":")[1]?.trim() ?? ""}` : `${w.title}, ${w.date}`}
                onClick={() => choose(i)}
              >
                <span className="gilt-frame quiz-box quiz-box-square" style={{ backgroundImage: `url(${w.image.placeholder})` }}>
                  <ArtPicture work={w} sizes="(min-width: 1024px) 270px, 42vw" className="h-full w-full object-contain" decorative />
                </span>
                {picked !== null && (
                  <span className="fine block text-left">
                    <i className="font-serif text-canvas-muted">{shortTitle(w)}</i>
                    {mark(i)}
                    <br />
                    {w.artist}, {w.date}
                  </span>
                )}
              </button>
            ))}
          </div>
          {picked !== null && <p className="fine m-0">{t.older.fact}</p>}
        </div>
      )}

      {done && (
        <div className="mt-6 grid justify-items-start gap-4">
          <h3 ref={heading} tabIndex={-1} className="m-0 font-serif text-3xl font-medium text-gilt-light">
            {t.doneTitle}
          </h3>
          <p className="m-0 text-[15px] text-canvas-muted">{t.doneSub}</p>
          {cta}
          <button type="button" className="link-gold text-sm" onClick={restart}>
            {t.again}
          </button>
        </div>
      )}

      {picked !== null && !done && (
        <div className="mt-5 flex items-center justify-between gap-3">
          <p className="m-0 font-serif text-lg text-gilt-light">{picked === answer ? t.right : t.wrong}</p>
          <button type="button" className="btn-gold" onClick={next}>
            {step === TOTAL - 1 ? t.finish : t.next}
          </button>
        </div>
      )}

      <p className="sr-only" aria-live="polite">
        {announce}
      </p>
    </div>
  );
}
