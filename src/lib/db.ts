import fs from "fs";
import path from "path";
import { generateId } from "./utils";

const DATA_DIR = path.join(process.cwd(), "data");

function ensureDir(dir: string) {
  if (!fs.existsSync(dir)) fs.mkdirSync(dir, { recursive: true });
}

function readJSON<T>(file: string): T {
  ensureDir(DATA_DIR);
  const filePath = path.join(DATA_DIR, file);
  if (!fs.existsSync(filePath)) return [] as unknown as T;
  try {
    return JSON.parse(fs.readFileSync(filePath, "utf-8"));
  } catch {
    return [] as unknown as T;
  }
}

function writeJSON(file: string, data: unknown) {
  ensureDir(DATA_DIR);
  fs.writeFileSync(path.join(DATA_DIR, file), JSON.stringify(data, null, 2));
}

// ─── User types ───────────────────────────────────────────────────────────────

export interface User {
  id: string;
  email: string;
  name: string;
  passwordHash: string;
  createdAt: string;
  plan: "free" | "pro";
}

export const Users = {
  all: (): User[] => readJSON<User[]>("users.json"),
  findByEmail: (email: string) => Users.all().find((u) => u.email === email),
  findById: (id: string) => Users.all().find((u) => u.id === id),
  create: (data: Omit<User, "id" | "createdAt" | "plan">): User => {
    const users = Users.all();
    const user: User = { ...data, id: generateId(), createdAt: new Date().toISOString(), plan: "free" };
    users.push(user);
    writeJSON("users.json", users);
    return user;
  },
};

// ─── Chatbot types ────────────────────────────────────────────────────────────

export interface Chatbot {
  id: string;
  userId: string;
  name: string;
  description: string;
  color: string;
  welcomeMessage: string;
  systemPrompt: string;
  collectLeads: boolean;
  humanHandover: boolean;
  humanHandoverEmail: string;
  createdAt: string;
  updatedAt: string;
  chunkCount: number;
}

export const Chatbots = {
  all: (): Chatbot[] => readJSON<Chatbot[]>("chatbots.json"),
  findById: (id: string) => Chatbots.all().find((c) => c.id === id),
  byUser: (userId: string) => Chatbots.all().filter((c) => c.userId === userId),
  create: (data: Omit<Chatbot, "id" | "createdAt" | "updatedAt" | "chunkCount">): Chatbot => {
    const bots = Chatbots.all();
    const bot: Chatbot = {
      ...data,
      id: generateId(),
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      chunkCount: 0,
    };
    bots.push(bot);
    writeJSON("chatbots.json", bots);
    return bot;
  },
  update: (id: string, data: Partial<Chatbot>): Chatbot | null => {
    const bots = Chatbots.all();
    const idx = bots.findIndex((b) => b.id === id);
    if (idx === -1) return null;
    bots[idx] = { ...bots[idx], ...data, updatedAt: new Date().toISOString() };
    writeJSON("chatbots.json", bots);
    return bots[idx];
  },
  delete: (id: string) => {
    const bots = Chatbots.all().filter((b) => b.id !== id);
    writeJSON("chatbots.json", bots);
  },
};

// ─── Chat message types ───────────────────────────────────────────────────────

export interface ChatMessage {
  id: string;
  chatbotId: string;
  sessionId: string;
  role: "user" | "assistant";
  content: string;
  timestamp: string;
  leadData?: { name?: string; email?: string; phone?: string };
}

export const Messages = {
  all: (): ChatMessage[] => readJSON<ChatMessage[]>("messages.json"),
  byChatbot: (chatbotId: string) => Messages.all().filter((m) => m.chatbotId === chatbotId),
  bySession: (sessionId: string) => Messages.all().filter((m) => m.sessionId === sessionId),
  create: (data: Omit<ChatMessage, "id" | "timestamp">): ChatMessage => {
    const msgs = Messages.all();
    const msg: ChatMessage = { ...data, id: generateId(), timestamp: new Date().toISOString() };
    msgs.push(msg);
    writeJSON("messages.json", msgs);
    return msg;
  },
};

// ─── Lead types ───────────────────────────────────────────────────────────────

export interface Lead {
  id: string;
  chatbotId: string;
  sessionId: string;
  name: string;
  email: string;
  phone: string;
  capturedAt: string;
}

export const Leads = {
  all: (): Lead[] => readJSON<Lead[]>("leads.json"),
  byChatbot: (chatbotId: string) => Leads.all().filter((l) => l.chatbotId === chatbotId),
  create: (data: Omit<Lead, "id" | "capturedAt">): Lead => {
    const leads = Leads.all();
    const lead: Lead = { ...data, id: generateId(), capturedAt: new Date().toISOString() };
    leads.push(lead);
    writeJSON("leads.json", leads);
    return lead;
  },
};
