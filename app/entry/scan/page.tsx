import { PageShell } from "@/components/page-shell";
import { PassCheckIn } from "@/components/pass-check-in";

export default function ScanPassPage() {
  return (
    <PageShell
      title="I have a pass"
      description="Scan the QR from a pre-approved visit. Entry is allowed only inside the approved time window."
    >
      <PassCheckIn />
    </PageShell>
  );
}
