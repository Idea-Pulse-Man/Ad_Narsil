import { describe, expect, it } from "vitest";
import { parseWaitlist } from "./waitlist";

describe("parseWaitlist", () => {
  it("accepts a valid email, trimmed and lowercased", () => {
    expect(parseWaitlist({ email: "  Ada@Example.com ", source: "ig", campaign: "ig_launch1_hero" })).toEqual({
      result: "ok",
      row: { email: "ada@example.com", source: "ig", campaign: "ig_launch1_hero" },
    });
  });

  it("rejects malformed emails", () => {
    for (const email of ["", "ada", "ada@", "@example.com", "ada@example", "a da@example.com", `${"a".repeat(250)}@x.com`, 42]) {
      expect(parseWaitlist({ email })).toEqual({ result: "invalid" });
    }
  });

  it("treats a filled honeypot as a bot, before anything else", () => {
    expect(parseWaitlist({ email: "ada@example.com", company: "Acme" })).toEqual({ result: "honeypot" });
    expect(parseWaitlist({ email: "nonsense", company: "Acme" })).toEqual({ result: "honeypot" });
  });

  it("clips source and campaign to 80 characters and drops empty ones", () => {
    const parsed = parseWaitlist({ email: "ada@example.com", source: "x".repeat(200), campaign: "  " });
    expect(parsed).toEqual({ result: "ok", row: { email: "ada@example.com", source: "x".repeat(80), campaign: null } });
  });
});
