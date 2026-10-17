import React from 'react';
import type { RotateImageStep } from '../../algorithms/rotateImageIntuitive';
import { HelpCircle, CheckCircle2, RotateCw } from 'lucide-react';

interface RotateImageViewerProps {
  step: RotateImageStep;
}

export const RotateImageViewer: React.FC<RotateImageViewerProps> = ({ step }) => {
  const n = step.matrix.length;

  return (
    <div className="flex flex-col h-full gap-3 p-4 select-none">
      {/* Top Status & Variable Badges */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
        <div className="bg-slate-900 border border-slate-800 rounded-xl p-3 flex flex-col justify-center">
          <span className="text-xs text-slate-400 font-medium">Matrix Size</span>
          <span className="text-base font-mono font-bold text-sky-400">
            {n} x {n} Grid
          </span>
        </div>
        <div className="bg-slate-900 border border-slate-800 rounded-xl p-3 flex flex-col justify-center">
          <span className="text-xs text-slate-400 font-medium">Operation Phase</span>
          <span className="text-sm font-semibold capitalize text-indigo-300">
            {step.phase === 'init' && 'Initial'}
            {step.phase === 'transpose' && '1. Transpose Diagonal Swap'}
            {step.phase === 'reverse_rows' && '2. Horizontal Row Reversal'}
            {step.phase === 'complete' && '3. Rotated Clockwise'}
          </span>
        </div>
        <div className="bg-slate-900 border border-slate-800 rounded-xl p-3 flex flex-col justify-center">
          <span className="text-xs text-slate-400 font-medium">Active Cell / Row</span>
          <span className="text-base font-mono font-bold text-amber-300">
            {step.activeCellA && step.activeCellB
              ? `(${step.activeCellA[0]},${step.activeCellA[1]}) ↔ (${step.activeCellB[0]},${step.activeCellB[1]})`
              : step.activeRow !== null
              ? `Row ${step.activeRow}`
              : '—'}
          </span>
        </div>
        <div className="bg-slate-900 border border-slate-800 rounded-xl p-3 flex flex-col justify-center">
          <span className="text-xs text-slate-400 font-medium">Status</span>
          <div className="flex items-center gap-1.5 mt-0.5">
            {step.phase === 'complete' ? (
              <span className="text-sm font-bold text-emerald-400 flex items-center gap-1">
                <CheckCircle2 className="w-4 h-4" /> 90° Rotated
              </span>
            ) : (
              <span className="text-sm font-bold text-sky-400 flex items-center gap-1">
                <RotateCw className="w-4 h-4 animate-spin" /> In Progress
              </span>
            )}
          </div>
        </div>
      </div>

      {/* Main 2D Matrix Canvas */}
      <div className="flex-1 bg-slate-900/60 border border-slate-800 rounded-xl p-6 flex flex-col justify-center items-center gap-6 relative overflow-hidden">
        <div className="text-xs font-semibold text-slate-400 uppercase tracking-wider flex items-center gap-2">
          <span>In-Place Matrix Transformation Grid</span>
        </div>

        {/* Matrix Grid */}
        <div
          className="grid gap-2.5 p-4 bg-slate-950/80 border border-slate-800 rounded-2xl shadow-2xl"
          style={{
            gridTemplateColumns: `repeat(${n}, minmax(0, 1fr))`,
          }}
        >
          {step.matrix.map((row, r) =>
            row.map((val, c) => {
              const isCellA = step.activeCellA && step.activeCellA[0] === r && step.activeCellA[1] === c;
              const isCellB = step.activeCellB && step.activeCellB[0] === r && step.activeCellB[1] === c;
              const isRowActive = step.activeRow === r;

              let cellStyle = 'bg-slate-900/90 border-slate-700/80 text-slate-200';
              if (isCellA || isCellB) {
                cellStyle = 'bg-amber-600 border-amber-300 text-white shadow-lg shadow-amber-500/40 scale-110 z-10 animate-pulse';
              } else if (isRowActive) {
                cellStyle = 'bg-indigo-950/80 border-indigo-400 text-indigo-100 shadow-md shadow-indigo-500/20';
              } else if (r === c) {
                cellStyle = 'bg-slate-900 border-slate-600 text-slate-300';
              }

              return (
                <div
                  key={`${r}-${c}`}
                  className={`w-14 h-14 md:w-16 md:h-16 rounded-xl border-2 flex flex-col items-center justify-center font-mono transition-all duration-300 ${cellStyle}`}
                >
                  <span className="text-lg md:text-xl font-black">{val}</span>
                  <span className="text-[9px] font-mono opacity-50">
                    [{r},{c}]
                  </span>
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
