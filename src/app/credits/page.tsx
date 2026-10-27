import type { Metadata } from "next";
import { PageShell } from "@/components/PageShell";
import { ARTWORKS } from "@/content/art";
import { COPY } from "@/content/copy";

export const metadata: Metadata = {
  title: "Credits · Narsil",
  description: COPY.credits.sub,
  alternates: { canonical: "/credits" },
};

/** Generated from src/content/artworks.json (brief §2.3, §16). */
export default function Credits() {
  return (
    <PageShell>
      <h1 className="display-2">{COPY.credits.title}</h1>
      <p className="lede mt-5">{COPY.credits.sub}</p>
      <ul className="mt-12 grid list-none gap-4 p-0">
        {ARTWORKS.map((w) => (
          <li key={w.slug} className="placard p-5">
            <p className="m-0 font-serif text-xl italic text-canvas">{w.title}</p>
            <p className="fine mt-1">
              {w.artist}, {w.date} · {w.medium}
            </p>
            <p className="fine mt-1">
              {w.museum}, {w.accession} · {w.license} ·{" "}
              <a href={w.sourceUrl} className="link-gold" rel="noopener">
                Source
              </a>
            </p>
          </li>
        ))}
      </ul>
      <p className="fine mt-10">{COPY.footer.museums}</p>
    </PageShell>
  );
}
