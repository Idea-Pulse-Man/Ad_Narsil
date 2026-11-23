/**
 * Backend + app origins for the web admin. Hand-written, not mirrored: the
 * mirrored lib/ files import `API_URL` from here in place of the app's
 * VITE_API_URL and call `${API_URL}/api/admin/...`.
 *
 * Empty on purpose: those calls go to this site's own /api/admin/*, which
 * relays them to the Narsil backend server-side
 * (src/app/api/admin/[...path]/route.ts). The browser never talks to the
 * backend, so the backend's CORS_ORIGIN doesn't need to list this site.
 */
export const API_URL = "";

/** The member web app. Password-reset links land here, never on the ad site. */
export const APP_WEB_URL =
  process.env.NEXT_PUBLIC_APP_WEB_URL?.replace(/\/$/, "") ?? "https://narsil-app-frontend.vercel.app";
