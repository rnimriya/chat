import { NextRequest, NextResponse } from "next/server";
import { getSessionFromRequest } from "@/lib/auth";
import { Chatbots, Leads } from "@/lib/db";

export async function GET(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const session = await getSessionFromRequest(req);
  if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const { id } = await params;
  const bot = Chatbots.findById(id);
  if (!bot || bot.userId !== session.userId)
    return NextResponse.json({ error: "Not found" }, { status: 404 });

  return NextResponse.json(Leads.byChatbot(id));
}
