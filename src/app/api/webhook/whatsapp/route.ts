import { NextRequest, NextResponse } from "next/server";
import { Chatbots, Messages } from "@/lib/db";
import { getEmbedding, chatCompletion } from "@/lib/openai";
import { searchChunks } from "@/lib/vectorStore";

// Verification token configured in Meta developer dashboard
const VERIFY_TOKEN = process.env.WHATSAPP_VERIFY_TOKEN || "paperchat_verify_secret_123";
const WHATSAPP_ACCESS_TOKEN = process.env.WHATSAPP_ACCESS_TOKEN || "mock_meta_access_token";

// 1. GET Request: Webhook verification from Meta
export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const mode = searchParams.get("hub.mode");
  const token = searchParams.get("hub.verify_token");
  const challenge = searchParams.get("hub.challenge");

  if (mode && token) {
    if (mode === "subscribe" && token === VERIFY_TOKEN) {
      console.log("[WHATSAPP WEBHOOK] Verified successfully.");
      return new Response(challenge, { status: 200 });
    }
  }

  return NextResponse.json({ error: "Verification failed" }, { status: 403 });
}

// 2. POST Request: Incoming message processing from Meta WhatsApp API (Module 3)
export async function POST(req: NextRequest) {
  try {
    const payload = await req.json();
    console.log("[WHATSAPP WEBHOOK] Received payload:", JSON.stringify(payload));

    const entry = payload.entry?.[0];
    const changes = entry?.changes?.[0];
    const value = changes?.value;
    const messageObj = value?.messages?.[0];

    if (!messageObj) {
      // Empty notification check
      return NextResponse.json({ status: "ignored" });
    }

    const senderPhoneNumber = messageObj.from;
    const incomingText = messageObj.text?.body;
    const phoneMetadata = value?.metadata;
    const phoneNumberId = phoneMetadata?.phone_number_id; // Needed to send response back

    if (!incomingText || !phoneNumberId) {
      return NextResponse.json({ error: "Missing required fields" }, { status: 400 });
    }

    // A. Find an active chatbot for answering (mock fallback if no bot is configured yet)
    const bots = Chatbots.all();
    const activeBot = bots[0]; // For omnichannel demo, route to the first chatbot

    if (!activeBot) {
      console.warn("[WHATSAPP WEBHOOK] No chatbots configured to respond.");
      return NextResponse.json({ error: "No chatbots configured" }, { status: 404 });
    }

    // B. Run through RAG Pipeline
    const queryEmbedding = await getEmbedding(incomingText);
    const relevantChunks = searchChunks(activeBot.id, queryEmbedding, 3);
    const context = relevantChunks.map((c) => c.text).join("\n\n---\n\n");

    // Retrieve previous conversations using the phone number as the sessionId (omnichannel context)
    const sessionId = `wa_${senderPhoneNumber}`;
    const previousMessages = Messages.bySession(sessionId).slice(-6).map((m) => ({
      role: m.role,
      content: m.content
    }));

    // Record user message
    Messages.create({
      chatbotId: activeBot.id,
      sessionId,
      role: "user",
      content: incomingText
    });

    const replyText = await chatCompletion(activeBot.systemPrompt, previousMessages, context);

    // Record assistant reply
    Messages.create({
      chatbotId: activeBot.id,
      sessionId,
      role: "assistant",
      content: replyText
    });

    // C. Send response message back via WhatsApp Cloud API
    console.log(`[WHATSAPP WEBHOOK] Sending reply to ${senderPhoneNumber}: "${replyText}"`);

    // Fetch call to Meta Cloud API (wrapped in try/catch for robust fallback - Rule 3)
    try {
      const response = await fetch(`https://graph.facebook.com/v19.0/${phoneNumberId}/messages`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${WHATSAPP_ACCESS_TOKEN}`,
        },
        body: JSON.stringify({
          messaging_product: "whatsapp",
          recipient_type: "individual",
          to: senderPhoneNumber,
          type: "text",
          text: { preview_url: false, body: replyText },
        }),
      });

      const responseData = await response.json();
      if (!response.ok) {
        console.error("[WHATSAPP WEBHOOK] Meta API Send failed:", responseData);
        // Fallback logged, but return successful response to webhook so Meta does not retry
      }
    } catch (metaError) {
      console.error("[WHATSAPP WEBHOOK] Network error sending to Meta API:", metaError);
    }

    return NextResponse.json({ status: "success", reply: replyText });
  } catch (err: any) {
    console.error("[WHATSAPP WEBHOOK] Fatal processing error:", err);
    return NextResponse.json({ error: err.message || err }, { status: 500 });
  }
}
