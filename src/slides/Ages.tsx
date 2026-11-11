import { ArtPicture } from "@/components/ArtPicture";
import { Slide, SlideHeading, stagger, type SlideProps } from "@/components/Slide";
import { artworksWithRole, shortTitle } from "@/content/art";
import { COPY } from "@/content/copy";
import { EraTrack } from "./EraTrack";

/** Room IV: seven ages, each with three works that defined it (brief §6, Slide IV). */
export function Ages({ index }: SlideProps) {
  const t = COPY.ages;
  return (
    <Slide id="ages" index={index}>
      <div className="slide-inner grid gap-10">
        <SlideHeading id="ages" index={index} title={t.title} sub={t.sub} />
        <div className="reveal" style={stagger(3)}>
          <EraTrack count={t.eras.length}>
            {t.eras.map((era, i) => {
              const [main, ...rest] = artworksWithRole(`age:${era.id}`);
              return (
                <li key={era.id} className="era-card placard" aria-label={`${i + 1} of ${t.eras.length}: ${era.name}`}>
                  <div className="era-art">
                    {[main, ...rest.slice(0, 2)].map((w, k) => (
                      <div key={w.slug} className="gilt-frame framed-box" style={{ backgroundImage: `url(${w.image.placeholder})` }}>
                        <ArtPicture work={w} sizes={k === 0 ? "(min-width: 1024px) 220px, 56vw" : "(min-width: 1024px) 110px, 28vw"} className="framed-img" />
                      </div>
                    ))}
                  </div>
                  <div className="grid gap-2">
                    <p className="eyebrow">{era.years}</p>
                    <h3 className="m-0 font-serif text-2xl font-medium text-canvas">{era.name}</h3>
                    <p className="m-0 text-[15px] text-canvas-muted">{era.line}</p>
                  </div>
                  <p className="art-caption m-0">
                    {[main, ...rest.slice(0, 2)].map((w, k) => (
                      <span key={w.slug}>
                        {k > 0 && " · "}
                        <i>{shortTitle(w)}</i>
                      </span>
                    ))}
                  </p>
                  <p className="fine mt-auto border-t border-umber pt-3 text-xs">{t.trials}</p>
                </li>
              );
            })}
          </EraTrack>
        </div>
        <p className="fine reveal max-w-xl" style={stagger(4)}>
          {t.small}
        </p>
      </div>
    </Slide>
  );
}
