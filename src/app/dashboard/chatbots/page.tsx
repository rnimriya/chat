import { getSession } from "@/lib/auth";
import { Chatbots } from "@/lib/db";
import { getChunkCount } from "@/lib/vectorStore";
import Link from "next/link";

export default async function ChatbotsPage() {
  const session = await getSession();
  const bots = Chatbots.byUser(session!.userId).map((b) => ({ ...b, chunkCount: getChunkCount(b.id) }));

  return (
    <div className="px-8 py-8">
      <div className="flex items-start justify-between mb-8">
        <div>
          <h1 className="text-3xl font-extrabold text-zinc-900 dark:text-zinc-100 tracking-tight">
            My <span className="text-sky-500 dark:text-sky-400">Chatbots</span>
          </h1>
          <p className="text-zinc-500 dark:text-zinc-400 text-sm mt-1">
            {bots.length === 0 ? "No chatbots yet" : `${bots.length} chatbot${bots.length !== 1 ? "s" : ""} · ${bots.filter((b) => b.chunkCount > 0).length} trained`}
          </p>
        </div>
        <Link href="/dashboard/new" className="btn-primary !py-2 !px-4 !text-xs !rounded-lg flex items-center gap-1.5">
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2.5} className="w-4 h-4"><path strokeLinecap="round" strokeLinejoin="round" d="M12 4.5v15m7.5-7.5h-15" /></svg>
          New chatbot
        </Link>
      </div>

      {bots.length === 0 ? (
        <div className="text-center py-24 border-2 border-dashed border-zinc-200 dark:border-zinc-800 rounded-2xl">
          <div className="w-16 h-16 rounded-2xl bg-sky-100 dark:bg-sky-900/30 flex items-center justify-center mx-auto mb-5">
            <svg viewBox="0 0 24 24" fill="none" stroke="#7c3aed" strokeWidth={1.5} className="w-8 h-8"><path strokeLinecap="round" strokeLinejoin="round" d="M8.625 12a.375.375 0 1 1-.75 0 .375.375 0 0 1 .75 0Zm0 0H8.25m4.125 0a.375.375 0 1 1-.75 0 .375.375 0 0 1 .75 0Zm0 0H12m4.125 0a.375.375 0 1 1-.75 0 .375.375 0 0 1 .75 0Zm0 0h-.375M21 12c0 4.556-4.03 8.25-9 8.25a9.764 9.764 0 0 1-2.555-.337A5.972 5.972 0 0 1 5.41 20.97a5.969 5.969 0 0 1-.474-.065 4.48 4.48 0 0 0 .978-2.025c.09-.457-.133-.901-.467-1.226C3.93 16.178 3 14.189 3 12c0-4.556 4.03-8.25 9-8.25s9 3.694 9 8.25Z" /></svg>
          </div>
          <h2 className="text-xl font-bold text-zinc-900 dark:text-zinc-100 mb-2">No chatbots yet</h2>
          <p className="text-zinc-500 dark:text-zinc-400 mb-6 text-sm max-w-xs mx-auto">Create your first chatbot and train it on your website or documents.</p>
          <Link href="/dashboard/new" className="btn-primary">Create your first chatbot</Link>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
          {bots.map((bot) => (
            <div key={bot.id} className="bg-white dark:bg-zinc-900 rounded-2xl border border-zinc-200 dark:border-zinc-800 overflow-hidden hover:shadow-md hover:-translate-y-0.5 transition-all duration-200">
              <div className="h-1.5" style={{ backgroundColor: bot.color }} />
              <div className="p-5">
                <div className="flex items-start justify-between mb-4">
                  <div className="flex items-center gap-3">
                    <div className="w-11 h-11 rounded-xl flex items-center justify-center text-white font-bold text-base" style={{ backgroundColor: bot.color }}>
                      {bot.name.charAt(0).toUpperCase()}
                    </div>
                    <div>
                      <h3 className="font-bold text-zinc-900 dark:text-zinc-100">{bot.name}</h3>
                      <p className="text-xs text-zinc-400 dark:text-zinc-500 mt-0.5">{bot.chunkCount} knowledge chunks</p>
                    </div>
                  </div>
                  <span className={`inline-flex items-center gap-1.5 text-xs font-semibold px-2.5 py-1 rounded-full ${bot.chunkCount > 0 ? "bg-emerald-50 dark:bg-emerald-900/30 text-emerald-700 dark:text-emerald-400" : "bg-amber-50 dark:bg-amber-900/30 text-amber-700 dark:text-amber-400"}`}>
                    <span className={`w-1.5 h-1.5 rounded-full ${bot.chunkCount > 0 ? "bg-emerald-500" : "bg-amber-500"}`} />
                    {bot.chunkCount > 0 ? "Trained" : "Not trained"}
                  </span>
                </div>
                {bot.description && <p className="text-zinc-500 dark:text-zinc-400 text-sm mb-4 line-clamp-2">{bot.description}</p>}
                <div className="grid grid-cols-3 gap-1.5 pt-4 border-t border-slate-100 dark:border-zinc-800">
                  {[{ href: `/dashboard/${bot.id}`, label: "Settings" }, { href: `/dashboard/${bot.id}/train`, label: "Train" }, { href: `/dashboard/${bot.id}/analytics`, label: "Analytics" }].map((a) => (
                    <Link key={a.label} href={a.href} className="text-center text-xs font-medium text-zinc-600 dark:text-zinc-400 bg-slate-50 dark:bg-zinc-800 hover:bg-zinc-100 dark:hover:bg-zinc-700 py-2 rounded-lg transition-colors">{a.label}</Link>
                  ))}
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
