import type { VisitLogEntry } from "@/lib/types";

type VisitWithRelations = {
  id: string;
  status: string;
  purpose: string;
  preApproved: boolean;
  photoUrl: string | null;
  windowStart: Date | null;
  windowEnd: Date | null;
  checkInAt: Date | null;
  checkOutAt: Date | null;
  createdAt: Date;
  visitor: {
    fullName: string;
    email: string;
    phone: string;
    company: string | null;
  };
  host: {
    fullName: string;
    email: string;
    department: string;
    phone: string;
  };
};

function iso(value: Date | null) {
  return value ? value.toISOString() : null;
}

export function serializeVisitLog(visit: VisitWithRelations): VisitLogEntry {
  return {
    id: visit.id,
    status: visit.status,
    purpose: visit.purpose,
    preApproved: visit.preApproved,
    photoUrl: visit.photoUrl,
    windowStart: iso(visit.windowStart),
    windowEnd: iso(visit.windowEnd),
    checkInAt: iso(visit.checkInAt),
    checkOutAt: iso(visit.checkOutAt),
    createdAt: visit.createdAt.toISOString(),
    visitor: visit.visitor,
    host: visit.host,
  };
}

export function countByStatus(visits: { status: string }[]) {
  const counts: Record<string, number> = {};
  for (const visit of visits) {
    counts[visit.status] = (counts[visit.status] ?? 0) + 1;
  }
  return counts;
}
