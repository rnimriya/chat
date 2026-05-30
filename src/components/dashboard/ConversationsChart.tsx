"use client";
import { useState } from "react";

interface Point { date: string; value: number }
interface Props { data: Point[]; bots: { id: string; name: string }[] }

export default function ConversationsChart({ data, bots }: Props) {
  const [selected, setSelected] = useState("all");

  const W = 800, H = 180;
  const padL = 32, padR = 16, padT = 10, padB = 36;
  const chartW = W - padL - padR;
  const chartH = H - padT - padB;
  const maxVal = Math.max(...data.map((d) => d.value), 4);
  const yTicks = [0, 1, 2, 3, 4].filter((v) => v <= maxVal + 1);

  function xPos(i: number) { return padL + (i / Math.max(data.length - 1, 1)) * chartW; }
  function yPos(v: number) { return padT + chartH - (v / (maxVal || 1)) * chartH; }

  const linePath = data.length > 1
    ? data.map((d, i) => `${i === 0 ? "M" : "L"}${xPos(i).toFixed(1)},${yPos(d.value).toFixed(1)}`).join(" ")
    : "";

  const xLabels = data.filter((_, i) => i % 2 === 0);

  return (
    <div className="bg-white dark:bg-[var(--surface)] border border-slate-200 dark:border-[var(--border)] rounded-2xl overflow-hidden transition-colors">
      <div className="flex items-start justify-between px-6 pt-5 pb-4">
        <div>
          <h3 className="font-bold text-slate-900 dark:text-slate-100 text-base">Conversations</h3>
          <p className="text-slate-500 dark:text-slate-400 text-sm mt-0.5">Daily conversations in the last 30 days</p>
        </div>
        <select
          value={selected}
          onChange={(e) => setSelected(e.target.value)}
          className="text-sm border border-slate-200 dark:border-[var(--border)] rounded-lg px-3 py-1.5 focus:outline-none focus:ring-2 focus:ring-[var(--accent)] bg-white dark:bg-[var(--surface)] text-slate-900 dark:text-slate-100"
        >
          <option value="all">All Chatbots</option>
          {bots.map((b) => <option key={b.id} value={b.id}>{b.name}</option>)}
        </select>
      </div>

      <div className="px-6 pb-4">
        <svg viewBox={`0 0 ${W} ${H}`} className="w-full" style={{ height: 200 }}>
          {yTicks.map((v) => (
            <g key={v}>
              <line x1={padL} y1={yPos(v)} x2={W - padR} y2={yPos(v)} stroke="#e2e8f0" strokeWidth={1} strokeDasharray="4 4" />
              <text x={padL - 6} y={yPos(v) + 4} textAnchor="end" fontSize={10} fill="#94a3b8">{v}</text>
            </g>
          ))}
          {linePath && (
            <path d={`${linePath} L${xPos(data.length - 1)},${padT + chartH} L${padL},${padT + chartH} Z`} fill="url(#areaGrad)" opacity={0.15} />
          )}
          {linePath && (
            <path d={linePath} fill="none" stroke="#8b5cf6" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round" />
          )}
          <defs>
            <linearGradient id="areaGrad" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor="#8b5cf6" />
              <stop offset="100%" stopColor="#8b5cf6" stopOpacity={0} />
            </linearGradient>
          </defs>
          {xLabels.map((d) => {
            const idx = data.indexOf(d);
            return (
              <text key={d.date} x={xPos(idx)} y={H - 6} textAnchor="middle" fontSize={10} fill="#94a3b8">
                {d.date.slice(5).replace("-", " ").replace(/^0/, "")}
              </text>
            );
          })}
        </svg>
      </div>

      <div className="flex items-center justify-between px-6 py-3 border-t border-slate-100 dark:border-[var(--border)]">
        <span className="text-sm text-emerald-600 dark:text-emerald-400 font-medium flex items-center gap-1.5">
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} className="w-4 h-4">
            <path strokeLinecap="round" strokeLinejoin="round" d="M2.25 18 9 11.25l4.306 4.306a11.95 11.95 0 0 1 5.814-5.518l2.74-1.22m0 0-5.94-2.281m5.94 2.28-2.28 5.941" />
          </svg>
          Trending up by 0% this month
        </span>
        <span className="text-sm text-slate-400 dark:text-slate-500">Last 30 days</span>
      </div>
    </div>
  );
}
