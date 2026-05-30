import { NextRequest, NextResponse } from "next/server";
import { getSessionFromRequest } from "@/lib/auth";
import { Chatbots } from "@/lib/db";
import { getChunkCount } from "@/lib/vectorStore";

export async function GET(req: NextRequest) {
  const session = await getSessionFromRequest(req);
  if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const bots = Chatbots.byUser(session.userId).map((b) => ({
    ...b,
    chunkCount: getChunkCount(b.id),
  }));
  return NextResponse.json(bots);
}

export async function POST(req: NextRequest) {
  const session = await getSessionFromRequest(req);
  if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const body = await req.json();
  const bot = Chatbots.create({
    userId: session.userId,
    name: body.name || "My Chatbot",
    description: body.description || "",
    color: body.color || "#6366f1",
    welcomeMessage: body.welcomeMessage || "Hi! How can I help you today?",
    systemPrompt: body.systemPrompt || "You are a helpful customer support assistant.",
    collectLeads: body.collectLeads ?? false,
    humanHandover: body.humanHandover ?? false,
    humanHandoverEmail: body.humanHandoverEmail || "",
  });
  return NextResponse.json(bot, { status: 201 });
}
