/**
 * Extracted by hand from museum-app/src/lib/subscription.ts: only planLabel
 * (the rest of that file drives StoreKit purchases). Keep it in step with the app.
 */
export function planLabel(productId: string | null): string {
  if (!productId) return "The Explorer's Guild";
  if (productId.endsWith(".annual")) return "Annual";
  if (productId.endsWith(".monthly")) return "Monthly";
  return "The Explorer's Guild";
}
