import { badgeExists } from "@/components/StoreBadge";
import { SITE } from "./site";

/**
 * Fails the production build when the launch state needs something that
 * isn't there yet: no store badge for an app that isn't on the store, and no
 * redrawn badges. In development it only warns.
 */
export function checkLaunchConfig(): void {
  const problems: string[] = [];
  if (SITE.launchState !== "prelaunch") {
    if (!/^\d+$/.test(SITE.appStore.id)) problems.push("SITE.appStore.id must be the app's Apple ID (digits)");
    const badge = SITE.launchState === "live" ? "download" : "preorder";
    if (!badgeExists(badge)) problems.push(`public/badges is missing Apple's official "${badge}" badge`);
  }
  if (SITE.googlePlayUrl && !badgeExists("play")) problems.push("public/badges is missing Google's official Play badge");
  if (!problems.length) return;

  const message = `Launch config (${SITE.launchState}): ${problems.join("; ")}.`;
  if (process.env.NODE_ENV === "production") throw new Error(message);
  console.warn(message);
}
