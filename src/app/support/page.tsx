import type { Metadata } from "next";
import { PageShell } from "@/components/PageShell";
import { SITE } from "@/config/site";
import { COPY } from "@/content/copy";

export const metadata: Metadata = {
  title: "Support · Narsil",
  description: COPY.support.sub,
  alternates: { canonical: "/support" },
};

/** Can double as the App Store Connect Support URL (brief §16). */
export default function Support() {
  const topics = [
    {
      q: "Contact us",
      a: (
        <>
          Email{" "}
          <a href={`mailto:${SITE.supportEmail}`} className="link-gold">
            {SITE.supportEmail}
          </a>
          .
        </>
      ),
    },
    { q: "Cancel The Explorer's Guild", a: "iPhone Settings → your name → Subscriptions, at least 24 hours before it renews." },
    { q: "Delete your account", a: "In the app: Profile → Delete account." },
    { q: "Print orders", a: "In the app: Profile → Print orders. Prints ship to US addresses only." },
  ];
  return (
    <PageShell>
      <h1 className="display-2">{COPY.support.title}</h1>
      <p className="lede mt-5">{COPY.support.sub}</p>
      <dl className="mt-12 grid gap-4">
        {topics.map((t) => (
          <div key={t.q} className="placard p-5">
            <dt className="font-serif text-xl text-canvas">{t.q}</dt>
            <dd className="lede m-0 mt-2 text-[16px]">{t.a}</dd>
          </div>
        ))}
      </dl>
      <p className="fine mt-10">
        More answers in the{" "}
        <a href="/#faq" className="link-gold">
          FAQ
        </a>
        .
      </p>
    </PageShell>
  );
}
