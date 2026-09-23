"use client";

import { useMemo, useState } from "react";
import type { VisitRow } from "@/lib/visits";
import { STATUS_BADGE, STATUS_LABEL, statusLabel } from "@/lib/visits";
import { formatWindow } from "@/lib/visits";
import { Modal } from "@/components/ui/modal";
import { VisitDetailPanel } from "@/components/dashboard/visit-detail-panel";
import { PresenceTimeline } from "@/components/dashboard/presence-timeline";
import { DatePicker } from "@/components/visit/date-time-field";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";

const ALL = "ALL";
const STATUSES = Object.keys(STATUS_LABEL);

export function VisitLogTable({
  visits,
  showHost = true,
  showTimeline = false,
}: {
  visits: VisitRow[];
  showHost?: boolean;
  showTimeline?: boolean;
}) {
  const [filter, setFilter] = useState(ALL);
  const [day, setDay] = useState(() => new Date());
  const [selected, setSelected] = useState<VisitRow | null>(null);

  const filtered = useMemo(
    () => (filter === ALL ? visits : visits.filter((visit) => visit.status === filter)),
    [filter, visits]
  );

  if (visits.length === 0) {
    return <p className="text-sm text-muted-foreground">No visitor logs yet.</p>;
  }

  return (
    <div className="flex min-h-0 flex-1 flex-col gap-3">
      <div className="flex shrink-0 flex-col gap-2 lg:flex-row lg:items-start">
        <div className="flex min-w-0 flex-1 flex-wrap items-center gap-1.5">
          <FilterChip active={filter === ALL} onClick={() => setFilter(ALL)} label="All" />
          {showTimeline ? <DatePicker value={day} onChange={setDay} /> : null}
          {STATUSES.map((status) => (
            <FilterChip
              key={status}
              active={filter === status}
              onClick={() => setFilter(status)}
              label={statusLabel(status)}
            />
          ))}
        </div>
        {showTimeline ? (
          <div className="w-full lg:w-[22rem] lg:shrink-0">
            <PresenceTimeline visits={filtered} day={day} />
          </div>
        ) : null}
      </div>

      <div className="min-h-0 flex-1 overflow-auto rounded-lg border border-border bg-card">
        <table className="w-full min-w-[560px] text-left text-sm">
          <thead className="sticky top-0 z-[1] border-b border-border bg-card text-muted-foreground">
            <tr>
              <th className="px-3 py-2 font-medium">Visitor</th>
              {showHost ? <th className="px-3 py-2 font-medium">Host</th> : null}
              <th className="px-3 py-2 font-medium">Window</th>
              <th className="px-3 py-2 font-medium">Status</th>
            </tr>
          </thead>
          <tbody>
            {filtered.map((visit) => (
              <tr
                key={visit.id}
                className="cursor-pointer border-b border-border/60 last:border-0 hover:bg-muted/40"
                onClick={() => setSelected(visit)}
              >
                <td className="px-3 py-2">
                  <p className="font-medium text-foreground">{visit.visitor.fullName}</p>
                  <p className="text-xs text-muted-foreground">{visit.purpose}</p>
                </td>
                {showHost ? (
                  <td className="px-3 py-2 text-muted-foreground">
                    {visit.host.fullName}
                    <span className="block text-xs">{visit.host.department}</span>
                  </td>
                ) : null}
                <td className="px-3 py-2 text-muted-foreground">{windowLabel(visit)}</td>
                <td className="px-3 py-2">
                  <StatusBadge status={visit.status} />
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        {filtered.length === 0 ? (
          <p className="px-3 py-6 text-sm text-muted-foreground">No visits with that status.</p>
        ) : null}
      </div>

      <Modal open={selected !== null} title="Visit details" wide onClose={() => setSelected(null)}>
        {selected ? <VisitDetailPanel visit={selected} /> : null}
      </Modal>
    </div>
  );
}

function windowLabel(visit: VisitRow) {
  return formatWindow(
    visit.windowStart ? new Date(visit.windowStart) : null,
    visit.windowEnd ? new Date(visit.windowEnd) : null
  );
}

function StatusBadge({ status }: { status: string }) {
  const badge = STATUS_BADGE[status] ?? "bg-muted text-foreground";
  return (
    <span className={cn("w-fit rounded-full px-2 py-0.5 text-xs font-medium", badge)}>
      {statusLabel(status)}
    </span>
  );
}

function FilterChip({
  active,
  onClick,
  label,
}: {
  active: boolean;
  onClick: () => void;
  label: string;
}) {
  return (
    <button type="button" onClick={onClick}>
      <Badge variant={active ? "default" : "secondary"} className="h-8 cursor-pointer px-2.5">
        {label}
      </Badge>
    </button>
  );
}
