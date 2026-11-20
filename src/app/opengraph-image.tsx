import { artwork } from "@/content/art";
import { COPY } from "@/content/copy";
import { OG_SIZE, ogPoster } from "@/lib/og";

export const alt = "Narsil: The museum never closes. The Milkmaid by Johannes Vermeer in a gilt frame.";
export const size = OG_SIZE;
export const contentType = "image/png";

/** The default share image (brief §14): crest, a gilt-framed masterpiece and the headline. */
export default function Image() {
  return ogPoster({
    eyebrow: COPY.entrance.eyebrow,
    title: COPY.entrance.title.replace(/\*/g, ""),
    line: "Nearly 20,000 public-domain masterpieces, the story of each one, and a daily art quiz.",
    work: artwork("milkmaid"),
  });
}
