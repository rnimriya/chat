import { getSession } from "@/lib/auth";
import { Users } from "@/lib/db";
import AccountClient from "@/components/dashboard/AccountClient";

export default async function AccountPage() {
  const session = await getSession();
  const user = Users.findById(session!.userId);

  return (
    <div className="px-8 py-8 max-w-4xl">
      <div className="flex items-start justify-between mb-10">
        <div>
          <h1 className="text-3xl font-extrabold text-slate-900 tracking-tight leading-tight">
            Account <span className="text-sky-500">Settings</span>
          </h1>
          <p className="text-slate-500 text-sm mt-1">Manage account and website settings.</p>
        </div>
        <a href="/dashboard/api-keys" className="px-4 py-2 border border-slate-200 rounded-xl text-sm font-medium text-slate-700 hover:bg-slate-50 transition-colors">
          API Keys
        </a>
      </div>

      <AccountClient name={user?.name || ""} email={user?.email || session!.email} />
    </div>
  );
}
