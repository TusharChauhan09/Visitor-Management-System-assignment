export function parseVisitWindow(
  visitFrom: string,
  visitTo: string
): { windowStart: Date; windowEnd: Date } | { error: string } {
  const windowStart = new Date(visitFrom);
  const windowEnd = new Date(visitTo);

  if (Number.isNaN(windowStart.getTime()) || Number.isNaN(windowEnd.getTime())) {
    return { error: "Enter valid visit from and to times." };
  }

  if (windowEnd <= windowStart) {
    return { error: "Visit end time must be after the start time." };
  }

  const maxSpanMs = 24 * 60 * 60 * 1000;
  if (windowEnd.getTime() - windowStart.getTime() > maxSpanMs) {
    return { error: "Visit window cannot be longer than 24 hours." };
  }

  return { windowStart, windowEnd };
}

export function startOfLocalDay(date = new Date()) {
  const d = new Date(date);
  d.setHours(0, 0, 0, 0);
  return d;
}

export function endOfLocalDay(date = new Date()) {
  const d = new Date(date);
  d.setHours(23, 59, 59, 999);
  return d;
}

export function defaultVisitFromValue() {
  const d = new Date();
  d.setMinutes(0, 0, 0);
  return toDatetimeLocalValue(d);
}

export function defaultVisitToValue() {
  const d = new Date();
  d.setHours(d.getHours() + 2, 0, 0, 0);
  return toDatetimeLocalValue(d);
}

export function toDatetimeLocalValue(date: Date) {
  const pad = (n: number) => String(n).padStart(2, "0");
  return `${date.getFullYear()}-${pad(date.getMonth() + 1)}-${pad(date.getDate())}T${pad(date.getHours())}:${pad(date.getMinutes())}`;
}

export function formatVisitWindow(start: Date | null, end: Date | null) {
  if (!start || !end) {
    return "—";
  }
  const fmt = new Intl.DateTimeFormat("en-IN", {
    dateStyle: "medium",
    timeStyle: "short",
  });
  return `${fmt.format(start)} → ${fmt.format(end)}`;
}
