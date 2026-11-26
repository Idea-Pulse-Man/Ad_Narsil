"use client";

import { useState } from "react";
import { sizedImageUrl } from "../lib/imageUrl";

/**
 * Web stand-in for the app's BlurImage (admin brief §3): a lazy image over
 * the work's accent colour, with no caching or zoom machinery. Like the app's,
 * it fills its slot (h-full w-full): the image is absolutely positioned, so
 * without that the box collapses to zero height and nothing shows.
 */
export default function BlurImage({
  src,
  alt,
  accent,
  className = "",
  fit = "cover",
  thumbWidth,
}: {
  src: string;
  alt: string;
  accent: string;
  className?: string;
  fit?: "cover" | "contain";
  thumbWidth?: number;
  priority?: boolean;
}) {
  const [loaded, setLoaded] = useState(false);
  const [failed, setFailed] = useState(false);
  const url = thumbWidth ? sizedImageUrl(src, thumbWidth) : src;
  return (
    <div className={`relative h-full w-full overflow-hidden ${className}`} style={{ backgroundColor: accent }}>
      {url && !failed && (
        <img
          src={url}
          alt={alt}
          loading="lazy"
          decoding="async"
          onLoad={() => setLoaded(true)}
          onError={() => setFailed(true)}
          className={`absolute inset-0 h-full w-full transition-opacity duration-300 ${fit === "contain" ? "object-contain" : "object-cover"} ${loaded ? "opacity-100" : "opacity-0"}`}
        />
      )}
    </div>
  );
}
