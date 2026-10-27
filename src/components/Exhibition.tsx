import type { ComponentType } from "react";
import { ROOM_NAMES, type RoomId } from "@/content/copy";
import { Doors } from "@/slides/Doors";
import { Entrance } from "@/slides/Entrance";
import { Acquisitions, Ages, Assessment, Gallery, Guild, Ladder, Placard } from "@/slides/rooms";
import { ExhibitionController } from "./ExhibitionController";
import { Faq } from "./Faq";
import { Footer } from "./Footer";
import { Header } from "./Header";
import { RoomRail, StoryBar } from "./RoomNav";
import type { SlideProps } from "./Slide";
import { SkipLinks } from "./SkipLinks";
import { StickyCta } from "./StickyCta";

const SLIDES: Record<RoomId, ComponentType<SlideProps>> = {
  entrance: Entrance,
  gallery: Gallery,
  placard: Placard,
  ages: Ages,
  assessment: Assessment,
  ladder: Ladder,
  acquisitions: Acquisitions,
  guild: Guild,
  doors: Doors,
};

export const HOME_ORDER: RoomId[] = ["entrance", "gallery", "placard", "ages", "assessment", "ladder", "acquisitions", "guild", "doors"];

/**
 * The page: nine full-screen rooms, then the FAQ and footer (brief §5.1).
 * Campaign variants (step 3) reuse it with their own hero and order.
 */
export function Exhibition({ order = HOME_ORDER, variant = "home" }: { order?: RoomId[]; variant?: string }) {
  const rooms = order.map((id) => ({ id, name: ROOM_NAMES[id] }));
  return (
    <>
      <SkipLinks content="exhibition" download />
      <StoryBar rooms={rooms} />
      <Header />
      <RoomRail rooms={rooms} />
      <main id="exhibition" data-variant={variant}>
        {order.map((id, i) => {
          const Room = SLIDES[id];
          return <Room key={id} index={i} />;
        })}
      </main>
      <Faq />
      <Footer />
      <StickyCta />
      <ExhibitionController />
    </>
  );
}
