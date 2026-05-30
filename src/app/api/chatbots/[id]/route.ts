import { NextRequest, NextResponse } from "next/server";
import { getSessionFromRequest } from "@/lib/auth";
import { Chatbots } from "@/lib/db";
import { deleteVectors, getChunkCount } from "@/lib/vectorStore";

export async function GET(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const session = await getSessionFromRequest(req);
  if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const { id } = await params;
  const bot = Chatbots.findById(id);
  if (!bot || bot.userId !== session.userId)
    return NextResponse.json({ error: "Not found" }, { status: 404 });

  return NextResponse.json({ ...bot, chunkCount: getChunkCount(id) });
}

export async function PATCH(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const session = await getSessionFromRequest(req);
  if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const { id } = await params;
  const bot = Chatbots.findById(id);
  if (!bot || bot.userId !== session.userId)
    return NextResponse.json({ error: "Not found" }, { status: 404 });

  const body = await req.json();
  const updated = Chatbots.update(id, body);
  return NextResponse.json(updated);
}

export async function DELETE(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const session = await getSessionFromRequest(req);
  if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const { id } = await params;
  const bot = Chatbots.findById(id);
  if (!bot || bot.userId !== session.userId)
    return NextResponse.json({ error: "Not found" }, { status: 404 });

  Chatbots.delete(id);
  deleteVectors(id);
  return NextResponse.json({ success: true });
}
