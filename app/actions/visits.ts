"use server";

import { randomUUID } from "node:crypto";
import { redirect } from "next/navigation";
import { z } from "zod";
import { sendHostApprovalEmail } from "@/lib/email/host-approval";
import { saveVisitorPhoto } from "@/lib/visitors/photos";
import { prisma } from "@/lib/db/prisma";
import { checkInVisit, findLatestVisitByEmail, getDeskRegistrationBlock } from "@/lib/visits/db";
import { parseWindow } from "@/lib/visits";

type ActionState = { error?: string; visitId?: string };

const entrySchema = z.object({
  fullName: z.string().min(1),
  email: z.string().email(),
  phone: z.string().min(1),
  purpose: z.string().min(1),
  hostId: z.string().min(1),
  photoData: z.string().min(1),
  visitFrom: z.string().min(1),
  visitTo: z.string().min(1),
  company: z.string().optional(),
});

const lookupSchema = z.object({
  email: z.string().email(),
});

export async function lookupVisitStatus(
  _prev: ActionState,
  formData: FormData
): Promise<ActionState> {
  const parsed = lookupSchema.safeParse(Object.fromEntries(formData));
  if (!parsed.success) return { error: "Enter the email you used when registering." };

  const match = await findLatestVisitByEmail(parsed.data.email);
  if (!match) {
    return { error: "No visit found for that email. Register or ask your host for a pre-invite pass." };
  }

  return { visitId: match.id };
}

export async function createVisitorEntry(
  _prev: ActionState,
  formData: FormData
): Promise<ActionState> {
  const parsed = entrySchema.safeParse(Object.fromEntries(formData));
  if (!parsed.success) return { error: "Fill in every required field, including a photo." };

  const data = parsed.data;
  const block = await getDeskRegistrationBlock(data.email);
  if (block) return { error: block };

  const window = parseWindow(data.visitFrom, data.visitTo);
  if ("error" in window) return { error: window.error };

  const host = await prisma.employee.findUnique({ where: { id: data.hostId } });
  if (!host?.isApproved) return { error: "Select a host employee from the list." };

  let photoUrl: string;
  try {
    photoUrl = await saveVisitorPhoto(data.photoData);
  } catch (error) {
    return { error: error instanceof Error ? error.message : "Could not save the photo." };
  }

  const approvalToken = randomUUID();
  const visitor = await prisma.visitor.create({
    data: {
      fullName: data.fullName,
      email: data.email,
      phone: data.phone,
      company: data.company || null,
    },
  });

  const visit = await prisma.visit.create({
    data: {
      purpose: data.purpose,
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
    visitorName: data.fullName,
    visitorEmail: data.email,
    visitorPhone: data.phone,
    company: data.company || null,
    purpose: data.purpose,
    photoUrl,
    requestedAt: new Date(),
    approvalToken,
  });

  if (emailResult.error) {
    return {
      error: `Visit was saved, but the host could not be emailed: ${emailResult.error}`,
    };
  }

  if ("skipped" in emailResult && emailResult.skipped) {
    return {
      error:
        "Visit was saved, but email is not configured. Set RESEND_API_KEY and EMAIL_FROM in .env.",
    };
  }

  redirect(`/entry/status/${visit.id}`);
}

export async function checkInByPassCode(
  _prev: ActionState,
  formData: FormData
): Promise<ActionState> {
  const code = String(formData.get("passCode") ?? "").trim();
  if (!code) return { error: "Enter or scan a pass code." };

  const result = await checkInVisit(code);
  if ("error" in result) return { error: result.error };

  const query = result.action === "check_out" ? "?done=checkout" : "";
  redirect(`/entry/status/${result.visitId}${query}`);
}
