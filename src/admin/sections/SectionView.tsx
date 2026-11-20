"use client";

import type { Route } from "../route";
import type { ShowToast } from "../ui/Toasts";

export interface SectionProps {
  route: Route;
  navigate: (next: Route) => void;
  showToast: ShowToast;
  /** Chatting: re-read the unread badge. */
  refreshUnread: () => Promise<void>;
  /** Chatting: a thread was opened and marked read. */
  onUnreadCleared: () => void;
}

/** Which milestone (admin brief §10) builds each section. */
const MILESTONE: Record<Route["section"], number> = {
  overview: 3,
  insights: 3,
  users: 4,
  artworks: 4,
  orders: 5,
  news: 6,
  inbox: 6,
  quiz: 7,
};

/** Routes each section to its panel. Panels land milestone by milestone. */
export function SectionView({ route }: SectionProps) {
  const detail =
    route.section === "orders" && route.status
      ? `Filter from the link: ${route.status.replace(/_/g, " ")}.`
      : route.section === "artworks" && route.filter
        ? `Filter from the link: ${route.filter.replace(/_/g, " ")}.`
        : route.section === "inbox" && route.userId
          ? "A thread is selected in the link."
          : null;

  return (
    <div className="rounded-2xl border border-dashed border-white/12 p-6 text-sm text-white/55">
      <p>This panel is built in milestone {MILESTONE[route.section]}.</p>
      {detail && <p className="mt-1 text-white/40">{detail}</p>}
    </div>
  );
}
