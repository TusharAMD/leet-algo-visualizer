import React from 'react';
import { HouseRobberStep } from '../../algorithms/houseRobberIntuitive';
import { Home, CheckCircle2, ShieldAlert, DollarSign, Sparkles } from 'lucide-react';

interface HouseRobberViewerProps {
  step: HouseRobberStep;
}

export const HouseRobberViewer: React.FC<HouseRobberViewerProps> = ({ step }) => {
  const {
    nums,
    currentHouseIndex,
    rob1,
    rob2,
    currentLootIfRobbed,
    currentLootIfSkipped,
    robbedIndices,
    headline,
    subtext,
    isComplete,
    result,
    stepIndex,
    totalSteps
  } = step;

  return (
    <div className="flex-1 min-h-0 flex flex-col bg-slate-900/60 border border-slate-800 rounded-2xl p-3 shadow-xl overflow-hidden justify-between">
      {/* Top Banner */}
      <div className="bg-slate-950/70 border border-slate-800/80 rounded-xl p-2.5 flex items-center justify-between shrink-0">
        <div className="flex items-center gap-2">
          <span className="p-1.5 rounded-lg bg-amber-500/10 text-amber-400 border border-amber-500/20">
            <Home className="w-4 h-4" />
          </span>
          <div>
            <h3 className="text-xs font-semibold text-white tracking-wide">{headline}</h3>
            <p className="text-[11px] text-slate-400">{subtext}</p>
          </div>
        </div>
        <div className="flex items-center gap-2">
          {isComplete ? (
            <span className="px-2.5 py-0.5 rounded-md bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 text-xs font-mono font-bold flex items-center gap-1">
              <CheckCircle2 className="w-3.5 h-3.5" /> Max Haul: ${result}
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
        {/* Left: Neighborhood Street Row */}
        <div className="md:col-span-8 flex flex-col items-center justify-center p-4 rounded-xl bg-slate-950/40 border border-slate-800/60 relative overflow-hidden">
          <div className="flex flex-wrap items-center justify-center gap-2.5 max-w-full">
            {nums.map((val, idx) => {
              const isCurrent = currentHouseIndex === idx;
              const isRobbed = robbedIndices.includes(idx);

              let houseStyle = 'bg-slate-900/80 text-slate-400 border-slate-800';

              if (isRobbed) {
                houseStyle = 'bg-emerald-500/20 text-emerald-300 border-emerald-500/60 shadow-[0_0_15px_rgba(16,185,129,0.3)] font-bold scale-105';
              } else if (isCurrent) {
                houseStyle = 'bg-amber-500/20 text-amber-200 border-amber-400 ring-2 ring-amber-400/50 scale-105';
              }

              return (
                <div
                  key={idx}
                  className={`w-20 h-28 rounded-xl border flex flex-col justify-between items-center p-2 transition-all duration-300 relative select-none ${houseStyle}`}
                >
                  {/* Roof Top */}
                  <div className="flex items-center justify-between w-full text-[10px] font-mono opacity-60">
                    <span>H{idx}</span>
                    {isRobbed && <span>💰</span>}
                  </div>

                  {/* House Icon */}
                  <div className="text-2xl leading-none my-auto">
                    {isRobbed ? '🏠' : isCurrent ? '🥷' : '🏡'}
                  </div>

                  {/* Cash Stash */}
                  <div className="px-2 py-0.5 rounded bg-slate-950/90 text-xs font-mono font-bold text-amber-300 border border-slate-800">
                    ${val}
                  </div>

                  {/* Status Tag */}
                  <div className="text-[9px] font-bold uppercase tracking-wider mt-1">
                    {isRobbed ? 'ROBBED' : isCurrent ? 'TARGET' : 'PASS'}
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Right: DP Decision Engine */}
        <div className="md:col-span-4 flex flex-col gap-2 min-h-0">
          {/* Running State Cards */}
          <div className="bg-slate-950/40 border border-slate-800/60 rounded-xl p-2.5 grid grid-cols-2 gap-2 shrink-0">
            <div className="p-2 rounded-lg bg-slate-900/60 border border-slate-800 text-center">
              <span className="text-[10px] text-slate-400 uppercase tracking-wider block">rob1 (i - 2)</span>
              <span className="text-lg font-mono font-bold text-slate-300">${rob1}</span>
            </div>
            <div className="p-2 rounded-lg bg-slate-900/60 border border-slate-800 text-center">
              <span className="text-[10px] text-slate-400 uppercase tracking-wider block">rob2 (i - 1)</span>
              <span className="text-lg font-mono font-bold text-emerald-400">${rob2}</span>
            </div>
          </div>

          {/* Decision Comparison Card */}
          <div className="bg-slate-950/40 border border-slate-800/60 rounded-xl p-2.5 flex flex-col gap-1.5 flex-1 min-h-0 overflow-y-auto">
            <span className="text-[10px] uppercase font-bold text-slate-400 tracking-wider flex items-center gap-1">
              <ShieldAlert className="w-3 h-3 text-amber-400" /> Adjacent Alarm Constraint
            </span>

            {currentHouseIndex >= 0 && currentHouseIndex < nums.length ? (
              <div className="space-y-1.5 mt-1">
                <div
                  className={`p-2 rounded-lg border text-xs flex items-center justify-between ${
                    currentLootIfRobbed > currentLootIfSkipped
                      ? 'bg-emerald-500/20 border-emerald-500/40 text-emerald-200 font-bold'
                      : 'bg-slate-900/60 border-slate-800 text-slate-400'
                  }`}
                >
                  <div>
                    <div className="text-[11px]">Option A: Rob House {currentHouseIndex}</div>
                    <div className="text-[10px] opacity-80">
                      ${nums[currentHouseIndex]} + rob1 (${rob1})
                    </div>
                  </div>
                  <span className="text-sm font-mono">${currentLootIfRobbed}</span>
                </div>

                <div
                  className={`p-2 rounded-lg border text-xs flex items-center justify-between ${
                    currentLootIfSkipped >= currentLootIfRobbed
                      ? 'bg-emerald-500/20 border-emerald-500/40 text-emerald-200 font-bold'
                      : 'bg-slate-900/60 border-slate-800 text-slate-400'
                  }`}
                >
                  <div>
                    <div className="text-[11px]">Option B: Skip House {currentHouseIndex}</div>
                    <div className="text-[10px] opacity-80">Keep rob2 (${rob2})</div>
                  </div>
                  <span className="text-sm font-mono">${currentLootIfSkipped}</span>
                </div>
              </div>
            ) : (
              <div className="p-2 rounded-lg bg-slate-900/60 border border-slate-800 text-xs text-slate-500 italic text-center">
                Select house to evaluate robbery choices
              </div>
            )}

            <div className="mt-auto p-2 rounded-lg bg-slate-900/60 border border-slate-800 text-[11px] text-slate-300">
              <span className="font-semibold text-amber-400">O(1) Space Optimization:</span>
              <p className="text-[10px] text-slate-400 mt-0.5">
                Because house <code>i</code> only depends on <code>i-1</code> and <code>i-2</code>, two scalar variables (<code>rob1</code> and <code>rob2</code>) suffice instead of a full DP array.
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Legend */}
      <div className="flex items-center justify-between bg-slate-950/60 border border-slate-800/60 rounded-xl px-3 py-1.5 shrink-0 text-xs">
        <div className="flex items-center gap-3">
          <div className="flex items-center gap-1.5">
            <span className="w-3 h-3 rounded bg-emerald-500/20 border border-emerald-500/50" />
            <span className="text-emerald-300 text-[11px]">Robbed House</span>
          </div>
          <div className="flex items-center gap-1.5">
            <span className="w-3 h-3 rounded bg-slate-900 border border-slate-800" />
            <span className="text-slate-400 text-[11px]">Skipped House</span>
          </div>
          <div className="flex items-center gap-1.5">
            <span className="w-3 h-3 rounded bg-amber-500/20 border border-amber-500/50" />
            <span className="text-amber-300 text-[11px]">Evaluating</span>
          </div>
        </div>

        {isComplete && (
          <div className="flex items-center gap-1 text-emerald-400 font-semibold text-[11px]">
            <CheckCircle2 className="w-3.5 h-3.5" /> Max Stash Collected: ${result}
          </div>
        )}
      </div>
    </div>
  );
};
