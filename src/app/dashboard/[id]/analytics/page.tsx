import { getSession } from "@/lib/auth";
import { Chatbots, Messages, Leads, ContentGaps } from "@/lib/db";
import { notFound } from "next/navigation";
import { formatDate } from "@/lib/utils";

export default async function AnalyticsPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const session = await getSession();
  const bot = Chatbots.findById(id);
  if (!bot || bot.userId !== session!.userId) notFound();

  const messages = Messages.byChatbot(id);
  const leads = Leads.byChatbot(id);
  const gaps = ContentGaps.byChatbot(id).filter(g => !g.resolved).slice(-8); // Show unresolved gaps
  const sessions = [...new Set(messages.map((m) => m.sessionId))];
  const userMessages = messages.filter((m) => m.role === "user");

  // Calculate Sentiment Stats (Module 4 Feature A)
  const positive = messages.filter(m => m.sentiment === "positive").length;
  const neutral = messages.filter(m => m.sentiment === "neutral").length;
  const frustrated = messages.filter(m => m.sentiment === "frustrated").length;
  const totalSentiment = positive + neutral + frustrated || 1;

  const sentimentStats = [
    { label: "Positive 😊", count: positive, percentage: Math.round((positive / totalSentiment) * 100), color: "bg-emerald-500", text: "text-emerald-600 dark:text-emerald-400" },
    { label: "Neutral 😐", count: neutral, percentage: Math.round((neutral / totalSentiment) * 100), color: "bg-zinc-400", text: "text-zinc-500 dark:text-zinc-400" },
    { label: "Frustrated 😡", count: frustrated, percentage: Math.round((frustrated / totalSentiment) * 100), color: "bg-red-500", text: "text-red-500 dark:text-red-400" },
  ];

  const dailyCounts: Record<string, number> = {};
  userMessages.forEach((m) => { const day = m.timestamp.slice(0, 10); dailyCounts[day] = (dailyCounts[day] || 0) + 1; });
  const days = Object.keys(dailyCounts).sort().slice(-14);
  const maxCount = Math.max(...Object.values(dailyCounts), 1);

  const recentSessions = sessions.slice(-10).reverse().map((sid) => {
    const sessionMsgs = messages.filter((m) => m.sessionId === sid);
    return { sessionId: sid, messageCount: sessionMsgs.length, startedAt: sessionMsgs[0]?.timestamp, preview: sessionMsgs.find((m) => m.role === "user")?.content || "(no messages)" };
  });

  const stats = [
    { label: "Total messages", value: messages.length, bg: "bg-slate-50 dark:bg-[var(--surface)] border border-slate-200 dark:border-[var(--border)]", text: "text-slate-500 dark:text-slate-400", num: "text-slate-900 dark:text-slate-100 font-extrabold" },
    { label: "Unique sessions", value: sessions.length, bg: "bg-slate-50 dark:bg-[var(--surface)] border border-slate-200 dark:border-[var(--border)]", text: "text-slate-500 dark:text-slate-400", num: "text-slate-900 dark:text-slate-100 font-extrabold" },
    { label: "User questions", value: userMessages.length, bg: "bg-slate-50 dark:bg-[var(--surface)] border border-slate-200 dark:border-[var(--border)]", text: "text-slate-500 dark:text-slate-400", num: "text-slate-900 dark:text-slate-100 font-extrabold" },
    { label: "Leads captured", value: leads.length, bg: "bg-slate-50 dark:bg-[var(--surface)] border border-slate-200 dark:border-[var(--border)]", text: "text-slate-500 dark:text-slate-400", num: "text-slate-900 dark:text-slate-100 font-extrabold" },
  ];

  return (
    <div className="px-8 py-8 max-w-4xl space-y-6">
      <div>
        <h1 className="text-3xl font-extrabold text-slate-900 dark:text-white tracking-tight">{bot.name} <span className="text-[var(--accent)]">Analytics</span></h1>
        <p className="text-slate-500 dark:text-slate-400 text-sm mt-1">Overview of your chatbot&apos;s performance</p>
      </div>

      {/* Grid Stats */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
        {stats.map((s) => (
          <div key={s.label} className={`${s.bg} rounded-2xl p-5 transition-colors`}>
            <p className={`text-xs font-semibold ${s.text} mb-2`}>{s.label}</p>
            <p className={`text-3xl font-extrabold ${s.num} tracking-tight`}>{s.value}</p>
          </div>
        ))}
      </div>

      {/* Sentiment Analysis & Content Gap Reports (Module 4) */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
        {/* Sentiment breakdown */}
        <div className="bg-white dark:bg-[var(--surface)] border border-slate-200 dark:border-[var(--border)] rounded-2xl p-5 transition-colors">
          <h2 className="font-bold text-slate-900 dark:text-slate-100 text-sm mb-4">Customer Sentiment Distribution</h2>
          <div className="space-y-4">
            {sentimentStats.map((item) => (
              <div key={item.label} className="space-y-1.5">
                <div className="flex justify-between text-xs font-semibold">
                  <span className="text-slate-700 dark:text-slate-300">{item.label}</span>
                  <span className={item.text}>{item.percentage}% ({item.count})</span>
                </div>
                <div className="w-full h-2.5 bg-slate-100 dark:bg-zinc-800 rounded-full overflow-hidden">
                  <div className={`h-full ${item.color}`} style={{ width: `${item.percentage}%` }} />
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Content Gaps Analysis */}
        <div className="bg-white dark:bg-[var(--surface)] border border-slate-200 dark:border-[var(--border)] rounded-2xl p-5 transition-colors">
          <div className="flex items-center justify-between mb-4">
            <h2 className="font-bold text-slate-900 dark:text-slate-100 text-sm">Content Gaps (Unanswered)</h2>
            <a href={`/api/analytics/content-gaps?chatbotId=${bot.id}`} target="_blank" className="text-[10px] font-bold text-[var(--accent)] hover:underline uppercase tracking-wider">Run Cron Gap Report ⚙️</a>
          </div>
          {gaps.length === 0 ? (
            <p className="text-center py-8 text-slate-400 dark:text-slate-500 text-xs">No missing content gaps reported. Your AI knowledge base is fully optimized!</p>
          ) : (
            <div className="space-y-2 max-h-[190px] overflow-y-auto pr-1">
              {gaps.map((gap) => (
                <div key={gap.id} className="flex items-start justify-between gap-2 p-2.5 rounded-xl bg-[var(--surface)] border border-zinc-200 dark:border-[var(--border)]">
                  <div className="min-w-0">
                    <p className="text-xs text-slate-700 dark:text-slate-300 font-semibold truncate">“{gap.question}”</p>
                    <p className="text-[10px] text-zinc-400 mt-0.5">Frequency: {gap.count} times</p>
                  </div>
                  <span className="text-[9px] bg-slate-200 dark:bg-zinc-800 text-amber-700 dark:text-amber-400 font-bold px-2 py-0.5 rounded-md shrink-0">Missing Info</span>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      {days.length > 0 && (
        <div className="bg-white dark:bg-[var(--surface)] border border-slate-200 dark:border-[var(--border)] rounded-2xl p-6 transition-colors">
          <h2 className="font-bold text-slate-900 dark:text-slate-100 mb-5 text-sm">Messages per day <span className="text-slate-400 dark:text-slate-500 font-normal">(last 14 days)</span></h2>
          <div className="flex items-end gap-1.5 h-36">
            {days.map((day) => (
              <div key={day} className="flex-1 flex flex-col items-center gap-1.5">
                <div className="relative flex-1 w-full flex items-end">
                  <div className="w-full rounded-t-lg bg-[var(--accent)] hover:opacity-90 transition-colors" style={{ height: `${Math.max(6, ((dailyCounts[day] || 0) / maxCount) * 100)}%` }} title={`${dailyCounts[day] || 0} messages`} />
                </div>
                <span className="text-[10px] text-slate-400 font-medium">{day.slice(5)}</span>
              </div>
            ))}
          </div>
        </div>
      )}

      {leads.length > 0 && (
        <div className="bg-white dark:bg-[var(--surface)] border border-slate-200 dark:border-[var(--border)] rounded-2xl p-6 transition-colors">
          <h2 className="font-bold text-slate-900 dark:text-slate-100 mb-4 text-sm flex items-center gap-2">Captured leads <span className="text-xs font-semibold bg-emerald-100 dark:bg-emerald-900/30 text-emerald-700 dark:text-emerald-400 px-2 py-0.5 rounded-full">{leads.length}</span></h2>
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead><tr className="text-xs text-slate-400 dark:text-slate-500 border-b border-slate-100 dark:border-[var(--border)]">
                <th className="text-left pb-3 font-semibold pr-4">Name</th><th className="text-left pb-3 font-semibold pr-4">Email</th><th className="text-left pb-3 font-semibold pr-4">Phone</th><th className="text-left pb-3 font-semibold pr-4">Budget / Company</th><th className="text-left pb-3 font-semibold">Date</th>
              </tr></thead>
              <tbody className="divide-y divide-slate-50 dark:divide-[var(--border)]">
                {leads.slice().reverse().map((lead) => (
                  <tr key={lead.id} className="hover:bg-slate-50 dark:hover:bg-[var(--surface)] transition-colors">
                    <td className="py-3 pr-4 text-slate-800 dark:text-slate-200 font-medium">{lead.name || "—"}</td>
                    <td className="py-3 pr-4 text-slate-700 dark:text-slate-300">{lead.email || "—"}</td>
                    <td className="py-3 pr-4 text-slate-500 dark:text-slate-400">{lead.phone || "—"}</td>
                    <td className="py-3 pr-4 text-slate-500 dark:text-slate-400 text-xs">
                      {lead.budget ? (
                        <div>
                          <div className="font-bold">{lead.company || "Company N/A"}</div>
                          <div>{lead.budget}</div>
                        </div>
                      ) : "—"}
                    </td>
                    <td className="py-3 text-slate-400 dark:text-slate-500 text-xs">{formatDate(lead.capturedAt)}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      <div className="bg-white dark:bg-[var(--surface)] border border-slate-200 dark:border-[var(--border)] rounded-2xl p-6 transition-colors">
        <h2 className="font-bold text-slate-900 dark:text-slate-100 mb-4 text-sm">Recent sessions</h2>
        {recentSessions.length === 0 ? (
          <p className="text-center py-10 text-slate-400 dark:text-slate-500 text-sm">No sessions yet. Embed your bot to start collecting conversations.</p>
        ) : (
          <div className="space-y-2.5">
            {recentSessions.map((s) => (
              <div key={s.sessionId} className="flex items-start justify-between gap-3 p-3.5 rounded-xl bg-slate-50 dark:bg-[var(--surface)] hover:bg-slate-100 dark:hover:bg-[var(--border)] transition-colors">
                <div className="flex-1 min-w-0">
                  <p className="text-sm text-slate-700 dark:text-slate-300 font-medium truncate">{s.preview}</p>
                  <p className="text-xs text-slate-400 dark:text-slate-500 mt-0.5">{s.startedAt ? formatDate(s.startedAt) : "unknown"}</p>
                </div>
                <span className="text-xs bg-[var(--surface)] border border-slate-200 dark:border-[var(--border)] text-slate-500 dark:text-slate-400 px-2.5 py-1 rounded-full shrink-0 font-medium">{s.messageCount} msgs</span>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
