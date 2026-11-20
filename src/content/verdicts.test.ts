import { describe, expect, it } from "vitest";
import { QUIZ_BANK, QUIZ_LENGTH, quizSlugs } from "./quiz";
import manifest from "./artworks.json";
import { VERDICTS, verdictFor, verdictShareText, verdictShareUrl } from "./verdicts";

describe("verdictFor", () => {
  it("uses the app's formula, round(score / total × 7)", () => {
    expect([0, 1, 2, 3, 4, 5].map((s) => verdictFor(s, 5).rank)).toEqual([0, 1, 3, 4, 6, 7]);
    expect(verdictFor(10, 10).title).toBe("Ascended to the Throne");
    expect(verdictFor(4, 5).title).toBe("Knighted by the Crown");
    expect(verdictFor(2, 5).title).toBe("Placed in the Stocks");
  });

  it("clamps out-of-range scores", () => {
    expect(verdictFor(-1, 5).rank).toBe(0);
    expect(verdictFor(9, 5).rank).toBe(7);
    expect(verdictFor(0, 0).rank).toBe(0);
  });

  it("has eight verdicts with unique, URL-safe slugs", () => {
    expect(VERDICTS.map((v) => v.rank)).toEqual([0, 1, 2, 3, 4, 5, 6, 7]);
    expect(new Set(VERDICTS.map((v) => v.slug)).size).toBe(8);
    for (const v of VERDICTS) expect(v.slug).toMatch(/^[a-z-]+$/);
  });

  it("never promises a prize or a Guild perk", () => {
    for (const v of VERDICTS) expect(v.message).not.toMatch(/treasure|prize|reward|Guild/i);
  });
});

describe("share", () => {
  it("links to the verdict page with the share campaign", () => {
    expect(verdictShareUrl("https://narsil.app/", "set-ablaze")).toBe(
      "https://narsil.app/verdict/set-ablaze?utm_source=share&utm_campaign=verdict",
    );
    expect(verdictShareText(VERDICTS[6])).toBe("The court has spoken: I was Knighted by the Crown. Think you can do better?");
  });
});

describe("quiz bank", () => {
  const slugs = new Set(manifest.map((w) => w.slug));
  const wellcome = new Set(manifest.filter((w) => /wellcome/i.test(w.museum)).map((w) => w.slug));

  it("draws from enough questions, all on catalog works this site hosts (never Wellcome)", () => {
    expect(QUIZ_BANK.length).toBeGreaterThanOrEqual(QUIZ_LENGTH * 2);
    for (const q of QUIZ_BANK)
      for (const s of quizSlugs(q)) {
        expect(slugs.has(s), s).toBe(true);
        expect(wellcome.has(s), s).toBe(false);
      }
  });

  it("has a valid answer for every question", () => {
    for (const q of QUIZ_BANK) {
      if (q.style === "who") {
        expect(q.options).toHaveLength(4);
        expect(q.options[q.answer]).toBeDefined();
      }
    }
  });
});
