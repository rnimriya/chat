"use client";
import Link from "next/link";
import { useRouter, usePathname } from "next/navigation";

export default function DashboardNav() {
  const router = useRouter();
  const pathname = usePathname();

  async function handleLogout() {
    await fetch("/api/auth/logout", { method: "POST" });
    router.push("/");
  }

  return (
    <header className="bg-white border-b border-slate-100 sticky top-0 z-30">
      <div className="max-w-6xl mx-auto px-4 h-14 flex items-center justify-between gap-4">
        <Link href="/dashboard" className="flex items-center gap-2.5 shrink-0">
          <div
            className="w-7 h-7 rounded-lg flex items-center justify-center text-white font-bold text-xs"
            style={{ background: "linear-gradient(135deg, #6366f1, #8b5cf6)" }}
          >
            P
          </div>
          <span className="font-bold text-slate-900">PaperChat</span>
        </Link>

        {/* Breadcrumb / active section indicator */}
        {pathname !== "/dashboard" && (
          <div className="hidden sm:flex items-center gap-2 text-sm text-slate-500 min-w-0">
            <Link href="/dashboard" className="hover:text-slate-900 transition-colors shrink-0">Dashboard</Link>
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} className="w-4 h-4 shrink-0 text-slate-300">
              <path strokeLinecap="round" strokeLinejoin="round" d="m8.25 4.5 7.5 7.5-7.5 7.5" />
            </svg>
            <span className="text-slate-700 font-medium truncate">Chatbot</span>
          </div>
        )}

        <div className="flex items-center gap-2 ml-auto">
          <Link
            href="/dashboard/new"
            className="inline-flex items-center gap-1.5 bg-indigo-600 text-white text-sm font-medium px-3.5 py-1.5 rounded-lg hover:bg-indigo-700 transition-colors"
          >
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2.5} className="w-3.5 h-3.5">
              <path strokeLinecap="round" strokeLinejoin="round" d="M12 4.5v15m7.5-7.5h-15" />
            </svg>
            New chatbot
          </Link>
          <button
            onClick={handleLogout}
            className="flex items-center gap-1.5 text-slate-500 text-sm hover:text-slate-900 px-2.5 py-1.5 rounded-lg hover:bg-slate-100 transition-colors"
          >
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.75} className="w-4 h-4">
              <path strokeLinecap="round" strokeLinejoin="round" d="M8.25 9V5.25A2.25 2.25 0 0 1 10.5 3h6a2.25 2.25 0 0 1 2.25 2.25v13.5A2.25 2.25 0 0 1 16.5 21h-6a2.25 2.25 0 0 1-2.25-2.25V15m-3 0-3-3m0 0 3-3m-3 3H15" />
            </svg>
            <span className="hidden sm:inline">Log out</span>
          </button>
        </div>
      </div>
    </header>
  );
}
