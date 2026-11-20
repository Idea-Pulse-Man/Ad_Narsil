import { existsSync } from "node:fs";
import { execFileSync } from "node:child_process";
import path from "node:path";
import { describe, expect, it } from "vitest";
import { extractDeclarations, transform, type MirrorSpec } from "../../scripts/sync-admin-lib.ts";

const spec = (over: Partial<MirrorSpec> = {}): MirrorSpec => ({ from: "lib/admin.ts", to: "admin.ts", ...over });

describe("sync-admin-lib transform", () => {
  it("swaps ngrokFetch for fetch and drops the import", () => {
    const out = transform(spec(), 'import { ngrokFetch } from "./ngrok";\nconst r = await ngrokFetch(url);\n');
    expect(out).not.toMatch(/ngrok/i);
    expect(out).toContain("await fetch(url)");
  });

  it("rewrites app aliases to the mirrored relative paths", () => {
    const out = transform(spec(), 'import { supabase } from "@/lib/supabase";\nimport type { UserRole } from "@/data/types";\n');
    expect(out).toContain('from "./supabase"');
    expect(out).toContain('from "./types"');
  });

  it("maps Vite env vars to Next public env vars", () => {
    expect(transform(spec(), "const x = import.meta.env.VITE_SUPPORT_EMAIL;\n")).toContain("process.env.NEXT_PUBLIC_SUPPORT_EMAIL");
  });

  it("refuses modules the web admin can't use", () => {
    expect(() => transform(spec(), 'import { Capacitor } from "@capacitor/core";\n')).toThrow(/can't use/);
    expect(() => transform(spec(), 'import { x } from "./catalog";\n')).toThrow(/isn't mirrored/);
  });

  it("leaves prose that looks like an import alone", () => {
    const src = '/** Tell "nothing here" apart from "the query failed". */\nexport const a = 1;\n';
    expect(transform(spec(), src)).toContain(src);
  });

  it("fails when a patch no longer matches the app's file", () => {
    const patched = spec({ patches: [{ find: "old()", replace: "new()", why: "test" }] });
    expect(transform(patched, "old();\n")).toContain("new();");
    expect(() => transform(patched, "changed();\n")).toThrow(/matched 0 times/);
  });

  it("extracts single declarations with their doc comments", () => {
    const src = 'export interface A {\n  a: 1;\n}\n\n/** Role. */\nexport type UserRole = "user" | "admin";\n\nexport type B = 2;\n';
    expect(extractDeclarations(src, ["UserRole"])).toBe('/** Role. */\nexport type UserRole = "user" | "admin";\n');
  });

  it("adds the mirrored-from header", () => {
    expect(transform(spec(), "export {};\n")).toMatch(/^\/\/ Mirrored from museum-app\/src\/lib\/admin\.ts/);
  });
});

// The real drift check needs the app's source next to this repo.
const appDir = process.env.MUSEUM_APP_DIR ?? "E:/Project-dev/museum-app";
describe.skipIf(!existsSync(path.join(appDir, "src")))("admin:check", () => {
  it("mirrored lib matches museum-app", () => {
    expect(() => execFileSync(process.execPath, ["scripts/sync-admin-lib.ts", "--check"], { stdio: "pipe" })).not.toThrow();
  });
});
