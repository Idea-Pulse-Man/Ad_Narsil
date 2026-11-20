"use client";

import { useEffect, useRef, useSyncExternalStore } from "react";
import { buildRoute, parseRoute, type Route } from "./route";

/**
 * Run `fn` now and every `ms` while the tab is visible (admin brief §7):
 * polling pauses when the tab is hidden and runs at once when it's back.
 */
export function usePoll(fn: () => void | Promise<unknown>, ms: number, enabled = true): void {
  const latest = useRef(fn);
  useEffect(() => {
    latest.current = fn;
  });

  useEffect(() => {
    if (!enabled) return;
    let id = 0;
    const tick = () => void latest.current();
    const start = () => {
      window.clearInterval(id);
      tick();
      id = window.setInterval(tick, ms);
    };
    const onVisibility = () => {
      if (document.visibilityState === "visible") start();
      else window.clearInterval(id);
    };
    if (document.visibilityState === "visible") start();
    document.addEventListener("visibilitychange", onVisibility);
    return () => {
      window.clearInterval(id);
      document.removeEventListener("visibilitychange", onVisibility);
    };
  }, [ms, enabled]);
}

function subscribeHash(onChange: () => void): () => void {
  window.addEventListener("hashchange", onChange);
  return () => window.removeEventListener("hashchange", onChange);
}

/** The current hash route; `navigate` pushes a history entry so back / forward work. */
export function useHashRoute(): [Route, (next: Route) => void] {
  const hash = useSyncExternalStore(subscribeHash, () => window.location.hash, () => "");
  const route = parseRoute(hash);

  // Normalise "" or a junk hash to the canonical one without adding a history entry.
  useEffect(() => {
    const canonical = buildRoute(parseRoute(hash));
    if (hash !== canonical) {
      history.replaceState(history.state, "", `${window.location.pathname}${window.location.search}${canonical}`);
      window.dispatchEvent(new HashChangeEvent("hashchange"));
    }
  }, [hash]);

  const navigate = (next: Route) => {
    const target = buildRoute(next);
    if (window.location.hash !== target) window.location.hash = target;
  };
  return [route, navigate];
}
