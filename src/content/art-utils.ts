import type manifest from "./artworks.json";

/*
 * The artwork type and the pure helpers, with no data attached. Components
 * that run in the browser (ArtPicture, HeroStage, SampleQuiz) import from
 * here: importing a value from ./art would ship the whole catalog to the
 * browser as JavaScript.
 */

type Manifest = (typeof manifest)[number];

export type BuiltImage = {
  width: number;
  height: number;
  palette: string[];
  placeholder: string;
  avif: Record<string, string>;
  webp: Record<string, string>;
};

export type Artwork = Manifest & { image: BuiltImage };

/**
 * The title as a caption can carry it: the museum's subtitles and series
 * names dropped ("Red-Figure Lekythos (Oil Vessel): Athena…" → "Red-Figure Lekythos").
 * Placards and /credits keep the full title.
 */
export const shortTitle = (work: Artwork) => work.title.split(/ \(|: |, from /)[0];

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
