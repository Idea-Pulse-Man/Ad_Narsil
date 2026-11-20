/**
 * Mirrors the app's admin data layer into src/admin/lib (admin brief §3).
 *
 *   npm run admin:sync    write the mirrored files
 *   npm run admin:check   fail if any mirrored file differs from what sync would write
 *
 * The app's lib/ is the spec: these files encode rules learned the hard way
 * (throw instead of returning empty data, a 0-row update means "rejected",
 * LIKE escaping, shipped_at kept in step with status). So they are copied, not
 * rewritten, and only these mechanical rewrites are applied:
 *   - ngrokFetch → fetch (the ngrok import is dropped)
 *   - @/lib/… and @/data/… imports → the mirrored relative paths
 *   - import.meta.env.VITE_X → process.env.NEXT_PUBLIC_X
 *   - the patches listed per file below, each of which must match exactly once
 * supabase.ts and api.ts are written for the web by hand and never mirrored.
 *
 * Source: MUSEUM_APP_DIR (default E:/Project-dev/museum-app).
 */

import { existsSync, mkdirSync, readFileSync, readdirSync, writeFileSync } from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

export interface Patch {
  find: string;
  replace: string;
  why: string;
}

export interface MirrorSpec {
  /** Path under museum-app/src/. */
  from: string;
  /** Path under src/admin/lib/. */
  to: string;
  /** Copy only these top-level exported declarations (the rest of the file is app-only). */
  extract?: string[];
  patches?: Patch[];
}

export const MIRRORS: MirrorSpec[] = [
  {
    from: "lib/admin.ts",
    to: "admin.ts",
    patches: [
      {
        why: "the recovery link must open the member app, not the ad site (admin brief §4.3)",
        find: 'import { API_URL } from "./api";',
        replace: 'import { API_URL, APP_WEB_URL } from "./api";',
      },
      {
        why: "the recovery link must open the member app, not the ad site (admin brief §4.3)",
        find: '  const redirectTo =\n    typeof window !== "undefined" ? window.location.origin : undefined;',
        replace: "  // Web admin: send the member to the app, not to the ad website.\n  const redirectTo = APP_WEB_URL;",
      },
    ],
  },
  { from: "lib/support.ts", to: "support.ts" },
  { from: "lib/orders.ts", to: "orders.ts" },
  { from: "lib/news.ts", to: "news.ts" },
  { from: "lib/quizBank.ts", to: "quizBank.ts" },
  { from: "lib/dailyQuiz.ts", to: "dailyQuiz.ts" },
  { from: "lib/quizEngineAdmin.ts", to: "quizEngineAdmin.ts" },
  { from: "lib/imageUrl.ts", to: "imageUrl.ts" },
  { from: "lib/quiz/types.ts", to: "quiz/types.ts" },
  { from: "lib/quiz/random.ts", to: "quiz/random.ts" },
  { from: "lib/quiz/engine/types.ts", to: "quiz/engine/types.ts" },
  { from: "data/types.ts", to: "types.ts" },
  { from: "data/history.ts", to: "history.ts" },
];

/**
 * Hand-written for the web; mirrored files import these in place of the app's.
 * The last four are extracts: the app's modules pull in the member app
 * (catalog, storage, StoreKit), so only what the admin uses is kept, by hand.
 */
export const WEB_OWNED: Record<string, string> = {
  "lib/supabase.ts": "supabase.ts",
  "lib/api.ts": "api.ts",
  "data/index.ts": "data.ts",
  "lib/quiz/topic.ts": "quiz/topic.ts",
  "lib/quiz/engine/fetch.ts": "quiz/engine/fetch.ts",
  "lib/subscription.ts": "subscription.ts",
};

/** npm packages a mirrored file may import. Anything else (Capacitor…) fails the sync. */
const ALLOWED_PACKAGES = new Set(["@supabase/supabase-js"]);

const HEADER = (from: string, extract?: string[]) =>
  `// Mirrored from museum-app/src/${from} by scripts/sync-admin-lib.ts — edit the app's file, then re-run the sync.\n` +
  (extract ? `// Extracted: ${extract.join(", ")} (the rest of the file is app-only).\n` : "");

/** Keep only the named `export type` / `export interface` declarations, with their doc comments. */
export function extractDeclarations(source: string, names: string[]): string {
  const lines = source.split("\n");
  const blocks: string[] = [];
  for (const name of names) {
    const start = lines.findIndex((l) => new RegExp(`^export (type|interface) ${name}\\b`).test(l));
    if (start === -1) throw new Error(`extract: "${name}" not found`);
    let first = start;
    if (lines[first - 1]?.trim().endsWith("*/")) {
      while (first > 0 && !lines[first].trimStart().startsWith("/**")) first--;
    }
    let end = start;
    if (lines[start].startsWith("export interface")) {
      while (end < lines.length && lines[end] !== "}") end++;
    } else {
      while (end < lines.length && !lines[end].trimEnd().endsWith(";")) end++;
    }
    blocks.push(lines.slice(first, end + 1).join("\n"));
  }
  return blocks.join("\n\n") + "\n";
}

function resolveAppModule(fromFile: string, specifier: string): string | null {
  const base = specifier.startsWith("@/")
    ? specifier.slice(2)
    : path.posix.join(path.posix.dirname(fromFile), specifier);
  return [`${base}.ts`, `${base}.tsx`, `${base}/index.ts`].find((p) => p in WEB_OWNED || MIRRORS.some((m) => m.from === p)) ?? null;
}

function mirroredPath(appModule: string): string {
  return WEB_OWNED[appModule] ?? MIRRORS.find((m) => m.from === appModule)!.to;
}

/** Pure transform: app source → mirrored web source. Throws when a rewrite can't be applied safely. */
export function transform(spec: MirrorSpec, raw: string): string {
  let src = raw.replace(/\r\n/g, "\n");
  if (spec.extract) src = extractDeclarations(src, spec.extract);

  for (const patch of spec.patches ?? []) {
    const hits = src.split(patch.find).length - 1;
    if (hits !== 1) {
      throw new Error(
        `${spec.from}: patch for "${patch.why}" matched ${hits} times — the app's file changed; update the patch in scripts/sync-admin-lib.ts`,
      );
    }
    src = src.replace(patch.find, patch.replace);
  }

  src = src.replace(/^import \{[^}]*\} from "(?:\.\/|@\/lib\/)ngrok";\n/m, "").replace(/\bngrokFetch\(/g, "fetch(");
  if (/ngrok/i.test(src.replace(/\/\/.*|\/\*[\s\S]*?\*\//g, ""))) {
    throw new Error(`${spec.from}: still references ngrok after the rewrite`);
  }

  src = src.replace(/import\.meta\.env\.VITE_(\w+)/g, "process.env.NEXT_PUBLIC_$1");

  const toDir = path.posix.dirname(spec.to);
  // Statement-level only: `import … from "x"`, `export … from "x"`, `import "x"`, `import("x")`.
  // Prose in comments ("…from "the query failed"…") must not match.
  const IMPORT = /(^(?:import|export)\b[^;"'`]*?\bfrom\s+|^import\s+|\bimport\(\s*)(["'])([^"']+)\2/gm;
  src = src.replace(IMPORT, (whole, lead: string, q: string, specifier: string) => {
    if (!specifier.startsWith(".") && !specifier.startsWith("@/")) {
      if (ALLOWED_PACKAGES.has(specifier)) return whole;
      throw new Error(`${spec.from}: imports "${specifier}", which the web admin can't use — extract what's needed instead`);
    }
    const appModule = resolveAppModule(spec.from, specifier);
    if (!appModule) {
      throw new Error(`${spec.from}: imports "${specifier}", which isn't mirrored — add it to MIRRORS`);
    }
    let rel = path.posix.relative(toDir, mirroredPath(appModule)).replace(/\.tsx?$/, "");
    if (!rel.startsWith(".")) rel = `./${rel}`;
    return `${lead}${q}${rel}${q}`;
  });

  return HEADER(spec.from, spec.extract) + "\n" + src;
}

const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const OUT_DIR = path.join(ROOT, "src", "admin", "lib");

function main(check: boolean): void {
  const appDir = process.env.MUSEUM_APP_DIR ?? "E:/Project-dev/museum-app";
  const appSrc = path.join(appDir, "src");
  if (!existsSync(appSrc)) {
    console.error(`museum-app not found at ${appDir} — set MUSEUM_APP_DIR.`);
    process.exit(2);
  }

  mkdirSync(OUT_DIR, { recursive: true });
  const drift: string[] = [];
  for (const spec of MIRRORS) {
    const next = transform(spec, readFileSync(path.join(appSrc, spec.from), "utf8"));
    const out = path.join(OUT_DIR, spec.to);
    const current = existsSync(out) ? readFileSync(out, "utf8").replace(/\r\n/g, "\n") : null;
    if (current === next) continue;
    if (check) {
      drift.push(spec.to);
    } else {
      mkdirSync(path.dirname(out), { recursive: true });
      writeFileSync(out, next);
      console.log(`synced ${spec.to}`);
    }
  }

  // A mirrored file nobody lists any more is stale.
  const listed = new Set([...MIRRORS.map((m) => m.to), ...Object.values(WEB_OWNED)]);
  const orphans = readdirSync(OUT_DIR, { recursive: true, encoding: "utf8" })
    .map((f) => f.replace(/\\/g, "/"))
    .filter((f) => /\.tsx?$/.test(f) && !f.endsWith(".test.ts") && !listed.has(f))
    .filter((f) => readFileSync(path.join(OUT_DIR, f), "utf8").startsWith("// Mirrored from"));

  if (orphans.length) {
    console.error(`Mirrored files no longer listed in MIRRORS: ${orphans.join(", ")}`);
    process.exit(1);
  }
  if (drift.length) {
    console.error(`Out of sync with museum-app: ${drift.join(", ")} — run npm run admin:sync`);
    process.exit(1);
  }
  console.log(check ? `admin lib in sync (${MIRRORS.length} files)` : "admin lib synced");
}

if (process.argv[1] && path.resolve(process.argv[1]) === fileURLToPath(import.meta.url)) {
  main(process.argv.includes("--check"));
}
