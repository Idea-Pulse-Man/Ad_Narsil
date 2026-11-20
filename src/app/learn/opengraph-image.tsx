import { artwork } from "@/content/art";
import { COPY } from "@/content/copy";
import { OG_SIZE, ogPoster } from "@/lib/og";

export const alt = "Learn art history in five minutes a day. The Night Watch by Rembrandt van Rijn, in Narsil.";
export const size = OG_SIZE;
export const contentType = "image/png";

export default function Image() {
  return ogPoster({
    eyebrow: "The Ages",
    title: COPY.variants.learn.title.replace(/\*/g, ""),
    line: "Real masterpieces, the story behind each one, and a daily quiz. Free on iPhone.",
    work: artwork("night-watch"),
  });
}
