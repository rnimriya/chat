"use client";
import { useState } from "react";

const faqs = [
  {
    q: "What is PaperChat?",
    a: "PaperChat is an AI-powered chatbot builder that lets you create custom support agents trained on your own content — your website, PDFs, FAQs, and more. No coding required.",
  },
  {
    q: "Do I need a website?",
    a: "No. You can train your chatbot by uploading files (PDFs, DOCX, TXT) or pasting text directly. A website is optional — you can scrape it automatically if you have one.",
  },
  {
    q: "Do I need an OpenAI API key?",
    a: "No. PaperChat handles all AI infrastructure for you. Just sign up and start building — no API keys or third-party accounts needed.",
  },
  {
    q: "Any hidden costs in the free plan?",
    a: "None. The free plan is genuinely free to get started. You can create chatbots, train them, and embed them on your site. Advanced features like analytics and lead capture are included.",
  },
  {
    q: "Is there a trial period for the paid plans?",
    a: "Yes, all paid plans come with a 30-day money-back guarantee. If you're not satisfied for any reason, contact us and we'll issue a full refund.",
  },
];

export default function FaqAccordion() {
  const [openIndex, setOpenIndex] = useState<number | null>(null);

  return (
    <div className="space-y-3 max-w-2xl mx-auto">
      {faqs.map((faq, i) => (
        <div
          key={i}
          className="border border-slate-200 dark:border-[var(--border)] rounded-xl overflow-hidden bg-white dark:bg-[var(--surface)]"
        >
          <button
            onClick={() => setOpenIndex(openIndex === i ? null : i)}
            className="w-full flex items-center justify-between px-6 py-4 text-left hover:bg-slate-50 dark:hover:bg-[var(--border)] transition-colors"
          >
            <span className="font-medium text-slate-900 dark:text-slate-100 text-sm sm:text-base">{faq.q}</span>
            <svg
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth={2}
              className={`w-5 h-5 text-slate-400 shrink-0 ml-3 transition-transform duration-200 ${openIndex === i ? "rotate-180" : ""}`}
            >
              <path strokeLinecap="round" strokeLinejoin="round" d="m19.5 8.25-7.5 7.5-7.5-7.5" />
            </svg>
          </button>
          {openIndex === i && (
            <div className="px-6 pb-5 pt-1 text-slate-600 dark:text-slate-300 text-sm leading-relaxed border-t border-slate-100 dark:border-[var(--border)]">
              {faq.a}
            </div>
          )}
        </div>
      ))}
    </div>
  );
}
