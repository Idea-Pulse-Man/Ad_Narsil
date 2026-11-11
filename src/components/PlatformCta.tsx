"use client";

import { useSyncExternalStore, type ReactNode } from "react";

const noSubscribe = () => () => {};

/**
 * The server renders the App Store CTA; Android visitors get theirs after
 * hydration. The wrapper keeps the badge's height so nothing shifts.
 */
export function PlatformCta({ appStore, android }: { appStore: ReactNode; android: ReactNode }) {
  const isAndroid = useSyncExternalStore(
    noSubscribe,
    () => /Android/.test(navigator.userAgent),
    () => false,
  );
  return <div className="min-h-12">{isAndroid ? android : appStore}</div>;
}
