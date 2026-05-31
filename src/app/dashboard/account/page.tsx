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
          <h1 className="text-3xl font-extrabold text-slate-900 dark:text-white tracking-tight leading-tight">
            Account Settings
          </h1>
          <p className="text-slate-500 text-sm mt-1">Manage account and website settings.</p>
        </div>
        <a href="/dashboard/api-keys" className="btn-secondary !py-2 !px-4 !text-xs !rounded-lg">
          API Keys
        </a>
      </div>

      <AccountClient name={user?.name || ""} email={user?.email || session!.email} />
    </div>
  );
}
