import manifest from "./artworks.json";
import generated from "./art.generated.json";

type Manifest = (typeof manifest)[number];
type Built = {
  width: number;
  height: number;
  palette: string[];
  placeholder: string;
  avif: Record<string, string>;
  webp: Record<string, string>;
};

export type Artwork = Manifest & { image: Built };

const built = generated as Record<string, Built>;

export const ARTWORKS: Artwork[] = manifest.map((work) => {
  const image = built[work.slug];
  if (!image) throw new Error(`No images for "${work.slug}": run npm run artworks`);
  return { ...work, image };
});

export function artwork(slug: string): Artwork {
  const work = ARTWORKS.find((w) => w.slug === slug);
  if (!work) throw new Error(`Unknown artwork "${slug}"`);
  return work;
}

export const artworksWithRole = (role: string) => ARTWORKS.filter((w) => w.roles.includes(role));

export const srcSet = (set: Record<string, string>) =>
  Object.entries(set)
    .map(([w, src]) => `${src} ${w}w`)
    .join(", ");

/** The largest variant at or under `width`, for the plain <img src>. */
export function fallbackSrc(set: Record<string, string>, width = 960): string {
  const widths = Object.keys(set)
    .map(Number)
    .sort((a, b) => a - b);
  const pick = widths.filter((w) => w <= width).pop() ?? widths[0];
  return set[pick];
}
