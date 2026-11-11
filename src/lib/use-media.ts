import { useSyncExternalStore } from "react";

/** A media query as React state; `server` is the value during SSR and hydration. */
export function useMedia(query: string, server = false): boolean {
  return useSyncExternalStore(
    (onChange) => {
      const m = window.matchMedia(query);
      m.addEventListener("change", onChange);
      return () => m.removeEventListener("change", onChange);
    },
    () => window.matchMedia(query).matches,
    () => server,
  );
}

export const useReducedMotion = () => useMedia("(prefers-reduced-motion: reduce)");
