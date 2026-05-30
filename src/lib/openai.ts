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

export async function chatCompletionWithTools(
  systemPrompt: string,
  messages: any[],
  context: string,
  tools: any[]
): Promise<any> {
  const client = getClient();
  const fullSystem = `${systemPrompt}

You are a helpful AI assistant. Use the following knowledge base to answer questions accurately.
If the answer isn't in the knowledge base, say you don't have that information and suggest contacting support.
If the user asks to book an appointment, purchase/buy a product, or sync contact info, call the appropriate tool.

KNOWLEDGE BASE:
${context}`;

  const response = await client.chat.completions.create({
    model: "gpt-4o",
    messages: [{ role: "system", content: fullSystem }, ...messages],
    tools,
    tool_choice: "auto",
    temperature: 0.4,
    max_tokens: 1000,
  });
  return response.choices[0].message;
}

export async function analyzeSentiment(text: string): Promise<"positive" | "neutral" | "frustrated"> {
  try {
    const client = getClient();
    const prompt = `Analyze the sentiment of the user message. Respond with EXACTLY one of these three words: positive, neutral, frustrated.

Message: "${text}"`;

    const response = await client.chat.completions.create({
      model: "gpt-4o",
      messages: [{ role: "user", content: prompt }],
      temperature: 0.0,
      max_tokens: 5,
    });

    const result = (response.choices[0].message.content || "").toLowerCase().trim();
    if (result.includes("positive")) return "positive";
    if (result.includes("frustrated") || result.includes("negative") || result.includes("angry")) return "frustrated";
    return "neutral";
  } catch (err) {
    console.error("Sentiment analysis failed:", err);
    return "neutral";
  }
}
