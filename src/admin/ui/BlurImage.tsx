"use client";

import { useState } from "react";
import { sizedImageUrl } from "../lib/imageUrl";

/**
 * Web stand-in for the app's BlurImage (admin brief §3): a lazy image over
 * the work's accent colour, with no caching or zoom machinery.
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
    <div className={`relative overflow-hidden ${className}`} style={{ backgroundColor: accent }}>
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
