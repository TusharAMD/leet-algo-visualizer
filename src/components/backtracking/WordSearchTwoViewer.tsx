import React from 'react';
import { WordSearchTwoStep } from '../../algorithms/wordSearchTwoIntuitive';
import { Grid, CheckCircle2, ArrowRight, Compass, Sparkles, Check, ListChecks } from 'lucide-react';

interface WordSearchTwoViewerProps {
  step: WordSearchTwoStep;
}

export const WordSearchTwoViewer: React.FC<WordSearchTwoViewerProps> = ({ step }) => {
  const {
    board,
    words,
    currentCell,
    visitedCells,
    currentPath,
    foundWords,
    activeWordMatched,
    headline,
    subtext,
    isComplete,
    stepIndex,
    totalSteps
  } = step;

  const isCellVisited = (r: number, c: number) => {
    return visitedCells.some(([vr, vc]) => vr === r && vc === c);
  };

  const isCellCurrent = (r: number, c: number) => {
    return currentCell !== null && currentCell[0] === r && currentCell[1] === c;
  };

  return (
    <div className="flex-1 min-h-0 flex flex-col bg-slate-900/60 border border-slate-800 rounded-2xl p-3 shadow-xl overflow-hidden justify-between">
      {/* Top Banner */}
      <div className="bg-slate-950/70 border border-slate-800/80 rounded-xl p-2.5 flex items-center justify-between shrink-0">
        <div className="flex items-center gap-2">
          <span className="p-1.5 rounded-lg bg-indigo-500/10 text-indigo-400 border border-indigo-500/20">
            <Grid className="w-4 h-4" />
          </span>
          <div>
            <h3 className="text-xs font-semibold text-white tracking-wide">{headline}</h3>
            <p className="text-[11px] text-slate-400">{subtext}</p>
          </div>
        </div>
        <div className="flex items-center gap-2">
          {foundWords.length > 0 && (
            <span className="px-2 py-0.5 rounded-md bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 text-[11px] font-semibold flex items-center gap-1">
              <CheckCircle2 className="w-3.5 h-3.5" /> Found {foundWords.length}/{words.length}
            </span>
          )}
          <span className="px-2 py-0.5 rounded-md bg-indigo-500/10 border border-indigo-500/20 text-indigo-400 text-[11px] font-mono">
            Step {stepIndex + 1} / {totalSteps}
          </span>
        </div>
      </div>

      {/* Main Arena: Grid on Left, Words Checklist on Right */}
      <div className="flex-1 min-h-0 grid grid-cols-1 md:grid-cols-12 gap-3 py-1 px-1">
        {/* 2D Grid Board */}
        <div className="md:col-span-7 bg-slate-950/60 border border-slate-800 rounded-xl p-2.5 flex flex-col justify-between overflow-hidden">
          <div className="flex items-center justify-between border-b border-slate-800/70 pb-1.5 shrink-0">
            <span className="text-xs font-semibold text-slate-300 flex items-center gap-1.5">
              <Compass className="w-3.5 h-3.5 text-indigo-400" />
              Board Grid & Active DFS Path
            </span>
            <span className="text-[10px] font-mono text-slate-400">
              Prefix: <span className="text-amber-300 font-bold font-mono">"{currentPath || '—'}"</span>
            </span>
          </div>

          {/* Grid Cells */}
          <div className="flex-1 flex items-center justify-center py-2">
            <div
              className="grid gap-1.5 p-2 bg-slate-900/80 rounded-2xl border border-slate-800"
              style={{
                gridTemplateColumns: `repeat(${board[0]?.length || 4}, minmax(0, 1fr))`
              }}
            >
              {board.map((row, r) =>
                row.map((ch, c) => {
                  const isCurrent = isCellCurrent(r, c);
                  const isVisited = isCellVisited(r, c);

                  return (
                    <div
                      key={`${r}-${c}`}
                      className={`w-11 h-11 rounded-xl flex flex-col items-center justify-center font-mono font-bold text-base transition-all border ${
                        isCurrent
                          ? 'bg-amber-500/30 border-amber-400 text-amber-200 ring-2 ring-amber-400 scale-105 shadow-lg shadow-amber-500/20'
                          : isVisited
                          ? 'bg-indigo-500/20 border-indigo-500/50 text-indigo-200'
                          : 'bg-slate-850 border-slate-700/80 text-slate-200'
                      }`}
                    >
                      <span>{ch}</span>
                    </div>
                  );
                })
              )}
            </div>
          </div>

          <div className="text-[10px] text-slate-500 bg-slate-900/80 rounded-lg p-1.5 border border-slate-800/60 text-center shrink-0">
            Trie pruning: If `path` is not in Trie, the entire branch terminates immediately.
          </div>
        </div>

        {/* Target Words Checklist */}
        <div className="md:col-span-5 bg-slate-950/60 border border-slate-800 rounded-xl p-2.5 flex flex-col justify-between overflow-hidden">
          <div className="flex items-center justify-between border-b border-slate-800/70 pb-1.5 shrink-0">
            <span className="text-xs font-semibold text-slate-300 flex items-center gap-1.5">
              <ListChecks className="w-3.5 h-3.5 text-emerald-400" />
              Target Words in Trie
            </span>
            <span className="text-[10px] font-mono text-slate-400">
              {words.length} targets
            </span>
          </div>

          <div className="flex-1 overflow-y-auto py-2 flex flex-col gap-1.5">
            {words.map((w, idx) => {
              const isFound = foundWords.includes(w);
              const isJustMatched = activeWordMatched === w;

              return (
                <div
                  key={idx}
                  className={`flex items-center justify-between px-3 py-1.5 rounded-xl border text-xs font-mono font-bold transition-all ${
                    isJustMatched
                      ? 'bg-emerald-500/20 border-emerald-400 text-emerald-200 ring-2 ring-emerald-400 scale-105'
                      : isFound
                      ? 'bg-emerald-500/10 border-emerald-500/30 text-emerald-300'
                      : 'bg-slate-900 border-slate-800 text-slate-400'
                  }`}
                >
                  <span>"{w}"</span>
                  {isFound ? (
                    <span className="flex items-center gap-1 text-[10px] text-emerald-400">
                      <Check className="w-3.5 h-3.5" /> Found
                    </span>
                  ) : (
                    <span className="text-[10px] text-slate-600 font-normal">Pending</span>
                  )}
                </div>
              );
            })}
          </div>

          <div className="text-[10px] text-slate-500 bg-slate-900/80 rounded-lg p-1.5 border border-slate-800/60 text-center shrink-0">
            Once found, `node.word` is cleared to prevent duplicate additions.
          </div>
        </div>
      </div>
    </div>
  );
};
