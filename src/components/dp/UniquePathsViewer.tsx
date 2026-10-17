import React from 'react';
import type { UniquePathsStep } from '../../algorithms/uniquePathsIntuitive';

interface UniquePathsViewerProps {
  step: UniquePathsStep;
  m: number;
  n: number;
}

export const UniquePathsViewer: React.FC<UniquePathsViewerProps> = ({
  step,
  m,
  n,
}) => {
  return (
    <div className="flex flex-col h-full gap-4 p-4 select-none">
      {/* Top Status & Variable Badges */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
        <div className="bg-slate-900 border border-slate-800 rounded-xl p-3 flex flex-col justify-center">
          <span className="text-xs text-slate-400 font-medium">Current Cell (r, c)</span>
          <span className="text-base font-mono font-bold text-sky-400">
            ({step.r}, {step.c})
          </span>
        </div>
        <div className="bg-slate-900 border border-slate-800 rounded-xl p-3 flex flex-col justify-center">
          <span className="text-xs text-slate-400 font-medium">From Top & Left</span>
          <span className="text-sm font-mono font-bold text-indigo-300">
            {step.fromTop} + {step.fromLeft}
          </span>
        </div>
        <div className="bg-slate-900 border border-slate-800 rounded-xl p-3 flex flex-col justify-center">
          <span className="text-xs text-slate-400 font-medium">Paths to (r, c)</span>
          <span className="text-lg font-mono font-bold text-emerald-400">
            {step.cellVal}
          </span>
        </div>
        <div className="bg-slate-900 border border-slate-800 rounded-xl p-3 flex flex-col justify-center">
          <span className="text-xs text-slate-400 font-medium">Destination Paths</span>
          <span className="text-xl font-mono font-extrabold text-amber-400">
            {step.grid[m - 1]?.[n - 1] ?? 1}
          </span>
        </div>
      </div>

      {/* 2D Grid Canvas */}
      <div className="flex-1 bg-slate-900/60 border border-slate-800 rounded-xl p-6 flex flex-col justify-center items-center gap-6 relative overflow-hidden">
        <div className="text-xs font-semibold text-slate-400 uppercase tracking-wider">
          Grid Layout: {m} rows &times; {n} columns
        </div>

        <div
          className="grid gap-2.5"
          style={{
            gridTemplateColumns: `repeat(${n}, minmax(0, 1fr))`,
          }}
        >
          {step.grid.map((row, rIdx) =>
            row.map((val, cIdx) => {
              const isStart = rIdx === 0 && cIdx === 0;
              const isEnd = rIdx === m - 1 && cIdx === n - 1;
              const isCurrent = rIdx === step.r && cIdx === step.c;
              const isTopSource = rIdx === step.r - 1 && cIdx === step.c;
              const isLeftSource = rIdx === step.r && cIdx === step.c - 1;

              let border = 'border-slate-800';
              let bg = 'bg-slate-950/70';
              let text = 'text-slate-300';

              if (isCurrent) {
                border = 'border-amber-400 ring-4 ring-amber-400/30';
                bg = 'bg-amber-950/70';
                text = 'text-amber-200';
              } else if (isTopSource || isLeftSource) {
                border = 'border-sky-400/80 ring-2 ring-sky-400/20';
                bg = 'bg-sky-950/40';
                text = 'text-sky-300';
              } else if (isStart) {
                border = 'border-emerald-500/80';
                bg = 'bg-emerald-950/40';
                text = 'text-emerald-300';
              } else if (isEnd) {
                border = 'border-purple-500/80';
                bg = 'bg-purple-950/40';
                text = 'text-purple-300';
              }

              return (
                <div
                  key={`${rIdx}-${cIdx}`}
                  className={`w-14 h-14 md:w-16 md:h-16 rounded-xl border-2 flex flex-col items-center justify-center font-mono font-bold transition-all relative ${border} ${bg} ${text}`}
                >
                  <span className="text-[9px] absolute top-1 left-1.5 text-slate-500 font-sans">
                    {rIdx},{cIdx}
                  </span>
                  <span className="text-base md:text-lg mt-2">{val}</span>
                  {isStart && (
                    <span className="text-[8px] absolute bottom-1 text-emerald-400 font-sans uppercase">
                      Start
                    </span>
                  )}
                  {isEnd && (
                    <span className="text-[8px] absolute bottom-1 text-purple-400 font-sans uppercase">
                      Goal
                    </span>
                  )}
                </div>
              );
            })
          )}
        </div>

        {/* Transition Formula Badge */}
        <div className="bg-slate-950/80 border border-slate-800 rounded-xl px-4 py-2 flex items-center gap-3 text-xs text-slate-400">
          <span className="font-semibold text-slate-300">Recurrence:</span>
          <span>dp[r][c] = dp[r-1][c] (from above) + dp[r][c-1] (from left)</span>
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
