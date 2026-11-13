import manifest from "./artworks.json";
import generated from "./art.generated.json";
import type { Artwork, BuiltImage } from "./art-utils";

/* Server-only in practice: this module carries the whole catalog. Browser components import from ./art-utils. */
export { fallbackSrc, shortTitle, srcSet, type Artwork } from "./art-utils";

const built = generated as Record<string, BuiltImage>;

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
