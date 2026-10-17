import React from 'react';
import { ValidAnagramStep } from '../../algorithms/validAnagramIntuitive';
import { Scale, CheckCircle2, XCircle, ArrowRightLeft, Sparkles } from 'lucide-react';

interface ValidAnagramViewerProps {
  step: ValidAnagramStep;
}

export const ValidAnagramViewer: React.FC<ValidAnagramViewerProps> = ({ step }) => {
  const { s, t, phase, currChar, currIndex, activeString, counts, isComplete, isAnagram } = step;

  const countKeys = Object.keys(counts).sort();

  return (
    <div className="flex-1 min-h-0 flex flex-col bg-slate-900/60 border border-slate-800 rounded-2xl p-3 shadow-xl overflow-hidden justify-between">
      {/* Top Banner */}
      <div className="bg-slate-950/70 border border-slate-800/80 rounded-xl p-2.5 flex items-center justify-between shrink-0">
        <div className="flex items-center gap-2">
          <span className="p-1.5 rounded-lg bg-indigo-500/10 text-indigo-400 border border-indigo-500/20">
            <ArrowRightLeft className="w-4 h-4" />
          </span>
          <div>
            <h3 className="text-xs font-semibold text-white tracking-wide">{step.headline}</h3>
            <p className="text-[11px] text-slate-400">{step.subtext}</p>
          </div>
        </div>
        <div className="flex items-center gap-2">
          {isComplete ? (
            isAnagram ? (
              <span className="px-2 py-0.5 rounded-md bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 text-[11px] font-semibold flex items-center gap-1">
                <CheckCircle2 className="w-3.5 h-3.5" /> Valid Anagram (True)
              </span>
            ) : (
              <span className="px-2 py-0.5 rounded-md bg-rose-500/10 border border-rose-500/20 text-rose-400 text-[11px] font-semibold flex items-center gap-1">
                <XCircle className="w-3.5 h-3.5" /> Not Anagram (False)
              </span>
            )
          ) : (
            <span className="px-2 py-0.5 rounded-md bg-indigo-500/10 border border-indigo-500/20 text-indigo-400 text-[11px] font-mono">
              Step {step.stepIndex + 1} / {step.totalSteps}
            </span>
          )}
        </div>
      </div>

      {/* Main Dual String & Balance Arena */}
      <div className="flex-1 min-h-0 flex flex-col justify-center gap-3 py-2 px-3">
        {/* Dual Strings */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
          {/* String s */}
          <div className="bg-slate-950/70 border border-slate-800/80 rounded-xl p-2.5 flex flex-col gap-1.5">
            <span className="text-[10px] uppercase font-mono font-bold tracking-wider text-indigo-400">
              String s (Adds Weight +1):
            </span>
            <div className="flex items-center gap-1.5 overflow-x-auto pb-1">
              {s.split('').map((ch, idx) => {
                const isActive = activeString === 's' && currIndex === idx;
                const isProcessed = activeString === 's' ? idx <= currIndex : true;

                return (
                  <div
                    key={idx}
                    className={`w-9 h-9 md:w-10 md:h-10 rounded-xl border flex flex-col items-center justify-center font-mono font-bold transition-all duration-300 ${
                      isActive
                        ? 'border-indigo-400 bg-indigo-500/30 text-white scale-110 ring-2 ring-indigo-400 shadow-lg shadow-indigo-500/20'
                        : isProcessed
                        ? 'border-indigo-500/40 bg-indigo-950/40 text-indigo-300'
                        : 'border-slate-800 bg-slate-900/60 text-slate-500'
                    }`}
                  >
                    <span className="text-xs">{ch}</span>
                  </div>
                );
              })}
            </div>
          </div>

          {/* String t */}
          <div className="bg-slate-950/70 border border-slate-800/80 rounded-xl p-2.5 flex flex-col gap-1.5">
            <span className="text-[10px] uppercase font-mono font-bold tracking-wider text-emerald-400">
              String t (Deducts Weight -1):
            </span>
            <div className="flex items-center gap-1.5 overflow-x-auto pb-1">
              {t.split('').map((ch, idx) => {
                const isActive = activeString === 't' && currIndex === idx;
                const isProcessed = activeString === 't' && idx < currIndex;
                const isBroken = isComplete && !isAnagram && currChar === ch && currIndex === idx;

                return (
                  <div
                    key={idx}
                    className={`w-9 h-9 md:w-10 md:h-10 rounded-xl border flex flex-col items-center justify-center font-mono font-bold transition-all duration-300 ${
                      isBroken
                        ? 'border-rose-500 bg-rose-500/30 text-rose-300 scale-110 ring-2 ring-rose-500 animate-pulse'
                        : isActive
                        ? 'border-emerald-400 bg-emerald-500/30 text-white scale-110 ring-2 ring-emerald-400 shadow-lg shadow-emerald-500/20'
                        : isProcessed
                        ? 'border-emerald-500/40 bg-emerald-950/40 text-emerald-300'
                        : 'border-slate-800 bg-slate-900/60 text-slate-500'
                    }`}
                  >
                    <span className="text-xs">{ch}</span>
                  </div>
                );
              })}
            </div>
          </div>
        </div>

        {/* Frequency Balance Scale Bins */}
        <div className="bg-slate-950/80 border border-slate-800/80 rounded-xl p-3 flex flex-col gap-2">
          <div className="flex items-center justify-between text-xs">
            <span className="text-indigo-400 font-bold font-mono flex items-center gap-1.5">
              <Scale className="w-3.5 h-3.5" /> Character Frequency Scale (Must Zero Out):
            </span>
            <span className="text-[11px] font-mono text-slate-500">
              {countKeys.length} unique letters tracked
            </span>
          </div>

          <div className="flex items-center gap-2 flex-wrap min-h-11">
            {countKeys.length === 0 ? (
              <span className="text-slate-600 italic text-xs">No frequencies counted yet...</span>
            ) : (
              countKeys.map((letter) => {
                const count = counts[letter];
                const isZero = count === 0;
                const isPositive = count > 0;
                const isNegative = count < 0;

                return (
                  <div
                    key={letter}
                    className={`px-3 py-1.5 rounded-xl border flex items-center gap-2 font-mono text-xs transition-all duration-300 ${
                      isZero
                        ? 'border-emerald-500/50 bg-emerald-950/40 text-emerald-300 shadow-sm'
                        : isPositive
                        ? 'border-indigo-500/50 bg-indigo-950/50 text-indigo-300'
                        : 'border-rose-500 bg-rose-950/60 text-rose-300 ring-2 ring-rose-400'
                    }`}
                  >
                    <span className="font-bold text-white text-sm">{letter}</span>
                    <span className="text-[10px] text-slate-400">:</span>
                    <span className={`font-bold ${isZero ? 'text-emerald-400' : 'text-white'}`}>
                      {count}
                    </span>
                    {isZero && <CheckCircle2 className="w-3 h-3 text-emerald-400" />}
                  </div>
                );
              })
            )}
          </div>
        </div>
      </div>

      {/* Mental Model Explainer Card */}
      <div className="bg-slate-950/80 border border-slate-800/80 rounded-xl p-2.5 flex items-center justify-between gap-3 text-xs shrink-0">
        <div className="flex items-center gap-2">
          <span className="text-indigo-400 font-bold font-mono">Zero Balance:</span>
          <span className="text-slate-300">
            Two strings are anagrams if and only if every character increment from $s$ is canceled out by an exact decrement from $t$.
          </span>
        </div>
        <div className="flex items-center gap-3 shrink-0 text-[11px] font-mono text-slate-400">
          <span className="text-emerald-400 font-bold">Time: O(n)</span>
          <span className="text-indigo-400 font-bold">Space: O(1)</span>
        </div>
      </div>
    </div>
  );
};
