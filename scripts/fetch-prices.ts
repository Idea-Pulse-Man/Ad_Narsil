/**
 * Fetches the live print price table (brief §10) into src/content/prices.json.
 *
 * Mirrors mergeSizes in museum-app/src/data/shop.ts: canvas sizes come from
 * `products.canvas.sizes` (older servers send only `sizes`), posters from
 * `products.poster.sizes`. A size table is used only when every size has a
 * positive price. If the request fails or the answer looks wrong, the file
 * keeps its current values (or the fallback below) and the build carries on
 * with a warning: prices must never fail the build.
 *
 * Run: npm run prices (also runs before every build)
 */
import { existsSync } from "node:fs";
import { readFile, writeFile } from "node:fs/promises";
import path from "node:path";

type Size = { size: string; dimensions: string; price: number };
type RemoteSizes = { size?: string; dimensions?: string; price?: number }[];
type PriceFile = { fetchedAt: string | null; source: string; canvas: Size[]; poster: Size[] };

const URL_ = process.env.PRICES_URL || "https://d2lvgalchu2nps.cloudfront.net/api/prices";
const OUT = path.resolve(import.meta.dirname, "..", "src", "content", "prices.json");

/** The app's fallback tables (museum-app/src/data/shop.ts). */
const FALLBACK: PriceFile = {
  fetchedAt: null,
  source: "fallback",
  canvas: [
    { size: "Small", dimensions: '12 × 16"', price: 59 },
    { size: "Medium", dimensions: '18 × 24"', price: 89 },
    { size: "Large", dimensions: '24 × 36"', price: 129 },
  ],
  poster: [
    { size: "Small", dimensions: '12 × 16"', price: 29 },
    { size: "Medium", dimensions: '18 × 24"', price: 35 },
    { size: "Large", dimensions: '24 × 36"', price: 45 },
  ],
};

export function mergeSizes(local: Size[], remote?: RemoteSizes): Size[] | null {
  if (!Array.isArray(remote)) return null;
  const merged = local.map((option) => {
    const r = remote.find((s) => s.size === option.size);
    return r && typeof r.price === "number" && r.price > 0 ? { ...option, price: r.price, dimensions: r.dimensions || option.dimensions } : null;
  });
  return merged.some((m) => m === null) ? null : (merged as Size[]);
}

async function main() {
  const current: PriceFile = existsSync(OUT) ? JSON.parse(await readFile(OUT, "utf8")) : FALLBACK;
  try {
    const res = await fetch(URL_, { signal: AbortSignal.timeout(8000) });
    if (!res.ok) throw new Error(`HTTP ${res.status}`);
    const body = (await res.json()) as {
      sizes?: RemoteSizes;
      products?: { canvas?: { sizes?: RemoteSizes }; poster?: { sizes?: RemoteSizes } };
    };
    const canvas = mergeSizes(FALLBACK.canvas, body.products?.canvas?.sizes ?? body.sizes);
    if (!canvas) throw new Error("unexpected answer (no complete canvas table)");
    // Older servers don't send posters: keep what we had.
    const poster = mergeSizes(FALLBACK.poster, body.products?.poster?.sizes) ?? current.poster;
    const next: PriceFile = { fetchedAt: new Date().toISOString(), source: URL_, canvas, poster };
    await writeFile(OUT, JSON.stringify(next, null, 2) + "\n");
    console.log(`prices: canvas from $${canvas[0].price}, poster from $${poster[0].price}`);
  } catch (err) {
    if (!existsSync(OUT)) await writeFile(OUT, JSON.stringify(FALLBACK, null, 2) + "\n");
    console.warn(`prices: kept ${current.source === "fallback" ? "the fallback table" : `the table from ${current.fetchedAt}`} (${String(err)})`);
  }
}

if (import.meta.main ?? process.argv[1]?.endsWith("fetch-prices.ts")) await main();
