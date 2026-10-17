import React from 'react';
import { CombinationSumTwoStep } from '../../algorithms/combinationSumTwoIntuitive';
import { PlusCircle, CheckCircle2, ShieldAlert, Award, Sparkles, Filter } from 'lucide-react';

interface CombinationSumTwoViewerProps {
  step: CombinationSumTwoStep;
}

export const CombinationSumTwoViewer: React.FC<CombinationSumTwoViewerProps> = ({ step }) => {
  const {
    candidates,
    target,
    currentIndex,
    currentCombination,
    currentSum,
    action,
    skippedVal,
    allCombinations,
    headline,
    subtext,
    isComplete,
    stepIndex,
    totalSteps
  } = step;

  const percent = Math.min(100, Math.round((currentSum / target) * 100));
  const isMatch = currentSum === target;
  const isOverflow = currentSum > target;

  return (
    <div className="flex-1 min-h-0 flex flex-col bg-slate-900/60 border border-slate-800 rounded-2xl p-3 shadow-xl overflow-hidden justify-between">
      {/* Top Banner */}
      <div className="bg-slate-950/70 border border-slate-800/80 rounded-xl p-2.5 flex items-center justify-between shrink-0">
        <div className="flex items-center gap-2">
          <span className="p-1.5 rounded-lg bg-indigo-500/10 text-indigo-400 border border-indigo-500/20">
            <PlusCircle className="w-4 h-4" />
          </span>
          <div>
            <h3 className="text-xs font-semibold text-white tracking-wide">{headline}</h3>
            <p className="text-[11px] text-slate-400">{subtext}</p>
          </div>
        </div>
        <div className="flex items-center gap-2">
          {allCombinations.length > 0 && (
            <span className="px-2 py-0.5 rounded-md bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 text-[11px] font-semibold flex items-center gap-1">
              <CheckCircle2 className="w-3.5 h-3.5" /> {allCombinations.length} Match(es)
            </span>
          )}
          <span className="px-2 py-0.5 rounded-md bg-indigo-500/10 border border-indigo-500/20 text-indigo-400 text-[11px] font-mono">
            Step {stepIndex + 1} / {totalSteps}
          </span>
        </div>
      </div>

      {/* Target Progress Meter */}
      <div className="bg-slate-950/50 border border-slate-800/70 rounded-xl p-2 shrink-0 flex flex-col gap-1">
        <div className="flex items-center justify-between text-xs font-mono">
          <span className="text-[10px] uppercase font-bold text-slate-400">
            Progress vs Target:
          </span>
          <span
            className={`font-bold ${
              isMatch
                ? 'text-emerald-400'
                : isOverflow
                ? 'text-rose-400'
                : 'text-indigo-300'
            }`}
          >
            {currentSum} / {target} ({percent}%)
          </span>
        </div>
        <div className="w-full bg-slate-900 h-2 rounded-full overflow-hidden border border-slate-800">
          <div
            className={`h-full transition-all duration-200 ${
              isMatch
                ? 'bg-emerald-400'
                : isOverflow
                ? 'bg-rose-500'
                : 'bg-indigo-500'
            }`}
            style={{ width: `${percent}%` }}
          />
        </div>
      </div>

      {/* Main Arena */}
      <div className="flex-1 min-h-0 grid grid-cols-1 md:grid-cols-12 gap-3 py-1 px-1">
        {/* Left: Sorted Candidates & Active Path */}
        <div className="md:col-span-7 bg-slate-950/60 border border-slate-800 rounded-xl p-2.5 flex flex-col justify-between overflow-hidden">
          {/* Candidates Row */}
          <div>
            <div className="text-[10px] uppercase font-semibold text-slate-400 mb-1 flex items-center justify-between">
              <span>Sorted Candidates (Each Used Once):</span>
              <span className="text-slate-500 font-mono">Current i = {currentIndex}</span>
            </div>
            <div className="flex items-center gap-1.5 flex-wrap">
              {candidates.map((c, idx) => {
                const isActive = idx === currentIndex;
                const isDuplicate = idx > 0 && candidates[idx] === candidates[idx - 1];
                return (
                  <div
                    key={idx}
                    className={`relative px-3 py-1.5 rounded-xl text-xs font-mono font-bold border transition-all ${
                      isActive
                        ? 'bg-amber-500/20 border-amber-400 text-amber-200 ring-2 ring-amber-400/50 scale-105'
                        : isDuplicate
                        ? 'bg-slate-900 border-indigo-500/40 text-indigo-300'
                        : 'bg-slate-850 border-slate-700/80 text-slate-200'
                    }`}
                  >
                    {c}
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

          {/* Active Path */}
          <div className="flex-1 flex flex-col justify-center items-center py-2">
            <span className="text-[10px] text-slate-500 uppercase font-semibold mb-1">
              Active Combination (`cur`):
            </span>
            {currentCombination.length === 0 ? (
              <span className="text-slate-600 text-xs italic">Empty path []</span>
            ) : (
              <div className="flex items-center gap-1.5 flex-wrap justify-center">
                {currentCombination.map((val, idx) => (
                  <React.Fragment key={idx}>
                    <div
                      className={`px-3 py-1.5 rounded-xl font-mono font-bold text-sm border shadow-md ${
                        isMatch
                          ? 'bg-emerald-500/20 border-emerald-400 text-emerald-200'
                          : isOverflow
                          ? 'bg-rose-500/20 border-rose-400 text-rose-200'
                          : 'bg-indigo-500/20 border-indigo-400 text-indigo-200'
                      }`}
                    >
                      {val}
                    </div>
                    {idx < currentCombination.length - 1 && (
                      <span className="text-slate-500 text-xs font-bold">+</span>
                    )}
                  </React.Fragment>
                ))}
                <span className="text-slate-400 text-xs font-bold font-mono">
                  = {currentSum}
                </span>
              </div>
            )}
          </div>

          {/* Duplicate skipped alert */}
          {skippedVal !== null && (
            <div className="bg-amber-500/10 border border-amber-500/30 rounded-lg p-1.5 flex items-center gap-1.5 text-xs text-amber-300 shrink-0">
              <ShieldAlert className="w-3.5 h-3.5 shrink-0" />
              <span className="text-[10px]">
                Skipped duplicate value '{skippedVal}' at this tree level (`candidates[i] == prev`).
              </span>
            </div>
          )}

          <div className="text-[10px] text-slate-500 bg-slate-900/80 rounded-lg p-1.5 border border-slate-800/60 text-center shrink-0">
            Duplicate pruning: Skipping identical siblings at the same recursion depth ensures no duplicate combinations.
          </div>
        </div>

        {/* Right: Valid Combinations */}
        <div className="md:col-span-5 bg-slate-950/60 border border-slate-800 rounded-xl p-2.5 flex flex-col justify-between overflow-hidden">
          <div className="flex items-center justify-between border-b border-slate-800/70 pb-1.5 shrink-0">
            <span className="text-xs font-semibold text-emerald-400 flex items-center gap-1.5">
              <Award className="w-3.5 h-3.5 text-emerald-400" />
              Unique Combinations
            </span>
            <span className="text-[10px] font-mono text-slate-400">
              {allCombinations.length} total
            </span>
          </div>

          <div className="flex-1 overflow-y-auto py-2 flex flex-col gap-1.5">
            {allCombinations.length === 0 ? (
              <span className="text-slate-600 text-xs italic text-center py-4">
                No matching combinations found yet
              </span>
            ) : (
              allCombinations.map((comb, idx) => (
                <div
                  key={idx}
                  className="flex items-center justify-between px-3 py-1.5 rounded-xl bg-emerald-500/10 border border-emerald-500/30 text-emerald-300 font-mono text-xs font-bold shadow"
                >
                  <span className="text-slate-400 text-[10px]">#{idx + 1}</span>
                  <span>[{comb.join(', ')}]</span>
                  <span className="text-[10px] text-emerald-400">target: {target}</span>
                </div>
              ))
            )}
          </div>

          <div className="text-[10px] text-slate-500 bg-slate-900/80 rounded-lg p-1.5 border border-slate-800/60 text-center shrink-0">
            Each number in candidate array used at most once per combination.
          </div>
        </div>
      </div>
    </div>
  );
};
