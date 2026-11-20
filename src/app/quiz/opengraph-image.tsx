import { artwork } from "@/content/art";
import { COPY } from "@/content/copy";
import { OG_SIZE, ogPoster } from "@/lib/og";

export const alt = "Can you tell a Vermeer from a Rembrandt? The Royal Assessment, in Narsil.";
export const size = OG_SIZE;
export const contentType = "image/png";

export default function Image() {
  return ogPoster({
    eyebrow: "The Royal Assessment",
    title: COPY.variants.quiz.title.replace(/\*/g, ""),
    line: "Five questions. The court's verdict is… theatrical.",
    work: artwork("milkmaid"),
  });
}
