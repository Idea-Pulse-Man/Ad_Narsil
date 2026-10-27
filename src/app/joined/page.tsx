import type { Metadata } from "next";
import { Crest } from "@/components/Crest";
import { PageShell } from "@/components/PageShell";
import { COPY } from "@/content/copy";

export const metadata: Metadata = { title: "The waitlist · Narsil", robots: { index: false } };

/** Where the waitlist form lands without JavaScript. */
export default async function Joined({ searchParams }: { searchParams: Promise<{ error?: string }> }) {
  const failed = Boolean((await searchParams).error);
  const t = COPY.joined;
  return (
    <PageShell center>
      <div className="grid justify-items-center gap-6">
        <Crest size={112} className="crest-glow" />
        <h1 className="display-2">{failed ? t.errorTitle : t.title}</h1>
        <p className="lede">{failed ? t.errorSub : t.sub}</p>
        <a href={failed ? "/#doors" : "/"} className="link-gold">
          {t.back}
        </a>
      </div>
    </PageShell>
  );
}
