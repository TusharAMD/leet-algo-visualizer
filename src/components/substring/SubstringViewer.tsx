import React from 'react';
import { SubstringStep } from '../../algorithms/longestSubstringIntuitive';
import { ArrowDown, Hash, Trophy, Database, ShieldCheck, AlertTriangle } from 'lucide-react';

interface SubstringViewerProps {
  step: SubstringStep;
  s: string;
}

export const SubstringViewer: React.FC<SubstringViewerProps> = ({ step, s }) => {
  const {
    leftIndex,
    rightIndex,
    currentChar,
    duplicateChar,
    duplicatePrevIndex,
    currentWindowStr,
    currentWindowLen,
    maxLen,
    bestWindowStart,
    bestWindowEnd,
    seenMap,
    action,
    headline,
    subtext,
    isComplete,
  } = step;

  return (
    <div className="flex flex-col justify-between gap-3 p-4 bg-slate-900/40 border border-slate-800 rounded-2xl h-full overflow-hidden">
      {/* 1. Header Banner */}
      <div className="bg-gradient-to-r from-slate-900 via-indigo-950/40 to-slate-900 border border-indigo-500/20 rounded-xl p-3 shadow shrink-0">
        <div className="flex items-center justify-between gap-2 flex-wrap">
          <div className="flex items-center gap-2.5">
            <div className="w-9 h-9 rounded-xl bg-purple-500/20 border border-purple-500/40 flex items-center justify-center text-purple-300 font-bold font-mono text-sm shrink-0">
              <Hash className="w-5 h-5 text-purple-400" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="text-[9px] uppercase font-bold tracking-wider px-1.5 py-0.2 rounded bg-indigo-500/10 text-indigo-400 border border-indigo-500/20">
                  {isComplete ? 'Analysis Finished' : `Scanning Index ${rightIndex}`}
                </span>
                <span className="text-xs font-mono font-bold text-white">
                  Current: "{currentWindowStr}" (Len: {currentWindowLen})
                </span>
              </div>
              <h2 className="text-xs font-bold text-white leading-tight mt-0.5">{headline}</h2>
            </div>
          </div>

          {/* Record Length Badge */}
          <div className="flex items-center gap-2 shrink-0">
            <div className="flex items-center gap-1.5 px-3 py-1 rounded-xl bg-emerald-500/20 border border-emerald-500/50 text-emerald-300 font-bold text-xs shadow-lg shadow-emerald-500/10">
              <Trophy className="w-4 h-4 text-emerald-400" />
              <span>Max Length: {maxLen}</span>
            </div>
          </div>
        </div>
        <p className="text-[11px] text-slate-300 mt-1.5 leading-normal font-sans line-clamp-2">{subtext}</p>
      </div>

      {/* 2. String Tiles Track with Sliding Window Highlight */}
      <div className="flex-1 min-h-0 flex flex-col justify-center gap-3">
        <div className="flex items-center justify-between text-xs text-slate-400 px-1">
          <span className="flex items-center gap-1 font-semibold text-slate-300 text-[11px]">
            <Hash className="w-3.5 h-3.5 text-indigo-400" />
            Character String & Dynamic Window [L .. R]
          </span>
          <span className="text-[10px] text-slate-500 font-mono">
            Window Substring: "{currentWindowStr}"
          </span>
        </div>

        {/* Tiles Row */}
        <div className="overflow-x-auto pt-10 pb-4">
          <div className="flex items-center gap-2.5 min-w-max px-8 justify-center">
            {s.split('').map((ch, idx) => {
              const isLeft = idx === leftIndex && !isComplete;
              const isRight = idx === rightIndex && !isComplete;
              const isInWindow = idx >= leftIndex && idx <= rightIndex;
              const isDuplicate = duplicateChar === ch && (idx === rightIndex || idx === duplicatePrevIndex);
              const isBestWindow = isComplete && idx >= bestWindowStart && idx <= bestWindowEnd;

              return (
                <div key={idx} className="relative flex flex-col items-center">
                  {/* Floating Pointer L */}
                  {isLeft && (
                    <div className="absolute -top-8 flex flex-col items-center animate-bounce text-cyan-400 z-20 whitespace-nowrap pointer-events-none">
                      <span className="text-[9px] font-extrabold uppercase tracking-wider bg-cyan-950/90 text-cyan-300 px-2 py-0.5 rounded-full border border-cyan-500/60 shadow-lg backdrop-blur">
                        Left
                      </span>
                      <ArrowDown className="w-3 h-3 text-cyan-400" />
                    </div>
                  )}

                  {/* Floating Pointer R */}
                  {isRight && (
                    <div className="absolute -top-8 flex flex-col items-center animate-bounce text-purple-400 z-20 whitespace-nowrap pointer-events-none">
                      <span className="text-[9px] font-extrabold uppercase tracking-wider bg-purple-950/90 text-purple-300 px-2 py-0.5 rounded-full border border-purple-500/60 shadow-lg backdrop-blur">
                        Right
                      </span>
                      <ArrowDown className="w-3 h-3 text-purple-400" />
                    </div>
                  )}

                  {/* Character Box */}
                  <div
                    className={`w-12 h-14 rounded-xl border-2 flex flex-col items-center justify-center transition-all ${
                      isBestWindow
                        ? 'border-emerald-400 bg-emerald-500/30 shadow-lg shadow-emerald-500/30 scale-105 z-10'
                        : isDuplicate
                        ? 'border-rose-400 bg-rose-500/30 shadow-lg shadow-rose-500/30 scale-105 z-10'
                        : isLeft
                        ? 'border-cyan-400 bg-cyan-500/20 shadow-md shadow-cyan-500/30 scale-105 z-10'
                        : isRight
                        ? 'border-purple-400 bg-purple-500/20 shadow-md shadow-purple-500/30 scale-105 z-10'
                        : isInWindow
                        ? 'border-indigo-400/80 bg-indigo-500/20 text-white'
                        : 'border-slate-800 bg-slate-900/40 text-slate-500 opacity-40'
                    }`}
                  >
                    <span
                      className={`text-base font-extrabold font-mono ${
                        isBestWindow
                          ? 'text-emerald-200'
                          : isDuplicate
                          ? 'text-rose-200'
                          : isLeft
                          ? 'text-cyan-200'
                          : isRight
                          ? 'text-purple-200'
                          : isInWindow
                          ? 'text-white'
                          : 'text-slate-500'
                      }`}
                    >
                      {ch}
                    </span>
                  </div>

                  {/* Index label underneath */}
                  <div className="mt-1 text-center">
                    <span
                      className={`text-[10px] font-mono font-bold ${
                        isLeft
                          ? 'text-cyan-400'
                          : isRight
                          ? 'text-purple-400'
                          : 'text-slate-500'
                      }`}
                    >
                      {idx}
                    </span>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>

      {/* 3. The Seen Hash Map & Window Math */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-3 pt-1 border-t border-slate-800/80 shrink-0">
        {/* Seen Hash Map Table */}
        <div className="p-2.5 rounded-xl bg-slate-950/70 border border-slate-800 flex flex-col justify-between gap-1">
          <div className="flex items-center justify-between">
            <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider flex items-center gap-1.5">
              <Database className="w-3.5 h-3.5 text-indigo-400" />
              Character Index Hash Map (`seen`)
            </span>
            <span className="text-[10px] font-mono text-indigo-300">
              {Object.keys(seenMap).length} unique
            </span>
          </div>

          <div className="flex items-center gap-1.5 overflow-x-auto p-1 max-h-14">
            {Object.keys(seenMap).length === 0 ? (
              <span className="text-[10px] text-slate-500 italic">No characters seen yet</span>
            ) : (
              Object.entries(seenMap).map(([char, idx]) => (
                <div
                  key={char}
                  className="flex items-center gap-1 px-2 py-0.5 rounded-md bg-slate-900 border border-slate-800 font-mono text-[10px] shrink-0"
                >
                  <span className="text-purple-300 font-bold">'{char}':</span>
                  <span className="text-white">{idx}</span>
                </div>
              ))
            )}
          </div>
        </div>

        {/* Guarantee Card */}
        <div className="p-2.5 rounded-xl bg-slate-950/70 border border-slate-800 flex flex-col justify-between gap-1">
          <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider flex items-center gap-1.5">
            <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" />
            The O(n) Elastic Window Guarantee
          </span>
          <p className="text-[11px] text-slate-300 leading-snug">
            {isComplete ? (
              <span className="text-emerald-300 font-semibold flex items-center gap-1">
                <Trophy className="w-3.5 h-3.5 text-emerald-400" /> Longest unique substring found: "{s.slice(bestWindowStart, bestWindowEnd + 1)}" ({maxLen} chars)!
              </span>
            ) : action === 'shrink_jump' ? (
              <>
                Duplicate <strong className="text-rose-300">'{duplicateChar}'</strong> found! By jumping <code className="text-cyan-300 font-mono">left = seen['{duplicateChar}'] + 1</code>, we discard all invalid substrings in $O(1)$ without slowly incrementing step-by-step.
              </>
            ) : (
              <>
                All characters between indices {leftIndex} and {rightIndex} are unique. Window length: <code className="text-indigo-300 font-mono">{rightIndex} - {leftIndex} + 1 = {currentWindowLen}</code>.
              </>
            )}
          </p>
        </div>
      </div>
    </div>
  );
};
