import React from 'react';
import { MinCostClimbingStairsStep } from '../../algorithms/minCostClimbingStairsIntuitive';
import { Footprints, CheckCircle2, ArrowUpRight, TrendingUp, Sparkles } from 'lucide-react';

interface MinCostClimbingStairsViewerProps {
  step: MinCostClimbingStairsStep;
}

export const MinCostClimbingStairsViewer: React.FC<MinCostClimbingStairsViewerProps> = ({ step }) => {
  const {
    cost,
    dp,
    currentStepIndex,
    comparingSteps,
    choice1Cost,
    choice2Cost,
    bestChoice,
    headline,
    subtext,
    isComplete,
    result,
    stepIndex,
    totalSteps
  } = step;

  const n = cost.length;

  return (
    <div className="flex-1 min-h-0 flex flex-col bg-slate-900/60 border border-slate-800 rounded-2xl p-3 shadow-xl overflow-hidden justify-between">
      {/* Top Banner */}
      <div className="bg-slate-950/70 border border-slate-800/80 rounded-xl p-2.5 flex items-center justify-between shrink-0">
        <div className="flex items-center gap-2">
          <span className="p-1.5 rounded-lg bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
            <TrendingUp className="w-4 h-4" />
          </span>
          <div>
            <h3 className="text-xs font-semibold text-white tracking-wide">{headline}</h3>
            <p className="text-[11px] text-slate-400">{subtext}</p>
          </div>
        </div>
        <div className="flex items-center gap-2">
          {isComplete ? (
            <span className="px-2.5 py-0.5 rounded-md bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 text-xs font-mono font-bold flex items-center gap-1">
              <CheckCircle2 className="w-3.5 h-3.5" /> Total Min Cost: {result}
            </span>
          ) : (
            <span className="px-2 py-0.5 rounded-md bg-indigo-500/10 border border-indigo-500/20 text-indigo-400 text-[11px] font-mono">
              Step {stepIndex + 1} / {totalSteps}
            </span>
          )}
        </div>
      </div>

      {/* Main Arena */}
      <div className="flex-1 min-h-0 grid grid-cols-1 md:grid-cols-12 gap-3 py-1 px-1">
        {/* Left: Staircase Visualizer */}
        <div className="md:col-span-8 flex flex-col items-center justify-end p-4 rounded-xl bg-slate-950/40 border border-slate-800/60 relative overflow-hidden">
          <div className="w-full flex items-end justify-center gap-2 h-48 pb-2">
            {Array.from({ length: n + 1 }).map((_, i) => {
              const isTop = i === n;
              const isCurrent = currentStepIndex === i;
              const isPrev1 = comparingSteps && comparingSteps[0] === i;
              const isPrev2 = comparingSteps && comparingSteps[1] === i;

              // Step height increases linearly
              const heightPct = 20 + (i / n) * 70;

              let colBg = 'bg-slate-800/70 border-slate-700 text-slate-400';
              if (isTop) {
                colBg = isComplete
                  ? 'bg-emerald-500/30 border-emerald-400 text-emerald-300 shadow-[0_0_15px_rgba(16,185,129,0.3)]'
                  : 'bg-purple-500/20 border-purple-500/40 text-purple-300';
              } else if (isCurrent) {
                colBg = 'bg-indigo-500/30 border-indigo-400 text-indigo-200 ring-2 ring-indigo-400/50';
              } else if (isPrev1 || isPrev2) {
                colBg = 'bg-amber-500/20 border-amber-500/40 text-amber-300';
              }

              return (
                <div
                  key={i}
                  style={{ height: `${heightPct}%` }}
                  className={`flex-1 max-w-[50px] min-w-[32px] rounded-t-xl border flex flex-col justify-between items-center p-1.5 transition-all duration-300 relative select-none ${colBg}`}
                >
                  {/* Step label / top indicator */}
                  <div className="text-[10px] font-mono font-bold leading-none">
                    {isTop ? 'TOP' : `S${i}`}
                  </div>

                  {/* Step cost badge (not for top floor) */}
                  {!isTop && (
                    <div className="px-1 py-0.5 rounded bg-slate-950/80 text-[10px] font-mono border border-slate-800 text-amber-300">
                      ${cost[i]}
                    </div>
                  )}

                  {/* DP accumulated cost pill */}
                  <div className="px-1.5 py-0.5 rounded bg-slate-950 text-[10px] font-mono font-bold border border-slate-700 text-emerald-400">
                    dp={dp[i]}
                  </div>

                  {/* Crown for top */}
                  {isTop && (
                    <span className="absolute -top-5 text-sm">
                      🚩
                    </span>
                  )}
                </div>
              );
            })}
          </div>
        </div>

        {/* Right: Decision Table */}
        <div className="md:col-span-4 flex flex-col gap-2 min-h-0">
          {/* Decision Comparison Card */}
          <div className="bg-slate-950/40 border border-slate-800/60 rounded-xl p-2.5 flex flex-col gap-2 shrink-0">
            <span className="text-[10px] uppercase font-bold text-slate-400 tracking-wider flex items-center gap-1">
              <Footprints className="w-3 h-3 text-indigo-400" /> Hop Decision at Step {currentStepIndex}
            </span>

            {choice1Cost !== null && choice2Cost !== null ? (
              <div className="space-y-1.5">
                <div
                  className={`p-2 rounded-lg border text-xs flex items-center justify-between ${
                    bestChoice === 1
                      ? 'bg-emerald-500/20 border-emerald-500/40 text-emerald-200 font-bold'
                      : 'bg-slate-900/60 border-slate-800 text-slate-400'
                  }`}
                >
                  <div>
                    <div className="text-[11px]">1-Step Hop (from S{currentStepIndex - 1})</div>
                    <div className="text-[10px] opacity-80">
                      dp[{currentStepIndex - 1}] + cost[{currentStepIndex - 1}]
                    </div>
                  </div>
                  <span className="text-sm font-mono">${choice1Cost}</span>
                </div>

                <div
                  className={`p-2 rounded-lg border text-xs flex items-center justify-between ${
                    bestChoice === 2
                      ? 'bg-emerald-500/20 border-emerald-500/40 text-emerald-200 font-bold'
                      : 'bg-slate-900/60 border-slate-800 text-slate-400'
                  }`}
                >
                  <div>
                    <div className="text-[11px]">2-Step Jump (from S{currentStepIndex - 2})</div>
                    <div className="text-[10px] opacity-80">
                      dp[{currentStepIndex - 2}] + cost[{currentStepIndex - 2}]
                    </div>
                  </div>
                  <span className="text-sm font-mono">${choice2Cost}</span>
                </div>
              </div>
            ) : (
              <div className="p-2 rounded-lg bg-slate-900/60 border border-slate-800 text-xs text-slate-500 italic text-center">
                Select step to evaluate hop costs
              </div>
            )}
          </div>

          {/* DP Array Catalog */}
          <div className="bg-slate-950/40 border border-slate-800/60 rounded-xl p-2.5 flex flex-col gap-1.5 flex-1 min-h-0 overflow-y-auto">
            <span className="text-[10px] uppercase font-bold text-slate-400 tracking-wider">
              DP Table (dp[0..{n}])
            </span>

            <div className="grid grid-cols-4 gap-1.5 mt-0.5">
              {dp.map((val, idx) => (
                <div
                  key={idx}
                  className={`p-1 rounded text-center border font-mono ${
                    idx === currentStepIndex
                      ? 'bg-indigo-500/20 border-indigo-400 text-indigo-200 font-bold'
                      : 'bg-slate-900 text-slate-400 border-slate-800'
                  }`}
                >
                  <span className="text-[9px] text-slate-500 block">S{idx}</span>
                  <span className="text-xs text-emerald-400 font-bold">{val}</span>
                </div>
              ))}
            </div>

            <div className="mt-auto p-2 rounded-lg bg-slate-900/60 border border-slate-800 text-[11px] text-slate-300">
              <span className="font-semibold text-emerald-400">Bellman Principle:</span>
              <p className="text-[10px] text-slate-400 mt-0.5">
                Each step greedily records <code>min(take1, take2)</code>, guaranteeing the optimal accumulated cost to reach the top.
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Legend */}
      <div className="flex items-center justify-between bg-slate-950/60 border border-slate-800/60 rounded-xl px-3 py-1.5 shrink-0 text-xs">
        <div className="flex items-center gap-3">
          <div className="flex items-center gap-1.5">
            <span className="w-3 h-3 rounded bg-amber-500/20 border border-amber-500/50" />
            <span className="text-amber-300 text-[11px]">Step Cost ($)</span>
          </div>
          <div className="flex items-center gap-1.5">
            <span className="w-3 h-3 rounded bg-emerald-500/20 border border-emerald-500/50" />
            <span className="text-emerald-300 text-[11px]">DP Accumulated Min</span>
          </div>
          <div className="flex items-center gap-1.5">
            <span className="w-3 h-3 rounded bg-indigo-500/20 border border-indigo-500/50" />
            <span className="text-indigo-300 text-[11px]">Active Step</span>
          </div>
        </div>

        {isComplete && (
          <div className="flex items-center gap-1 text-emerald-400 font-semibold text-[11px]">
            <CheckCircle2 className="w-3.5 h-3.5" /> Reached Top with Minimum Cost: ${result}
          </div>
        )}
      </div>
    </div>
  );
};
