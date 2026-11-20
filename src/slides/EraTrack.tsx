"use client";

import { useEffect, useRef, useState, type ReactNode } from "react";
import { COPY } from "@/content/copy";
import { track } from "@/lib/analytics";

const PIN_QUERY = "(min-width: 1024px) and (prefers-reduced-motion: no-preference)";

/**
 * Room IV's era track (brief §6, Slide IV).
 *
 * Phones, tablets and reduced motion: a native sideways carousel (scroll-snap)
 * with the next card peeking in, previous/next buttons and a "1 / 7" counter.
 *
 * Desktop: a pinned track. The room grows taller by exactly the track's
 * overflow, its content sticks to the top of the screen, and scrolling down
 * moves the cards sideways. The track is driven through scrollLeft, so the
 * counter, the buttons and keyboard focus keep working the same way.
 */
export function EraTrack({ ids, note, children }: { ids: string[]; note?: ReactNode; children: ReactNode }) {
  const t = COPY.ages;
  const count = ids.length;
  const track_ = useRef<HTMLOListElement>(null);
  const [current, setCurrent] = useState(0);
  const pinned = useRef(false);

  // Which card is in view: the counter, and era_view once per era.
  useEffect(() => {
    const el = track_.current;
    if (!el) return;
    const seen = new Set<number>();
    const cards = [...el.children] as HTMLElement[];
    const io = new IntersectionObserver(
      (entries) => {
        for (const e of entries) {
          if (!e.isIntersecting) continue;
          const i = cards.indexOf(e.target as HTMLElement);
          setCurrent(i);
          if (!seen.has(i)) {
            seen.add(i);
            track("era_view", { era: ids[i] });
          }
        }
      },
      { root: el, threshold: 0.6 },
    );
    cards.forEach((c) => io.observe(c));
    return () => io.disconnect();
  }, [ids]);

  // The pinned track on desktop.
  useEffect(() => {
    const el = track_.current;
    const room = el?.closest<HTMLElement>(".slide");
    if (!el || !room) return;
    const mq = window.matchMedia(PIN_QUERY);
    let extra = 0;
    let frame = 0;

    const paint = () => {
      frame = 0;
      if (!pinned.current) return;
      const progress = Math.min(1, Math.max(0, (window.scrollY - room.offsetTop) / Math.max(1, extra)));
      el.scrollLeft = progress * extra;
    };
    const onScroll = () => {
      if (!frame) frame = requestAnimationFrame(paint);
    };
    const measure = () => {
      pinned.current = mq.matches;
      room.classList.toggle("is-pinned", pinned.current);
      if (!pinned.current) {
        room.style.removeProperty("--pin-extra");
        return;
      }
      extra = Math.max(0, el.scrollWidth - el.clientWidth);
      room.style.setProperty("--pin-extra", `${extra}px`);
      paint();
    };

    measure();
    mq.addEventListener("change", measure);
    window.addEventListener("resize", measure, { passive: true });
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => {
      cancelAnimationFrame(frame);
      mq.removeEventListener("change", measure);
      window.removeEventListener("resize", measure);
      window.removeEventListener("scroll", onScroll);
      room.classList.remove("is-pinned");
      room.style.removeProperty("--pin-extra");
    };
  }, []);

  const go = (dir: -1 | 1) => {
    const el = track_.current;
    if (!el) return;
    const card = el.children[0] as HTMLElement | undefined;
    const step = card ? card.offsetWidth + parseFloat(getComputedStyle(el).columnGap || "0") : el.clientWidth;
    const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    const room = el.closest<HTMLElement>(".slide");
    if (pinned.current && room) {
      // Pinned: the page's scroll drives the track, so move the page.
      const extra = Math.max(1, el.scrollWidth - el.clientWidth);
      const target = Math.min(extra, Math.max(0, el.scrollLeft + dir * step));
      window.scrollTo({ top: room.offsetTop + target, behavior: reduced ? "instant" : "smooth" });
      return;
    }
    el.scrollBy({ left: dir * step, behavior: reduced ? "instant" : "smooth" });
  };

  return (
    <div className="grid gap-5">
      <ol ref={track_} className="era-track" aria-label={t.trackLabel} tabIndex={0} data-native-keys>
        {children}
      </ol>
      <div className="flex flex-wrap items-center gap-3">
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
        {note && <div className="basis-full lg:ml-auto lg:basis-auto">{note}</div>}
      </div>
    </div>
  );
}
