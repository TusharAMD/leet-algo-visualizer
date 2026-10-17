import React from 'react';
import { BinarySearchStep } from '../../algorithms/binarySearchIntuitive';
import { Search, ArrowDown, Scissors, Trophy, XCircle, ShieldCheck } from 'lucide-react';

interface BinarySearchViewerProps {
  step: BinarySearchStep;
  nums: number[];
  target: number;
}

export const BinarySearchViewer: React.FC<BinarySearchViewerProps> = ({ step, nums, target }) => {
  const {
    left,
    right,
    mid,
    midVal,
    discardedIndices,
    comparison,
    headline,
    subtext,
    isComplete,
    resultIndex,
  } = step;

  const activeCount = nums.length - discardedIndices.length;

  return (
    <div className="flex flex-col justify-between gap-3 p-4 bg-slate-900/40 border border-slate-800 rounded-2xl h-full overflow-hidden">
      {/* 1. Header Banner */}
      <div className="bg-gradient-to-r from-slate-900 via-indigo-950/40 to-slate-900 border border-indigo-500/20 rounded-xl p-3 shadow shrink-0">
        <div className="flex items-center justify-between gap-2 flex-wrap">
          <div className="flex items-center gap-2.5">
            <div className="w-9 h-9 rounded-xl bg-cyan-500/20 border border-cyan-500/40 flex items-center justify-center text-cyan-300 font-bold font-mono text-sm shrink-0">
              <Search className="w-5 h-5 text-cyan-400" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="text-[9px] uppercase font-bold tracking-wider px-1.5 py-0.2 rounded bg-indigo-500/10 text-indigo-400 border border-indigo-500/20">
                  Target: {target}
                </span>
                <span className="text-xs font-mono font-bold text-slate-300">
                  Search Space: {activeCount} / {nums.length} elements
                </span>
              </div>
              <h2 className="text-xs font-bold text-white leading-tight mt-0.5">{headline}</h2>
            </div>
          </div>

          {/* Status Badge */}
          <div className="flex items-center gap-2 shrink-0">
            {isComplete ? (
              resultIndex !== -1 ? (
                <div className="flex items-center gap-1.5 px-3 py-1 rounded-xl bg-emerald-500/20 border border-emerald-500/50 text-emerald-300 font-bold text-xs shadow-lg shadow-emerald-500/10">
                  <Trophy className="w-4 h-4 text-emerald-400" />
                  <span>Found at Index {resultIndex}</span>
                </div>
              ) : (
                <div className="flex items-center gap-1.5 px-3 py-1 rounded-xl bg-rose-500/20 border border-rose-500/50 text-rose-300 font-bold text-xs shadow-lg shadow-rose-500/10">
                  <XCircle className="w-4 h-4 text-rose-400" />
                  <span>Not Found (-1)</span>
                </div>
              )
            ) : (
              <div className="flex items-center gap-1.5 px-2.5 py-1 rounded-xl bg-indigo-500/20 border border-indigo-500/40 text-indigo-300 text-xs font-mono">
                <span>mid = ({left} + {right}) // 2 = {mid}</span>
              </div>
            )}
          </div>
        </div>
        <p className="text-[11px] text-slate-300 mt-1.5 leading-normal font-sans line-clamp-2">{subtext}</p>
      </div>

      {/* 2. Sorted Array Track with L, M, R Pointers */}
      <div className="flex-1 min-h-0 flex flex-col justify-center gap-3">
        <div className="flex items-center justify-between text-xs text-slate-400 px-1">
          <span className="flex items-center gap-1 font-semibold text-slate-300 text-[11px]">
            <Search className="w-3.5 h-3.5 text-cyan-400" />
            Sorted Array & Binary Halving Window [L .. M .. R]
          </span>
          <span className="text-[10px] text-slate-500 font-mono">
            {discardedIndices.length > 0 ? `${discardedIndices.length} elements discarded` : 'All elements candidate'}
          </span>
        </div>

        {/* Array Cells */}
        <div className="overflow-x-auto pt-10 pb-4">
          <div className="flex items-center gap-2.5 min-w-max px-6 justify-center">
            {nums.map((val, idx) => {
              const isL = idx === left && !isComplete;
              const isR = idx === right && !isComplete;
              const isM = idx === mid && !isComplete;
              const isDiscarded = discardedIndices.includes(idx);
              const isFound = isComplete && idx === resultIndex;
              const inRange = idx >= left && idx <= right && !isDiscarded;

              return (
                <div key={idx} className="relative flex flex-col items-center">
                  {/* Floating Pointer: Mid (M) */}
                  {isM && (
                    <div className="absolute -top-8 flex flex-col items-center animate-bounce text-amber-400 z-20 whitespace-nowrap pointer-events-none">
                      <span className="text-[9px] font-extrabold uppercase tracking-wider bg-amber-950/90 text-amber-300 px-2 py-0.5 rounded-full border border-amber-500/60 shadow-lg backdrop-blur">
                        Mid (M)
                      </span>
                      <ArrowDown className="w-3 h-3 text-amber-400" />
                    </div>
                  )}

                  {/* Floating Pointer: Left (L) */}
                  {isL && !isM && (
                    <div className="absolute -top-8 flex flex-col items-center animate-bounce text-cyan-400 z-20 whitespace-nowrap pointer-events-none">
                      <span className="text-[9px] font-extrabold uppercase tracking-wider bg-cyan-950/90 text-cyan-300 px-2 py-0.5 rounded-full border border-cyan-500/60 shadow-lg backdrop-blur">
                        L
                      </span>
                      <ArrowDown className="w-3 h-3 text-cyan-400" />
                    </div>
                  )}

                  {/* Floating Pointer: Right (R) */}
                  {isR && !isM && (
                    <div className="absolute -top-8 flex flex-col items-center animate-bounce text-purple-400 z-20 whitespace-nowrap pointer-events-none">
                      <span className="text-[9px] font-extrabold uppercase tracking-wider bg-purple-950/90 text-purple-300 px-2 py-0.5 rounded-full border border-purple-500/60 shadow-lg backdrop-blur">
                        R
                      </span>
                      <ArrowDown className="w-3 h-3 text-purple-400" />
                    </div>
                  )}

                  {/* Number Box */}
                  <div
                    className={`w-12 h-14 rounded-xl border-2 flex flex-col items-center justify-center transition-all ${
                      isFound
                        ? 'border-emerald-400 bg-emerald-500/30 text-emerald-200 shadow-lg shadow-emerald-500/30 scale-110 z-10'
                        : isM
                        ? 'border-amber-400 bg-amber-500/20 text-amber-200 shadow-md shadow-amber-500/30 scale-105 z-10'
                        : inRange
                        ? 'border-indigo-400/80 bg-indigo-500/15 text-white'
                        : isDiscarded
                        ? 'border-slate-800/60 bg-slate-950/30 text-slate-600 opacity-25 line-through'
                        : 'border-slate-800 bg-slate-900/50 text-slate-400'
                    }`}
                  >
                    <span className="text-base font-extrabold font-mono">{val}</span>
                  </div>

                  {/* Index underneath */}
                  <div className="mt-1 text-center">
                    <span
                      className={`text-[10px] font-mono font-bold ${
                        isM
                          ? 'text-amber-400'
                          : isL
                          ? 'text-cyan-400'
                          : isR
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

      {/* 3. The Midpoint Comparison & O(log n) Halving Card */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-3 pt-1 border-t border-slate-800/80 shrink-0">
        <div className="p-2.5 rounded-xl bg-slate-950/70 border border-slate-800 flex flex-col justify-between gap-1">
          <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider flex items-center gap-1.5">
            <Search className="w-3.5 h-3.5 text-cyan-400" />
            Midpoint Comparison Equation
          </span>
          <div className="font-mono text-xs text-slate-200 bg-slate-900/90 p-2 rounded-lg border border-slate-800 flex items-center justify-around">
            <span className="text-amber-300 font-bold">nums[{mid}] = {midVal}</span>
            <span
              className={`px-2 py-0.5 rounded text-xs font-bold ${
                comparison === 'match'
                  ? 'bg-emerald-500/20 text-emerald-400'
                  : comparison === 'target_larger'
                  ? 'bg-indigo-500/20 text-indigo-400'
                  : 'bg-rose-500/20 text-rose-400'
              }`}
            >
              {comparison === 'match' ? '==' : comparison === 'target_larger' ? '<' : '>'}
            </span>
            <span className="text-white font-bold">Target = {target}</span>
          </div>
        </div>

        <div className="p-2.5 rounded-xl bg-slate-950/70 border border-slate-800 flex flex-col justify-between gap-1">
          <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider flex items-center gap-1.5">
            <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" />
            The O(log n) Halving Invariant
          </span>
          <p className="text-[11px] text-slate-300 leading-snug">
            Every inspection cuts the search space in half ($N \rightarrow N/2 \rightarrow N/4 \dots$). Even for 1,000,000 elements, Binary Search needs at most 20 comparisons!
          </p>
        </div>
      </div>
    </div>
  );
};
