import { Exhibition } from "@/components/Exhibition";
import { COPY } from "@/content/copy";
import { variantMetadata } from "@/lib/variant-page";

const v = COPY.variants.learn;
export const metadata = variantMetadata("/learn", v.metaTitle, v.sub);

/** For ads about learning, students and parents: the Ages come straight after the entrance (brief §8). */
export default function LearnPage() {
  return <Exhibition variant="learn" />;
}
