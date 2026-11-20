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
 * realtime chat) and the Narsil backend only. Images come from the catalog's
 * hosts: S3 / CloudFront, Wikimedia, wsrv.nl (the app's grid resizer), and
 * Google / Supabase for avatars.
 */
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL?.replace(/\/$/, "") ?? "";
const apiUrl = process.env.NEXT_PUBLIC_API_URL?.replace(/\/$/, "") ?? "http://localhost:4000";
const adminCsp = [
  "default-src 'self'",
  `script-src 'self' 'unsafe-inline'${dev ? " 'unsafe-eval'" : ""}`,
  "style-src 'self' 'unsafe-inline'",
  [
    "img-src 'self' data: blob:",
    "https://*.amazonaws.com https://*.cloudfront.net",
    "https://commons.wikimedia.org https://upload.wikimedia.org https://wsrv.nl",
    "https://*.googleusercontent.com",
    supabaseUrl,
  ].join(" "),
  "font-src 'self'",
  `connect-src 'self' ${supabaseUrl} ${supabaseUrl.replace(/^http/, "ws")} ${apiUrl}${dev ? " ws:" : ""}`,
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
