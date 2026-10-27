import { COPY } from "@/content/copy";
import { SITE } from "@/config/site";

/** <details> accordion, all closed, no JavaScript needed (brief §6, FAQ). */
export function Faq() {
  return (
    <section id="faq" aria-labelledby="faq-title" className="px-4 py-24 min-[390px]:px-5 lg:px-12 lg:py-32">
      <div className="mx-auto max-w-3xl">
        <h2 id="faq-title" className="display-2 mb-10 text-[clamp(2rem,1.4rem+2.4vw,3rem)]">
          {COPY.faq.title}
        </h2>
        <div className="border-t border-umber">
          {COPY.faq.items.map((item) => (
            <details key={item.q} className="group border-b border-umber" data-question={item.q}>
              <summary className="flex min-h-14 cursor-pointer list-none items-center justify-between gap-6 py-4 text-[17px] font-medium text-canvas [&::-webkit-details-marker]:hidden">
                {item.q}
                <span
                  aria-hidden="true"
                  className="grid size-7 shrink-0 place-items-center rounded-full border border-umber text-accent transition-transform duration-300 group-open:rotate-45"
                >
                  +
                </span>
              </summary>
              <p className="lede pb-6 text-[16px] lg:text-[17px]">
                {item.a === SITE.supportEmail ? (
                  <a href={`mailto:${SITE.supportEmail}`} className="link-gold">
                    {SITE.supportEmail}
                  </a>
                ) : (
                  item.a
                )}
              </p>
            </details>
          ))}
        </div>
      </div>
    </section>
  );
}
