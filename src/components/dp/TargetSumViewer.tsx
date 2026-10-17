import React from 'react';
import type { TargetSumStep } from '../../algorithms/targetSumIntuitive';

interface TargetSumViewerProps {
  step: TargetSumStep;
  nums: number[];
  target: number;
}

export const TargetSumViewer: React.FC<TargetSumViewerProps> = ({
  step,
  nums,
  target,
}) => {
  const sortedSums = Object.keys(step.waysMap)
    .map(Number)
    .sort((a, b) => a - b);

  return (
    <div className="flex flex-col h-full gap-4 p-4 select-none">
      {/* Top Status & Variable Badges */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
        <div className="bg-slate-900 border border-slate-800 rounded-xl p-3 flex flex-col justify-center">
          <span className="text-xs text-slate-400 font-medium">Array Index</span>
          <span className="text-base font-mono font-bold text-sky-400">
            {step.index >= 0 ? `i = ${step.index} (${nums[step.index]})` : 'Start'}
          </span>
        </div>
        <div className="bg-slate-900 border border-slate-800 rounded-xl p-3 flex flex-col justify-center">
          <span className="text-xs text-slate-400 font-medium">Target Value</span>
          <span className="text-base font-mono font-bold text-amber-300">
            target = {target}
          </span>
        </div>
        <div className="bg-slate-900 border border-slate-800 rounded-xl p-3 flex flex-col justify-center">
          <span className="text-xs text-slate-400 font-medium">Reachable Sums</span>
          <span className="text-base font-mono font-bold text-indigo-300">
            {sortedSums.length} sums
          </span>
        </div>
        <div className="bg-slate-900 border border-slate-800 rounded-xl p-3 flex flex-col justify-center">
          <span className="text-xs text-slate-400 font-medium">Ways to Reach Target</span>
          <span className="text-2xl font-mono font-extrabold text-emerald-400">
            {step.waysMap[target] ?? 0}
          </span>
        </div>
      </div>

      {/* Main Canvas: Nums Array + Frequency Distribution of Sums */}
      <div className="flex-1 bg-slate-900/60 border border-slate-800 rounded-xl p-6 flex flex-col justify-center items-center gap-6 relative overflow-hidden">
        {/* Numbers Array Visual */}
        <div className="flex flex-col items-center gap-2">
          <div className="text-xs font-semibold text-slate-400 uppercase tracking-wider">
            Input Numbers Array
          </div>
          <div className="flex items-center gap-2.5">
            {nums.map((num, idx) => {
              const isCurrent = idx === step.index;
              const isPast = idx < step.index;

              return (
                <div key={idx} className="flex flex-col items-center gap-1">
                  <span className="text-[10px] font-mono text-slate-500">[{idx}]</span>
                  <div
                    className={`w-12 h-14 rounded-xl border-2 flex items-center justify-center font-mono text-base font-bold transition-all ${
                      isCurrent
                        ? 'border-amber-400 bg-amber-950/70 text-amber-200 scale-110 shadow-lg shadow-amber-500/20 ring-2 ring-amber-400/40'
                        : isPast
                        ? 'border-emerald-600/70 bg-emerald-950/40 text-emerald-300'
                        : 'border-slate-800 bg-slate-950/60 text-slate-500'
                    }`}
                  >
                    {num}
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Sums Histogram / Badges */}
        <div className="flex flex-col items-center gap-2 w-full max-w-2xl">
          <div className="text-xs font-semibold text-slate-400 uppercase tracking-wider">
            DP State Map: (sum &rarr; number of ways)
          </div>
          <div className="flex flex-wrap gap-2 justify-center max-h-48 overflow-y-auto p-2 bg-slate-950/60 border border-slate-800/80 rounded-xl w-full">
            {sortedSums.map((sVal) => {
              const count = step.waysMap[sVal];
              const isTarget = sVal === target;

              return (
                <div
                  key={sVal}
                  className={`px-3 py-1.5 rounded-lg border font-mono text-xs flex items-center gap-2 transition-all ${
                    isTarget
                      ? 'border-emerald-400 bg-emerald-950 text-emerald-200 font-extrabold ring-2 ring-emerald-400/40 scale-105'
                      : 'border-slate-800 bg-slate-900 text-slate-300'
                  }`}
                >
                  <span className={isTarget ? 'text-emerald-300' : 'text-slate-400'}>
                    Sum {sVal > 0 ? `+${sVal}` : `${sVal}`}:
                  </span>
                  <span className={isTarget ? 'text-emerald-400 font-bold' : 'text-indigo-300 font-bold'}>
                    {count} {count === 1 ? 'way' : 'ways'}
                  </span>
                </div>
              );
            })}
          </div>
        </div>

        {/* Transition Badge */}
        <div className="bg-slate-950/80 border border-slate-800 rounded-xl px-4 py-2 flex items-center gap-3 text-xs text-slate-400">
          <span className="font-semibold text-slate-300">Binary Tree DP Branching:</span>
          <span>Each sum branches into (sum + num) and (sum - num)</span>
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
