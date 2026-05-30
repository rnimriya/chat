import { NextRequest, NextResponse } from "next/server";
import { getSessionFromRequest } from "@/lib/auth";
import { Chatbots, Messages, Leads } from "@/lib/db";

export async function GET(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const session = await getSessionFromRequest(req);
  if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const { id } = await params;
  const bot = Chatbots.findById(id);
  if (!bot || bot.userId !== session.userId)
    return NextResponse.json({ error: "Not found" }, { status: 404 });

  const messages = Messages.byChatbot(id);
  const leads = Leads.byChatbot(id);

  const sessions = [...new Set(messages.map((m) => m.sessionId))];
  const userMessages = messages.filter((m) => m.role === "user");

  const dailyCounts: Record<string, number> = {};
  userMessages.forEach((m) => {
    const day = m.timestamp.slice(0, 10);
    dailyCounts[day] = (dailyCounts[day] || 0) + 1;
  });

  const recentSessions = sessions.slice(-20).map((sid) => {
    const sessionMsgs = messages.filter((m) => m.sessionId === sid);
    const first = sessionMsgs[0];
    const last = sessionMsgs[sessionMsgs.length - 1];
    return {
      sessionId: sid,
      messageCount: sessionMsgs.length,
      startedAt: first?.timestamp,
      lastMessageAt: last?.timestamp,
      preview: sessionMsgs.find((m) => m.role === "user")?.content || "",
    };
  });

  return NextResponse.json({
    totalMessages: messages.length,
    totalSessions: sessions.length,
    totalLeads: leads.length,
    userMessages: userMessages.length,
    dailyCounts,
    recentSessions,
    leads: leads.slice(-50),
  });
}
