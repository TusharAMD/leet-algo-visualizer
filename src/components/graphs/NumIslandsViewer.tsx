import React from 'react';
import { NumIslandsStep } from '../../algorithms/numIslandsIntuitive';
import { Trees, CheckCircle2, Waves, Sparkles } from 'lucide-react';

interface NumIslandsViewerProps {
  step: NumIslandsStep;
}

const islandColors = [
  { border: 'border-emerald-400', bg: 'bg-emerald-950/80', text: 'text-emerald-300' },
  { border: 'border-cyan-400', bg: 'bg-cyan-950/80', text: 'text-cyan-300' },
  { border: 'border-amber-400', bg: 'bg-amber-950/80', text: 'text-amber-300' },
  { border: 'border-purple-400', bg: 'bg-purple-950/80', text: 'text-purple-300' },
  { border: 'border-rose-400', bg: 'bg-rose-950/80', text: 'text-rose-300' }
];

export const NumIslandsViewer: React.FC<NumIslandsViewerProps> = ({ step }) => {
  const { grid, currR, currC, action, islandsCount } = step;
  const rows = grid.length;
  const cols = grid[0].length;

  return (
    <div className="flex-1 min-h-0 flex flex-col bg-slate-900/60 border border-slate-800 rounded-2xl p-3 shadow-xl overflow-hidden justify-between">
      {/* Top Banner */}
      <div className="bg-slate-950/70 border border-slate-800/80 rounded-xl p-2.5 flex items-center justify-between shrink-0">
        <div className="flex items-center gap-2">
          <span className="p-1.5 rounded-lg bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
            <Trees className="w-4 h-4" />
          </span>
          <div>
            <h3 className="text-xs font-semibold text-white tracking-wide">{step.headline}</h3>
            <p className="text-[11px] text-slate-400">{step.subtext}</p>
          </div>
        </div>
        <div className="flex items-center gap-2">
          {step.isComplete ? (
            <span className="px-2 py-0.5 rounded-md bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 text-[11px] font-semibold flex items-center gap-1">
              <CheckCircle2 className="w-3.5 h-3.5" /> {islandsCount} Islands Total
            </span>
          ) : (
            <span className="px-2 py-0.5 rounded-md bg-indigo-500/10 border border-indigo-500/20 text-indigo-400 text-[11px] font-mono">
              Step {step.stepIndex + 1} / {step.totalSteps}
            </span>
          )}
        </div>
      </div>

      {/* Main Grid Canvas */}
      <div className="flex-1 min-h-0 flex items-center justify-center p-2">
        <div
          className="grid gap-1.5 p-3 bg-slate-950 border-2 border-slate-800 rounded-2xl shadow-2xl"
          style={{
            gridTemplateColumns: `repeat(${cols}, minmax(0, 1fr))`,
          }}
        >
          {grid.map((row, r) =>
            row.map((cell, c) => {
              const isCurrent = currR === r && currC === c && !step.isComplete;
              const isSunken = cell.status === 'sunken';
              const isLand = cell.val === '1';
              const islandColor =
                cell.islandId !== undefined
                  ? islandColors[(cell.islandId - 1) % islandColors.length]
                  : null;

              return (
                <div
                  key={`${r}-${c}`}
                  className={`w-12 h-12 md:w-14 md:h-14 rounded-xl border flex flex-col items-center justify-center relative transition-all duration-300 ${
                    isCurrent
                      ? 'border-indigo-400 bg-indigo-500/30 scale-105 ring-2 ring-indigo-400 shadow-lg shadow-indigo-500/20 z-10'
                      : isSunken && islandColor
                      ? `${islandColor.border} ${islandColor.bg} ${islandColor.text} shadow-md`
                      : isLand
                      ? 'border-emerald-500/80 bg-emerald-950/60 text-emerald-300'
                      : 'border-slate-800/80 bg-blue-950/20 text-blue-400/60'
                  }`}
                >
                  <span className="absolute top-1 left-1.5 text-[8px] font-mono text-slate-500">
                    {r},{c}
                  </span>

                  {isSunken && (
                    <div className="flex flex-col items-center">
                      <span className="text-xs font-bold font-mono">#{cell.islandId}</span>
                      <span className="text-[8px] font-mono uppercase tracking-wider text-slate-400">sunk</span>
                    </div>
                  )}

                  {isLand && !isSunken && (
                    <div className="flex flex-col items-center">
                      <Trees className="w-5 h-5 text-emerald-400 drop-shadow" />
                      <span className="text-[8px] font-bold text-emerald-300">LAND (1)</span>
                    </div>
                  )}

                  {!isLand && !isSunken && (
                    <div className="flex flex-col items-center">
                      <Waves className="w-4 h-4 text-blue-500/40" />
                      <span className="text-[8px] font-mono text-slate-600">0</span>
                    </div>
                  )}
                </div>
              );
            })
          )}
        </div>
      </div>

      {/* Footnote Explainer */}
      <div className="bg-slate-950/80 border border-slate-800/80 rounded-xl p-2.5 flex items-center justify-between gap-3 text-xs shrink-0">
        <div className="flex items-center gap-2">
          <span className="text-emerald-400 font-bold font-mono">Flood Fill Principle:</span>
          <span className="text-slate-300">
            Sinking visited land to '0' mutates the grid in-place, eliminating the need for an O(m*n) visited matrix!
          </span>
        </div>
        <div className="flex items-center gap-3 shrink-0 text-[11px] font-mono text-slate-400">
          <span className="flex items-center gap-1 text-emerald-400 font-bold">
            <Sparkles className="w-3.5 h-3.5" /> Total Islands: {islandsCount}
          </span>
        </div>
      </div>
    </div>
  );
};
