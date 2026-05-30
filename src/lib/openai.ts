import OpenAI from "openai";

let _client: OpenAI | null = null;

function getClient(): OpenAI {
  if (!_client) {
    _client = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });
  }
  return _client;
}

export async function getEmbedding(text: string): Promise<number[]> {
  const client = getClient();
  const response = await client.embeddings.create({
    model: "text-embedding-3-small",
    input: text.slice(0, 8000),
  });
  return response.data[0].embedding;
}

export async function chatCompletion(
  systemPrompt: string,
  messages: { role: "user" | "assistant"; content: string }[],
  context: string
): Promise<string> {
  const client = getClient();
  const fullSystem = `${systemPrompt}

You are a helpful AI assistant. Use the following knowledge base to answer questions accurately.
If the answer isn't in the knowledge base, say you don't have that information and suggest contacting support.

KNOWLEDGE BASE:
${context}`;

  const response = await client.chat.completions.create({
    model: "gpt-4o",
    messages: [{ role: "system", content: fullSystem }, ...messages],
    temperature: 0.4,
    max_tokens: 800,
  });
  return response.choices[0].message.content || "I'm sorry, I couldn't generate a response.";
}
