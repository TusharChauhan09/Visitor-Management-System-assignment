"use server";

import { redirect } from "next/navigation";
import { approveVisitByToken, denyVisitByToken } from "@/lib/visits-db";

async function finish(kind: "approve" | "deny", formData: FormData) {
  const token = String(formData.get("token") ?? "");
  if (!token) redirect("/host/result?status=failed");

  const result = kind === "approve" ? await approveVisitByToken(token) : await denyVisitByToken(token);
  if ("error" in result) {
    redirect(result.visitId ? `/host/result?status=failed&visitId=${result.visitId}` : "/host/result?status=failed");
  }

  redirect(`/host/result?status=${kind === "approve" ? "APPROVED" : "REJECTED"}&visitId=${result.visit.id}`);
}

export async function confirmApproveForm(formData: FormData) {
  await finish("approve", formData);
}

export async function confirmDenyForm(formData: FormData) {
  await finish("deny", formData);
}
