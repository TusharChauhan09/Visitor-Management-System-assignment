"use server";

import { randomUUID } from "node:crypto";
import { redirect } from "next/navigation";
import { sendHostApprovalEmail } from "@/lib/email/host-approval";
import { saveVisitorPhoto } from "@/lib/visitors/photos";
import { prisma } from "@/lib/db/prisma";
import { checkInVisit } from "@/lib/visits/check-in";
import type { ActionState } from "@/lib/types";

export type { ActionState };

function requiredString(formData: FormData, key: string) {
  const value = formData.get(key);
  if (typeof value !== "string" || value.trim().length === 0) {
    return null;
  }
  return value.trim();
}

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
  const companyRaw = formData.get("company");
  const company =
    typeof companyRaw === "string" && companyRaw.trim().length > 0
      ? companyRaw.trim()
      : null;

  if (!fullName || !email || !phone || !purpose || !hostId) {
    return { error: "Fill in every required field before submitting." };
  }

  if (!photoData) {
    return { error: "A photo is required at the registration desk." };
  }

  const host = await prisma.employee.findUnique({ where: { id: hostId } });
  if (!host) {
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
      preApproved: false,
      approvalToken,
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
    console.error("[createVisitorEntry] Host email failed:", emailResult.error);
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

export async function checkInByScannedCode(
  code: string
): Promise<{ visitId?: string; error?: string }> {
  const trimmed = code.trim();
  if (!trimmed) {
    return { error: "No QR code was read. Try again." };
  }

  return checkInVisit(trimmed);
}
