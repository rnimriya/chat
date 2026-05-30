"use client";
import { useState } from "react";
import { Chatbot } from "@/lib/db";

const COLOR_OPTIONS = [
  "#6366f1", "#8b5cf6", "#ec4899", "#f59e0b",
  "#10b981", "#3b82f6", "#ef4444", "#06b6d4",
];

function Toggle({ checked, onChange }: { checked: boolean; onChange: (v: boolean) => void }) {
  return (
    <button
      type="button" role="switch" aria-checked={checked} onClick={() => onChange(!checked)}
      className={`relative inline-flex h-6 w-11 flex-shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none focus-visible:ring-2 focus-visible:ring-[var(--accent)] focus-visible:ring-offset-2 ${checked ? "bg-[var(--accent)]" : "bg-slate-200 dark:bg-zinc-700"}`}
    >
      <span className={`pointer-events-none inline-block h-5 w-5 transform rounded-full bg-white shadow-sm ring-0 transition duration-200 ease-in-out ${checked ? "translate-x-5" : "translate-x-0"}`} />
    </button>
  );
}

const card = "bg-white dark:bg-[var(--surface)] rounded-2xl border border-zinc-200 dark:border-[var(--border)] p-6 space-y-5 transition-colors";
const inputCls = "w-full px-3.5 py-2.5 border border-zinc-200 dark:border-[var(--border)] rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-[var(--accent)] bg-white dark:bg-[var(--surface)] text-zinc-900 dark:text-zinc-100 placeholder:text-zinc-400 dark:placeholder:text-zinc-500";
const labelCls = "block text-sm font-medium text-zinc-700 dark:text-slate-300 mb-1.5";
const sectionTitle = "font-bold text-zinc-900 dark:text-zinc-100 flex items-center gap-2";

export default function ChatbotSettingsClient({ bot }: { bot: Chatbot & { chunkCount: number } }) {
  const [form, setForm] = useState({
    name: bot.name, description: bot.description, color: bot.color,
    welcomeMessage: bot.welcomeMessage, systemPrompt: bot.systemPrompt,
    collectLeads: bot.collectLeads, humanHandover: bot.humanHandover,
    humanHandoverEmail: bot.humanHandoverEmail,
  });
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);
  const [deleting, setDeleting] = useState(false);
  const [embedCopied, setEmbedCopied] = useState(false);

  function set(key: string, value: string | boolean) { setForm((f) => ({ ...f, [key]: value })); setSaved(false); }

  async function handleSave() {
    setSaving(true);
    await fetch(`/api/chatbots/${bot.id}`, { method: "PATCH", headers: { "Content-Type": "application/json" }, body: JSON.stringify(form) });
    setSaving(false); setSaved(true); setTimeout(() => setSaved(false), 2500);
  }

  async function handleDelete() {
    if (!confirm(`Delete "${bot.name}"? This cannot be undone.`)) return;
    setDeleting(true);
    await fetch(`/api/chatbots/${bot.id}`, { method: "DELETE" });
    window.location.href = "/dashboard";
  }

  const embedScript = `<script src="${typeof window !== "undefined" ? window.location.origin : ""}/widget.js" data-chatbot-id="${bot.id}"></script>`;
  function copyEmbed() { navigator.clipboard.writeText(embedScript); setEmbedCopied(true); setTimeout(() => setEmbedCopied(false), 2500); }

  return (
    <div className="space-y-5">
      {/* Header card */}
      <div className="flex items-center justify-between bg-white dark:bg-[var(--surface)] border border-zinc-200 dark:border-[var(--border)] p-5 transition-colors">
        <div className="flex items-center gap-3">
          <div className="w-12 h-12 rounded-xl flex items-center justify-center text-white font-bold text-lg shadow-sm" style={{ backgroundColor: form.color }}>
            {form.name.charAt(0).toUpperCase() || "?"}
          </div>
          <div>
            <div className="font-bold text-zinc-900 dark:text-zinc-100">{form.name || "Untitled bot"}</div>
            <div className="text-xs text-zinc-500 dark:text-zinc-400 mt-0.5 flex items-center gap-1.5">
              <span className={`w-1.5 h-1.5 rounded-full ${bot.chunkCount > 0 ? "bg-emerald-500" : "bg-amber-500"}`} />
              {bot.chunkCount > 0 ? `${bot.chunkCount} chunks · Trained` : "Not trained yet"}
            </div>
          </div>
        </div>
        <button onClick={handleSave} disabled={saving}
          className={`inline-flex items-center gap-2 font-semibold px-4 py-2 rounded-xl text-sm transition-all ${saved ? "bg-emerald-600 text-white" : "bg-[var(--accent)] text-white hover:opacity-90"} disabled:opacity-60`}>
          {saving ? <><svg className="animate-spin w-4 h-4" viewBox="0 0 24 24" fill="none"><circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" /><path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" /></svg>Saving...</>
          : saved ? <><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2.5} className="w-4 h-4"><path strokeLinecap="round" strokeLinejoin="round" d="m4.5 12.75 6 6 9-13.5" /></svg>Saved</>
          : "Save changes"}
        </button>
      </div>

      {/* Basic info */}
      <div className={card}>
        <h2 className={sectionTitle}>Basic info</h2>
        <div><label className={labelCls}>Name</label>
          <input type="text" value={form.name} onChange={(e) => set("name", e.target.value)} className={inputCls} />
        </div>
        <div><label className={labelCls}>Description</label>
          <input type="text" value={form.description} onChange={(e) => set("description", e.target.value)} className={inputCls} placeholder="What does this bot help with?" />
        </div>
        <div>
          <label className={labelCls.replace("mb-1.5", "mb-2.5")}>Brand color</label>
          <div className="flex gap-2.5 flex-wrap">
            {COLOR_OPTIONS.map((c) => (
              <button key={c} type="button" onClick={() => set("color", c)}
                className={`w-9 h-9 rounded-full transition-all duration-150 ${form.color === c ? "scale-125 ring-2 ring-offset-2 ring-slate-400 shadow-md" : "hover:scale-110"}`}
                style={{ backgroundColor: c }} />
            ))}
          </div>
        </div>
      </div>

      {/* Behaviour */}
      <div className={card}>
        <h2 className={sectionTitle}>Behaviour</h2>
        <div><label className={labelCls}>Welcome message</label>
          <input type="text" value={form.welcomeMessage} onChange={(e) => set("welcomeMessage", e.target.value)} className={inputCls} />
        </div>
        <div>
          <label className={labelCls}>System prompt</label>
          <textarea value={form.systemPrompt} onChange={(e) => set("systemPrompt", e.target.value)} rows={4}
            className={inputCls + " resize-none"} />
          <p className="text-xs text-zinc-400 dark:text-zinc-500 mt-1.5">Instructions for how the bot should behave.</p>
        </div>
      </div>

      {/* Features */}
      <div className={card.replace("space-y-5", "space-y-4")}>
        <h2 className={sectionTitle}>Features</h2>
        <div className="flex items-center justify-between py-1">
          <div><div className="text-sm font-medium text-slate-800 dark:text-slate-200">Lead capture</div>
            <div className="text-xs text-zinc-500 dark:text-zinc-400 mt-0.5">Ask visitors for name, email &amp; phone</div></div>
          <Toggle checked={form.collectLeads} onChange={(v) => set("collectLeads", v)} />
        </div>
        <div className="border-t border-slate-100 dark:border-zinc-800" />
        <div className="flex items-center justify-between py-1">
          <div><div className="text-sm font-medium text-slate-800 dark:text-slate-200">Human handover</div>
            <div className="text-xs text-zinc-500 dark:text-zinc-400 mt-0.5">Email alert when bot can&apos;t answer</div></div>
          <Toggle checked={form.humanHandover} onChange={(v) => set("humanHandover", v)} />
        </div>
        {form.humanHandover && (
          <div><label className={labelCls}>Handover email</label>
            <input type="email" value={form.humanHandoverEmail} onChange={(e) => set("humanHandoverEmail", e.target.value)}
              className={inputCls} placeholder="support@yourcompany.com" /></div>
        )}
      </div>

      {/* Embed */}
      <div className={card}>
        <h2 className={sectionTitle}>Embed on your website</h2>
        <p className="text-sm text-zinc-500 dark:text-zinc-400">Copy this snippet and paste it before the closing <code className="bg-zinc-100 dark:bg-zinc-800 text-zinc-700 dark:text-slate-300 px-1.5 py-0.5 rounded text-xs font-mono">&lt;/body&gt;</code> tag.</p>
        <div className="bg-zinc-950 rounded-xl p-4 flex items-start gap-3">
          <code className="text-green-400 text-xs flex-1 break-all font-mono leading-relaxed">{embedScript}</code>
          <button onClick={copyEmbed} className={`text-xs whitespace-nowrap shrink-0 px-3 py-1.5 rounded-lg font-medium transition-all ${embedCopied ? "bg-emerald-600 text-white" : "bg-white/10 text-slate-300 hover:bg-white/20"}`}>
            {embedCopied ? "Copied!" : "Copy"}
          </button>
        </div>
        <a href={`/chat/${bot.id}`} target="_blank" className="inline-flex items-center gap-1.5 text-sm text-[var(--accent)] hover:opacity-90 font-semibold transition-colors">
          Preview chat page <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} className="w-3.5 h-3.5"><path strokeLinecap="round" strokeLinejoin="round" d="M13.5 6H5.25A2.25 2.25 0 0 0 3 8.25v10.5A2.25 2.25 0 0 0 5.25 21h10.5A2.25 2.25 0 0 0 18 18.75V10.5m-10.5 6L21 3m0 0h-5.25M21 3v5.25" /></svg>
        </a>
      </div>

      {/* Danger zone */}
      <div className="bg-white dark:bg-[var(--surface)] rounded-2xl border border-red-200 dark:border-red-900/50 p-6 transition-colors">
        <h2 className="font-bold text-red-600 dark:text-red-400 mb-1.5">Danger zone</h2>
        <p className="text-sm text-zinc-500 dark:text-zinc-400 mb-4">Permanently removes all training data and chat history.</p>
        <button onClick={handleDelete} disabled={deleting}
          className="inline-flex items-center gap-2 bg-red-50 dark:bg-red-900/20 text-red-600 dark:text-red-400 border border-red-200 dark:border-red-800 font-medium px-4 py-2 rounded-xl hover:bg-red-100 dark:hover:bg-red-900/30 text-sm transition-colors disabled:opacity-60">
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.75} className="w-4 h-4"><path strokeLinecap="round" strokeLinejoin="round" d="m14.74 9-.346 9m-4.788 0L9.26 9m9.968-3.21c.342.052.682.107 1.022.166m-1.022-.165L18.16 19.673a2.25 2.25 0 0 1-2.244 2.077H8.084a2.25 2.25 0 0 1-2.244-2.077L4.772 5.79m14.456 0a48.108 48.108 0 0 0-3.478-.397m-12 .562c.34-.059.68-.114 1.022-.165m0 0a48.11 48.11 0 0 1 3.478-.397m7.5 0v-.916c0-1.18-.91-2.164-2.09-2.201a51.964 51.964 0 0 0-3.32 0c-1.18.037-2.09 1.022-2.09 2.201v.916m7.5 0a48.667 48.667 0 0 0-7.5 0" /></svg>
          {deleting ? "Deleting..." : "Delete chatbot"}
        </button>
      </div>
    </div>
  );
}
