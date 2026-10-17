import React from 'react';
import type { MaximumProductSubarrayStep } from '../../algorithms/maximumProductSubarrayIntuitive';

interface MaximumProductSubarrayViewerProps {
  step: MaximumProductSubarrayStep;
  nums: number[];
}

export const MaximumProductSubarrayViewer: React.FC<MaximumProductSubarrayViewerProps> = ({
  step,
  nums,
}) => {
  return (
    <div className="flex flex-col h-full gap-4 p-4 select-none">
      {/* Top Status & Variable Badges */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
        <div className="bg-slate-900 border border-slate-800 rounded-xl p-3 flex flex-col justify-center">
          <span className="text-xs text-slate-400 font-medium">Current Index</span>
          <span className="text-base font-mono font-bold text-sky-400">
            idx = {step.currentIndex} (num = {step.currentNum})
          </span>
        </div>
        <div className="bg-slate-900 border border-slate-800 rounded-xl p-3 flex flex-col justify-center">
          <span className="text-xs text-slate-400 font-medium">Current Max Product</span>
          <span className="text-lg font-mono font-extrabold text-emerald-400">
            {step.curMax}
          </span>
        </div>
        <div className="bg-slate-900 border border-slate-800 rounded-xl p-3 flex flex-col justify-center">
          <span className="text-xs text-slate-400 font-medium">Current Min Product</span>
          <span className="text-lg font-mono font-extrabold text-amber-400">
            {step.curMin}
          </span>
        </div>
        <div className="bg-slate-900 border border-slate-800 rounded-xl p-3 flex flex-col justify-center">
          <span className="text-xs text-slate-400 font-medium">Global Max Product</span>
          <span className="text-2xl font-mono font-black text-indigo-400">
            {step.globalMax}
          </span>
        </div>
      </div>

      {/* Main Canvas: Array elements + Calculation Box */}
      <div className="flex-1 bg-slate-900/60 border border-slate-800 rounded-xl p-6 flex flex-col justify-center items-center gap-6 relative overflow-hidden">
        {/* Array visual */}
        <div className="flex flex-col items-center gap-2">
          <div className="text-xs font-semibold text-slate-400 uppercase tracking-wider">
            Numbers Array
          </div>
          <div className="flex items-center gap-2 flex-wrap justify-center">
            {nums.map((num, idx) => {
              const isCurrent = idx === step.currentIndex;
              const isPast = idx < step.currentIndex;

              return (
                <div key={idx} className="flex flex-col items-center gap-1">
                  <span className="text-[10px] font-mono text-slate-500">[{idx}]</span>
                  <div
                    className={`w-14 h-14 rounded-xl border-2 flex flex-col items-center justify-center font-mono text-lg font-bold transition-all duration-200 ${
                      isCurrent
                        ? 'border-indigo-400 bg-indigo-950/70 text-indigo-200 scale-110 shadow-lg shadow-indigo-500/25 ring-2 ring-indigo-400/40'
                        : isPast
                        ? 'border-slate-700 bg-slate-800/90 text-slate-300'
                        : 'border-slate-800 bg-slate-900/50 text-slate-500'
                    }`}
                  >
                    <span>{num}</span>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* 3 Candidates Comparison Panel */}
        <div className="w-full max-w-xl bg-slate-950/80 border border-slate-800 rounded-xl p-4 flex flex-col gap-3">
          <div className="text-xs font-semibold text-slate-400 uppercase tracking-wider text-center">
            Candidate Calculations at Index {step.currentIndex}
          </div>
          <div className="grid grid-cols-3 gap-3">
            <div className="bg-slate-900 border border-slate-800 rounded-lg p-2.5 flex flex-col items-center">
              <span className="text-[11px] text-slate-400">Alone</span>
              <span className="text-xs font-mono text-slate-300 mt-1">num</span>
              <span className="text-base font-mono font-bold text-sky-300 mt-1">
                {step.candidates.num}
              </span>
            </div>
            <div className="bg-slate-900 border border-slate-800 rounded-lg p-2.5 flex flex-col items-center">
              <span className="text-[11px] text-slate-400">With Prev Max</span>
              <span className="text-xs font-mono text-slate-300 mt-1">num &times; prevMax</span>
              <span className="text-base font-mono font-bold text-emerald-300 mt-1">
                {step.candidates.numTimesPrevMax}
              </span>
            </div>
            <div className="bg-slate-900 border border-slate-800 rounded-lg p-2.5 flex flex-col items-center">
              <span className="text-[11px] text-slate-400">With Prev Min</span>
              <span className="text-xs font-mono text-slate-300 mt-1">num &times; prevMin</span>
              <span className="text-base font-mono font-bold text-amber-300 mt-1">
                {step.candidates.numTimesPrevMin}
              </span>
            </div>
          </div>
          <div className="text-[11px] text-slate-400 text-center italic mt-1">
            Tracking min handles double negatives: multiplying a negative by a minimum negative yields a large positive!
          </div>
        </div>
      </div>

      {/* History table */}
      <div className="bg-slate-900 border border-slate-800 rounded-xl p-3 max-h-28 overflow-x-auto">
        <div className="text-[11px] font-semibold text-slate-400 uppercase tracking-wide mb-1.5">
          History (index &rarr; max ending here / min ending here)
        </div>
        <div className="flex gap-2">
          {step.history.map((h, idx) => (
            <div
              key={idx}
              className={`px-2.5 py-1 rounded text-xs font-mono border ${
                idx === step.currentIndex
                  ? 'bg-indigo-950/70 border-indigo-700 text-indigo-300'
                  : 'bg-slate-950 border-slate-800 text-slate-300'
              }`}
            >
              i={h.index}: max={h.maxProd}, min={h.minProd}
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
