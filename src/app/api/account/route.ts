import { getSession } from "@/lib/auth";
import { Users } from "@/lib/db";
import { NextResponse } from "next/server";
import fs from "fs";
import path from "path";

export async function PATCH(req: Request) {
  const session = await getSession();
  if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const { name } = await req.json();
  if (!name?.trim()) return NextResponse.json({ error: "Name required" }, { status: 400 });

  const users = Users.all();
  const idx = users.findIndex((u) => u.id === session.userId);
  if (idx === -1) return NextResponse.json({ error: "User not found" }, { status: 404 });

  users[idx].name = name.trim().slice(0, 32);
  const dataDir = path.join(process.cwd(), "data");
  fs.writeFileSync(path.join(dataDir, "users.json"), JSON.stringify(users, null, 2));

  return NextResponse.json({ ok: true });
}
