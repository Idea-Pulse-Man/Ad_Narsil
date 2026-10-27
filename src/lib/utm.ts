export type Utm = { source?: string; medium?: string; campaign?: string; content?: string };

const KEY = "narsil:utm";
const FIELDS = ["source", "medium", "campaign", "content"] as const;

type Query = string | URLSearchParams | Record<string, string | string[] | undefined>;

/** Reads utm_source, utm_medium, utm_campaign and utm_content from a query. */
export function parseUtm(query: Query): Utm {
  const get =
    typeof query === "string" || query instanceof URLSearchParams
      ? ((p) => (k: string) => p.get(k) ?? undefined)(new URLSearchParams(query))
      : (k: string) => {
          const v = query[k];
          return Array.isArray(v) ? v[0] : v;
        };
  const utm: Utm = {};
  for (const f of FIELDS) {
    const v = get(`utm_${f}`)?.trim();
    if (v) utm[f] = v.slice(0, 80);
  }
  return utm;
}

/** On the first page view of a session, keep the visit's UTMs so later clicks are still credited. */
export function captureUtm(): void {
  try {
    const utm = parseUtm(window.location.search);
    if (Object.keys(utm).length && !sessionStorage.getItem(KEY)) {
      sessionStorage.setItem(KEY, JSON.stringify(utm));
    }
  } catch {
    // Storage blocked (private mode, in-app browsers): readUtm falls back to the URL.
  }
}

export function readUtm(): Utm {
  try {
    const saved = sessionStorage.getItem(KEY);
    if (saved) return JSON.parse(saved) as Utm;
  } catch {
    // fall through
  }
  return typeof window === "undefined" ? {} : parseUtm(window.location.search);
}
