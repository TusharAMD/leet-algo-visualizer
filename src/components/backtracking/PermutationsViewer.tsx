import React from 'react';
import { PermutationsStep } from '../../algorithms/permutationsIntuitive';
import { Shuffle, CheckCircle2, ArrowRight, Layers, Sparkles, Database, Check } from 'lucide-react';

interface PermutationsViewerProps {
  step: PermutationsStep;
}

export const PermutationsViewer: React.FC<PermutationsViewerProps> = ({ step }) => {
  const {
    nums,
    currentPermutation,
    remainingPool,
    activePicked,
    allPermutations,
    headline,
    subtext,
    isComplete,
    stepIndex,
    totalSteps
  } = step;

  return (
    <div className="flex-1 min-h-0 flex flex-col bg-slate-900/60 border border-slate-800 rounded-2xl p-3 shadow-xl overflow-hidden justify-between">
      {/* Top Banner */}
      <div className="bg-slate-950/70 border border-slate-800/80 rounded-xl p-2.5 flex items-center justify-between shrink-0">
        <div className="flex items-center gap-2">
          <span className="p-1.5 rounded-lg bg-indigo-500/10 text-indigo-400 border border-indigo-500/20">
            <Shuffle className="w-4 h-4" />
          </span>
          <div>
            <h3 className="text-xs font-semibold text-white tracking-wide">{headline}</h3>
            <p className="text-[11px] text-slate-400">{subtext}</p>
          </div>
        </div>
        <div className="flex items-center gap-2">
          {allPermutations.length > 0 && (
            <span className="px-2 py-0.5 rounded-md bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 text-[11px] font-semibold flex items-center gap-1">
              <CheckCircle2 className="w-3.5 h-3.5" /> Found {allPermutations.length}
            </span>
          )}
          <span className="px-2 py-0.5 rounded-md bg-indigo-500/10 border border-indigo-500/20 text-indigo-400 text-[11px] font-mono">
            Step {stepIndex + 1} / {totalSteps}
          </span>
        </div>
      </div>

      {/* Main Arena: Left = Active Slots & Pool, Right = Collected Permutations */}
      <div className="flex-1 min-h-0 grid grid-cols-1 md:grid-cols-12 gap-3 py-1 px-1">
        {/* Left Arena */}
        <div className="md:col-span-7 bg-slate-950/60 border border-slate-800 rounded-xl p-2.5 flex flex-col justify-between overflow-hidden">
          {/* Active Slots Container */}
          <div>
            <div className="flex items-center justify-between text-[10px] text-slate-400 font-semibold uppercase mb-1.5">
              <span>Current Permutation Slots (`cur`):</span>
              <span className="font-mono">
                {currentPermutation.length} / {nums.length} filled
              </span>
            </div>

            <div className="flex items-center gap-2 py-2 justify-center">
              {nums.map((_, slotIdx) => {
                const filledVal = currentPermutation[slotIdx];
                const isFilled = filledVal !== undefined;
                const isJustPicked = filledVal === activePicked && slotIdx === currentPermutation.length - 1;

                return (
                  <div key={slotIdx} className="flex flex-col items-center">
                    <span className="text-[8px] font-mono text-slate-500 mb-0.5">
                      Slot {slotIdx + 1}
                    </span>
                    <div
                      className={`w-12 h-12 rounded-2xl flex items-center justify-center font-mono font-bold text-base border shadow-md transition-all ${
                        isJustPicked
                          ? 'bg-amber-500/25 border-amber-400 text-amber-200 ring-2 ring-amber-400 scale-105'
                          : isFilled
                          ? 'bg-indigo-500/20 border-indigo-500/50 text-indigo-200'
                          : 'bg-slate-900 border-dashed border-slate-700 text-slate-600'
                      }`}
                    >
                      {isFilled ? filledVal : '—'}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Remaining Elements Pool */}
          <div className="bg-slate-900/60 border border-slate-800 rounded-xl p-2 shrink-0">
            <span className="text-[10px] uppercase font-semibold text-slate-400 block mb-1">
              Available Elements in Pool:
            </span>
            <div className="flex items-center gap-2 flex-wrap min-h-[32px]">
              {remainingPool.length === 0 ? (
                <span className="text-slate-600 text-xs italic">Pool empty (all slots filled)</span>
              ) : (
                remainingPool.map((val, idx) => (
                  <div
                    key={idx}
                    className="px-3 py-1 rounded-xl bg-slate-850 border border-slate-700 text-slate-200 font-mono font-bold text-xs"
                  >
                    {val}
                  </div>
                ))
              )}
            </div>
          </div>

          <div className="text-[10px] text-slate-500 bg-slate-900/80 rounded-lg p-1.5 border border-slate-800/60 text-center shrink-0">
            State Space Tree: Branching factor decreases by 1 at each recursion depth level.
          </div>
        </div>

        {/* Right: Collected Permutations Grid */}
        <div className="md:col-span-5 bg-slate-950/60 border border-slate-800 rounded-xl p-2.5 flex flex-col justify-between overflow-hidden">
          <div className="flex items-center justify-between border-b border-slate-800/70 pb-1.5 shrink-0">
            <span className="text-xs font-semibold text-emerald-400 flex items-center gap-1.5">
              <Sparkles className="w-3.5 h-3.5" />
              Generated Permutations (`res`)
            </span>
            <span className="text-[10px] font-mono text-slate-400">
              {allPermutations.length} permutations
            </span>
          </div>

          <div className="flex-1 overflow-y-auto py-2 grid grid-cols-2 gap-1.5 content-start">
            {allPermutations.length === 0 ? (
              <span className="text-slate-600 text-xs italic col-span-2 text-center py-4">
                No full permutations assembled yet
              </span>
            ) : (
              allPermutations.map((perm, idx) => (
                <div
                  key={idx}
                  className="flex items-center justify-between px-2.5 py-1.5 rounded-xl bg-emerald-500/10 border border-emerald-500/30 text-emerald-300 font-mono text-xs font-bold shadow"
                >
                  <span className="text-slate-500 text-[9px]">#{idx + 1}</span>
                  <span>[{perm.join(', ')}]</span>
                </div>
              ))
            )}
          </div>

          <div className="text-[10px] text-slate-500 bg-slate-900/80 rounded-lg p-1.5 border border-slate-800/60 text-center shrink-0">
            Time Complexity: O(N! * N) to generate and copy each permutation.
          </div>
        </div>
      </div>
    </div>
  );
};
