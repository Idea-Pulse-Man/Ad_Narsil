"use client";

import { COPY, ROMAN } from "@/content/copy";
import { useExhibition } from "@/lib/exhibition-store";

export type RoomLink = { id: string; name: string };

/**
 * Phones: nine thin segments across the top, like Instagram Stories. The
 * controller fills each one from the scroll position (--p); tapping jumps.
 */
export function StoryBar({ rooms }: { rooms: RoomLink[] }) {
  const active = useExhibition((s) => s.active);
  return (
    <nav className="story-bar" aria-label={COPY.storyBar.label}>
      {rooms.map((room, i) => (
        <a
          key={room.id}
          href={`#${room.id}`}
          className="story-seg"
          data-story-seg={i}
          aria-label={`Room ${ROMAN[i]}: ${room.name}`}
          aria-current={i === active ? "true" : undefined}
        >
          <span />
        </a>
      ))}
    </nav>
  );
}

/** Desktop: I to IX down the right edge; the active room turns gold, hover or focus shows its name. */
export function RoomRail({ rooms }: { rooms: RoomLink[] }) {
  const active = useExhibition((s) => s.active);
  return (
    <nav className="room-rail" aria-label={COPY.rail.label}>
      <ol className="m-0 list-none p-0">
        {rooms.map((room, i) => (
          <li key={room.id}>
            <a href={`#${room.id}`} className="room-link" aria-current={i === active ? "true" : undefined}>
              <span className="room-name" aria-hidden="true">
                {room.name}
              </span>
              <span aria-hidden="true">{ROMAN[i]}</span>
              <span className="sr-only">
                Room {ROMAN[i]}: {room.name}
              </span>
            </a>
          </li>
        ))}
      </ol>
    </nav>
  );
}
