import type { NextRequest } from "next/server";

export const runtime = "nodejs";
// A quiz preview can take a while; CloudFront cuts the backend off at 30 s anyway.
export const maxDuration = 60;

/**
 * Same-origin relay for /admin's Narsil backend calls: /api/admin/* here goes
 * to /api/admin/* on the backend.
 *
 * The browser can't call the backend directly: the backend only answers
 * origins on its CORS allow-list, and this site (and every Vercel preview URL
 * it gets) isn't on it. Server to server there is no Origin header, so CORS
 * doesn't apply. Only the bearer token and the JSON body are passed on, never
 * cookies or other headers, and the backend still checks the token and the
 * admin role on every request.
 */
const BACKEND = (process.env.NEXT_PUBLIC_API_URL || "https://d2lvgalchu2nps.cloudfront.net").replace(/\/$/, "");

/** One path segment: no "." / "..", no encoded slashes, nothing exotic. */
const SEGMENT = /^[A-Za-z0-9_~-][A-Za-z0-9._~-]*$/;
/** A Supabase access token is a JWT; anything else never reaches the backend. */
const BEARER = /^Bearer [A-Za-z0-9_-]+\.[A-Za-z0-9_-]+\.[A-Za-z0-9_-]+$/;

const NO_STORE = { "Cache-Control": "no-store" };

type Context = { params: Promise<{ path: string[] }> };

async function relay(req: NextRequest, { params }: Context): Promise<Response> {
  const { path } = await params;
  if (path.length === 0 || !path.every((s) => SEGMENT.test(s))) {
    return Response.json({ error: "Not Found", message: "Not found." }, { status: 404, headers: NO_STORE });
  }

  const auth = req.headers.get("authorization") ?? "";
  if (!BEARER.test(auth)) {
    return Response.json(
      { error: "Unauthorized", message: "Your session has expired — sign in again." },
      { status: 401, headers: NO_STORE },
    );
  }

  const headers: Record<string, string> = { Authorization: auth, Accept: "application/json" };
  let body: string | undefined;
  if (req.method === "POST") {
    body = await req.text();
    headers["Content-Type"] = req.headers.get("content-type") ?? "application/json";
  }

  let upstream: Response;
  try {
    upstream = await fetch(`${BACKEND}/api/admin/${path.join("/")}${req.nextUrl.search}`, {
      method: req.method,
      headers,
      body,
      cache: "no-store",
      redirect: "manual",
      signal: AbortSignal.timeout(55_000),
    });
  } catch (err) {
    const timedOut = err instanceof Error && err.name === "TimeoutError";
    console.error("admin relay: backend unreachable", BACKEND, err);
    return Response.json(
      {
        error: "Bad Gateway",
        message: timedOut ? "The Narsil backend took too long to answer." : "Couldn't reach the Narsil backend.",
      },
      { status: timedOut ? 504 : 502, headers: NO_STORE },
    );
  }

  const empty = upstream.status === 204 || upstream.status === 205 || upstream.status === 304;
  return new Response(empty ? null : await upstream.arrayBuffer(), {
    status: upstream.status,
    headers: {
      ...NO_STORE,
      "Content-Type": upstream.headers.get("content-type") ?? "application/json",
    },
  });
}

export const GET = relay;
export const POST = relay;
