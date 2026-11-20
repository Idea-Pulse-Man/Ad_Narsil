import { Exhibition } from "@/components/Exhibition";
import { COPY } from "@/content/copy";
import { variantMetadata } from "@/lib/variant-page";

const v = COPY.variants.prints;
export const metadata = variantMetadata("/prints", v.metaTitle, v.sub);

/** For ads about prints, gifts and home decor: Acquisitions comes straight after the entrance (brief §8). */
export default function PrintsPage() {
  return <Exhibition variant="prints" />;
}
