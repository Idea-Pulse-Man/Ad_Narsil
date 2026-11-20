/**
 * Backend + app origins for the web admin. Hand-written, not mirrored: the
 * mirrored lib/ files import `API_URL` from here in place of the app's
 * VITE_API_URL. The backend must list this site's origin in CORS_ORIGIN.
 */

export const API_URL =
  process.env.NEXT_PUBLIC_API_URL?.replace(/\/$/, "") ?? "http://localhost:4000";

/** The member web app. Password-reset links land here, never on the ad site. */
export const APP_WEB_URL =
  process.env.NEXT_PUBLIC_APP_WEB_URL?.replace(/\/$/, "") ?? "https://narsil-app-frontend.vercel.app";
