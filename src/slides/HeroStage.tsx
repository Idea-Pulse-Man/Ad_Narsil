"use client";

import { useEffect, useRef, useState, type CSSProperties, type ReactNode } from "react";
import { ArtPicture } from "@/components/ArtPicture";
import type { Artwork } from "@/content/art";
import { COPY } from "@/content/copy";
import { useReducedMotion } from "@/lib/use-media";

const ROTATE_MS = 6000;

/**
 * The entrance's paintings (brief §6, Slide I). Phones: full-bleed under a
 * gradient, drifting slowly. Desktop: hung in a gilt frame on the spotlit
 * wall. The first work is the LCP image; the other three load after the
 * page's load event, and the set crossfades every 6 s while on screen.
 * Reduced motion shows the first work, still.
 */
export function HeroStage({ works, children }: { works: Artwork[]; children: ReactNode }) {
  const reduced = useReducedMotion();
  const [rest, setRest] = useState(false);
  const [active, setActive] = useState(0);
  const [leaving, setLeaving] = useState<number | null>(null);
  const [paused, setPaused] = useState(false);
  const activeRef = useRef(0);
  const imgs = useRef<(HTMLImageElement | null)[]>([]);
  const stage = useRef<HTMLDivElement>(null);

  useEffect(() => {
    // Read the media query directly: during hydration `reduced` is still the server's false.
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    const load = () => setRest(true);
    if (document.readyState === "complete") {
      load();
      return;
    }
    window.addEventListener("load", load, { once: true });
    return () => window.removeEventListener("load", load);
  }, []);

  useEffect(() => {
    if (!rest || paused || reduced) return;
    let onScreen = true;
    const io = new IntersectionObserver(([e]) => (onScreen = e.isIntersecting));
    if (stage.current) io.observe(stage.current);
    const timer = setInterval(() => {
      if (!onScreen || document.hidden) return;
      const current = activeRef.current;
      const next = (current + 1) % works.length;
      const img = imgs.current[next];
      if (!img?.complete || !img.naturalWidth) return; // not ready yet: try again next tick
      activeRef.current = next;
      setLeaving(current);
      setActive(next);
    }, ROTATE_MS);
    return () => {
      clearInterval(timer);
      io.disconnect();
    };
  }, [rest, paused, reduced, works.length]);

  const work = works[active];
  const rotating = rest && !reduced && works.length > 1;
  const caption = (className: string) => (
    <div className={`items-center gap-3 ${className}`}>
      <p className="fine m-0 min-w-0">
        <i className="font-serif text-canvas-muted">{work.title}</i>{" "}
        · {work.artist}, {work.date} · {work.museum}
      </p>
      {rotating && (
        <button
          type="button"
          onClick={() => setPaused((p) => !p)}
          aria-label={paused ? COPY.entrance.play : COPY.entrance.pause}
          className="-my-2 grid size-11 shrink-0 place-items-center rounded-full text-stone hover:text-accent"
        >
          <svg width="14" height="14" viewBox="0 0 14 14" aria-hidden="true" fill="currentColor">
            {paused ? <path d="M3 1.5v11l9-5.5z" /> : <path d="M3 1.5h3v11H3zM8 1.5h3v11H8z" />}
          </svg>
        </button>
      )}
    </div>
  );

  return (
    <div className="hero-grid">
      <div className="hero-copy">
        {children}
        {caption("mt-5 flex lg:hidden")}
      </div>
      <div className="hero-art" ref={stage}>
        <div className="hero-stack">
          {works.map((w, i) =>
            i === 0 || rest ? (
              <figure
                key={w.slug}
                className="hero-work"
                data-state={i === active ? "active" : i === leaving ? "leaving" : "idle"}
                aria-hidden={i !== active}
                style={{ "--glow": w.image.palette[1] } as CSSProperties}
              >
                <div
                  className="hero-frame"
                  style={{ "--ar": w.image.width / w.image.height, backgroundImage: `url(${w.image.placeholder})` } as CSSProperties}
                >
                  <ArtPicture
                    work={w}
                    /* Phones get the 960 px file at 2–3×: the budget is 150 KB, and the art sits under a gradient. */
                    sizes="(min-width: 1024px) 40vw, 320px"
                    priority={i === 0}
                    ref={(el) => {
                      imgs.current[i] = el;
                    }}
                  />
                </div>
              </figure>
            ) : null,
          )}
        </div>
        {caption("mt-5 hidden justify-center lg:flex")}
      </div>
    </div>
  );
}
