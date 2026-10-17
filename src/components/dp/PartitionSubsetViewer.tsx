import React from 'react';
import { PartitionStep } from '../../algorithms/partitionSubsetIntuitive';
import { Scale, CheckCircle2, XCircle, Target, Sparkles, Plus } from 'lucide-react';

interface PartitionSubsetViewerProps {
  step: PartitionStep;
  nums: number[];
}

export const PartitionSubsetViewer: React.FC<PartitionSubsetViewerProps> = ({ step, nums }) => {
  const { totalSum, target, isOdd, currIndex, currNum, attainableSums, newSums, isComplete, canPartition } = step;

  return (
    <div className="flex-1 min-h-0 flex flex-col bg-slate-900/60 border border-slate-800 rounded-2xl p-3 shadow-xl overflow-hidden justify-between">
      {/* Top Banner */}
      <div className="bg-slate-950/70 border border-slate-800/80 rounded-xl p-2.5 flex items-center justify-between shrink-0">
        <div className="flex items-center gap-2">
          <span className="p-1.5 rounded-lg bg-indigo-500/10 text-indigo-400 border border-indigo-500/20">
            <Scale className="w-4 h-4" />
          </span>
          <div>
            <h3 className="text-xs font-semibold text-white tracking-wide">{step.headline}</h3>
            <p className="text-[11px] text-slate-400">{step.subtext}</p>
          </div>
        </div>
        <div className="flex items-center gap-2">
          {isComplete ? (
            canPartition ? (
              <span className="px-2 py-0.5 rounded-md bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 text-[11px] font-semibold flex items-center gap-1">
                <CheckCircle2 className="w-3.5 h-3.5" /> Partition Found (True)
              </span>
            ) : (
              <span className="px-2 py-0.5 rounded-md bg-rose-500/10 border border-rose-500/20 text-rose-400 text-[11px] font-semibold flex items-center gap-1">
                <XCircle className="w-3.5 h-3.5" /> No Equal Partition (False)
              </span>
            )
          ) : (
            <span className="px-2 py-0.5 rounded-md bg-indigo-500/10 border border-indigo-500/20 text-indigo-400 text-[11px] font-mono">
              Step {step.stepIndex + 1} / {step.totalSteps}
            </span>
          )}
        </div>
      </div>

      {/* Main Workbench */}
      <div className="flex-1 min-h-0 flex flex-col justify-center gap-3 py-2 px-3">
        {/* Target Gauge & Numbers Deck */}
        <div className="flex items-center justify-between gap-4 bg-slate-950/70 border border-slate-800/80 rounded-xl p-3">
          <div className="flex items-center gap-3">
            <div className="flex flex-col">
              <span className="text-[10px] uppercase font-mono tracking-wider text-slate-400">Total Sum</span>
              <span className="text-base font-bold font-mono text-white">{totalSum}</span>
            </div>
            <span className="text-slate-600 font-bold">➔</span>
            <div className="flex flex-col">
              <span className="text-[10px] uppercase font-mono tracking-wider text-indigo-400">Target Half</span>
              <span className="text-base font-bold font-mono text-indigo-300">{target}</span>
            </div>
          </div>

          {/* Numbers list */}
          <div className="flex items-center gap-2 flex-wrap">
            <span className="text-xs text-slate-400 font-semibold mr-1">Input Nums:</span>
            {nums.map((n, idx) => {
              const isActive = currIndex === idx && !isComplete;
              return (
                <div
                  key={idx}
                  className={`w-10 h-10 rounded-xl border flex flex-col items-center justify-center transition-all duration-300 ${
                    isActive
                      ? 'border-indigo-400 bg-indigo-950/90 text-white scale-110 ring-2 ring-indigo-400 shadow-lg shadow-indigo-500/30'
                      : 'border-slate-800 bg-slate-900/80 text-slate-300'
                  }`}
                >
                  <span className="text-xs font-bold font-mono">{n}</span>
                </div>
              );
            })}
          </div>
        </div>

        {/* Attainable Sums Track */}
        <div className="bg-slate-950/80 border border-slate-800/80 rounded-xl p-3 flex flex-col gap-2">
          <div className="flex items-center justify-between text-xs">
            <span className="text-indigo-400 font-bold font-mono flex items-center gap-1.5">
              <Target className="w-3.5 h-3.5" /> Attainable Sums Track (0 ➔ {target}):
            </span>
            <span className="text-[11px] font-mono text-slate-500">
              {attainableSums.length} sums unlocked
            </span>
          </div>

          {/* Sums Grid */}
          <div className="flex flex-wrap gap-1.5 max-h-28 overflow-y-auto p-1">
            {Array.from({ length: target + 1 }).map((_, val) => {
              const isAttainable = attainableSums.includes(val);
              const isNewlyAdded = newSums.includes(val);
              const isGoal = val === target;

              return (
                <div
                  key={val}
                  className={`w-9 h-9 rounded-lg border flex flex-col items-center justify-center transition-all duration-300 ${
                    isGoal && isAttainable
                      ? 'border-emerald-400 bg-emerald-500 text-slate-950 font-bold scale-110 shadow-lg shadow-emerald-500/40 ring-2 ring-emerald-300'
                      : isNewlyAdded
                      ? 'border-cyan-400 bg-cyan-500/30 text-cyan-200 scale-105 animate-pulse'
                      : isAttainable
                      ? 'border-emerald-500/60 bg-emerald-950/40 text-emerald-300 font-semibold'
                      : 'border-slate-800/60 bg-slate-950/60 text-slate-600 opacity-50'
                  }`}
                >
                  <span className="text-[11px] font-mono">{val}</span>
                  {isGoal && (
                    <span className="text-[7px] uppercase font-bold tracking-tighter">target</span>
                  )}
                </div>
              );
            })}
          </div>
        </div>
      </div>

      {/* Mental Model Explainer Card */}
      <div className="bg-slate-950/80 border border-slate-800/80 rounded-xl p-2.5 flex items-center justify-between gap-3 text-xs shrink-0">
        <div className="flex items-center gap-2">
          <span className="text-indigo-400 font-bold font-mono">0/1 Knapsack:</span>
          <span className="text-slate-300">
            Each number can be used at most once. Generating sums backwards or with a copy set prevents using the same element multiple times!
          </span>
        </div>
        <div className="flex items-center gap-3 shrink-0 text-[11px] font-mono text-slate-400">
          <span className="flex items-center gap-1 text-emerald-400 font-bold">
            <Sparkles className="w-3.5 h-3.5" /> Target: {target}
          </span>
        </div>
      </div>
    </div>
  );
};
