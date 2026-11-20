import { ROOM_NAMES, type RoomId } from "@/content/copy";
import { COPY } from "@/content/copy";
import { Acquisitions } from "@/slides/Acquisitions";
import { Ages } from "@/slides/Ages";
import { Assessment } from "@/slides/Assessment";
import { Doors } from "@/slides/Doors";
import { Entrance } from "@/slides/Entrance";
import { Gallery } from "@/slides/Gallery";
import { Guild } from "@/slides/Guild";
import { Ladder } from "@/slides/Ladder";
import { Placard } from "@/slides/Placard";
import { ExhibitionController } from "./ExhibitionController";
import { Faq } from "./Faq";
import { Footer } from "./Footer";
import { Header } from "./Header";
import { RoomRail, StoryBar } from "./RoomNav";
import { SkipLinks } from "./SkipLinks";
import { StickyCta } from "./StickyCta";

export type Variant = "home" | "quiz" | "prints" | "learn";

/**
 * Room order per page (brief §8). On /quiz the Royal Assessment is the hero
 * itself, so it has no separate Room V.
 */
export const ORDERS: Record<Variant, RoomId[]> = {
  home: ["entrance", "gallery", "placard", "ages", "assessment", "ladder", "acquisitions", "guild", "doors"],
  quiz: ["assessment", "ladder", "gallery", "placard", "ages", "acquisitions", "guild", "doors"],
  prints: ["entrance", "acquisitions", "gallery", "placard", "assessment", "ladder", "guild", "doors"],
  learn: ["entrance", "ages", "placard", "gallery", "assessment", "ladder", "guild", "acquisitions", "doors"],
};

function Room({ id, index, variant }: { id: RoomId; index: number; variant: Variant }) {
  switch (id) {
    case "entrance": {
      const v = variant === "prints" || variant === "learn" ? COPY.variants[variant] : null;
      return <Entrance index={index} title={v?.title} sub={v?.sub} />;
    }
    case "assessment":
      return (
        <Assessment
          index={index}
          hero={variant === "quiz" && index === 0 ? { eyebrow: COPY.variants.quiz.eyebrow, title: COPY.variants.quiz.title, sub: COPY.variants.quiz.sub } : undefined}
        />
      );
    case "gallery":
      return <Gallery index={index} />;
    case "placard":
      return <Placard index={index} />;
    case "ages":
      return <Ages index={index} />;
    case "ladder":
      return <Ladder index={index} />;
    case "acquisitions":
      return <Acquisitions index={index} />;
    case "guild":
      return <Guild index={index} />;
    case "doors":
      return <Doors index={index} />;
  }
}

/** The page: full-screen rooms, then the FAQ and footer (brief §5.1). Campaign variants reuse it with their own hero and order. */
export function Exhibition({ variant = "home" }: { variant?: Variant }) {
  const order = ORDERS[variant];
  const rooms = order.map((id) => ({ id, name: ROOM_NAMES[id] }));
  return (
    <>
      <SkipLinks content="exhibition" download />
      <StoryBar rooms={rooms} />
      <Header />
      <RoomRail rooms={rooms} />
      <main id="exhibition" data-variant={variant}>
        {order.map((id, i) => (
          <Room key={id} id={id} index={i} variant={variant} />
        ))}
      </main>
      <Faq />
      <Footer />
      <StickyCta />
      <ExhibitionController />
    </>
  );
}
