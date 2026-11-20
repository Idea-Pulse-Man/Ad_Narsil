import { COPY } from "@/content/copy";
import { VERDICTS, verdictBySlug } from "@/content/verdicts";
import { OG_SIZE, ogVerdict } from "@/lib/og";

export const alt = "The Royal Assessment's verdict, under a wax seal · Narsil";
export const size = OG_SIZE;
export const contentType = "image/png";

export function generateStaticParams() {
  return VERDICTS.map((v) => ({ slug: v.slug }));
}

/** 1200×630 per verdict, made at build time (brief §9). */
export default async function Image({ params }: { params: Promise<{ slug: string }> }) {
  const v = verdictBySlug((await params).slug) ?? VERDICTS[0];
  return ogVerdict({ eyebrow: COPY.verdict.eyebrow, title: v.title, line: COPY.verdict.ogLine });
}
