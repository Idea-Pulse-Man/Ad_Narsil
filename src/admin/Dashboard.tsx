"use client";

/**
 * The admin shell (admin brief §1.1, §6, §7): sidebar, header, badges, polling
 * and toasts. Mirrors museum-app/src/components/AdminView.tsx; sections plug
 * in through SectionView as later milestones build them.
 *
 * Mounted only for admins and keyed by user id, so sign-out unmounts it and
 * every in-memory list goes with it.
 */

import { useCallback, useEffect, useRef, useState } from "react";
import { isSessionError, useAdminSession } from "./auth";
import { fetchAlertsEnabled, fetchPrintfulDrafts, setAlertsEnabled } from "./lib/admin";
import { fetchUnreadSupportCount } from "./lib/support";
import { buildRoute, QUIZ_SUBS, SECTIONS, sectionRoute, type QuizSub, type Route, type Section } from "./route";
import { SectionView } from "./sections/SectionView";
import { Toasts, useToasts } from "./ui/Toasts";
import { useHashRoute, usePoll } from "./usePoll";

const LABELS: Record<Section, string> = {
  overview: "Overview",
  users: "Users",
  quiz: "Quiz",
  news: "News",
  orders: "Canvas",
  artworks: "Artworks",
  inbox: "Chatting",
  insights: "Insights",
};

/** The app's per-tab hints, word for word. */
const HINTS: Record<Section, string> = {
  overview: "Narsil users, daily sign-ins and subscriptions.",
  users: "Status, role, Guild subscription, and password reset.",
  quiz: "Manage quiz problems — add, delete, or generate with AI.",
  news: "Write, edit, save, and publish news for members.",
  orders: "Track the canvas pipeline and unstick failed fulfilments.",
  artworks: "Approve member uploads, feature, hide, or take a work down.",
  inbox: "Reply to member live chat. Email stays in your mail app.",
  insights: "Anonymous usage, checkout drop-off and crash reports.",
};

const QUIZ_LABELS: Record<QuizSub, string> = { bank: "Topic bank", daily: "Today's daily", styles: "Question styles" };

const UNREAD_MS = 20_000;
const DRAFTS_MS = 60_000;

export function Dashboard() {
  const session = useAdminSession();
  const [route, navigate] = useHashRoute();
  const { toasts, showToast, dismiss } = useToasts();

  const [unread, setUnread] = useState(0);
  const [drafts, setDrafts] = useState(0);
  const [draftsError, setDraftsError] = useState<string | null>(null);
  const [alertsOn, setAlertsOn] = useState(true);
  const [alertsBusy, setAlertsBusy] = useState(false);
  const [signingOut, setSigningOut] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);

  const prevUnread = useRef<number | null>(null);
  const prevDrafts = useRef<number | null>(null);
  // Read inside the poll callbacks without restarting the timers.
  const alertsRef = useRef(alertsOn);
  const sectionRef = useRef(route.section);
  useEffect(() => {
    alertsRef.current = alertsOn;
    sectionRef.current = route.section;
  });

  const onBackgroundError = useCallback(
    (err: unknown) => {
      if (isSessionError(err)) void session.expireSession();
    },
    [session],
  );

  // Unread chats: badge + "new message" toast, only when alerts are on and you're not on Chatting.
  const refreshUnread = useCallback(async () => {
    try {
      const n = await fetchUnreadSupportCount();
      if (alertsRef.current && prevUnread.current !== null && n > prevUnread.current && sectionRef.current !== "inbox") {
        showToast(n === 1 ? "New chat message waiting" : `${n} chat threads need a reply`);
      }
      prevUnread.current = n;
      setUnread(n);
    } catch (err) {
      // As in the app: keep the last count (the SQL may not be applied yet).
      onBackgroundError(err);
    }
  }, [showToast, onBackgroundError]);

  // Paid canvas orders wait in Printful as drafts until confirmed there.
  const refreshDrafts = useCallback(async () => {
    try {
      const list = await fetchPrintfulDrafts();
      const n = list.length;
      if (prevDrafts.current !== null && n > prevDrafts.current) {
        showToast(n === 1 ? "New canvas order — confirm it in Printful" : `${n} canvas orders waiting in Printful`);
      }
      prevDrafts.current = n;
      setDrafts(n);
      setDraftsError(null);
    } catch (err) {
      // Keep the last count, but don't hide the failure (CORS_ORIGIN, Printful down…).
      setDraftsError(err instanceof Error ? err.message : "Could not reach Printful");
      onBackgroundError(err);
    }
  }, [showToast, onBackgroundError]);

  usePoll(refreshUnread, UNREAD_MS);
  usePoll(refreshDrafts, DRAFTS_MS);

  useEffect(() => {
    if (route.section === "inbox") void refreshUnread();
  }, [route.section, refreshUnread]);

  useEffect(() => {
    void fetchAlertsEnabled()
      .then(setAlertsOn)
      .catch((err) => {
        setAlertsOn(true);
        onBackgroundError(err);
      });
  }, [onBackgroundError]);

  useEffect(() => {
    const total = unread + drafts;
    document.title = total > 0 ? `(${total}) Narsil Admin` : "Narsil Admin";
  }, [unread, drafts]);

  const toggleAlerts = async () => {
    if (alertsBusy) return;
    setAlertsBusy(true);
    const next = !alertsOn;
    try {
      await setAlertsEnabled(next);
      setAlertsOn(next);
      showToast(next ? "Alerts enabled" : "Alerts disabled");
    } catch (err) {
      showToast(err instanceof Error ? err.message : "Could not update alerts.", "error");
      onBackgroundError(err);
    } finally {
      setAlertsBusy(false);
    }
  };

  const handleSignOut = async () => {
    if (signingOut) return;
    setSigningOut(true);
    try {
      await session.signOut();
    } catch (err) {
      showToast(err instanceof Error ? err.message : "Sign out failed", "error");
      setSigningOut(false);
    }
  };

  /** For the Chatting section: a thread was opened and read. */
  const onUnreadCleared = useCallback(() => {
    setUnread((n) => {
      const next = Math.max(0, n - 1);
      prevUnread.current = next;
      return next;
    });
  }, []);

  const closeMenu = useCallback(() => setMenuOpen(false), []);
  const go = (next: Route) => {
    closeMenu();
    navigate(next);
  };

  const badge = (s: Section): { n: number; label: string } | null => {
    if (s === "inbox" && unread > 0) return { n: unread, label: `${unread} unread ${unread === 1 ? "chat" : "chats"}` };
    if (s === "orders" && drafts > 0) {
      return { n: drafts, label: `${drafts} Printful ${drafts === 1 ? "draft" : "drafts"} waiting` };
    }
    return null;
  };

  const nav = (
    <nav aria-label="Admin sections">
      <ul className="space-y-0.5">
        {SECTIONS.map((s) => {
          const active = route.section === s;
          const b = badge(s);
          return (
            <li key={s}>
              <a
                href={buildRoute(sectionRoute(s))}
                onClick={() => setMenuOpen(false)}
                aria-current={active && s !== "quiz" ? "page" : undefined}
                className={`flex items-center justify-between rounded-lg px-3 py-2 text-sm transition-colors ${
                  active ? "bg-white/[0.08] text-canvas" : "text-white/60 hover:bg-white/[0.04] hover:text-canvas"
                }`}
              >
                <span className="flex items-center gap-2">
                  {LABELS[s]}
                  {s === "quiz" && <span aria-hidden className="text-[10px] text-white/35">{active ? "▾" : "▸"}</span>}
                  {s === "orders" && draftsError && (
                    <span title={`Couldn't check Printful drafts: ${draftsError}`} className="text-amber-300/80">
                      <span aria-hidden>!</span>
                      <span className="sr-only">Couldn't check Printful drafts</span>
                    </span>
                  )}
                </span>
                {b && (
                  <span className="min-w-[20px] rounded-full bg-red-500 px-1.5 text-center text-[11px] font-semibold leading-[18px] text-white tabular-nums">
                    <span aria-hidden>{b.n > 99 ? "99+" : b.n}</span>
                    <span className="sr-only">{b.label}</span>
                  </span>
                )}
              </a>
              {s === "quiz" && active && route.section === "quiz" && (
                <ul className="mb-1 ml-3 mt-0.5 space-y-0.5 border-l border-white/10 pl-2">
                  {QUIZ_SUBS.map((sub) => (
                    <li key={sub}>
                      <a
                        href={buildRoute({ section: "quiz", sub })}
                        onClick={() => setMenuOpen(false)}
                        aria-current={route.sub === sub ? "page" : undefined}
                        className={`block rounded-md px-3 py-1.5 text-[13px] ${
                          route.sub === sub ? "text-accent" : "text-white/50 hover:text-canvas"
                        }`}
                      >
                        {QUIZ_LABELS[sub]}
                      </a>
                    </li>
                  ))}
                </ul>
              )}
            </li>
          );
        })}
      </ul>
    </nav>
  );

  const brand = (
    <div className="flex items-center gap-2.5">
      <img src="/branding/crest-56.webp" width={28} height={28} alt="" className="shrink-0" />
      <span className="text-[11px] font-semibold uppercase tracking-[0.2em] text-canvas">Narsil Admin</span>
    </div>
  );

  return (
    <div className="min-h-dvh lg:grid lg:grid-cols-[240px_minmax(0,1fr)]">
      {/* Desktop sidebar */}
      <aside className="sticky top-0 hidden h-dvh flex-col border-r border-white/8 bg-[#110d0b] px-3 py-5 lg:flex">
        <div className="px-3">{brand}</div>
        <div className="mt-6 flex-1 overflow-y-auto">{nav}</div>
        <p className="truncate px-3 text-xs text-white/40" title={session.email ?? undefined}>
          {session.email ?? "Signed in"} · admin
        </p>
      </aside>

      {/* Phone / tablet top bar */}
      <div className="sticky top-0 z-30 flex items-center justify-between border-b border-white/8 bg-[#110d0b]/95 px-4 py-3 backdrop-blur lg:hidden">
        {brand}
        <MenuButton open={menuOpen} onToggle={() => setMenuOpen((o) => !o)} badge={unread + drafts} />
      </div>
      {menuOpen && (
        <MobileMenu onClose={closeMenu} email={session.email}>
          {nav}
        </MobileMenu>
      )}

      <div className="min-w-0">
        <header className="flex flex-wrap items-start justify-between gap-x-6 gap-y-3 border-b border-white/8 px-4 py-5 sm:px-8">
          <div className="min-w-0">
            <h1 className="font-serif text-2xl text-canvas">
              {LABELS[route.section]}
              {route.section === "quiz" && <span className="text-white/40"> · {QUIZ_LABELS[route.sub]}</span>}
            </h1>
            <p className="mt-1 text-sm text-white/50">{HINTS[route.section]}</p>
          </div>
          <div className="flex shrink-0 items-center gap-2">
            <button
              type="button"
              onClick={() => void toggleAlerts()}
              disabled={alertsBusy}
              aria-pressed={alertsOn}
              title={alertsOn ? "Alerts on — toast when new chat messages arrive" : "Alerts off — no toast notifications"}
              className={`rounded-full px-3 py-1.5 text-xs font-medium disabled:opacity-40 ${
                alertsOn
                  ? "border border-emerald-400/35 bg-emerald-400/15 text-emerald-100"
                  : "border border-white/12 text-white/45"
              }`}
            >
              {alertsOn ? "Alerts on" : "Alerts off"}
            </button>
            <button
              type="button"
              onClick={() => void handleSignOut()}
              disabled={signingOut}
              className="rounded-full border border-white/15 px-3 py-1.5 text-xs text-white/70 hover:text-canvas disabled:opacity-40"
            >
              {signingOut ? "Signing out…" : "Sign out"}
            </button>
          </div>
        </header>

        <main className="mx-auto w-full max-w-6xl px-4 py-6 sm:px-8">
          <SectionView
            route={route}
            navigate={go}
            showToast={showToast}
            refreshUnread={refreshUnread}
            onUnreadCleared={onUnreadCleared}
          />
        </main>
      </div>

      <Toasts toasts={toasts} dismiss={dismiss} />
    </div>
  );
}

function MenuButton({ open, onToggle, badge }: { open: boolean; onToggle: () => void; badge: number }) {
  return (
    <button
      type="button"
      onClick={onToggle}
      aria-expanded={open}
      aria-controls="admin-menu"
      className="relative rounded-full border border-white/15 px-3 py-1.5 text-xs text-white/80"
    >
      Menu
      {badge > 0 && (
        <span className="absolute -right-1.5 -top-1.5 min-w-[18px] rounded-full bg-red-500 px-1 text-center text-[11px] font-semibold leading-[18px] text-white">
          <span aria-hidden>{badge > 99 ? "99+" : badge}</span>
          <span className="sr-only">{badge} waiting</span>
        </span>
      )}
    </button>
  );
}

/** Full-height sheet with the nav on phones. Esc closes; focus returns to the Menu button. */
function MobileMenu({ onClose, email, children }: { onClose: () => void; email: string | null; children: React.ReactNode }) {
  const panel = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const opener = document.activeElement as HTMLElement | null;
    panel.current?.querySelector<HTMLElement>("a, button")?.focus();
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
      if (e.key !== "Tab" || !panel.current) return;
      // Keep focus inside the sheet.
      const items = [...panel.current.querySelectorAll<HTMLElement>("a, button")];
      const first = items[0];
      const last = items[items.length - 1];
      if (e.shiftKey && document.activeElement === first) {
        e.preventDefault();
        last?.focus();
      } else if (!e.shiftKey && document.activeElement === last) {
        e.preventDefault();
        first?.focus();
      }
    };
    document.addEventListener("keydown", onKey);
    return () => {
      document.removeEventListener("keydown", onKey);
      opener?.focus();
    };
  }, [onClose]);

  return (
    <div className="fixed inset-0 z-40 lg:hidden">
      <button type="button" aria-label="Close menu" onClick={onClose} className="absolute inset-0 bg-black/60" tabIndex={-1} />
      <div
        id="admin-menu"
        ref={panel}
        role="dialog"
        aria-modal="true"
        aria-label="Admin sections"
        className="absolute inset-y-0 left-0 flex w-[min(300px,85vw)] flex-col bg-[#110d0b] px-3 py-5 shadow-rail"
      >
        <div className="flex-1 overflow-y-auto">{children}</div>
        <p className="truncate px-3 text-xs text-white/40">{email ?? "Signed in"} · admin</p>
      </div>
    </div>
  );
}
