import { SEAL_SRC } from "@/lib/seal";

/** The court's wax seal. Decorative: the verdict's words carry the meaning. */
export function Seal({ size = 120, className = "" }: { size?: number; className?: string }) {
  return <img src={SEAL_SRC} width={size} height={size} alt="" className={className} draggable={false} />;
}
