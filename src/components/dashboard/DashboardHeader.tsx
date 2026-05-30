"use client";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useTheme } from "@/components/ThemeProvider";

interface Props { userInitials: string; userName: string }

export default function DashboardHeader({ userInitials, userName }: Props) {
  const router = useRouter();
  const { theme, toggle } = useTheme();

  async function handleLogout() {
    await fetch("/api/auth/logout", { method: "POST" });
    router.push("/");
  }

  const headerStyle: React.CSSProperties = {
    height: 48,
    display: "flex",
    alignItems: "center",
    flexShrink: 0,
    background: "var(--bg)",
    borderBottom: "1px solid var(--border)",
  };

  const logoZone: React.CSSProperties = {
    width: 220,
    flexShrink: 0,
    display: "flex",
    alignItems: "center",
    justifyContent: "space-between",
    padding: "0 14px",
    height: "100%",
    borderRight: "1px solid var(--border)",
  };

  const iconBtn: React.CSSProperties = {
    width: 28,
    height: 28,
    borderRadius: 6,
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    cursor: "pointer",
    background: "transparent",
    border: "none",
    color: "var(--text-2)",
    transition: "background 0.1s, color 0.1s",
  };

  return (
    <header style={headerStyle}>
      {/* Logo zone */}
      <div style={logoZone}>
        <Link href="/dashboard" style={{ display: "flex", alignItems: "center", gap: 8, textDecoration: "none" }}>
          <div style={{
            width: 24, height: 24, borderRadius: 5,
            background: "linear-gradient(135deg, #0ea5e9, #38bdf8)",
            display: "flex", alignItems: "center", justifyContent: "center",
          }}>
            <svg viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth={2.25} style={{ width: 13, height: 13 }}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M8.625 12a.375.375 0 1 1-.75 0 .375.375 0 0 1 .75 0Zm0 0H8.25m4.125 0a.375.375 0 1 1-.75 0 .375.375 0 0 1 .75 0Zm0 0H12m4.125 0a.375.375 0 1 1-.75 0 .375.375 0 0 1 .75 0Zm0 0h-.375M21 12c0 4.556-4.03 8.25-9 8.25a9.764 9.764 0 0 1-2.555-.337A5.972 5.972 0 0 1 5.41 20.97a5.969 5.969 0 0 1-.474-.065 4.48 4.48 0 0 0 .978-2.025c.09-.457-.133-.901-.467-1.226C3.93 16.178 3 14.189 3 12c0-4.556 4.03-8.25 9-8.25s9 3.694 9 8.25Z" />
            </svg>
          </div>
          <span style={{ fontWeight: 600, fontSize: 14, color: "var(--text-1)", letterSpacing: "-0.01em" }}>
            PaperChat
          </span>
        </Link>

        <button
          style={iconBtn}
          onMouseEnter={e => (e.currentTarget.style.background = "var(--surface)")}
          onMouseLeave={e => (e.currentTarget.style.background = "transparent")}
        >
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.75} style={{ width: 15, height: 15 }}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M3.75 6.75h16.5M3.75 12H12m-8.25 5.25h16.5" />
          </svg>
        </button>
      </div>

      {/* Main header */}
      <div style={{ flex: 1, display: "flex", alignItems: "center", justifyContent: "space-between", padding: "0 18px" }}>
        <Link href="/dashboard/new" style={{
          display: "flex", alignItems: "center", gap: 6,
          fontSize: 13, fontWeight: 500, color: "var(--text-2)",
          textDecoration: "none", transition: "color 0.1s",
        }}
          onMouseEnter={e => (e.currentTarget.style.color = "var(--text-1)")}
          onMouseLeave={e => (e.currentTarget.style.color = "var(--text-2)")}
        >
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.75} style={{ width: 15, height: 15 }}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M8.625 12a.375.375 0 1 1-.75 0 .375.375 0 0 1 .75 0Zm0 0H8.25m4.125 0a.375.375 0 1 1-.75 0 .375.375 0 0 1 .75 0Zm0 0H12m4.125 0a.375.375 0 1 1-.75 0 .375.375 0 0 1 .75 0Zm0 0h-.375M21 12c0 4.556-4.03 8.25-9 8.25a9.764 9.764 0 0 1-2.555-.337A5.972 5.972 0 0 1 5.41 20.97a5.969 5.969 0 0 1-.474-.065 4.48 4.48 0 0 0 .978-2.025c.09-.457-.133-.901-.467-1.226C3.93 16.178 3 14.189 3 12c0-4.556 4.03-8.25 9-8.25s9 3.694 9 8.25Z" />
          </svg>
          New chatbot
          <span style={{ color: "var(--text-3)" }}>+</span>
        </Link>

        <div style={{ display: "flex", alignItems: "center", gap: 6 }}>
          {/* Theme toggle */}
          <button onClick={toggle} title={theme === "dark" ? "Light mode" : "Dark mode"}
            style={iconBtn}
            onMouseEnter={e => (e.currentTarget.style.background = "var(--surface)")}
            onMouseLeave={e => (e.currentTarget.style.background = "transparent")}
          >
            {theme === "dark"
              ? <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.75} style={{ width: 15, height: 15 }}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M12 3v2.25m6.364.386-1.591 1.591M21 12h-2.25m-.386 6.364-1.591-1.591M12 18.75V21m-4.773-4.227-1.591 1.591M5.25 12H3m4.227-4.773L5.636 5.636M15.75 12a3.75 3.75 0 1 1-7.5 0 3.75 3.75 0 0 1 7.5 0Z" />
                </svg>
              : <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.75} style={{ width: 15, height: 15 }}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M21.752 15.002A9.72 9.72 0 0 1 18 15.75c-5.385 0-9.75-4.365-9.75-9.75 0-1.33.266-2.597.748-3.752A9.753 9.753 0 0 0 3 11.25C3 16.635 7.365 21 12.75 21a9.753 9.753 0 0 0 9.002-5.998Z" />
                </svg>
            }
          </button>

          {/* Avatar */}
          <button onClick={handleLogout} title={`${userName} · Log out`}
            style={{
              width: 30, height: 30,
              borderRadius: "50%",
              background: "linear-gradient(135deg, #0ea5e9, #0284c7)",
              display: "flex", alignItems: "center", justifyContent: "center",
              color: "white", fontSize: 11, fontWeight: 700,
              cursor: "pointer", border: "none",
              transition: "opacity 0.1s",
            }}
            onMouseEnter={e => (e.currentTarget.style.opacity = "0.8")}
            onMouseLeave={e => (e.currentTarget.style.opacity = "1")}
          >
            {userInitials}
          </button>
        </div>
      </div>
    </header>
  );
}
