import { Suspense } from "react";
import { PageShell } from "@/components/layout/page-shell";
import { PassCheckIn } from "@/components/visit/pass-check-in";

export default function ScanPassPage() {
  return (
    <PageShell title="I have a pass">
      <Suspense fallback={<p className="text-sm text-muted-foreground">Loading scanner…</p>}>
        <PassCheckIn />
      </Suspense>
    </PageShell>
  );
}
