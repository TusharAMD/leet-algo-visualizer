import React from 'react';
import { WordSearchStep } from '../../algorithms/wordSearchIntuitive';
import { Search, CheckCircle2, XCircle, ArrowRight, Compass, Sparkles } from 'lucide-react';

interface WordSearchViewerProps {
  step: WordSearchStep;
}

export const WordSearchViewer: React.FC<WordSearchViewerProps> = ({ step }) => {
  const {
    board,
    word,
    currentCell,
    path,
    matchedChars,
    isFound,
    headline,
    subtext,
    isComplete,
    stepIndex,
    totalSteps
  } = step;

  const isCellInPath = (r: number, c: number) => {
    return path.some(([pr, pc]) => pr === r && pc === c);
  };

  const isCellCurrent = (r: number, c: number) => {
    return currentCell !== null && currentCell[0] === r && currentCell[1] === c;
  };

  const getPathOrder = (r: number, c: number) => {
    const idx = path.findIndex(([pr, pc]) => pr === r && pc === c);
    return idx >= 0 ? idx + 1 : null;
  };

  return (
    <div className="flex-1 min-h-0 flex flex-col bg-slate-900/60 border border-slate-800 rounded-2xl p-3 shadow-xl overflow-hidden justify-between">
      {/* Top Banner */}
      <div className="bg-slate-950/70 border border-slate-800/80 rounded-xl p-2.5 flex items-center justify-between shrink-0">
        <div className="flex items-center gap-2">
          <span className="p-1.5 rounded-lg bg-indigo-500/10 text-indigo-400 border border-indigo-500/20">
            <Search className="w-4 h-4" />
          </span>
          <div>
            <h3 className="text-xs font-semibold text-white tracking-wide">{headline}</h3>
            <p className="text-[11px] text-slate-400">{subtext}</p>
          </div>
        </div>
        <div className="flex items-center gap-2">
          {isComplete && (
            <span
              className={`px-2 py-0.5 rounded-md text-[11px] font-semibold flex items-center gap-1 border ${
                isFound
                  ? 'bg-emerald-500/10 border-emerald-500/20 text-emerald-400'
                  : 'bg-rose-500/10 border-rose-500/20 text-rose-400'
              }`}
            >
              {isFound ? (
                <>
                  <CheckCircle2 className="w-3.5 h-3.5" /> Found: True
                </>
              ) : (
                <>
                  <XCircle className="w-3.5 h-3.5" /> Found: False
                </>
              )}
            </span>
          )}
          <span className="px-2 py-0.5 rounded-md bg-indigo-500/10 border border-indigo-500/20 text-indigo-400 text-[11px] font-mono">
            Step {stepIndex + 1} / {totalSteps}
          </span>
        </div>
      </div>

      {/* Target Word Sequence Progress */}
      <div className="bg-slate-950/50 border border-slate-800/70 rounded-xl p-2 shrink-0 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <span className="text-[10px] uppercase font-bold text-slate-400">Target Word:</span>
          <div className="flex items-center gap-1">
            {word.split('').map((ch, idx) => {
              const isMatched = idx < matchedChars.length;
              const isNext = idx === matchedChars.length;
              return (
                <div
                  key={idx}
                  className={`w-7 h-7 rounded-lg flex items-center justify-center font-mono font-bold text-xs border transition-all ${
                    isMatched
                      ? 'bg-emerald-500/20 border-emerald-400 text-emerald-300 ring-1 ring-emerald-400'
                      : isNext
                      ? 'bg-amber-500/20 border-amber-400 text-amber-300 animate-pulse'
                      : 'bg-slate-900 border-slate-800 text-slate-500'
                  }`}
                >
                  {ch}
                </div>
              );
            })}
          </div>
        </div>
        <span className="text-[10px] font-mono text-slate-400">
          Matched {matchedChars.length} / {word.length} letters
        </span>
      </div>

      {/* Main 2D Grid Board */}
      <div className="flex-1 min-h-0 bg-slate-950/60 border border-slate-800 rounded-xl p-3 flex flex-col justify-between overflow-hidden">
        <div className="flex items-center justify-between border-b border-slate-800/70 pb-1 shrink-0">
          <span className="text-xs font-semibold text-slate-300 flex items-center gap-1.5">
            <Compass className="w-3.5 h-3.5 text-indigo-400" />
            Character Matrix ({board.length}x{board[0]?.length || 0})
          </span>
          <span className="text-[10px] font-mono text-slate-400">
            Path Length: {path.length} cells
          </span>
        </div>

        {/* Center Grid */}
        <div className="flex-1 flex items-center justify-center py-2">
          <div
            className="grid gap-2 p-2 bg-slate-900/80 rounded-2xl border border-slate-800"
            style={{
              gridTemplateColumns: `repeat(${board[0]?.length || 4}, minmax(0, 1fr))`
            }}
          >
            {board.map((row, r) =>
              row.map((ch, c) => {
                const inPath = isCellInPath(r, c);
                const isCur = isCellCurrent(r, c);
                const stepNum = getPathOrder(r, c);

                return (
                  <div
                    key={`${r}-${c}`}
                    className={`relative w-12 h-12 rounded-xl flex flex-col items-center justify-center font-mono font-bold text-base transition-all border ${
                      isFound && inPath
                        ? 'bg-emerald-500/25 border-emerald-400 text-emerald-200 ring-2 ring-emerald-400 shadow-lg shadow-emerald-500/20'
                        : isCur
                        ? 'bg-amber-500/30 border-amber-400 text-amber-200 ring-2 ring-amber-400 scale-105 shadow-lg shadow-amber-500/20'
                        : inPath
                        ? 'bg-indigo-500/20 border-indigo-500/50 text-indigo-200 ring-1 ring-indigo-400'
                        : 'bg-slate-850 border-slate-700/80 text-slate-200'
                    }`}
                  >
                    <span>{ch}</span>
                    {stepNum !== null && (
                      <span className="absolute -top-1.5 -right-1 text-[8px] bg-indigo-500 text-white font-bold px-1 rounded-full">
                        {stepNum}
                      </span>
                    )}
                  </div>
                );
              })
            )}
          </div>
        </div>

        <div className="text-[10px] text-slate-500 bg-slate-900/80 rounded-lg p-1.5 border border-slate-800/60 text-center shrink-0">
          Backtracking rule: Same letter cell cannot be visited twice within the active path.
        </div>
      </div>
    </div>
  );
};
