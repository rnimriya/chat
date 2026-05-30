import Link from "next/link";
import FaqAccordion from "@/components/FaqAccordion";

/* ── Trusted logos ─── */
const logos = [
  { name: "WooCommerce", jsx: <span className="font-extrabold text-[#7f54b3] text-sm">woo<span className="font-light opacity-70">commerce</span></span> },
  { name: "Shopify",     jsx: <span className="font-bold text-[#5a8a3c] text-sm">Shopify</span> },
  { name: "Zapier",      jsx: <span className="font-bold text-[#ff4a00] text-sm italic">zapier</span> },
  { name: "n8n",         jsx: <span className="font-extrabold text-[#ea4b71] text-base">n8n</span> },
  { name: "Make",        jsx: <span className="font-bold text-[#6d00cc] text-sm">make</span> },
  { name: "Salesforce",  jsx: <span className="font-bold text-[#00a1e0] text-sm">salesforce</span> },
  { name: "HubSpot",     jsx: <span className="font-bold text-[#ff7a59] text-sm">HubSpot</span> },
];

/* ── Features ─── */
const features = [
  {
    gradient: "from-sky-500 to-cyan-400",
    icon: <svg viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth={1.75} className="w-5 h-5"><path strokeLinecap="round" strokeLinejoin="round" d="M12 21a9.004 9.004 0 0 0 8.716-6.747M12 21a9.004 9.004 0 0 1-8.716-6.747M12 21c2.485 0 4.5-4.03 4.5-9S14.485 3 12 3m0 18c-2.485 0-4.5-4.03-4.5-9S9.515 3 12 3m0 0a8.997 8.997 0 0 1 7.843 4.582M12 3a8.997 8.997 0 0 0-7.843 4.582m15.686 0A11.953 11.953 0 0 1 12 10.5c-2.998 0-5.74-1.1-7.843-2.918m15.686 0A8.959 8.959 0 0 1 21 12c0 .778-.099 1.533-.284 2.253m0 0A17.919 17.919 0 0 1 12 16.5c-3.162 0-6.133-.815-8.716-2.247m0 0A9.015 9.015 0 0 1 3 12c0-1.605.42-3.113 1.157-4.418" /></svg>,
    title: "Website Scraping",
    desc: "Paste a URL and we crawl your site automatically — no copy-paste, no manual work.",
  },
  {
    gradient: "from-violet-500 to-purple-500",
    icon: <svg viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth={1.75} className="w-5 h-5"><path strokeLinecap="round" strokeLinejoin="round" d="M9.813 15.904 9 18.75l-.813-2.846a4.5 4.5 0 0 0-3.09-3.09L2.25 12l2.846-.813a4.5 4.5 0 0 0 3.09-3.09L9 5.25l.813 2.846a4.5 4.5 0 0 0 3.09 3.09L15.75 12l-2.846.813a4.5 4.5 0 0 0-3.09 3.09ZM18.259 8.715 18 9.75l-.259-1.035a3.375 3.375 0 0 0-2.455-2.456L14.25 6l1.036-.259a3.375 3.375 0 0 0 2.455-2.456L18 2.25l.259 1.035a3.375 3.375 0 0 0 2.456 2.456L21.75 6l-1.035.259a3.375 3.375 0 0 0-2.456 2.456Z" /></svg>,
    title: "GPT-4o Powered",
    desc: "State-of-the-art AI trained only on your data. Answers in 95+ languages, 24/7.",
  },
  {
    gradient: "from-emerald-500 to-teal-500",
    icon: <svg viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth={1.75} className="w-5 h-5"><path strokeLinecap="round" strokeLinejoin="round" d="M3 13.125C3 12.504 3.504 12 4.125 12h2.25c.621 0 1.125.504 1.125 1.125v6.75C7.5 20.496 6.996 21 6.375 21h-2.25A1.125 1.125 0 0 1 3 19.875v-6.75ZM9.75 8.625c0-.621.504-1.125 1.125-1.125h2.25c.621 0 1.125.504 1.125 1.125v11.25c0 .621-.504 1.125-1.125 1.125h-2.25a1.125 1.125 0 0 1-1.125-1.125V8.625ZM16.5 4.125c0-.621.504-1.125 1.125-1.125h2.25C20.496 3 21 3.504 21 4.125v15.75c0 .621-.504 1.125-1.125 1.125h-2.25a1.125 1.125 0 0 1-1.125-1.125V4.125Z" /></svg>,
    title: "Rich Analytics",
    desc: "Session counts, top questions, lead capture, and chat transcripts — all in one place.",
  },
  {
    gradient: "from-rose-500 to-pink-500",
    icon: <svg viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth={1.75} className="w-5 h-5"><path strokeLinecap="round" strokeLinejoin="round" d="M15 19.128a9.38 9.38 0 0 0 2.625.372 9.337 9.337 0 0 0 4.121-.952 4.125 4.125 0 0 0-7.533-2.493M15 19.128v-.003c0-1.113-.285-2.16-.786-3.07M15 19.128v.106A12.318 12.318 0 0 1 8.624 21c-2.331 0-4.512-.645-6.374-1.766l-.001-.109a6.375 6.375 0 0 1 11.964-3.07M12 6.375a3.375 3.375 0 1 1-6.75 0 3.375 3.375 0 0 1 6.75 0Zm8.25 2.25a2.625 2.625 0 1 1-5.25 0 2.625 2.625 0 0 1 5.25 0Z" /></svg>,
    title: "Lead Capture",
    desc: "Collect names, emails, and phone numbers from visitors right inside the chat widget.",
  },
  {
    gradient: "from-amber-500 to-orange-500",
    icon: <svg viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth={1.75} className="w-5 h-5"><path strokeLinecap="round" strokeLinejoin="round" d="M17.25 6.75 22.5 12l-5.25 5.25m-10.5 0L1.5 12l5.25-5.25m7.5-3-4.5 16.5" /></svg>,
    title: "One-Line Embed",
    desc: "Copy one script tag. Paste it anywhere. Your chatbot is live in under a minute.",
  },
  {
    gradient: "from-sky-500 to-blue-600",
    icon: <svg viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth={1.75} className="w-5 h-5"><path strokeLinecap="round" strokeLinejoin="round" d="M14.25 6.087c0-.355.186-.676.401-.959.221-.29.349-.634.349-1.003 0-1.036-1.007-1.875-2.25-1.875s-2.25.84-2.25 1.875c0 .369.128.713.349 1.003.215.283.401.604.401.959v0a.64.64 0 0 1-.657.643 48.39 48.39 0 0 1-4.163-.3c.186 1.613.293 3.25.315 4.907a.656.656 0 0 1-.658.663v0c-.355 0-.676-.186-.959-.401a1.647 1.647 0 0 0-1.003-.349c-1.036 0-1.875 1.007-1.875 2.25s.84 2.25 1.875 2.25c.369 0 .713-.128 1.003-.349.283-.215.604-.401.959-.401v0c.31 0 .555.26.532.57a48.039 48.039 0 0 1-.642 5.056c1.518.19 3.058.309 4.616.354a.64.64 0 0 0 .657-.643v0c0-.355-.186-.676-.401-.959a1.647 1.647 0 0 1-.349-1.003c0-1.035 1.008-1.875 2.25-1.875 1.243 0 2.25.84 2.25 1.875 0 .369-.128.713-.349 1.003-.215.283-.4.604-.4.959v0c0 .333.277.599.61.58a48.1 48.1 0 0 0 5.427-.63 48.05 48.05 0 0 0 .582-4.717.532.532 0 0 0-.533-.57v0c-.355 0-.676.186-.959.401-.29.221-.634.349-1.003.349-1.035 0-1.875-1.007-1.875-2.25s.84-2.25 1.875-2.25c.37 0 .713.128 1.003.349.283.215.604.401.959.401v0a.656.656 0 0 0 .658-.663 48.422 48.422 0 0 0-.37-5.36c-1.886.342-3.81.574-5.766.689a.578.578 0 0 1-.61-.58v0Z" /></svg>,
    title: "No-Code Integrations",
    desc: "Connect to Zapier, n8n, Make, Slack, and more without writing a single line of code.",
  },
];

/* ── Stats ─── */
const stats = [
  { value: "5,000+", label: "Businesses" },
  { value: "95+",    label: "Languages" },
  { value: "<5 min", label: "Setup time" },
  { value: "24/7",   label: "Availability" },
];

export default function LandingPage() {
  return (
    <div className="min-h-screen bg-white text-zinc-900">

      {/* ═══ DARK HERO ═══════════════════════════════════════════ */}
      <div className="bg-zinc-950 relative overflow-hidden">
        {/* Glow blobs */}
        <div className="pointer-events-none absolute -top-32 left-1/2 -translate-x-1/2 w-[900px] h-[700px] rounded-full blur-[140px]"
          style={{ background: "radial-gradient(circle, rgba(14,165,233,0.18) 0%, rgba(56,189,248,0.08) 40%, transparent 70%)" }} />
        <div className="pointer-events-none absolute bottom-0 right-0 w-[500px] h-[500px] rounded-full blur-[100px]"
          style={{ background: "radial-gradient(circle, rgba(99,102,241,0.1) 0%, transparent 70%)" }} />

        {/* Nav */}
        <nav className="relative z-20 max-w-6xl mx-auto px-6 h-16 flex items-center justify-between">
          <Link href="/" className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-lg flex items-center justify-center" style={{ background: "linear-gradient(135deg, #0ea5e9, #38bdf8)" }}>
              <svg viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth={2} className="w-4 h-4">
                <path strokeLinecap="round" strokeLinejoin="round" d="M8.625 12a.375.375 0 1 1-.75 0 .375.375 0 0 1 .75 0Zm0 0H8.25m4.125 0a.375.375 0 1 1-.75 0 .375.375 0 0 1 .75 0Zm0 0H12m4.125 0a.375.375 0 1 1-.75 0 .375.375 0 0 1 .75 0Zm0 0h-.375M21 12c0 4.556-4.03 8.25-9 8.25a9.764 9.764 0 0 1-2.555-.337A5.972 5.972 0 0 1 5.41 20.97a5.969 5.969 0 0 1-.474-.065 4.48 4.48 0 0 0 .978-2.025c.09-.457-.133-.901-.467-1.226C3.93 16.178 3 14.189 3 12c0-4.556 4.03-8.25 9-8.25s9 3.694 9 8.25Z" />
              </svg>
            </div>
            <span className="font-bold text-white text-base tracking-tight">PaperChat</span>
          </Link>

          <div className="hidden md:flex items-center gap-6">
            {["Features", "Pricing", "FAQ", "Blog"].map((l) => (
              <a key={l} href={l === "FAQ" ? "#faq" : "#"} className="text-zinc-400 hover:text-white text-sm font-medium transition-colors">{l}</a>
            ))}
          </div>

          <div className="flex items-center gap-2.5">
            <Link href="/login" className="text-zinc-400 hover:text-white text-sm font-medium px-3 py-1.5 transition-colors">Log in</Link>
            <Link href="/signup" className="bg-sky-500 hover:bg-sky-400 text-white text-sm font-semibold px-4 py-2 rounded-lg transition-colors">
              Get started
            </Link>
          </div>
        </nav>

        {/* Hero content */}
        <section className="relative z-10 max-w-6xl mx-auto px-6 pt-16 pb-0">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            {/* Left: text */}
            <div className="pb-20 lg:pb-24">
              <div className="inline-flex items-center gap-2 rounded-full border border-sky-500/30 bg-sky-500/10 px-3.5 py-1.5 text-xs font-semibold text-sky-400 mb-6">
                <span className="w-1.5 h-1.5 rounded-full bg-sky-400 animate-pulse-dot" />
                Powered by GPT-4o · 95+ languages
              </div>

              <h1 className="text-5xl lg:text-6xl font-bold text-white leading-[1.05] tracking-tight mb-5">
                AI support agents
                <br />
                trained on{" "}
                <span style={{ background: "linear-gradient(135deg, #38bdf8, #0ea5e9, #6366f1)", WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent", backgroundClip: "text" }}>
                  your data
                </span>
              </h1>

              <p className="text-zinc-400 text-lg leading-relaxed mb-8 max-w-md">
                Build a custom chatbot in minutes. Scrape your website, upload docs, and deploy an AI that knows your business inside out.
              </p>

              <div className="flex flex-wrap gap-3 mb-7">
                <Link href="/signup" className="inline-flex items-center gap-2 bg-sky-500 hover:bg-sky-400 text-white font-semibold px-6 py-3 rounded-xl transition-colors text-base">
                  Start for free
                  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} className="w-4 h-4"><path strokeLinecap="round" strokeLinejoin="round" d="M13.5 4.5 21 12m0 0-7.5 7.5M21 12H3" /></svg>
                </Link>
                <Link href="/login" className="inline-flex items-center gap-2 text-zinc-300 hover:text-white border border-zinc-700 hover:border-zinc-500 px-6 py-3 rounded-xl font-medium transition-colors text-base">
                  Sign in
                </Link>
              </div>

              <p className="text-zinc-500 text-sm flex items-center gap-4">
                {["No credit card", "5-min setup", "Free forever"].map((t) => (
                  <span key={t} className="flex items-center gap-1.5">
                    <svg viewBox="0 0 24 24" fill="currentColor" className="w-3.5 h-3.5 text-sky-500 shrink-0"><path fillRule="evenodd" d="M2.25 12c0-5.385 4.365-9.75 9.75-9.75s9.75 4.365 9.75 9.75-4.365 9.75-9.75 9.75S2.25 17.385 2.25 12Zm13.36-1.814a.75.75 0 1 0-1.22-.872l-3.236 4.53L9.53 12.22a.75.75 0 0 0-1.06 1.06l2.25 2.25a.75.75 0 0 0 1.14-.094l3.75-5.25Z" clipRule="evenodd" /></svg>
                    {t}
                  </span>
                ))}
              </p>
            </div>

            {/* Right: Chat demo */}
            <div className="relative lg:flex items-end justify-center hidden pb-0">
              <div className="w-[340px] animate-float" style={{ filter: "drop-shadow(0 32px 64px rgba(14,165,233,0.15))" }}>
                {/* Browser chrome */}
                <div className="bg-zinc-800 rounded-t-2xl px-4 py-3 flex items-center gap-2 border-b border-zinc-700/50">
                  <div className="flex gap-1.5">
                    <span className="w-3 h-3 rounded-full bg-rose-500/70" />
                    <span className="w-3 h-3 rounded-full bg-amber-500/70" />
                    <span className="w-3 h-3 rounded-full bg-emerald-500/70" />
                  </div>
                  <div className="flex-1 mx-2 bg-zinc-700/60 rounded-md h-5 flex items-center px-2">
                    <span className="text-zinc-500 text-[10px] truncate">yourwebsite.com</span>
                  </div>
                </div>

                {/* Chat widget */}
                <div className="bg-zinc-900 rounded-b-2xl overflow-hidden border border-zinc-800 border-t-0">
                  {/* Chat header */}
                  <div className="px-4 py-3 flex items-center gap-3" style={{ background: "linear-gradient(135deg, #0ea5e9, #0284c7)" }}>
                    <div className="w-8 h-8 rounded-full bg-white/20 flex items-center justify-center text-white text-xs font-bold">AI</div>
                    <div>
                      <div className="text-white text-sm font-semibold">Support Assistant</div>
                      <div className="text-sky-100 text-xs flex items-center gap-1.5 mt-0.5">
                        <span className="w-1.5 h-1.5 rounded-full bg-green-400" />
                        Online · Trained on your docs
                      </div>
                    </div>
                  </div>

                  {/* Messages */}
                  <div className="px-4 py-4 space-y-3">
                    <div className="flex items-end gap-2">
                      <div className="w-5 h-5 rounded-full bg-sky-500 flex items-center justify-center text-white text-[9px] font-bold shrink-0">AI</div>
                      <div className="bg-zinc-800 text-zinc-200 text-xs px-3 py-2 rounded-xl rounded-bl-sm max-w-[80%]">Hi there! How can I help you today? 👋</div>
                    </div>
                    <div className="flex justify-end">
                      <div className="bg-sky-500 text-white text-xs px-3 py-2 rounded-xl rounded-br-sm max-w-[80%]">What's your refund policy?</div>
                    </div>
                    <div className="flex items-end gap-2">
                      <div className="w-5 h-5 rounded-full bg-sky-500 flex items-center justify-center text-white text-[9px] font-bold shrink-0">AI</div>
                      <div className="bg-zinc-800 text-zinc-200 text-xs px-3 py-2 rounded-xl rounded-bl-sm max-w-[80%]">We offer a 30-day money-back guarantee on all plans. Just email support! ✓</div>
                    </div>
                    <div className="flex items-end gap-2">
                      <div className="w-5 h-5 rounded-full bg-sky-500 flex items-center justify-center text-white text-[9px] font-bold shrink-0">AI</div>
                      <div className="bg-zinc-800 rounded-xl rounded-bl-sm px-4 py-2.5 flex gap-1.5 items-center">
                        <span className="w-1.5 h-1.5 rounded-full bg-zinc-500 dot-bounce-1" />
                        <span className="w-1.5 h-1.5 rounded-full bg-zinc-500 dot-bounce-2" />
                        <span className="w-1.5 h-1.5 rounded-full bg-zinc-500 dot-bounce-3" />
                      </div>
                    </div>
                  </div>

                  {/* Input */}
                  <div className="px-4 pb-4 pt-1 border-t border-zinc-800">
                    <div className="bg-zinc-800 rounded-xl flex items-center gap-2 px-3 py-2.5">
                      <span className="text-zinc-500 text-xs flex-1">Ask anything...</span>
                      <div className="w-6 h-6 rounded-lg bg-sky-500 flex items-center justify-center shrink-0">
                        <svg className="w-3 h-3 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8" /></svg>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Stats strip */}
        <div className="relative z-10 border-t border-white/5 bg-white/[0.03] mt-0">
          <div className="max-w-4xl mx-auto px-6 py-5 grid grid-cols-4 gap-4">
            {stats.map((s) => (
              <div key={s.label} className="text-center">
                <div className="text-xl font-bold text-white tracking-tight">{s.value}</div>
                <div className="text-xs text-zinc-500 mt-0.5">{s.label}</div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* ═══ INTEGRATIONS STRIP ═══════════════════════════════════ */}
      <section className="bg-white border-b border-zinc-100 py-8">
        <div className="max-w-5xl mx-auto px-6">
          <p className="text-center text-xs font-semibold text-zinc-400 uppercase tracking-widest mb-5">Integrates with your stack</p>
          <div className="flex flex-wrap items-center justify-center gap-8">
            {logos.map((l) => <div key={l.name}>{l.jsx}</div>)}
          </div>
        </div>
      </section>

      {/* ═══ FEATURES ═══════════════════════════════════════════════ */}
      <section className="bg-zinc-50 py-24" id="features">
        <div className="max-w-5xl mx-auto px-6">
          <div className="text-center mb-14">
            <div className="inline-flex items-center gap-2 rounded-full bg-sky-50 border border-sky-100 px-3.5 py-1.5 text-xs font-semibold text-sky-600 mb-4">Features</div>
            <h2 className="text-4xl font-bold text-zinc-900 tracking-tight mb-3">Everything you need, nothing you don&apos;t</h2>
            <p className="text-zinc-500 text-lg max-w-xl mx-auto">Replace your static FAQ with a smart AI that actually knows your business.</p>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {features.map((f) => (
              <div key={f.title} className="bg-white rounded-xl p-5 border border-zinc-200 hover:border-sky-200 hover:shadow-md hover:-translate-y-0.5 transition-all duration-200 group">
                <div className={`w-9 h-9 rounded-lg bg-gradient-to-br ${f.gradient} flex items-center justify-center mb-4`}>{f.icon}</div>
                <h3 className="font-semibold text-zinc-900 mb-1.5">{f.title}</h3>
                <p className="text-zinc-500 text-sm leading-relaxed">{f.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ═══ HOW IT WORKS ══════════════════════════════════════════ */}
      <section className="bg-white py-24">
        <div className="max-w-4xl mx-auto px-6 text-center">
          <div className="inline-flex items-center gap-2 rounded-full bg-zinc-100 px-3.5 py-1.5 text-xs font-semibold text-zinc-600 mb-4">How it works</div>
          <h2 className="text-4xl font-bold text-zinc-900 tracking-tight mb-14">Up and running in 3 steps</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {[
              { n: "1", title: "Create your bot", desc: "Name it, set a color, write a system prompt that defines its personality." },
              { n: "2", title: "Train it", desc: "Paste a URL or upload files. We handle embedding, indexing, and chunking automatically." },
              { n: "3", title: "Go live", desc: "Copy one script tag, paste it anywhere on your site. Your bot is live instantly." },
            ].map((step, i) => (
              <div key={step.n} className="relative">
                {i < 2 && <div className="hidden md:block absolute top-5 left-[calc(50%+28px)] w-[calc(100%-56px)] border-t-2 border-dashed border-zinc-200" />}
                <div className="w-10 h-10 rounded-xl bg-zinc-900 text-white font-bold text-sm flex items-center justify-center mx-auto mb-4 relative z-10">{step.n}</div>
                <h3 className="font-semibold text-zinc-900 mb-2">{step.title}</h3>
                <p className="text-zinc-500 text-sm leading-relaxed">{step.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ═══ CTA BANNER ════════════════════════════════════════════ */}
      <section className="bg-zinc-950 py-20 relative overflow-hidden">
        <div className="pointer-events-none absolute inset-0" style={{ background: "radial-gradient(ellipse 60% 80% at 50% 50%, rgba(14,165,233,0.1) 0%, transparent 70%)" }} />
        <div className="relative text-center px-6">
          <h2 className="text-4xl font-bold text-white tracking-tight mb-4">Ready to automate your support?</h2>
          <p className="text-zinc-400 text-lg mb-8 max-w-lg mx-auto">Join thousands of businesses saving hours every week.</p>
          <Link href="/signup" className="inline-flex items-center gap-2 bg-sky-500 hover:bg-sky-400 text-white font-bold px-8 py-4 rounded-xl transition-colors text-base">
            Create your first chatbot
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} className="w-4 h-4"><path strokeLinecap="round" strokeLinejoin="round" d="M13.5 4.5 21 12m0 0-7.5 7.5M21 12H3" /></svg>
          </Link>
          <p className="text-zinc-600 text-sm mt-3">Free to start · No credit card required</p>
        </div>
      </section>

      {/* ═══ FAQ ════════════════════════════════════════════════════ */}
      <section className="bg-white py-24" id="faq">
        <div className="max-w-2xl mx-auto px-6">
          <div className="text-center mb-10">
            <div className="inline-flex items-center gap-2 rounded-full bg-zinc-100 px-3.5 py-1.5 text-xs font-semibold text-zinc-600 mb-4">FAQ</div>
            <h2 className="text-3xl font-bold text-zinc-900 tracking-tight">Frequently asked questions</h2>
          </div>
          <FaqAccordion />
        </div>
      </section>

      {/* ═══ FOOTER ════════════════════════════════════════════════ */}
      <footer className="bg-zinc-950 border-t border-zinc-900">
        <div className="max-w-6xl mx-auto px-6 py-12 grid grid-cols-1 sm:grid-cols-4 gap-8">
          <div className="sm:col-span-2">
            <Link href="/" className="flex items-center gap-2 mb-3">
              <div className="w-7 h-7 rounded-lg flex items-center justify-center" style={{ background: "linear-gradient(135deg, #0ea5e9, #38bdf8)" }}>
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
                {col.links.map((l) => <li key={l}><a href="#" className="text-zinc-500 hover:text-zinc-300 text-sm transition-colors">{l}</a></li>)}
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
