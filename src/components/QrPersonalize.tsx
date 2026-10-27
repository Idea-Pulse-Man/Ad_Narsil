"use client";

import { useEffect, useRef, useState } from "react";
import { track } from "@/lib/analytics";
import { QR_OPTIONS } from "@/lib/qr";
import { readUtm } from "@/lib/utm";

/** Redraws the QR with the visitor's UTMs (desktop only, loaded lazily) and reports qr_shown once. */
export function QrPersonalize({ base, initialSvg }: { base: string; initialSvg: string }) {
  const [svg, setSvg] = useState(initialSvg);
  const box = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!window.matchMedia("(min-width: 1024px)").matches) return;
    const utm = readUtm();
    if (utm.source || utm.campaign) {
      const url = new URL("/get", base);
      url.searchParams.set("c", "qr");
      if (utm.source) url.searchParams.set("utm_source", utm.source);
      if (utm.campaign) url.searchParams.set("utm_campaign", utm.campaign);
      void import("qrcode").then((QRCode) => QRCode.toString(url.toString(), QR_OPTIONS).then(setSvg));
    }
    const el = box.current;
    if (!el) return;
    const io = new IntersectionObserver(([e]) => {
      if (!e.isIntersecting) return;
      track("qr_shown");
      io.disconnect();
    });
    io.observe(el);
    return () => io.disconnect();
  }, [base]);

  return <div ref={box} className="size-40" aria-hidden="true" dangerouslySetInnerHTML={{ __html: svg }} />;
}
