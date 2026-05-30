import { NextRequest, NextResponse } from "next/server";
import { getSessionFromRequest } from "@/lib/auth";
import { Chatbots } from "@/lib/db";
import { getEmbedding } from "@/lib/openai";
import { saveChunks, getChunkCount } from "@/lib/vectorStore";
import { chunkText, generateId } from "@/lib/utils";

export async function POST(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const session = await getSessionFromRequest(req);
  if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const { id } = await params;
  const bot = Chatbots.findById(id);
  if (!bot || bot.userId !== session.userId)
    return NextResponse.json({ error: "Not found" }, { status: 404 });

  const formData = await req.formData();
  const text = formData.get("text") as string;
  const source = (formData.get("source") as string) || "manual";
  const file = formData.get("file") as File | null;

  let content = text || "";

  if (file) {
    const buffer = Buffer.from(await file.arrayBuffer());
    const filename = file.name.toLowerCase();

    if (filename.endsWith(".pdf")) {
      // eslint-disable-next-line @typescript-eslint/no-require-imports
      const pdfParse = require("pdf-parse");
      const parsed = await pdfParse(buffer);
      content = parsed.text;
    } else if (filename.endsWith(".docx") || filename.endsWith(".doc")) {
      const mammoth = await import("mammoth");
      const result = await mammoth.extractRawText({ buffer });
      content = result.value;
    } else {
      content = buffer.toString("utf-8");
    }
  }

  if (!content.trim()) {
    return NextResponse.json({ error: "No content to train on" }, { status: 400 });
  }

  const chunks = chunkText(content);
  const vectorChunks = await Promise.all(
    chunks.map(async (chunk) => ({
      id: generateId(),
      text: chunk,
      embedding: await getEmbedding(chunk),
      source,
    }))
  );

  saveChunks(id, vectorChunks);
  const totalChunks = getChunkCount(id);
  Chatbots.update(id, { chunkCount: totalChunks });

  return NextResponse.json({ success: true, chunksAdded: vectorChunks.length, totalChunks });
}
