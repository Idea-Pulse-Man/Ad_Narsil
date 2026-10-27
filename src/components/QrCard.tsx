import QRCode from "qrcode";
import { SITE } from "@/config/site";
import { COPY } from "@/content/copy";
import { QR_OPTIONS } from "@/lib/qr";
import { QrPersonalize } from "./QrPersonalize";

/**
 * Desktop only (brief §7.7). The server renders a QR for /get?c=qr, the
 * no-JavaScript fallback; QrPersonalize swaps in the visitor's UTMs.
 */
export async function QrCard({ className = "" }: { className?: string }) {
  const svg = await QRCode.toString(`${SITE.url}/get?c=qr`, QR_OPTIONS);
  return (
    <figure className={`m-0 hidden flex-col items-center gap-2.5 lg:flex ${className}`}>
      <div className="gilt-frame rounded-xl bg-canvas p-2.5">
        <QrPersonalize base={SITE.url} initialSvg={svg} />
      </div>
      <figcaption className="fine">{COPY.cta.qr}</figcaption>
    </figure>
  );
}
