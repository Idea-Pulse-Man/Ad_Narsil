import type { NextConfig } from "next";

const dev = process.env.NODE_ENV !== "production";

/**
 * Only the site itself (brief §10). The waitlist posts to our own
 * /api/waitlist, so Supabase never needs to be reachable from the browser.
 * Next's static pages carry inline bootstrap scripts, hence 'unsafe-inline'
 * for scripts; add the analytics origin to connect-src once one is chosen.
 */
const csp = [
  "default-src 'self'",
  `script-src 'self' 'unsafe-inline'${dev ? " 'unsafe-eval'" : ""}`,
  "style-src 'self' 'unsafe-inline'",
  "img-src 'self' data: blob:",
  "font-src 'self'",
  `connect-src 'self'${dev ? " ws:" : ""}`,
  "media-src 'self'",
  "frame-ancestors 'none'",
  "base-uri 'self'",
  "form-action 'self'",
  "object-src 'none'",
  ...(dev ? [] : ["upgrade-insecure-requests"]),
].join("; ");

/**
 * /admin (AD-WEBSITE-ADMIN-PROMPT.md §4.4): talks to Supabase (https + wss for
 * realtime chat) and this site only — Narsil backend calls go through the
 * same-origin relay at /api/admin/*. Images come from the catalog's hosts:
 * S3 / CloudFront, Wikimedia, wsrv.nl (the app's grid resizer), and
 * Google / Supabase for avatars.
 */
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL?.replace(/\/$/, "") ?? "";
const adminCsp = [
  "default-src 'self'",
  `script-src 'self' 'unsafe-inline'${dev ? " 'unsafe-eval'" : ""}`,
  "style-src 'self' 'unsafe-inline'",
  // Any https image: catalog works come from S3, CloudFront, Wikimedia, wsrv.nl and the
  // museums' own hosts, and a News post's image can be any URL the editor pastes.
  // Images can't run code; scripts and connections stay locked down below.
  "img-src 'self' data: blob: https:",
  "font-src 'self'",
  `connect-src 'self' ${supabaseUrl} ${supabaseUrl.replace(/^http/, "ws")}${dev ? " ws:" : ""}`,
  "frame-ancestors 'none'",
  "base-uri 'self'",
  "form-action 'self'",
  "object-src 'none'",
  ...(dev ? [] : ["upgrade-insecure-requests"]),
].join("; ");

const nextConfig: NextConfig = {
  poweredByHeader: false,
  reactStrictMode: true,
  async headers() {
    return [
      {
        source: "/:path*",
        headers: [
          { key: "Content-Security-Policy", value: csp },
          { key: "X-Content-Type-Options", value: "nosniff" },
          { key: "Referrer-Policy", value: "strict-origin-when-cross-origin" },
          { key: "Permissions-Policy", value: "camera=(), microphone=(), geolocation=()" },
          { key: "X-Frame-Options", value: "DENY" },
        ],
      },
      {
        // Content-hashed by scripts/build-artworks.ts.
        source: "/art/:path*",
        headers: [{ key: "Cache-Control", value: "public, max-age=31536000, immutable" }],
      },
      {
        // Last, so these win over the site-wide values above.
        source: "/admin",
        headers: [
          { key: "Content-Security-Policy", value: adminCsp },
          { key: "Cache-Control", value: "no-store" },
          { key: "Referrer-Policy", value: "no-referrer" },
          { key: "X-Robots-Tag", value: "noindex, nofollow" },
          { key: "X-Frame-Options", value: "DENY" },
        ],
      },
    ];
  },
};

export default nextConfig;
