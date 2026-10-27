import type { Ref } from "react";
import { fallbackSrc, srcSet, type Artwork } from "@/content/art";

type Props = {
  work: Artwork;
  sizes: string;
  /** The hero: loads eagerly at high priority. Everything else is lazy. */
  priority?: boolean;
  className?: string;
  ref?: Ref<HTMLImageElement>;
};

/** A self-hosted artwork: AVIF, then WebP, with its size reserved and its focal point kept in view. */
export function ArtPicture({ work, sizes, priority = false, className, ref }: Props) {
  return (
    <picture>
      <source type="image/avif" srcSet={srcSet(work.image.avif)} sizes={sizes} />
      <source type="image/webp" srcSet={srcSet(work.image.webp)} sizes={sizes} />
      <img
        ref={ref}
        src={fallbackSrc(work.image.webp)}
        width={work.image.width}
        height={work.image.height}
        alt={work.alt}
        loading={priority ? "eager" : "lazy"}
        fetchPriority={priority ? "high" : "auto"}
        decoding={priority ? "auto" : "async"}
        style={{ objectPosition: work.focal }}
        className={className}
        draggable={false}
      />
    </picture>
  );
}
