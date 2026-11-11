import type { CSSProperties, ReactNode } from "react";
import { ArtPicture } from "@/components/ArtPicture";
import { Slide, SlideHeading, stagger, type SlideProps } from "@/components/Slide";
import { InlineCta } from "@/components/StoreCta";
import { artwork, artworksWithRole, fallbackSrc, shortTitle, type Artwork } from "@/content/art";
import { COPY } from "@/content/copy";

function Tile({ work, sizes }: { work: Artwork; sizes: string }) {
  return (
    <div className="framed-box h-full" style={{ backgroundImage: `url(${work.image.placeholder})` }}>
      <ArtPicture work={work} sizes={sizes} className="framed-img" />
    </div>
  );
}

function Perk({ title, body, art, caption, i }: { title: string; body: string; art: ReactNode; caption: ReactNode; i: number }) {
  return (
    <article className="perk placard reveal" style={stagger(3 + i)}>
      <div className="perk-art">{art}</div>
      <div className="grid gap-2 p-5 lg:p-6">
        <h3 className="m-0 font-serif text-2xl font-medium text-canvas">{title}</h3>
        <p className="m-0 text-[15px] leading-relaxed text-canvas-muted">{body}</p>
        <p className="art-caption m-0 pt-1">{caption}</p>
      </div>
    </article>
  );
}

const titles = (works: Artwork[]) =>
  works.map((w, k) => (
    <span key={w.slug}>
      {k > 0 && " · "}
      <i>{shortTitle(w)}</i>
    </span>
  ));

/** Room VIII: what's free, what the Guild adds, and art for each perk (brief §6, Slide VIII). */
export function Guild({ index }: SlideProps) {
  const t = COPY.guild;
  const archives = artworksWithRole("gallery").slice(0, 6);
  const trials = ["age:antiquity", "age:medieval", "age:renaissance"].map((r) => artworksWithRole(r)[0]);
  const master = artwork("monet-water-lilies");
  const loupe = { backgroundImage: `url(${fallbackSrc(master.image.webp, 1600)})` } as CSSProperties;

  return (
    <Slide id="guild" index={index}>
      <div className="slide-inner grid gap-10">
        <SlideHeading id="guild" index={index} title={t.title} sub={t.sub} />
        <div className="grid gap-5 md:grid-cols-3">
          <Perk
            i={0}
            title={t.perks[0].title}
            body={t.perks[0].body}
            art={
              <div className="grid h-full grid-cols-3 grid-rows-2 gap-1">
                {archives.map((w) => (
                  <Tile key={w.slug} work={w} sizes="(min-width: 768px) 130px, 33vw" />
                ))}
              </div>
            }
            caption={titles(archives)}
          />
          <Perk
            i={1}
            title={t.perks[1].title}
            body={t.perks[1].body}
            art={
              <div className="grid h-full grid-cols-3 gap-1">
                {trials.map((w) => (
                  <Tile key={w.slug} work={w} sizes="(min-width: 768px) 130px, 33vw" />
                ))}
              </div>
            }
            caption={titles(trials)}
          />
          <Perk
            i={2}
            title={t.perks[2].title}
            body={t.perks[2].body}
            art={
              <div className="relative h-full">
                <Tile work={master} sizes="(min-width: 768px) 400px, 92vw" />
                <span className="loupe" style={loupe} aria-hidden="true">
                  <span className="loupe-label">{t.loupe}</span>
                </span>
              </div>
            }
            caption={
              <>
                <i>{shortTitle(master)}</i> · {master.artist}
              </>
            }
          />
        </div>
        <div className="reveal grid justify-items-start gap-3" style={stagger(6)}>
          <InlineCta placement="guild" label={t.cta} />
          <p className="fine max-w-2xl">{t.small}</p>
        </div>
      </div>
    </Slide>
  );
}
