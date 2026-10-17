import React from 'react';
import { SubsetsTwoStep } from '../../algorithms/subsetsTwoIntuitive';
import { Network, CheckCircle2, ArrowRight, Layers, Sparkles, ShieldAlert, CopyCheck } from 'lucide-react';

interface SubsetsTwoViewerProps {
  step: SubsetsTwoStep;
}

export const SubsetsTwoViewer: React.FC<SubsetsTwoViewerProps> = ({ step }) => {
  const {
    nums,
    currentIndex,
    currentSubset,
    action,
    skippedValue,
    allSubsets,
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
            <CopyCheck className="w-4 h-4" />
          </span>
          <div>
            <h3 className="text-xs font-semibold text-white tracking-wide">{headline}</h3>
            <p className="text-[11px] text-slate-400">{subtext}</p>
          </div>
        </div>
        <div className="flex items-center gap-2">
          {allSubsets.length > 0 && (
            <span className="px-2 py-0.5 rounded-md bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 text-[11px] font-semibold flex items-center gap-1">
              <CheckCircle2 className="w-3.5 h-3.5" /> {allSubsets.length} Subsets
            </span>
          )}
          <span className="px-2 py-0.5 rounded-md bg-indigo-500/10 border border-indigo-500/20 text-indigo-400 text-[11px] font-mono">
            Step {stepIndex + 1} / {totalSteps}
          </span>
        </div>
      </div>

      {/* Main Arena: Left = Array & Subset, Right = Subsets Grid */}
      <div className="flex-1 min-h-0 grid grid-cols-1 md:grid-cols-12 gap-3 py-1 px-1">
        {/* Left Arena */}
        <div className="md:col-span-7 bg-slate-950/60 border border-slate-800 rounded-xl p-2.5 flex flex-col justify-between overflow-hidden">
          {/* Sorted Numbers Array */}
          <div>
            <div className="flex items-center justify-between text-[10px] text-slate-400 font-semibold uppercase mb-1.5">
              <span>Sorted Input (`nums`):</span>
              <span className="font-mono">Current i = {currentIndex}</span>
            </div>

            <div className="flex items-center gap-2 py-1 flex-wrap">
              {nums.map((val, idx) => {
                const isActive = idx === currentIndex;
                const isDuplicate = idx > 0 && nums[idx] === nums[idx - 1];

                return (
                  <div
                    key={idx}
                    className={`relative px-3 py-1.5 rounded-xl font-mono font-bold text-xs border transition-all ${
                      isActive
                        ? 'bg-amber-500/20 border-amber-400 text-amber-200 ring-2 ring-amber-400/50 scale-105'
                        : isDuplicate
                        ? 'bg-slate-900 border-indigo-500/30 text-indigo-300'
                        : 'bg-slate-850 border-slate-700/80 text-slate-200'
                    }`}
                  >
                    {val}
                    {isDuplicate && (
                      <span className="absolute -top-1.5 -right-1 text-[7px] bg-indigo-500/20 border border-indigo-500/40 text-indigo-300 px-1 rounded-full">
                        dup
                      </span>
                    )}
                  </div>
                );
              })}
            </div>
          </div>

          {/* Active Subset Display */}
          <div className="flex-1 flex flex-col justify-center items-center py-2">
            <span className="text-[10px] text-slate-500 uppercase font-semibold mb-1">
              Current Subset (`subset`):
            </span>
            {currentSubset.length === 0 ? (
              <div className="px-3 py-1 rounded-xl bg-slate-900 border border-slate-800 text-slate-500 text-xs font-mono">
                Empty Subset [ ]
              </div>
            ) : (
              <div className="flex items-center gap-1.5 flex-wrap justify-center">
                {currentSubset.map((val, idx) => (
                  <div
                    key={idx}
                    className="px-3 py-1.5 rounded-xl bg-indigo-500/20 border border-indigo-400 text-indigo-200 font-mono font-bold text-sm shadow-md"
                  >
                    {val}
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Duplicate Skipping Banner if triggered */}
          {skippedValue !== null && (
            <div className="bg-amber-500/10 border border-amber-500/30 rounded-lg p-1.5 flex items-center gap-1.5 text-xs text-amber-300 shrink-0">
              <ShieldAlert className="w-3.5 h-3.5 shrink-0" />
              <span className="text-[10px]">
                Skipping identical duplicate '{skippedValue}' to avoid generating duplicate branches.
              </span>
            </div>
          )}

          <div className="text-[10px] text-slate-500 bg-slate-900/80 rounded-lg p-1.5 border border-slate-800/60 text-center shrink-0">
            Invariant: After skipping, next branch advances past all identical elements in one leap.
          </div>
        </div>

        {/* Right: Collected Unique Subsets Grid */}
        <div className="md:col-span-5 bg-slate-950/60 border border-slate-800 rounded-xl p-2.5 flex flex-col justify-between overflow-hidden">
          <div className="flex items-center justify-between border-b border-slate-800/70 pb-1.5 shrink-0">
            <span className="text-xs font-semibold text-emerald-400 flex items-center gap-1.5">
              <Sparkles className="w-3.5 h-3.5" />
              Unique Subsets (`res`)
            </span>
            <span className="text-[10px] font-mono text-slate-400">
              {allSubsets.length} collected
            </span>
          </div>

          <div className="flex-1 overflow-y-auto py-2 grid grid-cols-2 gap-1.5 content-start">
            {allSubsets.length === 0 ? (
              <span className="text-slate-600 text-xs italic col-span-2 text-center py-4">
                No subsets collected yet
              </span>
            ) : (
              allSubsets.map((sub, idx) => (
                <div
                  key={idx}
                  className="flex items-center justify-between px-2.5 py-1.5 rounded-xl bg-emerald-500/10 border border-emerald-500/30 text-emerald-300 font-mono text-xs font-bold shadow"
                >
                  <span className="text-slate-500 text-[9px]">#{idx + 1}</span>
                  <span>[{sub.join(', ')}]</span>
                </div>
              ))
            )}
          </div>

          <div className="text-[10px] text-slate-500 bg-slate-900/80 rounded-lg p-1.5 border border-slate-800/60 text-center shrink-0">
            Total Unique Subsets: &lt;= 2^N (bounded tightly when duplicates present).
          </div>
        </div>
      </div>
    </div>
  );
};
