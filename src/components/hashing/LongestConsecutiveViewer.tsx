import React from 'react';
import { LongestConsecutiveStep } from '../../algorithms/longestConsecutiveIntuitive';
import { Link2, Sparkles, CheckCircle2, Flame, Award, ArrowRight } from 'lucide-react';

interface LongestConsecutiveViewerProps {
  step: LongestConsecutiveStep;
  nums: number[];
}

export const LongestConsecutiveViewer: React.FC<LongestConsecutiveViewerProps> = ({ step, nums }) => {
  const { numSet, currentNum, isStreakLeader, activeStreak, currentLongest, bestStreak, isComplete } = step;

  return (
    <div className="flex-1 min-h-0 flex flex-col bg-slate-900/60 border border-slate-800 rounded-2xl p-3 shadow-xl overflow-hidden justify-between">
      {/* Top Banner */}
      <div className="bg-slate-950/70 border border-slate-800/80 rounded-xl p-2.5 flex items-center justify-between shrink-0">
        <div className="flex items-center gap-2">
          <span className="p-1.5 rounded-lg bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
            <Link2 className="w-4 h-4" />
          </span>
          <div>
            <h3 className="text-xs font-semibold text-white tracking-wide">{step.headline}</h3>
            <p className="text-[11px] text-slate-400">{step.subtext}</p>
          </div>
        </div>
        <div className="flex items-center gap-2">
          {isComplete ? (
            <span className="px-2 py-0.5 rounded-md bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 text-[11px] font-semibold flex items-center gap-1">
              <CheckCircle2 className="w-3.5 h-3.5" /> Max Streak: {currentLongest}
            </span>
          ) : (
            <span className="px-2 py-0.5 rounded-md bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 text-[11px] font-mono">
              Step {step.stepIndex + 1} / {step.totalSteps}
            </span>
          )}
        </div>
      </div>

      {/* Main Visual Arena */}
      <div className="flex-1 min-h-0 flex flex-col justify-around gap-2 py-2 px-3">
        {/* Set View: Numbers in the hash set */}
        <div className="flex flex-col gap-1.5">
          <div className="flex items-center justify-between">
            <span className="text-[10px] uppercase font-mono font-bold tracking-wider text-slate-400">
              Hash Set Vault (num_set):
            </span>
            <span className="text-[10px] font-mono text-slate-400">
              Leader Rule: <span className="text-amber-400">(n - 1) ∉ set</span>
            </span>
          </div>

          <div className="flex flex-wrap items-center gap-2 max-h-28 overflow-y-auto p-1 bg-slate-950/60 rounded-xl border border-slate-800/80">
            {numSet.map((val) => {
              const isCurrent = currentNum === val;
              const isInActiveChain = activeStreak.includes(val);
              const isInBest = isComplete && bestStreak.includes(val);

              let badgeStyle = 'bg-slate-900 border-slate-800 text-slate-300';
              if (isInBest) {
                badgeStyle = 'bg-emerald-500/20 border-emerald-400 text-emerald-300 ring-2 ring-emerald-500/40 font-bold';
              } else if (isInActiveChain) {
                badgeStyle = 'bg-amber-500/20 border-amber-400 text-amber-300 ring-2 ring-amber-500/40 font-bold animate-pulse';
              } else if (isCurrent) {
                badgeStyle = isStreakLeader
                  ? 'bg-emerald-500/20 border-emerald-400 text-emerald-300 font-bold'
                  : 'bg-rose-500/20 border-rose-400 text-rose-300 opacity-70';
              }

              return (
                <div
                  key={val}
                  className={`px-3 py-1.5 rounded-lg border font-mono text-xs transition-all flex items-center gap-1.5 ${badgeStyle}`}
                >
                  <span>{val}</span>
                  {isCurrent && isStreakLeader === true && (
                    <Flame className="w-3.5 h-3.5 text-amber-400" />
                  )}
                  {isCurrent && isStreakLeader === false && (
                    <span className="text-[9px] text-rose-400 uppercase font-bold">Skip</span>
                  )}
                </div>
              );
            })}
          </div>
        </div>

        {/* Active Streak Progression */}
        <div className="bg-slate-950/60 border border-slate-800/80 rounded-xl p-2.5 flex flex-col gap-1.5">
          <span className="text-[10px] uppercase font-mono font-bold tracking-wider text-slate-400 flex items-center gap-1">
            <Flame className="w-3.5 h-3.5 text-amber-400" /> Active Chain Expansion:
          </span>
          <div className="flex items-center gap-2 overflow-x-auto min-h-[36px]">
            {activeStreak.length === 0 ? (
              <span className="text-xs text-slate-500 italic">No chain expanding right now...</span>
            ) : (
              activeStreak.map((num, i) => (
                <React.Fragment key={num}>
                  <div className="px-3 py-1 rounded-lg bg-amber-500/20 border border-amber-400/40 text-amber-300 font-mono text-xs font-bold">
                    {num}
                  </div>
                  {i < activeStreak.length - 1 && (
                    <ArrowRight className="w-3 h-3 text-amber-500/60 shrink-0" />
                  )}
                </React.Fragment>
              ))
            )}
          </div>
        </div>

        {/* Best Streak Champion Card */}
        <div className="bg-slate-950/60 border border-slate-800/80 rounded-xl p-2.5 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Award className="w-4 h-4 text-emerald-400" />
            <span className="text-xs font-mono font-bold text-slate-300">
              Longest Consecutive Streak Champion:
            </span>
          </div>
          <div className="flex items-center gap-2">
            <span className="text-xs font-mono font-bold text-emerald-400 bg-emerald-500/10 px-2 py-0.5 rounded border border-emerald-500/20">
              Length: {currentLongest}
            </span>
            {bestStreak.length > 0 && (
              <div className="flex items-center gap-1">
                {bestStreak.map((num, i) => (
                  <span
                    key={i}
                    className="px-2 py-0.5 rounded bg-emerald-500/20 border border-emerald-400/30 text-emerald-300 font-mono text-[11px] font-bold"
                  >
                    {num}
                  </span>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
