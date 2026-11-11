"use client";

import type { ReactNode } from "react";
import { SITE } from "@/config/site";
import { currentVariant, track } from "@/lib/analytics";
import { appStoreUrl, detectPlatform, type Store } from "@/lib/store-links";
import { readUtm } from "@/lib/utm";

type Props = {
  placement: string;
  store: Store;
  /** The server's default href: the App Store link without the visitor's UTMs. */
  href: string;
  className?: string;
  children: ReactNode;
};

/**
 * A store link that credits the click. At click time it adds the visitor's
 * UTMs to the App Store campaign token, sends Android visitors to Google Play
 * (or the doors' fallback), opens a new tab on desktop (phones stay in the tab
 * so iOS hands the link to the App Store), and sends cta_click.
 */
export function StoreLink({ placement, store, href, className, children }: Props) {
  return (
    <a
      href={href}
      className={className}
      onClick={(e) => {
        const a = e.currentTarget;
        const platform = detectPlatform(navigator.userAgent, navigator.maxTouchPoints);
        const variant = currentVariant();
        let sent = store;
        if (store === "app_store" && platform === "android") {
          a.href = SITE.googlePlayUrl || "#doors";
          sent = SITE.googlePlayUrl ? "play" : "waitlist";
        } else if (store === "app_store") {
          a.href = appStoreUrl(placement, readUtm(), variant === "home" ? undefined : variant);
        }
        if (platform === "desktop" && !a.getAttribute("href")?.startsWith("#")) {
          a.target = "_blank";
          a.rel = "noopener";
        }
        track("cta_click", { placement, store: sent });
      }}
    >
      {children}
    </a>
  );
}
