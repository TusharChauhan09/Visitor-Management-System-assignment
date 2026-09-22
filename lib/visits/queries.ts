import { prisma } from "@/lib/db/prisma";

export async function getPendingVisitByApprovalToken(token: string) {
  return prisma.visit.findUnique({
    where: { approvalToken: token },
    include: { visitor: true, host: true },
  });
}
