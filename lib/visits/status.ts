export const VISIT_STATUS_LABEL: Record<string, string> = {
  PENDING: "Pending approval",
  APPROVED: "Approved",
  REJECTED: "Rejected",
  CHECKED_IN: "Checked in",
  CHECKED_OUT: "Checked out",
  EXPIRED: "Expired",
  OVERSTAY: "Overstay",
};

export const VISIT_STATUS_BADGE: Record<string, string> = {
  PENDING: "bg-amber-500/15 text-amber-800 dark:text-amber-200",
  APPROVED: "bg-emerald-500/15 text-emerald-800 dark:text-emerald-200",
  REJECTED: "bg-red-500/15 text-red-800 dark:text-red-200",
  CHECKED_IN: "bg-blue-500/15 text-blue-800 dark:text-blue-200",
  CHECKED_OUT: "bg-muted text-muted-foreground",
  EXPIRED: "bg-orange-500/15 text-orange-800 dark:text-orange-200",
  OVERSTAY: "bg-red-500/15 text-red-800 dark:text-red-200",
};

export function visitStatusLabel(status: string) {
  return VISIT_STATUS_LABEL[status] ?? status;
}
