import { getSession } from "@/lib/auth";
import { Users } from "@/lib/db";
import { formatDate } from "@/lib/utils";

export default async function TeamPage() {
  const session = await getSession();
  const user = Users.findById(session!.userId);
  const initials = (user?.name || session!.email)
    .split(" ").map((w: string) => w[0]).join("").slice(0, 2).toUpperCase();

  return (
    <div className="px-8 py-8 max-w-4xl">
      <div className="flex items-start justify-between mb-8">
        <div>
          <h1 className="text-3xl font-extrabold text-slate-900 dark:text-white tracking-tight">
            Team Management
          </h1>
          <p className="text-slate-500 dark:text-slate-400 text-sm mt-1">Manage your team members and their roles</p>
        </div>
        <button className="bg-slate-900 dark:bg-white text-white dark:text-slate-900 text-sm font-semibold px-4 py-2.5 rounded-xl hover:bg-slate-700 dark:hover:bg-slate-100 transition-colors flex items-center gap-1.5">
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2.5} className="w-4 h-4">
            <path strokeLinecap="round" strokeLinejoin="round" d="M12 4.5v15m7.5-7.5h-15" />
          </svg>
          Add Team Member
        </button>
      </div>

      <div className="mb-5 text-sm">
        <span className="text-slate-700 dark:text-slate-300 font-medium">1 / 1 member. </span>
        <span className="text-orange-500 dark:text-orange-400 font-medium">
          Limit reached.{" "}
          <a href="/dashboard/billing" className="underline">Upgrade</a>{" "}
          to add more.
        </span>
      </div>

      <div className="border border-slate-200 dark:border-slate-800 bg-[var(--surface)] rounded-2xl overflow-hidden transition-colors">
        <div className="flex items-center gap-4 p-5">
          <div className="w-11 h-11 rounded-full bg-slate-800 dark:bg-slate-600 flex items-center justify-center text-white font-bold text-sm shrink-0">
            {initials}
          </div>
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-2.5 flex-wrap">
              <span className="font-semibold text-slate-900 dark:text-white text-sm">{user?.name || "User"}</span>
              <span className="inline-flex items-center gap-1 text-xs font-semibold text-amber-600 dark:text-amber-400 bg-slate-100 dark:bg-zinc-800 px-2 py-0.5 rounded-full">
                <svg viewBox="0 0 24 24" fill="currentColor" className="w-3 h-3">
                  <path fillRule="evenodd" d="M10.788 3.21c.448-1.077 1.976-1.077 2.424 0l2.082 5.006 5.404.434c1.164.093 1.636 1.545.749 2.305l-4.117 3.527 1.257 5.273c.271 1.136-.964 2.033-1.96 1.425L12 18.354 7.373 21.18c-.996.608-2.231-.29-1.96-1.425l1.257-5.273-4.117-3.527c-.887-.76-.415-2.212.749-2.305l5.404-.434 2.082-5.005Z" clipRule="evenodd" />
                </svg>
                Owner
              </span>
              <span className="inline-flex items-center gap-1 text-xs font-semibold text-emerald-700 dark:text-emerald-400 bg-slate-100 dark:bg-zinc-800 px-2 py-0.5 rounded-full">
                Active
              </span>
            </div>
            <div className="flex items-center gap-1.5 mt-1">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.75} className="w-3.5 h-3.5 text-slate-400 shrink-0">
                <path strokeLinecap="round" strokeLinejoin="round" d="M21.75 6.75v10.5a2.25 2.25 0 0 1-2.25 2.25h-15a2.25 2.25 0 0 1-2.25-2.25V6.75m19.5 0A2.25 2.25 0 0 0 19.5 4.5h-15a2.25 2.25 0 0 0-2.25 2.25m19.5 0v.243a2.25 2.25 0 0 1-1.07 1.916l-7.5 4.615a2.25 2.25 0 0 1-2.36 0L3.32 8.91a2.25 2.25 0 0 1-1.07-1.916V6.75" />
              </svg>
              <span className="text-xs text-slate-500 dark:text-slate-400">{user?.email || session!.email}</span>
            </div>
          </div>
          <div className="text-right shrink-0">
            <p className="text-xs text-slate-400 dark:text-slate-500">Joined</p>
            <p className="text-sm font-medium text-slate-700 dark:text-slate-300">
              {user?.createdAt ? formatDate(user.createdAt) : "Today"}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
