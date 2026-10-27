import { SITE, type LaunchState } from "@/config/site";
import { COPY } from "@/content/copy";
import { appStoreUrl, resolveCta } from "@/lib/store-links";
import { PlatformCta } from "./PlatformCta";
import { QrCard } from "./QrCard";
import { StoreBadge } from "./StoreBadge";
import { StoreLink } from "./StoreLink";
import { WaitlistForm } from "./WaitlistForm";

type Props = {
  placement: string;
  /** Add the desktop QR card (hero, doors, /get). */
  qr?: boolean;
  align?: "start" | "center";
  state?: LaunchState;
};

/**
 * The CTA for the launch state (brief §7.2, §7.5): the waitlist before
 * launch, otherwise the App Store badge, which Android visitors swap for
 * Google Play or the "iPhone first" fallback.
 */
export function StoreCta({ placement, qr = false, align = "start", state = SITE.launchState }: Props) {
  if (resolveCta("ios", state).kind === "waitlist") return <WaitlistForm placement={placement} align={align} />;

  const badge = state === "live" ? "download" : "preorder";
  const appStore = (
    <StoreLink placement={placement} store="app_store" href={appStoreUrl(placement)} className="inline-block">
      <StoreBadge kind={badge} />
    </StoreLink>
  );
  const android =
    resolveCta("android", state).kind === "play" ? (
      <StoreLink placement={placement} store="play" href={SITE.googlePlayUrl} className="inline-block">
        <StoreBadge kind="play" />
      </StoreLink>
    ) : (
      <IphoneFirst placement={placement} align={align} />
    );

  return (
    <div className={`flex flex-wrap items-center gap-x-8 gap-y-4 ${align === "center" ? "justify-center" : ""}`}>
      <PlatformCta appStore={appStore} android={android} />
      {qr && <QrCard />}
    </div>
  );
}

function IphoneFirst({ placement, align }: { placement: string; align: "start" | "center" }) {
  return (
    <div className="grid gap-3">
      <p className="m-0 text-canvas">
        {COPY.cta.iphoneFirst}{" "}
        <StoreLink placement={placement} store="web" href={SITE.webAppUrl} className="link-gold">
          {COPY.cta.webApp}
        </StoreLink>
      </p>
      <WaitlistForm placement={placement} align={align} />
    </div>
  );
}

/**
 * A gold pill for in-slide CTAs (prints, guild, quiz verdict). Badges appear
 * only in the hero, the doors and /get; before launch the pill leads to the
 * waitlist at the doors.
 */
export function InlineCta({ placement, label, state = SITE.launchState }: { placement: string; label: string; state?: LaunchState }) {
  if (state === "prelaunch") {
    return (
      <a href="#doors" className="btn-gold">
        {COPY.waitlist.submit}
      </a>
    );
  }
  return (
    <StoreLink placement={placement} store="app_store" href={appStoreUrl(placement)} className="btn-gold">
      {label}
    </StoreLink>
  );
}
