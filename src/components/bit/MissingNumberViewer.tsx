import React from 'react';
import type { MissingNumberStep } from '../../algorithms/missingNumberIntuitive';
import { HelpCircle, CheckCircle2 } from 'lucide-react';

interface MissingNumberViewerProps {
  step: MissingNumberStep;
  nums: number[];
}

export const MissingNumberViewer: React.FC<MissingNumberViewerProps> = ({ step, nums }) => {
  const n = nums.length;
  const numSet = new Set(nums);

  return (
    <div className="flex flex-col h-full gap-3 p-4 select-none">
      {/* Top Status & Variable Badges */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
        <div className="bg-slate-900 border border-slate-800 rounded-xl p-3 flex flex-col justify-center">
          <span className="text-xs text-slate-400 font-medium">Index & Value</span>
          <span className="text-base font-mono font-bold text-sky-400">
            {step.currentIndex >= 0 && step.currentIndex < n
              ? `i = ${step.currentIndex}, nums[i] = ${step.currentNum}`
              : '—'}
          </span>
        </div>
        <div className="bg-slate-900 border border-slate-800 rounded-xl p-3 flex flex-col justify-center">
          <span className="text-xs text-slate-400 font-medium">Accumulator (res)</span>
          <span className="text-2xl font-mono font-black text-amber-300">
            {step.newRes}
          </span>
        </div>
        <div className="bg-slate-900 border border-slate-800 rounded-xl p-3 flex flex-col justify-center">
          <span className="text-xs text-slate-400 font-medium">Expected Range</span>
          <span className="text-base font-mono font-bold text-indigo-300">
            [0 .. {n}]
          </span>
        </div>
        <div className="bg-slate-900 border border-slate-800 rounded-xl p-3 flex flex-col justify-center">
          <span className="text-xs text-slate-400 font-medium">Missing Value</span>
          <span className="text-2xl font-mono font-black text-emerald-400">
            {step.currentIndex >= n ? step.newRes : 'Searching...'}
          </span>
        </div>
      </div>

      {/* Main Range & Array Comparison Canvas */}
      <div className="flex-1 bg-slate-900/60 border border-slate-800 rounded-xl p-6 flex flex-col justify-between items-center gap-6 relative overflow-hidden">
        {/* Full Expected Range [0 .. n] */}
        <div className="w-full flex flex-col items-center gap-1.5">
          <div className="text-xs font-semibold text-indigo-300 uppercase tracking-wider flex items-center justify-between w-full max-w-2xl">
            <span>Expected Set (0 to {n})</span>
            <span className="text-[11px] font-mono text-slate-400">Contains {n + 1} integers</span>
          </div>
          <div className="flex items-center gap-2 flex-wrap justify-center max-w-2xl">
            {Array.from({ length: n + 1 }, (_, idx) => {
              const isPresentInNums = numSet.has(idx);
              const isFinalMissing = step.currentIndex >= n && idx === step.newRes;

              let style = 'bg-slate-950 border-slate-800 text-slate-400';
              if (isFinalMissing) {
                style = 'bg-emerald-600 border-emerald-300 text-white shadow-lg shadow-emerald-500/40 scale-110 animate-bounce';
              } else if (!isPresentInNums && step.currentIndex >= n) {
                style = 'bg-rose-950 border-rose-500 text-rose-300';
              } else if (isPresentInNums) {
                style = 'bg-indigo-950/60 border-indigo-700/60 text-indigo-200';
              }

              return (
                <div
                  key={idx}
                  className={`w-11 h-12 rounded-xl border-2 flex items-center justify-center font-mono text-base font-bold transition-all ${style}`}
                >
                  {idx}
                </div>
              );
            })}
          </div>
        </div>

        {/* Given Array nums */}
        <div className="w-full flex flex-col items-center gap-1.5">
          <div className="text-xs font-semibold text-sky-400 uppercase tracking-wider flex items-center justify-between w-full max-w-2xl">
            <span>Given Array nums ({nums.length} elements)</span>
            <span className="text-[11px] font-mono text-slate-400">Index pointer: i</span>
          </div>
          <div className="flex items-center gap-2 flex-wrap justify-center max-w-2xl">
            {nums.map((num, idx) => {
              const isCurrent = idx === step.currentIndex;
              return (
                <div key={idx} className="flex flex-col items-center gap-0.5">
                  <div
                    className={`w-11 h-12 rounded-xl border-2 flex items-center justify-center font-mono text-base font-bold transition-all ${
                      isCurrent
                        ? 'bg-amber-600 border-amber-300 text-white shadow-lg shadow-amber-500/40 scale-110 z-10'
                        : 'bg-slate-950 border-slate-800 text-slate-300'
                    }`}
                  >
                    {num}
                  </div>
                  <span className="text-[9px] font-mono text-slate-400">i={idx}</span>
                </div>
              );
            })}
          </div>
        </div>

        {/* Bottom Explanation Banner */}
        <div className="w-full bg-slate-950/80 border border-slate-800/80 rounded-xl px-4 py-2.5 text-xs text-slate-300 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <HelpCircle className="w-4 h-4 text-indigo-400 shrink-0" />
            <span>{step.explanation}</span>
          </div>
          {step.currentIndex >= n && (
            <span className="text-emerald-400 font-semibold flex items-center gap-1 shrink-0">
              <CheckCircle2 className="w-4 h-4" /> Missing: {step.newRes}
            </span>
          )}
        </div>
      </div>
    </div>
  );
};
