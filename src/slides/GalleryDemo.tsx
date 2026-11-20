"use client";

import { useEffect, useRef, useState, useSyncExternalStore, type ReactNode } from "react";
import { CLIPS, GESTURE_CLIPS } from "@/content/clips";
import { COPY } from "@/content/copy";
import { track } from "@/lib/analytics";

const HOLD_MS = 500;
const ADVANCE_MS = 4000;

/* Room II's shared state: which gesture is showing, and whether "clean view" is on. */
type DemoState = { active: number; clean: boolean };
let state: DemoState = { active: 0, clean: false };
const listeners = new Set<() => void>();
const store = {
  set(patch: Partial<DemoState>) {
    state = { ...state, ...patch };
    listeners.forEach((l) => l());
  },
  subscribe(l: () => void) {
    listeners.add(l);
    return () => void listeners.delete(l);
  },
};
const initial: DemoState = { active: 0, clean: false };
const useDemo = () => useSyncExternalStore(store.subscribe, () => state, () => initial);

const reducedMotion = () => window.matchMedia("(prefers-reduced-motion: reduce)").matches;

/** Save-Data, a 2G connection or reduced motion: show posters with a play button, never autoplay (brief §12). */
function lowData(): boolean {
  const c = (navigator as Navigator & { connection?: { saveData?: boolean; effectiveType?: string } }).connection;
  return Boolean(c?.saveData || /2g/.test(c?.effectiveType ?? "") || reducedMotion());
}

/**
 * The five gestures. With the recordings in place (CLIPS.ready) they advance
 * every 4 s in step with the clips, and tapping, hovering or focusing one
 * plays its clip. Without them they're a plain list (nothing pretends to play).
 */
export function GestureList() {
  const t = COPY.gallery;
  const { active } = useDemo();
  const list = useRef<HTMLUListElement>(null);
  const [hovering, setHovering] = useState(false);

  useEffect(() => {
    if (!CLIPS.ready || reducedMotion() || hovering) return;
    let onScreen = false;
    const io = new IntersectionObserver(([e]) => (onScreen = e.isIntersecting), { threshold: 0.5 });
    if (list.current) io.observe(list.current);
    const timer = setInterval(() => {
      if (onScreen && !document.hidden) store.set({ active: (state.active + 1) % t.gestures.length });
    }, ADVANCE_MS);
    return () => {
      clearInterval(timer);
      io.disconnect();
    };
  }, [hovering, t.gestures.length]);

  const play = (i: number) => {
    if (!CLIPS.ready || i === state.active) return;
    store.set({ active: i });
    track("gesture_demo", { gesture: GESTURE_CLIPS[i] });
  };

  return (
    <ul
      ref={list}
      className="gestures reveal m-0 flex max-w-xl list-none flex-wrap gap-2 p-0 max-lg:order-2 lg:grid"
      aria-label={t.gesturesLabel}
      onMouseEnter={() => setHovering(true)}
      onMouseLeave={() => setHovering(false)}
    >
      {t.gestures.map((g, i) => {
        const body = (
          <>
            <span className="font-medium text-canvas">{g.action}:</span> {g.result}
          </>
        );
        return (
          <li key={g.action} className="gesture placard" data-active={CLIPS.ready && i === active ? "true" : undefined}>
            {CLIPS.ready ? (
              <button type="button" className="gesture-btn" aria-pressed={i === active} onClick={() => play(i)} onMouseEnter={() => play(i)} onFocus={() => play(i)}>
                {body}
              </button>
            ) : (
              <span className="gesture-btn">{body}</span>
            )}
          </li>
        );
      })}
    </ul>
  );
}

/**
 * Press and hold for half a second to see only the art: the same gesture as
 * in the app. On the wall it hides frames and captions and stops the drift;
 * on the phone it plays the clean-view clip. Space does the same while the
 * stage has focus.
 */
export function HoldStage({ children, label }: { children: ReactNode; label: string }) {
  const { clean } = useDemo();
  const timer = useRef<number>(0);
  const reported = useRef(false);

  const start = () => {
    window.clearTimeout(timer.current);
    timer.current = window.setTimeout(() => {
      store.set({ clean: true });
      if (!reported.current) {
        reported.current = true;
        track("gesture_demo", { gesture: "clean" });
      }
    }, HOLD_MS);
  };
  const stop = () => {
    window.clearTimeout(timer.current);
    if (state.clean) store.set({ clean: false });
  };

  useEffect(() => () => window.clearTimeout(timer.current), []);

  return (
    <div
      className="hold-stage"
      data-clean={clean}
      data-native-keys
      tabIndex={0}
      aria-label={label}
      aria-describedby="hold-help"
      onPointerDown={(e) => {
        if (e.button === 0) start();
      }}
      onPointerUp={stop}
      onPointerLeave={stop}
      onPointerCancel={stop}
      onContextMenu={(e) => e.preventDefault()}
      onKeyDown={(e) => {
        if (e.key === " ") {
          e.preventDefault();
          if (!e.repeat) start();
        }
      }}
      onKeyUp={(e) => {
        if (e.key === " ") stop();
      }}
      onBlur={stop}
    >
      {children}
      <p className="hold-hint" aria-hidden="true">
        <span className="hold-dot" />
        {COPY.gallery.hold}
      </p>
      <p id="hold-help" className="sr-only">
        {COPY.gallery.holdHelp}
      </p>
    </div>
  );
}

/**
 * The real app, recorded, in Apple's bezel (only when CLIPS.ready). Plays
 * while at least half on screen, pauses otherwise; low-data visitors get the
 * poster and a play button. Decorative: the text beside it says what it shows.
 */
export function PhoneDemo() {
  const { active, clean } = useDemo();
  const video = useRef<HTMLVideoElement>(null);
  const [manual, setManual] = useState(false);
  const [allowed, setAllowed] = useState(false);
  const name = clean ? "clean" : GESTURE_CLIPS[active];
  const clip = CLIPS.clip(name);
  const { bezel } = CLIPS;

  useEffect(() => setAllowed(!lowData()), []);

  useEffect(() => {
    const v = video.current;
    if (!v || (!allowed && !manual)) return;
    const io = new IntersectionObserver(([e]) => (e.intersectionRatio >= 0.5 ? void v.play().catch(() => {}) : v.pause()), {
      threshold: [0, 0.5, 1],
    });
    io.observe(v);
    return () => io.disconnect();
  }, [allowed, manual, name]);

  return (
    <div className="phone" style={{ aspectRatio: `${bezel.width} / ${bezel.height}` }} aria-hidden="true">
      <div
        className="phone-screen"
        style={{
          left: `${bezel.screen.left}%`,
          top: `${bezel.screen.top}%`,
          width: `${bezel.screen.width}%`,
          height: `${bezel.screen.height}%`,
          borderRadius: bezel.screen.radius,
        }}
      >
        <video key={name} ref={video} muted playsInline loop preload="none" poster={clip.poster} tabIndex={-1}>
          <source src={clip.webm} type="video/webm" />
          <source src={clip.mp4} type="video/mp4" />
        </video>
        {!allowed && !manual && (
          <button type="button" className="phone-play" tabIndex={-1} onClick={() => setManual(true)}>
            <svg width="20" height="20" viewBox="0 0 14 14" fill="currentColor">
              <path d="M3 1.5v11l9-5.5z" />
            </svg>
          </button>
        )}
      </div>
      <img src={bezel.src} width={bezel.width} height={bezel.height} alt="" className="phone-bezel" loading="lazy" decoding="async" />
    </div>
  );
}
