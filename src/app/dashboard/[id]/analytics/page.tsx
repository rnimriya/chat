import { getSession } from "@/lib/auth";
import { Chatbots, Messages, Leads } from "@/lib/db";
import { notFound } from "next/navigation";
import { formatDate } from "@/lib/utils";

export default async function AnalyticsPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const session = await getSession();
  const bot = Chatbots.findById(id);
  if (!bot || bot.userId !== session!.userId) notFound();

  const messages = Messages.byChatbot(id);
  const leads = Leads.byChatbot(id);
  const sessions = [...new Set(messages.map((m) => m.sessionId))];
  const userMessages = messages.filter((m) => m.role === "user");

  const dailyCounts: Record<string, number> = {};
  userMessages.forEach((m) => { const day = m.timestamp.slice(0, 10); dailyCounts[day] = (dailyCounts[day] || 0) + 1; });
  const days = Object.keys(dailyCounts).sort().slice(-14);
  const maxCount = Math.max(...Object.values(dailyCounts), 1);

  const recentSessions = sessions.slice(-10).reverse().map((sid) => {
    const sessionMsgs = messages.filter((m) => m.sessionId === sid);
    return { sessionId: sid, messageCount: sessionMsgs.length, startedAt: sessionMsgs[0]?.timestamp, preview: sessionMsgs.find((m) => m.role === "user")?.content || "(no messages)" };
  });

  const stats = [
    { label: "Total messages", value: messages.length, bg: "bg-sky-50 dark:bg-indigo-900/20", text: "text-sky-500 dark:text-sky-400", num: "text-sky-600 dark:text-indigo-300" },
    { label: "Unique sessions", value: sessions.length, bg: "bg-sky-50 dark:bg-sky-900/20", text: "text-sky-500 dark:text-sky-400", num: "text-sky-600 dark:text-sky-300" },
    { label: "User questions", value: userMessages.length, bg: "bg-blue-50 dark:bg-blue-900/20", text: "text-blue-600 dark:text-blue-400", num: "text-blue-700 dark:text-blue-300" },
    { label: "Leads captured", value: leads.length, bg: "bg-emerald-50 dark:bg-emerald-900/20", text: "text-emerald-600 dark:text-emerald-400", num: "text-emerald-700 dark:text-emerald-300" },
  ];

  return (
    <div className="px-8 py-8 max-w-4xl">
      <div className="mb-7">
        <h1 className="text-3xl font-extrabold text-slate-900 dark:text-slate-100 tracking-tight">{bot.name} <span className="text-sky-500 dark:text-sky-400">Analytics</span></h1>
        <p className="text-slate-500 dark:text-slate-400 text-sm mt-1">Overview of your chatbot&apos;s performance</p>
      </div>

      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mb-7">
        {stats.map((s) => (
          <div key={s.label} className={`${s.bg} rounded-2xl p-5 transition-colors`}>
            <p className={`text-xs font-semibold ${s.text} mb-2`}>{s.label}</p>
            <p className={`text-3xl font-extrabold ${s.num} tracking-tight`}>{s.value}</p>
          </div>
        ))}
      </div>

      {days.length > 0 && (
        <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-6 mb-6 transition-colors">
          <h2 className="font-bold text-slate-900 dark:text-slate-100 mb-5 text-sm">Messages per day <span className="text-slate-400 dark:text-slate-500 font-normal">(last 14 days)</span></h2>
          <div className="flex items-end gap-1.5 h-36">
            {days.map((day) => (
              <div key={day} className="flex-1 flex flex-col items-center gap-1.5">
                <div className="relative flex-1 w-full flex items-end">
                  <div className="w-full rounded-t-lg bg-sky-400 hover:bg-sky-500 transition-colors" style={{ height: `${Math.max(6, ((dailyCounts[day] || 0) / maxCount) * 100)}%` }} title={`${dailyCounts[day] || 0} messages`} />
                </div>
                <span className="text-[10px] text-slate-400 font-medium">{day.slice(5)}</span>
              </div>
            ))}
          </div>
        </div>
      )}

      {leads.length > 0 && (
        <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-6 mb-6 transition-colors">
          <h2 className="font-bold text-slate-900 dark:text-slate-100 mb-4 text-sm flex items-center gap-2">Captured leads <span className="text-xs font-semibold bg-emerald-100 dark:bg-emerald-900/30 text-emerald-700 dark:text-emerald-400 px-2 py-0.5 rounded-full">{leads.length}</span></h2>
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead><tr className="text-xs text-slate-400 dark:text-slate-500 border-b border-slate-100 dark:border-slate-800">
                <th className="text-left pb-3 font-semibold pr-4">Name</th><th className="text-left pb-3 font-semibold pr-4">Email</th><th className="text-left pb-3 font-semibold pr-4">Phone</th><th className="text-left pb-3 font-semibold">Date</th>
              </tr></thead>
              <tbody className="divide-y divide-slate-50 dark:divide-slate-800">
                {leads.slice().reverse().map((lead) => (
                  <tr key={lead.id} className="hover:bg-slate-50 dark:hover:bg-slate-800 transition-colors">
                    <td className="py-3 pr-4 text-slate-800 dark:text-slate-200 font-medium">{lead.name || "—"}</td>
                    <td className="py-3 pr-4 text-slate-700 dark:text-slate-300">{lead.email || "—"}</td>
                    <td className="py-3 pr-4 text-slate-500 dark:text-slate-400">{lead.phone || "—"}</td>
                    <td className="py-3 text-slate-400 dark:text-slate-500 text-xs">{formatDate(lead.capturedAt)}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-6 transition-colors">
        <h2 className="font-bold text-slate-900 dark:text-slate-100 mb-4 text-sm">Recent sessions</h2>
        {recentSessions.length === 0 ? (
          <p className="text-center py-10 text-slate-400 dark:text-slate-500 text-sm">No sessions yet. Embed your bot to start collecting conversations.</p>
        ) : (
          <div className="space-y-2.5">
            {recentSessions.map((s) => (
              <div key={s.sessionId} className="flex items-start justify-between gap-3 p-3.5 rounded-xl bg-slate-50 dark:bg-slate-800 hover:bg-slate-100 dark:hover:bg-slate-700 transition-colors">
                <div className="flex-1 min-w-0">
                  <p className="text-sm text-slate-700 dark:text-slate-300 font-medium truncate">{s.preview}</p>
                  <p className="text-xs text-slate-400 dark:text-slate-500 mt-0.5">{s.startedAt ? formatDate(s.startedAt) : "unknown"}</p>
                </div>
                <span className="text-xs bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 text-slate-500 dark:text-slate-400 px-2.5 py-1 rounded-full shrink-0 font-medium">{s.messageCount} msgs</span>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
