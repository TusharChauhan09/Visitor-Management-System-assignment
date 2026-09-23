/** Public base URL for emails, QR links, and redirects. */
export function getAppUrl() {
  if (process.env.APP_URL) {
    return process.env.APP_URL.replace(/\/$/, "");
  }

  if (process.env.NEXT_PUBLIC_APP_URL) {
    return process.env.NEXT_PUBLIC_APP_URL.replace(/\/$/, "");
  }

  if (process.env.VERCEL_URL) {
    return `https://${process.env.VERCEL_URL}`;
  }

  return "http://localhost:3000";
}

/** Local dev only: override link base in emails when APP_URL is still localhost. */
export function getAppUrlForEmail() {
  if (process.env.NODE_ENV !== "production") {
    const emailBase = process.env.EMAIL_APP_URL?.trim();
    if (emailBase) {
      return emailBase.replace(/\/$/, "");
    }
  }
  return getAppUrl();
}
