import { randomUUID } from "node:crypto";
import { prisma } from "@/lib/db/prisma";

export async function approveVisitByToken(token: string) {
  const visit = await prisma.visit.findUnique({
    where: { approvalToken: token },
    include: { visitor: true, host: true },
  });

  if (!visit) {
    return { error: "This approval link is invalid or has already been used." };
  }

  if (visit.status !== "PENDING") {
    return {
      error: `This request was already ${visit.status.toLowerCase().replace("_", " ")}.`,
      visitId: visit.id,
      status: visit.status,
    };
  }

  const qrCode = visit.qrCode ?? randomUUID();

  const updated = await prisma.visit.update({
    where: { id: visit.id },
    data: {
      status: "APPROVED",
      qrCode,
      approvalToken: null,
    },
    include: { visitor: true, host: true },
  });

  return { visit: updated, qrCode };
}

export async function denyVisitByToken(token: string) {
  const visit = await prisma.visit.findUnique({
    where: { approvalToken: token },
    include: { visitor: true, host: true },
  });

  if (!visit) {
    return { error: "This approval link is invalid or has already been used." };
  }

  if (visit.status !== "PENDING") {
    return {
      error: `This request was already ${visit.status.toLowerCase().replace("_", " ")}.`,
      visitId: visit.id,
      status: visit.status,
    };
  }

  const updated = await prisma.visit.update({
    where: { id: visit.id },
    data: {
      status: "REJECTED",
      approvalToken: null,
    },
    include: { visitor: true, host: true },
  });

  return { visit: updated };
}
