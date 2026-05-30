import { NextRequest, NextResponse } from "next/server";
import { Chatbots, Messages, Leads } from "@/lib/db";
import { getEmbedding, chatCompletion } from "@/lib/openai";
import { searchChunks } from "@/lib/vectorStore";
import { generateId } from "@/lib/utils";

export async function POST(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const bot = Chatbots.findById(id);
  if (!bot) return NextResponse.json({ error: "Chatbot not found" }, { status: 404 });

  const { message, sessionId: incomingSession, history = [], leadData } = await req.json();
  if (!message) return NextResponse.json({ error: "Message required" }, { status: 400 });

  const sessionId = incomingSession || generateId();

  if (leadData && bot.collectLeads) {
    Leads.create({
      chatbotId: id,
      sessionId,
      name: leadData.name || "",
      email: leadData.email || "",
      phone: leadData.phone || "",
    });
  }

  Messages.create({ chatbotId: id, sessionId, role: "user", content: message });

  const queryEmbedding = await getEmbedding(message);
  const relevantChunks = searchChunks(id, queryEmbedding, 5);
  const context = relevantChunks.map((c) => c.text).join("\n\n---\n\n");

  const replyText = await chatCompletion(bot.systemPrompt, history, context);

  Messages.create({ chatbotId: id, sessionId, role: "assistant", content: replyText });

  return NextResponse.json({ reply: replyText, sessionId });
}
