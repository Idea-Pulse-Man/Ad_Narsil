import type { Metadata } from "next";
import { headers } from "next/headers";
import { redirect } from "next/navigation";
import { after } from "next/server";
import { Crest } from "@/components/Crest";
import { PageShell } from "@/components/PageShell";
import { StoreCta } from "@/components/StoreCta";
import { SITE } from "@/config/site";
import { COPY } from "@/content/copy";
import { trackServer } from "@/lib/analytics";
import { appStoreUrl, resolveGet } from "@/lib/store-links";
import { parseUtm } from "@/lib/utm";

export const metadata: Metadata = {
  title: "Get Narsil",
  alternates: { canonical: "/" },
  robots: { index: false },
};

type Search = Record<string, string | string[] | undefined>;

/**
 * One link for every ad, bio, QR code and flyer: /get?c=<campaign> (brief §7.4).
 * iPhones go straight to the App Store from the server, so nothing waits on a
 * script; the click is reported after the response.
 */
export default async function GetPage({ searchParams }: { searchParams: Promise<Search> }) {
  const query = await searchParams;
  const campaign = typeof query.c === "string" ? query.c.slice(0, 80) : undefined;
  const utm = parseUtm(query);
  const action = resolveGet((await headers()).get("user-agent") ?? "", utm, campaign);

  if (action.kind === "redirect") {
    after(() => trackServer("cta_click", { placement: "get", store: action.store, campaign }));
    redirect(action.url);
  }

  // iPadOS reports itself as a Mac; only touch support gives it away.
  const ipadUrl = SITE.launchState === "prelaunch" ? null : appStoreUrl("get", { ...utm, campaign: utm.campaign ?? campaign });

  return (
    <PageShell center>
      {ipadUrl && (
        <script
          dangerouslySetInnerHTML={{
            __html: `if(/Macintosh/.test(navigator.userAgent)&&navigator.maxTouchPoints>1)location.replace(${JSON.stringify(ipadUrl)})`,
          }}
        />
      )}
      <div className="is-in grid justify-items-center gap-6">
        <Crest size={112} className="crest-glow crest-breathe" />
        <p className="eyebrow eyebrow-center">{COPY.entrance.eyebrow}</p>
        <h1 className="display-2">{COPY.get.title}</h1>
        <p className="lede">{COPY.get.sub}</p>
        <div className="cta-frame w-full">
          <StoreCta placement="get" qr align="center" />
          <p className="fine mt-3">{COPY.cta.note}</p>
        </div>
        <noscript>
          <p className="fine">
            {COPY.get.noscript}:{" "}
            {SITE.appStore.id && SITE.launchState !== "prelaunch" && (
              <>
                <a className="link-gold" href={appStoreUrl("get")}>
                  App Store
                </a>{" "}
                ·{" "}
              </>
            )}
            {SITE.googlePlayUrl && (
              <>
                <a className="link-gold" href={SITE.googlePlayUrl}>
                  Google Play
                </a>{" "}
                ·{" "}
              </>
            )}
            <a className="link-gold" href={SITE.webAppUrl}>
              Web app
            </a>
          </p>
        </noscript>
      </div>
    </PageShell>
  );
}
