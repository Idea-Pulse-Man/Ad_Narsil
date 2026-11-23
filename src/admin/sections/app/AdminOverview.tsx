"use client";

// Ported from museum-app/src/components/AdminOverview.tsx — the app's admin is the spec (admin brief §1):
// the same numbers and sections. Web changes: laid out as a desktop dashboard — a KPI row led by one
// hero figure, one range filter above both charts, charts drawn at their card's measured width (the
// app's fixed 360×200 viewBox shrank to a strip on wide screens) with a crosshair readout, arrow-key
// reading and a table view, and alerts that link to the screen that fixes them.

import { useCallback, useEffect, useLayoutEffect, useRef, useState, type KeyboardEvent, type RefObject } from "react";
import { fetchAdminStats, type AdminDayCount, type AdminStats } from "../../lib/admin";
import type { CanvasOrderStatus } from "../../lib/orders";
import { AdminState, StatusBadge, fmtMoney } from "./admin-ui";

interface AdminOverviewProps {
  onJumpToOrders: (status: CanvasOrderStatus | "all") => void;
  /** Artworks → Pending. */
  onJumpToPending: () => void;
}

type ChartRange = 7 | 14 | 30 | 60 | 90 | 180 | 365;

const RANGE_OPTIONS: { id: ChartRange; label: string; title: string }[] = [
  { id: 7, label: "7D", title: "Last 7 days" },
  { id: 14, label: "14D", title: "Last 14 days" },
  { id: 30, label: "1M", title: "Last month" },
  { id: 60, label: "2M", title: "Last 2 months" },
  { id: 90, label: "3M", title: "Last 3 months" },
  { id: 180, label: "6M", title: "Last 6 months" },
  { id: 365, label: "1Y", title: "Last year" },
];

// Series colours, checked with the dataviz palette validator (dark mode, all pairs) on the card
// surface: lightness band, chroma, colour-blind separation and 3:1 contrast all pass.
const BLUE = "#3987e5"; // member sign-ins
const AMBER = "#c98500"; // member sign-ups
const AQUA = "#199e70"; // new Guild subscriptions
/** The card surface (ink + 4% white), used for the ring around markers. */
const SURFACE = "#1d1a18";

export default function AdminOverview(props: AdminOverviewProps) {
  const [stats, setStats] = useState<AdminStats | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const load = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      setStats(await fetchAdminStats());
    } catch (err) {
      setError(err instanceof Error ? err.message : "Could not load stats.");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    void load();
  }, [load]);

  if (loading || error || !stats) {
    return (
      <AdminState
        loading={loading}
        error={error}
        empty={!stats}
        emptyLabel="No stats available."
        onRetry={() => void load()}
      />
    );
  }

  return <OverviewBoard stats={stats} {...props} />;
}

/** The board itself, given the stats (admin_stats). */
export function OverviewBoard({ stats, onJumpToOrders, onJumpToPending }: AdminOverviewProps & { stats: AdminStats }) {
  const [range, setRange] = useState<ChartRange>(14);

  const usersToday = stats.users_today ?? 0;
  const usersYesterday = stats.users_yesterday ?? 0;
  const usersDelta = stats.users_delta ?? usersToday - usersYesterday;
  const guests = stats.guests ?? 0;
  const guestsToday = stats.guests_today ?? 0;
  const signinsToday = stats.signins_members_today ?? 0;
  const signinsDelta = stats.signins_delta ?? 0;
  const subsActive = stats.subscribers_active ?? 0;
  const subsToday = stats.subscribers_today ?? 0;
  const subsYesterday = stats.subscribers_yesterday ?? 0;
  const pending = stats.pending_approvals ?? 0;

  const activity = alignDays([stats.signins_by_day ?? [], stats.signups_by_day ?? []], range);
  const subscriptions = alignDays([stats.subscriptions_by_day ?? []], range);
  const pipeline = Object.entries(stats.orders_by_status).sort((a, b) => b[1] - a[1]);

  return (
    <div className="space-y-10">
      {(stats.needs_attention > 0 || pending > 0) && (
        <div className="grid gap-3 md:grid-cols-2">
          {stats.needs_attention > 0 && (
            <AlertButton
              tone="critical"
              label={`${stats.needs_attention} canvas ${plural(stats.needs_attention, "order needs", "orders need")} fulfilment`}
              action="Open Canvas"
              onClick={() => onJumpToOrders("fulfillment_failed")}
            />
          )}
          {pending > 0 && (
            <AlertButton
              tone="warning"
              label={`${pending} ${plural(pending, "upload is", "uploads are")} waiting for approval`}
              action="Review"
              onClick={onJumpToPending}
            />
          )}
        </div>
      )}

      <section aria-label="Members" className="grid grid-cols-2 gap-3 xl:grid-cols-3">
        <div className="col-span-2 flex flex-col justify-between rounded-2xl border border-white/10 bg-gradient-to-br from-white/[0.08] to-white/[0.02] p-5 xl:col-span-1 xl:row-span-2">
          <div>
            <p className="text-sm text-white/60">Total members</p>
            <p className="mt-3 text-5xl font-semibold leading-none tracking-tight text-white">
              {fmtCount(stats.users)}
            </p>
            <p className="mt-3 text-xs text-white/45">Registered accounts only — guests excluded.</p>
          </div>
          <p className="mt-6 border-t border-white/8 pt-3 text-sm text-white/60">
            <span className="font-semibold text-white">{fmtCount(stats.new_users_7d)}</span> new in the last 7 days
          </p>
        </div>
        <StatTile label="New members today" value={usersToday} delta={usersDelta} note={`${usersYesterday} yesterday`} />
        <StatTile label="Member sign-ins today" value={signinsToday} delta={signinsDelta} />
        <StatTile label="Guild members" value={subsActive} note={`+${subsToday} today · +${subsYesterday} yesterday`} />
        <StatTile
          label="Guests"
          value={guests}
          note={guestsToday > 0 ? `+${guestsToday} today · not counted as members` : "Not counted as members"}
        />
      </section>

      <section aria-labelledby="overview-activity">
        <SectionHeading id="overview-activity" title="Activity" hint="Members only — guests excluded. Days are UTC." />
        <RangeTabs value={range} onChange={setRange} />
        <div className="mt-4 grid gap-3 xl:grid-cols-2">
          <ChartCard
            title="Sign-ins and sign-ups"
            days={activity.days}
            series={[
              { id: "signins", kind: "line", label: "Sign-ins", noun: ["sign-in", "sign-ins"], color: BLUE, values: activity.values[0] ?? [] },
              // Sign-ups as columns under the sign-in line: on a day the two counts tie, both stay visible.
              { id: "signups", kind: "bar", label: "Sign-ups", noun: ["sign-up", "sign-ups"], color: AMBER, values: activity.values[1] ?? [] },
            ]}
          />
          <ChartCard
            title="New Guild subscriptions"
            days={subscriptions.days}
            series={[
              {
                id: "subscriptions",
                kind: "bar",
                label: "New subscriptions",
                noun: ["new subscription", "new subscriptions"],
                color: AQUA,
                values: subscriptions.values[0] ?? [],
              },
            ]}
          />
        </div>
      </section>

      <div className="grid gap-10 xl:grid-cols-2">
        <section aria-labelledby="overview-catalog">
          <SectionHeading id="overview-catalog" title="Catalog" hint="Works in the member catalog." />
          <div className="mt-4 grid grid-cols-2 gap-3">
            <StatTile label="Artworks" value={stats.artworks} />
            <StatTile label="Pending approval" value={pending} />
            <StatTile label="Featured" value={stats.featured} />
            <StatTile label="Hidden" value={stats.hidden} />
          </div>
        </section>

        <section aria-labelledby="overview-revenue">
          <SectionHeading id="overview-revenue" title="Canvas revenue" hint="Paid, submitted, shipped and completed orders." />
          <div className="mt-4 grid grid-cols-2 gap-3">
            <StatTile label="Gross" value={fmtMoney(stats.revenue)} />
            <StatTile label="Orders" value={stats.orders} />
            <StatTile label="Artist payouts" value={fmtMoney(stats.artist_payout)} />
            <StatTile label="Platform cut" value={fmtMoney(stats.platform_cut)} />
          </div>
        </section>
      </div>

      <section aria-labelledby="overview-pipeline">
        <SectionHeading id="overview-pipeline" title="Order pipeline" hint="Canvas orders by status — open one to see its orders." />
        {pipeline.length === 0 ? (
          <p className="mt-4 text-sm text-white/50">No orders yet.</p>
        ) : (
          <ul className="mt-4 grid gap-2 sm:grid-cols-2 lg:grid-cols-4">
            {pipeline.map(([status, count]) => (
              <li key={status}>
                <button
                  type="button"
                  onClick={() => onJumpToOrders(status as CanvasOrderStatus)}
                  className="flex w-full items-center justify-between gap-3 rounded-xl border border-white/10 bg-white/[0.03] px-3.5 py-3 text-left transition-colors hover:border-white/20 hover:bg-white/[0.06]"
                >
                  <StatusBadge status={status} />
                  <span className="text-lg font-semibold text-white">{fmtCount(count)}</span>
                </button>
              </li>
            ))}
          </ul>
        )}
      </section>
    </div>
  );
}

// ── Figures ────────────────────────────────────────────────────────────────

function SectionHeading({ id, title, hint }: { id: string; title: string; hint: string }) {
  return (
    <>
      <h2 id={id} className="font-serif text-xl text-white">
        {title}
      </h2>
      <p className="mt-1 text-xs text-white/50">{hint}</p>
    </>
  );
}

function StatTile({
  label,
  value,
  delta,
  note,
}: {
  label: string;
  value: number | string;
  /** Signed change vs yesterday; up is good. */
  delta?: number;
  note?: string;
}) {
  return (
    <div className="rounded-2xl border border-white/10 bg-white/[0.04] px-4 py-4">
      <p className="text-sm text-white/60">{label}</p>
      <p className="mt-2 text-3xl font-semibold leading-none tracking-tight text-white">
        {typeof value === "number" ? fmtCount(value) : value}
      </p>
      {(delta !== undefined || note) && (
        <p className="mt-3 flex flex-wrap items-center gap-x-2 gap-y-1 text-xs text-white/50">
          {delta !== undefined && <Delta value={delta} />}
          {delta !== undefined && note && <span aria-hidden>·</span>}
          {note && <span>{note}</span>}
        </p>
      )}
    </div>
  );
}

function Delta({ value }: { value: number }) {
  if (value === 0) return <span>Same as yesterday</span>;
  const up = value > 0;
  return (
    <span className={`inline-flex items-center gap-1 font-medium ${up ? "text-emerald-300" : "text-red-300"}`}>
      <span aria-hidden className="text-[9px]">
        {up ? "▲" : "▼"}
      </span>
      {up ? "+" : "−"}
      {Math.abs(value)} vs yesterday
    </span>
  );
}

function AlertButton({
  tone,
  label,
  action,
  onClick,
}: {
  tone: "critical" | "warning";
  label: string;
  action: string;
  onClick: () => void;
}) {
  const box =
    tone === "critical"
      ? "border-red-400/30 bg-red-500/10 text-red-100 hover:bg-red-500/15"
      : "border-amber-300/30 bg-amber-400/10 text-amber-100 hover:bg-amber-400/15";
  const icon = tone === "critical" ? "bg-red-400/25" : "bg-amber-300/25";
  return (
    <button
      type="button"
      onClick={onClick}
      className={`flex w-full items-center justify-between gap-3 rounded-2xl border px-4 py-3 text-left text-sm transition-colors ${box}`}
    >
      <span className="flex items-center gap-2.5">
        <span aria-hidden className={`grid h-5 w-5 shrink-0 place-items-center rounded-full text-[11px] font-bold ${icon}`}>
          !
        </span>
        {label}
      </span>
      <span className="shrink-0 text-xs font-medium opacity-80">{action} →</span>
    </button>
  );
}

// ── Charts ─────────────────────────────────────────────────────────────────

/** The one filter row: it scopes both charts below it. */
function RangeTabs({ value, onChange }: { value: ChartRange; onChange: (next: ChartRange) => void }) {
  return (
    <div role="group" aria-label="Chart range" className="mt-4 flex flex-wrap gap-1.5">
      {RANGE_OPTIONS.map((opt) => (
        <button
          key={opt.id}
          type="button"
          title={opt.title}
          aria-label={opt.title}
          aria-pressed={value === opt.id}
          onClick={() => onChange(opt.id)}
          className={`rounded-full px-3 py-1.5 text-xs font-semibold tracking-wide transition-colors ${
            value === opt.id ? "bg-white text-ink" : "border border-white/12 text-white/60 hover:border-white/25 hover:text-canvas"
          }`}
        >
          {opt.label}
        </button>
      ))}
    </div>
  );
}

interface Series {
  id: string;
  /** Columns for rare daily events, a line for the steady one. Columns draw first, lines on top. */
  kind: "bar" | "line";
  label: string;
  /** Singular / plural, for the totals line. */
  noun: [string, string];
  color: string;
  values: number[];
}

const PAD_T = 12;
const PLOT_H = 176;
const AXIS_H = 26;
const PAD_L = 36;
const PAD_R = 14;
const CHART_H = PAD_T + PLOT_H + AXIS_H;
const TIP_W = 176;

function ChartCard({ title, days, series }: { title: string; days: string[]; series: Series[] }) {
  const [table, setTable] = useState(false);
  const n = days.length;
  const span = n === 0 ? "No data" : n === 1 ? fmtDay(days[0]!) : `${fmtDay(days[0]!)} – ${fmtDay(days[n - 1]!)}`;

  return (
    <div className="min-w-0 rounded-2xl border border-white/10 bg-white/[0.04] p-4 sm:p-5">
      <div className="flex items-start justify-between gap-3">
        <div className="min-w-0">
          <h3 className="text-sm font-semibold text-white">{title}</h3>
          <p className="mt-0.5 text-xs text-white/45">{span}</p>
        </div>
        {n > 0 && (
          <button
            type="button"
            onClick={() => setTable((t) => !t)}
            aria-pressed={table}
            className="shrink-0 rounded-full border border-white/12 px-3 py-1 text-[11px] font-medium text-white/60 transition-colors hover:border-white/25 hover:text-canvas"
          >
            {table ? "Show chart" : "Show table"}
          </button>
        )}
      </div>

      {/* Totals for the range; with two series it is also the legend (keys mirror the marks). */}
      <ul className="mt-3 flex flex-wrap gap-x-5 gap-y-1">
        {series.map((s) => {
          const total = s.values.reduce((a, b) => a + b, 0);
          return (
            <li key={s.id} className="flex items-center gap-2 text-xs text-white/55">
              {series.length > 1 && (
                <span
                  aria-hidden
                  className={s.kind === "bar" ? "h-2.5 w-2.5 rounded-[3px]" : "h-0.5 w-4 rounded-full"}
                  style={{ backgroundColor: s.color }}
                />
              )}
              <span className="text-lg font-semibold leading-none text-white">{fmtCount(total)}</span>
              {total === 1 ? s.noun[0] : s.noun[1]}
            </li>
          );
        })}
      </ul>

      <div className="mt-4">
        {n === 0 ? (
          <p className="flex items-center justify-center text-sm text-white/45" style={{ height: CHART_H }}>
            No data for this range.
          </p>
        ) : table ? (
          <ChartTable caption={title} days={days} series={series} />
        ) : (
          <DayChart label={title} days={days} series={series} />
        )}
      </div>
    </div>
  );
}

/** One day per band: columns sit in the band, line points at its centre, one shared y-axis. */
function DayChart({ label, days, series }: { label: string; days: string[]; series: Series[] }) {
  const wrapRef = useRef<HTMLDivElement>(null);
  const width = useElementWidth(wrapRef);
  const [active, setActive] = useState<number | null>(null);

  const n = days.length;
  const last = n - 1;
  const { max, step } = niceScale(Math.max(0, ...series.flatMap((s) => s.values)));
  const ticks: number[] = [];
  for (let t = 0; t <= max; t += step) ticks.push(t);

  const plotW = Math.max(1, width - PAD_L - PAD_R);
  const band = plotW / Math.max(1, n);
  const x = (i: number) => PAD_L + band * (i + 0.5);
  const y = (v: number) => PAD_T + PLOT_H - (v / max) * PLOT_H;
  const baseline = y(0);
  const labels = axisLabelIndices(n, Math.floor(plotW / 76));
  // ≤ 24px, and never the whole band: the rest is the gap between columns.
  const barW = Math.min(24, Math.max(1, band * 0.62));
  const bars = series.filter((s) => s.kind === "bar");
  const lines = series.filter((s) => s.kind === "line");

  // Value at the end of each line — unless two would collide (then legend, tooltip and table carry it).
  const ends = lines.map((s) => ({ id: s.id, v: s.values[last] ?? 0 }));
  const endLabelsFit = ends.every((a, i) => ends.every((b, j) => j <= i || Math.abs(y(a.v) - y(b.v)) >= 16));

  const indexAt = (clientX: number): number => {
    const el = wrapRef.current;
    if (!el) return 0;
    const px = clientX - el.getBoundingClientRect().left;
    return Math.min(last, Math.max(0, Math.floor((px - PAD_L) / band)));
  };

  const onKeyDown = (e: KeyboardEvent<HTMLDivElement>) => {
    const current = active ?? last;
    let next: number | null = null;
    if (e.key === "ArrowLeft") next = Math.max(0, current - 1);
    else if (e.key === "ArrowRight") next = Math.min(last, current + 1);
    else if (e.key === "Home") next = 0;
    else if (e.key === "End") next = last;
    else if (e.key === "Escape") setActive(null);
    if (next === null) return;
    e.preventDefault();
    setActive(next);
  };

  const readout =
    active === null
      ? ""
      : `${fmtDay(days[active]!, true)}: ${series.map((s) => `${s.values[active] ?? 0} ${s.label.toLowerCase()}`).join(", ")}`;
  const tipLeft = active === null ? 0 : x(active) + 12 + TIP_W <= width ? x(active) + 12 : Math.max(0, x(active) - 12 - TIP_W);

  return (
    <div
      ref={wrapRef}
      tabIndex={0}
      role="group"
      aria-label={`${label} chart. Use the arrow keys to read each day.`}
      onPointerMove={(e) => setActive(indexAt(e.clientX))}
      onPointerLeave={() => setActive(null)}
      onKeyDown={onKeyDown}
      onBlur={() => setActive(null)}
      className="relative w-full min-w-0 touch-pan-y select-none rounded-lg outline-none focus-visible:ring-2 focus-visible:ring-accent/60"
      style={{ height: CHART_H }}
    >
      {width > 0 && (
        // Drawn in measured pixels (crisp 11px text), but sized 100% so it can never push or overflow
        // its card — between a resize and the next measurement it just scales a touch.
        <svg viewBox={`0 0 ${width} ${CHART_H}`} width="100%" height={CHART_H} aria-hidden="true" className="block">
          {ticks.map((t) => (
            <g key={t}>
              <line
                x1={PAD_L}
                x2={width - PAD_R}
                y1={y(t)}
                y2={y(t)}
                stroke={t === 0 ? "rgba(255,255,255,0.18)" : "rgba(255,255,255,0.07)"}
                shapeRendering="crispEdges"
              />
              <text x={PAD_L - 10} y={y(t)} dy="0.32em" textAnchor="end" className="fill-white/40 text-[11px] tabular-nums">
                {fmtCount(t)}
              </text>
            </g>
          ))}

          {labels.map((i) => {
            // The first and last labels hug the plot edges so they never run off the card.
            const edge = n > 1 && (i === 0 || i === last);
            return (
              <text
                key={i}
                x={edge ? (i === 0 ? PAD_L : width - PAD_R) : x(i)}
                y={PAD_T + PLOT_H + 18}
                textAnchor={edge ? (i === 0 ? "start" : "end") : "middle"}
                className="fill-white/40 text-[11px]"
              >
                {fmtDay(days[i]!)}
              </text>
            );
          })}

          {active !== null && (
            <line x1={x(active)} x2={x(active)} y1={PAD_T} y2={baseline} stroke="rgba(255,255,255,0.3)" shapeRendering="crispEdges" />
          )}

          {bars.map((s, k) => {
            const each = barW / bars.length;
            return (
              <g key={s.id} fill={s.color}>
                {s.values.map((v, i) =>
                  v > 0 ? (
                    <path
                      key={days[i]}
                      d={columnPath(x(i) - barW / 2 + each * (k + 0.5), each, y(v), baseline)}
                      opacity={active === null || active === i ? 1 : 0.45}
                    />
                  ) : null,
                )}
              </g>
            );
          })}

          {lines.map((s) => (
            <path
              key={s.id}
              d={linePath(s.values, x, y)}
              fill="none"
              stroke={s.color}
              strokeWidth={2}
              strokeLinejoin="round"
              strokeLinecap="round"
            />
          ))}
          {lines.map((s) => {
            const i = active ?? last;
            return <circle key={s.id} cx={x(i)} cy={y(s.values[i] ?? 0)} r={4} fill={s.color} stroke={SURFACE} strokeWidth={2} />;
          })}
          {active === null &&
            endLabelsFit &&
            ends.map(({ id, v }) => (
              <text key={id} x={x(last) - 9} y={y(v) - 9} textAnchor="end" className="fill-white/80 text-[11px] font-semibold tabular-nums">
                {fmtCount(v)}
              </text>
            ))}
        </svg>
      )}

      {active !== null && width > 0 && (
        <div
          className="pointer-events-none absolute z-10 rounded-xl border border-white/12 bg-[#28221e]/95 px-3 py-2 shadow-xl"
          style={{ width: TIP_W, top: PAD_T, left: tipLeft }}
        >
          <p className="text-[11px] text-white/50">{fmtDay(days[active]!, true)}</p>
          <ul className="mt-1 space-y-1">
            {series.map((s) => (
              <li key={s.id} className="flex items-center gap-2 text-xs">
                <span aria-hidden className="h-0.5 w-3 shrink-0 rounded-full" style={{ backgroundColor: s.color }} />
                <span className="font-semibold tabular-nums text-white">{fmtCount(s.values[active] ?? 0)}</span>
                <span className="truncate text-white/55">{s.label}</span>
              </li>
            ))}
          </ul>
        </div>
      )}
      <p className="sr-only" aria-live="polite">
        {readout}
      </p>
    </div>
  );
}

/** The chart's table twin: every value without hovering, newest day first. */
function ChartTable({ caption, days, series }: { caption: string; days: string[]; series: Series[] }) {
  const rows = days.map((day, i) => ({ day, i })).reverse();
  return (
    <div className="overflow-y-auto rounded-lg border border-white/8" style={{ height: CHART_H }}>
      <table className="w-full text-left text-xs">
        <caption className="sr-only">{caption}</caption>
        <thead className="sticky top-0 bg-[#231e1b] text-white/50">
          <tr>
            <th scope="col" className="px-3 py-2 font-medium">
              Day (UTC)
            </th>
            {series.map((s) => (
              <th key={s.id} scope="col" className="px-3 py-2 text-right font-medium">
                {s.label}
              </th>
            ))}
          </tr>
        </thead>
        <tbody className="divide-y divide-white/5 text-white/80">
          {rows.map(({ day, i }) => (
            <tr key={day}>
              <th scope="row" className="px-3 py-1.5 font-normal text-white/60">
                {fmtDay(day, true)}
              </th>
              {series.map((s) => (
                <td key={s.id} className="px-3 py-1.5 text-right tabular-nums">
                  {fmtCount(s.values[i] ?? 0)}
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

/** The element's width: measured before the first paint, then kept in step on resize. */
function useElementWidth(ref: RefObject<HTMLElement | null>): number {
  const [width, setWidth] = useState(0);
  useLayoutEffect(() => {
    const el = ref.current;
    if (!el) return;
    const measure = () => setWidth(Math.round(el.getBoundingClientRect().width));
    measure();
    const observer = new ResizeObserver(measure);
    observer.observe(el);
    return () => observer.disconnect();
  }, [ref]);
  return width;
}

// ── Data helpers ───────────────────────────────────────────────────────────

function dayCount(p: AdminDayCount): number {
  if (typeof p.members === "number") return p.members;
  return Number(p.count) || 0;
}

/**
 * Line several day series up on one set of days (the last `range` of them).
 * The RPC returns every day, zeros included (generate_series), so the last N
 * entries are the last N days.
 */
function alignDays(seriesList: AdminDayCount[][], range: number): { days: string[]; values: number[][] } {
  const all = new Set<string>();
  for (const s of seriesList) for (const p of s) all.add(p.day.slice(0, 10));
  const days = [...all].sort().slice(-range);
  const values = seriesList.map((s) => {
    const byDay = new Map(s.map((p) => [p.day.slice(0, 10), dayCount(p)]));
    return days.map((d) => byDay.get(d) ?? 0);
  });
  return { days, values };
}

/** A clean y-axis top and integer step: ≤ 5 gridlines at 1 / 2 / 5 × 10ⁿ. */
function niceScale(rawMax: number): { max: number; step: number } {
  if (rawMax <= 4) return { max: 4, step: 1 };
  const rough = rawMax / 4;
  const magnitude = 10 ** Math.floor(Math.log10(rough));
  const norm = rough / magnitude;
  const step = (norm <= 1 ? 1 : norm <= 2 ? 2 : norm <= 5 ? 5 : 10) * magnitude;
  return { max: Math.ceil(rawMax / step) * step, step };
}

/** Evenly spaced x labels, first and last always included. */
function axisLabelIndices(n: number, maxLabels: number): number[] {
  if (n <= 0) return [];
  if (n === 1) return [0];
  const count = Math.min(n, Math.max(2, maxLabels));
  const out = new Set<number>();
  for (let k = 0; k < count; k++) out.add(Math.round((k * (n - 1)) / (count - 1)));
  return [...out];
}

function linePath(values: number[], x: (i: number) => number, y: (v: number) => number): string {
  return values.map((v, i) => `${i === 0 ? "M" : "L"}${x(i).toFixed(1)},${y(v).toFixed(1)}`).join("");
}

/** A column centred on `cx`: 4px rounded top, square at the baseline. */
function columnPath(cx: number, w: number, top: number, base: number): string {
  const x0 = cx - w / 2;
  const x1 = cx + w / 2;
  const r = Math.min(4, w / 2, base - top);
  const f = (v: number) => v.toFixed(1);
  return `M${f(x0)},${f(base)}L${f(x0)},${f(top + r)}Q${f(x0)},${f(top)} ${f(x0 + r)},${f(top)}L${f(x1 - r)},${f(top)}Q${f(x1)},${f(top)} ${f(x1)},${f(top + r)}L${f(x1)},${f(base)}Z`;
}

// ── Formatting ─────────────────────────────────────────────────────────────

const compact = new Intl.NumberFormat(undefined, { notation: "compact", maximumFractionDigits: 1 });

/** 1,284 in full; 12.9K from ten thousand up. */
function fmtCount(n: number): string {
  return Math.abs(n) >= 10_000 ? compact.format(n) : n.toLocaleString();
}

function fmtDay(iso: string, long = false): string {
  const d = new Date(`${iso.slice(0, 10)}T12:00:00Z`);
  if (Number.isNaN(d.getTime())) return iso.slice(0, 10);
  return d.toLocaleDateString(
    undefined,
    long
      ? { weekday: "short", month: "short", day: "numeric", year: "numeric", timeZone: "UTC" }
      : { month: "short", day: "numeric", timeZone: "UTC" },
  );
}

function plural(n: number, one: string, many: string): string {
  return n === 1 ? one : many;
}
