"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";

export default function NewChatbotPage() {
  const router = useRouter();
  const [name, setName] = useState("");
  const [websiteUrl, setWebsiteUrl] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  async function handleContinue(e: React.FormEvent) {
    e.preventDefault();
    if (!name.trim()) { setError("Chatbot name is required"); return; }
    setLoading(true);
    setError("");
    try {
      const res = await fetch("/api/chatbots", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: name.trim(), description: "", color: "#6366f1",
          welcomeMessage: "Hi! How can I help you today?",
          systemPrompt: "You are a helpful customer support assistant. Be friendly, concise, and accurate.",
          collectLeads: false, humanHandover: false, humanHandoverEmail: "",
        }),
      });
      const data = await res.json();
      if (!res.ok) { setError(data.error || "Failed to create chatbot"); return; }
      router.push(`/dashboard/${data.id}/train${websiteUrl ? `?url=${encodeURIComponent(websiteUrl)}` : ""}`);
    } catch { setError("Something went wrong."); }
    finally { setLoading(false); }
  }

  const steps = [
    { num: 1, label: "Basic info", active: true },
    { num: 2, label: "Train", active: false },
    { num: 3, label: "Done", active: false },
  ];

  const inputCls = "w-full px-4 py-3.5 border border-slate-200 dark:border-slate-700 rounded-xl text-base focus:outline-none focus:ring-2 focus:ring-sky-400 focus:border-transparent bg-white dark:bg-slate-800 text-slate-900 dark:text-slate-100 placeholder:text-slate-300 dark:placeholder:text-slate-600 transition-colors";

  return (
    <div className="px-8 py-8 max-w-3xl">
      <div className="flex items-start justify-between mb-10">
        <div>
          <h1 className="text-3xl font-extrabold text-slate-900 dark:text-slate-100 tracking-tight leading-tight">
            Set up your <span className="text-sky-500 dark:text-sky-400">chatbot</span>
          </h1>
          <p className="text-slate-500 dark:text-slate-400 text-sm mt-2">Start with the basics. You can change everything later.</p>
        </div>

        {/* Steps */}
        <div className="flex items-center gap-4 shrink-0 mt-1">
          {steps.map((step, i) => (
            <div key={step.num} className="flex items-center gap-4">
              <div className="flex flex-col items-center gap-1">
                <div className={`w-9 h-9 rounded-full flex items-center justify-center text-sm font-bold transition-all ${step.active ? "bg-slate-900 dark:bg-white text-white dark:text-slate-900" : "border-2 border-slate-300 dark:border-slate-600 text-slate-400 dark:text-slate-500"}`}>
                  {step.num}
                </div>
                <span className={`text-xs font-medium ${step.active ? "text-slate-900 dark:text-slate-100" : "text-slate-400 dark:text-slate-500"}`}>{step.label}</span>
              </div>
              {i < steps.length - 1 && <div className="w-8 h-px bg-slate-200 dark:bg-slate-700 mb-4" />}
            </div>
          ))}
        </div>
      </div>

      <form onSubmit={handleContinue} className="space-y-8">
        {error && (
          <div className="flex items-center gap-2 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 text-red-700 dark:text-red-400 text-sm px-4 py-3 rounded-xl">
            <svg viewBox="0 0 24 24" fill="currentColor" className="w-4 h-4 shrink-0">
              <path fillRule="evenodd" d="M9.401 3.003c1.155-2 4.043-2 5.197 0l7.355 12.748c1.154 1.999-.29 4.5-2.599 4.5H4.645c-2.309 0-3.752-2.501-2.598-4.5L9.4 3.003ZM12 8.25a.75.75 0 0 1 .75.75v3.75a.75.75 0 0 1-1.5 0V9a.75.75 0 0 1 .75-.75Zm0 8.25a.75.75 0 1 0 0-1.5.75.75 0 0 0 0 1.5Z" clipRule="evenodd" />
            </svg>
            {error}
          </div>
        )}

        <div>
          <label className="block text-sm font-bold text-slate-900 dark:text-slate-100 mb-2">
            Chatbot name <span className="text-red-500">*</span>
          </label>
          <input
            type="text" value={name} onChange={(e) => { setName(e.target.value); setError(""); }}
            autoFocus
            style={{ color: undefined, backgroundColor: undefined, WebkitTextFillColor: undefined }}
            className={`w-full px-4 py-3.5 border-2 rounded-xl text-base focus:outline-none transition-colors bg-white dark:bg-slate-800 text-slate-900 dark:text-slate-100 placeholder:text-slate-300 dark:placeholder:text-slate-600 ${name ? "border-slate-900 dark:border-slate-400" : "border-slate-200 dark:border-slate-700 focus:border-slate-900 dark:focus:border-slate-400"}`}
            placeholder="Acme Support Bot"
          />
        </div>

        <div>
          <label className="block text-sm font-bold text-slate-900 dark:text-slate-100 mb-2">
            Website URL <span className="text-slate-400 dark:text-slate-500 font-normal">(optional)</span>
          </label>
          <input
            type="url" value={websiteUrl} onChange={(e) => setWebsiteUrl(e.target.value)}
            style={{ color: undefined, backgroundColor: undefined, WebkitTextFillColor: undefined }}
            className={inputCls}
            placeholder="https://yourwebsite.com"
          />
          <p className="text-xs text-slate-400 dark:text-slate-500 mt-2">Used to pre-fill the website crawl on the next step.</p>
        </div>

        <div>
          <label className="block text-sm font-bold text-slate-900 dark:text-slate-100 mb-2">
            Allowed domains <span className="text-slate-400 dark:text-slate-500 font-normal">(optional)</span>
          </label>
          <input
            type="text"
            style={{ color: undefined, backgroundColor: undefined, WebkitTextFillColor: undefined }}
            className={inputCls}
            placeholder="Add domain (press Enter to add)"
          />
          <p className="text-xs text-slate-400 dark:text-slate-500 mt-2">0/3 domains added</p>
          <p className="text-xs text-slate-400 dark:text-slate-500">Restrict the chatbot widget to only appear on these domains.</p>
        </div>

        <div className="flex justify-end pt-2">
          <button
            type="submit" disabled={loading}
            className="inline-flex items-center gap-2 bg-slate-900 dark:bg-white text-white dark:text-slate-900 font-semibold px-7 py-3 rounded-xl hover:bg-slate-700 dark:hover:bg-slate-100 disabled:opacity-60 transition-colors"
          >
            {loading ? (
              <><svg className="animate-spin w-4 h-4" viewBox="0 0 24 24" fill="none"><circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" /><path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" /></svg>Creating...</>
            ) : (
              <>Continue <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} className="w-4 h-4"><path strokeLinecap="round" strokeLinejoin="round" d="M13.5 4.5 21 12m0 0-7.5 7.5M21 12H3" /></svg></>
            )}
          </button>
        </div>
      </form>
    </div>
  );
}
