import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { Crest } from "@/components/Crest";
import { PageShell } from "@/components/PageShell";
import { Seal } from "@/components/Seal";
import { StoreCta } from "@/components/StoreCta";
import { COPY } from "@/content/copy";
import { VERDICTS, verdictBySlug } from "@/content/verdicts";

type Props = { params: Promise<{ slug: string }> };

export const dynamicParams = false;

export function generateStaticParams() {
  return VERDICTS.map((v) => ({ slug: v.slug }));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const v = verdictBySlug((await params).slug);
  if (!v) return {};
  const title = `${v.title} · The Royal Assessment · Narsil`;
  const description = `The court has spoken: ${v.title}. Think you can do better? Take the five-question Royal Assessment.`;
  return {
    title,
    description,
    alternates: { canonical: `/verdict/${v.slug}` },
    openGraph: { type: "website", siteName: "Narsil", title, description, url: `/verdict/${v.slug}` },
    twitter: { card: "summary_large_image", title, description },
  };
}

/** One page per verdict, the landing for every shared result (brief §9). */
export default async function VerdictPage({ params }: Props) {
  const v = verdictBySlug((await params).slug);
  if (!v) notFound();
  const t = COPY.verdict;

  return (
    <PageShell center>
      <article className="verdict-card placard grid justify-items-center gap-5">
        <Seal size={140} className="seal-stamp" />
        <p className="eyebrow eyebrow-center m-0">{t.eyebrow}</p>
        <h1 className="display-2 m-0 text-gilt-light">{v.title}</h1>
        <p className="lede m-0 max-w-md">{v.message}</p>
        <div className="mt-2 grid justify-items-center gap-3">
          <a href="/quiz" className="btn-gold">
            {t.take}
          </a>
          <p className="fine m-0 max-w-sm">{t.sub}</p>
        </div>
      </article>
      <div className="mt-12 grid justify-items-center gap-4">
        <Crest size={56} className="crest-glow" />
        <StoreCta placement="verdict" align="center" />
        <p className="fine m-0">{COPY.cta.note}</p>
      </div>
    </PageShell>
  );
}
