import fs from "fs";
import path from "path";
import { cosineSimilarity } from "./utils";

const VECTORS_DIR = path.join(process.cwd(), "data", "vectors");

function ensureDir(dir: string) {
  if (!fs.existsSync(dir)) fs.mkdirSync(dir, { recursive: true });
}

export interface VectorChunk {
  id: string;
  text: string;
  embedding: number[];
  source: string;
}

export function saveChunks(chatbotId: string, chunks: VectorChunk[]) {
  ensureDir(VECTORS_DIR);
  const file = path.join(VECTORS_DIR, `${chatbotId}.json`);
  const existing: VectorChunk[] = fs.existsSync(file)
    ? JSON.parse(fs.readFileSync(file, "utf-8"))
    : [];
  const updated = [...existing, ...chunks];
  fs.writeFileSync(file, JSON.stringify(updated));
}

export function clearChunks(chatbotId: string) {
  const file = path.join(VECTORS_DIR, `${chatbotId}.json`);
  if (fs.existsSync(file)) fs.writeFileSync(file, "[]");
}

export function getChunkCount(chatbotId: string): number {
  const file = path.join(VECTORS_DIR, `${chatbotId}.json`);
  if (!fs.existsSync(file)) return 0;
  try {
    const chunks: VectorChunk[] = JSON.parse(fs.readFileSync(file, "utf-8"));
    return chunks.length;
  } catch {
    return 0;
  }
}

export function searchChunks(chatbotId: string, queryEmbedding: number[], topK = 5): VectorChunk[] {
  const file = path.join(VECTORS_DIR, `${chatbotId}.json`);
  if (!fs.existsSync(file)) return [];
  const chunks: VectorChunk[] = JSON.parse(fs.readFileSync(file, "utf-8"));
  if (chunks.length === 0) return [];

  const scored = chunks.map((chunk) => ({
    chunk,
    score: cosineSimilarity(queryEmbedding, chunk.embedding),
  }));
  scored.sort((a, b) => b.score - a.score);
  return scored.slice(0, topK).map((s) => s.chunk);
}

export function deleteVectors(chatbotId: string) {
  const file = path.join(VECTORS_DIR, `${chatbotId}.json`);
  if (fs.existsSync(file)) fs.unlinkSync(file);
}
