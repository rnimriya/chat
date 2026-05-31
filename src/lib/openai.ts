import OpenAI from "openai";

let _client: OpenAI | null = null;

function getClient(): OpenAI {
  if (!_client) {
    _client = new OpenAI({ apiKey: process.env.OPENAI_API_KEY || "mock_key" });
  }
  return _client;
}

export async function getEmbedding(text: string): Promise<number[]> {
  try {
    const client = getClient();
    const response = await client.embeddings.create({
      model: "text-embedding-3-small",
      input: text.slice(0, 8000),
    });
    return response.data[0].embedding;
  } catch (err) {
    console.warn("[OPENAI] Embedding failed, falling back to mock vector:", err);
    // Return 1536-dimensional mock vector
    return new Array(1536).fill(0).map(() => Math.random() - 0.5);
  }
}

export async function chatCompletion(
  systemPrompt: string,
  messages: { role: "user" | "assistant"; content: string }[],
  context: string
): Promise<string> {
  try {
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
  } catch (err) {
    console.warn("[OPENAI] Chat completion failed, running mock responder:", err);
    return generateMockReply(messages[messages.length - 1]?.content || "", context);
  }
}

export async function chatCompletionWithTools(
  systemPrompt: string,
  messages: any[],
  context: string,
  tools: any[]
): Promise<any> {
  try {
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
  } catch (err) {
    console.warn("[OPENAI] Chat completion with tools failed, running mock responder:", err);
    return generateMockToolReply(messages[messages.length - 1]?.content || "", context);
  }
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
    console.warn("[OPENAI] Sentiment analysis failed, running mock sentiment rules:", err);
    return generateMockSentiment(text);
  }
}

// ─── Smart Mock Helpers ─────────────────────────────────────────────────────────

function generateMockReply(userMessage: string, context: string): string {
  const msg = userMessage.toLowerCase();
  
  if (context && context.trim().length > 0) {
    const sentences = context.split(/[.!\n]/).map(s => s.trim()).filter(s => s.length > 8);
    const matchingSentence = sentences.find(s => {
      const words = msg.split(/\s+/).filter(w => w.length > 3);
      return words.some(w => s.toLowerCase().includes(w));
    });
    if (matchingSentence) {
      return `Based on our database: ${matchingSentence}.`;
    }
  }
  
  if (msg.includes("pricing") || msg.includes("plan") || msg.includes("cost") || msg.includes("price") || msg.includes("subscription")) {
    return "Our plans start at $35/month for the Basic plan, and $99/month for the Pro plan which includes removing PaperChat branding and 10,000 message credits.";
  }
  if (msg.includes("what is") || msg.includes("what does") || msg.includes("paperchat")) {
    return "We are PaperChat, an advanced B2B SaaS platform that enables businesses to build custom AI Customer Support Agents that schedule appointments, collect leads, and take payments directly in chat.";
  }
  
  return "I don't have that information in my knowledge base. Please suggest contacting support so our team can assist you further.";
}

function generateMockToolReply(userMessage: string, context: string): any {
  const msg = userMessage.toLowerCase();
  
  // Detect booking request
  if (msg.includes("book") || msg.includes("schedule") || msg.includes("appointment") || msg.includes("meeting") || msg.includes("calendly") || msg.includes("time")) {
    return {
      content: null,
      tool_calls: [
        {
          id: "call_mock_booking",
          type: "function",
          function: {
            name: "book_appointment",
            arguments: JSON.stringify({
              name: "Valued Customer",
              email: "customer@example.com",
              date: new Date(Date.now() + 86400000).toISOString().slice(0, 16),
              notes: `Booking request: ${userMessage}`
            })
          }
        }
      ]
    };
  }
  
  // Detect checkout/payment request
  if (msg.includes("buy") || msg.includes("purchase") || msg.includes("checkout") || msg.includes("price") || msg.includes("pay") || msg.includes("order")) {
    return {
      content: null,
      tool_calls: [
        {
          id: "call_mock_payment",
          type: "function",
          function: {
            name: "generate_payment_link",
            arguments: JSON.stringify({
              amount: msg.includes("pro") ? 99 : msg.includes("enterprise") ? 399 : 35,
              description: msg.includes("pro") ? "Pro Plan Upgrade" : msg.includes("enterprise") ? "Enterprise Plan Upgrade" : "Basic Plan Upgrade"
            })
          }
        }
      ]
    };
  }
  
  // Detect sync lead request
  if (msg.includes("lead") || msg.includes("contact") || msg.includes("details") || msg.includes("email") || msg.includes("phone")) {
    return {
      content: null,
      tool_calls: [
        {
          id: "call_mock_crm",
          type: "function",
          function: {
            name: "sync_lead_to_crm",
            arguments: JSON.stringify({
              name: "Sarah Jenkins",
              email: "sarah@acme.com",
              phone: "555-0199",
              company: "Acme Corp",
              useCase: "Support automation"
            })
          }
        }
      ]
    };
  }
  
  return {
    content: generateMockReply(userMessage, context),
    tool_calls: null
  };
}

function generateMockSentiment(text: string): "positive" | "neutral" | "frustrated" {
  const msg = text.toLowerCase();
  if (msg.includes("angry") || msg.includes("frustrated") || msg.includes("bad") || msg.includes("stupid") || msg.includes("worst") || msg.includes("hate") || msg.includes("issue") || msg.includes("problem") || msg.includes("fail")) {
    return "frustrated";
  }
  if (msg.includes("good") || msg.includes("great") || msg.includes("thank") || msg.includes("love") || msg.includes("awesome") || msg.includes("perfect") || msg.includes("nice") || msg.includes("happy")) {
    return "positive";
  }
  return "neutral";
}
