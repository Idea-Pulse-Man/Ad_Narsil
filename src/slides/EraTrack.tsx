"use client";

import { useEffect, useRef, useState, type ReactNode } from "react";
import { COPY } from "@/content/copy";

/**
 * A native sideways carousel (scroll-snap) with previous/next buttons and a
 * "1 / 7" counter. The pinned, scroll-driven track on desktop is step 3; this
 * works everywhere today, with touch, trackpad, keyboard and buttons.
 */
export function EraTrack({ count, children }: { count: number; children: ReactNode }) {
  const t = COPY.ages;
  const track = useRef<HTMLOListElement>(null);
  const [current, setCurrent] = useState(0);

  useEffect(() => {
    const el = track.current;
    if (!el) return;
    const cards = [...el.children] as HTMLElement[];
    const io = new IntersectionObserver(
      (entries) => {
        for (const e of entries) if (e.isIntersecting) setCurrent(cards.indexOf(e.target as HTMLElement));
      },
      { root: el, threshold: 0.6 },
    );
    cards.forEach((c) => io.observe(c));
    return () => io.disconnect();
  }, []);

  const go = (dir: -1 | 1) => {
    const el = track.current;
    if (!el) return;
    const card = el.children[0] as HTMLElement | undefined;
    const step = card ? card.offsetWidth + parseFloat(getComputedStyle(el).columnGap || "0") : el.clientWidth;
    el.scrollBy({ left: dir * step, behavior: window.matchMedia("(prefers-reduced-motion: reduce)").matches ? "instant" : "smooth" });
  };

  return (
    <div className="grid gap-5">
      <ol ref={track} className="era-track" aria-label={t.trackLabel} tabIndex={0} data-native-keys>
        {children}
      </ol>
      <div className="flex items-center gap-3">
        <button type="button" className="era-btn" onClick={() => go(-1)} aria-label={t.prev} disabled={current === 0}>
          <svg width="16" height="16" viewBox="0 0 16 16" aria-hidden="true">
            <path d="M10 3L5 8l5 5" fill="none" stroke="currentColor" strokeWidth="1.5" />
          </svg>
        </button>
        <button type="button" className="era-btn" onClick={() => go(1)} aria-label={t.next} disabled={current === count - 1}>
          <svg width="16" height="16" viewBox="0 0 16 16" aria-hidden="true">
            <path d="M6 3l5 5-5 5" fill="none" stroke="currentColor" strokeWidth="1.5" />
          </svg>
        </button>
        <p className="fine tabular m-0 font-serif text-sm" aria-hidden="true">
          {current + 1} / {count}
        </p>
      </div>
    </div>
  );
}
