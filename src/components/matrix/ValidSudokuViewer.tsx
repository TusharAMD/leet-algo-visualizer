import React from 'react';
import { ValidSudokuStep } from '../../algorithms/validSudokuIntuitive';
import { Grid3X3, CheckCircle2, AlertTriangle, ShieldCheck, Zap } from 'lucide-react';

interface ValidSudokuViewerProps {
  step: ValidSudokuStep;
}

export const ValidSudokuViewer: React.FC<ValidSudokuViewerProps> = ({ step }) => {
  const { board, currentRow, currentCol, currentVal, boxKey, conflictType, conflictPos, isValid, isComplete } = step;

  const currentBoxR = currentRow >= 0 ? Math.floor(currentRow / 3) : -1;
  const currentBoxC = currentCol >= 0 ? Math.floor(currentCol / 3) : -1;

  return (
    <div className="flex-1 min-h-0 flex flex-col bg-slate-900/60 border border-slate-800 rounded-2xl p-3 shadow-xl overflow-hidden justify-between">
      {/* Top Banner */}
      <div className="bg-slate-950/70 border border-slate-800/80 rounded-xl p-2.5 flex items-center justify-between shrink-0">
        <div className="flex items-center gap-2">
          <span className="p-1.5 rounded-lg bg-indigo-500/10 text-indigo-400 border border-indigo-500/20">
            <Grid3X3 className="w-4 h-4" />
          </span>
          <div>
            <h3 className="text-xs font-semibold text-white tracking-wide">{step.headline}</h3>
            <p className="text-[11px] text-slate-400">{step.subtext}</p>
          </div>
        </div>
        <div className="flex items-center gap-2">
          {isComplete ? (
            isValid ? (
              <span className="px-2 py-0.5 rounded-md bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 text-[11px] font-semibold flex items-center gap-1">
                <ShieldCheck className="w-3.5 h-3.5" /> Valid Sudoku (True)
              </span>
            ) : (
              <span className="px-2 py-0.5 rounded-md bg-rose-500/10 border border-rose-500/20 text-rose-400 text-[11px] font-semibold flex items-center gap-1">
                <AlertTriangle className="w-3.5 h-3.5" /> Invalid Board ({conflictType} Duplicate)
              </span>
            )
          ) : (
            <span className="px-2 py-0.5 rounded-md bg-indigo-500/10 border border-indigo-500/20 text-indigo-400 text-[11px] font-mono">
              Step {step.stepIndex + 1} / {step.totalSteps}
            </span>
          )}
        </div>
      </div>

      {/* Main Visual Arena: 9x9 Sudoku Board */}
      <div className="flex-1 min-h-0 flex items-center justify-center p-2">
        <div className="grid grid-cols-9 gap-[2px] bg-slate-950/90 p-2 rounded-2xl border-2 border-indigo-500/40 shadow-2xl">
          {board.map((rowArr, r) =>
            rowArr.map((val, c) => {
              const isCurrent = currentRow === r && currentCol === c;
              const isConflict = conflictPos && conflictPos[0] === r && conflictPos[1] === c;
              const inSameRow = currentRow === r;
              const inSameCol = currentCol === c;
              const inSameBox =
                currentBoxR >= 0 &&
                currentBoxC >= 0 &&
                Math.floor(r / 3) === currentBoxR &&
                Math.floor(c / 3) === currentBoxC;

              const isRight3x3Border = c === 2 || c === 5;
              const isBottom3x3Border = r === 2 || r === 5;

              let cellColor = 'bg-slate-900/80 text-slate-300';
              if (val === '.') {
                cellColor = 'bg-slate-950/40 text-slate-700';
              }

              if (inSameRow || inSameCol || inSameBox) {
                cellColor = 'bg-indigo-950/40 text-indigo-200';
              }

              if (isConflict) {
                cellColor = 'bg-rose-500/40 border-rose-400 text-rose-200 font-bold scale-110 shadow-lg shadow-rose-500/30 ring-2 ring-rose-500';
              } else if (isCurrent) {
                cellColor = !isValid
                  ? 'bg-rose-500/40 border-rose-400 text-rose-200 font-bold scale-110 ring-2 ring-rose-500'
                  : 'bg-amber-500/30 border-amber-400 text-amber-200 font-bold scale-110 shadow-lg shadow-amber-500/30 ring-2 ring-amber-400';
              }

              return (
                <div
                  key={`${r}-${c}`}
                  className={`w-7 h-7 sm:w-8 sm:h-8 flex items-center justify-center font-mono text-xs sm:text-sm font-bold rounded transition-all border border-slate-800/80 ${cellColor} ${
                    isRight3x3Border ? 'mr-1 border-r-2 border-r-indigo-500/40' : ''
                  } ${isBottom3x3Border ? 'mb-1 border-b-2 border-b-indigo-500/40' : ''}`}
                >
                  {val === '.' ? '' : val}
                </div>
              );
            })
          )}
        </div>
      </div>

      {/* Bottom Legend */}
      <div className="bg-slate-950/60 border border-slate-800/80 rounded-xl p-2.5 flex items-center justify-between text-xs font-mono">
        <div className="flex items-center gap-3">
          <div className="flex items-center gap-1.5">
            <span className="w-3 h-3 rounded bg-amber-500/30 border border-amber-400" />
            <span className="text-slate-400">Scanning Cell</span>
          </div>
          <div className="flex items-center gap-1.5">
            <span className="w-3 h-3 rounded bg-indigo-950/60 border border-indigo-500/30" />
            <span className="text-slate-400">Row, Col & 3x3 Box Zone</span>
          </div>
          <div className="flex items-center gap-1.5">
            <span className="w-3 h-3 rounded bg-rose-500/40 border border-rose-400" />
            <span className="text-rose-400 font-semibold">Collision Duplicate</span>
          </div>
        </div>
        <span className="text-slate-500 font-bold">9x9 Grid (81 cells)</span>
      </div>
    </div>
  );
};
