import { prisma } from "@/lib/db/prisma";
import { parsePassCode } from "@/lib/visits/pass-code";

export async function checkInVisit(rawCode: string) {
  const code = parsePassCode(rawCode);
  if (!code) {
    return { error: "Enter or scan a pass code." };
  }

  const visit = await prisma.visit.findUnique({
    where: { qrCode: code },
  });

  if (!visit) {
    return { error: "This pass was not found. Ask security for help." };
  }

  if (visit.status === "REJECTED") {
    return {
      error: "Access was denied. Security has been asked to assist at the desk.",
    };
  }

  if (visit.status === "PENDING") {
    return {
      error: "This visit is still waiting for host approval. A pass is issued after approval.",
    };
  }

  if (visit.status === "EXPIRED") {
    return { error: "This pass has expired. Register again at the desk." };
  }

  if (visit.status === "CHECKED_OUT" || visit.status === "OVERSTAY") {
    return { error: "This visit is already closed." };
  }

  if (visit.status === "CHECKED_IN") {
    return { visitId: visit.id };
  }

  if (visit.windowStart && visit.windowEnd) {
    const now = new Date();
    if (now < visit.windowStart) {
      return { error: "This pass is not valid yet. Come back in the approved window." };
    }
    if (now > visit.windowEnd) {
      if (visit.status === "APPROVED") {
        await prisma.visit.update({
          where: { id: visit.id },
          data: { status: "EXPIRED" },
        });
      }
      return { error: "The approved time window has passed. This pass has expired." };
    }
  }

  if (visit.status !== "APPROVED") {
    return { error: "This pass cannot be used for entry right now." };
  }

  await prisma.visit.update({
    where: { id: visit.id },
    data: {
      status: "CHECKED_IN",
      checkInAt: visit.checkInAt ?? new Date(),
    },
  });

  return { visitId: visit.id };
}
