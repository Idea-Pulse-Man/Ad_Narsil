import { existsSync } from "node:fs";
import path from "node:path";
import { COPY } from "@/content/copy";

export type BadgeKind = "download" | "preorder" | "play";

/** Official artwork only (brief §7.6): drop Apple's and Google's SVGs into public/badges unmodified. */
export const BADGE_FILES: Record<BadgeKind, string> = {
  download: "app-store-download.svg",
  preorder: "app-store-preorder.svg",
  play: "google-play.svg",
};

const LABELS: Record<BadgeKind, string> = {
  download: COPY.cta.appStore,
  preorder: COPY.cta.preorder,
  play: COPY.cta.play,
};

export const badgeExists = (kind: BadgeKind) => existsSync(path.join(process.cwd(), "public", "badges", BADGE_FILES[kind]));

/**
 * 48 px tall (Apple's minimum is 40), never recoloured, cropped or animated.
 * A missing file fails the production build (src/config/check.ts); in
 * development it shows a labelled gap instead of a redrawn badge.
 */
export function StoreBadge({ kind }: { kind: BadgeKind }) {
  if (!badgeExists(kind)) {
    return (
      <span className="inline-flex h-12 items-center rounded-lg border border-dashed border-stone px-4 text-xs text-stone">
        {LABELS[kind]} (badge file missing: public/badges/{BADGE_FILES[kind]})
      </span>
    );
  }
  return <img src={`/badges/${BADGE_FILES[kind]}`} alt={LABELS[kind]} height={48} className="block h-12 w-auto" />;
}
