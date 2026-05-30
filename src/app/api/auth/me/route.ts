import { NextResponse } from "next/server";
import { getSession } from "@/lib/auth";
import { Users } from "@/lib/db";

export async function GET() {
  const session = await getSession();
  if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  const user = Users.findById(session.userId);
  if (!user) return NextResponse.json({ error: "User not found" }, { status: 404 });
  return NextResponse.json({ id: user.id, name: user.name, email: user.email, plan: user.plan });
}
