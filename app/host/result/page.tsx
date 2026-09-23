import Link from "next/link";
import { PageShell } from "@/components/layout/page-shell";

export default async function HostResultPage({
  searchParams,
}: {
  searchParams: Promise<{ visitId?: string; status?: string }>;
}) {
  const { visitId, status } = await searchParams;

  const title =
    status === "APPROVED"
      ? "Visitor approved"
      : status === "REJECTED"
        ? "Visitor denied"
        : status === "failed"
          ? "Could not update visit"
          : "Done";

  const body =
    status === "APPROVED"
      ? "A QR pass is ready. The visitor can check in from the entry screen."
      : status === "REJECTED"
        ? "The visitor will not be allowed in. Security can assist at the desk."
        : "The visit record was updated.";

  return (
    <PageShell title={title} description={body}>
      {visitId ? (
        <Link
          href={`/entry/status/${visitId}`}
          className="mt-2 inline-flex h-11 items-center justify-center rounded-lg bg-primary px-6 text-sm font-medium text-primary-foreground"
        >
          View visit details
        </Link>
      ) : (
        <Link href="/" className="text-sm font-medium underline-offset-4 hover:underline">
          Back to entry
        </Link>
      )}
    </PageShell>
  );
}
