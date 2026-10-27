import { createClient } from "@supabase/supabase-js";
import { NextResponse, type NextRequest } from "next/server";
import { parseWaitlist } from "@/lib/waitlist";

export const runtime = "nodejs";

/**
 * POST /api/waitlist (brief §7.9). JSON from the form's script, or a plain
 * form post without JavaScript (answered with a redirect to /joined).
 * Honeypot hits and duplicate emails both look like success, so the
 * response never reveals whether an address is already on the list.
 */
export async function POST(req: NextRequest) {
  const isJson = req.headers.get("content-type")?.includes("application/json") ?? false;
  const reply = (status: 200 | 400 | 503, error?: string) =>
    isJson
      ? NextResponse.json(error ? { ok: false, error } : { ok: true }, { status })
      : NextResponse.redirect(new URL(error === "email" ? "/joined?error=email" : "/joined", req.url), 303);

  let body: Record<string, unknown>;
  try {
    body = isJson ? await req.json() : Object.fromEntries(await req.formData());
  } catch {
    return reply(400, "email");
  }

  const parsed = parseWaitlist(body);
  if (parsed.result !== "ok") return parsed.result === "honeypot" ? reply(200) : reply(400, "email");

  const url = process.env.SUPABASE_URL;
  const key = process.env.SUPABASE_ANON_KEY;
  if (!url || !key) {
    console.error("waitlist: SUPABASE_URL and SUPABASE_ANON_KEY are not set");
    return reply(503, "unavailable");
  }

  // The anon key can only insert (RLS); returning nothing keeps it that way.
  const supabase = createClient(url, key, { auth: { persistSession: false, autoRefreshToken: false } });
  const { error } = await supabase.from("site_waitlist").insert(parsed.row);
  if (error && error.code !== "23505") {
    console.error("waitlist: insert failed", error.code, error.message);
    return reply(503, "unavailable");
  }
  return reply(200);
}
