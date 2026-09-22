"use client";

import { useMemo, useState } from "react";
import type { VisitLogEntry } from "@/lib/types";
import { visitStatusLabel, VISIT_STATUS_BADGE } from "@/lib/visits/status";
import { formatVisitWindow } from "@/lib/visits/visit-window";
import { Modal } from "@/components/ui/modal";
import { VisitDetailPanel } from "@/components/dashboard/visit-detail-panel";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";

const ALL = "ALL";

export function VisitLogTable({
  visits,
  showHost = true,
}: {
  visits: VisitLogEntry[];
  showHost?: boolean;
}) {
  const [filter, setFilter] = useState(ALL);
  const [selected, setSelected] = useState<VisitLogEntry | null>(null);

  const statuses = useMemo(() => {
    const set = new Set(visits.map((v) => v.status));
    return Array.from(set).sort();
  }, [visits]);

  const filtered =
    filter === ALL ? visits : visits.filter((v) => v.status === filter);

  if (visits.length === 0) {
    return <p className="text-sm text-muted-foreground">No visitor logs yet.</p>;
  }

  return (
    <div className="flex min-h-0 flex-1 flex-col gap-2">
      <div className="flex shrink-0 flex-wrap gap-1.5">
        <FilterChip active={filter === ALL} onClick={() => setFilter(ALL)} label="All" />
        {statuses.map((status) => (
          <FilterChip
            key={status}
            active={filter === status}
            onClick={() => setFilter(status)}
            label={visitStatusLabel(status)}
          />
        ))}
      </div>

      <div className="min-h-0 flex-1 overflow-auto rounded-lg border border-border bg-card">
        <table className="w-full min-w-[680px] text-left text-sm">
          <thead className="sticky top-0 z-[1] border-b border-border bg-card text-muted-foreground">
            <tr>
              <th className="px-3 py-2 font-medium">Visitor</th>
              {showHost ? <th className="px-3 py-2 font-medium">Host</th> : null}
              <th className="px-3 py-2 font-medium">Window</th>
              <th className="px-3 py-2 font-medium">Status</th>
            </tr>
          </thead>
          <tbody>
            {filtered.map((visit) => {
              const badge =
                VISIT_STATUS_BADGE[visit.status] ?? "bg-muted text-foreground";
              return (
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
                  <td className="px-3 py-2 text-muted-foreground">
                    {formatVisitWindow(
                      visit.windowStart ? new Date(visit.windowStart) : null,
                      visit.windowEnd ? new Date(visit.windowEnd) : null
                    )}
                  </td>
                  <td className="px-3 py-2">
                    <span className={cn("rounded-full px-2 py-0.5 text-xs font-medium", badge)}>
                      {visitStatusLabel(visit.status)}
                    </span>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>

      <Modal
        open={selected !== null}
        title="Visit details"
        wide
        onClose={() => setSelected(null)}
      >
        {selected ? <VisitDetailPanel visit={selected} /> : null}
      </Modal>
    </div>
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
      <Badge variant={active ? "default" : "secondary"} className="h-6 cursor-pointer px-2.5">
        {label}
      </Badge>
    </button>
  );
}
