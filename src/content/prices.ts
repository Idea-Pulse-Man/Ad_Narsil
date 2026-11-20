import table from "./prices.json";

/** Print prices, fetched at build time by scripts/fetch-prices.ts (brief §10), with SITE.prices' values as the fallback. */
export type PrintProduct = "canvas" | "poster";
export type PrintSize = { size: string; dimensions: string; price: number; inches: [number, number] };

/** '12 × 16"' → [12, 16] (short side, long side). */
export function parseInches(dimensions: string): [number, number] {
  const [a, b] = (dimensions.match(/\d+(\.\d+)?/g) ?? []).map(Number);
  return a && b ? [Math.min(a, b), Math.max(a, b)] : [12, 16];
}

const withInches = (sizes: { size: string; dimensions: string; price: number }[]): PrintSize[] =>
  sizes.map((s) => ({ ...s, inches: parseInches(s.dimensions) }));

export const PRINT_SIZES: Record<PrintProduct, PrintSize[]> = {
  canvas: withInches(table.canvas),
  poster: withInches(table.poster),
};

export const PRICES = {
  canvasFrom: Math.min(...table.canvas.map((s) => s.price)),
  posterFrom: Math.min(...table.poster.map((s) => s.price)),
};
