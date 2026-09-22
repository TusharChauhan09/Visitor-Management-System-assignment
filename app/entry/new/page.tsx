import { PageShell } from "@/components/layout/page-shell";
import { VisitorRegistrationForm } from "@/components/visit/visitor-registration-form";
import { prisma } from "@/lib/db/prisma";

export default async function NewEntryPage() {
  const employees = await prisma.employee.findMany({
    where: { isApproved: true },
    orderBy: { fullName: "asc" },
    select: { id: true, fullName: true, department: true },
  });

  return (
    <PageShell title="New visitor entry">
      <VisitorRegistrationForm employees={employees} />
    </PageShell>
  );
}
