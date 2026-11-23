import { NextRequest } from "next/server";
import { afterEach, describe, expect, it, vi } from "vitest";
import { GET, POST } from "./route";

const JWT = "Bearer eyJhbGciOiJIUzI1NiJ9.eyJzdWIiOiJ4In0.c2lnbmF0dXJl";
const BACKEND = (process.env.NEXT_PUBLIC_API_URL || "https://d2lvgalchu2nps.cloudfront.net").replace(/\/$/, "");

function call(
  handler: typeof GET,
  path: string[],
  init: { method?: string; headers?: Record<string, string>; body?: string; search?: string } = {},
) {
  const req = new NextRequest(`https://site.example/api/admin/${path.join("/")}${init.search ?? ""}`, {
    method: init.method ?? "GET",
    headers: init.headers,
    body: init.body,
  });
  return handler(req, { params: Promise.resolve({ path }) });
}

function mockBackend(response: Response | Error) {
  const fetchMock = vi.fn(async () => {
    if (response instanceof Error) throw response;
    return response;
  });
  vi.stubGlobal("fetch", fetchMock);
  return fetchMock;
}

afterEach(() => {
  vi.unstubAllGlobals();
  vi.restoreAllMocks();
});

describe("/api/admin relay", () => {
  it("forwards to the same backend path with only the token, never cookies or Origin", async () => {
    const fetchMock = mockBackend(Response.json({ runs: [] }, { status: 200 }));
    const res = await call(GET, ["quiz", "engine", "runs"], {
      search: "?limit=5",
      headers: { Authorization: JWT, Cookie: "sb=secret", Origin: "https://evil.example", "X-Forwarded-For": "1.2.3.4" },
    });

    expect(res.status).toBe(200);
    expect(await res.json()).toEqual({ runs: [] });
    expect(res.headers.get("cache-control")).toBe("no-store");

    expect(fetchMock).toHaveBeenCalledTimes(1);
    const [url, init] = fetchMock.mock.calls[0] as unknown as [string, RequestInit];
    expect(url).toBe(`${BACKEND}/api/admin/quiz/engine/runs?limit=5`);
    expect(init.method).toBe("GET");
    expect(init.headers).toEqual({ Authorization: JWT, Accept: "application/json" });
  });

  it("passes a POST body and the backend's status and message through", async () => {
    const fetchMock = mockBackend(Response.json({ message: "Another run is active." }, { status: 409 }));
    const res = await call(POST, ["quiz", "engine", "run"], {
      method: "POST",
      headers: { Authorization: JWT, "Content-Type": "application/json" },
      body: JSON.stringify({ fill_daily: true }),
    });

    expect(res.status).toBe(409);
    expect(await res.json()).toEqual({ message: "Another run is active." });
    const [, init] = fetchMock.mock.calls[0] as unknown as [string, RequestInit];
    expect(init.body).toBe('{"fill_daily":true}');
    expect(init.headers).toMatchObject({ "Content-Type": "application/json" });
  });

  it.each([[[".."]], [["quiz", "..", "stripe"]], [["."]], [["a/b"]], [["%2e%2e"]], [[]]])(
    "refuses path %j without calling the backend",
    async (path) => {
      const fetchMock = mockBackend(Response.json({}));
      const res = await call(GET, path as string[], { headers: { Authorization: JWT } });
      expect(res.status).toBe(404);
      expect(fetchMock).not.toHaveBeenCalled();
    },
  );

  it.each([[undefined], ["Bearer abc"], ["Basic dXNlcjpwYXNz"]])("answers 401 for Authorization %j without calling the backend", async (auth) => {
    const fetchMock = mockBackend(Response.json({}));
    const res = await call(GET, ["printful", "drafts"], { headers: auth ? { Authorization: auth } : {} });
    expect(res.status).toBe(401);
    expect((await res.json()).message).toMatch(/session has expired/);
    expect(fetchMock).not.toHaveBeenCalled();
  });

  it("answers 502 with a readable message when the backend can't be reached", async () => {
    vi.spyOn(console, "error").mockImplementation(() => {});
    mockBackend(new TypeError("fetch failed"));
    const res = await call(GET, ["printful", "drafts"], { headers: { Authorization: JWT } });
    expect(res.status).toBe(502);
    expect((await res.json()).message).toBe("Couldn't reach the Narsil backend.");
  });
});
