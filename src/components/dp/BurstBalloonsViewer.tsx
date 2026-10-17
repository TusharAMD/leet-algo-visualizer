import React from 'react';
import type { BurstBalloonsStep } from '../../algorithms/burstBalloonsIntuitive';

interface BurstBalloonsViewerProps {
  step: BurstBalloonsStep;
  nums: number[];
}

export const BurstBalloonsViewer: React.FC<BurstBalloonsViewerProps> = ({
  step,
  nums,
}) => {
  const n = nums.length;

  return (
    <div className="flex flex-col h-full gap-4 p-4 select-none">
      {/* Top Status & Variable Badges */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
        <div className="bg-slate-900 border border-slate-800 rounded-xl p-3 flex flex-col justify-center">
          <span className="text-xs text-slate-400 font-medium">Sub-Interval [l, r]</span>
          <span className="text-base font-mono font-bold text-sky-400">
            {step.l > 0 ? `[${step.l}, ${step.r}] (len ${step.r - step.l + 1})` : '—'}
          </span>
        </div>
        <div className="bg-slate-900 border border-slate-800 rounded-xl p-3 flex flex-col justify-center">
          <span className="text-xs text-slate-400 font-medium">Burst Last in Interval</span>
          <span className="text-base font-mono font-bold text-amber-300">
            {step.k > 0 ? `Balloon ${step.k} (val=${step.lastVal})` : '—'}
          </span>
        </div>
        <div className="bg-slate-900 border border-slate-800 rounded-xl p-3 flex flex-col justify-center">
          <span className="text-xs text-slate-400 font-medium">Candidate Coins</span>
          <span className="text-base font-mono font-bold text-indigo-300">
            {step.calcCoins > 0 ? `${step.calcCoins} coins` : '0'}
          </span>
        </div>
        <div className="bg-slate-900 border border-slate-800 rounded-xl p-3 flex flex-col justify-center">
          <span className="text-xs text-slate-400 font-medium">Max Coins Collected</span>
          <span className="text-2xl font-mono font-black text-emerald-400">
            {step.dp[1]?.[n] ?? 0}
          </span>
        </div>
      </div>

      {/* Main Canvas: Balloons row & Calculation Formula Card */}
      <div className="flex-1 bg-slate-900/60 border border-slate-800 rounded-xl p-6 flex flex-col justify-center items-center gap-6 relative overflow-hidden">
        {/* Balloons Display */}
        <div className="flex flex-col items-center gap-2">
          <div className="text-xs font-semibold text-slate-400 uppercase tracking-wider">
            Padded Balloons Sequence (Virtual Boundaries [1])
          </div>
          <div className="flex items-center gap-3">
            {step.nums.map((val, idx) => {
              const isVirtualBoundary = idx === 0 || idx === step.nums.length - 1;
              const isLeftBoundary = idx === step.l - 1 && step.l > 0;
              const isRightBoundary = idx === step.r + 1 && step.r > 0;
              const isLast = idx === step.k;
              const inInterval = idx >= step.l && idx <= step.r && step.l > 0;

              let border = 'border-slate-800';
              let bg = 'bg-slate-950/60';
              let text = 'text-slate-400';

              if (isLast) {
                border = 'border-amber-400 ring-4 ring-amber-400/40';
                bg = 'bg-amber-950/80';
                text = 'text-amber-200';
              } else if (isLeftBoundary || isRightBoundary) {
                border = 'border-indigo-400 ring-2 ring-indigo-400/30';
                bg = 'bg-indigo-950/50';
                text = 'text-indigo-200';
              } else if (inInterval) {
                border = 'border-sky-500/80';
                bg = 'bg-sky-950/40';
                text = 'text-sky-200';
              } else if (isVirtualBoundary) {
                border = 'border-slate-800 border-dashed';
                bg = 'bg-slate-950/40';
                text = 'text-slate-500';
              }

              return (
                <div key={idx} className="flex flex-col items-center gap-1">
                  <span className="text-[10px] font-mono text-slate-500">
                    {isVirtualBoundary ? 'pad' : `[${idx}]`}
                  </span>
                  <div
                    className={`w-14 h-16 rounded-2xl border-2 flex flex-col items-center justify-center font-mono font-bold text-lg transition-all relative ${border} ${bg} ${text}`}
                  >
                    <span>🎈</span>
                    <span className="text-sm font-extrabold">{val}</span>
                    {isLast && (
                      <span className="text-[8px] absolute -bottom-2 px-1 rounded bg-amber-400 text-slate-950 font-sans font-bold">
                        Last
                      </span>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Dynamic Calculation Breakdown */}
        {step.k > 0 && (
          <div className="bg-slate-950/80 border border-slate-800 rounded-xl p-4 w-full max-w-lg flex flex-col gap-2">
            <div className="text-xs font-semibold text-slate-300 uppercase tracking-wide text-center">
              Coins Formula for Interval [{step.l}..{step.r}] with Balloon {step.k} Burst Last
            </div>
            <div className="bg-slate-900 border border-slate-800 rounded-lg p-3 text-center font-mono text-sm text-slate-200">
              <span className="text-indigo-300 font-bold">{step.leftBoundary}</span>
              {' &times; '}
              <span className="text-amber-300 font-bold">{step.lastVal}</span>
              {' &times; '}
              <span className="text-indigo-300 font-bold">{step.rightBoundary}</span>
              {' + '}
              <span className="text-sky-300 font-bold">dp[{step.l}][{step.k - 1}] ({step.dp[step.l]?.[step.k - 1] ?? 0})</span>
              {' + '}
              <span className="text-sky-300 font-bold">dp[{step.k + 1}][{step.r}] ({step.dp[step.k + 1]?.[step.r] ?? 0})</span>
              {' = '}
              <span className="text-emerald-400 font-extrabold">{step.calcCoins}</span>
            </div>
          </div>
        )}
      </div>

      {/* Step Explanation */}
      <div className="bg-slate-950 border border-slate-800 rounded-xl p-3 text-sm text-slate-300 flex items-center gap-2">
        <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse shrink-0" />
        <span>{step.explanation}</span>
      </div>
    </div>
  );
};
