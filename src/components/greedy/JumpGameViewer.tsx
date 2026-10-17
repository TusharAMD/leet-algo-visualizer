import React from 'react';
import type { JumpGameStep } from '../../algorithms/jumpGameIntuitive';

interface JumpGameViewerProps {
  step: JumpGameStep;
  nums: number[];
}

export const JumpGameViewer: React.FC<JumpGameViewerProps> = ({
  step,
  nums,
}) => {
  const n = nums.length;

  return (
    <div className="flex flex-col h-full gap-4 p-4 select-none">
      {/* Top Status & Variable Badges */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
        <div className="bg-slate-900 border border-slate-800 rounded-xl p-3 flex flex-col justify-center">
          <span className="text-xs text-slate-400 font-medium">Current Index</span>
          <span className="text-base font-mono font-bold text-sky-400">
            idx = {step.currentIndex} (jump = {step.currentJump})
          </span>
        </div>
        <div className="bg-slate-900 border border-slate-800 rounded-xl p-3 flex flex-col justify-center">
          <span className="text-xs text-slate-400 font-medium">Max Reach Index</span>
          <span className="text-xl font-mono font-bold text-amber-400">
            {step.maxReach} / {n - 1}
          </span>
        </div>
        <div className="bg-slate-900 border border-slate-800 rounded-xl p-3 flex flex-col justify-center">
          <span className="text-xs text-slate-400 font-medium">Status</span>
          <span className={`text-sm font-bold ${step.stuck ? 'text-rose-400' : 'text-emerald-400'}`}>
            {step.stuck ? 'Stuck at Dead End ✗' : 'Traversing Freely ✓'}
          </span>
        </div>
        <div className="bg-slate-900 border border-slate-800 rounded-xl p-3 flex flex-col justify-center">
          <span className="text-xs text-slate-400 font-medium">Can Reach Last Index</span>
          <span className={`text-2xl font-mono font-black ${step.reachable ? 'text-emerald-400' : 'text-rose-400'}`}>
            {step.reachable ? 'True' : 'False'}
          </span>
        </div>
      </div>

      {/* Main Array Canvas with Reachability Horizon */}
      <div className="flex-1 bg-slate-900/60 border border-slate-800 rounded-xl p-6 flex flex-col justify-center items-center gap-8 relative overflow-hidden">
        <div className="text-xs font-semibold text-slate-400 uppercase tracking-wider">
          Jump Game Horizon (Green = Within Max Reach, Gold = Current Pointer, Purple = Target)
        </div>

        {/* Array Visualization */}
        <div className="flex items-center gap-2.5 flex-wrap justify-center">
          {nums.map((jump, idx) => {
            const isCurrent = idx === step.currentIndex;
            const isTarget = idx === n - 1;
            const isWithinReach = idx <= step.maxReach;

            let border = 'border-slate-800';
            let bg = 'bg-slate-950/60';
            let text = 'text-slate-400';

            if (isCurrent) {
              border = 'border-amber-400 ring-4 ring-amber-400/40';
              bg = 'bg-amber-950/80';
              text = 'text-amber-200';
            } else if (isTarget) {
              border = 'border-purple-500/80 ring-2 ring-purple-500/30';
              bg = 'bg-purple-950/50';
              text = 'text-purple-200';
            } else if (isWithinReach) {
              border = 'border-emerald-600/70';
              bg = 'bg-emerald-950/40';
              text = 'text-emerald-300';
            }

            return (
              <div key={idx} className="flex flex-col items-center gap-1">
                <span className="text-[10px] font-mono text-slate-500">[{idx}]</span>
                <div
                  className={`w-14 h-16 rounded-xl border-2 flex flex-col items-center justify-center font-mono font-bold transition-all relative ${border} ${bg} ${text}`}
                >
                  <span className="text-lg">{jump}</span>
                  <span className="text-[9px] text-slate-400 font-sans">
                    {idx === n - 1 ? 'GOAL' : `+${jump}`}
                  </span>
                </div>
              </div>
            );
          })}
        </div>

        {/* Reachability Bar Meter */}
        <div className="w-full max-w-md bg-slate-950/80 border border-slate-800 rounded-xl p-4 flex flex-col gap-2">
          <div className="flex justify-between text-xs text-slate-400">
            <span>Progress Horizon</span>
            <span className="font-mono text-emerald-400 font-bold">
              Reach {Math.min(step.maxReach, n - 1)} / {n - 1}
            </span>
          </div>
          <div className="w-full h-3 bg-slate-900 rounded-full overflow-hidden border border-slate-800">
            <div
              className="h-full bg-gradient-to-r from-sky-500 via-indigo-500 to-emerald-400 transition-all duration-300"
              style={{
                width: `${Math.min(100, (step.maxReach / (n - 1 || 1)) * 100)}%`,
              }}
            />
          </div>
        </div>
      </div>

      {/* Step Explanation */}
      <div className="bg-slate-950 border border-slate-800 rounded-xl p-3 text-sm text-slate-300 flex items-center gap-2">
        <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse shrink-0" />
        <span>{step.explanation}</span>
      </div>
    </div>
  );
};
