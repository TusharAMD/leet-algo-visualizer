import React from 'react';
import type { JumpGameTwoStep } from '../../algorithms/jumpGameTwoIntuitive';

interface JumpGameTwoViewerProps {
  step: JumpGameTwoStep;
  nums: number[];
}

export const JumpGameTwoViewer: React.FC<JumpGameTwoViewerProps> = ({
  step,
  nums,
}) => {
  const n = nums.length;

  return (
    <div className="flex flex-col h-full gap-4 p-4 select-none">
      {/* Top Status & Variable Badges */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
        <div className="bg-slate-900 border border-slate-800 rounded-xl p-3 flex flex-col justify-center">
          <span className="text-xs text-slate-400 font-medium">Scanning Pointer</span>
          <span className="text-base font-mono font-bold text-sky-400">
            {step.activeI >= 0 ? `i = ${step.activeI} (jump = ${nums[step.activeI]})` : 'Transition'}
          </span>
        </div>
        <div className="bg-slate-900 border border-slate-800 rounded-xl p-3 flex flex-col justify-center">
          <span className="text-xs text-slate-400 font-medium">Current Window [l, r]</span>
          <span className="text-base font-mono font-bold text-indigo-300">
            [{step.l}..{step.r}]
          </span>
        </div>
        <div className="bg-slate-900 border border-slate-800 rounded-xl p-3 flex flex-col justify-center">
          <span className="text-xs text-slate-400 font-medium">Farthest Reach from Level</span>
          <span className="text-xl font-mono font-bold text-amber-400">
            reach = {step.farthest}
          </span>
        </div>
        <div className="bg-slate-900 border border-slate-800 rounded-xl p-3 flex flex-col justify-center">
          <span className="text-xs text-slate-400 font-medium">Min Jumps So Far</span>
          <span className="text-2xl font-mono font-black text-emerald-400">
            {step.jumps}
          </span>
        </div>
      </div>

      {/* Main Canvas: BFS Windows on Array */}
      <div className="flex-1 bg-slate-900/60 border border-slate-800 rounded-xl p-6 flex flex-col justify-center items-center gap-8 relative overflow-hidden">
        <div className="text-xs font-semibold text-slate-400 uppercase tracking-wider">
          Greedy BFS Window Jump Layers
        </div>

        {/* Array Visualization */}
        <div className="flex items-center gap-2.5 flex-wrap justify-center">
          {nums.map((jump, idx) => {
            const isPointer = idx === step.activeI;
            const inCurrentWindow = idx >= step.l && idx <= step.r;
            const isTarget = idx === n - 1;

            let border = 'border-slate-800';
            let bg = 'bg-slate-950/60';
            let text = 'text-slate-400';

            if (isPointer) {
              border = 'border-amber-400 ring-4 ring-amber-400/40';
              bg = 'bg-amber-950/80';
              text = 'text-amber-200';
            } else if (inCurrentWindow) {
              border = 'border-indigo-500/80 ring-2 ring-indigo-500/30';
              bg = 'bg-indigo-950/50';
              text = 'text-indigo-200';
            } else if (isTarget) {
              border = 'border-purple-500/80';
              bg = 'bg-purple-950/40';
              text = 'text-purple-200';
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

        {/* Level Window Details Box */}
        <div className="bg-slate-950/80 border border-slate-800 rounded-xl px-6 py-3 flex items-center gap-6 text-xs text-slate-300">
          <div>
            <span className="text-slate-500 block text-[10px] uppercase">Active BFS Tier</span>
            <span className="font-mono text-base font-bold text-emerald-400">
              Tier {step.jumps}
            </span>
          </div>
          <div>
            <span className="text-slate-500 block text-[10px] uppercase">Window Bounds</span>
            <span className="font-mono text-base font-bold text-indigo-300">
              [{step.l} .. {step.r}]
            </span>
          </div>
          <div>
            <span className="text-slate-500 block text-[10px] uppercase">Farthest Reach</span>
            <span className="font-mono text-base font-bold text-amber-300">
              Index {step.farthest}
            </span>
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
