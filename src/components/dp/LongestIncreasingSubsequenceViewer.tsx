import React from 'react';
import type { LISStep } from '../../algorithms/longestIncreasingSubsequenceIntuitive';

interface LongestIncreasingSubsequenceViewerProps {
  step: LISStep;
  nums: number[];
}

export const LongestIncreasingSubsequenceViewer: React.FC<LongestIncreasingSubsequenceViewerProps> = ({
  step,
  nums,
}) => {
  return (
    <div className="flex flex-col h-full gap-4 p-4 select-none">
      {/* Top Status & Variable Badges */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
        <div className="bg-slate-900 border border-slate-800 rounded-xl p-3 flex flex-col justify-center">
          <span className="text-xs text-slate-400 font-medium">Outer Index i</span>
          <span className="text-base font-mono font-bold text-sky-400">
            {step.i >= 0 ? `i = ${step.i} (${nums[step.i]})` : '—'}
          </span>
        </div>
        <div className="bg-slate-900 border border-slate-800 rounded-xl p-3 flex flex-col justify-center">
          <span className="text-xs text-slate-400 font-medium">Inner Index j</span>
          <span className="text-base font-mono font-bold text-amber-300">
            {step.j >= 0 ? `j = ${step.j} (${nums[step.j]})` : '—'}
          </span>
        </div>
        <div className="bg-slate-900 border border-slate-800 rounded-xl p-3 flex flex-col justify-center">
          <span className="text-xs text-slate-400 font-medium">Extend Condition</span>
          <span className={`text-base font-bold ${step.canExtend ? 'text-emerald-400' : 'text-slate-400'}`}>
            {step.j >= 0 ? (step.canExtend ? 'nums[j] < nums[i] ✓' : 'nums[j] ≥ nums[i] ✗') : '—'}
          </span>
        </div>
        <div className="bg-slate-900 border border-slate-800 rounded-xl p-3 flex flex-col justify-center">
          <span className="text-xs text-slate-400 font-medium">Max LIS Length</span>
          <span className="text-2xl font-mono font-black text-emerald-400">
            {step.maxLen}
          </span>
        </div>
      </div>

      {/* Main Canvas: Elements Height Bars / Cards & DP Array */}
      <div className="flex-1 bg-slate-900/60 border border-slate-800 rounded-xl p-6 flex flex-col justify-center items-center gap-8 relative overflow-hidden">
        {/* Array Elements Visual */}
        <div className="flex flex-col items-center gap-2">
          <div className="text-xs font-semibold text-slate-400 uppercase tracking-wider">
            Numbers Array (nums)
          </div>
          <div className="flex items-center gap-2.5 flex-wrap justify-center">
            {nums.map((num, idx) => {
              const isI = idx === step.i;
              const isJ = idx === step.j;
              const inChain = step.activeChain.includes(idx);

              let border = 'border-slate-800';
              let bg = 'bg-slate-900/60';
              let text = 'text-slate-400';

              if (isI) {
                border = 'border-sky-400 ring-2 ring-sky-400/40';
                bg = 'bg-sky-950/80';
                text = 'text-sky-200';
              } else if (isJ) {
                border = step.canExtend ? 'border-emerald-400 ring-2 ring-emerald-400/30' : 'border-rose-400';
                bg = step.canExtend ? 'bg-emerald-950/80' : 'bg-rose-950/40';
                text = step.canExtend ? 'text-emerald-200' : 'text-rose-300';
              } else if (inChain) {
                border = 'border-amber-500/80';
                bg = 'bg-amber-950/40';
                text = 'text-amber-200';
              }

              return (
                <div key={idx} className="flex flex-col items-center gap-1">
                  <span className="text-[10px] font-mono text-slate-500">[{idx}]</span>
                  <div
                    className={`relative w-13 h-14 rounded-xl border-2 flex items-center justify-center font-mono text-lg font-bold transition-all duration-200 ${border} ${bg} ${text}`}
                  >
                    {num}
                    {isI && (
                      <span className="absolute -top-2.5 px-1 rounded bg-sky-500 text-slate-950 text-[9px] font-bold">
                        i
                      </span>
                    )}
                    {isJ && (
                      <span className="absolute -bottom-2.5 px-1 rounded bg-amber-400 text-slate-950 text-[9px] font-bold">
                        j
                      </span>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* DP Array */}
        <div className="flex flex-col items-center gap-2">
          <div className="text-xs font-semibold text-slate-400 uppercase tracking-wider">
            DP Array: dp[k] (Longest increasing subsequence ending at index k)
          </div>
          <div className="flex items-center gap-2.5 flex-wrap justify-center">
            {step.dp.map((val, idx) => {
              const isI = idx === step.i;
              const isJ = idx === step.j;

              return (
                <div key={idx} className="flex flex-col items-center gap-1">
                  <span className="text-[10px] font-mono text-slate-500">dp[{idx}]</span>
                  <div
                    className={`w-13 h-11 rounded-lg border text-sm font-mono font-bold flex items-center justify-center transition-all ${
                      isI
                        ? 'border-sky-400 bg-sky-950 text-sky-300 ring-2 ring-sky-400/30'
                        : isJ
                        ? 'border-amber-400 bg-amber-950/60 text-amber-300'
                        : 'border-slate-800 bg-slate-950/70 text-slate-300'
                    }`}
                  >
                    {val}
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Transition Formula Badge */}
        <div className="bg-slate-950/80 border border-slate-800 rounded-xl px-4 py-2 flex items-center gap-2 text-xs text-slate-400">
          <span className="font-semibold text-slate-300">Recurrence:</span>
          <span>if nums[j] &lt; nums[i], dp[i] = max(dp[i], 1 + dp[j])</span>
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
