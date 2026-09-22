"use server";

import { randomUUID } from "node:crypto";
import { redirect } from "next/navigation";
import { sendHostApprovalEmail } from "@/lib/email/host-approval";
import { requiredString, optionalString } from "@/lib/form";
import { saveVisitorPhoto } from "@/lib/visitors/photos";
import { prisma } from "@/lib/db/prisma";
import { checkInVisit } from "@/lib/visits/check-in";
import { parseVisitWindow } from "@/lib/visits/visit-window";
import type { ActionState } from "@/lib/types";

export async function createVisitorEntry(
  _prev: ActionState,
  formData: FormData
): Promise<ActionState> {
  const fullName = requiredString(formData, "fullName");
  const email = requiredString(formData, "email");
  const phone = requiredString(formData, "phone");
  const purpose = requiredString(formData, "purpose");
  const hostId = requiredString(formData, "hostId");
  const photoData = requiredString(formData, "photoData");
  const visitFrom = requiredString(formData, "visitFrom");
  const visitTo = requiredString(formData, "visitTo");
  const company = optionalString(formData, "company");

  if (!fullName || !email || !phone || !purpose || !hostId) {
    return { error: "Fill in every required field before submitting." };
  }

  if (!photoData) {
    return { error: "A photo is required at the registration desk." };
  }

  if (!visitFrom || !visitTo) {
    return { error: "Choose when your visit starts and ends." };
  }

  const window = parseVisitWindow(visitFrom, visitTo);
  if ("error" in window) {
    return { error: window.error };
  }

  const host = await prisma.employee.findUnique({ where: { id: hostId } });
  if (!host?.isApproved) {
    return { error: "Select a host employee from the list." };
  }

  let photoUrl: string;
  try {
    photoUrl = await saveVisitorPhoto(photoData);
  } catch (error) {
    return {
      error: error instanceof Error ? error.message : "Could not save the photo.",
    };
  }

  const approvalToken = randomUUID();
  const requestedAt = new Date();

  const visitor = await prisma.visitor.create({
    data: { fullName, email, phone, company },
  });

  const visit = await prisma.visit.create({
    data: {
      purpose,
      photoUrl,
      approvalToken,
      windowStart: window.windowStart,
      windowEnd: window.windowEnd,
      visitorId: visitor.id,
      hostId: host.id,
    },
  });

  const emailResult = await sendHostApprovalEmail({
    hostEmail: host.email,
    hostName: host.fullName,
    visitorName: fullName,
    visitorEmail: email,
    visitorPhone: phone,
    company,
    purpose,
    photoUrl,
    requestedAt,
    approvalToken,
  });

  if (emailResult.error) {
    redirect(
      `/entry/status/${visit.id}?emailError=${encodeURIComponent(emailResult.error)}`
    );
  }

  redirect(`/entry/status/${visit.id}`);
}

export async function checkInByPassCode(
  _prev: ActionState,
  formData: FormData
): Promise<ActionState> {
  const code = requiredString(formData, "passCode");
  if (!code) {
    return { error: "Enter or scan a pass code." };
  }

  const result = await checkInVisit(code);
  if ("error" in result) {
    return { error: result.error };
  }

  redirect(`/entry/status/${result.visitId}`);
}
