import React from 'react';
import { NQueensStep } from '../../algorithms/nQueensIntuitive';
import { Crown, CheckCircle2, ShieldAlert, Sparkles } from 'lucide-react';

interface NQueensViewerProps {
  step: NQueensStep;
}

export const NQueensViewer: React.FC<NQueensViewerProps> = ({ step }) => {
  const { n, queens, currRow, currCol, action, conflictReason } = step;

  // Helper to check if a cell has a queen
  const hasQueen = (r: number, c: number) => {
    return queens.some((q) => q.r === r && q.c === c);
  };

  // Helper to check if cell is under attack
  const isCellUnderAttack = (r: number, c: number) => {
    return (
      step.cols.includes(c) ||
      step.posDiag.includes(r + c) ||
      step.negDiag.includes(r - c)
    );
  };

  return (
    <div className="flex-1 min-h-0 flex flex-col bg-slate-900/60 border border-slate-800 rounded-2xl p-3 shadow-xl overflow-hidden justify-between">
      {/* Top Banner */}
      <div className="bg-slate-950/70 border border-slate-800/80 rounded-xl p-2.5 flex items-center justify-between shrink-0">
        <div className="flex items-center gap-2">
          <span className="p-1.5 rounded-lg bg-amber-500/10 text-amber-400 border border-amber-500/20">
            <Crown className="w-4 h-4" />
          </span>
          <div>
            <h3 className="text-xs font-semibold text-white tracking-wide">{step.headline}</h3>
            <p className="text-[11px] text-slate-400">{step.subtext}</p>
          </div>
        </div>
        <div className="flex items-center gap-2">
          {step.isComplete ? (
            <span className="px-2 py-0.5 rounded-md bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 text-[11px] font-semibold flex items-center gap-1">
              <CheckCircle2 className="w-3.5 h-3.5" /> {step.solutionsCount} Solutions Found
            </span>
          ) : (
            <span className="px-2 py-0.5 rounded-md bg-indigo-500/10 border border-indigo-500/20 text-indigo-400 text-[11px] font-mono">
              Step {step.stepIndex + 1} / {step.totalSteps}
            </span>
          )}
        </div>
      </div>

      {/* Chessboard Canvas */}
      <div className="flex-1 min-h-0 flex items-center justify-center p-2">
        <div
          className="grid gap-1 p-2 bg-slate-950 border-2 border-slate-800 rounded-2xl shadow-2xl"
          style={{
            gridTemplateColumns: `repeat(${n}, minmax(0, 1fr))`,
          }}
        >
          {Array.from({ length: n }).map((_, r) =>
            Array.from({ length: n }).map((_, c) => {
              const queenPlaced = hasQueen(r, c);
              const isCurrentTest = currRow === r && currCol === c;
              const isConflict = isCurrentTest && action === 'conflict';
              const isSafePlaced = isCurrentTest && action === 'place';
              const underAttack = !queenPlaced && isCellUnderAttack(r, c);
              const isLightSquare = (r + c) % 2 === 0;

              return (
                <div
                  key={`${r}-${c}`}
                  className={`w-12 h-12 md:w-14 md:h-14 rounded-xl border flex flex-col items-center justify-center relative transition-all duration-300 ${
                    queenPlaced
                      ? 'border-amber-400 bg-amber-500/20 shadow-lg shadow-amber-500/20 ring-2 ring-amber-400/50 scale-105'
                      : isConflict
                      ? 'border-rose-500 bg-rose-500/30 scale-105 animate-pulse'
                      : isSafePlaced
                      ? 'border-emerald-400 bg-emerald-500/30 scale-105'
                      : isCurrentTest
                      ? 'border-indigo-400 bg-indigo-500/20'
                      : underAttack
                      ? 'border-slate-800/80 bg-rose-950/15 opacity-60'
                      : isLightSquare
                      ? 'border-slate-800/60 bg-slate-900/90'
                      : 'border-slate-800/40 bg-slate-950/80'
                  }`}
                >
                  {/* Coordinates in corner */}
                  <span className="absolute top-1 left-1.5 text-[8px] font-mono text-slate-500">
                    {r},{c}
                  </span>

                  {/* Queen Display */}
                  {queenPlaced && (
                    <Crown className="w-7 h-7 text-amber-400 fill-amber-400/80 drop-shadow-md animate-in zoom-in" />
                  )}

                  {/* Conflict indicator */}
                  {isConflict && (
                    <ShieldAlert className="w-6 h-6 text-rose-400 animate-bounce" />
                  )}

                  {/* Attacked cell cross */}
                  {underAttack && !queenPlaced && !isCurrentTest && (
                    <span className="text-[10px] text-slate-600 font-mono select-none">✕</span>
                  )}
                </div>
              );
            })
          )}
        </div>
      </div>

      {/* Safety Masks Legend & Status Footnote */}
      <div className="bg-slate-950/80 border border-slate-800/80 rounded-xl p-2.5 flex items-center justify-between gap-3 text-xs shrink-0">
        <div className="flex items-center gap-2">
          <span className="text-amber-400 font-bold font-mono">Backtracking Principle:</span>
          <span className="text-slate-300">
            {conflictReason ? (
              <span className="text-rose-400 font-medium">Conflict: {conflictReason}</span>
            ) : (
              'Rows are placed sequentially. Checking O(1) hash sets for Column, Diagonal (r+c), and Anti-Diagonal (r-c).'
            )}
          </span>
        </div>
        <div className="flex items-center gap-3 shrink-0 text-[11px] font-mono text-slate-400">
          <span className="flex items-center gap-1 text-amber-400">
            <Crown className="w-3.5 h-3.5" /> Queens: {queens.length}/{n}
          </span>
          <span className="flex items-center gap-1 text-emerald-400 font-bold">
            <Sparkles className="w-3.5 h-3.5" /> Solutions: {step.solutionsCount}
          </span>
        </div>
      </div>
    </div>
  );
};
