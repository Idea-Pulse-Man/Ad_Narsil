/** Mirrors the check constraint on public.site_waitlist (supabase/site_waitlist.sql). */
export const EMAIL_PATTERN = /^[^@\s]+@[^@\s]+\.[^@\s]+$/i;

export type WaitlistInput = { email: string; company?: string; source?: string; campaign?: string };

export type WaitlistResult = "ok" | "honeypot" | "invalid";

const clip = (s: unknown) => (typeof s === "string" && s.trim() ? s.trim().slice(0, 80) : null);

/** Validates a submission; the route handler stores it only when this returns a row. */
export function parseWaitlist(input: Partial<Record<keyof WaitlistInput, unknown>>):
  | { result: "ok"; row: { email: string; source: string | null; campaign: string | null } }
  | { result: Exclude<WaitlistResult, "ok"> } {
  if (typeof input.company === "string" && input.company.trim()) return { result: "honeypot" };
  const email = typeof input.email === "string" ? input.email.trim().toLowerCase() : "";
  if (!email || email.length > 254 || !EMAIL_PATTERN.test(email)) return { result: "invalid" };
  return { result: "ok", row: { email, source: clip(input.source), campaign: clip(input.campaign) } };
}
