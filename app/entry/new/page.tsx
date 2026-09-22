import { PageShell } from "@/components/page-shell";
import { VisitorRegistrationForm } from "@/components/visitor-registration-form";
import { prisma } from "@/lib/prisma";

export default async function NewEntryPage() {
  const employees = await prisma.employee.findMany({
    orderBy: { fullName: "asc" },
    select: { id: true, fullName: true, department: true },
  });

  return (
    <PageShell
      title="New visitor entry"
      description="Security collects your details and photo, then the host is asked to approve. A QR pass is issued after approval."
    >
      <VisitorRegistrationForm employees={employees} />
    </PageShell>
  );
}
