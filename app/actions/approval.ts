"use server";

import { redirect } from "next/navigation";
import { approveVisitByToken, denyVisitByToken } from "@/lib/visits/approval";

function getToken(formData: FormData) {
  const value = formData.get("token");
  if (typeof value !== "string" || !value.trim()) {
    return null;
  }
  return value.trim();
}

export async function confirmApproveForm(formData: FormData) {
  const token = getToken(formData);
  if (!token) {
    redirect("/host/result?error=Invalid%20approval%20link");
  }

  const result = await approveVisitByToken(token);
  if ("error" in result) {
    if (result.visitId) {
      redirect(
        `/host/result?error=${encodeURIComponent(result.error ?? "Request failed")}&visitId=${result.visitId}`
      );
    }
    redirect(`/host/result?error=${encodeURIComponent(result.error ?? "Request failed")}`);
  }

  redirect(`/host/result?visitId=${result.visit.id}&status=APPROVED`);
}

export async function confirmDenyForm(formData: FormData) {
  const token = getToken(formData);
  if (!token) {
    redirect("/host/result?error=Invalid%20approval%20link");
  }

  const result = await denyVisitByToken(token);
  if ("error" in result) {
    if (result.visitId) {
      redirect(
        `/host/result?error=${encodeURIComponent(result.error ?? "Request failed")}&visitId=${result.visitId}`
      );
    }
    redirect(`/host/result?error=${encodeURIComponent(result.error ?? "Request failed")}`);
  }

  redirect(`/host/result?visitId=${result.visit.id}&status=REJECTED`);
}
