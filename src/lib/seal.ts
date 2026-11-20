/**
 * The wax seal (brief §4.4): oxblood wax with a gold-foil rim and a crown.
 * One SVG string, used as an <img> data URL on the page and in the
 * build-time OG images (satori renders SVG images, not inline SVG with
 * gradients), so the seal looks the same everywhere.
 */

/** A wax blob: a circle with a soft, uneven edge (deterministic, so server and client agree). */
function blobPath(cx: number, cy: number, r: number, bumps: number, depth: number): string {
  const pts: string[] = [];
  const n = bumps * 4;
  for (let i = 0; i < n; i++) {
    const a = (i / n) * Math.PI * 2;
    const wobble = Math.sin(a * bumps) * depth + Math.sin(a * 3 + 1.3) * depth * 0.6;
    const rr = r + wobble;
    pts.push(`${(cx + Math.cos(a) * rr).toFixed(1)},${(cy + Math.sin(a) * rr).toFixed(1)}`);
  }
  return `M${pts.join("L")}Z`;
}

const CROWN =
  "M64 128 L56 84 L78 104 L100 70 L122 104 L144 84 L136 128 Z M60 134 H140 V146 H60 Z";

export const SEAL_SVG = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 200 200" width="200" height="200">
<defs>
<radialGradient id="w" cx="38%" cy="32%" r="75%"><stop offset="0" stop-color="#9a3d44"/><stop offset=".55" stop-color="#74242c"/><stop offset="1" stop-color="#431217"/></radialGradient>
<radialGradient id="p" cx="50%" cy="45%" r="60%"><stop offset="0" stop-color="#5e1b22"/><stop offset="1" stop-color="#7d2a32"/></radialGradient>
<linearGradient id="f" x1="0" y1="0" x2="1" y2="1"><stop offset="0" stop-color="#6d4613"/><stop offset=".35" stop-color="#d99c2b"/><stop offset=".55" stop-color="#fff0aa"/><stop offset="1" stop-color="#b77516"/></linearGradient>
</defs>
<path d="${blobPath(100, 100, 92, 9, 3.2)}" fill="url(#w)"/>
<circle cx="100" cy="100" r="68" fill="url(#p)"/>
<circle cx="100" cy="100" r="68" fill="none" stroke="url(#f)" stroke-width="5"/>
<circle cx="100" cy="100" r="58" fill="none" stroke="url(#f)" stroke-width="1.2" stroke-dasharray="2 4" opacity=".8"/>
<path d="${CROWN}" fill="url(#f)"/>
<circle cx="56" cy="82" r="5" fill="url(#f)"/><circle cx="100" cy="68" r="6" fill="url(#f)"/><circle cx="144" cy="82" r="5" fill="url(#f)"/>
</svg>`;

export const SEAL_SRC = `data:image/svg+xml;charset=utf-8,${encodeURIComponent(SEAL_SVG)}`;
