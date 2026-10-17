import React from 'react';
import type { SpiralMatrixStep } from '../../algorithms/spiralMatrixIntuitive';
import { HelpCircle, CheckCircle2, ArrowRight, ArrowDown, ArrowLeft, ArrowUp } from 'lucide-react';

interface SpiralMatrixViewerProps {
  step: SpiralMatrixStep;
}

export const SpiralMatrixViewer: React.FC<SpiralMatrixViewerProps> = ({ step }) => {
  const m = step.matrix.length;
  const n = step.matrix[0].length;

  return (
    <div className="flex flex-col h-full gap-3 p-4 select-none">
      {/* Top Status & Variable Badges */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
        <div className="bg-slate-900 border border-slate-800 rounded-xl p-3 flex flex-col justify-center">
          <span className="text-xs text-slate-400 font-medium">Visiting Cell</span>
          <span className="text-base font-mono font-bold text-sky-400">
            {step.currentCell ? `[${step.currentCell[0]}, ${step.currentCell[1]}] = ${step.matrix[step.currentCell[0]][step.currentCell[1]]}` : '—'}
          </span>
        </div>
        <div className="bg-slate-900 border border-slate-800 rounded-xl p-3 flex flex-col justify-center">
          <span className="text-xs text-slate-400 font-medium">Current Direction</span>
          <span className="text-sm font-bold uppercase text-amber-300 flex items-center gap-1.5">
            {step.direction === 'right' && <><ArrowRight className="w-4 h-4 text-amber-400" /> Right</>}
            {step.direction === 'down' && <><ArrowDown className="w-4 h-4 text-amber-400" /> Down</>}
            {step.direction === 'left' && <><ArrowLeft className="w-4 h-4 text-amber-400" /> Left</>}
            {step.direction === 'up' && <><ArrowUp className="w-4 h-4 text-amber-400" /> Up</>}
            {step.direction === 'none' && 'Idle / Complete'}
          </span>
        </div>
        <div className="bg-slate-900 border border-slate-800 rounded-xl p-3 flex flex-col justify-center">
          <span className="text-xs text-slate-400 font-medium">Active Box Bounds</span>
          <span className="text-xs font-mono font-bold text-indigo-300">
            R:[{step.top}..{step.bottom}] C:[{step.left}..{step.right}]
          </span>
        </div>
        <div className="bg-slate-900 border border-slate-800 rounded-xl p-3 flex flex-col justify-center">
          <span className="text-xs text-slate-400 font-medium">Visited Elements</span>
          <span className="text-2xl font-mono font-black text-emerald-400">
            {step.result.length} / {m * n}
          </span>
        </div>
      </div>

      {/* Main Matrix & Path Canvas */}
      <div className="flex-1 bg-slate-900/60 border border-slate-800 rounded-xl p-5 flex flex-col justify-between items-center gap-4 relative overflow-hidden">
        {/* Matrix Grid with Boundary Shading */}
        <div className="flex flex-col items-center gap-2">
          <div className="text-xs font-semibold text-slate-400 uppercase tracking-wider">
            Spiral Traversal Track ({m} x {n})
          </div>
          <div
            className="grid gap-2 p-3 bg-slate-950/80 border border-slate-800 rounded-2xl shadow-xl"
            style={{
              gridTemplateColumns: `repeat(${n}, minmax(0, 1fr))`,
            }}
          >
            {step.matrix.map((row, r) =>
              row.map((val, c) => {
                const key = `${r},${c}`;
                const isCurrent = step.currentCell && step.currentCell[0] === r && step.currentCell[1] === c;
                const visitedIdx = step.visitedCells.indexOf(key);
                const isVisited = visitedIdx !== -1;
                const inBounds = r >= step.top && r <= step.bottom && c >= step.left && c <= step.right;

                let cellStyle = 'bg-slate-900/80 border-slate-700/80 text-slate-300';
                if (isCurrent) {
                  cellStyle = 'bg-amber-600 border-amber-300 text-white shadow-lg shadow-amber-500/40 scale-110 z-20 animate-pulse';
                } else if (isVisited) {
                  cellStyle = 'bg-emerald-950/80 border-emerald-500/60 text-emerald-200 shadow-sm';
                } else if (inBounds) {
                  cellStyle = 'bg-indigo-950/40 border-indigo-700/50 text-indigo-200';
                }

                return (
                  <div
                    key={key}
                    className={`w-12 h-12 md:w-14 md:h-14 rounded-xl border-2 flex flex-col items-center justify-center font-mono transition-all duration-200 relative ${cellStyle}`}
                  >
                    <span className="text-base md:text-lg font-black">{val}</span>
                    {isVisited && (
                      <span className="absolute top-0.5 right-1 text-[8px] font-mono text-emerald-300 font-semibold">
                        #{visitedIdx + 1}
                      </span>
                    )}
                  </div>
                );
              })
            )}
          </div>
        </div>

        {/* Collected Stream */}
        <div className="w-full max-w-2xl flex flex-col gap-1">
          <div className="text-xs font-semibold text-slate-400 uppercase tracking-wider flex items-center justify-between">
            <span>Spiral Output Sequence</span>
            <span className="text-[11px] font-mono text-emerald-300">
              {step.result.length} items
            </span>
          </div>
          <div className="flex items-center gap-1.5 overflow-x-auto p-2 bg-slate-950 border border-slate-800 rounded-xl min-h-[44px]">
            {step.result.map((item, idx) => (
              <span
                key={idx}
                className="px-2 py-0.5 rounded bg-emerald-950 border border-emerald-600/70 text-emerald-200 font-mono text-xs font-bold shrink-0"
              >
                {item}
              </span>
            ))}
          </div>
        </div>

        {/* Bottom Explanation Banner */}
        <div className="w-full bg-slate-950/80 border border-slate-800/80 rounded-xl px-4 py-2.5 text-xs text-slate-300 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <HelpCircle className="w-4 h-4 text-indigo-400 shrink-0" />
            <span>{step.explanation}</span>
          </div>
          {step.result.length === m * n && (
            <span className="text-emerald-400 font-semibold flex items-center gap-1 shrink-0">
              <CheckCircle2 className="w-4 h-4" /> Traversed
            </span>
          )}
        </div>
      </div>
    </div>
  );
};
