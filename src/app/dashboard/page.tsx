import { getSession } from "@/lib/auth";
import { Chatbots, Messages } from "@/lib/db";
import Link from "next/link";
import ConversationsChart from "@/components/dashboard/ConversationsChart";

const FREE_LIMITS = { credits: 100, chatbots: 1, storageKb: 800 };

export default async function DashboardPage() {
  const session = await getSession();
  const bots = Chatbots.byUser(session!.userId);
  const allMessages = bots.flatMap((b) => Messages.byChatbot(b.id));
  const sessions = new Set(allMessages.map((m) => m.sessionId)).size;

  const now = new Date();
  const days: { date: string; value: number }[] = [];
  for (let i = 29; i >= 0; i--) {
    const d = new Date(now);
    d.setDate(d.getDate() - i);
    const key = d.toISOString().slice(0, 10);
    const count = new Set(
      allMessages.filter((m) => m.role === "user" && m.timestamp.startsWith(key)).map((m) => m.sessionId)
    ).size;
    days.push({ date: key, value: count });
  }

  const creditsUsed = allMessages.filter((m) => m.role === "assistant").length;
  const creditsRemaining = Math.max(0, FREE_LIMITS.credits - creditsUsed);

  const stats = [
    {
      label: "Credits",
      value: String(creditsRemaining),
      sub: "Available for chatbot responses",
      light: "bg-slate-50 border border-slate-200",
      dark: "dark:bg-[var(--surface)] dark:border-[var(--border)]",
      textColor: "text-slate-500 dark:text-slate-400",
      numColor: "text-slate-900 dark:text-slate-100",
    },
    {
      label: "Chatbots",
      value: `${bots.length} / ${FREE_LIMITS.chatbots}`,
      sub: `${Math.round((bots.length / FREE_LIMITS.chatbots) * 100)}% of total capacity used`,
      light: "bg-slate-50 border border-slate-200",
      dark: "dark:bg-[var(--surface)] dark:border-[var(--border)]",
      textColor: "text-slate-500 dark:text-slate-400",
      numColor: "text-slate-900 dark:text-slate-100",
      progress: bots.length / FREE_LIMITS.chatbots,
      progressColor: "bg-zinc-400 dark:bg-zinc-600",
    },
    {
      label: "Storage",
      value: "0 KB / 800 KB",
      sub: "0% of storage capacity used",
      light: "bg-slate-50 border border-slate-200",
      dark: "dark:bg-[var(--surface)] dark:border-[var(--border)]",
      textColor: "text-slate-500 dark:text-slate-400",
      numColor: "text-slate-900 dark:text-slate-100",
      progress: 0,
      progressColor: "bg-zinc-400 dark:bg-zinc-600",
    },
    {
      label: "Conversations",
      value: String(sessions),
      sub: "Total customer conversations",
      light: "bg-slate-50 border border-slate-200",
      dark: "dark:bg-[var(--surface)] dark:border-[var(--border)]",
      textColor: "text-slate-500 dark:text-slate-400",
      numColor: "text-slate-900 dark:text-slate-100",
    },
  ];

  const botList = bots.map((b) => ({ id: b.id, name: b.name }));

  return (
    <div className="px-8 py-8">
      <div className="flex items-start justify-between mb-8">
        <div>
          <h1 className="text-3xl font-extrabold text-slate-900 dark:text-white tracking-tight">Dashboard</h1>
          <p className="text-slate-500 dark:text-slate-400 text-sm mt-1">Welcome back! Here&apos;s an overview of your chatbot performance.</p>
        </div>
        <Link href="/dashboard/chatbots" className="btn-secondary !py-2 !px-4 !text-xs !rounded-lg">
          Manage Chatbots
        </Link>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
        {stats.map((s) => (
          <div key={s.label} className={`${s.light} ${s.dark} rounded-2xl p-5 transition-colors`}>
            <p className={`text-sm font-semibold ${s.textColor} mb-2`}>{s.label}</p>
            <p className={`text-3xl font-extrabold ${s.numColor} tracking-tight leading-none mb-2`}>{s.value}</p>
            <p className={`text-xs ${s.textColor} opacity-80`}>{s.sub}</p>
          </div>
        ))}
      </div>

      <ConversationsChart data={days} bots={botList} />
    </div>
  );
}
