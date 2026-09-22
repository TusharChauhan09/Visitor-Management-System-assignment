import Link from "next/link";
import { SiteHeader } from "@/components/layout/site-header";

export default async function HostResultPage({
  searchParams,
}: {
  searchParams: Promise<{ visitId?: string; status?: string; error?: string }>;
}) {
  const { visitId, status, error } = await searchParams;

  const title = error
    ? "Could not update visit"
    : status === "APPROVED"
      ? "Visitor approved"
      : status === "REJECTED"
        ? "Visitor denied"
        : "Done";

  const body = error
    ? error
    : status === "APPROVED"
      ? "A QR pass is ready. The visitor can check in from the entry screen."
      : status === "REJECTED"
        ? "The visitor will not be allowed in. Security can assist at the desk."
        : "The visit record was updated.";

  return (
    <div className="flex min-h-full flex-1 flex-col bg-background">
      <SiteHeader />
      <main className="mx-auto max-w-lg px-6 py-14">
        <h1 className="text-3xl font-semibold tracking-tight">{title}</h1>
        <p className="mt-3 text-muted-foreground">{body}</p>
        {visitId ? (
          <Link
            href={`/entry/status/${visitId}`}
            className="mt-8 inline-flex h-11 items-center justify-center rounded-lg bg-primary px-6 text-sm font-medium text-primary-foreground"
          >
            View visit details
          </Link>
        ) : (
          <Link href="/" className="mt-8 inline-block text-sm font-medium text-primary underline-offset-4 hover:underline">
            Back to entry
          </Link>
        )}
      </main>
    </div>
  );
}
