import { SITE } from "@/config/site";
import { COPY } from "@/content/copy";
import { Crest } from "./Crest";

export function Footer() {
  const t = COPY.footer;
  const links = [
    { href: "/support", label: t.links.support },
    { href: SITE.legal.privacyUrl, label: t.links.privacy },
    { href: SITE.legal.termsUrl, label: t.links.terms },
    { href: "/credits", label: t.links.credits },
    { href: `mailto:${SITE.supportEmail}`, label: t.links.contact },
  ];
  return (
    <footer className="border-t border-umber px-4 pb-32 pt-14 min-[390px]:px-5 lg:px-12 lg:pb-16">
      <div className="mx-auto grid max-w-[1240px] gap-8">
        <div className="flex flex-wrap items-center justify-between gap-6">
          <a href="/" className="flex min-h-11 items-center gap-2.5">
            <Crest size={28} className="crest-glow" />
            <span className="wordmark">Narsil</span>
          </a>
          <nav aria-label="Footer">
            <ul className="m-0 flex list-none flex-wrap gap-x-6 gap-y-1 p-0">
              {links.map((l) => (
                <li key={l.label}>
                  <a href={l.href} className="inline-flex min-h-11 items-center text-sm text-canvas-muted hover:text-accent">
                    {l.label}
                  </a>
                </li>
              ))}
            </ul>
          </nav>
        </div>
        <div className="grid max-w-[80ch] gap-3">
          <p className="fine">{t.copyright}</p>
          <p className="fine">{t.museums}</p>
          <p className="fine">{t.apple}</p>
          {SITE.googlePlayUrl && <p className="fine">{t.google}</p>}
        </div>
      </div>
    </footer>
  );
}
