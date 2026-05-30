import { getSession } from "@/lib/auth";
import { Users, Chatbots, Messages } from "@/lib/db";
import BillingToggle from "@/components/dashboard/BillingToggle";

export default async function BillingPage() {
  const session = await getSession();
  const user = Users.findById(session!.userId);
  const bots = Chatbots.byUser(session!.userId);
  const allMessages = bots.flatMap((b) => Messages.byChatbot(b.id));
  const creditsUsed = allMessages.filter((m) => m.role === "assistant").length;
  const creditsTotal = 100;
  const creditsRemaining = Math.max(0, creditsTotal - creditsUsed);
  const creditsPct = Math.round((creditsRemaining / creditsTotal) * 100);

  return (
    <div className="px-8 py-8 max-w-5xl">
      <div className="mb-8">
        <h1 className="text-3xl font-extrabold text-slate-900 dark:text-slate-100 tracking-tight">
          Billing &amp; <span className="text-sky-500 dark:text-sky-400">Subscription</span>
        </h1>
        <p className="text-slate-500 dark:text-slate-400 text-sm mt-1">Manage your subscription plan and billing information.</p>
      </div>

      {/* Current plan */}
      <div className="border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 rounded-2xl p-6 flex items-center justify-between mb-6 transition-colors">
        <div>
          <p className="text-xs text-slate-500 dark:text-slate-400 font-medium mb-1">Current Plan</p>
          <p className="text-3xl font-extrabold text-sky-500 dark:text-sky-400 capitalize">{user?.plan || "Free"}</p>
        </div>
        <button className="bg-slate-900 dark:bg-white text-white dark:text-slate-900 font-semibold px-5 py-2.5 rounded-xl hover:bg-slate-700 dark:hover:bg-slate-100 transition-colors text-sm">
          Upgrade Plan
        </button>
      </div>

      {/* Usage */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-10">
        <div className="border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 rounded-2xl p-6 transition-colors">
          <div className="flex items-center gap-3 mb-4">
            <div className="w-9 h-9 rounded-xl bg-slate-100 dark:bg-slate-800 flex items-center justify-center">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.75} className="w-5 h-5 text-slate-600 dark:text-slate-400">
                <path strokeLinecap="round" strokeLinejoin="round" d="M3.75 13.5l10.5-11.25L12 10.5h8.25L9.75 21.75 12 13.5H3.75z" />
              </svg>
            </div>
            <div>
              <p className="font-semibold text-slate-900 dark:text-slate-100 text-sm">Credits</p>
              <p className="text-xs text-slate-400 dark:text-slate-500">Monthly usage</p>
            </div>
          </div>
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs text-slate-500 dark:text-slate-400">Remaining</span>
            <span className="font-bold text-slate-900 dark:text-slate-100 text-sm">{creditsRemaining} / {creditsTotal}</span>
          </div>
          <div className="w-full h-2 bg-slate-100 dark:bg-slate-800 rounded-full overflow-hidden mb-2">
            <div className="h-full bg-slate-900 dark:bg-slate-300 rounded-full" style={{ width: `${creditsPct}%` }} />
          </div>
          <p className="text-xs text-slate-400 dark:text-slate-500">Credits reset monthly on your renewal date</p>
        </div>

        <div className="border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 rounded-2xl p-6 transition-colors">
          <div className="flex items-center gap-3 mb-4">
            <div className="w-9 h-9 rounded-xl bg-slate-100 dark:bg-slate-800 flex items-center justify-center">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.75} className="w-5 h-5 text-slate-600 dark:text-slate-400">
                <path strokeLinecap="round" strokeLinejoin="round" d="M20.25 6.375c0 2.278-3.694 4.125-8.25 4.125S3.75 8.653 3.75 6.375m16.5 0c0-2.278-3.694-4.125-8.25-4.125S3.75 4.097 3.75 6.375m16.5 0v11.25c0 2.278-3.694 4.125-8.25 4.125s-8.25-1.847-8.25-4.125V6.375m16.5 5.625c0 2.278-3.694 4.125-8.25 4.125s-8.25-1.847-8.25-4.125" />
              </svg>
            </div>
            <div>
              <p className="font-semibold text-slate-900 dark:text-slate-100 text-sm">Storage</p>
              <p className="text-xs text-slate-400 dark:text-slate-500">Knowledge base size</p>
            </div>
          </div>
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs text-slate-500 dark:text-slate-400">Used</span>
            <span className="font-bold text-slate-900 dark:text-slate-100 text-sm">0 Bytes / 800 KB</span>
          </div>
          <div className="w-full h-2 bg-slate-100 dark:bg-slate-800 rounded-full overflow-hidden mb-2">
            <div className="h-full bg-emerald-500 rounded-full" style={{ width: "0%" }} />
          </div>
          <p className="text-xs text-slate-400 dark:text-slate-500">Total storage across all your chatbot knowledge bases</p>
        </div>
      </div>

      <div className="mb-6">
        <h2 className="text-2xl font-extrabold text-slate-900 dark:text-slate-100 tracking-tight mb-1">Upgrade Your Plan</h2>
        <p className="text-slate-500 dark:text-slate-400 text-sm">Choose the plan that best fits your needs</p>
      </div>

      <BillingToggle />
    </div>
  );
}
