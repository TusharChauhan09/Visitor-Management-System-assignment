"use client";

import { useMemo, useState } from "react";
import type { VisitLogEntry } from "@/lib/types";
import { visitStatusLabel, VISIT_STATUS_BADGE } from "@/lib/visits/status";
import { formatVisitWindow } from "@/lib/visits/visit-window";
import { Modal } from "@/components/ui/modal";
import { VisitDetailPanel } from "@/components/dashboard/visit-detail-panel";
import { Badge } from "@/components/ui/badge";
import { Card } from "@/components/ui/card";
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
    <>
      <div className="mb-3 flex flex-wrap gap-2">
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

      <Card className="overflow-hidden p-0 shadow-none">
        <div className="overflow-x-auto">
          <table className="w-full min-w-[720px] text-left text-sm">
            <thead className="border-b border-border bg-muted/50 text-muted-foreground">
              <tr>
                <th className="px-4 py-3 font-medium">Visitor</th>
                {showHost ? <th className="px-4 py-3 font-medium">Host</th> : null}
                <th className="px-4 py-3 font-medium">Window</th>
                <th className="px-4 py-3 font-medium">Status</th>
              </tr>
            </thead>
            <tbody>
              {filtered.map((visit) => {
                const badge =
                  VISIT_STATUS_BADGE[visit.status] ?? "bg-muted text-foreground";
                return (
                  <tr
                    key={visit.id}
                    className="cursor-pointer border-b border-border/70 transition-colors last:border-0 hover:bg-muted/30"
                    onClick={() => setSelected(visit)}
                  >
                    <td className="px-4 py-3">
                      <p className="font-medium text-foreground">{visit.visitor.fullName}</p>
                      <p className="text-xs text-muted-foreground">{visit.purpose}</p>
                    </td>
                    {showHost ? (
                      <td className="px-4 py-3 text-muted-foreground">
                        {visit.host.fullName}
                        <span className="block text-xs">{visit.host.department}</span>
                      </td>
                    ) : null}
                    <td className="px-4 py-3 text-muted-foreground">
                      {formatVisitWindow(
                        visit.windowStart ? new Date(visit.windowStart) : null,
                        visit.windowEnd ? new Date(visit.windowEnd) : null
                      )}
                    </td>
                    <td className="px-4 py-3">
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
      </Card>

      <Modal
        open={selected !== null}
        title="Visit details"
        wide
        onClose={() => setSelected(null)}
      >
        {selected ? <VisitDetailPanel visit={selected} /> : null}
      </Modal>
    </>
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
      <Badge variant={active ? "default" : "secondary"} className="cursor-pointer px-3 py-1">
        {label}
      </Badge>
    </button>
  );
}
