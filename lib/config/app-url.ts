export function getAppUrl() {
  const url = process.env.APP_URL ?? process.env.NEXT_PUBLIC_APP_URL;
  if (!url) {
    return "http://localhost:3000";
  }
  return url.replace(/\/$/, "");
}
