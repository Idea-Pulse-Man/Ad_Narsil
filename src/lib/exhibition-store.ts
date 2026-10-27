import { useSyncExternalStore } from "react";

/** Page state shared by the header, room rail, story bar and sticky CTA. ExhibitionController writes it. */
export type ExhibitionState = {
  /** Index of the slide at least half on screen. */
  active: number;
  /** The hero's or the final slide's own CTA is on screen. */
  heroCtaVisible: boolean;
  doorsCtaVisible: boolean;
  /** Scrolled past 80 px. */
  scrolled: boolean;
};

const initial: ExhibitionState = { active: 0, heroCtaVisible: true, doorsCtaVisible: false, scrolled: false };
let state = initial;
const listeners = new Set<() => void>();

export const exhibition = {
  get: () => state,
  set(patch: Partial<ExhibitionState>) {
    const next = { ...state, ...patch };
    if ((Object.keys(patch) as (keyof ExhibitionState)[]).every((k) => next[k] === state[k])) return;
    state = next;
    for (const l of listeners) l();
  },
  subscribe(l: () => void) {
    listeners.add(l);
    return () => void listeners.delete(l);
  },
};

export function useExhibition<T>(select: (s: ExhibitionState) => T): T {
  return useSyncExternalStore(
    exhibition.subscribe,
    () => select(state),
    () => select(initial),
  );
}
