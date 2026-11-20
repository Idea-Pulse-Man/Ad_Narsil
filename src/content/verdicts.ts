/**
 * The court's verdicts (brief Appendix C, from the app's APPRAISAL_RANKS).
 * Rank 7 differs from the app on purpose: no "Claim your treasure" (no prize
 * exists), and "the archives" in place of the Explorer's Guild.
 */
export type Verdict = { rank: number; slug: string; title: string; message: string };

export const VERDICTS: Verdict[] = [
  {
    rank: 0,
    slug: "exiled-to-the-wastelands",
    title: "Exiled to the Wastelands",
    message:
      "An absolute disgrace. Your ignorance has deeply offended the court. You have been stripped of your lands and banished from the kingdom.",
  },
  {
    rank: 1,
    slug: "set-ablaze",
    title: "Set Ablaze",
    message:
      "A catastrophic failure. Your assessment was deemed heretical, and you have been sentenced to the pyre. May the flames cleanse your terrible taste.",
  },
  {
    rank: 2,
    slug: "imprisoned-in-the-dungeon",
    title: "Imprisoned in the Dungeon",
    message:
      "A dismal performance. The guards have seized you. You are locked in the dampest cell of the royal dungeon to reflect on your lack of culture.",
  },
  {
    rank: 3,
    slug: "placed-in-the-stocks",
    title: "Placed in the Stocks",
    message:
      "A thoroughly embarrassing display. Your poor eye for the archives is now public knowledge. Prepare to be mocked by the village peasantry.",
  },
  {
    rank: 4,
    slug: "demoted-to-peasant",
    title: "Demoted to Peasant",
    message:
      "An utterly mediocre appraisal. You are unworthy of the court, stripped of your noble titles, and returned to the fields to till the earth.",
  },
  {
    rank: 5,
    slug: "granted-an-audience",
    title: "Granted an Audience",
    message:
      "A highly respectable assessment. You survived the trial and the Sovereign permits you to safely browse the artifacts within The Gallery.",
  },
  {
    rank: 6,
    slug: "knighted-by-the-crown",
    title: "Knighted by the Crown",
    message: "A masterful display of historical knowledge. You are hereby dubbed a true Knight of the Archives.",
  },
  {
    rank: 7,
    slug: "ascended-to-the-throne",
    title: "Ascended to the Throne",
    message: "Flawless perfection. The crown is yours. You rule the archives with absolute authority.",
  },
];

/** The app's formula: rank = round(score / total × 7). */
export function verdictFor(score: number, total: number): Verdict {
  const rank = total > 0 ? Math.round((Math.max(0, Math.min(score, total)) / total) * 7) : 0;
  return VERDICTS[rank];
}

export const verdictBySlug = (slug: string) => VERDICTS.find((v) => v.slug === slug);

/** The link a visitor shares: the verdict page, credited to the share loop (brief §9). */
export function verdictShareUrl(origin: string, slug: string): string {
  return `${origin.replace(/\/$/, "")}/verdict/${slug}?utm_source=share&utm_campaign=verdict`;
}

export const verdictShareText = (v: Verdict) => `The court has spoken: I was ${v.title}. Think you can do better?`;
