import { Framed } from "@/components/Framed";
import { Slide, SlideHeading, stagger, type SlideProps } from "@/components/Slide";
import { artwork, artworksWithRole } from "@/content/art";
import { COPY } from "@/content/copy";

/**
 * Room III: depth. One work in a gilt frame with its placard rising over the
 * lower third, as in the app, and four more works that each have a story.
 */
export function Placard({ index }: SlideProps) {
  const t = COPY.placard;
  const work = artwork(t.featured.slug);
  const more = artworksWithRole("story");

  return (
    <Slide id="placard" index={index}>
      <div className="slide-inner room-grid">
        <div className="room-copy grid gap-8">
          <SlideHeading id="placard" index={index} title={t.title} sub={t.sub} />
          <div className="reveal grid gap-4" style={stagger(4)}>
            <p className="eyebrow">{t.more}</p>
            <div className="grid grid-cols-2 gap-4 sm:grid-cols-4">
              {more.map((w) => (
                <Framed key={w.slug} work={w} ratio="1 / 1" sizes="(min-width: 1024px) 120px, (min-width: 640px) 22vw, 45vw" />
              ))}
            </div>
          </div>
          <p className="fine reveal max-w-xl" style={stagger(5)}>
            {t.source}
          </p>
        </div>

        <div className="room-art placard-stage">
          <Framed work={work} caption={false} sizes="(min-width: 1024px) 580px, 92vw" className="placard-art reveal" />
          <article className="placard placard-rise" aria-labelledby="placard-work-title">
            <p className="eyebrow">{t.featured.label}</p>
            <h3 id="placard-work-title" className="mt-4 mb-0 font-serif text-2xl font-medium text-canvas italic lg:text-[28px]">
              {work.title}
            </h3>
            <p className="fine mt-2">
              {work.artist}, {work.date} · {work.medium}
            </p>
            <p className="fine">
              {work.museum}, {work.accession} · {t.featured.storySource}
            </p>
            <p className="mt-4 mb-0 text-[15px] leading-relaxed text-canvas-muted">{t.featured.story}</p>
            <blockquote className="mx-0 mt-4 mb-0 border-l border-accent pl-4">
              <p className="m-0 font-serif text-[15px] leading-relaxed text-canvas italic">“{t.featured.quote}”</p>
              <footer className="fine mt-1 text-xs">{t.featured.quoteBy}</footer>
            </blockquote>
          </article>
        </div>
      </div>
    </Slide>
  );
}
