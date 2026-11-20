import { artwork } from "@/content/art";
import { COPY } from "@/content/copy";
import { PRICES } from "@/content/prices";
import { OG_SIZE, ogPoster } from "@/lib/og";

export const alt = "Hang a masterpiece in your living room. The Little Street by Johannes Vermeer, as a print from Narsil.";
export const size = OG_SIZE;
export const contentType = "image/png";

export default function Image() {
  return ogPoster({
    eyebrow: "Acquisitions",
    title: COPY.variants.prints.title.replace(/\*/g, ""),
    line: `Canvas from $${PRICES.canvasFrom}. Posters from $${PRICES.posterFrom}. Shipping and tax included in the US.`,
    work: artwork("little-street"),
  });
}
