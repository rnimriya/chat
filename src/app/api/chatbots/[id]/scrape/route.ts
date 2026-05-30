import { NextRequest, NextResponse } from "next/server";
import { getSessionFromRequest } from "@/lib/auth";
import { Chatbots } from "@/lib/db";
import { getEmbedding } from "@/lib/openai";
import { saveChunks, getChunkCount } from "@/lib/vectorStore";
import { chunkText, generateId } from "@/lib/utils";
import * as cheerio from "cheerio";

async function scrapeUrl(url: string): Promise<string> {
  const res = await fetch(url, {
    headers: { "User-Agent": "Mozilla/5.0 (compatible; PaperChatBot/1.0)" },
    signal: AbortSignal.timeout(15000),
  });
  if (!res.ok) throw new Error(`Failed to fetch ${url}: ${res.status}`);
  const html = await res.text();
  const $ = cheerio.load(html);
  $("script, style, nav, footer, header, aside, [aria-hidden=true]").remove();
  const text = $("body").text().replace(/\s+/g, " ").trim();
  return text;
}

export async function POST(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const session = await getSessionFromRequest(req);
  if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const { id } = await params;
  const bot = Chatbots.findById(id);
  if (!bot || bot.userId !== session.userId)
    return NextResponse.json({ error: "Not found" }, { status: 404 });

  const { url } = await req.json();
  if (!url) return NextResponse.json({ error: "URL required" }, { status: 400 });

  let content: string;
  try {
    content = await scrapeUrl(url);
  } catch (err: unknown) {
    const msg = err instanceof Error ? err.message : "Unknown error";
    return NextResponse.json({ error: `Failed to scrape URL: ${msg}` }, { status: 422 });
  }

  if (content.length < 50) {
    return NextResponse.json({ error: "Not enough content scraped from that URL" }, { status: 422 });
  }

  const chunks = chunkText(content);
  const vectorChunks = await Promise.all(
    chunks.map(async (chunk) => ({
      id: generateId(),
      text: chunk,
      embedding: await getEmbedding(chunk),
      source: url,
    }))
  );

  saveChunks(id, vectorChunks);
  const totalChunks = getChunkCount(id);
  Chatbots.update(id, { chunkCount: totalChunks });

  return NextResponse.json({ success: true, chunksAdded: vectorChunks.length, totalChunks, url });
}
