"use client";
import { useState } from "react";

interface Props { name: string; email: string }

export default function AccountClient({ name, email }: Props) {
  const [displayName, setDisplayName] = useState(name);
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);
  const [deleting, setDeleting] = useState(false);

  async function handleSave() {
    setSaving(true);
    await fetch("/api/account", {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ name: displayName }),
    });
    setSaving(false);
    setSaved(true);
    setTimeout(() => setSaved(false), 2000);
  }

  const inputCls = "w-full px-3.5 py-2.5 border border-slate-200 dark:border-[var(--border)] rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-[var(--accent)] bg-white dark:bg-[var(--surface)] text-slate-900 dark:text-slate-100 placeholder:text-slate-400 dark:placeholder:text-slate-500";

  return (
    <div className="space-y-10">
      {/* Name */}
      <div className="flex flex-col sm:flex-row sm:items-start gap-6">
        <div className="sm:w-64 shrink-0">
          <h2 className="font-bold text-slate-900 dark:text-slate-100">Your Name</h2>
          <p className="text-slate-500 dark:text-slate-400 text-sm mt-1">Please enter a display name you are comfortable with.</p>
        </div>
        <div className="flex-1 flex items-center gap-3">
          <div className="flex-1">
            <input
              type="text"
              value={displayName}
              maxLength={32}
              onChange={(e) => { setDisplayName(e.target.value); setSaved(false); }}
              style={{ color: undefined, backgroundColor: undefined, WebkitTextFillColor: undefined }}
              className={inputCls}
            />
            <p className="text-xs text-slate-400 dark:text-slate-500 mt-1">Max 32 characters</p>
          </div>
          <button
            onClick={handleSave}
            disabled={saving}
            className={`px-4 py-2.5 rounded-xl text-sm font-medium transition-all shrink-0 ${
              saved ? "text-emerald-600 dark:text-emerald-400 hover:bg-emerald-50 dark:hover:bg-emerald-900/20" : "text-slate-500 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800"
            }`}
          >
            {saving ? "Saving..." : saved ? "Saved ✓" : "Save Changes"}
          </button>
        </div>
      </div>

      <div className="border-t border-slate-100 dark:border-[var(--border)]" />

      {/* Email */}
      <div className="flex flex-col sm:flex-row sm:items-start gap-6">
        <div className="sm:w-64 shrink-0">
          <h2 className="font-bold text-slate-900 dark:text-slate-100">Email Address</h2>
          <p className="text-slate-500 dark:text-slate-400 text-sm mt-1">Your account email address.</p>
        </div>
        <div className="flex-1">
          <input
            type="email"
            value={email}
            readOnly
            style={{ color: undefined, backgroundColor: undefined, WebkitTextFillColor: undefined }}
            className="w-full px-3.5 py-2.5 border border-slate-200 dark:border-[var(--border)] rounded-xl text-sm cursor-not-allowed bg-slate-50 dark:bg-[var(--surface)]/55 text-slate-500 dark:text-slate-400"
          />
        </div>
      </div>

      <div className="border-t border-slate-100 dark:border-[var(--border)]" />

      {/* Delete */}
      <div className="flex flex-col sm:flex-row sm:items-start gap-6">
        <div className="sm:w-64 shrink-0">
          <h2 className="font-bold text-slate-900 dark:text-slate-100">Delete Account</h2>
          <p className="text-slate-500 dark:text-slate-400 text-sm mt-1">This is a danger zone — Be careful!</p>
        </div>
        <div className="flex-1">
          <div className="border-2 border-red-200 dark:border-red-900/50 bg-white dark:bg-[var(--surface)] rounded-2xl p-5">
            <div className="flex items-center gap-3 mb-3">
              <p className="font-semibold text-slate-900 dark:text-slate-100">Are you sure?</p>
              <span className="inline-flex items-center gap-1.5 text-xs font-semibold bg-red-100 dark:bg-red-900/30 text-red-600 dark:text-red-400 px-2.5 py-1 rounded-full">
                <svg viewBox="0 0 24 24" fill="currentColor" className="w-3 h-3">
                  <path fillRule="evenodd" d="M2.25 12c0-5.385 4.365-9.75 9.75-9.75s9.75 4.365 9.75 9.75-4.365 9.75-9.75 9.75S2.25 17.385 2.25 12Zm8.706-1.442c.31-.31.769-.437 1.202-.337l.303.075.303-.076c.433-.1.892.027 1.202.337l.166.167c.31.31.437.769.337 1.202l-.075.303.076.303c.1.433-.027.892-.337 1.202l-.167.166c-.31.31-.769.437-1.202.337l-.303-.075-.303.076c-.433.1-.892-.027-1.202-.337l-.166-.167a1.125 1.125 0 0 1-.337-1.202l.075-.303-.076-.303a1.125 1.125 0 0 1 .337-1.202l.167-.166Z" clipRule="evenodd" />
                </svg>
                Active Subscription
              </span>
            </div>
            <p className="text-sm text-slate-600 dark:text-slate-400 mb-4 leading-relaxed">
              Permanently delete your PaperChat account and your subscription.<br />
              This action cannot be undone — please proceed with caution.
            </p>
            <button
              onClick={() => setDeleting(true)}
              disabled={deleting}
              className="flex items-center gap-2 bg-red-600 text-white font-semibold px-4 py-2.5 rounded-xl hover:bg-red-700 transition-colors text-sm disabled:opacity-60"
            >
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.75} className="w-4 h-4">
                <path strokeLinecap="round" strokeLinejoin="round" d="m14.74 9-.346 9m-4.788 0L9.26 9m9.968-3.21c.342.052.682.107 1.022.166m-1.022-.165L18.16 19.673a2.25 2.25 0 0 1-2.244 2.077H8.084a2.25 2.25 0 0 1-2.244-2.077L4.772 5.79m14.456 0a48.108 48.108 0 0 0-3.478-.397m-12 .562c.34-.059.68-.114 1.022-.165m0 0a48.11 48.11 0 0 1 3.478-.397m7.5 0v-.916c0-1.18-.91-2.164-2.09-2.201a51.964 51.964 0 0 0-3.32 0c-1.18.037-2.09 1.022-2.09 2.201v.916m7.5 0a48.667 48.667 0 0 0-7.5 0" />
              </svg>
              {deleting ? "Deleting..." : "Delete Account"}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
