import type { EmployeeVisitRow } from "@/lib/types";

type VisitWithVisitor = {
  id: string;
  status: string;
  purpose: string;
  preApproved: boolean;
  windowStart: Date | null;
  windowEnd: Date | null;
  checkInAt: Date | null;
  visitorId: string;
  visitor: EmployeeVisitRow["visitor"];
};

function visitedBefore(
  visitId: string,
  visitorId: string,
  visits: { id: string; visitorId: string; checkInAt: Date | null }[]
) {
  return visits.some(
    (v) => v.visitorId === visitorId && v.id !== visitId && v.checkInAt != null
  );
}

export function toEmployeeVisitRows(visits: VisitWithVisitor[]): EmployeeVisitRow[] {
  return visits.map((visit) => ({
    id: visit.id,
    status: visit.status,
    purpose: visit.purpose,
    preApproved: visit.preApproved,
    windowStart: visit.windowStart,
    windowEnd: visit.windowEnd,
    checkInAt: visit.checkInAt,
    visitor: visit.visitor,
    visitedBefore: visitedBefore(visit.id, visit.visitorId, visits),
  }));
}
