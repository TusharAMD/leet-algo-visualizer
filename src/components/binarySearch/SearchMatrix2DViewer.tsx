import React from 'react';
import { SearchMatrix2DStep } from '../../algorithms/searchMatrix2DIntuitive';
import { Grid, Search, CheckCircle2, AlertTriangle, ShieldCheck } from 'lucide-react';

interface SearchMatrix2DViewerProps {
  step: SearchMatrix2DStep;
}

export const SearchMatrix2DViewer: React.FC<SearchMatrix2DViewerProps> = ({ step }) => {
  const { matrix, target, left, right, mid, midRow, midCol, midVal, found, isComplete } = step;

  const ROWS = matrix.length;
  const COLS = matrix[0].length;

  return (
    <div className="flex-1 min-h-0 flex flex-col bg-slate-900/60 border border-slate-800 rounded-2xl p-3 shadow-xl overflow-hidden justify-between">
      {/* Top Banner */}
      <div className="bg-slate-950/70 border border-slate-800/80 rounded-xl p-2.5 flex items-center justify-between shrink-0">
        <div className="flex items-center gap-2">
          <span className="p-1.5 rounded-lg bg-indigo-500/10 text-indigo-400 border border-indigo-500/20">
            <Search className="w-4 h-4" />
          </span>
          <div>
            <h3 className="text-xs font-semibold text-white tracking-wide">{step.headline}</h3>
            <p className="text-[11px] text-slate-400">{step.subtext}</p>
          </div>
        </div>
        <div className="flex items-center gap-2">
          {isComplete ? (
            found ? (
              <span className="px-2 py-0.5 rounded-md bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 text-[11px] font-semibold flex items-center gap-1">
                <ShieldCheck className="w-3.5 h-3.5" /> Found (True)
              </span>
            ) : (
              <span className="px-2 py-0.5 rounded-md bg-rose-500/10 border border-rose-500/20 text-rose-400 text-[11px] font-semibold flex items-center gap-1">
                <AlertTriangle className="w-3.5 h-3.5" /> Not Found (False)
              </span>
            )
          ) : (
            <span className="px-2 py-0.5 rounded-md bg-indigo-500/10 border border-indigo-500/20 text-indigo-400 text-[11px] font-mono">
              Step {step.stepIndex + 1} / {step.totalSteps}
            </span>
          )}
        </div>
      </div>

      {/* Main Arena: 2D Matrix Grid */}
      <div className="flex-1 min-h-0 flex items-center justify-center p-2">
        <div className="flex flex-col gap-1.5 bg-slate-950/80 p-4 rounded-2xl border border-slate-800 shadow-xl max-w-lg w-full">
          {matrix.map((rowArr, r) => (
            <div key={r} className="flex items-center gap-1.5 justify-center">
              <span className="text-[10px] font-mono text-slate-500 w-6 text-right mr-1">R{r}</span>
              {rowArr.map((val, c) => {
                const flatIdx = r * COLS + c;
                const isMid = midRow === r && midCol === c;
                const inSearchRange = flatIdx >= left && flatIdx <= right;

                let cellColor = 'bg-slate-900 border-slate-800 text-slate-500 opacity-40';
                if (inSearchRange) {
                  cellColor = 'bg-slate-900/90 border-slate-700 text-slate-200';
                }

                if (isMid) {
                  if (found) {
                    cellColor = 'bg-emerald-500/30 border-emerald-400 text-emerald-200 font-bold scale-110 shadow-lg shadow-emerald-500/30 ring-2 ring-emerald-500';
                  } else {
                    cellColor = 'bg-amber-500/30 border-amber-400 text-amber-200 font-bold scale-110 shadow-lg shadow-amber-500/30 ring-2 ring-amber-400';
                  }
                }

                return (
                  <div
                    key={c}
                    className={`w-14 h-11 flex flex-col items-center justify-center rounded-xl border transition-all ${cellColor}`}
                  >
                    <span className="font-mono text-sm font-bold">{val}</span>
                    <span className="text-[8px] font-mono text-slate-500">idx {flatIdx}</span>
                  </div>
                );
              })}
            </div>
          ))}
        </div>
      </div>

      {/* Bottom Math Bar: Coordinate Formula Spotlight */}
      <div className="bg-slate-950/60 border border-slate-800/80 rounded-xl p-2.5 flex items-center justify-between text-xs font-mono">
        <div className="flex items-center gap-3">
          <span className="text-slate-400">Virtual 1D Bounds:</span>
          <span className="px-2 py-0.5 rounded bg-indigo-500/20 text-indigo-300 font-bold">
            [{left} .. {right}]
          </span>
          {mid >= 0 && (
            <span className="text-slate-300">
              mid = <span className="text-amber-400 font-bold">{mid}</span> → row: <span className="text-white font-bold">{midRow}</span>, col: <span className="text-white font-bold">{midCol}</span>
            </span>
          )}
        </div>
        <div className="flex items-center gap-2">
          <span className="text-slate-400">Target:</span>
          <span className="px-2.5 py-0.5 rounded bg-emerald-500/20 border border-emerald-500/40 text-emerald-300 font-bold">
            {target}
          </span>
        </div>
      </div>
    </div>
  );
};
