export function parsePassCode(raw: string) {
  const trimmed = raw.trim();
  if (!trimmed) {
    return "";
  }

  try {
    const url = new URL(trimmed);
    const fromQuery =
      url.searchParams.get("code") ??
      url.searchParams.get("pass") ??
      url.searchParams.get("qr");
    if (fromQuery) {
      return fromQuery.trim();
    }
    const segments = url.pathname.split("/").filter(Boolean);
    const last = segments.at(-1);
    if (last && last.length >= 8) {
      return last;
    }
  } catch {
    // Plain pass code, not a URL.
  }

  return trimmed;
}
