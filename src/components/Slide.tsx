import type { CSSProperties, ReactNode } from "react";
import { ROMAN, roomEyebrow, type RoomId } from "@/content/copy";
import { Rich } from "./Rich";

export type SlideProps = { index: number };

/** One room: a full-screen section that snaps (brief §5.1–5.2). */
export function Slide({ id, index, className = "", children }: { id: RoomId; index: number; className?: string; children: ReactNode }) {
  return (
    <section className={`slide ${className}`} id={id} data-room={ROMAN[index]} aria-labelledby={`${id}-title`} tabIndex={-1}>
      {children}
    </section>
  );
}

/** Staggered entrance order for .reveal children. */
export const stagger = (i: number) => ({ "--i": i }) as CSSProperties;

/** Eyebrow, headline and the line under it: the top of every room after the entrance. */
export function SlideHeading({
  id,
  index,
  title,
  sub,
  center = false,
}: {
  id: RoomId;
  index: number;
  title: string;
  sub: string;
  center?: boolean;
}) {
  return (
    <div className={`grid gap-5 ${center ? "justify-items-center text-center" : ""}`}>
      <p className={`eyebrow reveal ${center ? "eyebrow-center" : ""}`} style={stagger(0)}>
        {roomEyebrow(index, id)}
      </p>
      <h2 id={`${id}-title`} className="display-2 reveal max-w-[16ch]" style={stagger(1)}>
        <Rich text={title} />
      </h2>
      <p className="lede reveal" style={stagger(2)}>
        {sub}
      </p>
    </div>
  );
}
