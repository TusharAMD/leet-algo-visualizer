import React from 'react';
import type { SetMatrixZeroesStep } from '../../algorithms/setMatrixZeroesIntuitive';
import { HelpCircle, CheckCircle2 } from 'lucide-react';

interface SetMatrixZeroesViewerProps {
  step: SetMatrixZeroesStep;
}

export const SetMatrixZeroesViewer: React.FC<SetMatrixZeroesViewerProps> = ({ step }) => {
  const ROWS = step.matrix.length;
  const COLS = step.matrix[0].length;

  return (
    <div className="flex flex-col h-full gap-3 p-4 select-none">
      {/* Top Status & Variable Badges */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
        <div className="bg-slate-900 border border-slate-800 rounded-xl p-3 flex flex-col justify-center">
          <span className="text-xs text-slate-400 font-medium">Inspecting Cell</span>
          <span className="text-base font-mono font-bold text-sky-400">
            {step.activeCell ? `(${step.activeCell[0]}, ${step.activeCell[1]})` : '—'}
          </span>
        </div>
        <div className="bg-slate-900 border border-slate-800 rounded-xl p-3 flex flex-col justify-center">
          <span className="text-xs text-slate-400 font-medium">rowZero Flag</span>
          <span
            className={`text-base font-mono font-bold ${
              step.rowZero ? 'text-rose-400' : 'text-slate-400'
            }`}
          >
            {step.rowZero ? 'True (Zero Row 0)' : 'False'}
          </span>
        </div>
        <div className="bg-slate-900 border border-slate-800 rounded-xl p-3 flex flex-col justify-center">
          <span className="text-xs text-slate-400 font-medium">Phase</span>
          <span className="text-xs font-semibold capitalize text-indigo-300">
            {step.phase === 'init' && '1. Initialization'}
            {step.phase === 'scan_mark' && '2. Scanning & Header Marking'}
            {step.phase === 'fill_inner' && '3. Inner Zero Propagation'}
            {step.phase === 'fill_first_col' && '4. First Col Sweep'}
            {step.phase === 'fill_first_row' && '5. First Row Sweep'}
            {step.phase === 'complete' && '6. Done'}
          </span>
        </div>
        <div className="bg-slate-900 border border-slate-800 rounded-xl p-3 flex flex-col justify-center">
          <span className="text-xs text-slate-400 font-medium">Dimensions</span>
          <span className="text-base font-mono font-bold text-slate-300">
            {ROWS} Rows x {COLS} Cols
          </span>
        </div>
      </div>

      {/* Main 2D Matrix Canvas */}
      <div className="flex-1 bg-slate-900/60 border border-slate-800 rounded-xl p-6 flex flex-col justify-center items-center gap-6 relative overflow-hidden">
        <div className="text-xs font-semibold text-slate-400 uppercase tracking-wider">
          O(1) Space In-Place Marker Matrix
        </div>

        {/* Matrix Grid */}
        <div
          className="grid gap-2 p-3 bg-slate-950/80 border border-slate-800 rounded-2xl shadow-xl"
          style={{
            gridTemplateColumns: `repeat(${COLS}, minmax(0, 1fr))`,
          }}
        >
          {step.matrix.map((row, r) =>
            row.map((val, c) => {
              const isCurrent = step.activeCell && step.activeCell[0] === r && step.activeCell[1] === c;
              const isMarker = r === 0 || c === 0;
              const isZero = val === 0;

              let cellStyle = 'bg-slate-900/80 border-slate-700/80 text-slate-300';
              if (isCurrent) {
                cellStyle = 'bg-amber-600 border-amber-300 text-white shadow-lg shadow-amber-500/40 scale-110 z-20 animate-pulse';
              } else if (isZero) {
                cellStyle = 'bg-rose-950/80 border-rose-500 text-rose-200 font-black shadow-sm';
              } else if (isMarker) {
                cellStyle = 'bg-indigo-950/40 border-indigo-700/50 text-indigo-300';
              }

              return (
                <div
                  key={`${r}-${c}`}
                  className={`w-12 h-12 md:w-14 md:h-14 rounded-xl border-2 flex flex-col items-center justify-center font-mono transition-all duration-200 relative ${cellStyle}`}
                >
                  <span className="text-lg md:text-xl font-bold">{val}</span>
                  <span className="text-[8px] font-mono opacity-40">[{r},{c}]</span>
                </div>
              );
            })
          )}
        </div>

        {/* Bottom Explanation Banner */}
        <div className="w-full bg-slate-950/80 border border-slate-800/80 rounded-xl px-4 py-2.5 text-xs text-slate-300 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <HelpCircle className="w-4 h-4 text-indigo-400 shrink-0" />
            <span>{step.explanation}</span>
          </div>
          {step.phase === 'complete' && (
            <span className="text-emerald-400 font-semibold flex items-center gap-1 shrink-0">
              <CheckCircle2 className="w-4 h-4" /> Ready
            </span>
          )}
        </div>
      </div>
    </div>
  );
};
