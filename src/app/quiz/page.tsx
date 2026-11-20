import { Exhibition } from "@/components/Exhibition";
import { COPY } from "@/content/copy";
import { variantMetadata } from "@/lib/variant-page";

const v = COPY.variants.quiz;
export const metadata = variantMetadata("/quiz", v.metaTitle, v.sub);

/** For ads about the quiz and its verdicts: the Royal Assessment is the hero (brief §8). */
export default function QuizPage() {
  return <Exhibition variant="quiz" />;
}
