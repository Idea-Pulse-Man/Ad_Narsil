import type { CSSProperties } from "react";
import { ArtPicture } from "./ArtPicture";
import { shortTitle, type Artwork } from "@/content/art";

type Props = {
  work: Artwork;
  sizes: string;
  /** A fixed box ("4 / 5"); the work fills it, cropped around its focal point. Omit to show the whole work at its own ratio. */
  ratio?: string;
  /** The one-line caption under the frame (brief §4.4: every artwork has one). */
  caption?: boolean;
  decorative?: boolean;
  className?: string;
  frameClassName?: string;
};

/** An artwork in a thin gilt frame, its blurred placeholder showing until the image arrives. */
export function Framed({ work, sizes, ratio, caption = true, decorative = false, className = "", frameClassName = "" }: Props) {
  const style: CSSProperties = {
    aspectRatio: ratio ?? `${work.image.width} / ${work.image.height}`,
    backgroundImage: `url(${work.image.placeholder})`,
  };
  return (
    <figure
      className={`framed ${className}`}
      style={{ "--ar": work.image.width / work.image.height } as CSSProperties}
      aria-hidden={decorative || undefined}
    >
      <div className={`gilt-frame framed-box ${frameClassName}`} style={style}>
        <ArtPicture work={work} sizes={sizes} decorative={decorative} className="framed-img" />
      </div>
      {caption && (
        <figcaption className="art-caption">
          <i>{shortTitle(work)}</i> · {work.artist}
        </figcaption>
      )}
    </figure>
  );
}
