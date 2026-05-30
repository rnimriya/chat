import { NextRequest, NextResponse } from "next/server";
import { Chatbots, Messages, Leads, ContentGaps } from "@/lib/db";
import { getEmbedding, chatCompletionWithTools, analyzeSentiment } from "@/lib/openai";
import { chatbotTools, executeChatbotTool } from "@/lib/tools";
import { searchChunks } from "@/lib/vectorStore";
import { generateId } from "@/lib/utils";

export async function POST(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await params;
    const bot = Chatbots.findById(id);
    if (!bot) return NextResponse.json({ error: "Chatbot not found" }, { status: 404 });

    const { message, sessionId: incomingSession, history = [], leadData } = await req.json();
    if (!message) return NextResponse.json({ error: "Message required" }, { status: 400 });

    const sessionId = incomingSession || generateId();

    // Save lead details if provided (includes conversational pre-chat qualification fields)
    if (leadData && bot.collectLeads) {
      Leads.create({
        chatbotId: id,
        sessionId,
        name: leadData.name || "",
        email: leadData.email || "",
        phone: leadData.phone || "",
        budget: leadData.budget || "",
        company: leadData.company || "",
        useCase: leadData.useCase || "",
      });
    }

    // Create user message
    const userMsg = Messages.create({ chatbotId: id, sessionId, role: "user", content: message });

    // 1. Module 4 Feature A: Sentiment Analysis
    const sentiment = await analyzeSentiment(message);
    Messages.updateSentiment(userMsg.id, sentiment);

    // RAG embedding context lookup
    let queryEmbedding = [0];
    try {
      queryEmbedding = await getEmbedding(message);
    } catch (embErr) {
      console.error("Embedding API failed, falling back to empty query embedding:", embErr);
    }
    const relevantChunks = searchChunks(id, queryEmbedding, 5);
    const context = relevantChunks.map((c) => c.text).join("\n\n---\n\n");

    // Format history messages for GPT API
    const gptHistory = [
      ...history.map((h: any) => ({ role: h.role, content: h.content })),
      { role: "user", content: message }
    ];

    // 2. Module 1: AI Tools Execution
    let replyText = "";
    try {
      const aiResponse = await chatCompletionWithTools(bot.systemPrompt, gptHistory, context, chatbotTools);

      if (aiResponse.tool_calls && aiResponse.tool_calls.length > 0) {
        const toolCall = aiResponse.tool_calls[0];
        const toolName = toolCall.function.name;
        const args = JSON.parse(toolCall.function.arguments);

        // Execute appropriate backend action tool
        const toolResult = await executeChatbotTool(id, sessionId, toolName, args);
        replyText = toolResult.message;
      } else {
        replyText = aiResponse.content || "I'm sorry, I couldn't generate a response.";
      }
    } catch (openaiErr) {
      console.error("OpenAI chat completion / tool call failed:", openaiErr);
      replyText = "I'm sorry, the request timed out. Please try again soon.";
    }

    // 3. Module 4 Feature B: Content Gap logging
    const replyLower = replyText.toLowerCase();
    const isGap = replyLower.includes("don't have that information") || 
                  replyLower.includes("don't know") || 
                  replyLower.includes("do not know") || 
                  replyLower.includes("no information in my knowledge") ||
                  replyLower.includes("suggest contacting support");

    if (isGap) {
      ContentGaps.create({ chatbotId: id, question: message });
    }

    // Create assistant message response
    Messages.create({ chatbotId: id, sessionId, role: "assistant", content: replyText });

    return NextResponse.json({ reply: replyText, sessionId });
  } catch (err: any) {
    console.error("Unhandled error in chat API endpoint:", err);
    return NextResponse.json({
      reply: "I'm sorry, the chatbot service is currently experiencing technical difficulties. Please check back shortly.",
      error: err.message || String(err)
    }, { status: 500 });
  }
}
