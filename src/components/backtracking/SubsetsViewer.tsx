import React from 'react';
import { SubsetsStep } from '../../algorithms/subsetsIntuitive';
import { GitFork, CheckCircle2, Plus, Minus, Check } from 'lucide-react';

interface SubsetsViewerProps {
  step: SubsetsStep;
  nums: number[];
}

export const SubsetsViewer: React.FC<SubsetsViewerProps> = ({ step, nums }) => {
  return (
    <div className="flex-1 min-h-0 flex flex-col bg-slate-900/60 border border-slate-800 rounded-2xl p-3 shadow-xl overflow-hidden justify-between">
      {/* Top Banner */}
      <div className="bg-slate-950/70 border border-slate-800/80 rounded-xl p-2.5 flex items-center justify-between shrink-0">
        <div className="flex items-center gap-2">
          <span className="p-1.5 rounded-lg bg-indigo-500/10 text-indigo-400 border border-indigo-500/20">
            <GitFork className="w-4 h-4" />
          </span>
          <div>
            <h3 className="text-xs font-semibold text-white tracking-wide">{step.headline}</h3>
            <p className="text-[11px] text-slate-400">{step.subtext}</p>
          </div>
        </div>
        <div className="flex items-center gap-2">
          {step.isComplete ? (
            <span className="px-2 py-0.5 rounded-md bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 text-[11px] font-semibold flex items-center gap-1">
              <CheckCircle2 className="w-3.5 h-3.5" /> 2^{nums.length} Subsets
            </span>
          ) : (
            <span className="px-2 py-0.5 rounded-md bg-indigo-500/10 border border-indigo-500/20 text-indigo-400 text-[11px] font-mono">
              Step {step.stepIndex + 1} / {step.totalSteps}
            </span>
          )}
        </div>
      </div>

      {/* Main Backtracking Workbench */}
      <div className="flex-1 min-h-0 flex flex-col justify-center gap-3 py-2 px-3">
        {/* Input Elements Status Bar */}
        <div className="flex items-center justify-center gap-3">
          {nums.map((val, idx) => {
            const isCurrentDecision = step.currentIndex === idx && !step.isComplete;
            const isIncluded = step.currentSubset.includes(val);

            return (
              <div key={idx} className="flex flex-col items-center">
                <span className="text-[10px] font-mono text-slate-500 mb-0.5">nums[{idx}]</span>
                <div
                  className={`w-14 h-14 rounded-2xl border-2 flex flex-col items-center justify-center transition-all duration-300 ${
                    isCurrentDecision
                      ? 'border-indigo-400 bg-indigo-950/80 ring-2 ring-indigo-400/50 scale-110 shadow-lg shadow-indigo-500/20'
                      : isIncluded
                      ? 'border-emerald-500 bg-emerald-950/40 text-emerald-200'
                      : 'border-slate-800 bg-slate-950/50 text-slate-400'
                  }`}
                >
                  <span className="text-lg font-bold font-mono text-white">{val}</span>
                  {isIncluded && (
                    <span className="text-[9px] font-bold text-emerald-400 flex items-center">
                      <Check className="w-2.5 h-2.5" /> in
                    </span>
                  )}
                </div>
                <div className="h-5 flex items-center justify-center mt-1">
                  {isCurrentDecision && (
                    <span className="px-1.5 py-0.2 rounded bg-indigo-500/20 text-indigo-300 border border-indigo-500/40 text-[9px] font-mono font-bold animate-pulse">
                      deciding
                    </span>
                  )}
                </div>
              </div>
            );
          })}
        </div>

        {/* Current Working Subset Stack */}
        <div className="bg-slate-950/70 border border-slate-800/80 rounded-xl p-2.5 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <span className="text-xs font-semibold text-slate-400">Current Working Subset:</span>
            <div className="flex items-center gap-1.5 min-h-7">
              {step.currentSubset.length === 0 ? (
                <span className="text-xs font-mono text-slate-500 italic">[ ] (empty)</span>
              ) : (
                step.currentSubset.map((item, idx) => (
                  <span
                    key={idx}
                    className="px-2.5 py-1 rounded-lg bg-emerald-500/20 border border-emerald-500/30 text-emerald-300 text-xs font-mono font-bold animate-in fade-in"
                  >
                    {item}
                  </span>
                ))
              )}
            </div>
          </div>

          <div className="flex items-center gap-2">
            {step.decisionType === 'include' && (
              <span className="px-2 py-0.5 rounded-lg bg-emerald-500/20 text-emerald-300 border border-emerald-500/30 text-xs font-mono font-semibold flex items-center gap-1">
                <Plus className="w-3.5 h-3.5" /> INCLUDED
              </span>
            )}
            {step.decisionType === 'backtrack' && (
              <span className="px-2 py-0.5 rounded-lg bg-rose-500/20 text-rose-300 border border-rose-500/30 text-xs font-mono font-semibold flex items-center gap-1">
                <Minus className="w-3.5 h-3.5" /> POPPED (BACKTRACK)
              </span>
            )}
          </div>
        </div>
      </div>

      {/* Collected Subsets Rack */}
      <div className="bg-slate-950/80 border border-slate-800/80 rounded-xl p-2.5 flex flex-col gap-1.5 shrink-0 max-h-32 overflow-hidden">
        <div className="flex items-center justify-between text-xs">
          <span className="text-indigo-400 font-bold font-mono">
            Collected Subsets ({step.collectedSubsets.length} / {Math.pow(2, nums.length)}):
          </span>
          <span className="text-[11px] font-mono text-slate-500">2ⁿ combinations</span>
        </div>
        <div className="flex flex-wrap gap-1.5 overflow-y-auto max-h-20 p-0.5">
          {step.collectedSubsets.length === 0 ? (
            <span className="text-slate-500 italic text-[11px]">No subsets appended yet...</span>
          ) : (
            step.collectedSubsets.map((sub, idx) => (
              <span
                key={idx}
                className="px-2 py-0.5 rounded-md bg-slate-900 border border-slate-700/80 text-xs font-mono text-slate-300 hover:border-indigo-500 transition-colors"
              >
                [{sub.join(', ')}]
              </span>
            ))
          )}
        </div>
      </div>
    </div>
  );
};
