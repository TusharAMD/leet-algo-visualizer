import React from 'react';
import { TwoSumHashStep } from '../../algorithms/twoSumHashIntuitive';
import { Binary, CheckCircle2, XCircle, Search, Sparkles } from 'lucide-react';

interface TwoSumHashViewerProps {
  step: TwoSumHashStep;
  nums: number[];
  target: number;
}

export const TwoSumHashViewer: React.FC<TwoSumHashViewerProps> = ({ step, nums, target }) => {
  const { currIndex, currNum, diff, prevMap, matchedIndices, isComplete } = step;

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
            matchedIndices ? (
              <span className="px-2 py-0.5 rounded-md bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 text-[11px] font-semibold flex items-center gap-1">
                <CheckCircle2 className="w-3.5 h-3.5" /> Indices [{matchedIndices[0]}, {matchedIndices[1]}]
              </span>
            ) : (
              <span className="px-2 py-0.5 rounded-md bg-rose-500/10 border border-rose-500/20 text-rose-400 text-[11px] font-semibold flex items-center gap-1">
                <XCircle className="w-3.5 h-3.5" /> No Pair Found
              </span>
            )
          ) : (
            <span className="px-2 py-0.5 rounded-md bg-indigo-500/10 border border-indigo-500/20 text-indigo-400 text-[11px] font-mono">
              Step {step.stepIndex + 1} / {step.totalSteps}
            </span>
          )}
        </div>
      </div>

      {/* Main Workbench */}
      <div className="flex-1 min-h-0 flex flex-col justify-center gap-3 py-2 px-3">
        {/* Array Elements Track */}
        <div className="flex flex-col gap-1">
          <span className="text-[10px] uppercase font-mono font-bold tracking-wider text-slate-400">
            Nums Array:
          </span>
          <div className="flex items-center gap-2 overflow-x-auto pb-1">
            {nums.map((num, idx) => {
              const isScanning = currIndex === idx;
              const isMatch = matchedIndices && (matchedIndices[0] === idx || matchedIndices[1] === idx);

              return (
                <div key={idx} className="flex flex-col items-center">
                  <div
                    className={`w-12 h-12 md:w-14 md:h-14 rounded-2xl border-2 flex flex-col items-center justify-center transition-all duration-300 relative ${
                      isMatch
                        ? 'border-emerald-400 bg-emerald-500/20 scale-110 shadow-lg shadow-emerald-500/30 ring-2 ring-emerald-400 font-bold'
                        : isScanning
                        ? 'border-indigo-400 bg-indigo-950/90 scale-105 ring-2 ring-indigo-400 shadow-md shadow-indigo-500/20'
                        : idx < currIndex
                        ? 'border-slate-700 bg-slate-900/70 text-slate-300'
                        : 'border-slate-800 bg-slate-950/80 text-slate-500'
                    }`}
                  >
                    <span className="text-[9px] font-mono text-slate-400">[{idx}]</span>
                    <span className="text-base font-bold font-mono text-white">{num}</span>

                    {isMatch && (
                      <span className="absolute -top-2.5 px-1 py-0.2 rounded bg-emerald-500 text-[8px] font-bold text-slate-950 uppercase tracking-wider">
                        MATCH
                      </span>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Complement Math Formula Strip */}
        {currNum !== null && diff !== null && (
          <div className="bg-slate-950/60 border border-indigo-500/30 rounded-xl p-2.5 flex items-center justify-between gap-2 text-xs font-mono">
            <div className="flex items-center gap-2">
              <span className="text-slate-400">Complement Equation:</span>
              <span className="text-white font-bold">{target}</span>
              <span className="text-slate-500">-</span>
              <span className="text-indigo-400 font-bold">{currNum}</span>
              <span className="text-slate-500">=</span>
              <span className="text-amber-300 font-bold px-1.5 py-0.5 rounded bg-amber-500/10 border border-amber-500/30">
                {diff} (Searching Map)
              </span>
            </div>
            {matchedIndices && (
              <span className="text-emerald-400 font-bold flex items-center gap-1">
                <Sparkles className="w-3.5 h-3.5" /> Found at index {matchedIndices[0]}!
              </span>
            )}
          </div>
        )}

        {/* Hash Map Memory */}
        <div className="bg-slate-950/80 border border-slate-800/80 rounded-xl p-3 flex flex-col gap-2">
          <div className="flex items-center justify-between text-xs">
            <span className="text-indigo-400 font-bold font-mono flex items-center gap-1.5">
              <Binary className="w-3.5 h-3.5" /> Hash Map Memory (val ➔ index):
            </span>
            <span className="text-[11px] font-mono text-slate-500">
              {prevMap.length} entries cached
            </span>
          </div>

          <div className="flex items-center gap-2 flex-wrap min-h-10">
            {prevMap.length === 0 ? (
              <span className="text-slate-600 italic text-xs">Hash map is empty...</span>
            ) : (
              prevMap.map(({ key, index }) => {
                const isComplementKey = matchedIndices && key === diff;
                return (
                  <div
                    key={key}
                    className={`px-2.5 py-1 rounded-xl border text-xs font-mono transition-all duration-300 ${
                      isComplementKey
                        ? 'border-emerald-400 bg-emerald-500/20 text-emerald-200 ring-2 ring-emerald-400 font-bold shadow-md shadow-emerald-500/30 animate-pulse'
                        : 'border-slate-800 bg-slate-900/80 text-slate-300'
                    }`}
                  >
                    <span className="text-slate-400">val:</span>{' '}
                    <strong className="text-white">{key}</strong>{' '}
                    <span className="text-slate-500">➔</span>{' '}
                    <span className="text-indigo-400">idx: {index}</span>
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
          <span className="text-indigo-400 font-bold font-mono">One-Pass Hash:</span>
          <span className="text-slate-300">
            Instead of checking all pairs in $O(n^2)$, look back for `target - num`. Each element is added only after checking, automatically preventing using the same index twice.
          </span>
        </div>
        <div className="flex items-center gap-3 shrink-0 text-[11px] font-mono text-slate-400">
          <span className="text-emerald-400 font-bold">Time: O(n)</span>
          <span className="text-indigo-400 font-bold">Space: O(n)</span>
        </div>
      </div>
    </div>
  );
};
