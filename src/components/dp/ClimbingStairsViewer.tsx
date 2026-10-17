import React from 'react';
import { ClimbingStairsStep } from '../../algorithms/climbingStairsIntuitive';
import { Footprints, CheckCircle2, TrendingUp, Sparkles } from 'lucide-react';

interface ClimbingStairsViewerProps {
  step: ClimbingStairsStep;
}

export const ClimbingStairsViewer: React.FC<ClimbingStairsViewerProps> = ({ step }) => {
  const { n, dp, currentStair, prev1, prev2, isComplete } = step;

  return (
    <div className="flex-1 min-h-0 flex flex-col bg-slate-900/60 border border-slate-800 rounded-2xl p-3 shadow-xl overflow-hidden justify-between">
      {/* Top Banner */}
      <div className="bg-slate-950/70 border border-slate-800/80 rounded-xl p-2.5 flex items-center justify-between shrink-0">
        <div className="flex items-center gap-2">
          <span className="p-1.5 rounded-lg bg-indigo-500/10 text-indigo-400 border border-indigo-500/20">
            <TrendingUp className="w-4 h-4" />
          </span>
          <div>
            <h3 className="text-xs font-semibold text-white tracking-wide">{step.headline}</h3>
            <p className="text-[11px] text-slate-400">{step.subtext}</p>
          </div>
        </div>
        <div className="flex items-center gap-2">
          {isComplete ? (
            <span className="px-2 py-0.5 rounded-md bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 text-[11px] font-semibold flex items-center gap-1">
              <CheckCircle2 className="w-3.5 h-3.5" /> {dp[n]} Ways Found
            </span>
          ) : (
            <span className="px-2 py-0.5 rounded-md bg-indigo-500/10 border border-indigo-500/20 text-indigo-400 text-[11px] font-mono">
              Step {step.stepIndex + 1} / {step.totalSteps}
            </span>
          )}
        </div>
      </div>

      {/* Ascending Staircase Visualization */}
      <div className="flex-1 min-h-0 flex items-end justify-center gap-2 md:gap-3 px-4 pb-2 pt-6 overflow-x-auto">
        {/* Ground level 0 */}
        <div className="flex flex-col items-center shrink-0">
          <span className="text-[10px] font-mono text-slate-500 mb-1">Ground</span>
          <div className="w-12 h-8 rounded-t-xl border border-slate-800 bg-slate-950/50 flex items-center justify-center">
            <span className="text-[10px] text-slate-500 font-mono">0</span>
          </div>
        </div>

        {/* Stairs 1..n */}
        {Array.from({ length: n }).map((_, idx) => {
          const stairNum = idx + 1;
          const heightPx = 28 + stairNum * 18;
          const isActive = currentStair === stairNum;
          const isPrev1 = prev1 === stairNum;
          const isPrev2 = prev2 === stairNum;
          const ways = dp[stairNum];

          return (
            <div key={stairNum} className="flex flex-col items-center shrink-0 relative">
              {/* Leaper Badge or Runner */}
              <div className="h-6 flex items-center justify-center mb-1">
                {isActive && (
                  <span className="px-2 py-0.5 rounded-full bg-indigo-500 text-white font-mono font-bold text-[9px] uppercase tracking-wider flex items-center gap-1 shadow-md shadow-indigo-500/30 animate-bounce">
                    <Footprints className="w-2.5 h-2.5" /> Stair {stairNum}
                  </span>
                )}
                {isPrev1 && (
                  <span className="px-1.5 py-0.2 rounded bg-cyan-500/20 text-cyan-300 border border-cyan-500/30 font-mono text-[9px]">
                    +1 leap ({ways})
                  </span>
                )}
                {isPrev2 && (
                  <span className="px-1.5 py-0.2 rounded bg-amber-500/20 text-amber-300 border border-amber-500/30 font-mono text-[9px]">
                    +2 leap ({ways})
                  </span>
                )}
              </div>

              {/* Elevated Staircase Podium */}
              <div
                style={{ height: `${heightPx}px` }}
                className={`w-14 md:w-16 rounded-t-2xl border-2 flex flex-col items-center justify-between p-2 transition-all duration-300 ${
                  isActive
                    ? 'border-indigo-400 bg-indigo-950/80 shadow-xl shadow-indigo-500/20 scale-105'
                    : isPrev1
                    ? 'border-cyan-400/80 bg-cyan-950/40 shadow-md shadow-cyan-500/10'
                    : isPrev2
                    ? 'border-amber-400/80 bg-amber-950/40 shadow-md shadow-amber-500/10'
                    : ways !== null
                    ? 'border-emerald-500/60 bg-emerald-950/30'
                    : 'border-slate-800 bg-slate-900/50'
                }`}
              >
                <span className="text-[10px] font-mono font-bold text-slate-400">Step {stairNum}</span>
                <div className="flex flex-col items-center my-auto">
                  <span
                    className={`text-base font-bold font-mono ${
                      ways !== null ? 'text-white' : 'text-slate-600'
                    }`}
                  >
                    {ways !== null ? ways : '?'}
                  </span>
                  <span className="text-[8px] font-mono text-slate-500">ways</span>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Recurrence Footnote & DP Array Rack */}
      <div className="bg-slate-950/80 border border-slate-800/80 rounded-xl p-2.5 flex items-center justify-between gap-3 text-xs shrink-0">
        <div className="flex items-center gap-2">
          <span className="text-indigo-400 font-bold font-mono">Recurrence:</span>
          <span className="text-slate-300 font-mono text-[11px]">
            dp[i] = dp[i-1] + dp[i-2]
          </span>
        </div>
        <div className="flex items-center gap-1.5 shrink-0 text-xs font-mono">
          <span className="text-slate-400 text-[10px]">dp:</span>
          {dp.slice(1).map((val, idx) => (
            <span
              key={idx + 1}
              className={`px-1.5 py-0.5 rounded text-[11px] font-semibold border ${
                idx + 1 === currentStair
                  ? 'bg-indigo-500/20 text-indigo-300 border-indigo-500/40 ring-1 ring-indigo-400'
                  : val !== null
                  ? 'bg-slate-900 text-emerald-400 border-slate-700'
                  : 'bg-slate-950 text-slate-600 border-slate-800'
              }`}
            >
              {val !== null ? val : '—'}
            </span>
          ))}
        </div>
      </div>
    </div>
  );
};
