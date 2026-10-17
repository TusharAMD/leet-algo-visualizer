import React from 'react';
import type { StockCooldownStep } from '../../algorithms/stockCooldownIntuitive';

interface StockCooldownViewerProps {
  step: StockCooldownStep;
  prices: number[];
}

export const StockCooldownViewer: React.FC<StockCooldownViewerProps> = ({
  step,
  prices,
}) => {
  return (
    <div className="flex flex-col h-full gap-4 p-4 select-none">
      {/* Top Status & Variable Badges */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
        <div className="bg-slate-900 border border-slate-800 rounded-xl p-3 flex flex-col justify-center">
          <span className="text-xs text-slate-400 font-medium">Current Day & Price</span>
          <span className="text-base font-mono font-bold text-sky-400">
            Day {step.day} (${step.price})
          </span>
        </div>
        <div className="bg-slate-900 border border-slate-800 rounded-xl p-3 flex flex-col justify-center">
          <span className="text-xs text-slate-400 font-medium">HOLD State</span>
          <span className="text-base font-mono font-bold text-amber-400">
            ${step.hold}
          </span>
        </div>
        <div className="bg-slate-900 border border-slate-800 rounded-xl p-3 flex flex-col justify-center">
          <span className="text-xs text-slate-400 font-medium">SOLD State</span>
          <span className="text-base font-mono font-bold text-emerald-400">
            ${step.sold}
          </span>
        </div>
        <div className="bg-slate-900 border border-slate-800 rounded-xl p-3 flex flex-col justify-center">
          <span className="text-xs text-slate-400 font-medium">COOLDOWN State</span>
          <span className="text-base font-mono font-bold text-indigo-400">
            ${step.cooldown}
          </span>
        </div>
      </div>

      {/* Main Canvas: Prices Timeline & 3-State Machine Visual */}
      <div className="flex-1 bg-slate-900/60 border border-slate-800 rounded-xl p-6 flex flex-col justify-center items-center gap-6 relative overflow-hidden">
        {/* Prices Timeline */}
        <div className="flex flex-col items-center gap-2">
          <div className="text-xs font-semibold text-slate-400 uppercase tracking-wider">
            Stock Prices Timeline
          </div>
          <div className="flex items-center gap-3 flex-wrap justify-center">
            {prices.map((p, idx) => {
              const isCurrent = idx === step.day;
              return (
                <div key={idx} className="flex flex-col items-center gap-1">
                  <span className="text-[10px] font-mono text-slate-500">Day {idx}</span>
                  <div
                    className={`w-14 h-14 rounded-xl border-2 flex flex-col items-center justify-center font-mono text-base font-bold transition-all duration-200 ${
                      isCurrent
                        ? 'border-sky-400 bg-sky-950/70 text-sky-200 scale-105 shadow-lg shadow-sky-500/20 ring-2 ring-sky-400/40'
                        : 'border-slate-800 bg-slate-950/70 text-slate-400'
                    }`}
                  >
                    <span>${p}</span>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* 3-State Machine Architecture Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 w-full max-w-2xl">
          <div className="bg-slate-950/80 border border-amber-500/30 rounded-xl p-4 flex flex-col gap-2">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold text-amber-400 uppercase tracking-wider">
                HOLD (Stock in Hand)
              </span>
              <span className="text-base font-mono font-extrabold text-amber-300">
                ${step.hold}
              </span>
            </div>
            <p className="text-[11px] text-slate-400">
              max(hold, cooldown - price) &rarr; Either keep holding or buy after cooldown.
            </p>
          </div>

          <div className="bg-slate-950/80 border border-emerald-500/30 rounded-xl p-4 flex flex-col gap-2">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold text-emerald-400 uppercase tracking-wider">
                SOLD (Liquidated Today)
              </span>
              <span className="text-base font-mono font-extrabold text-emerald-300">
                ${step.sold}
              </span>
            </div>
            <p className="text-[11px] text-slate-400">
              hold + price &rarr; Cash in holding stock today. Forces mandatory cooldown tomorrow.
            </p>
          </div>

          <div className="bg-slate-950/80 border border-indigo-500/30 rounded-xl p-4 flex flex-col gap-2">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold text-indigo-400 uppercase tracking-wider">
                COOLDOWN / REST
              </span>
              <span className="text-base font-mono font-extrabold text-indigo-300">
                ${step.cooldown}
              </span>
            </div>
            <p className="text-[11px] text-slate-400">
              max(cooldown, prev_sold) &rarr; Rested today or cooling down from yesterday's sale.
            </p>
          </div>
        </div>
      </div>

      {/* History table */}
      <div className="bg-slate-900 border border-slate-800 rounded-xl p-3 max-h-28 overflow-x-auto">
        <div className="text-[11px] font-semibold text-slate-400 uppercase tracking-wide mb-1.5">
          Simulation History Across Days
        </div>
        <div className="flex gap-2">
          {step.history.map((h, idx) => (
            <div
              key={idx}
              className={`px-2.5 py-1 rounded text-xs font-mono border ${
                idx === step.day
                  ? 'bg-sky-950/70 border-sky-700 text-sky-200'
                  : 'bg-slate-950 border-slate-800 text-slate-300'
              }`}
            >
              Day {h.day}: Hold(${h.hold}), Sold(${h.sold}), Cool(${h.cooldown})
            </div>
          ))}
        </div>
      </div>

      {/* Step Explanation */}
      <div className="bg-slate-950 border border-slate-800 rounded-xl p-3 text-sm text-slate-300 flex items-center gap-2">
        <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse shrink-0" />
        <span>{step.explanation}</span>
      </div>
    </div>
  );
};
