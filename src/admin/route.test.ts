import { describe, expect, it } from "vitest";
import { buildRoute, parseRoute, SECTIONS, sectionRoute, type Route } from "./route";

describe("admin hash routes", () => {
  const cases: [string, Route][] = [
    ["#overview", { section: "overview" }],
    ["#users", { section: "users" }],
    ["#quiz/bank", { section: "quiz", sub: "bank" }],
    ["#quiz/daily", { section: "quiz", sub: "daily" }],
    ["#quiz/styles", { section: "quiz", sub: "styles" }],
    ["#news", { section: "news" }],
    ["#orders", { section: "orders", status: null }],
    ["#orders?status=paid", { section: "orders", status: "paid" }],
    ["#artworks?filter=pending", { section: "artworks", filter: "pending" }],
    ["#inbox", { section: "inbox", userId: null }],
    ["#inbox/0b6f3c1e-2a4d-4f7a-9c1e-1234567890ab", { section: "inbox", userId: "0b6f3c1e-2a4d-4f7a-9c1e-1234567890ab" }],
    ["#insights", { section: "insights" }],
  ];

  it.each(cases)("parses %s and builds it back", (hash, route) => {
    expect(parseRoute(hash)).toEqual(route);
    expect(buildRoute(route)).toBe(hash);
  });

  it("falls back to Overview for empty or unknown hashes", () => {
    expect(parseRoute("")).toEqual({ section: "overview" });
    expect(parseRoute("#")).toEqual({ section: "overview" });
    expect(parseRoute("#nope")).toEqual({ section: "overview" });
  });

  it("defaults the quiz sub-section to the topic bank", () => {
    expect(parseRoute("#quiz")).toEqual({ section: "quiz", sub: "bank" });
    expect(parseRoute("#quiz/other")).toEqual({ section: "quiz", sub: "bank" });
  });

  it("drops params that aren't plain slugs", () => {
    expect(parseRoute("#orders?status=<script>")).toEqual({ section: "orders", status: null });
    expect(parseRoute("#inbox/a%2Fb")).toEqual({ section: "inbox", userId: null });
  });

  it("ignores Supabase's OAuth params if they ever land in the hash", () => {
    expect(parseRoute("#users?code=abc")).toEqual({ section: "users" });
  });

  it("round-trips every section's plain route", () => {
    for (const s of SECTIONS) expect(parseRoute(buildRoute(sectionRoute(s)))).toEqual(sectionRoute(s));
  });
});
