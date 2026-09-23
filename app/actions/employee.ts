"use server";

import { randomUUID } from "node:crypto";
import { redirect } from "next/navigation";
import { revalidatePath } from "next/cache";
import { z } from "zod";
import { requireEmployee } from "@/lib/auth/guards";
import { endOfDay, parseWindow, startOfDay } from "@/lib/visits";
import { approveVisitByToken, denyVisitByToken } from "@/lib/visits-db";
import { saveVisitorPhoto } from "@/lib/visitors/photos";
import { prisma } from "@/lib/db/prisma";

type ActionState = { error?: string };

const inviteSchema = z.object({
  fullName: z.string().min(1),
  email: z.string().email(),
  phone: z.string().min(1),
  purpose: z.string().min(1),
  visitFrom: z.string().min(1),
  visitTo: z.string().min(1),
  company: z.string().optional(),
});

export async function createPreInvite(
  _prev: ActionState,
  formData: FormData
): Promise<ActionState> {
  const employee = await requireEmployee();
  const parsed = inviteSchema.safeParse(Object.fromEntries(formData));
  if (!parsed.success) return { error: "Fill in every required field." };

  const data = parsed.data;
  const window = parseWindow(data.visitFrom, data.visitTo);
  if ("error" in window) return { error: window.error };

  const todayInvites = await prisma.visit.count({
    where: {
      hostId: employee.id,
      preApproved: true,
      createdAt: { gte: startOfDay(), lte: endOfDay() },
    },
  });
  if (todayInvites >= employee.maxVisitorsPerDay) {
    return { error: `Daily pre-invite limit reached (${employee.maxVisitorsPerDay}).` };
  }

  let visitor = await prisma.visitor.findFirst({ where: { email: data.email } });
  if (!visitor) {
    visitor = await prisma.visitor.create({
      data: {
        fullName: data.fullName,
        email: data.email,
        phone: data.phone,
        company: data.company || null,
      },
    });
  } else {
    visitor = await prisma.visitor.update({
      where: { id: visitor.id },
      data: { fullName: data.fullName, phone: data.phone, company: data.company || null },
    });
  }

  const visit = await prisma.visit.create({
    data: {
      purpose: data.purpose,
      preApproved: true,
      status: "APPROVED",
      windowStart: window.windowStart,
      windowEnd: window.windowEnd,
      qrCode: randomUUID(),
      hostId: employee.id,
      visitorId: visitor.id,
    },
  });

  revalidatePath("/employee");
  redirect(`/employee?invited=${visit.id}`);
}

export async function updateEmployeePhoto(
  _prev: ActionState,
  formData: FormData
): Promise<ActionState> {
  const employee = await requireEmployee();
  const photoData = String(formData.get("photoData") ?? "");
  if (!photoData) return { error: "Choose an image first." };

  try {
    const photoUrl = await saveVisitorPhoto(photoData, "vms/employees");
    await prisma.employee.update({ where: { id: employee.id }, data: { photoUrl } });
  } catch (error) {
    return { error: error instanceof Error ? error.message : "Could not save the photo." };
  }

  revalidatePath("/employee");
  return {};
}

export async function approvePendingVisit(visitId: string) {
  const employee = await requireEmployee();
  const visit = await prisma.visit.findFirst({
    where: { id: visitId, hostId: employee.id, status: "PENDING" },
  });
  if (!visit?.approvalToken) return { error: "This request is no longer pending." };
  const result = await approveVisitByToken(visit.approvalToken);
  if ("error" in result) return { error: result.error };
  revalidatePath("/employee");
  revalidatePath("/admin");
  return { ok: true };
}

export async function denyPendingVisit(visitId: string) {
  const employee = await requireEmployee();
  const visit = await prisma.visit.findFirst({
    where: { id: visitId, hostId: employee.id, status: "PENDING" },
  });
  if (!visit?.approvalToken) return { error: "This request is no longer pending." };
  const result = await denyVisitByToken(visit.approvalToken);
  if ("error" in result) return { error: result.error };
  revalidatePath("/employee");
  revalidatePath("/admin");
  return { ok: true };
}
