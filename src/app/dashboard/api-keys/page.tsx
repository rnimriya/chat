export default function ApiKeysPage() {
  return (
    <div className="px-8 py-8 max-w-4xl">
      <div className="flex items-start justify-between mb-8">
        <div>
          <h1 className="text-3xl font-extrabold text-slate-900 dark:text-white tracking-tight">
            API Keys
          </h1>
          <p className="text-slate-500 dark:text-slate-400 text-sm mt-1">
            Manage API keys for external integrations like WordPress, custom apps, and more.
          </p>
        </div>
        <button className="bg-slate-900 dark:bg-white text-white dark:text-slate-900 text-sm font-semibold px-4 py-2.5 rounded-xl hover:bg-slate-700 dark:hover:bg-slate-100 transition-colors flex items-center gap-1.5">
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2.5} className="w-4 h-4">
            <path strokeLinecap="round" strokeLinejoin="round" d="M12 4.5v15m7.5-7.5h-15" />
          </svg>
          New API Key
        </button>
      </div>

      <div className="border-2 border-dashed border-slate-200 dark:border-slate-800 rounded-2xl py-16 text-center transition-colors">
        <div className="w-12 h-12 rounded-2xl bg-slate-100 dark:bg-slate-800 flex items-center justify-center mx-auto mb-4">
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.5} className="w-6 h-6 text-slate-400 dark:text-slate-500">
            <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 5.25a3 3 0 0 1 3 3m3 0a6 6 0 0 1-7.029 5.912c-.563-.097-1.159.026-1.563.43L10.5 17.25H8.25v2.25H6v2.25H2.25v-2.818c0-.597.237-1.17.659-1.591l6.499-6.499c.404-.404.527-1 .43-1.563A6 6 0 0 1 21.75 8.25Z" />
          </svg>
        </div>
        <p className="text-slate-500 dark:text-slate-400 text-sm">No API keys yet. Create one to get started.</p>
      </div>
    </div>
  );
}
