// src/config/site.ts — the only place store links and launch state live (brief §7.1)
export type LaunchState = "prelaunch" | "preorder" | "live";

const LAUNCH_STATES: readonly LaunchState[] = ["prelaunch", "preorder", "live"];

/** NEXT_PUBLIC_LAUNCH_STATE previews another state without editing this file. */
function launchState(fallback: LaunchState): LaunchState {
  const env = process.env.NEXT_PUBLIC_LAUNCH_STATE as LaunchState | undefined;
  return env && LAUNCH_STATES.includes(env) ? env : fallback;
}

export const SITE = {
  url: (process.env.NEXT_PUBLIC_SITE_URL || "http://localhost:3000").replace(/\/$/, ""),
  launchState: launchState("prelaunch"),
  appStore: {
    id: "" as string, // App Store Connect → App Information → Apple ID (digits only)
    providerToken: "" as string, // "pt" from App Store Connect's campaign-link generator
  },
  googlePlayUrl: "" as string, // empty → no Android badge anywhere
  webAppUrl: "https://narsil-app-frontend.vercel.app", // Android/desktop fallback only
  waitlist: { enabled: true },
  rating: null as null | { value: number; count: number }, // real App Store rating, or null
  catalogLabel: "nearly 20,000", // 19,362 works on 24 Oct 2026
  dailyQuestions: 10, // verify in Admin → Quiz
  prices: { canvasFrom: 59, posterFrom: 29 }, // fallback; the build fetches /api/prices
  supportEmail: "narsil.business@gmail.com",
  legal: {
    privacyUrl: "https://narsil-legal.vercel.app/privacy.html", // verify the live URL
    termsUrl: "https://narsil-legal.vercel.app/terms.html",
  },
  analytics: {
    /** Where track() beacons go. Empty → events are dropped (logged in dev). */
    endpoint: "" as string,
  },
} as const;

export type Site = typeof SITE;
