import { readFile } from "node:fs/promises";
import path from "node:path";
import { ImageResponse } from "next/og";
import sharp from "sharp";
import type { Artwork } from "@/content/art-utils";
import { SEAL_SVG } from "./seal";

/*
 * Open Graph images (brief §9, §14), drawn at build time with next/og
 * (satori + resvg). Satori reads TTF/OTF/WOFF but not WOFF2, and PNG/JPEG
 * but not AVIF/WebP, so fonts come from @fontsource's .woff files and
 * artworks are converted from the site's own WebP with sharp.
 */

export const OG_SIZE = { width: 1200, height: 630 };

const ROOT = process.cwd();
const font = (file: string) => readFile(path.join(ROOT, "node_modules/@fontsource/playfair-display/files", file));

const assets = (async () => {
  const [p500, p600, p500i, crest] = await Promise.all([
    font("playfair-display-latin-500-normal.woff"),
    font("playfair-display-latin-600-normal.woff"),
    font("playfair-display-latin-500-italic.woff"),
    sharp(path.join(ROOT, "assets/crest.png")).resize(240).png().toBuffer(),
  ]);
  return {
    fonts: [
      { name: "Playfair", data: p500, weight: 500 as const, style: "normal" as const },
      { name: "Playfair", data: p600, weight: 600 as const, style: "normal" as const },
      { name: "Playfair", data: p500i, weight: 500 as const, style: "italic" as const },
    ],
    crest: `data:image/png;base64,${crest.toString("base64")}`,
  };
})();

/** An artwork from public/art as a PNG data URL, at most `width` px wide. */
async function artSrc(work: Artwork, width: number): Promise<string> {
  const widths = Object.keys(work.image.webp).map(Number).sort((a, b) => a - b);
  const pick = widths.find((w) => w >= width) ?? widths[widths.length - 1];
  const file = path.join(ROOT, "public", work.image.webp[pick]);
  const png = await sharp(file).resize({ width, withoutEnlargement: true }).jpeg({ quality: 82 }).toBuffer();
  return `data:image/jpeg;base64,${png.toString("base64")}`;
}

const SEAL = `data:image/svg+xml;base64,${Buffer.from(SEAL_SVG).toString("base64")}`;

const C = {
  ink: "#14100e",
  canvas: "#f4efe6",
  muted: "#e4d9c8",
  stone: "#a89880",
  accent: "#c4a574",
  giltLight: "#f7dfa0",
  glow: "#d9a441",
};

function Eyebrow({ text, center = false }: { text: string; center?: boolean }) {
  return (
    <div style={{ display: "flex", flexDirection: "column", alignItems: center ? "center" : "flex-start", gap: 14 }}>
      <div style={{ fontSize: 20, letterSpacing: 7, color: C.giltLight, textTransform: "uppercase", fontWeight: 500 }}>{text}</div>
      <div style={{ width: 220, height: 1, backgroundImage: `linear-gradient(90deg, ${center ? "transparent, " : ""}${C.glow}, transparent)` }} />
    </div>
  );
}

function Wordmark() {
  return <div style={{ fontSize: 20, letterSpacing: 6, color: C.canvas, fontWeight: 600 }}>NARSIL</div>;
}

/** The default and campaign images: crest, headline, and a gilt-framed masterpiece on a spotlit wall. */
export async function ogPoster({ eyebrow, title, line, work }: { eyebrow: string; title: string; line: string; work: Artwork }) {
  const { fonts, crest } = await assets;
  const art = await artSrc(work, 900);
  const h = 470;
  const w = Math.round((h * work.image.width) / work.image.height);
  const frameW = Math.min(w, 520);
  const frameH = Math.round((frameW * work.image.height) / work.image.width);

  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          alignItems: "center",
          padding: "0 72px",
          gap: 56,
          fontFamily: "Playfair",
          backgroundColor: C.ink,
          backgroundImage: "radial-gradient(circle at 70% 25%, #39271b, #160f0c 60%, #0d0907)",
        }}
      >
        <div style={{ display: "flex", flexDirection: "column", flex: 1, gap: 28 }}>
          <div style={{ display: "flex", alignItems: "center", gap: 16 }}>
            <img src={crest} width={64} height={64} alt="" />
            <Wordmark />
          </div>
          <Eyebrow text={eyebrow} />
          <div style={{ fontSize: 66, lineHeight: 1.06, color: C.canvas, fontWeight: 600, letterSpacing: -0.5 }}>{title}</div>
          <div style={{ fontSize: 26, lineHeight: 1.35, color: C.muted, fontWeight: 500 }}>{line}</div>
        </div>
        <div
          style={{
            display: "flex",
            padding: 10,
            border: `2px solid ${C.accent}`,
            boxShadow: `0 0 60px ${C.glow}40`,
            backgroundColor: "#0d0907",
          }}
        >
          <img src={art} width={frameW} height={frameH} alt="" style={{ objectFit: "cover" }} />
        </div>
      </div>
    ),
    { ...OG_SIZE, fonts },
  );
}

/** A verdict: dark parchment, the wax seal, the verdict in Playfair, the crest, and the invitation. */
export async function ogVerdict({ eyebrow, title, line }: { eyebrow: string; title: string; line: string }) {
  const { fonts, crest } = await assets;
  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          padding: 28,
          fontFamily: "Playfair",
          backgroundColor: "#1a120c",
          backgroundImage: "radial-gradient(ellipse at 50% 30%, #4a3523 0%, #2a1d13 45%, #140d08 100%)",
        }}
      >
        <div
          style={{
            flex: 1,
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            justifyContent: "center",
            gap: 22,
            border: `1px solid ${C.accent}80`,
            borderRadius: 18,
            boxShadow: `inset 0 0 120px #00000099`,
          }}
        >
          <img src={SEAL} width={170} height={170} alt="" style={{ transform: "rotate(-4deg)" }} />
          <Eyebrow text={eyebrow} center />
          <div style={{ fontSize: 76, lineHeight: 1.05, color: C.giltLight, fontWeight: 600, textAlign: "center", padding: "0 60px" }}>
            {title}
          </div>
          <div style={{ display: "flex", alignItems: "center", gap: 14, marginTop: 8 }}>
            <img src={crest} width={44} height={44} alt="" />
            <div style={{ fontSize: 26, color: C.muted, fontWeight: 500 }}>{line}</div>
          </div>
        </div>
      </div>
    ),
    { ...OG_SIZE, fonts },
  );
}
