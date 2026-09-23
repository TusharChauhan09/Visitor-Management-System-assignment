"use client";

import type { VisitRow } from "@/lib/visits";
import { endOfDay, startOfDay } from "@/lib/visits";
import { cn } from "@/lib/utils";

const START_HOUR = 7;
const END_HOUR = 20;

type Span = {
  id: string;
  name: string;
  host: string;
  from: number;
  to: number;
  label: string;
  status: string;
};

function presenceSpan(visit: VisitRow, day: Date): Span | null {
  const dayStart = startOfDay(day).getTime();
  const dayEnd = endOfDay(day).getTime();
  const start = visit.checkInAt
    ? new Date(visit.checkInAt)
    : visit.windowStart
      ? new Date(visit.windowStart)
      : null;
  let end = visit.checkOutAt
    ? new Date(visit.checkOutAt)
    : visit.windowEnd
      ? new Date(visit.windowEnd)
      : null;

  if (visit.status === "CHECKED_IN" && visit.checkInAt && !visit.checkOutAt) {
    end = new Date();
  }

  if (!start || !end) return null;

  const from = Math.max(start.getTime(), dayStart);
  const to = Math.min(end.getTime(), dayEnd);
  if (to <= from) return null;

  const fmt = new Intl.DateTimeFormat("en-IN", { timeStyle: "short" });
  return {
    id: visit.id,
    name: visit.visitor.fullName,
    host: visit.host.fullName,
    from,
    to,
    label: `${fmt.format(new Date(from))} – ${fmt.format(new Date(to))}`,
    status: visit.status,
  };
}

function percent(time: number, day: Date) {
  const origin = startOfDay(day);
  origin.setHours(START_HOUR, 0, 0, 0);
  const end = startOfDay(day);
  end.setHours(END_HOUR, 0, 0, 0);
  const ratio = (time - origin.getTime()) / (end.getTime() - origin.getTime());
  return Math.min(100, Math.max(0, ratio * 100));
}

function hourLabels(day: Date) {
  const labels: string[] = [];
  for (let hour = START_HOUR; hour <= END_HOUR; hour += 3) {
    const d = startOfDay(day);
    d.setHours(hour, 0, 0, 0);
    labels.push(
      new Intl.DateTimeFormat("en-IN", { hour: "numeric" }).format(d)
    );
  }
  return labels;
}

const BAR_STYLES: Record<string, string> = {
  CHECKED_IN: "bg-blue-500 dark:bg-blue-400",
  CHECKED_OUT: "bg-muted-foreground/70",
  APPROVED: "bg-emerald-500/80 dark:bg-emerald-400/80",
  PENDING: "bg-amber-400/80",
};

export function PresenceTimeline({
  visits,
  day,
}: {
  visits: VisitRow[];
  day: Date;
}) {
  const spans = visits
    .map((visit) => presenceSpan(visit, day))
    .filter((span): span is Span => span !== null);

  const ticks = hourLabels(day);

  return (
    <div className="rounded-2xl border border-border bg-card p-4 shadow-sm sm:p-5">
      <div className="flex flex-wrap items-end justify-between gap-3">
        <div>
          <p className="text-base font-semibold tracking-tight">Facility timeline</p>
          <p className="mt-1 max-w-xl text-xs leading-relaxed text-muted-foreground">
            {START_HOUR}:00–{END_HOUR}:00 view for the selected day. Bars show scheduled windows or
            actual check-in to check-out.
          </p>
        </div>
        <div className="flex flex-wrap gap-3 text-[11px] text-muted-foreground">
          <span className="flex items-center gap-1.5">
            <span className="size-2 rounded-full bg-emerald-500" /> Approved / scheduled
          </span>
          <span className="flex items-center gap-1.5">
            <span className="size-2 rounded-full bg-blue-500" /> On site
          </span>
          <span className="flex items-center gap-1.5">
            <span className="size-2 rounded-full bg-muted-foreground/70" /> Checked out
          </span>
        </div>
      </div>

      <div className="mt-5 overflow-x-auto">
        <div className="min-w-[640px]">
          <div className="mb-2 grid grid-cols-[9rem_1fr] gap-3 text-[10px] uppercase tracking-wide text-muted-foreground">
            <span>Visitor</span>
            <div className="grid grid-cols-5 gap-0 px-1">
              {ticks.map((tick) => (
                <span key={tick} className="text-center">
                  {tick}
                </span>
              ))}
            </div>
          </div>

          {spans.length === 0 ? (
            <p className="rounded-xl border border-dashed border-border bg-muted/20 px-4 py-10 text-center text-sm text-muted-foreground">
              Nobody is scheduled or on site for this day.
            </p>
          ) : (
            <ul className="space-y-3">
              {spans.map((span) => {
                const left = percent(span.from, day);
                const right = percent(span.to, day);
                const barClass = BAR_STYLES[span.status] ?? "bg-foreground/80";
                return (
                  <li
                    key={span.id}
                    className="grid grid-cols-[9rem_1fr] items-center gap-3 rounded-xl border border-border/60 bg-muted/15 px-3 py-3"
                  >
                    <div className="min-w-0">
                      <p className="truncate text-sm font-medium">{span.name}</p>
                      <p className="truncate text-xs text-muted-foreground">Host: {span.host}</p>
                      <p className="mt-0.5 text-[11px] tabular-nums text-muted-foreground">{span.label}</p>
                    </div>
                    <div className="relative h-8 rounded-lg bg-muted/60 ring-1 ring-border/50">
                      <div
                        className={cn("absolute inset-y-1 rounded-md shadow-sm", barClass)}
                        style={{ left: `${left}%`, width: `${Math.max(right - left, 1.5)}%` }}
                      />
                    </div>
                  </li>
                );
              })}
            </ul>
          )}
        </div>
      </div>
    </div>
  );
}
