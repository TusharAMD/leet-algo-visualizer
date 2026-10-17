import React from 'react';
import { WordLadderStep } from '../../algorithms/wordLadderIntuitive';
import { Footprints, CheckCircle2, AlertTriangle, ArrowRight, Layers, Sparkles } from 'lucide-react';

interface WordLadderViewerProps {
  step: WordLadderStep;
}

export const WordLadderViewer: React.FC<WordLadderViewerProps> = ({ step }) => {
  const {
    beginWord,
    endWord,
    wordList,
    queue,
    activeWord,
    activePattern,
    visited,
    pathSequence,
    headline,
    subtext,
    isComplete,
    result,
    stepIndex,
    totalSteps
  } = step;

  const allWords = Array.from(new Set([beginWord, ...wordList]));

  return (
    <div className="flex-1 min-h-0 flex flex-col bg-slate-900/60 border border-slate-800 rounded-2xl p-3 shadow-xl overflow-hidden justify-between">
      {/* Top Banner */}
      <div className="bg-slate-950/70 border border-slate-800/80 rounded-xl p-2.5 flex items-center justify-between shrink-0">
        <div className="flex items-center gap-2">
          <span className="p-1.5 rounded-lg bg-indigo-500/10 text-indigo-400 border border-indigo-500/20">
            <Footprints className="w-4 h-4" />
          </span>
          <div>
            <h3 className="text-xs font-semibold text-white tracking-wide">{headline}</h3>
            <p className="text-[11px] text-slate-400">{subtext}</p>
          </div>
        </div>
        <div className="flex items-center gap-2">
          {isComplete ? (
            result > 0 ? (
              <span className="px-2.5 py-0.5 rounded-md bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 text-xs font-mono font-bold flex items-center gap-1">
                <CheckCircle2 className="w-3.5 h-3.5" /> Ladder Length: {result}
              </span>
            ) : (
              <span className="px-2.5 py-0.5 rounded-md bg-rose-500/10 border border-rose-500/20 text-rose-400 text-xs font-mono font-bold flex items-center gap-1">
                <AlertTriangle className="w-3.5 h-3.5" /> No Ladder (0)
              </span>
            )
          ) : (
            <span className="px-2 py-0.5 rounded-md bg-indigo-500/10 border border-indigo-500/20 text-indigo-400 text-[11px] font-mono">
              Step {stepIndex + 1} / {totalSteps}
            </span>
          )}
        </div>
      </div>

      {/* Main Arena */}
      <div className="flex-1 min-h-0 grid grid-cols-1 md:grid-cols-12 gap-3 py-1 px-1">
        {/* Left: Ladder Sequence & Active Pattern */}
        <div className="md:col-span-8 flex flex-col gap-2 min-h-0 justify-between p-2 rounded-xl bg-slate-950/40 border border-slate-800/60">
          {/* Active Pattern Card */}
          <div className="flex items-center justify-between bg-slate-900/80 border border-slate-800 rounded-xl p-2 shrink-0">
            <div className="flex items-center gap-2">
              <span className="text-[10px] uppercase font-bold text-slate-400">Target Bridge:</span>
              <span className="px-2 py-0.5 rounded bg-indigo-500/20 text-indigo-300 font-mono text-xs font-bold border border-indigo-500/40">
                "{beginWord}" &rarr; "{endWord}"
              </span>
            </div>
            {activePattern && (
              <div className="flex items-center gap-1.5">
                <span className="text-[10px] text-slate-400">Pattern:</span>
                <span className="px-2 py-0.5 rounded bg-amber-500/20 text-amber-300 font-mono text-xs font-bold border border-amber-500/40">
                  {activePattern}
                </span>
              </div>
            )}
          </div>

          {/* Path Sequence Ribbon */}
          <div className="flex-1 min-h-0 flex flex-col items-center justify-center p-3 bg-slate-900/40 rounded-xl border border-slate-800/50">
            <span className="text-[10px] uppercase font-bold text-slate-500 tracking-wider mb-3">
              Transformation Chain ({pathSequence.length} words)
            </span>

            <div className="flex flex-wrap items-center justify-center gap-2 max-w-full overflow-x-auto p-2">
              {pathSequence.map((w, idx) => {
                const isStart = w === beginWord;
                const isEnd = w === endWord;
                const isCur = w === activeWord;

                let cardBg = 'bg-slate-800 text-slate-300 border-slate-700';
                if (isEnd) {
                  cardBg = 'bg-emerald-500/20 text-emerald-300 border-emerald-500/50 shadow-[0_0_12px_rgba(16,185,129,0.3)] scale-105';
                } else if (isStart) {
                  cardBg = 'bg-sky-500/20 text-sky-300 border-sky-500/50';
                } else if (isCur) {
                  cardBg = 'bg-indigo-500/30 text-indigo-200 border-indigo-400 ring-2 ring-indigo-400/50';
                }

                return (
                  <React.Fragment key={idx}>
                    <div className={`px-3 py-1.5 rounded-xl border flex flex-col items-center justify-center font-mono font-bold text-sm transition-all ${cardBg}`}>
                      <span>{w}</span>
                      <span className="text-[8px] opacity-60 font-sans mt-0.5">
                        Step {idx + 1}
                      </span>
                    </div>
                    {idx < pathSequence.length - 1 && (
                      <ArrowRight className="w-3.5 h-3.5 text-slate-600 shrink-0" />
                    )}
                  </React.Fragment>
                );
              })}
            </div>
          </div>

          {/* Word Dictionary Catalog */}
          <div className="bg-slate-900/60 border border-slate-800 rounded-xl p-2 shrink-0">
            <div className="flex items-center justify-between text-[10px] text-slate-400 font-bold uppercase mb-1.5">
              <span>Vocabulary Bank ({allWords.length} Words)</span>
              <span>Visited: {visited.length} / {allWords.length}</span>
            </div>
            <div className="flex flex-wrap gap-1.5">
              {allWords.map((w) => {
                const isVisited = visited.includes(w);
                const isActive = activeWord === w;
                const isTarget = endWord === w;

                let pillStyle = 'bg-slate-950 text-slate-500 border-slate-800';
                if (isActive) {
                  pillStyle = 'bg-indigo-500/30 text-indigo-200 border-indigo-400 ring-1 ring-indigo-400';
                } else if (isVisited) {
                  pillStyle = 'bg-emerald-500/10 text-emerald-300 border-emerald-500/30';
                } else if (isTarget) {
                  pillStyle = 'bg-amber-500/10 text-amber-300 border-amber-500/30';
                }

                return (
                  <span
                    key={w}
                    className={`px-2 py-0.5 rounded text-xs font-mono border transition-colors ${pillStyle}`}
                  >
                    {w}
                  </span>
                );
              })}
            </div>
          </div>
        </div>

        {/* Right: BFS Queue & Info */}
        <div className="md:col-span-4 flex flex-col gap-2 min-h-0">
          <div className="bg-slate-950/40 border border-slate-800/60 rounded-xl p-2.5 flex flex-col gap-2 flex-1 min-h-0 overflow-y-auto">
            <div className="flex items-center justify-between">
              <span className="text-[10px] uppercase font-bold text-slate-400 tracking-wider flex items-center gap-1">
                <Layers className="w-3 h-3 text-indigo-400" /> BFS Queue
              </span>
              <span className="text-[10px] font-mono text-indigo-300">
                {queue.length} in queue
              </span>
            </div>

            <div className="flex flex-wrap gap-1.5">
              {queue.length === 0 ? (
                <span className="text-[11px] text-slate-500 italic">Queue is empty</span>
              ) : (
                queue.map((item, qIdx) => (
                  <span
                    key={qIdx}
                    className={`px-2 py-0.5 rounded text-[11px] font-mono border flex items-center gap-1 ${
                      qIdx === 0
                        ? 'bg-indigo-500/20 text-indigo-300 border-indigo-500/40 ring-1 ring-indigo-400'
                        : 'bg-slate-800/80 text-slate-400 border-slate-700/60'
                    }`}
                  >
                    <span>{item.word}</span>
                    <span className="text-[9px] opacity-60">L{item.level}</span>
                  </span>
                ))
              )}
            </div>

            <div className="mt-auto p-2 rounded-lg bg-slate-900/60 border border-slate-800 text-[11px] text-slate-300 space-y-1">
              <div className="font-semibold text-emerald-300 flex items-center gap-1">
                <Sparkles className="w-3 h-3 text-emerald-400" /> Shortest Path Guarantee:
              </div>
              <div className="text-[10px] text-slate-400">
                BFS processes nodes level by level (edge weight = 1). The first time <code>endWord</code> is popped, it is provably via the minimum possible transformation steps.
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Legend */}
      <div className="flex items-center justify-between bg-slate-950/60 border border-slate-800/60 rounded-xl px-3 py-1.5 shrink-0 text-xs">
        <div className="flex items-center gap-3">
          <div className="flex items-center gap-1.5">
            <span className="w-3 h-3 rounded bg-sky-500/30 border border-sky-500/60" />
            <span className="text-sky-300 text-[11px]">Begin Word</span>
          </div>
          <div className="flex items-center gap-1.5">
            <span className="w-3 h-3 rounded bg-emerald-500/30 border border-emerald-500/60" />
            <span className="text-emerald-300 text-[11px]">Visited / End Word</span>
          </div>
          <div className="flex items-center gap-1.5">
            <span className="w-3 h-3 rounded bg-indigo-500/30 border border-indigo-500/60" />
            <span className="text-indigo-300 text-[11px]">Active Search</span>
          </div>
        </div>

        {isComplete && (
          <div className="flex items-center gap-1 text-[11px] font-semibold">
            {result > 0 ? (
              <span className="text-emerald-400 flex items-center gap-1">
                <CheckCircle2 className="w-3.5 h-3.5" /> Shortest Path: {result} Words
              </span>
            ) : (
              <span className="text-rose-400 flex items-center gap-1">
                <AlertTriangle className="w-3.5 h-3.5" /> Destination Unreachable
              </span>
            )}
          </div>
        )}
      </div>
    </div>
  );
};
