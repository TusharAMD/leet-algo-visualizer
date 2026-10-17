import React from 'react';
import type { LIPStep } from '../../algorithms/longestIncreasingPathIntuitive';

interface LongestIncreasingPathViewerProps {
  step: LIPStep;
  matrix: number[][];
}

export const LongestIncreasingPathViewer: React.FC<LongestIncreasingPathViewerProps> = ({
  step,
  matrix,
}) => {
  const rows = matrix.length;
  const cols = matrix[0]?.length || 0;

  return (
    <div className="flex flex-col h-full gap-4 p-4 select-none">
      {/* Top Status & Variable Badges */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
        <div className="bg-slate-900 border border-slate-800 rounded-xl p-3 flex flex-col justify-center">
          <span className="text-xs text-slate-400 font-medium">Inspecting Cell</span>
          <span className="text-base font-mono font-bold text-sky-400">
            {step.r >= 0 ? `(${step.r}, ${step.c}) [val=${matrix[step.r]?.[step.c]}]` : '—'}
          </span>
        </div>
        <div className="bg-slate-900 border border-slate-800 rounded-xl p-3 flex flex-col justify-center">
          <span className="text-xs text-slate-400 font-medium">Adjacent Neighbor</span>
          <span className="text-base font-mono font-bold text-amber-300">
            {step.activeNeighbor
              ? `(${step.activeNeighbor[0]}, ${step.activeNeighbor[1]}) [val=${matrix[step.activeNeighbor[0]]?.[step.activeNeighbor[1]]}]`
              : '—'}
          </span>
        </div>
        <div className="bg-slate-900 border border-slate-800 rounded-xl p-3 flex flex-col justify-center">
          <span className="text-xs text-slate-400 font-medium">Step Condition</span>
          <span className={`text-sm font-bold ${step.isValidStep ? 'text-emerald-400' : 'text-slate-400'}`}>
            {step.activeNeighbor ? (step.isValidStep ? 'Neighbor > Cell ✓' : 'Neighbor ≤ Cell ✗') : '—'}
          </span>
        </div>
        <div className="bg-slate-900 border border-slate-800 rounded-xl p-3 flex flex-col justify-center">
          <span className="text-xs text-slate-400 font-medium">Max Path Length</span>
          <span className="text-2xl font-mono font-black text-emerald-400">
            {step.maxPath}
          </span>
        </div>
      </div>

      {/* Main Dual Grid Canvas: Raw Matrix & Memoized Lengths */}
      <div className="flex-1 bg-slate-900/60 border border-slate-800 rounded-xl p-6 flex flex-col md:flex-row justify-center items-center gap-8 relative overflow-auto">
        {/* Left: Input Matrix */}
        <div className="flex flex-col items-center gap-2">
          <div className="text-xs font-semibold text-slate-400 uppercase tracking-wider">
            Input Matrix (Values)
          </div>
          <div
            className="grid gap-2"
            style={{
              gridTemplateColumns: `repeat(${cols}, minmax(0, 1fr))`,
            }}
          >
            {matrix.map((row, rIdx) =>
              row.map((val, cIdx) => {
                const isCurrent = rIdx === step.r && cIdx === step.c;
                const isNeighbor =
                  step.activeNeighbor &&
                  step.activeNeighbor[0] === rIdx &&
                  step.activeNeighbor[1] === cIdx;
                const inChain = step.pathChain.some(
                  ([pr, pc]) => pr === rIdx && pc === cIdx
                );

                let border = 'border-slate-800';
                let bg = 'bg-slate-950/70';
                let text = 'text-slate-300';

                if (isCurrent) {
                  border = 'border-sky-400 ring-4 ring-sky-400/40';
                  bg = 'bg-sky-950/80';
                  text = 'text-sky-200';
                } else if (isNeighbor) {
                  border = step.isValidStep
                    ? 'border-emerald-400 ring-2 ring-emerald-400/40'
                    : 'border-rose-500/80';
                  bg = step.isValidStep ? 'bg-emerald-950/70' : 'bg-rose-950/40';
                  text = step.isValidStep ? 'text-emerald-200' : 'text-rose-300';
                } else if (inChain) {
                  border = 'border-amber-400';
                  bg = 'bg-amber-950/50';
                  text = 'text-amber-200';
                }

                return (
                  <div
                    key={`${rIdx}-${cIdx}`}
                    className={`w-14 h-14 rounded-xl border-2 flex flex-col items-center justify-center font-mono font-bold text-base transition-all relative ${border} ${bg} ${text}`}
                  >
                    <span className="text-[9px] absolute top-1 left-1.5 text-slate-500 font-sans">
                      {rIdx},{cIdx}
                    </span>
                    <span className="mt-2">{val}</span>
                  </div>
                );
              })
            )}
          </div>
        </div>

        {/* Right: Memoized Path Lengths Grid */}
        <div className="flex flex-col items-center gap-2">
          <div className="text-xs font-semibold text-slate-400 uppercase tracking-wider">
            Memoized DP Table: dp[r][c] (Path Length)
          </div>
          <div
            className="grid gap-2"
            style={{
              gridTemplateColumns: `repeat(${cols}, minmax(0, 1fr))`,
            }}
          >
            {step.memo.map((row, rIdx) =>
              row.map((val, cIdx) => {
                const isCurrent = rIdx === step.r && cIdx === step.c;

                return (
                  <div
                    key={`${rIdx}-${cIdx}`}
                    className={`w-14 h-14 rounded-xl border flex flex-col items-center justify-center font-mono font-bold text-base transition-all ${
                      isCurrent
                        ? 'border-amber-400 bg-amber-950/70 text-amber-200 ring-2 ring-amber-400/30'
                        : val > 0
                        ? 'border-emerald-700/60 bg-emerald-950/40 text-emerald-300'
                        : 'border-slate-800 bg-slate-950/50 text-slate-600'
                    }`}
                  >
                    <span>{val > 0 ? val : '—'}</span>
                  </div>
                );
              })
            )}
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
