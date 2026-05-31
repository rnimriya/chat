"use client";
import { useState } from "react";

type Tab = "url" | "file" | "text";
interface TrainResult { chunksAdded: number; totalChunks: number }

const TABS: { key: Tab; label: string; icon: React.ReactNode }[] = [
  { key: "url", label: "Scrape URL", icon: <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.75} className="w-4 h-4"><path strokeLinecap="round" strokeLinejoin="round" d="M12 21a9.004 9.004 0 0 0 8.716-6.747M12 21a9.004 9.004 0 0 1-8.716-6.747M12 21c2.485 0 4.5-4.03 4.5-9S14.485 3 12 3m0 18c-2.485 0-4.5-4.03-4.5-9S9.515 3 12 3m0 0a8.997 8.997 0 0 1 7.843 4.582M12 3a8.997 8.997 0 0 0-7.843 4.582m15.686 0A11.953 11.953 0 0 1 12 10.5c-2.998 0-5.74-1.1-7.843-2.918m15.686 0A8.959 8.959 0 0 1 21 12c0 .778-.099 1.533-.284 2.253m0 0A17.919 17.919 0 0 1 12 16.5c-3.162 0-6.133-.815-8.716-2.247m0 0A9.015 9.015 0 0 1 3 12c0-1.605.42-3.113 1.157-4.418" /></svg> },
  { key: "file", label: "Upload file", icon: <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.75} className="w-4 h-4"><path strokeLinecap="round" strokeLinejoin="round" d="M19.5 14.25v-2.625a3.375 3.375 0 0 0-3.375-3.375h-1.5A1.125 1.125 0 0 1 13.5 7.125v-1.5a3.375 3.375 0 0 0-3.375-3.375H8.25m0 12.75h7.5m-7.5 3H12M10.5 2.25H5.625c-.621 0-1.125.504-1.125 1.125v17.25c0 .621.504 1.125 1.125 1.125h12.75c.621 0 1.125-.504 1.125-1.125V11.25a9 9 0 0 0-9-9Z" /></svg> },
  { key: "text", label: "Paste text", icon: <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.75} className="w-4 h-4"><path strokeLinecap="round" strokeLinejoin="round" d="M16.862 4.487l1.687-1.688a1.875 1.875 0 1 1 2.652 2.652L10.582 16.07a4.5 4.5 0 0 1-1.897 1.13L6 18l.8-2.685a4.5 4.5 0 0 1 1.13-1.897l8.932-8.931Z" /></svg> },
];

const inputCls = "w-full px-3.5 py-2.5 border border-slate-200 dark:border-[var(--border)] rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-[var(--accent)] bg-[var(--surface)] text-zinc-900 dark:text-zinc-100 placeholder:text-zinc-400 dark:placeholder:text-zinc-500";

export default function TrainClient({ botId, initialChunkCount }: { botId: string; initialChunkCount: number }) {
  const [tab, setTab] = useState<Tab>("url");
  const [url, setUrl] = useState("");
  const [text, setText] = useState("");
  const [file, setFile] = useState<File | null>(null);
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<TrainResult | null>(null);
  const [error, setError] = useState("");
  const [chunkCount, setChunkCount] = useState(initialChunkCount);

  async function handleTrain() {
    setLoading(true); setError(""); setResult(null);
    try {
      let res: Response;
      if (tab === "url") {
        if (!url.trim()) { setError("Please enter a URL"); setLoading(false); return; }
        res = await fetch(`/api/chatbots/${botId}/scrape`, { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ url }) });
      } else {
        const fd = new FormData();
        if (tab === "file" && file) { fd.append("file", file); fd.append("source", file.name); }
        else if (tab === "text") {
          if (!text.trim()) { setError("Please enter some text"); setLoading(false); return; }
          fd.append("text", text); fd.append("source", "manual text");
        }
        res = await fetch(`/api/chatbots/${botId}/train`, { method: "POST", body: fd });
      }
      const data = await res.json();
      if (!res.ok) { setError(data.error || "Training failed"); return; }
      setResult(data); setChunkCount(data.totalChunks); setUrl(""); setText(""); setFile(null);
    } catch { setError("Something went wrong."); }
    finally { setLoading(false); }
  }

  return (
    <div className="space-y-5">
      {/* Status card */}
      <div className="bg-[var(--surface)] rounded-2xl border border-slate-200 dark:border-[var(--border)] p-5 flex items-center gap-4 transition-colors">
        <div className="w-12 h-12 rounded-xl bg-[var(--accent)] flex items-center justify-center shadow-lg shadow-[var(--accent)]/15 dark:shadow-[var(--accent)]/30 shrink-0">
          <svg viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth={1.75} className="w-6 h-6">
            <path strokeLinecap="round" strokeLinejoin="round" d="M9.813 15.904 9 18.75l-.813-2.846a4.5 4.5 0 0 0-3.09-3.09L2.25 12l2.846-.813a4.5 4.5 0 0 0 3.09-3.09L9 5.25l.813 2.846a4.5 4.5 0 0 0 3.09 3.09L15.75 12l-2.846.813a4.5 4.5 0 0 0-3.09 3.09ZM18.259 8.715 18 9.75l-.259-1.035a3.375 3.375 0 0 0-2.455-2.456L14.25 6l1.036-.259a3.375 3.375 0 0 0 2.455-2.456L18 2.25l.259 1.035a3.375 3.375 0 0 0 2.456 2.456L21.75 6l-1.035.259a3.375 3.375 0 0 0-2.456 2.456Z" />
          </svg>
        </div>
        <div>
          <div className="font-bold text-slate-900 dark:text-slate-100">{chunkCount} knowledge chunks indexed</div>
          <div className="text-slate-500 dark:text-slate-400 text-sm mt-0.5">
            {chunkCount === 0 ? "Add your first source below" : "Add more sources to improve accuracy"}
          </div>
        </div>
      </div>

      {/* Training panel */}
      <div className="bg-[var(--surface)] rounded-2xl border border-slate-200 dark:border-[var(--border)] overflow-hidden transition-colors">
        {/* Tabs */}
        <div className="flex border-b border-slate-100 dark:border-[var(--border)] px-1 pt-1 gap-1">
          {TABS.map((t) => (
            <button key={t.key} onClick={() => { setTab(t.key); setError(""); setResult(null); }}
              className={`flex items-center gap-2 px-4 py-2.5 text-sm font-medium rounded-t-lg transition-all border-b-2 ${tab === t.key ? "bg-[var(--accent)]/10 dark:bg-[var(--accent)]/15 text-[var(--accent)] border-[var(--accent)]" : "text-slate-500 dark:text-slate-400 hover:text-slate-800 dark:hover:text-slate-200 hover:bg-slate-50 dark:hover:bg-slate-800 border-transparent"}`}>
              {t.icon}{t.label}
            </button>
          ))}
        </div>

        <div className="p-6">
          {tab === "url" && (
            <div>
              <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1.5">Website URL</label>
              <input type="url" value={url} onChange={(e) => setUrl(e.target.value)} className={inputCls} placeholder="https://yourwebsite.com/faq" />
              <p className="text-xs text-slate-400 dark:text-slate-500 mt-2">We&apos;ll scrape visible text from this page and add it to your knowledge base.</p>
            </div>
          )}

          {tab === "file" && (
            <div>
              <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1.5">Upload a file</label>
              <div
                className={`relative border-2 border-dashed rounded-2xl p-10 text-center transition-colors ${file ? "border-[var(--accent)]/40 dark:border-[var(--accent)]/60 bg-[var(--accent)]/10 dark:bg-[var(--accent)]/15" : "border-slate-200 dark:border-[var(--border)] hover:border-[var(--accent)]/60 dark:hover:border-[var(--accent)]/80"}`}
                onDragOver={(e) => e.preventDefault()}
                onDrop={(e) => { e.preventDefault(); const f = e.dataTransfer.files[0]; if (f) setFile(f); }}
              >
                {file ? (
                  <div>
                    <div className="w-12 h-12 rounded-xl bg-[var(--accent)] flex items-center justify-center mx-auto mb-3">
                      <svg viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth={1.75} className="w-6 h-6"><path strokeLinecap="round" strokeLinejoin="round" d="M19.5 14.25v-2.625a3.375 3.375 0 0 0-3.375-3.375h-1.5A1.125 1.125 0 0 1 13.5 7.125v-1.5a3.375 3.375 0 0 0-3.375-3.375H8.25m0 12.75h7.5m-7.5 3H12M10.5 2.25H5.625c-.621 0-1.125.504-1.125 1.125v17.25c0 .621.504 1.125 1.125 1.125h12.75c.621 0 1.125-.504 1.125-1.125V11.25a9 9 0 0 0-9-9Z" /></svg>
                    </div>
                    <div className="font-semibold text-slate-900 dark:text-slate-100 text-sm">{file.name}</div>
                    <div className="text-xs text-slate-400 mt-1">{(file.size / 1024).toFixed(1)} KB</div>
                    <button onClick={() => setFile(null)} className="text-xs text-red-500 mt-2 hover:underline font-medium">Remove</button>
                  </div>
                ) : (
                  <div>
                    <div className="w-12 h-12 rounded-xl bg-slate-100 dark:bg-[var(--surface)] flex items-center justify-center mx-auto mb-3">
                      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.5} className="w-6 h-6 text-slate-500 dark:text-slate-400"><path strokeLinecap="round" strokeLinejoin="round" d="M3 16.5v2.25A2.25 2.25 0 0 0 5.25 21h13.5A2.25 2.25 0 0 0 21 18.75V16.5m-13.5-9L12 3m0 0 4.5 4.5M12 3v13.5" /></svg>
                    </div>
                    <div className="text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">Drag & drop your file here</div>
                    <div className="text-xs text-slate-400 dark:text-slate-500">PDF, DOCX, TXT · Max 10MB</div>
                    <label className="mt-3 inline-block cursor-pointer">
                      <span className="text-sm text-[var(--accent)] dark:text-sky-400 font-semibold hover:opacity-90">Or browse to upload</span>
                      <input type="file" accept=".pdf,.docx,.doc,.txt" onChange={(e) => setFile(e.target.files?.[0] || null)} className="hidden" />
                    </label>
                  </div>
                )}
                {!file && <input type="file" accept=".pdf,.docx,.doc,.txt" onChange={(e) => setFile(e.target.files?.[0] || null)} className="absolute inset-0 opacity-0 cursor-pointer w-full h-full" />}
              </div>
            </div>
          )}

          {tab === "text" && (
            <div>
              <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1.5">Paste your content</label>
              <textarea value={text} onChange={(e) => setText(e.target.value)} rows={10}
                className={inputCls + " resize-none font-mono"} placeholder="Paste FAQ content, product descriptions, policies..." />
              <p className="text-xs text-slate-400 dark:text-slate-500 mt-1.5">{text.length} characters</p>
            </div>
          )}

          {error && (
            <div className="mt-4 flex items-center gap-2 bg-[var(--surface)] border border-zinc-200 dark:border-[var(--border)] text-red-600 dark:text-red-400 text-sm px-4 py-3 rounded-xl">
              <svg viewBox="0 0 24 24" fill="currentColor" className="w-4 h-4 shrink-0"><path fillRule="evenodd" d="M9.401 3.003c1.155-2 4.043-2 5.197 0l7.355 12.748c1.154 1.999-.29 4.5-2.599 4.5H4.645c-2.309 0-3.752-2.501-2.598-4.5L9.4 3.003ZM12 8.25a.75.75 0 0 1 .75.75v3.75a.75.75 0 0 1-1.5 0V9a.75.75 0 0 1 .75-.75Zm0 8.25a.75.75 0 1 0 0-1.5.75.75 0 0 0 0 1.5Z" clipRule="evenodd" /></svg>
              {error}
            </div>
          )}

          {result && (
            <div className="mt-4 flex items-center gap-3 bg-[var(--surface)] border border-zinc-200 dark:border-[var(--border)] rounded-xl px-4 py-3.5">
              <div className="w-8 h-8 rounded-full bg-emerald-600 flex items-center justify-center shrink-0">
                <svg viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth={2.5} className="w-4 h-4"><path strokeLinecap="round" strokeLinejoin="round" d="m4.5 12.75 6 6 9-13.5" /></svg>
              </div>
              <div>
                <div className="text-emerald-800 dark:text-emerald-300 font-semibold text-sm">Training complete!</div>
                <div className="text-emerald-700 dark:text-emerald-400 text-xs mt-0.5">Added {result.chunksAdded} chunks · {result.totalChunks} total</div>
              </div>
            </div>
          )}

          <button onClick={handleTrain} disabled={loading}
            className="btn-primary mt-5 w-full">
            {loading ? (
              <><svg className="animate-spin w-4 h-4" viewBox="0 0 24 24" fill="none"><circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" /><path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" /></svg>Processing...</>
            ) : tab === "url" ? "Scrape & train" : "Train on this content"}
          </button>
        </div>
      </div>

      <div className="flex items-start gap-3 bg-[var(--surface)] border border-zinc-200 dark:border-[var(--border)] rounded-2xl p-4">
        <svg viewBox="0 0 24 24" fill="currentColor" className="w-5 h-5 text-amber-500 dark:text-amber-400 shrink-0 mt-0.5">
          <path fillRule="evenodd" d="M9.401 3.003c1.155-2 4.043-2 5.197 0l7.355 12.748c1.154 1.999-.29 4.5-2.599 4.5H4.645c-2.309 0-3.752-2.501-2.598-4.5L9.4 3.003ZM12 8.25a.75.75 0 0 1 .75.75v3.75a.75.75 0 0 1-1.5 0V9a.75.75 0 0 1 .75-.75Zm0 8.25a.75.75 0 1 0 0-1.5.75.75 0 0 0 0 1.5Z" clipRule="evenodd" />
        </svg>
        <p className="text-sm text-amber-800 dark:text-amber-300">
          <strong>Tip:</strong> Add multiple sources for better coverage. The more your bot knows, the fewer escalations to human agents.
        </p>
      </div>
    </div>
  );
}
