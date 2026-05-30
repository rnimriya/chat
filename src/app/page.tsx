"use client";
import Link from "next/link";
import { useState } from "react";
import FaqAccordion from "@/components/FaqAccordion";
import BillingToggle from "@/components/dashboard/BillingToggle";
import { useTheme } from "@/components/ThemeProvider";

/* ── Trusted SaaS Logos ─── */
const logos = [
  { name: "WooCommerce", jsx: <span className="font-extrabold text-[#7f54b3] text-sm dark:text-purple-300">woo<span className="font-light opacity-70">commerce</span></span> },
  { name: "Shopify",     jsx: <span className="font-bold text-[#5a8a3c] text-sm dark:text-emerald-400">Shopify</span> },
  { name: "Zapier",      jsx: <span className="font-bold text-[#ff4a00] text-sm italic dark:text-orange-400">zapier</span> },
  { name: "n8n",         jsx: <span className="font-extrabold text-[#ea4b71] text-base dark:text-rose-400">n8n</span> },
  { name: "Make",        jsx: <span className="font-bold text-[#6d00cc] text-sm dark:text-violet-400">make</span> },
  { name: "Salesforce",  jsx: <span className="font-bold text-[#00a1e0] text-sm dark:text-sky-400">salesforce</span> },
  { name: "HubSpot",     jsx: <span className="font-bold text-[#ff7a59] text-sm dark:text-orange-300">HubSpot</span> },
];

/* ── Interactive Framework Integration Stack ─── */
const frameworks = [
  {
    name: "Next.js",
    icon: (
      <svg viewBox="0 0 180 180" className="w-5 h-5 fill-current">
        <mask id="next-mask"><circle cx="90" cy="90" r="90" fill="white" /></mask>
        <g mask="url(#next-mask)">
          <circle cx="90" cy="90" r="90" />
          <path d="M149.5 157.5L69.1 54H54v72h12V69.4l74 95.4c3.3-2.2 6.5-4.6 9.5-7.3z" fill="white" />
          <rect fill="white" height="72" width="12" x="115" y="54" />
        </g>
      </svg>
    ),
    code: `<!-- Next.js Custom Embed (in your Root Layout / Document) -->
import Script from "next/script";

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body>
        {children}
        <Script
          src="https://paperchat.ai/widget.js"
          data-chatbot-id="your-chatbot-id"
          strategy="lazyOnload"
        />
      </body>
    </html>
  );
}`
  },
  {
    name: "React",
    icon: (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} className="w-5 h-5">
        <circle cx="12" cy="12" r="2" />
        <path d="M12 2C6.5 2 2 6.5 2 12s4.5 10 10 10 10-4.5 10-10S17.5 2 12 2zm0 18c-4.4 0-8-3.6-8-8s3.6-8 8-8 8 3.6 8 8-3.6 8-8 8z" />
        <ellipse cx="12" cy="12" rx="10" ry="4.5" transform="rotate(30 12 12)" />
        <ellipse cx="12" cy="12" rx="10" ry="4.5" transform="rotate(90 12 12)" />
        <ellipse cx="12" cy="12" rx="10" ry="4.5" transform="rotate(150 12 12)" />
      </svg>
    ),
    code: `// React Widget Hook integration
import { useEffect } from "react";

export default function PaperChatWidget() {
  useEffect(() => {
    const script = document.createElement("script");
    script.src = "https://paperchat.ai/widget.js";
    script.async = true;
    script.setAttribute("data-chatbot-id", "your-chatbot-id");
    document.body.appendChild(script);

    return () => {
      document.body.removeChild(script);
    };
  }, []);

  return null;
}`
  },
  {
    name: "HTML / JS",
    icon: (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} className="w-5 h-5">
        <path strokeLinecap="round" strokeLinejoin="round" d="M17.25 6.75L22.5 12l-5.25 5.25m-10.5 0L1.5 12l5.25-5.25m7.5-3l-4.5 16.5" />
      </svg>
    ),
    code: `<!-- Static HTML Embed. Paste right before your </body> tag -->
<script
  src="https://paperchat.ai/widget.js"
  data-chatbot-id="your-chatbot-id"
  async>
</script>`
  },
  {
    name: "Shopify",
    icon: (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} className="w-5 h-5">
        <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 10.5V6a3.75 3.75 0 1 0-7.5 0v4.5m11.356-1.993 1.263 12c.07.665-.45 1.243-1.119 1.243H4.25a1.125 1.125 0 0 1-1.12-1.243l1.264-12A1.125 1.125 0 0 1 5.513 7.5h12.974c.576 0 1.059.435 1.119 1.007ZM8.625 10.5a.375.375 0 1 1-.75 0 .375.375 0 0 1 .75 0Zm7.5 0a.375.375 0 1 1-.75 0 .375.375 0 0 1 .75 0Z" />
      </svg>
    ),
    code: `<!-- Shopify Theme Embed Instructions -->
1. Navigate to: Online Store > Themes
2. Under your active theme, click Actions > Edit Code
3. Open "layout/theme.liquid"
4. Scroll to the bottom and paste the script before </body>:
<script
  src="https://paperchat.ai/widget.js"
  data-chatbot-id="your-chatbot-id"
  async>
</script>`
  },
  {
    name: "WordPress",
    icon: (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} className="w-5 h-5">
        <path strokeLinecap="round" strokeLinejoin="round" d="M16.862 4.487l1.687-1.688a1.875 1.875 0 1 1 2.652 2.652L10.582 16.07a4.5 4.5 0 0 1-1.897 1.13L6 18l.8-2.685a4.5 4.5 0 0 1 1.13-1.897l8.932-8.931Z" />
      </svg>
    ),
    code: `<!-- WordPress Embed Instructions -->
1. Install and activate "Insert Headers and Footers" plugin.
2. Go to Settings > Insert Headers and Footers.
3. Paste the following script in the "Scripts in Footer" field:
<script
  src="https://paperchat.ai/widget.js"
  data-chatbot-id="your-chatbot-id"
  async>
</script>
4. Click Save.`
  },
  {
    name: "Webflow",
    icon: (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} className="w-5 h-5">
        <path strokeLinecap="round" strokeLinejoin="round" d="M9 17.25v1.007a3 3 0 0 1-.879 2.122L7.5 21h9l-.621-.621A3 3 0 0 1 15 18.257V17.25m6-12V15a2.25 2.25 0 0 1-2.25 2.25H5.25A2.25 2.25 0 0 1 3 15V5.25m18 0A2.25 2.25 0 0 0 18.75 3H5.25A2.25 2.25 0 0 0 3 5.25m18 0V12a2.25 2.25 0 0 1-2.25 2.25H5.25A2.25 2.25 0 0 1 3 12V5.25" />
      </svg>
    ),
    code: `<!-- Webflow Embed Instructions -->
1. Open your Webflow Project Settings.
2. Navigate to the "Custom Code" tab.
3. In the "Footer Code" section, paste the script:
<script
  src="https://paperchat.ai/widget.js"
  data-chatbot-id="your-chatbot-id"
  async>
</script>
4. Save and Publish your project.`
  }
];

/* ── Features ─── */
const features = [
  {
    gradient: "from-purple-500 to-indigo-500",
    icon: <svg viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth={1.75} className="w-5 h-5"><path strokeLinecap="round" strokeLinejoin="round" d="M12 21a9.004 9.004 0 0 0 8.716-6.747M12 21a9.004 9.004 0 0 1-8.716-6.747M12 21c2.485 0 4.5-4.03 4.5-9S14.485 3 12 3m0 18c-2.485 0-4.5-4.03-4.5-9S9.515 3 12 3m0 0a8.997 8.997 0 0 1 7.843 4.582M12 3a8.997 8.997 0 0 0-7.843 4.582m15.686 0A11.953 11.953 0 0 1 12 10.5c-2.998 0-5.74-1.1-7.843-2.918m15.686 0A8.959 8.959 0 0 1 21 12c0 .778-.099 1.533-.284 2.253m0 0A17.919 17.919 0 0 1 12 16.5c-3.162 0-6.133-.815-8.716-2.247m0 0A9.015 9.015 0 0 1 3 12c0-1.605.42-3.113 1.157-4.418" /></svg>,
    title: "Instant Web Scraper",
    desc: "Just paste your domain. We will automatically crawl and ingest your pages, articles, and FAQs in under a minute.",
  },
  {
    gradient: "from-purple-500 to-indigo-500",
    icon: <svg viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth={1.75} className="w-5 h-5"><path strokeLinecap="round" strokeLinejoin="round" d="M9.813 15.904 9 18.75l-.813-2.846a4.5 4.5 0 0 0-3.09-3.09L2.25 12l2.846-.813a4.5 4.5 0 0 0 3.09-3.09L9 5.25l.813 2.846a4.5 4.5 0 0 0 3.09 3.09L15.75 12l-2.846.813a4.5 4.5 0 0 0-3.09 3.09ZM18.259 8.715 18 9.75l-.259-1.035a3.375 3.375 0 0 0-2.455-2.456L14.25 6l1.036-.259a3.375 3.375 0 0 0 2.455-2.456L18 2.25l.259 1.035a3.375 3.375 0 0 0 2.456 2.456L21.75 6l-1.035.259a3.375 3.375 0 0 0-2.456 2.456Z" /></svg>,
    title: "AI Response Quality",
    desc: "Trained precisely on your context, keeping responses exact and completely avoiding hallucinated answers.",
  },
  {
    gradient: "from-purple-500 to-indigo-500",
    icon: <svg viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth={1.75} className="w-5 h-5"><path strokeLinecap="round" strokeLinejoin="round" d="M3 13.125C3 12.504 3.504 12 4.125 12h2.25c.621 0 1.125.504 1.125 1.125v6.75C7.5 20.496 6.996 21 6.375 21h-2.25A1.125 1.125 0 0 1 3 19.875v-6.75ZM9.75 8.625c0-.621.504-1.125 1.125-1.125h2.25c.621 0 1.125.504 1.125 1.125v11.25c0 .621-.504 1.125-1.125 1.125h-2.25a1.125 1.125 0 0 1-1.125-1.125V8.625ZM16.5 4.125c0-.621.504-1.125 1.125-1.125h2.25C20.496 3 21 3.504 21 4.125v15.75c0 .621-.504 1.125-1.125 1.125h-2.25a1.125 1.125 0 0 1-1.125-1.125V4.125Z" /></svg>,
    title: "Advanced Analytics",
    desc: "Monitor conversation volume, top questions, leads captured, and full transcripts in real-time.",
  },
  {
    gradient: "from-purple-500 to-indigo-500",
    icon: <svg viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth={1.75} className="w-5 h-5"><path strokeLinecap="round" strokeLinejoin="round" d="M15 19.128a9.38 9.38 0 0 0 2.625.372 9.337 9.337 0 0 0 4.121-.952 4.125 4.125 0 0 0-7.533-2.493M15 19.128v-.003c0-1.113-.285-2.16-.786-3.07M15 19.128v.106A12.318 12.318 0 0 1 8.624 21c-2.331 0-4.512-.645-6.374-1.766l-.001-.109a6.375 6.375 0 0 1 11.964-3.07M12 6.375a3.375 3.375 0 1 1-6.75 0 3.375 3.375 0 0 1 6.75 0Zm8.25 2.25a2.625 2.625 0 1 1-5.25 0 2.625 2.625 0 0 1 5.25 0Z" /></svg>,
    title: "Lead Generation",
    desc: "Let your chatbot collect contact details, names, and requests. Turn static visitors into qualified sales opportunities.",
  },
  {
    gradient: "from-purple-500 to-indigo-500",
    icon: <svg viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth={1.75} className="w-5 h-5"><path strokeLinecap="round" strokeLinejoin="round" d="M17.25 6.75 22.5 12l-5.25 5.25m-10.5 0L1.5 12l5.25-5.25m7.5-3-4.5 16.5" /></svg>,
    title: "Single Line Embed",
    desc: "Insert one HTML script block into your site template. Works instantly across all frameworks.",
  },
  {
    gradient: "from-purple-500 to-indigo-500",
    icon: <svg viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth={1.75} className="w-5 h-5"><path strokeLinecap="round" strokeLinejoin="round" d="M14.25 6.087c0-.355.186-.676.401-.959.221-.29.349-.634.349-1.003 0-1.036-1.007-1.875-2.25-1.875s-2.25.84-2.25 1.875c0 .369.128.713.349 1.003.215.283.401.604.401.959v0a.64.64 0 0 1-.657.643 48.39 48.39 0 0 1-4.163-.3c.186 1.613.293 3.25.315 4.907a.656.656 0 0 1-.658.663v0c-.355 0-.676-.186-.959-.401a1.647 1.647 0 0 0-1.003-.349c-1.036 0-1.875 1.007-1.875 2.25s.84 2.25 1.875 2.25c.369 0 .713-.128 1.003-.349.283-.215.604-.401.959-.401v0c.31 0 .555.26.532.57a48.039 48.039 0 0 1-.642 5.056c1.518.19 3.058.309 4.616.354a.64.64 0 0 0 .657-.643v0c0-.355-.186-.676-.401-.959a1.647 1.647 0 0 1-.349-1.003c0-1.035 1.008-1.875 2.25-1.875 1.243 0 2.25.84 2.25 1.875 0 .369-.128.713-.349 1.003-.215.283-.4.604-.4.959v0c0 .333.277.599.61.58a48.1 48.1 0 0 0 5.427-.63 48.05 48.05 0 0 0 .582-4.717.532.532 0 0 0-.533-.57v0c-.355 0-.676.186-.959.401-.29.221-.634.349-1.003.349-1.035 0-1.875-1.007-1.875-2.25s.84-2.25 1.875-2.25c.37 0 .713.128 1.003.349.283.215.604.401.959.401v0a.656.656 0 0 0 .658-.663 48.422 48.422 0 0 0-.37-5.36c-1.886.342-3.81.574-5.766.689a.578.578 0 0 1-.61-.58v0Z" /></svg>,
    title: "Webhook Integrations",
    desc: "Sync conversations and leads automatically with Slack, Telegram, HubSpot, or custom webhook targets.",
  },
];

/* ── Interactive Chat Simulator Dialogue ─── */
const presetConvos = [
  {
    q: "How does training work?",
    reply: "You can scrape your website automatically by pasting a URL, or upload documents like PDFs, Word files, or plain text. We chunk and embed it instantly!"
  },
  {
    q: "Is it easy to embed?",
    reply: "Yes! It's just a single script tag. Paste it into your HTML before the closing body tag, and you're good to go. It works with React, Next.js, WordPress, Shopify, etc."
  },
  {
    q: "Does it support languages?",
    reply: "Yes, it supports over 95+ languages automatically. It detects the visitor's language and replies in that language."
  },
  {
    q: "Can it capture leads?",
    reply: "Absolutely! You can enable lead capture in settings. It will ask for the visitor's name, email, and phone before starting the chat."
  }
];

export default function LandingPage() {
  const { theme, toggle } = useTheme();
  const [activeFrame, setActiveFrame] = useState(frameworks[0]);
  const [copied, setCopied] = useState(false);

  /* Chat simulator states */
  const [chatMessages, setChatMessages] = useState<Array<{ role: "assistant" | "user"; text: string }>>([
    { role: "assistant", text: "Welcome to PaperChat! Click any question below to see me answer in real time using my custom trained index. 👇" }
  ]);
  const [typing, setTyping] = useState(false);

  const handleCopyCode = () => {
    navigator.clipboard.writeText(activeFrame.code);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleSimulateQuestion = (q: string, reply: string) => {
    if (typing) return;
    setChatMessages((prev) => [...prev, { role: "user", text: q }]);
    setTyping(true);
    setTimeout(() => {
      setChatMessages((prev) => [...prev, { role: "assistant", text: reply }]);
      setTyping(false);
    }, 1200);
  };

  return (
    <div className="min-h-screen text-[var(--text-1)] select-none antialiased">
      
      {/* ═══ HEADER ════════════════════════════════════════════════ */}
      <header className="sticky top-0 z-50 backdrop-blur-md bg-[rgba(250,250,250,0.8)] dark:bg-[rgba(9,9,11,0.8)] border-b border-[var(--border)] transition-colors duration-200">
        <div className="max-w-6xl mx-auto px-6 h-16 flex items-center justify-between">
          <Link href="/" className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-lg flex items-center justify-center bg-gradient-to-br from-[#6c47ff] to-[#8060ff]">
              <svg viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth={2.25} className="w-4.5 h-4.5">
                <path strokeLinecap="round" strokeLinejoin="round" d="M8.625 12a.375.375 0 1 1-.75 0 .375.375 0 0 1 .75 0Zm0 0H8.25m4.125 0a.375.375 0 1 1-.75 0 .375.375 0 0 1 .75 0Zm0 0H12m4.125 0a.375.375 0 1 1-.75 0 .375.375 0 0 1 .75 0Zm0 0h-.375M21 12c0 4.556-4.03 8.25-9 8.25a9.764 9.764 0 0 1-2.555-.337A5.972 5.972 0 0 1 5.41 20.97a5.969 5.969 0 0 1-.474-.065 4.48 4.48 0 0 0 .978-2.025c.09-.457-.133-.901-.467-1.226C3.93 16.178 3 14.189 3 12c0-4.556 4.03-8.25 9-8.25s9 3.694 9 8.25Z" />
              </svg>
            </div>
            <span className="font-bold text-slate-900 dark:text-white text-base tracking-tight">PaperChat</span>
          </Link>

          <nav className="hidden md:flex items-center gap-7">
            {["Features", "Pricing", "FAQ"].map((l) => (
              <a
                key={l}
                href={l === "FAQ" ? "#faq" : l === "Pricing" ? "#pricing" : l === "Features" ? "#features" : "#"}
                className="text-zinc-500 dark:text-zinc-400 hover:text-slate-900 dark:hover:text-white text-sm font-medium transition-colors"
              >
                {l}
              </a>
            ))}
          </nav>

          <div className="flex items-center gap-4">
            {/* Theme toggle */}
            <button
              onClick={toggle}
              title={theme === "dark" ? "Light mode" : "Dark mode"}
              className="w-8 h-8 rounded-lg flex items-center justify-center text-zinc-500 hover:bg-zinc-100 dark:hover:bg-zinc-800 transition-colors"
            >
              {theme === "dark" ? (
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.75} className="w-5 h-5">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M12 3v2.25m6.364.386-1.591 1.591M21 12h-2.25m-.386 6.364-1.591-1.591M12 18.75V21m-4.773-4.227-1.591 1.591M5.25 12H3m4.227-4.773L5.636 5.636M15.75 12a3.75 3.75 0 1 1-7.5 0 3.75 3.75 0 0 1 7.5 0Z" />
                </svg>
              ) : (
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.75} className="w-5 h-5">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M21.752 15.002A9.72 9.72 0 0 1 18 15.75c-5.385 0-9.75-4.365-9.75-9.75 0-1.33.266-2.597.748-3.752A9.753 9.753 0 0 0 3 11.25C3 16.635 7.365 21 12.75 21a9.753 9.753 0 0 0 9.002-5.998Z" />
                </svg>
              )}
            </button>

            <Link href="/login" className="text-zinc-600 dark:text-zinc-300 hover:text-slate-900 dark:hover:text-white text-sm font-medium transition-colors">
              Log in
            </Link>
            <Link
              href="/signup"
              className="bg-[#6c47ff] hover:bg-[#5832e6] text-white text-sm font-semibold px-4 py-2 rounded-lg transition-all shadow-sm"
            >
              Sign up
            </Link>
          </div>
        </div>
      </header>

      {/* ═══ HERO SECTION ══════════════════════════════════════════ */}
      <section className="relative max-w-6xl mx-auto px-6 pt-20 pb-24">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-16 items-center">
          
          {/* Hero text */}
          <div className="lg:col-span-7 space-y-6">
            <div className="inline-flex items-center gap-2 rounded-full border border-[#6c47ff]/20 bg-[#6c47ff]/5 dark:bg-[#6c47ff]/10 px-3.5 py-1.5 text-xs font-semibold text-[#6c47ff] mb-2">
              <span className="w-1.5 h-1.5 rounded-full bg-[#6c47ff] animate-ping" />
              Trained on your website & docs in seconds
            </div>

            <h1 className="text-5xl lg:text-6xl font-extrabold text-slate-900 dark:text-white leading-[1.08] tracking-tight">
              Support automation
              <br />
              purpose-built for
              <br />
              <span className="bg-gradient-to-r from-[#6c47ff] to-[#a38fff] bg-clip-text text-transparent">
                the modern web
              </span>
            </h1>

            <p className="text-zinc-500 dark:text-zinc-400 text-lg leading-relaxed max-w-lg">
              PaperChat is the easiest way to add custom AI support agents to your site. Trained entirely on your data, answering questions 24/7 in 95+ languages.
            </p>

            <div className="flex flex-wrap items-center gap-4 pt-2">
              <Link
                href="/signup"
                className="bg-[#6c47ff] hover:bg-[#5832e6] text-white font-semibold px-6 py-3.5 rounded-xl transition-all shadow-md text-base"
              >
                Start building free
              </Link>
              <a
                href="#features"
                className="text-zinc-500 dark:text-zinc-300 hover:text-slate-900 dark:hover:text-white border border-zinc-200 dark:border-[var(--border)] px-6 py-3.5 rounded-xl font-semibold transition-colors bg-white/50 dark:bg-transparent backdrop-blur-sm"
              >
                Explore features
              </a>
            </div>

            <div className="flex items-center gap-6 pt-2 text-zinc-400 text-sm">
              {["No credit card", "5-min setup", "Free forever"].map((t) => (
                <span key={t} className="flex items-center gap-1.5">
                  <svg viewBox="0 0 24 24" fill="currentColor" className="w-4 h-4 text-[#6c47ff]"><path fillRule="evenodd" d="M2.25 12c0-5.385 4.365-9.75 9.75-9.75s9.75 4.365 9.75 9.75-4.365 9.75-9.75 9.75S2.25 17.385 2.25 12Zm13.36-1.814a.75.75 0 1 0-1.22-.872l-3.236 4.53L9.53 12.22a.75.75 0 0 0-1.06 1.06l2.25 2.25a.75.75 0 0 0 1.14-.094l3.75-5.25Z" clipRule="evenodd" /></svg>
                  {t}
                </span>
              ))}
            </div>
          </div>

          {/* Right: Live Interactive Chat Widget Emulator */}
          <div className="lg:col-span-5 relative">
            <div className="relative mx-auto max-w-[370px] bg-white dark:bg-[#131316] rounded-2xl border border-zinc-200 dark:border-[var(--border)] overflow-hidden shadow-2xl transition-all">
              
              {/* Header */}
              <div className="px-5 py-4 bg-gradient-to-br from-[#6c47ff] to-[#8060ff] text-white flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 rounded-full bg-white/20 flex items-center justify-center font-bold text-sm">AI</div>
                  <div>
                    <div className="font-bold text-sm">Assistant</div>
                    <div className="text-xs text-white/80 flex items-center gap-1 mt-0.5">
                      <span className="w-1.5 h-1.5 rounded-full bg-green-400" />
                      Live Agent
                    </div>
                  </div>
                </div>
              </div>

              {/* Chat Messages */}
              <div className="p-4 h-[240px] overflow-y-auto space-y-3 scrollbar-thin">
                {chatMessages.map((m, idx) => (
                  <div key={idx} className={`flex ${m.role === "user" ? "justify-end" : "justify-start"}`}>
                    <div className={`max-w-[85%] text-xs px-3.5 py-2.5 rounded-xl ${
                      m.role === "user" 
                        ? "bg-[#6c47ff] text-white rounded-tr-none" 
                        : "bg-slate-100 dark:bg-zinc-800 text-slate-800 dark:text-zinc-200 rounded-tl-none border border-slate-200/50 dark:border-zinc-700/50"
                    }`}>
                      {m.text}
                    </div>
                  </div>
                ))}
                {typing && (
                  <div className="flex justify-start">
                    <div className="bg-slate-100 dark:bg-zinc-800 rounded-xl rounded-tl-none px-4 py-3 flex gap-1 items-center">
                      <span className="w-1.5 h-1.5 rounded-full bg-zinc-500 dot-bounce-1" />
                      <span className="w-1.5 h-1.5 rounded-full bg-zinc-500 dot-bounce-2" />
                      <span className="w-1.5 h-1.5 rounded-full bg-zinc-500 dot-bounce-3" />
                    </div>
                  </div>
                )}
              </div>

              {/* Presets click interface */}
              <div className="px-4 py-3 bg-slate-50 dark:bg-zinc-950 border-t border-slate-100 dark:border-[var(--border)]">
                <p className="text-[10px] text-zinc-400 font-semibold uppercase tracking-wider mb-2">Simulate Questions:</p>
                <div className="flex flex-wrap gap-1.5">
                  {presetConvos.map((item) => (
                    <button
                      key={item.q}
                      onClick={() => handleSimulateQuestion(item.q, item.reply)}
                      disabled={typing || chatMessages.some((msg) => msg.text === item.q)}
                      className="text-[10px] px-2.5 py-1.5 rounded-lg border border-slate-200 dark:border-zinc-800 bg-white dark:bg-zinc-900 text-slate-700 dark:text-zinc-300 hover:border-[#6c47ff] hover:text-[#6c47ff] dark:hover:text-[#a38fff] disabled:opacity-40 transition-all font-medium"
                    >
                      {item.q}
                    </button>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ═══ LOGO STRIP ═══════════════════════════════════════════ */}
      <section className="border-y border-zinc-200/50 dark:border-[var(--border)] py-10 bg-white/30 dark:bg-black/10 backdrop-blur-sm">
        <div className="max-w-5xl mx-auto px-6 text-center">
          <p className="text-[10px] font-extrabold text-zinc-400 uppercase tracking-widest mb-6">SUPPORTING PLATFORMS WORLDWIDE</p>
          <div className="flex flex-wrap items-center justify-center gap-10 opacity-70 dark:opacity-90">
            {logos.map((l) => (
              <div key={l.name} className="grayscale hover:grayscale-0 transition-all duration-200">
                {l.jsx}
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ═══ FRAMEWORK INSTALLATION GRID ══════════════════════════ */}
      <section className="max-w-6xl mx-auto px-6 py-24" id="embeds">
        <div className="text-center max-w-2xl mx-auto mb-16">
          <div className="inline-flex items-center gap-2 rounded-full bg-[#6c47ff]/10 px-3 py-1.5 text-xs font-semibold text-[#6c47ff] mb-4">Integrations</div>
          <h2 className="text-3xl lg:text-4xl font-extrabold text-slate-900 dark:text-white tracking-tight mb-3">Install on any platform in seconds</h2>
          <p className="text-zinc-500 dark:text-zinc-400 text-base leading-relaxed">Select a platform below to see custom embed code snippet and setup guide.</p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          {/* Left grid selection */}
          <div className="lg:col-span-5 grid grid-cols-2 gap-3">
            {frameworks.map((item) => (
              <button
                key={item.name}
                onClick={() => setActiveFrame(item)}
                className={`flex items-center gap-3 p-4 rounded-xl border text-left transition-all bg-white dark:bg-[#131316] ${
                  activeFrame.name === item.name
                    ? "border-[#6c47ff] shadow-sm text-slate-900 dark:text-white ring-1 ring-[#6c47ff]"
                    : "border-zinc-200 dark:border-[var(--border)] text-zinc-600 dark:text-zinc-400 hover:border-zinc-300 dark:hover:border-zinc-700"
                }`}
              >
                <div className={`p-1.5 rounded-lg ${activeFrame.name === item.name ? "text-[#6c47ff]" : "text-zinc-400"}`}>
                  {item.icon}
                </div>
                <span className="font-semibold text-sm">{item.name}</span>
              </button>
            ))}
          </div>

          {/* Right code output panel */}
          <div className="lg:col-span-7 bg-[#131316] dark:bg-black rounded-2xl border border-zinc-800 p-5 overflow-hidden relative shadow-lg">
            <div className="flex items-center justify-between pb-3.5 border-b border-zinc-800 mb-4">
              <span className="text-xs text-zinc-400 font-semibold">{activeFrame.name} Quickstart Script</span>
              <button
                onClick={handleCopyCode}
                className="text-xs text-zinc-300 hover:text-white bg-white/5 border border-zinc-800 hover:bg-white/10 px-3 py-1.5 rounded-lg transition-all"
              >
                {copied ? "Copied ✓" : "Copy Code"}
              </button>
            </div>
            <pre className="text-xs text-emerald-400 overflow-x-auto font-mono leading-relaxed h-[180px]">
              <code>{activeFrame.code}</code>
            </pre>
          </div>
        </div>
      </section>

      {/* ═══ FEATURES ═══════════════════════════════════════════════ */}
      <section className="bg-white/40 dark:bg-[#131316]/20 py-24 border-y border-zinc-200/50 dark:border-[var(--border)]" id="features">
        <div className="max-w-5xl mx-auto px-6">
          <div className="text-center mb-16">
            <div className="inline-flex items-center gap-2 rounded-full bg-[#6c47ff]/10 px-3 py-1.5 text-xs font-semibold text-[#6c47ff] mb-4 font-sans">Features</div>
            <h2 className="text-3xl lg:text-4xl font-extrabold text-slate-900 dark:text-white tracking-tight mb-3">Trained on your knowledge base</h2>
            <p className="text-zinc-500 dark:text-zinc-400 text-base max-w-xl mx-auto">Replace static, cold FAQs with an interactive customer support agent that replies like a teammate.</p>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {features.map((f) => (
              <div key={f.title} className="bg-white dark:bg-[var(--surface)] rounded-2xl p-6 border border-zinc-200 dark:border-[var(--border)] hover:border-[#6c47ff]/50 dark:hover:border-[#6c47ff]/50 transition-all duration-200 group">
                <div className={`w-10 h-10 rounded-xl bg-[#6c47ff] flex items-center justify-center mb-5 shadow-sm`}>{f.icon}</div>
                <h3 className="font-bold text-slate-900 dark:text-white mb-2 text-sm sm:text-base">{f.title}</h3>
                <p className="text-zinc-500 dark:text-zinc-400 text-xs sm:text-sm leading-relaxed">{f.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ═══ PRICING ════════════════════════════════════════════════ */}
      <section className="py-24" id="pricing">
        <div className="max-w-5xl mx-auto px-6">
          <div className="text-center mb-14">
            <div className="inline-flex items-center gap-2 rounded-full bg-[#6c47ff]/10 px-3.5 py-1.5 text-xs font-semibold text-[#6c47ff] mb-4">Pricing</div>
            <h2 className="text-4xl font-extrabold text-slate-900 dark:text-white tracking-tight mb-3">Upgrade Your Plan</h2>
            <p className="text-zinc-500 dark:text-zinc-400 text-base max-w-xl mx-auto">Choose the plan that best fits your needs</p>
          </div>
          <BillingToggle />
        </div>
      </section>

      {/* ═══ FAQ ════════════════════════════════════════════════════ */}
      <section className="bg-white/40 dark:bg-[#131316]/20 py-24 border-t border-zinc-200/50 dark:border-[var(--border)]" id="faq">
        <div className="max-w-3xl mx-auto px-6">
          <div className="text-center mb-12">
            <div className="inline-flex items-center gap-2 rounded-full bg-[#6c47ff]/10 px-3.5 py-1.5 text-xs font-semibold text-[#6c47ff] mb-4">FAQ</div>
            <h2 className="text-3xl font-extrabold text-slate-900 dark:text-white tracking-tight">Frequently asked questions</h2>
          </div>
          <FaqAccordion />
        </div>
      </section>

      {/* ═══ CTA SECTION ════════════════════════════════════════════ */}
      <section className="bg-zinc-950 dark:bg-[#131316] py-20 relative overflow-hidden border-t border-zinc-900">
        <div className="pointer-events-none absolute inset-0" style={{ background: "radial-gradient(ellipse 60% 80% at 50% 50%, rgba(108,71,255,0.08) 0%, transparent 70%)" }} />
        <div className="relative text-center px-6">
          <h2 className="text-4xl font-extrabold text-white tracking-tight mb-4">Ready to automate your support?</h2>
          <p className="text-zinc-400 text-lg mb-8 max-w-lg mx-auto">Join thousands of companies saving hours every single day.</p>
          <Link href="/signup" className="inline-flex items-center gap-2 bg-[#6c47ff] hover:bg-[#5832e6] text-white font-bold px-8 py-4 rounded-xl transition-all text-base shadow-lg">
            Create your first chatbot
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} className="w-4 h-4"><path strokeLinecap="round" strokeLinejoin="round" d="M13.5 4.5 21 12m0 0-7.5 7.5M21 12H3" /></svg>
          </Link>
          <p className="text-zinc-600 text-sm mt-3">Free to start · No credit card required</p>
        </div>
      </section>

      {/* ═══ FOOTER ════════════════════════════════════════════════ */}
      <footer className="bg-zinc-950 border-t border-zinc-900">
        <div className="max-w-6xl mx-auto px-6 py-12 grid grid-cols-1 sm:grid-cols-4 gap-8">
          <div className="sm:col-span-2">
            <Link href="/" className="flex items-center gap-2 mb-3">
              <div className="w-7 h-7 rounded-lg flex items-center justify-center bg-gradient-to-br from-[#6c47ff] to-[#8060ff]">
                <svg viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth={2} className="w-3.5 h-3.5"><path strokeLinecap="round" strokeLinejoin="round" d="M8.625 12a.375.375 0 1 1-.75 0 .375.375 0 0 1 .75 0Zm0 0H8.25m4.125 0a.375.375 0 1 1-.75 0 .375.375 0 0 1 .75 0Zm0 0H12m4.125 0a.375.375 0 1 1-.75 0 .375.375 0 0 1 .75 0Zm0 0h-.375M21 12c0 4.556-4.03 8.25-9 8.25a9.764 9.764 0 0 1-2.555-.337A5.972 5.972 0 0 1 5.41 20.97a5.969 5.969 0 0 1-.474-.065 4.48 4.48 0 0 0 .978-2.025c.09-.457-.133-.901-.467-1.226C3.93 16.178 3 14.189 3 12c0-4.556 4.03-8.25 9-8.25s9 3.694 9 8.25Z" /></svg>
              </div>
              <span className="font-bold text-white text-sm">PaperChat</span>
            </Link>
            <p className="text-zinc-500 text-sm max-w-xs leading-relaxed">AI-powered customer support, trained on your data.</p>
          </div>
          {[
            { heading: "Product", links: ["Features", "Pricing", "Changelog"] },
            { heading: "Company", links: ["FAQ", "Privacy Policy", "Terms"] },
          ].map((col) => (
            <div key={col.heading}>
              <h4 className="text-white text-xs font-semibold uppercase tracking-widest mb-3">{col.heading}</h4>
              <ul className="space-y-2">
                {col.links.map((l) => (
                  <li key={l}>
                    <a href={l === "FAQ" ? "#faq" : l === "Pricing" ? "#pricing" : l === "Features" ? "#features" : "#"} className="text-zinc-500 hover:text-zinc-300 text-sm transition-colors">
                      {l}
                    </a>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
        <div className="border-t border-zinc-900 py-4">
          <p className="text-center text-zinc-600 text-xs">© {new Date().getFullYear()} PaperChat. All rights reserved.</p>
        </div>
      </footer>
    </div>
  );
}
