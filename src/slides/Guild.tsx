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
      <div className="grid content-start gap-1.5 p-4 lg:p-5">
        <h3 className="m-0 font-serif text-xl font-medium text-canvas lg:text-2xl">{title}</h3>
        <p className="m-0 text-[14.5px] leading-relaxed text-canvas-muted">{body}</p>
        <p className="art-caption m-0">{caption}</p>
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

function Cell({ value, yes, no }: { value: boolean | string; yes: string; no: string }) {
  if (typeof value === "string") return <>{value}</>;
  return value ? (
    <span className="text-accent">
      <span aria-hidden="true">✓</span>
      <span className="sr-only">{yes}</span>
    </span>
  ) : (
    <span className="text-stone">
      <span aria-hidden="true">—</span>
      <span className="sr-only">{no}</span>
    </span>
  );
}

/** Room VIII: what's free, what the Guild adds, and no surprises (brief §6, Slide VIII). */
export function Guild({ index }: SlideProps) {
  const t = COPY.guild;
  const archives = artworksWithRole("gallery").slice(0, 4);
  const trials = ["age:antiquity", "age:medieval", "age:renaissance"].map((r) => artworksWithRole(r)[0]);
  const master = artwork("monet-water-lilies");
  const loupe = { backgroundImage: `url(${fallbackSrc(master.image.webp, 1600)})` } as CSSProperties;

  return (
    <Slide id="guild" index={index}>
      <div className="slide-inner grid gap-8 lg:gap-10">
        <SlideHeading id="guild" index={index} title={t.title} sub={t.sub} />
        <div className="guild-grid">
          <div className="grid content-start gap-3">
            <Perk
              i={0}
              title={t.perks[0].title}
              body={t.perks[0].body}
              art={
                <div className="grid h-full grid-cols-2 grid-rows-2 gap-1">
                  {archives.map((w) => (
                    <Tile key={w.slug} work={w} sizes="80px" />
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
                    <Tile key={w.slug} work={w} sizes="60px" />
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
                  <Tile work={master} sizes="160px" />
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

          <div className="reveal grid content-start gap-5" style={stagger(6)}>
            <table className="guild-table">
              <caption className="sr-only">{t.table.caption}</caption>
              <thead>
                <tr>
                  <th scope="col">
                    <span className="sr-only">{t.table.feature}</span>
                  </th>
                  <th scope="col">{t.table.free}</th>
                  <th scope="col" className="text-gilt-light">
                    {t.table.guild}
                  </th>
                </tr>
              </thead>
              <tbody>
                {t.table.rows.map(([feature, free, guild]) => (
                  <tr key={feature}>
                    <th scope="row">{feature}</th>
                    <td>
                      <Cell value={free} yes={t.table.yes} no={t.table.no} />
                    </td>
                    <td>
                      <Cell value={guild} yes={t.table.yes} no={t.table.no} />
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
            <div className="grid justify-items-start gap-3">
              <InlineCta placement="guild" label={t.cta} />
              <p className="fine max-w-xl">{t.small}</p>
            </div>
          </div>
        </div>
      </div>
    </Slide>
  );
}
