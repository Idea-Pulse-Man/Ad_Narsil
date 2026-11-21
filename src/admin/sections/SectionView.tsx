"use client";

import type { ArtworkFilter } from "../lib/admin";
import { ARTWORK_FILTERS } from "../lib/admin";
import type { CanvasOrderStatus } from "../lib/orders";
import type { Route } from "../route";
import type { ShowToast } from "../ui/Toasts";
import AdminArtworks from "./app/AdminArtworks";
import AdminInbox from "./app/AdminInbox";
import AdminInsights from "./app/AdminInsights";
import AdminNews from "./app/AdminNews";
import AdminOrders from "./app/AdminOrders";
import AdminOverview from "./app/AdminOverview";
import AdminQuiz from "./app/AdminQuiz";
import AdminUsers from "./app/AdminUsers";

export interface SectionProps {
  route: Route;
  navigate: (next: Route) => void;
  showToast: ShowToast;
  /** Chatting: re-read the unread badge. */
  refreshUnread: () => Promise<void>;
  /** Chatting: a thread was opened and marked read. */
  onUnreadCleared: () => void;
}

const ORDER_STATUSES: readonly string[] = [
  "registered",
  "pending_payment",
  "paid",
  "submitted",
  "fulfillment_failed",
  "shipped",
  "completed",
  "cancelled",
];

/**
 * Routes each section to its panel: the app's admin screens, ported
 * (src/admin/sections/app), wired to the hash links (admin brief §2).
 */
export function SectionView({ route, navigate, showToast, refreshUnread, onUnreadCleared }: SectionProps) {
  switch (route.section) {
    case "overview":
      return <AdminOverview onJumpToOrders={(status) => navigate({ section: "orders", status: status === "all" ? null : status })} />;
    case "users":
      return <AdminUsers showToast={showToast} />;
    case "quiz":
      return <AdminQuiz key={route.sub} sub={route.sub} showToast={showToast} />;
    case "news":
      return <AdminNews showToast={showToast} />;
    case "orders": {
      const status = route.status && ORDER_STATUSES.includes(route.status) ? (route.status as CanvasOrderStatus) : "all";
      return <AdminOrders key={status} initialStatus={status} showToast={showToast} />;
    }
    case "artworks": {
      const filter = ARTWORK_FILTERS.find((f) => f.id === route.filter)?.id as ArtworkFilter | undefined;
      return <AdminArtworks key={filter ?? "pending"} initialFilter={filter} showToast={showToast} />;
    }
    case "inbox":
      return (
        <AdminInbox
          showToast={showToast}
          onThreadsChanged={refreshUnread}
          onUnreadCleared={onUnreadCleared}
          initialUserId={route.userId}
          onOpenChange={(userId) => {
            // Keep the link in step without remounting the inbox.
            const hash = userId ? `#inbox/${encodeURIComponent(userId)}` : "#inbox";
            if (window.location.hash !== hash) history.replaceState(history.state, "", hash);
          }}
        />
      );
    case "insights":
      return <AdminInsights />;
  }
}
