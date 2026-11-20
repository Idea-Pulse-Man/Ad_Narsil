"use client";

import { useEffect, useRef, useState, type ReactNode } from "react";
import { ArtPicture } from "@/components/ArtPicture";
import { Seal } from "@/components/Seal";
import { shortTitle, type Artwork } from "@/content/art-utils";
import { COPY, ROMAN } from "@/content/copy";
import type { QuizQuestion } from "@/content/quiz";
import { verdictFor, verdictShareText, verdictShareUrl, type Verdict } from "@/content/verdicts";
import { track } from "@/lib/analytics";

export type ResolvedQuestion = QuizQuestion & { works: Artwork[] };

type Props = {
  bank: ResolvedQuestion[];
  length: number;
  /** Rendered on the server: the store CTA for "Play today's Assessment in the app". */
  cta: ReactNode;
  /** h3 inside a room; h2 when the quiz is the /quiz hero (its h1 sits above). */
  level?: 2 | 3;
};

type Saved = { slug: string; score: number; total: number };
const KEY = "narsil:verdict";

function load(): Saved | null {
  try {
    const raw = sessionStorage.getItem(KEY);
    return raw ? (JSON.parse(raw) as Saved) : null;
  } catch {
    return null;
  }
}

function save(v: Saved | null) {
  try {
    if (v) sessionStorage.setItem(KEY, JSON.stringify(v));
    else sessionStorage.removeItem(KEY);
  } catch {
    // Storage blocked: the verdict just won't survive a refresh.
  }
}

/** Fisher–Yates on a copy; the draw happens on Begin, in the browser, so the server render never disagrees. */
function draw<T>(items: T[], n: number): T[] {
  const a = [...items];
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a.slice(0, n);
}

/** The visible description without the title and artist, which would give the answer away. */
const neutralAlt = (w: Artwork) => `The artwork: ${w.alt.split(":").slice(1).join(":").trim()}`;

/**
 * Room V: a five-question Royal Assessment drawn from the bank (brief §6,
 * Slide V). No timer. After each answer the right option turns gold with ✓,
 * a wrong pick oxblood with ✗, then the caption and a fact appear. The
 * verdict uses the app's formula, stamps a wax seal, and can be shared.
 * Works with the keyboard alone; results are announced politely.
 */
export function RoyalAssessment({ bank, length, cta, level = 3 }: Props) {
  const t = COPY.assessment.quiz;
  const [phase, setPhase] = useState<"start" | "play" | "verdict">("start");
  const [questions, setQuestions] = useState<ResolvedQuestion[]>([]);
  const [step, setStep] = useState(0);
  const [picked, setPicked] = useState<number | null>(null);
  const [score, setScore] = useState(0);
  const [result, setResult] = useState<Saved | null>(null);
  const [announce, setAnnounce] = useState("");
  const [shareNote, setShareNote] = useState("");
  const heading = useRef<HTMLHeadingElement>(null);
  const nextBtn = useRef<HTMLButtonElement>(null);
  const H = `h${level}` as "h2" | "h3";

  // A refresh keeps the last verdict (brief §6, Slide V).
  useEffect(() => {
    const saved = load();
    if (saved) {
      setResult(saved);
      setPhase("verdict");
    }
  }, []);

  const focusHeading = () => requestAnimationFrame(() => heading.current?.focus({ preventScroll: true }));

  const begin = () => {
    setQuestions(draw(bank, length));
    setStep(0);
    setPicked(null);
    setScore(0);
    setAnnounce("");
    setShareNote("");
    setResult(null);
    save(null);
    setPhase("play");
    track("quiz_start");
    focusHeading();
  };

  const q = questions[step];
  const answerIndex = !q ? -1 : q.style === "truefalse" ? (q.answer ? 0 : 1) : q.answer;

  const choose = (i: number) => {
    if (picked !== null || !q) return;
    const correct = i === answerIndex;
    setPicked(i);
    if (correct) setScore((s) => s + 1);
    setAnnounce(`${correct ? t.right : t.wrong} ${q.fact}`);
    track("quiz_answer", { index: step, correct });
    requestAnimationFrame(() => nextBtn.current?.focus({ preventScroll: true }));
  };

  const next = () => {
    if (step < questions.length - 1) {
      setPicked(null);
      setAnnounce("");
      setStep((s) => s + 1);
      focusHeading();
      return;
    }
    const v = verdictFor(score, questions.length);
    const saved = { slug: v.slug, score, total: questions.length };
    save(saved);
    setResult(saved);
    setPhase("verdict");
    setAnnounce("");
    track("quiz_complete", { score, verdict: v.slug });
    focusHeading();
  };

  const state = (i: number) => (picked === null ? undefined : i === answerIndex ? "right" : i === picked ? "wrong" : "idle");
  const mark = (i: number) => (picked === null ? null : i === answerIndex ? " ✓" : i === picked ? " ✗" : null);
  const sr = (i: number) => (picked === null ? null : <span className="sr-only">{i === answerIndex ? `, ${t.rightAnswer}` : i === picked ? `, ${t.yourPick}` : ""}</span>);

  const caption = (w: Artwork) => (
    <>
      <i className="font-serif text-canvas-muted">{shortTitle(w)}</i> · {w.artist}, {w.date}
    </>
  );

  const verdict: Verdict | null = result ? verdictFor(result.score, result.total) : null;

  const share = async () => {
    if (!verdict) return;
    const url = verdictShareUrl(window.location.origin, verdict.slug);
    const text = verdictShareText(verdict);
    try {
      if (navigator.share) {
        await navigator.share({ title: `${verdict.title} · Narsil`, text, url });
        track("quiz_share", { method: "native", verdict: verdict.slug });
        return;
      }
      await navigator.clipboard.writeText(`${text} ${url}`);
      setShareNote(t.copied);
      track("quiz_share", { method: "copy", verdict: verdict.slug });
    } catch (err) {
      if ((err as Error)?.name === "AbortError") return; // closed the share sheet
      setShareNote(t.copyFailed);
    }
  };

  return (
    <div className="quiz-card placard" data-native-keys>
      <div className="flex items-baseline justify-between gap-4">
        <p className="eyebrow">{t.label}</p>
        {phase === "play" && (
          <p className="fine tabular m-0 font-serif" aria-label={t.progress(step + 1, questions.length)}>
            {ROMAN[step]} / {ROMAN[questions.length - 1]}
          </p>
        )}
        {phase === "verdict" && result && (
          <p className="fine tabular m-0 font-serif">{t.score(result.score, result.total)}</p>
        )}
      </div>

      {phase === "start" && (
        <div className="quiz-start mt-6 grid justify-items-start gap-4">
          <Seal size={72} className="opacity-90" />
          <H ref={heading} tabIndex={-1} className="m-0 font-serif text-2xl font-medium text-canvas lg:text-3xl">
            {t.startTitle}
          </H>
          <p className="m-0 text-[15px] text-canvas-muted">{t.startNote}</p>
          <button type="button" className="btn-gold" onClick={begin}>
            {t.begin}
          </button>
        </div>
      )}

      {phase === "play" && q && (
        <div className="mt-5 grid gap-4" key={step}>
          {q.style !== "older" && (
            <div className="gilt-frame quiz-box" style={{ backgroundImage: `url(${q.works[0].image.placeholder})` }}>
              <ArtPicture
                work={{ ...q.works[0], alt: picked === null ? neutralAlt(q.works[0]) : q.works[0].alt }}
                sizes="(min-width: 1024px) 560px, 88vw"
                className="h-full w-full object-contain"
              />
            </div>
          )}

          <H ref={heading} tabIndex={-1} className="m-0 font-serif text-2xl font-medium text-canvas">
            {q.prompt}
          </H>
          {q.style === "truefalse" && <p className="m-0 -mt-2 font-serif text-lg text-canvas-muted italic">{q.statement}</p>}

          {q.style === "who" && (
            <div className="grid grid-cols-2 gap-2">
              {q.options.map((name, i) => (
                <button key={name} type="button" className="quiz-option" data-state={state(i)} aria-disabled={picked !== null} onClick={() => choose(i)}>
                  {name}
                  {mark(i)}
                  {sr(i)}
                </button>
              ))}
            </div>
          )}

          {q.style === "truefalse" && (
            <div className="grid grid-cols-2 gap-2">
              {[t.true, t.false].map((label, i) => (
                <button key={label} type="button" className="quiz-option" data-state={state(i)} aria-disabled={picked !== null} onClick={() => choose(i)}>
                  {label}
                  {mark(i)}
                  {sr(i)}
                </button>
              ))}
            </div>
          )}

          {q.style === "older" && (
            <div className="grid grid-cols-2 gap-3">
              {q.works.map((w, i) => (
                <button
                  key={w.slug}
                  type="button"
                  className="quiz-pick"
                  data-state={state(i)}
                  aria-disabled={picked !== null}
                  aria-label={picked === null ? `${i === 0 ? t.left : t.right_} ${neutralAlt(w)}` : `${w.title}, ${w.date}${i === answerIndex ? `, ${t.rightAnswer}` : i === picked ? `, ${t.yourPick}` : ""}`}
                  onClick={() => choose(i)}
                >
                  <span className="gilt-frame quiz-box quiz-box-square" style={{ backgroundImage: `url(${w.image.placeholder})` }}>
                    <ArtPicture work={w} sizes="(min-width: 1024px) 270px, 42vw" className="h-full w-full object-contain" decorative />
                  </span>
                  {picked !== null && (
                    <span className="fine block text-left">
                      <i className="font-serif text-canvas-muted">{w.title.split(/, \d/)[0].split(/ \(|: |, from /)[0]}</i>, {w.date}
                      {mark(i)}
                    </span>
                  )}
                </button>
              ))}
            </div>
          )}

          {picked !== null && (
            <p className="fine m-0">
              {q.style !== "older" && <>{caption(q.works[0])}. </>}
              {q.fact}
            </p>
          )}

          {picked !== null && (
            <div className="flex items-center justify-between gap-3">
              <p className="m-0 font-serif text-lg text-gilt-light" aria-hidden="true">
                {picked === answerIndex ? t.right : t.wrong}
              </p>
              <button ref={nextBtn} type="button" className="btn-gold" onClick={next}>
                {step === questions.length - 1 ? t.finish : t.next}
              </button>
            </div>
          )}
        </div>
      )}

      {phase === "verdict" && verdict && result && (
        <div className="mt-6 grid justify-items-center gap-4 text-center">
          <Seal size={132} className="seal-stamp" />
          <p className="eyebrow eyebrow-center m-0">{t.spoken}</p>
          <H ref={heading} tabIndex={-1} className="m-0 font-serif text-3xl font-semibold text-gilt-light lg:text-4xl">
            {verdict.title}
          </H>
          <p className="m-0 max-w-md text-[15px] leading-relaxed text-canvas-muted">{verdict.message}</p>
          <div className="mt-2 flex flex-wrap items-center justify-center gap-3">
            <button type="button" className="btn-outline" onClick={share}>
              {t.share}
            </button>
            {cta}
          </div>
          <p className="fine m-0 min-h-5" role="status">
            {shareNote}
          </p>
          <button type="button" className="link-gold -mt-2 min-h-11 text-sm" onClick={begin}>
            {t.again}
          </button>
        </div>
      )}

      <p className="sr-only" aria-live="polite">
        {announce}
      </p>
    </div>
  );
}
