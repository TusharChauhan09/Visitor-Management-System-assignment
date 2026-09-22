export function buildCheckInUrl(passCode: string, baseUrl: string) {
  const base = baseUrl.replace(/\/$/, "");
  return `${base}/entry/scan?code=${encodeURIComponent(passCode)}`;
}

export function parsePassCode(raw: string) {
  const trimmed = raw.trim();
  if (!trimmed) {
    return "";
  }

  const candidates = [trimmed];
  if (!/^https?:\/\//i.test(trimmed) && /[?&](code|pass|qr)=/i.test(trimmed)) {
    candidates.push(`http://${trimmed.replace(/^\/+/, "")}`);
  }

  for (const value of candidates) {
    try {
      const url = new URL(value);
      const fromQuery =
        url.searchParams.get("code") ??
        url.searchParams.get("pass") ??
        url.searchParams.get("qr");
      if (fromQuery?.trim()) {
        return fromQuery.trim();
      }
      const segments = url.pathname.split("/").filter(Boolean);
      const last = segments.at(-1);
      if (last && last.length >= 8) {
        return last;
      }
    } catch {
      // try next candidate
    }
  }

  return trimmed;
}
