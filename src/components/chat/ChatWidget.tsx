"use client";
import { useState, useRef, useEffect } from "react";

interface Message {
  role: "user" | "assistant";
  content: string;
}

interface LeadData {
  name: string;
  email: string;
  phone: string;
}

interface Props {
  chatbotId: string;
  name: string;
  welcomeMessage: string;
  color: string;
  collectLeads: boolean;
}

export default function ChatWidget({ chatbotId, name, welcomeMessage, color, collectLeads }: Props) {
  const [messages, setMessages] = useState<Message[]>([
    { role: "assistant", content: welcomeMessage },
  ]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const [sessionId, setSessionId] = useState<string | null>(null);
  const [leadStep, setLeadStep] = useState<"idle" | "collecting" | "done">(
    collectLeads ? "collecting" : "done"
  );
  const [lead, setLead] = useState<LeadData>({ name: "", email: "", phone: "" });
  const [leadSubmitting, setLeadSubmitting] = useState(false);
  const bottomRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, leadStep]);

  async function submitLead() {
    setLeadSubmitting(true);
    await fetch(`/api/chatbots/${chatbotId}/chat`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        message: "User submitted contact info",
        sessionId,
        leadData: lead,
        history: [],
      }),
    });
    setLeadStep("done");
    setLeadSubmitting(false);
  }

  async function sendMessage() {
    const msg = input.trim();
    if (!msg || loading) return;
    setInput("");
    const newMessages: Message[] = [...messages, { role: "user", content: msg }];
    setMessages(newMessages);
    setLoading(true);

    try {
      const history = newMessages.slice(-10).map((m) => ({ role: m.role, content: m.content }));
      const res = await fetch(`/api/chatbots/${chatbotId}/chat`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ message: msg, sessionId, history }),
      });
      const data = await res.json();
      if (res.ok) {
        setSessionId(data.sessionId);
        setMessages([...newMessages, { role: "assistant", content: data.reply }]);
      } else {
        setMessages([...newMessages, { role: "assistant", content: "Sorry, something went wrong. Please try again." }]);
      }
    } catch {
      setMessages([...newMessages, { role: "assistant", content: "Connection error. Please check your internet connection." }]);
    } finally {
      setLoading(false);
    }
  }

  function handleKey(e: React.KeyboardEvent) {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      sendMessage();
    }
  }

  return (
    <div className="flex flex-col h-[600px] bg-white rounded-2xl shadow-2xl overflow-hidden border border-slate-200">
      {/* Header */}
      <div className="flex items-center gap-3 px-4 py-3.5 text-white" style={{ backgroundColor: color }}>
        <div className="w-9 h-9 rounded-full bg-white/20 flex items-center justify-center font-bold text-sm">
          {name.charAt(0).toUpperCase()}
        </div>
        <div>
          <div className="font-semibold text-sm">{name}</div>
          <div className="text-xs opacity-80 flex items-center gap-1">
            <span className="w-1.5 h-1.5 bg-green-400 rounded-full inline-block" />
            Online · AI-powered
          </div>
        </div>
      </div>

      {/* Messages */}
      <div className="flex-1 overflow-y-auto px-4 py-4 space-y-3 bg-slate-50">
        {messages.map((msg, i) => (
          <div key={i} className={`flex ${msg.role === "user" ? "justify-end" : "justify-start"}`}>
            {msg.role === "assistant" && (
              <div className="w-6 h-6 rounded-full flex-shrink-0 mr-2 flex items-center justify-center text-white text-xs font-bold" style={{ backgroundColor: color }}>
                AI
              </div>
            )}
            <div
              className={`max-w-[75%] px-3.5 py-2.5 rounded-2xl text-sm leading-relaxed ${
                msg.role === "user"
                  ? "text-white rounded-tr-sm"
                  : "bg-white text-slate-800 rounded-tl-sm shadow-sm border border-slate-100"
              }`}
              style={msg.role === "user" ? { backgroundColor: color } : {}}
            >
              {msg.content}
            </div>
          </div>
        ))}

        {loading && (
          <div className="flex justify-start">
            <div className="w-6 h-6 rounded-full flex-shrink-0 mr-2 flex items-center justify-center text-white text-xs font-bold" style={{ backgroundColor: color }}>
              AI
            </div>
            <div className="bg-white border border-slate-100 shadow-sm rounded-2xl rounded-tl-sm px-4 py-3">
              <div className="flex gap-1">
                <span className="w-2 h-2 bg-slate-300 rounded-full animate-bounce" style={{ animationDelay: "0ms" }} />
                <span className="w-2 h-2 bg-slate-300 rounded-full animate-bounce" style={{ animationDelay: "150ms" }} />
                <span className="w-2 h-2 bg-slate-300 rounded-full animate-bounce" style={{ animationDelay: "300ms" }} />
              </div>
            </div>
          </div>
        )}

        {/* Lead capture form */}
        {leadStep === "collecting" && !loading && (
          <div className="bg-white border border-slate-100 rounded-2xl shadow-sm p-4 mx-1">
            <p className="text-sm text-slate-700 font-medium mb-3">Before we chat, leave your details so we can follow up:</p>
            <div className="space-y-2">
              <input
                type="text" placeholder="Your name" value={lead.name}
                onChange={(e) => setLead({ ...lead, name: e.target.value })}
                className="w-full px-3 py-2 border border-slate-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-indigo-400"
              />
              <input
                type="email" placeholder="Email address" value={lead.email}
                onChange={(e) => setLead({ ...lead, email: e.target.value })}
                className="w-full px-3 py-2 border border-slate-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-indigo-400"
              />
              <input
                type="tel" placeholder="Phone (optional)" value={lead.phone}
                onChange={(e) => setLead({ ...lead, phone: e.target.value })}
                className="w-full px-3 py-2 border border-slate-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-indigo-400"
              />
              <div className="flex gap-2 pt-1">
                <button
                  onClick={submitLead} disabled={leadSubmitting || !lead.email}
                  className="flex-1 text-white text-sm font-medium py-2 rounded-lg disabled:opacity-60 transition-colors"
                  style={{ backgroundColor: color }}
                >
                  {leadSubmitting ? "Saving..." : "Start chatting →"}
                </button>
                <button onClick={() => setLeadStep("done")} className="text-sm text-slate-400 hover:text-slate-600 px-2">Skip</button>
              </div>
            </div>
          </div>
        )}

        <div ref={bottomRef} />
      </div>

      {/* Input */}
      <div className="px-4 py-3 border-t border-slate-100 bg-white">
        <div className="flex gap-2 items-end">
          <textarea
            value={input} onChange={(e) => setInput(e.target.value)} onKeyDown={handleKey}
            disabled={leadStep === "collecting"}
            placeholder={leadStep === "collecting" ? "Fill in your details above first..." : "Ask anything..."}
            rows={1}
            className="flex-1 px-3 py-2.5 border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-indigo-400 resize-none disabled:opacity-50 disabled:bg-slate-50"
            style={{ maxHeight: "120px" }}
          />
          <button
            onClick={sendMessage}
            disabled={loading || !input.trim() || leadStep === "collecting"}
            className="w-9 h-9 rounded-xl flex items-center justify-center disabled:opacity-40 transition-colors shrink-0"
            style={{ backgroundColor: color }}
          >
            <svg className="w-4 h-4 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8" />
            </svg>
          </button>
        </div>
        <div className="text-center mt-2">
          <span className="text-xs text-slate-300">Powered by PaperChat</span>
        </div>
      </div>
    </div>
  );
}
