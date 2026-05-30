import { getSession } from "@/lib/auth";
import { Users } from "@/lib/db";
import { redirect } from "next/navigation";
import Sidebar from "@/components/dashboard/Sidebar";
import DashboardHeader from "@/components/dashboard/DashboardHeader";

export default async function DashboardLayout({ children }: { children: React.ReactNode }) {
  const session = await getSession();
  if (!session) redirect("/login");

  const user = Users.findById(session.userId);
  const userName = user?.name || session.email || "User";
  const initials = userName.split(" ").map((w: string) => w[0]).join("").slice(0, 2).toUpperCase();

  return (
    <div style={{ display: "flex", flexDirection: "column", height: "100vh", overflow: "hidden", background: "var(--bg)" }}>
      <DashboardHeader userInitials={initials} userName={userName} />
      <div style={{ display: "flex", flex: 1, minHeight: 0 }}>
        <Sidebar />
        <main style={{ flex: 1, overflowY: "auto", background: "var(--bg)" }}>
          {children}
        </main>
      </div>
    </div>
  );
}
