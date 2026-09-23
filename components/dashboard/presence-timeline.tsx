"use client";

import type { VisitRow } from "@/lib/visits";
import { endOfDay, startOfDay } from "@/lib/visits";

const START_HOUR = 7;
const END_HOUR = 20;

type Span = {
  id: string;
  name: string;
  from: number;
  to: number;
  label: string;
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
    from,
    to,
    label: `${fmt.format(new Date(from))} – ${fmt.format(new Date(to))}`,
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

  return (
    <div className="rounded-lg border border-border bg-card p-3">
      <p className="text-sm font-medium">On site</p>
      <p className="text-xs text-muted-foreground">
        Check-in to check-out for the selected day. Scheduled windows show when nobody has checked in yet.
      </p>
      {spans.length === 0 ? (
        <p className="mt-3 text-sm text-muted-foreground">Nobody is scheduled or on site this day.</p>
      ) : (
        <ul className="mt-3 space-y-2">
          {spans.map((span) => {
            const left = percent(span.from, day);
            const right = percent(span.to, day);
            return (
              <li key={span.id}>
                <div className="mb-1 flex items-baseline justify-between gap-2 text-xs">
                  <span className="truncate font-medium">{span.name}</span>
                  <span className="shrink-0 text-muted-foreground">{span.label}</span>
                </div>
                <div className="relative h-2 rounded-full bg-muted">
                  <div
                    className="absolute inset-y-0 rounded-full bg-foreground"
                    style={{ left: `${left}%`, width: `${Math.max(right - left, 2)}%` }}
                  />
                </div>
              </li>
            );
          })}
        </ul>
      )}
    </div>
  );
}
