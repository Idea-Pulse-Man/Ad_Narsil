"use client";

import { useEffect } from "react";
import { track } from "@/lib/analytics";
import { exhibition } from "@/lib/exhibition-store";
import { captureUtm } from "@/lib/utm";

const SEEN_KEY = "narsil:slides-seen";
const THRESHOLDS = Array.from({ length: 21 }, (_, i) => i / 20);

/** Keys that move between slides (brief §5.3). */
const NEXT = new Set(["ArrowDown", "PageDown", " "]);
const PREV = new Set(["ArrowUp", "PageUp"]);

/** Where the slide keys must keep their usual meaning: the quiz, the print preview, form fields, the FAQ. */
const NATIVE_KEYS = "input, textarea, select, [contenteditable], details, #faq, [data-native-keys]";

function markSeen(id: string): boolean {
  try {
    const seen = new Set<string>(JSON.parse(sessionStorage.getItem(SEEN_KEY) ?? "[]"));
    if (seen.has(id)) return false;
    seen.add(id);
    sessionStorage.setItem(SEEN_KEY, JSON.stringify([...seen]));
  } catch {
    // Storage blocked: report every view rather than none.
  }
  return true;
}

/**
 * Drives the slide system: which room is active (rail, story bar, URL hash,
 * slide_view), entrance animations at 40% visible, CTA visibility for the
 * header and sticky bar, the story bar's fill, and the slide keys. Renders
 * nothing.
 */
export function ExhibitionController() {
  useEffect(() => {
    captureUtm();
    const root = document.documentElement;
    const slides = [...document.querySelectorAll<HTMLElement>("#exhibition > .slide")];
    const segments = [...document.querySelectorAll<HTMLElement>("[data-story-seg]")];
    const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (!slides.length) return;

    // A #hash opens its slide at once, without animation, and what's already
    // on screen never fades in.
    const target = window.location.hash ? document.getElementById(window.location.hash.slice(1)) : null;
    if (target && slides.includes(target)) target.scrollIntoView({ behavior: "instant", block: "start" });
    for (const s of slides) if (s.getBoundingClientRect().top < window.innerHeight) s.classList.add("is-in");
    if (!reduced) root.classList.add("reveal-ready");

    // Active slide: the one covering at least half the viewport.
    const share = new Map<Element, number>();
    let active = -1;
    const activate = (i: number) => {
      if (i === active) return;
      active = i;
      exhibition.set({ active: i });
      const id = slides[i].id;
      const url = i === 0 ? window.location.pathname + window.location.search : `#${id}`;
      window.history.replaceState(window.history.state, "", url);
      if (markSeen(id)) track("slide_view", { slide: id });
    };
    const slideObserver = new IntersectionObserver(
      (entries) => {
        for (const e of entries) {
          const vh = e.rootBounds?.height || window.innerHeight;
          const visible = e.intersectionRect.height / Math.min(vh, e.boundingClientRect.height || vh);
          share.set(e.target, visible);
          if (visible >= 0.4) e.target.classList.add("is-in");
        }
        let best = -1;
        let bestShare = 0.5;
        slides.forEach((s, i) => {
          const v = share.get(s) ?? 0;
          if (v >= bestShare) [best, bestShare] = [i, v];
        });
        if (best >= 0) activate(best);
      },
      { threshold: THRESHOLDS },
    );
    for (const s of slides) slideObserver.observe(s);

    // The hero's and the doors' own CTAs hide the sticky bar and header button.
    const ctaObserver = new IntersectionObserver((entries) => {
      for (const e of entries) {
        const which = (e.target as HTMLElement).dataset.ctaAnchor;
        if (which === "hero") exhibition.set({ heroCtaVisible: e.isIntersecting });
        if (which === "doors") exhibition.set({ doorsCtaVisible: e.isIntersecting });
      }
    });
    for (const el of document.querySelectorAll("[data-cta-anchor]")) ctaObserver.observe(el);

    // Header background and story bar fill, once per frame while scrolling.
    let frame = 0;
    const paint = () => {
      frame = 0;
      const y = window.scrollY;
      const vh = window.innerHeight;
      exhibition.set({ scrolled: y > 80 });
      segments.forEach((seg, i) => {
        const s = slides[i];
        if (!s) return;
        const p = Math.min(1, Math.max(0, (y + vh - s.offsetTop) / s.offsetHeight));
        seg.style.setProperty("--p", p.toFixed(3));
      });
    };
    const onScroll = () => {
      if (!frame) frame = requestAnimationFrame(paint);
    };
    paint();
    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", onScroll, { passive: true });

    const go = (i: number) => {
      const s = slides[Math.max(0, Math.min(slides.length - 1, i))];
      s.scrollIntoView({ behavior: reduced ? "instant" : "smooth", block: "start" });
      s.focus({ preventScroll: true });
    };
    const onKey = (e: KeyboardEvent) => {
      if (e.defaultPrevented || e.altKey || e.ctrlKey || e.metaKey) return;
      const el = e.target instanceof Element ? e.target : null;
      if (el?.closest(NATIVE_KEYS)) return;
      if (e.key === " " && el?.closest("button, [role=button]")) return;
      const last = slides[slides.length - 1];
      // Below the last slide (FAQ, footer) the page scrolls as usual.
      if (window.scrollY > last.offsetTop + 8) return;
      const i = Math.max(0, active);
      const next = NEXT.has(e.key) && !e.shiftKey;
      const prev = PREV.has(e.key) || (e.key === " " && e.shiftKey);
      if (next && i < slides.length - 1) go(i + 1);
      else if (prev && i > 0) go(slides[i].getBoundingClientRect().top < -8 ? i : i - 1);
      else if (e.key === "Home") go(0);
      else if (e.key === "End") go(slides.length - 1);
      else return;
      e.preventDefault();
    };
    window.addEventListener("keydown", onKey);

    const faq = document.getElementById("faq");
    const onToggle = (e: Event) => {
      const d = e.target as HTMLDetailsElement;
      if (d.open && d.dataset.question) track("faq_open", { question: d.dataset.question });
    };
    // toggle doesn't bubble, so listen in the capture phase.
    faq?.addEventListener("toggle", onToggle, true);

    return () => {
      slideObserver.disconnect();
      ctaObserver.disconnect();
      cancelAnimationFrame(frame);
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("resize", onScroll);
      window.removeEventListener("keydown", onKey);
      faq?.removeEventListener("toggle", onToggle, true);
    };
  }, []);

  return null;
}
