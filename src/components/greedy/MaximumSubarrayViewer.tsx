import React from 'react';
import type { MaximumSubarrayStep } from '../../algorithms/maximumSubarrayIntuitive';

interface MaximumSubarrayViewerProps {
  step: MaximumSubarrayStep;
  nums: number[];
}

export const MaximumSubarrayViewer: React.FC<MaximumSubarrayViewerProps> = ({
  step,
  nums,
}) => {
  return (
    <div className="flex flex-col h-full gap-4 p-4 select-none">
      {/* Top Status & Variable Badges */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
        <div className="bg-slate-900 border border-slate-800 rounded-xl p-3 flex flex-col justify-center">
          <span className="text-xs text-slate-400 font-medium">Inspecting Index</span>
          <span className="text-base font-mono font-bold text-sky-400">
            idx = {step.index} (num = {step.currentNum})
          </span>
        </div>
        <div className="bg-slate-900 border border-slate-800 rounded-xl p-3 flex flex-col justify-center">
          <span className="text-xs text-slate-400 font-medium">Running Subarray Sum</span>
          <span className={`text-xl font-mono font-bold ${step.curSum >= 0 ? 'text-amber-400' : 'text-rose-400'}`}>
            {step.curSum}
          </span>
        </div>
        <div className="bg-slate-900 border border-slate-800 rounded-xl p-3 flex flex-col justify-center">
          <span className="text-xs text-slate-400 font-medium">Active Window</span>
          <span className="text-sm font-mono font-bold text-indigo-300">
            [{step.currentWindow[0]}..{step.currentWindow[1]}]
          </span>
        </div>
        <div className="bg-slate-900 border border-slate-800 rounded-xl p-3 flex flex-col justify-center">
          <span className="text-xs text-slate-400 font-medium">Max Subarray Sum</span>
          <span className="text-2xl font-mono font-black text-emerald-400">
            {step.maxSum}
          </span>
        </div>
      </div>

      {/* Main Array Canvas with Kadane's Window Overlay */}
      <div className="flex-1 bg-slate-900/60 border border-slate-800 rounded-xl p-6 flex flex-col justify-center items-center gap-8 relative overflow-hidden">
        {/* Reset Alert Banner */}
        {step.resetOccurred && (
          <div className="bg-rose-950/70 border border-rose-500/50 px-4 py-2 rounded-xl text-rose-300 text-xs font-semibold animate-bounce">
            ⚠️ Negative Prefix Detected! Dropped and restarted cur_sum = 0
          </div>
        )}

        {/* Array Visualization */}
        <div className="flex flex-col items-center gap-2">
          <div className="text-xs font-semibold text-slate-400 uppercase tracking-wider">
            Numbers Array (nums)
          </div>
          <div className="flex items-center gap-2 flex-wrap justify-center">
            {nums.map((num, idx) => {
              const isCurrent = idx === step.index;
              const inActive =
                idx >= step.currentWindow[0] && idx <= step.currentWindow[1];
              const inBest =
                idx >= step.bestWindow[0] && idx <= step.bestWindow[1];

              let border = 'border-slate-800';
              let bg = 'bg-slate-950/60';
              let text = 'text-slate-400';

              if (isCurrent) {
                border = 'border-sky-400 ring-2 ring-sky-400/40';
                bg = 'bg-sky-950/80';
                text = 'text-sky-200';
              } else if (inActive) {
                border = 'border-amber-400 ring-1 ring-amber-400/30';
                bg = 'bg-amber-950/40';
                text = 'text-amber-200';
              } else if (inBest) {
                border = 'border-emerald-600/70';
                bg = 'bg-emerald-950/30';
                text = 'text-emerald-300';
              }

              return (
                <div key={idx} className="flex flex-col items-center gap-1">
                  <span className="text-[10px] font-mono text-slate-500">[{idx}]</span>
                  <div
                    className={`w-13 h-14 rounded-xl border-2 flex items-center justify-center font-mono text-base font-bold transition-all relative ${border} ${bg} ${text}`}
                  >
                    {num}
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Best Subarray Tag */}
        <div className="bg-slate-950/80 border border-slate-800 rounded-xl px-5 py-2.5 flex items-center gap-4">
          <span className="text-xs text-slate-400">Current Best Subarray:</span>
          <span className="font-mono text-sm font-bold text-emerald-400">
            [{nums.slice(step.bestWindow[0], step.bestWindow[1] + 1).join(', ')}]
          </span>
          <span className="text-xs font-mono text-slate-400">
            (sum = {step.maxSum})
          </span>
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
