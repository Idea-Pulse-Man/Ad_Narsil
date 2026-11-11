/**
 * Builds the site's images.
 *
 * Artworks (src/content/artworks.json): downloads Narsil's own S3 copy
 * (cached in .cache/art), writes AVIF and WebP at 480/960/1600 px wide to
 * public/art with a content hash in the name, and records the size, a
 * 5-colour palette and a tiny blurred placeholder in
 * src/content/art.generated.json.
 *
 * Crest (assets/crest.png): writes the sizes the site uses to public/branding.
 *
 * Run: npm run artworks
 */
import { createHash } from "node:crypto";
import { existsSync } from "node:fs";
import { mkdir, readFile, readdir, rm, writeFile } from "node:fs/promises";
import path from "node:path";
import sharp from "sharp";

type Manifest = { slug: string; imageUrl: string }[];

const ROOT = path.resolve(import.meta.dirname, "..");
const CACHE = path.join(ROOT, ".cache", "art");
const OUT = path.join(ROOT, "public", "art");
// No layout shows an artwork wider than ~600 CSS px, so 1600 covers 2× screens;
// a 2400 px set would add ~5 MB to the repo and never be picked.
const WIDTHS = [480, 960, 1600];
const CREST_SIZES = [56, 112, 336];

const hash = (buf: Buffer) => createHash("sha256").update(buf).digest("hex").slice(0, 8);
const hex = (rgb: number[]) => "#" + rgb.map((v) => v.toString(16).padStart(2, "0")).join("");

async function download(slug: string, url: string): Promise<Buffer> {
  const file = path.join(CACHE, `${slug}${path.extname(new URL(url).pathname) || ".jpg"}`);
  if (existsSync(file)) return readFile(file);
  const res = await fetch(url);
  if (!res.ok) throw new Error(`${slug}: ${res.status} from ${url}`);
  const buf = Buffer.from(await res.arrayBuffer());
  await writeFile(file, buf);
  return buf;
}

/** Median cut: split the box with the widest channel range until there are `count`, biggest first. */
async function palette(input: Buffer, count = 5): Promise<string[]> {
  const { data } = await sharp(input)
    .resize(64, 64, { fit: "inside" })
    .removeAlpha()
    .raw()
    .toBuffer({ resolveWithObject: true });
  const pixels: number[][] = [];
  for (let i = 0; i < data.length; i += 3) pixels.push([data[i], data[i + 1], data[i + 2]]);

  const boxes = [pixels];
  while (boxes.length < count) {
    let best = -1;
    let bestRange = -1;
    let channel = 0;
    boxes.forEach((box, i) => {
      if (box.length < 2) return;
      for (let c = 0; c < 3; c++) {
        let min = 255;
        let max = 0;
        for (const p of box) {
          if (p[c] < min) min = p[c];
          if (p[c] > max) max = p[c];
        }
        if (max - min > bestRange) [bestRange, best, channel] = [max - min, i, c];
      }
    });
    if (best < 0) break;
    const box = boxes[best].sort((a, b) => a[channel] - b[channel]);
    boxes.splice(best, 1, box.slice(0, box.length >> 1), box.slice(box.length >> 1));
  }

  return boxes
    .sort((a, b) => b.length - a.length)
    .map((box) => hex([0, 1, 2].map((c) => Math.round(box.reduce((s, p) => s + p[c], 0) / box.length))));
}

async function buildArtwork(slug: string, url: string) {
  const source = await download(slug, url);
  const { width = 0, height = 0 } = await sharp(source).metadata();
  for (const f of await readdir(OUT)) if (f.startsWith(`${slug}-`)) await rm(path.join(OUT, f));

  const avif: Record<number, string> = {};
  const webp: Record<number, string> = {};
  const report: string[] = [];
  for (const w of WIDTHS.filter((w) => w <= width || w === WIDTHS[0])) {
    const resized = sharp(source).resize({ width: Math.min(w, width) });
    for (const [format, target] of [["avif", avif], ["webp", webp]] as const) {
      const buf =
        format === "avif"
          ? await resized.clone().avif({ quality: 52, effort: 6 }).toBuffer()
          : await resized.clone().webp({ quality: 74 }).toBuffer();
      const name = `${slug}-${w}.${hash(buf)}.${format}`;
      await writeFile(path.join(OUT, name), buf);
      target[w] = `/art/${name}`;
      report.push(`${w}.${format} ${Math.round(buf.length / 1024)} KB`);
    }
  }

  const tiny = await sharp(source).resize({ width: 16 }).blur(1.2).webp({ quality: 40 }).toBuffer();
  console.log(`${slug} ${width}×${height}: ${report.join(" · ")}`);
  return {
    width,
    height,
    palette: await palette(source),
    placeholder: `data:image/webp;base64,${tiny.toString("base64")}`,
    avif,
    webp,
  };
}

async function buildCrest() {
  const src = path.join(ROOT, "assets", "crest.png");
  for (const size of CREST_SIZES) {
    await sharp(src)
      .resize(size, size)
      .webp({ quality: 90, alphaQuality: 90 })
      .toFile(path.join(ROOT, "public", "branding", `crest-${size}.webp`));
  }
  console.log(`crest: ${CREST_SIZES.join(", ")} px`);
}

await mkdir(CACHE, { recursive: true });
await mkdir(OUT, { recursive: true });
const manifest: Manifest = JSON.parse(await readFile(path.join(ROOT, "src", "content", "artworks.json"), "utf8"));
const generated: Record<string, Awaited<ReturnType<typeof buildArtwork>>> = {};
for (const work of manifest) generated[work.slug] = await buildArtwork(work.slug, work.imageUrl);
await writeFile(path.join(ROOT, "src", "content", "art.generated.json"), JSON.stringify(generated, null, 2) + "\n");
await buildCrest();
