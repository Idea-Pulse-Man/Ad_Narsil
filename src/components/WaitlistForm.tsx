"use client";

import { useId, useRef, useState, type FormEvent } from "react";
import { SITE } from "@/config/site";
import { COPY } from "@/content/copy";
import { currentVariant, track } from "@/lib/analytics";
import { campaignToken } from "@/lib/store-links";
import { readUtm } from "@/lib/utm";
import { EMAIL_PATTERN } from "@/lib/waitlist";

type Status = "idle" | "sending" | "done" | "invalid" | "failed";

/**
 * One email field, a honeypot and a consent line (brief §7.9). Without
 * JavaScript it posts to /api/waitlist, which answers with the /joined page.
 */
export function WaitlistForm({ placement, align = "start" }: { placement: string; align?: "start" | "center" }) {
  const id = useId();
  const input = useRef<HTMLInputElement>(null);
  const [status, setStatus] = useState<Status>("idle");
  const t = COPY.waitlist;

  async function submit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const data = new FormData(e.currentTarget);
    const email = String(data.get("email") ?? "").trim();
    track("cta_click", { placement, store: "waitlist" });
    if (email.length > 254 || !EMAIL_PATTERN.test(email)) {
      setStatus("invalid");
      input.current?.focus();
      return;
    }
    setStatus("sending");
    const utm = readUtm();
    const variant = currentVariant();
    try {
      const res = await fetch("/api/waitlist", {
        method: "POST",
        headers: { "content-type": "application/json" },
        body: JSON.stringify({
          email,
          company: data.get("company") ?? "",
          source: utm.source ?? "organic",
          campaign: campaignToken(placement, utm, variant === "home" ? undefined : variant),
        }),
      });
      if (res.ok) {
        setStatus("done");
        track("waitlist_submit", { placement });
      } else {
        setStatus(res.status === 400 ? "invalid" : "failed");
      }
    } catch {
      setStatus("failed");
    }
  }

  const centered = align === "center";
  const error = status === "invalid" ? t.invalid : status === "failed" ? t.failed : "";

  return (
    <div className={`relative w-full max-w-md ${centered ? "mx-auto text-center" : ""}`}>
      {/* Always mounted, so screen readers announce each change. */}
      <p role="status" className="sr-only">
        {status === "done" ? `${t.success} ${t.successDetail}` : error}
      </p>

      {status === "done" ? (
        <div>
          <p className="m-0 font-serif text-xl text-gilt-light">{t.success}</p>
          <p className="fine mt-1">{t.successDetail}</p>
        </div>
      ) : (
        <form action="/api/waitlist" method="post" noValidate onSubmit={submit} className="grid gap-2.5">
          <p className="m-0 font-serif text-[17px] italic text-gilt-light">{t.heading}</p>
          <div className="flex gap-2">
            <label htmlFor={id} className="sr-only">
              {t.label}
            </label>
            <input
              ref={input}
              id={id}
              name="email"
              type="email"
              inputMode="email"
              autoComplete="email"
              autoCapitalize="none"
              spellCheck={false}
              required
              maxLength={254}
              placeholder={t.placeholder}
              aria-invalid={status === "invalid" || undefined}
              aria-describedby={`${id}-msg`}
              className="field flex-1"
            />
            <button type="submit" className="btn-gold" disabled={status === "sending"}>
              {status === "sending" ? t.sending : t.submit}
            </button>
          </div>
          {/* Honeypot: people never see or reach it; bots that fill it get a silent success. */}
          <div aria-hidden="true" className="absolute -left-[9999px] size-px overflow-hidden">
            <label>
              Company
              <input name="company" type="text" tabIndex={-1} autoComplete="off" />
            </label>
          </div>
          {/* Credits a no-JavaScript submission; the script sends the full campaign token instead. */}
          <input type="hidden" name="campaign" value={campaignToken(placement)} />
          <p className="fine">
            {t.consent}{" "}
            <a href={SITE.legal.privacyUrl} className="link-gold">
              {t.privacy}
            </a>
            .
          </p>
          {error && (
            <p id={`${id}-msg`} className="fine text-canvas-muted">
              {error}
            </p>
          )}
        </form>
      )}
    </div>
  );
}
