"use server";

import { redirect } from "next/navigation";
import { saveVisitorPhoto } from "@/lib/photos";
import { prisma } from "@/lib/prisma";

export type ActionState = {
  error?: string;
};

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

  const visitor = await prisma.visitor.create({
    data: { fullName, email, phone, company },
  });

  const visit = await prisma.visit.create({
    data: {
      purpose,
      photoUrl,
      preApproved: false,
      visitorId: visitor.id,
      hostId: host.id,
    },
  });

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

export async function checkInByScannedCode(code: string): Promise<ActionState> {
  const trimmed = code.trim();
  if (!trimmed) {
    return { error: "No QR code was read. Try again." };
  }

  const result = await checkInVisit(trimmed);
  if ("error" in result) {
    return { error: result.error };
  }

  redirect(`/entry/status/${result.visitId}`);
}

async function checkInVisit(code: string) {
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

  if (visit.preApproved && visit.windowStart && visit.windowEnd) {
    const now = new Date();
    if (now < visit.windowStart) {
      return { error: "This pass is not valid yet. Come back in the approved window." };
    }
    if (now > visit.windowEnd) {
      await prisma.visit.update({
        where: { id: visit.id },
        data: { status: "EXPIRED" },
      });
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
