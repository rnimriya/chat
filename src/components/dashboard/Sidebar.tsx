"use client";
import Link from "next/link";
import { usePathname } from "next/navigation";

const STATIC = new Set(["billing", "chatbots", "team", "api-keys", "account", "new"]);

function Icon({ d, size = 15 }: { d: string; size?: number }) {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.6}
      style={{ width: size, height: size, flexShrink: 0 }}>
      <path strokeLinecap="round" strokeLinejoin="round" d={d} />
    </svg>
  );
}

const P = {
  dashboard:    "M3.75 6A2.25 2.25 0 0 1 6 3.75h2.25A2.25 2.25 0 0 1 10.5 6v2.25a2.25 2.25 0 0 1-2.25 2.25H6a2.25 2.25 0 0 1-2.25-2.25V6ZM3.75 15.75A2.25 2.25 0 0 1 6 13.5h2.25a2.25 2.25 0 0 1 2.25 2.25V18a2.25 2.25 0 0 1-2.25 2.25H6A2.25 2.25 0 0 1 3.75 18v-2.25ZM13.5 6a2.25 2.25 0 0 1 2.25-2.25H18A2.25 2.25 0 0 1 20.25 6v2.25A2.25 2.25 0 0 1 18 10.5h-2.25a2.25 2.25 0 0 1-2.25-2.25V6ZM13.5 15.75a2.25 2.25 0 0 1 2.25-2.25H18a2.25 2.25 0 0 1 2.25 2.25V18A2.25 2.25 0 0 1 18 20.25h-2.25A2.25 2.25 0 0 1 13.5 18v-2.25Z",
  billing:      "M2.25 8.25h19.5M2.25 9h19.5m-16.5 5.25h6m-6 2.25h3m-3.75 3h15a2.25 2.25 0 0 0 2.25-2.25V6.75A2.25 2.25 0 0 0 19.5 4.5h-15a2.25 2.25 0 0 0-2.25 2.25v10.5A2.25 2.25 0 0 0 4.5 19.5Z",
  chatbots:     "M8.625 12a.375.375 0 1 1-.75 0 .375.375 0 0 1 .75 0Zm0 0H8.25m4.125 0a.375.375 0 1 1-.75 0 .375.375 0 0 1 .75 0Zm0 0H12m4.125 0a.375.375 0 1 1-.75 0 .375.375 0 0 1 .75 0Zm0 0h-.375M21 12c0 4.556-4.03 8.25-9 8.25a9.764 9.764 0 0 1-2.555-.337A5.972 5.972 0 0 1 5.41 20.97a5.969 5.969 0 0 1-.474-.065 4.48 4.48 0 0 0 .978-2.025c.09-.457-.133-.901-.467-1.226C3.93 16.178 3 14.189 3 12c0-4.556 4.03-8.25 9-8.25s9 3.694 9 8.25Z",
  team:         "M15 19.128a9.38 9.38 0 0 0 2.625.372 9.337 9.337 0 0 0 4.121-.952 4.125 4.125 0 0 0-7.533-2.493M15 19.128v-.003c0-1.113-.285-2.16-.786-3.07M15 19.128v.106A12.318 12.318 0 0 1 8.624 21c-2.331 0-4.512-.645-6.374-1.766l-.001-.109a6.375 6.375 0 0 1 11.964-3.07M12 6.375a3.375 3.375 0 1 1-6.75 0 3.375 3.375 0 0 1 6.75 0Zm8.25 2.25a2.625 2.625 0 1 1-5.25 0 2.625 2.625 0 0 1 5.25 0Z",
  apikeys:      "M15.75 5.25a3 3 0 0 1 3 3m3 0a6 6 0 0 1-7.029 5.912c-.563-.097-1.159.026-1.563.43L10.5 17.25H8.25v2.25H6v2.25H2.25v-2.818c0-.597.237-1.17.659-1.591l6.499-6.499c.404-.404.527-1 .43-1.563A6 6 0 0 1 21.75 8.25Z",
  account:      "M15.75 6a3.75 3.75 0 1 1-7.5 0 3.75 3.75 0 0 1 7.5 0ZM4.501 20.118a7.5 7.5 0 0 1 14.998 0A17.933 17.933 0 0 1 12 21.75c-2.676 0-5.216-.584-7.499-1.632Z",
  convos:       "M2.25 12.76c0 1.6 1.123 2.994 2.707 3.227 1.087.16 2.185.283 3.293.369V21l4.076-4.076a1.526 1.526 0 0 1 1.037-.443 48.282 48.282 0 0 0 5.68-.494c1.584-.233 2.707-1.626 2.707-3.228V6.741c0-1.602-1.123-2.995-2.707-3.228A48.394 48.394 0 0 0 12 3c-2.392 0-4.744.175-7.043.513C3.373 3.746 2.25 5.14 2.25 6.741v6.018Z",
  settings:     "M10.343 3.94c.09-.542.56-.94 1.11-.94h1.093c.55 0 1.02.398 1.11.94l.149.894c.07.424.384.764.78.93.398.164.855.142 1.205-.108l.737-.527a1.125 1.125 0 0 1 1.45.12l.773.774c.39.389.44 1.002.12 1.45l-.527.737c-.25.35-.272.806-.107 1.204.165.397.505.71.93.78l.893.15c.543.09.94.559.94 1.109v1.094c0 .55-.397 1.02-.94 1.11l-.894.149c-.424.07-.764.383-.929.78-.165.398-.143.854.107 1.204l.527.738c.32.447.269 1.06-.12 1.45l-.774.773a1.125 1.125 0 0 1-1.449.12l-.738-.527c-.35-.25-.806-.272-1.203-.107-.398.165-.71.505-.781.929l-.149.894c-.09.542-.56.94-1.11.94h-1.094c-.55 0-1.019-.398-1.11-.94l-.148-.894c-.071-.424-.384-.764-.781-.93-.398-.164-.854-.142-1.204.108l-.738.527c-.447.32-1.06.269-1.45-.12l-.773-.774a1.125 1.125 0 0 1-.12-1.45l.527-.737c.25-.35.273-.806.108-1.204-.165-.397-.506-.71-.93-.78l-.894-.15c-.542-.09-.94-.56-.94-1.109v-1.094c0-.55.398-1.02.94-1.11l.894-.149c.424-.07.765-.383.93-.78.165-.398.143-.854-.108-1.204l-.526-.738a1.125 1.125 0 0 1 .12-1.45l.773-.773a1.125 1.125 0 0 1 1.45-.12l.737.527c.35.25.807.272 1.204.107.397-.165.71-.505.78-.929l.15-.894Z M15 12a3 3 0 1 1-6 0 3 3 0 0 1 6 0Z",
  knowledge:    "M12 18v-5.25m0 0a6.01 6.01 0 0 0 1.5-.189m-1.5.189a6.01 6.01 0 0 1-1.5-.189m3.75 7.478a12.06 12.06 0 0 1-4.5 0m3.75 2.383a14.406 14.406 0 0 1-3 0M14.25 18v-.192c0-.983.658-1.823 1.508-2.316a7.5 7.5 0 1 0-7.517 0c.85.493 1.509 1.333 1.509 2.316V18",
  embed:        "M17.25 6.75 22.5 12l-5.25 5.25m-10.5 0L1.5 12l5.25-5.25m7.5-3-4.5 16.5",
  leads:        "M19 7.5v3m0 0v3m0-3h3m-3 0h-3m-2.25-4.125a3.375 3.375 0 1 1-6.75 0 3.375 3.375 0 0 1 6.75 0ZM4 19.235v-.11a6.375 6.375 0 0 1 12.75 0v.109A12.318 12.318 0 0 1 10.374 21c-2.331 0-4.512-.645-6.374-1.766Z",
  channels:     "M7.217 10.907a2.25 2.25 0 1 0 0 2.186m0-2.186c.18.324.283.696.283 1.093s-.103.77-.283 1.093m0-2.186 9.566-5.314m-9.566 7.5 9.566 5.314m0 0a2.25 2.25 0 1 0 3.935 2.186 2.25 2.25 0 0 0-3.935-2.186Zm0-12.814a2.25 2.25 0 1 0 3.933-2.185 2.25 2.25 0 0 0-3.933 2.185Z",
  integrations: "M14.25 6.087c0-.355.186-.676.401-.959.221-.29.349-.634.349-1.003 0-1.036-1.007-1.875-2.25-1.875s-2.25.84-2.25 1.875c0 .369.128.713.349 1.003.215.283.401.604.401.959v0a.64.64 0 0 1-.657.643 48.39 48.39 0 0 1-4.163-.3c.186 1.613.293 3.25.315 4.907a.656.656 0 0 1-.658.663v0c-.355 0-.676-.186-.959-.401a1.647 1.647 0 0 0-1.003-.349c-1.036 0-1.875 1.007-1.875 2.25s.84 2.25 1.875 2.25c.369 0 .713-.128 1.003-.349.283-.215.604-.401.959-.401v0c.31 0 .555.26.532.57a48.039 48.039 0 0 1-.642 5.056c1.518.19 3.058.309 4.616.354a.64.64 0 0 0 .657-.643v0c0-.355-.186-.676-.401-.959a1.647 1.647 0 0 1-.349-1.003c0-1.035 1.008-1.875 2.25-1.875 1.243 0 2.25.84 2.25 1.875 0 .369-.128.713-.349 1.003-.215.283-.4.604-.4.959v0c0 .333.277.599.61.58a48.1 48.1 0 0 0 5.427-.63 48.05 48.05 0 0 0 .582-4.717.532.532 0 0 0-.533-.57v0c-.355 0-.676.186-.959.401-.29.221-.634.349-1.003.349-1.035 0-1.875-1.007-1.875-2.25s.84-2.25 1.875-2.25c.37 0 .713.128 1.003.349.283.215.604.401.959.401v0a.656.656 0 0 0 .658-.663 48.422 48.422 0 0 0-.37-5.36c-1.886.342-3.81.574-5.766.689a.578.578 0 0 1-.61-.58v0Z",
  danger:       "M12 9v3.75m-9.303 3.376c-.866 1.5.217 3.374 1.948 3.374h14.71c1.73 0 2.813-1.874 1.948-3.374L13.949 3.378c-.866-1.5-3.032-1.5-3.898 0L2.697 16.126ZM12 15.75h.007v.008H12v-.008Z",
  chevD:        "m19.5 8.25-7.5 7.5-7.5-7.5",
  chevR:        "m8.25 4.5 7.5 7.5-7.5 7.5",
};

const menu = [
  { href: "/dashboard",          label: "Dashboard", exact: true, icon: P.dashboard },
  { href: "/dashboard/billing",  label: "Billing",               icon: P.billing },
  { href: "/dashboard/chatbots", label: "Chatbots",              icon: P.chatbots },
  { href: "/dashboard/team",     label: "Team",                  icon: P.team },
  { href: "/dashboard/api-keys", label: "API Keys",              icon: P.apikeys },
  { href: "/dashboard/account",  label: "Account",               icon: P.account },
];

const chatbot = [
  { key: "convos",       label: "Conversations", icon: P.convos,       sub: "",           dim: true },
  { key: "settings",     label: "Settings",      icon: P.settings,     sub: "",           dim: false, trail: "D" },
  { key: "knowledge",    label: "Knowledge",     icon: P.knowledge,    sub: "/train",     dim: false, trail: "R" },
  { key: "embed",        label: "Embed",         icon: P.embed,        sub: "",           dim: false },
  { key: "leads",        label: "Leads",         icon: P.leads,        sub: "/analytics", dim: false },
  { key: "channels",     label: "Channels",      icon: P.channels,     sub: "",           dim: true },
  { key: "integrations", label: "Integrations",  icon: P.integrations, sub: "",           dim: true },
  { key: "danger",       label: "Danger Zone",   icon: P.danger,       sub: "",           dim: false },
];

export default function Sidebar() {
  const pathname = usePathname();
  const segs = pathname.split("/").filter(Boolean);
  const botId = segs[1] && !STATIC.has(segs[1]) ? segs[1] : null;

  function isOn(href: string, exact = false) {
    return exact ? pathname === href : pathname.startsWith(href);
  }

  /* Clerk-style active: white text + very subtle bg; inactive: muted text */
  const navItem = (active: boolean) => ({
    display: "flex",
    alignItems: "center",
    gap: "8px",
    padding: "6px 10px",
    borderRadius: "6px",
    fontSize: "13px",
    fontWeight: active ? 500 : 400,
    textDecoration: "none",
    transition: "all 0.1s ease",
    color: active ? "var(--text-1)" : "var(--text-2)",
    background: active ? "var(--surface)" : "transparent",
  } as React.CSSProperties);

  const dimItem: React.CSSProperties = {
    display: "flex",
    alignItems: "center",
    gap: "8px",
    padding: "6px 10px",
    borderRadius: "6px",
    fontSize: "13px",
    fontWeight: 400,
    color: "var(--text-3)",
    userSelect: "none",
    opacity: 0.5,
  };

  const sectionLabel: React.CSSProperties = {
    fontSize: "10px",
    fontWeight: 600,
    letterSpacing: "0.08em",
    textTransform: "uppercase",
    color: "var(--text-3)",
    padding: "0 10px",
    marginBottom: "4px",
  };

  return (
    <aside style={{
      width: 220,
      flexShrink: 0,
      borderRight: "1px solid var(--border)",
      background: "var(--bg)",
      overflowY: "auto",
      display: "flex",
      flexDirection: "column",
    }}>
      <div style={{ padding: "16px 10px 32px", display: "flex", flexDirection: "column", gap: "24px" }}>

        {/* MENU */}
        <div>
          <p style={sectionLabel}>Menu</p>
          <nav style={{ display: "flex", flexDirection: "column", gap: "1px" }}>
            {menu.map((item) => (
              <Link key={item.href} href={item.href} style={navItem(isOn(item.href, item.exact))}>
                <Icon d={item.icon} />
                {item.label}
              </Link>
            ))}
          </nav>
        </div>

        {/* CHATBOT */}
        <div>
          <p style={sectionLabel}>Chatbot</p>
          <nav style={{ display: "flex", flexDirection: "column", gap: "1px" }}>
            {botId
              ? chatbot.map((item) => {
                  if (item.dim) return <div key={item.key} style={dimItem}><Icon d={item.icon} />{item.label}</div>;
                  const href = item.sub ? `/dashboard/${botId}${item.sub}` : `/dashboard/${botId}`;
                  const active = item.sub ? isOn(href) : pathname === href;
                  return (
                    <Link key={item.key} href={href} style={navItem(active)}>
                      <Icon d={item.icon} />
                      {item.label}
                      {item.trail === "D" && <Icon d={P.chevD} size={12} />}
                      {item.trail === "R" && <Icon d={P.chevR} size={12} />}
                    </Link>
                  );
                })
              : chatbot.map((item) => <div key={item.key} style={dimItem}><Icon d={item.icon} />{item.label}</div>)
            }
          </nav>
        </div>
      </div>
    </aside>
  );
}
