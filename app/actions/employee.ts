"use server";

import { randomUUID } from "node:crypto";
import { redirect } from "next/navigation";
import { revalidatePath } from "next/cache";
import { requireEmployee } from "@/lib/auth/guards";
import { requiredString, optionalString } from "@/lib/form";
import {
  endOfLocalDay,
  parseVisitWindow,
  startOfLocalDay,
} from "@/lib/visits/visit-window";
import { prisma } from "@/lib/db/prisma";
import type { ActionState } from "@/lib/types";

async function countTodaysInvites(hostId: string) {
  return prisma.visit.count({
    where: {
      hostId,
      preApproved: true,
      createdAt: { gte: startOfLocalDay(), lte: endOfLocalDay() },
    },
  });
}

export async function createPreInvite(
  _prev: ActionState,
  formData: FormData
): Promise<ActionState> {
  const employee = await requireEmployee();

  const fullName = requiredString(formData, "fullName");
  const email = requiredString(formData, "email");
  const phone = requiredString(formData, "phone");
  const purpose = requiredString(formData, "purpose");
  const visitFrom = requiredString(formData, "visitFrom");
  const visitTo = requiredString(formData, "visitTo");
  const company = optionalString(formData, "company");

  if (!fullName || !email || !phone || !purpose || !visitFrom || !visitTo) {
    return { error: "Fill in every required field." };
  }

  const window = parseVisitWindow(visitFrom, visitTo);
  if ("error" in window) {
    return { error: window.error };
  }

  if ((await countTodaysInvites(employee.id)) >= employee.maxVisitorsPerDay) {
    return {
      error: `Daily pre-invite limit reached (${employee.maxVisitorsPerDay}). Try again tomorrow.`,
    };
  }

  let visitor = await prisma.visitor.findFirst({ where: { email } });
  if (!visitor) {
    visitor = await prisma.visitor.create({
      data: { fullName, email, phone, company },
    });
  } else {
    visitor = await prisma.visitor.update({
      where: { id: visitor.id },
      data: { fullName, phone, company },
    });
  }

  const visit = await prisma.visit.create({
    data: {
      purpose,
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
