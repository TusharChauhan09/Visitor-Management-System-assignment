import { formatVisitWindow } from "@/lib/visits/visit-window";
import type { EmployeeVisitRow } from "@/lib/types";

const STATUS_LABEL: Record<string, string> = {
  PENDING: "Pending approval",
  APPROVED: "Approved",
  REJECTED: "Rejected",
  CHECKED_IN: "On site",
  CHECKED_OUT: "Visited",
  EXPIRED: "Expired",
  OVERSTAY: "Overstay",
};

export function VisitorStatusTable({ visits }: { visits: EmployeeVisitRow[] }) {
  if (visits.length === 0) {
    return (
      <p className="text-sm text-muted-foreground">No visitors yet for your account.</p>
    );
  }

  return (
    <div className="overflow-x-auto rounded-xl border border-border">
      <table className="w-full min-w-[640px] text-left text-sm">
        <thead className="border-b border-border bg-muted/40 text-muted-foreground">
          <tr>
            <th className="px-4 py-3 font-medium">Visitor</th>
            <th className="px-4 py-3 font-medium">Window</th>
            <th className="px-4 py-3 font-medium">Status</th>
            <th className="px-4 py-3 font-medium">Prior visit</th>
          </tr>
        </thead>
        <tbody>
          {visits.map((visit) => (
            <tr key={visit.id} className="border-b border-border/70 last:border-0">
              <td className="px-4 py-3">
                <p className="font-medium text-foreground">{visit.visitor.fullName}</p>
                <p className="text-xs text-muted-foreground">{visit.visitor.email}</p>
                <p className="text-xs text-muted-foreground">{visit.purpose}</p>
              </td>
              <td className="px-4 py-3 text-muted-foreground">
                {formatVisitWindow(visit.windowStart, visit.windowEnd)}
              </td>
              <td className="px-4 py-3">
                {STATUS_LABEL[visit.status] ?? visit.status}
                {visit.preApproved ? (
                  <span className="ml-1 text-xs text-muted-foreground">(pre-invite)</span>
                ) : null}
              </td>
              <td className="px-4 py-3">
                {visit.visitedBefore ? "Visited before" : "First time"}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
