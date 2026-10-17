import React from 'react';
import { ParenthesesStep } from '../../algorithms/validParenthesesIntuitive';
import { Layers, ArrowDown, CheckCircle2, XCircle, ShieldCheck } from 'lucide-react';

interface ParenthesesViewerProps {
  step: ParenthesesStep;
  s: string;
}

export const ParenthesesViewer: React.FC<ParenthesesViewerProps> = ({ step, s }) => {
  const {
    currentIndex,
    currentChar,
    stack,
    action,
    matchedPair,
    isValidSoFar,
    headline,
    subtext,
    isComplete,
    finalResult,
  } = step;

  return (
    <div className="flex flex-col justify-between gap-3 p-4 bg-slate-900/40 border border-slate-800 rounded-2xl h-full overflow-hidden">
      {/* 1. Header Banner */}
      <div className="bg-gradient-to-r from-slate-900 via-indigo-950/40 to-slate-900 border border-indigo-500/20 rounded-xl p-3 shadow shrink-0">
        <div className="flex items-center justify-between gap-2 flex-wrap">
          <div className="flex items-center gap-2.5">
            <div
              className={`w-9 h-9 rounded-xl border flex items-center justify-center font-bold font-mono text-base shrink-0 ${
                isComplete
                  ? finalResult
                    ? 'bg-emerald-500/20 border-emerald-500/40 text-emerald-300'
                    : 'bg-rose-500/20 border-rose-500/40 text-rose-300'
                  : 'bg-indigo-500/20 border-indigo-500/40 text-indigo-300'
              }`}
            >
              {isComplete ? (
                finalResult ? (
                  <CheckCircle2 className="w-5 h-5 text-emerald-400" />
                ) : (
                  <XCircle className="w-5 h-5 text-rose-400" />
                )
              ) : (
                currentChar
              )}
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="text-[9px] uppercase font-bold tracking-wider px-1.5 py-0.2 rounded bg-indigo-500/10 text-indigo-400 border border-indigo-500/20">
                  {isComplete ? 'Result' : `Scanning Bracket ${currentIndex}`}
                </span>
                <span className="text-xs font-mono font-bold text-white">
                  Stack Depth: {stack.length}
                </span>
              </div>
              <h2 className="text-xs font-bold text-white leading-tight mt-0.5">{headline}</h2>
            </div>
          </div>

          {/* Validation Status Badge */}
          <div className="flex items-center gap-2 shrink-0">
            {isComplete ? (
              <div
                className={`flex items-center gap-1.5 px-3 py-1 rounded-xl text-xs font-bold border shadow-md ${
                  finalResult
                    ? 'bg-emerald-500/20 border-emerald-500/50 text-emerald-300 shadow-emerald-500/10'
                    : 'bg-rose-500/20 border-rose-500/50 text-rose-300 shadow-rose-500/10'
                }`}
              >
                {finalResult ? (
                  <>
                    <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                    <span>VALID (True)</span>
                  </>
                ) : (
                  <>
                    <XCircle className="w-4 h-4 text-rose-400" />
                    <span>INVALID (False)</span>
                  </>
                )}
              </div>
            ) : !isValidSoFar ? (
              <div className="flex items-center gap-1.5 px-3 py-1 rounded-xl bg-rose-500/20 border border-rose-500/40 text-rose-300 font-bold text-xs">
                <XCircle className="w-4 h-4 text-rose-400" />
                <span>Violated</span>
              </div>
            ) : (
              <div className="flex items-center gap-1.5 px-3 py-1 rounded-xl bg-indigo-500/20 border border-indigo-500/40 text-indigo-300 font-bold text-xs">
                <Layers className="w-3.5 h-3.5 text-indigo-400" />
                <span>Valid So Far</span>
              </div>
            )}
          </div>
        </div>
        <p className="text-[11px] text-slate-300 mt-1.5 leading-normal font-sans line-clamp-2">{subtext}</p>
      </div>

      {/* 2. Central Layout: Stream Track (Left) + The LIFO Chamber (Right) */}
      <div className="flex-1 min-h-0 grid grid-cols-1 md:grid-cols-12 gap-3 items-center">
        {/* Stream of Brackets */}
        <div className="md:col-span-7 flex flex-col gap-2">
          <span className="text-[11px] font-semibold text-slate-400 flex items-center gap-1">
            Incoming Character Stream:
          </span>

          <div className="overflow-x-auto pt-8 pb-3">
            <div className="flex items-center gap-2 min-w-max px-4">
              {s.split('').map((ch, idx) => {
                const isCurrent = idx === currentIndex && !isComplete;
                const isPast = idx < currentIndex;
                const wasMatched = matchedPair && (matchedPair.openIdx === idx || matchedPair.closeIdx === idx);

                return (
                  <div key={idx} className="relative flex flex-col items-center">
                    {/* Floating Pointer */}
                    {isCurrent && (
                      <div className="absolute -top-7 flex flex-col items-center animate-bounce text-indigo-400 z-20 whitespace-nowrap pointer-events-none">
                        <span className="text-[9px] font-extrabold uppercase tracking-wider bg-indigo-950/90 text-indigo-300 px-2 py-0.5 rounded-full border border-indigo-500/60 shadow-lg backdrop-blur">
                          Current
                        </span>
                        <ArrowDown className="w-3 h-3 text-indigo-400" />
                      </div>
                    )}

                    {/* Bracket Box */}
                    <div
                      className={`w-10 h-12 rounded-xl border-2 flex items-center justify-center font-mono text-base font-extrabold transition-all ${
                        wasMatched
                          ? 'border-emerald-400 bg-emerald-500/30 text-emerald-200 scale-105 shadow-md shadow-emerald-500/20'
                          : isCurrent
                          ? 'border-indigo-400 bg-indigo-500/20 text-white scale-105 shadow-md shadow-indigo-500/30 z-10'
                          : isPast
                          ? 'border-slate-800 bg-slate-900/60 text-slate-500'
                          : 'border-slate-800 bg-slate-950/40 text-slate-400'
                      }`}
                    >
                      {ch}
                    </div>
                    <span className="text-[9px] font-mono text-slate-500 mt-1">{idx}</span>
                  </div>
                );
              })}
            </div>
          </div>
        </div>

        {/* The Vertical LIFO Stack Chamber */}
        <div className="md:col-span-5 flex flex-col items-center justify-center">
          <div className="text-[11px] font-semibold text-slate-300 mb-1 flex items-center gap-1.5">
            <Layers className="w-3.5 h-3.5 text-indigo-400" />
            LIFO Stack Chamber (Last-In, First-Out)
          </div>

          {/* Chamber Box */}
          <div className="w-36 h-36 bg-slate-950/80 border-b-2 border-x-2 border-t-0 border-indigo-500/50 rounded-b-2xl p-2 flex flex-col-reverse gap-1.5 overflow-hidden shadow-inner relative">
            <div className="absolute top-1 left-2 text-[9px] uppercase font-bold tracking-wider text-slate-500 font-mono">
              OPEN TOP
            </div>

            {stack.length === 0 ? (
              <div className="flex-1 flex items-center justify-center text-[10px] text-slate-600 italic">
                Chamber is Empty
              </div>
            ) : (
              stack.map((item, idx) => {
                const isTop = idx === stack.length - 1;
                return (
                  <div
                    key={`${item.char}-${item.index}`}
                    className={`w-full py-1 rounded-lg border flex items-center justify-between px-3 text-xs font-mono font-bold transition-all ${
                      isTop
                        ? 'border-indigo-400 bg-indigo-500/20 text-white shadow-sm'
                        : 'border-slate-800 bg-slate-900/80 text-slate-300'
                    }`}
                  >
                    <span className="text-sm">{item.char}</span>
                    <span className="text-[9px] text-slate-500 font-sans">
                      {isTop ? 'TOP' : `idx ${item.index}`}
                    </span>
                  </div>
                );
              })
            )}
          </div>
        </div>
      </div>

      {/* 3. The Mapping & LIFO Rule Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-3 pt-1 border-t border-slate-800/80 shrink-0">
        <div className="p-2.5 rounded-xl bg-slate-950/70 border border-slate-800 flex flex-col justify-between gap-1">
          <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">
            Expected Matches
          </span>
          <div className="flex items-center justify-around font-mono text-xs text-slate-200">
            <span className="bg-slate-900 px-2.5 py-1 rounded border border-slate-800">
              <code className="text-cyan-300">(</code> ➔ <code className="text-cyan-300">)</code>
            </span>
            <span className="bg-slate-900 px-2.5 py-1 rounded border border-slate-800">
              <code className="text-purple-300">{'{'}</code> ➔ <code className="text-purple-300">{'}'}</code>
            </span>
            <span className="bg-slate-900 px-2.5 py-1 rounded border border-slate-800">
              <code className="text-amber-300">[</code> ➔ <code className="text-amber-300">]</code>
            </span>
          </div>
        </div>

        <div className="p-2.5 rounded-xl bg-slate-950/70 border border-slate-800 flex flex-col justify-between gap-1">
          <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider flex items-center gap-1.5">
            <ShieldCheck className="w-3.5 h-3.5 text-indigo-400" />
            The LIFO Invariant
          </span>
          <p className="text-[11px] text-slate-300 leading-snug">
            The most recently opened bracket must be the first one closed. A stack guarantees perfect nesting verification in a single O(n) pass.
          </p>
        </div>
      </div>
    </div>
  );
};
