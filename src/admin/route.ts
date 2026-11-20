/**
 * Hash routes for /admin (admin brief §2): one static page, so hosting needs
 * no rewrites, and back / forward / reload keep the admin's place.
 *
 *   #overview  #users  #quiz/bank  #quiz/daily  #quiz/styles  #news
 *   #orders?status=paid  #artworks?filter=pending  #inbox/<userId>  #insights
 *
 * Pure: no React, no Supabase, so it is unit-tested on its own.
 */

export const QUIZ_SUBS = ["bank", "daily", "styles"] as const;
export type QuizSub = (typeof QUIZ_SUBS)[number];

export type Route =
  | { section: "overview" }
  | { section: "users" }
  | { section: "quiz"; sub: QuizSub }
  | { section: "news" }
  | { section: "orders"; status: string | null }
  | { section: "artworks"; filter: string | null }
  | { section: "inbox"; userId: string | null }
  | { section: "insights" };

export type Section = Route["section"];

export const SECTIONS: readonly Section[] = [
  "overview",
  "users",
  "quiz",
  "news",
  "orders",
  "artworks",
  "inbox",
  "insights",
];

export const DEFAULT_ROUTE: Route = { section: "overview" };

const SLUG = /^[A-Za-z0-9_-]{1,64}$/;

/** "#orders?status=paid" → { section: "orders", status: "paid" }. Unknown input → Overview. */
export function parseRoute(hash: string): Route {
  const raw = hash.replace(/^#\/?/, "");
  const [pathPart = "", query = ""] = raw.split("?", 2);
  const [head, rest] = pathPart.split(/\/(.*)/s, 2) as [string, string | undefined];
  const params = new URLSearchParams(query);
  const slug = (v: string | null | undefined) => (v && SLUG.test(v) ? v : null);

  switch (head) {
    case "overview":
    case "users":
    case "news":
    case "insights":
      return { section: head };
    case "quiz":
      return { section: "quiz", sub: (QUIZ_SUBS as readonly string[]).includes(rest ?? "") ? (rest as QuizSub) : "bank" };
    case "orders":
      return { section: "orders", status: slug(params.get("status")) };
    case "artworks":
      return { section: "artworks", filter: slug(params.get("filter")) };
    case "inbox":
      return { section: "inbox", userId: slug(rest ? decodeURIComponent(rest) : null) };
    default:
      return DEFAULT_ROUTE;
  }
}

/** Inverse of parseRoute; always starts with "#". */
export function buildRoute(route: Route): string {
  switch (route.section) {
    case "quiz":
      return `#quiz/${route.sub}`;
    case "orders":
      return route.status ? `#orders?status=${encodeURIComponent(route.status)}` : "#orders";
    case "artworks":
      return route.filter ? `#artworks?filter=${encodeURIComponent(route.filter)}` : "#artworks";
    case "inbox":
      return route.userId ? `#inbox/${encodeURIComponent(route.userId)}` : "#inbox";
    default:
      return `#${route.section}`;
  }
}

/** The plain route for a section (what the sidebar links to). */
export function sectionRoute(section: Section): Route {
  switch (section) {
    case "quiz":
      return { section, sub: "bank" };
    case "orders":
      return { section, status: null };
    case "artworks":
      return { section, filter: null };
    case "inbox":
      return { section, userId: null };
    default:
      return { section };
  }
}
