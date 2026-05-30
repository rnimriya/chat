"use client";
import { useState } from "react";

const plans = [
  {
    id: "basic", name: "BASIC", monthly: 35, yearly: 28, highlight: false,
    features: ["4,000 message credits (~1000+ conversations)", "1 AI chatbots", "25 MB knowledge base", "3 team members", "Conversation history", "Domain whitelist", "Analytics and reporting", "Over 58 languages", "Lead collection", "Human handover", "Integrations: N8N, Zapier, Make, Mailchimp, Hubspot, Cal.com", "Slack & Telegram notifications"],
    excluded: ["Remove branding"],
  },
  {
    id: "pro", name: "PRO", monthly: 99, yearly: 79, highlight: true,
    features: ["10,000 message credits (~2500+ conversations)", "3 AI chatbots", "40 MB knowledge base", "4 team members", "Conversation history", "Domain whitelist", "Analytics and reporting", "Over 58 languages", "Lead collection", "Human handover", "Integrations: N8N, Zapier, Make, Mailchimp, Hubspot, Cal.com", "Remove branding", "Slack & Telegram notifications"],
    excluded: [],
  },
  {
    id: "enterprise", name: "ENTERPRISE", monthly: 399, yearly: 319, highlight: false,
    features: ["40,000 message credits (~10000+ conversations)", "5 AI chatbots", "60 MB knowledge base", "5 team members", "Conversation history", "Domain whitelist", "Analytics and reporting", "Over 58 languages", "Lead collection", "Human handover", "Integrations: N8N, Zapier, Make, Mailchimp, Hubspot, Cal.com", "Remove branding", "Slack & Telegram notifications"],
    excluded: [],
  },
];

export default function BillingToggle() {
  const [billing, setBilling] = useState<"monthly" | "yearly">("monthly");

  return (
    <div>
      <div className="flex items-center mb-8">
        <div className="flex items-center bg-slate-100 dark:bg-[var(--surface)] rounded-full p-0.5 gap-0.5">
          <button
            onClick={() => setBilling("yearly")}
            className={`px-4 py-1.5 rounded-full text-sm font-medium transition-all ${billing === "yearly" ? "bg-white dark:bg-[var(--border)] shadow-sm text-slate-900 dark:text-slate-100" : "text-slate-500 dark:text-slate-400"}`}
          >
            Yearly (-20%)
          </button>
          <button
            onClick={() => setBilling("monthly")}
            className={`px-4 py-1.5 rounded-full text-sm font-medium transition-all ${billing === "monthly" ? "bg-[var(--accent)] dark:bg-white text-white dark:text-slate-900 shadow-sm" : "text-slate-500 dark:text-slate-400"}`}
          >
            Monthly
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
        {plans.map((plan) => (
          <div
            key={plan.id}
            className={`rounded-2xl p-6 flex flex-col bg-white dark:bg-[var(--surface)] transition-colors ${
              plan.highlight
                ? "border-2 border-[var(--accent)] dark:border-[var(--accent)]"
                : "border border-slate-200 dark:border-[var(--border)]"
            }`}
          >
            <p className="text-xs font-bold text-slate-500 dark:text-slate-400 tracking-widest mb-3">{plan.name}</p>
            <div className="mb-5">
              <span className="text-4xl font-extrabold text-slate-900 dark:text-slate-100">${billing === "monthly" ? plan.monthly : plan.yearly}</span>
              <span className="text-slate-400 dark:text-slate-500 text-sm ml-1">/month</span>
            </div>
            <ul className="space-y-2.5 mb-6 flex-1">
              {plan.features.map((f) => (
                <li key={f} className="flex items-start gap-2 text-sm text-slate-700 dark:text-slate-300">
                  <svg viewBox="0 0 24 24" fill="none" stroke="var(--accent)" strokeWidth={2.5} className="w-4 h-4 shrink-0 mt-0.5">
                    <path strokeLinecap="round" strokeLinejoin="round" d="m4.5 12.75 6 6 9-13.5" />
                  </svg>
                  {f}
                </li>
              ))}
              {plan.excluded.map((f) => (
                <li key={f} className="flex items-start gap-2 text-sm text-slate-400 dark:text-slate-600 line-through">
                  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} className="w-4 h-4 shrink-0 mt-0.5">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M6 18 18 6M6 6l12 12" />
                  </svg>
                  {f}
                </li>
              ))}
            </ul>
            <button className={plan.highlight ? "btn-primary w-full" : "btn-secondary w-full"}>
              Upgrade
            </button>
          </div>
        ))}
      </div>
    </div>
  );
}
