export const PURPOSE_OPTIONS = [
  "Meeting with an employee",
  "Interview",
  "Maintenance work",
  "Delivery",
  "Vendor visit",
  "Other",
];

export const STATUS_LABEL: Record<string, string> = {
  PENDING: "Pending approval",
  APPROVED: "Approved",
  REJECTED: "Rejected",
  CHECKED_IN: "Checked in",
  CHECKED_OUT: "Checked out",
  EXPIRED: "Expired",
  OVERSTAY: "Overstay",
};

export const STATUS_BADGE: Record<string, string> = {
  PENDING: "bg-amber-500/15 text-amber-800 dark:text-amber-200",
  APPROVED: "bg-emerald-500/15 text-emerald-800 dark:text-emerald-200",
  REJECTED: "bg-red-500/15 text-red-800 dark:text-red-200",
  CHECKED_IN: "bg-blue-500/15 text-blue-800 dark:text-blue-200",
  CHECKED_OUT: "bg-muted text-muted-foreground",
  EXPIRED: "bg-orange-500/15 text-orange-800 dark:text-orange-200",
  OVERSTAY: "bg-red-500/15 text-red-800 dark:text-red-200",
};

export function statusLabel(status: string) {
  return STATUS_LABEL[status] ?? status;
}

export type VisitRow = {
  id: string;
  status: string;
  purpose: string;
  preApproved: boolean;
  photoUrl: string | null;
  windowStart: string | null;
  windowEnd: string | null;
  checkInAt: string | null;
  checkOutAt: string | null;
  createdAt: string;
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

export function serializeVisit(visit: {
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
  visitor: VisitRow["visitor"];
  host: VisitRow["host"];
}): VisitRow {
  return {
    ...visit,
    windowStart: visit.windowStart?.toISOString() ?? null,
    windowEnd: visit.windowEnd?.toISOString() ?? null,
    checkInAt: visit.checkInAt?.toISOString() ?? null,
    checkOutAt: visit.checkOutAt?.toISOString() ?? null,
    createdAt: visit.createdAt.toISOString(),
  };
}

export function countByStatus(visits: { status: string }[]) {
  const counts: Record<string, number> = {};
  for (const visit of visits) {
    counts[visit.status] = (counts[visit.status] ?? 0) + 1;
  }
  return counts;
}

export function startOfDay(date = new Date()) {
  const d = new Date(date);
  d.setHours(0, 0, 0, 0);
  return d;
}

export function endOfDay(date = new Date()) {
  const d = new Date(date);
  d.setHours(23, 59, 59, 999);
  return d;
}

export function formatWindow(start: Date | null, end: Date | null) {
  if (!start || !end) return "—";
  const fmt = new Intl.DateTimeFormat("en-IN", { dateStyle: "medium", timeStyle: "short" });
  return `${fmt.format(start)} → ${fmt.format(end)}`;
}

export function parseWindow(from: string, to: string) {
  const windowStart = new Date(from);
  const windowEnd = new Date(to);
  if (Number.isNaN(windowStart.getTime()) || Number.isNaN(windowEnd.getTime())) {
    return { error: "Enter valid visit times." };
  }
  if (windowEnd <= windowStart) {
    return { error: "Visit end time must be after the start time." };
  }
  return { windowStart, windowEnd };
}

export function checkInUrl(passCode: string, baseUrl: string) {
  return `${baseUrl.replace(/\/$/, "")}/entry/scan?code=${passCode}`;
}

export const REJECTION_COOLDOWN_HOURS = 24;

export function rejectionCooldownEnds(rejectedAt: Date) {
  return new Date(rejectedAt.getTime() + REJECTION_COOLDOWN_HOURS * 60 * 60 * 1000);
}

export function isOnRejectionCooldown(rejectedAt: Date, now = new Date()) {
  return now < rejectionCooldownEnds(rejectedAt);
}

export function formatReapplyTime(date: Date) {
  return new Intl.DateTimeFormat("en-IN", {
    dateStyle: "medium",
    timeStyle: "short",
  }).format(date);
}

export function parsePassCode(raw: string) {
  const trimmed = raw.trim();
  try {
    const url = new URL(trimmed);
    return url.searchParams.get("code")?.trim() || trimmed;
  } catch {
    return trimmed;
  }
}
