import { SITE } from "@/config/site";

type Props = Record<string, string | number | boolean | undefined>;

/** The campaign variant of the current page ("home", "quiz", "prints", "learn"). */
export function currentVariant(): string {
  if (typeof document === "undefined") return "home";
  return document.querySelector<HTMLElement>("[data-variant]")?.dataset.variant ?? "home";
}

/**
 * Sends one event with sendBeacon so it survives the jump to the App Store.
 * text/plain keeps a cross-origin beacon free of a CORS preflight.
 */
export function track(event: string, props: Props = {}): void {
  const body = JSON.stringify({
    event,
    props: { variant: currentVariant(), ...props },
    path: window.location.pathname,
    t: Date.now(),
  });
  const endpoint = SITE.analytics.endpoint;
  if (!endpoint) {
    if (process.env.NODE_ENV !== "production") console.debug("[track]", event, props);
    return;
  }
  try {
    const blob = new Blob([body], { type: "text/plain;charset=UTF-8" });
    if (!navigator.sendBeacon?.(endpoint, blob)) {
      void fetch(endpoint, { method: "POST", body, keepalive: true }).catch(() => {});
    }
  } catch {
    // Analytics must never break a click.
  }
}

/** Server-side twin of track(), for redirects that never reach the browser (/get). */
export async function trackServer(event: string, props: Props): Promise<void> {
  const endpoint = SITE.analytics.endpoint;
  if (!endpoint) return;
  const url = endpoint.startsWith("http") ? endpoint : `${SITE.url}${endpoint}`;
  await fetch(url, {
    method: "POST",
    headers: { "content-type": "text/plain;charset=UTF-8" },
    body: JSON.stringify({ event, props, path: "/get", t: Date.now() }),
  }).catch(() => {});
}
