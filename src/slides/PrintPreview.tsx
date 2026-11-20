"use client";

import { useEffect, useRef, useState, type ReactNode } from "react";
import { fallbackSrc, shortTitle, srcSet, type Artwork } from "@/content/art-utils";
import { COPY } from "@/content/copy";
import type { PrintProduct, PrintSize } from "@/content/prices";
import { track } from "@/lib/analytics";

/** The wall, in inches: 132" (11 ft) wide, floor to just under an 8-foot ceiling. */
const W = 132;
const H = 96;
const FLOOR = H - 5;
const SOFA = { x: 10, width: 84, back: 32, seat: 17, arm: 25 };
/** The plant is drawn around x = 125; this moves it beside the sofa. */
const PLANT_SHIFT = -14;
const SOFA_CX = SOFA.x + SOFA.width / 2;
/** Hung with its lower edge 9" above the sofa back, as most hanging guides suggest. */
const GAP = 9;

type Props = {
  works: Artwork[];
  sizes: Record<PrintProduct, PrintSize[]>;
  /** Rendered on the server: "Choose yours in the app". */
  cta: ReactNode;
};

/** "50% 22%" → the SVG alignment closest to the manifest's focal point. */
function align(focal: string): string {
  const [x, y] = focal.split(/\s+/).map((v) => parseFloat(v));
  const pick = (v: number) => (!Number.isFinite(v) ? "Mid" : v < 34 ? "Min" : v > 66 ? "Max" : "Mid");
  return `x${pick(x)}Y${pick(y)}`;
}

/**
 * Room VII's true-scale wall (brief §6, Slide VII). Pick a work, canvas or
 * poster, and a size; the print hangs at real scale above an 84" sofa, with
 * a plant for scale. Landscape works turn the size around. Canvas gets a
 * shallow edge shadow, posters hang flat; no frames, mats or hardware, since
 * none are sold. "from $X" comes from the price table fetched at build time.
 */
export function PrintPreview({ works, sizes, cta }: Props) {
  const t = COPY.acquisitions;
  const [slug, setSlug] = useState(works[0].slug);
  const [product, setProduct] = useState<PrintProduct>("canvas");
  const [sizeName, setSizeName] = useState(sizes.canvas[1]?.size ?? sizes.canvas[0].size);
  const [near, setNear] = useState(false);
  const root = useRef<HTMLDivElement>(null);
  const changed = useRef(false);

  // The wall's images load only once the room is close.
  useEffect(() => {
    const el = root.current;
    if (!el) return;
    const io = new IntersectionObserver(([e]) => e.isIntersecting && (setNear(true), io.disconnect()), { rootMargin: "400px" });
    io.observe(el);
    return () => io.disconnect();
  }, []);

  useEffect(() => {
    if (!changed.current) return;
    track("print_configure", { product, size: sizeName, artwork: slug });
  }, [product, sizeName, slug]);

  const work = works.find((w) => w.slug === slug) ?? works[0];
  const table = sizes[product];
  const size = table.find((s) => s.size === sizeName) ?? table[0];
  const landscape = work.image.width > work.image.height;
  const [short, long] = size.inches;
  const pw = landscape ? long : short;
  const ph = landscape ? short : long;
  const px = SOFA_CX - pw / 2;
  const py = FLOOR - SOFA.back - GAP - ph;
  const dims = `${pw} × ${ph}″`;
  const href = near ? fallbackSrc(work.image.webp, 960) : work.image.placeholder;

  const set = <T,>(fn: (v: T) => void) => (v: T) => {
    changed.current = true;
    fn(v);
  };

  return (
    <div ref={root} className="print-preview" data-native-keys>
      <figure className="m-0">
        <svg viewBox={`0 0 ${W} ${H}`} className="print-room" role="img" aria-label={t.wallLabel(shortTitle(work), t.products[product], `${dims} ${size.size.toLowerCase()}`)}>
          <defs>
            <radialGradient id="pp-wall" cx="42%" cy="18%" r="85%">
              <stop offset="0" stopColor="#4a3a2d" />
              <stop offset="0.6" stopColor="#2c2219" />
              <stop offset="1" stopColor="#1c1510" />
            </radialGradient>
            <linearGradient id="pp-sofa" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0" stopColor="#5b4b3e" />
              <stop offset="1" stopColor="#3e3229" />
            </linearGradient>
            <filter id="pp-canvas" x="-10%" y="-10%" width="130%" height="130%">
              <feDropShadow dx="0.7" dy="1.1" stdDeviation="0.9" floodColor="#000" floodOpacity="0.6" />
            </filter>
            <filter id="pp-poster" x="-10%" y="-10%" width="130%" height="130%">
              <feDropShadow dx="0.15" dy="0.3" stdDeviation="0.35" floodColor="#000" floodOpacity="0.4" />
            </filter>
          </defs>

          <rect width={W} height={FLOOR} fill="url(#pp-wall)" />
          <rect y={FLOOR} width={W} height={H - FLOOR} fill="#17110d" />
          <rect y={FLOOR - 4} width={W} height={4} fill="#231a14" />

          {/* The print, true to scale. */}
          <g filter={`url(#pp-${product})`} key={`${slug}-${product}-${size.size}`} className="print-hang">
            <svg x={px} y={py} width={pw} height={ph} viewBox={`0 0 ${pw} ${ph}`} preserveAspectRatio="none">
              <image href={href} width={pw} height={ph} preserveAspectRatio={`${align(work.focal)} slice`} />
            </svg>
            {product === "canvas" && <rect x={px + pw} y={py + 0.4} width={0.6} height={ph} fill="#0d0907" opacity="0.55" />}
          </g>

          {/* Sofa, 84" wide. */}
          <g>
            <rect x={SOFA.x + 3} y={FLOOR - SOFA.back} width={SOFA.width - 6} height={SOFA.back - 4} rx="3" fill="url(#pp-sofa)" />
            <rect x={SOFA.x + 6} y={FLOOR - SOFA.seat - 2} width={SOFA.width - 12} height={8} rx="2.5" fill="#665445" />
            <rect x={SOFA.x} y={FLOOR - SOFA.arm} width={8} height={SOFA.arm - 4} rx="3" fill="#4d3f34" />
            <rect x={SOFA.x + SOFA.width - 8} y={FLOOR - SOFA.arm} width={8} height={SOFA.arm - 4} rx="3" fill="#4d3f34" />
            <rect x={SOFA.x + 2} y={FLOOR - 9} width={SOFA.width - 4} height={6} rx="1.5" fill="#3a2f27" />
            <rect x={SOFA.x + 4} y={FLOOR - 3} width={1.6} height={3} fill="#1f1813" />
            <rect x={SOFA.x + SOFA.width - 5.6} y={FLOOR - 3} width={1.6} height={3} fill="#1f1813" />
          </g>

          {/* A plant, about 4 ft tall. */}
          <g transform={`translate(${PLANT_SHIFT} 0)`}>
            <path d="M118 91 l1.5 -13 h11 l1.5 13 z" fill="#5e4c3d" />
            <g fill="#3f4a37">
              <ellipse cx="125" cy="66" rx="2.6" ry="11" transform="rotate(-24 125 66)" />
              <ellipse cx="125" cy="64" rx="2.6" ry="13" />
              <ellipse cx="126" cy="67" rx="2.6" ry="11" transform="rotate(26 126 67)" />
              <ellipse cx="122" cy="72" rx="2.3" ry="8" transform="rotate(-48 122 72)" />
              <ellipse cx="129" cy="72" rx="2.3" ry="8" transform="rotate(50 129 72)" />
              <ellipse cx="124" cy="58" rx="2" ry="9" transform="rotate(-10 124 58)" />
            </g>
          </g>
        </svg>
        <figcaption className="mt-3 flex flex-wrap items-baseline justify-between gap-x-4 gap-y-1">
          <span className="art-caption m-0">
            <i>{shortTitle(work).split(/, \d/)[0]}</i> · {work.artist} · {t.products[product]}, {dims}
          </span>
          <span className="fine m-0 text-xs">{t.scale}</span>
        </figcaption>
      </figure>

      <div className="print-controls">
        <fieldset className="print-field">
          <legend className="eyebrow">{t.artwork}</legend>
          <div className="print-thumbs">
            {works.map((w) => (
              <label key={w.slug} className="print-thumb" title={`${shortTitle(w)} · ${w.artist}`}>
                <input type="radio" name="pp-art" value={w.slug} checked={w.slug === slug} onChange={() => set(setSlug)(w.slug)} className="sr-only" />
                <span className="print-thumb-img" style={{ backgroundImage: `url(${w.image.placeholder})` }}>
                  {near && (
                    <picture>
                      <source type="image/avif" srcSet={srcSet(w.image.avif)} sizes="72px" />
                      <img src={fallbackSrc(w.image.webp, 480)} srcSet={srcSet(w.image.webp)} sizes="72px" alt="" width={72} height={72} loading="lazy" decoding="async" style={{ objectPosition: w.focal }} />
                    </picture>
                  )}
                </span>
                <span className="sr-only">
                  {shortTitle(w)}, {w.artist}
                </span>
              </label>
            ))}
          </div>
        </fieldset>

        <fieldset className="print-field">
          <legend className="eyebrow">{t.product}</legend>
          <div className="seg">
            {(["canvas", "poster"] as const).map((p) => (
              <label key={p} className="seg-opt">
                <input type="radio" name="pp-product" value={p} checked={product === p} onChange={() => set(setProduct)(p)} className="sr-only" />
                <span>{t.products[p]}</span>
              </label>
            ))}
          </div>
        </fieldset>

        <fieldset className="print-field">
          <legend className="eyebrow">{t.size}</legend>
          <div className="seg">
            {table.map((s) => {
              const [a, b] = s.inches;
              return (
                <label key={s.size} className="seg-opt">
                  <input type="radio" name="pp-size" value={s.size} checked={size.size === s.size} onChange={() => set(setSizeName)(s.size)} className="sr-only" />
                  <span>
                    {s.size}
                    <small className="tabular block text-[11px] opacity-80">{landscape ? `${b} × ${a}″` : `${a} × ${b}″`}</small>
                  </span>
                </label>
              );
            })}
          </div>
        </fieldset>

        <div className="flex flex-wrap items-center gap-x-5 gap-y-3">
          <p className="tabular m-0 font-serif text-3xl text-gilt-light" aria-live="polite">
            {t.from(size.price)}
          </p>
          {cta}
        </div>
      </div>
    </div>
  );
}
