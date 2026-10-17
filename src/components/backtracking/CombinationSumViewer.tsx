import React from 'react';
import { CombinationSumStep } from '../../algorithms/combinationSumIntuitive';
import { PlusCircle, CheckCircle2, ArrowRight, Layers, Award, ShieldAlert, Sparkles } from 'lucide-react';

interface CombinationSumViewerProps {
  step: CombinationSumStep;
}

export const CombinationSumViewer: React.FC<CombinationSumViewerProps> = ({ step }) => {
  const {
    candidates,
    target,
    currentIndex,
    currentCombination,
    currentSum,
    action,
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
            Sum Progress vs Target:
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

      {/* Main Arena: Left = Current Path & Candidates, Right = Discovered Combinations */}
      <div className="flex-1 min-h-0 grid grid-cols-1 md:grid-cols-12 gap-3 py-1 px-1">
        {/* Left: Candidates & Active Path */}
        <div className="md:col-span-7 bg-slate-950/60 border border-slate-800 rounded-xl p-2.5 flex flex-col justify-between overflow-hidden">
          {/* Candidates Row */}
          <div>
            <div className="text-[10px] uppercase font-semibold text-slate-400 mb-1 flex items-center justify-between">
              <span>Candidates Array:</span>
              <span className="text-slate-500 font-mono">Current i = {currentIndex}</span>
            </div>
            <div className="flex items-center gap-1.5 flex-wrap">
              {candidates.map((c, idx) => {
                const isActive = idx === currentIndex;
                return (
                  <div
                    key={idx}
                    className={`px-3 py-1 rounded-xl text-xs font-mono font-bold border transition-all ${
                      isActive
                        ? 'bg-amber-500/20 border-amber-400 text-amber-200 ring-2 ring-amber-400/50 scale-105'
                        : 'bg-slate-850 border-slate-700/80 text-slate-300'
                    }`}
                  >
                    {c}
                  </div>
                );
              })}
            </div>
          </div>

          {/* Current Path / Combination */}
          <div className="flex-1 flex flex-col justify-center items-center py-2">
            <span className="text-[10px] text-slate-500 uppercase font-semibold mb-1">
              Active Recursion Path (`cur`):
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

          <div className="text-[10px] text-slate-500 bg-slate-900/80 rounded-lg p-1.5 border border-slate-800/60 text-center shrink-0">
            Decision Tree: Branch 1 includes candidates[i] repeatedly; Branch 2 skips to i + 1.
          </div>
        </div>

        {/* Right: Valid Combinations */}
        <div className="md:col-span-5 bg-slate-950/60 border border-slate-800 rounded-xl p-2.5 flex flex-col justify-between overflow-hidden">
          <div className="flex items-center justify-between border-b border-slate-800/70 pb-1.5 shrink-0">
            <span className="text-xs font-semibold text-emerald-400 flex items-center gap-1.5">
              <Award className="w-3.5 h-3.5 text-emerald-400" />
              Valid Combinations Found
            </span>
            <span className="text-[10px] font-mono text-slate-400">
              {allCombinations.length} total
            </span>
          </div>

          <div className="flex-1 overflow-y-auto py-2 flex flex-col gap-1.5">
            {allCombinations.length === 0 ? (
              <span className="text-slate-600 text-xs italic text-center py-4">
                No combinations matching target yet
              </span>
            ) : (
              allCombinations.map((comb, idx) => (
                <div
                  key={idx}
                  className="flex items-center justify-between px-3 py-1.5 rounded-xl bg-emerald-500/10 border border-emerald-500/30 text-emerald-300 font-mono text-xs font-bold shadow"
                >
                  <span className="text-slate-400 text-[10px]">#{idx + 1}</span>
                  <span>[{comb.join(', ')}]</span>
                  <span className="text-[10px] text-emerald-400">sum: {target}</span>
                </div>
              ))
            )}
          </div>

          <div className="text-[10px] text-slate-500 bg-slate-900/80 rounded-lg p-1.5 border border-slate-800/60 text-center shrink-0">
            Uniqueness guaranteed by advancing index strictly to the right when skipping.
          </div>
        </div>
      </div>
    </div>
  );
};
