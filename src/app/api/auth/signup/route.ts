import { NextRequest, NextResponse } from "next/server";
import { Users } from "@/lib/db";
import { signToken, hashPassword } from "@/lib/auth";

export async function POST(req: NextRequest) {
  const { name, email, password } = await req.json();

  if (!name || !email || !password) {
    return NextResponse.json({ error: "All fields required" }, { status: 400 });
  }
  if (password.length < 6) {
    return NextResponse.json({ error: "Password must be at least 6 characters" }, { status: 400 });
  }
  if (Users.findByEmail(email)) {
    return NextResponse.json({ error: "Email already in use" }, { status: 409 });
  }

  const user = Users.create({ name, email, passwordHash: hashPassword(password) });
  const token = await signToken({ userId: user.id, email: user.email });

  const res = NextResponse.json({ user: { id: user.id, name: user.name, email: user.email } });
  res.cookies.set("auth_token", token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    maxAge: 60 * 60 * 24 * 7,
    path: "/",
  });
  return res;
}
