import { NextResponse } from "next/server";
import { checkInVisit } from "@/lib/visits/check-in";

export async function POST(request: Request) {
  let body: { code?: string };
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ error: "Invalid request body." }, { status: 400 });
  }

  const raw = typeof body.code === "string" ? body.code.trim() : "";
  if (!raw) {
    return NextResponse.json({ error: "Pass code is required." }, { status: 400 });
  }

  const result = await checkInVisit(raw);
  if ("error" in result) {
    return NextResponse.json({ error: result.error }, { status: 400 });
  }

  return NextResponse.json({ visitId: result.visitId });
}
