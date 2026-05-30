import { NextRequest, NextResponse } from "next/server";
import { ContentGaps } from "@/lib/db";
import OpenAI from "openai";

let _client: OpenAI | null = null;
function getClient(): OpenAI {
  if (!_client) _client = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });
  return _client;
}

// GET Endpoint to trigger background Content Gap Reporting (Module 4 Feature B)
export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const chatbotId = searchParams.get("chatbotId");

    if (!chatbotId) {
      return NextResponse.json({ error: "chatbotId parameter is required" }, { status: 400 });
    }

    // Retrieve unresolved content gaps for this chatbot
    const gaps = ContentGaps.byChatbot(chatbotId).filter(g => !g.resolved);

    if (gaps.length === 0) {
      return NextResponse.json({
        report: [],
        message: "No unresolved content gaps recorded yet. Knowledge base is fully covered!"
      });
    }

    // Format list of questions for GPT classification
    const questionList = gaps.map(g => `- [ID: ${g.id}] "${g.question}" (Count: ${g.count})`).join("\n");

    const client = getClient();
    const prompt = `Analyze the following customer support questions that our AI agent could not answer because they were missing from the knowledge base.
Group these questions by semantic similarity (missing topics/gaps).
For each group, create a topic name, list the matching question text, and calculate the total count of times it was asked.

Respond ONLY with a JSON array of objects with the following structure:
[
  {
    "topic": "Topic Name",
    "frequency": 12,
    "questions": ["User question 1", "User question 2"],
    "suggestedAction": "Suggested addition to knowledge base"
  }
]

Questions to analyze:
${questionList}`;

    const completion = await client.chat.completions.create({
      model: "gpt-4o",
      messages: [{ role: "user", content: prompt }],
      temperature: 0.2,
      response_format: { type: "json_object" }
    });

    const reportContent = completion.choices[0].message.content || "{}";
    const reportData = JSON.parse(reportContent);

    // Extract report list (allowing for both raw array and wrapper objects)
    const report = reportData.report || reportData.topics || reportData.gaps || Object.values(reportData)[0] || [];

    return NextResponse.json({
      chatbotId,
      gapsAnalyzed: gaps.length,
      report,
      generatedAt: new Date().toISOString()
    });
  } catch (err: any) {
    console.error("[CONTENT GAP CRON] Failed to generate report:", err);
    return NextResponse.json({ error: err.message || err }, { status: 500 });
  }
}
