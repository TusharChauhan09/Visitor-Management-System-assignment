import { randomUUID } from "node:crypto";
import { prisma } from "@/lib/db/prisma";
import { parsePassCode } from "@/lib/visits";

export async function approveVisitByToken(token: string) {
  const visit = await prisma.visit.findUnique({ where: { approvalToken: token } });
  if (!visit) return { error: "This approval link is invalid." };
  if (visit.status !== "PENDING") return { error: "This request was already handled.", visitId: visit.id };

  const updated = await prisma.visit.update({
    where: { id: visit.id },
    data: { status: "APPROVED", qrCode: visit.qrCode ?? randomUUID(), approvalToken: null },
  });
  return { visit: updated };
}

export async function denyVisitByToken(token: string) {
  const visit = await prisma.visit.findUnique({ where: { approvalToken: token } });
  if (!visit) return { error: "This approval link is invalid." };
  if (visit.status !== "PENDING") return { error: "This request was already handled.", visitId: visit.id };

  const updated = await prisma.visit.update({
    where: { id: visit.id },
    data: { status: "REJECTED", approvalToken: null },
  });
  return { visit: updated };
}

export async function checkInVisit(rawCode: string) {
  const code = parsePassCode(rawCode);
  if (!code) return { error: "Enter or scan a pass code." };

  const visit = await prisma.visit.findUnique({ where: { qrCode: code } });
  if (!visit) return { error: "This pass was not found." };
  if (visit.status === "CHECKED_IN") return { visitId: visit.id };
  if (visit.status !== "APPROVED") return { error: "This pass cannot be used for entry right now." };

  if (visit.windowStart && visit.windowEnd) {
    const now = new Date();
    if (now < visit.windowStart) return { error: "This pass is not valid yet." };
    if (now > visit.windowEnd) {
      await prisma.visit.update({ where: { id: visit.id }, data: { status: "EXPIRED" } });
      return { error: "This pass has expired." };
    }
  }

  await prisma.visit.update({
    where: { id: visit.id },
    data: { status: "CHECKED_IN", checkInAt: visit.checkInAt ?? new Date() },
  });
  return { visitId: visit.id };
}
