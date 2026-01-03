import { cookies } from "next/headers";
import { NextResponse } from "next/server";
import { verifySession } from "@/lib/auth";

export const runtime = "nodejs";

export async function GET() {
  const sessionCookie = cookies().get("mc_session");

  if (!sessionCookie?.value) {
    return NextResponse.json({ error: "Not authenticated" }, { status: 401 });
  }

  const payload = await verifySession(sessionCookie.value);

  if (!payload) {
    return NextResponse.json({ error: "Invalid session" }, { status: 401 });
  }

  return NextResponse.json({
    id: payload.sub,
    businessName: payload.businessName,
    username: payload.username,
    role: payload.role,
  });
}
