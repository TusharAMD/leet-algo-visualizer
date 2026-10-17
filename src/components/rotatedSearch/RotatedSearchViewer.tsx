import React from 'react';
import { RotatedSearchStep } from '../../algorithms/searchRotatedIntuitive';
import { RotateCw, ArrowDown, CheckCircle2, Trophy, XCircle, ShieldCheck } from 'lucide-react';

interface RotatedSearchViewerProps {
  step: RotatedSearchStep;
  nums: number[];
  target: number;
}

export const RotatedSearchViewer: React.FC<RotatedSearchViewerProps> = ({ step, nums, target }) => {
  const {
    left,
    right,
    mid,
    midVal,
    sortedHalf,
    targetInSortedHalf,
    discardedIndices,
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
            <div className="w-9 h-9 rounded-xl bg-purple-500/20 border border-purple-500/40 flex items-center justify-center text-purple-300 font-bold font-mono text-sm shrink-0">
              <RotateCw className="w-5 h-5 text-purple-400" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="text-[9px] uppercase font-bold tracking-wider px-1.5 py-0.2 rounded bg-indigo-500/10 text-indigo-400 border border-indigo-500/20">
                  Rotated Binary Search
                </span>
                <span className="text-xs font-mono font-bold text-white">
                  Target: {target} • Active: {activeCount} elements
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
                <span>Sorted Half: {sortedHalf === 'left' ? 'Left [L..M]' : 'Right [M..R]'}</span>
              </div>
            )}
          </div>
        </div>
        <p className="text-[11px] text-slate-300 mt-1.5 leading-normal font-sans line-clamp-2">{subtext}</p>
      </div>

      {/* 2. Rotated Array Track */}
      <div className="flex-1 min-h-0 flex flex-col justify-center gap-3">
        <div className="flex items-center justify-between text-xs text-slate-400 px-1">
          <span className="flex items-center gap-1 font-semibold text-slate-300 text-[11px]">
            <RotateCw className="w-3.5 h-3.5 text-purple-400" />
            Rotated Array with Sorted Half Boundary
          </span>
          <span className="text-[10px] text-slate-500 font-mono">
            {sortedHalf === 'left' ? `Sorted: [${left}..${mid}]` : `Sorted: [${mid}..${right}]`}
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
              const inSortedHalf =
                sortedHalf === 'left'
                  ? idx >= left && idx <= mid && !isDiscarded
                  : idx >= mid && idx <= right && !isDiscarded;

              return (
                <div key={idx} className="relative flex flex-col items-center">
                  {/* Floating Pointer: Mid */}
                  {isM && (
                    <div className="absolute -top-8 flex flex-col items-center animate-bounce text-amber-400 z-20 whitespace-nowrap pointer-events-none">
                      <span className="text-[9px] font-extrabold uppercase tracking-wider bg-amber-950/90 text-amber-300 px-2 py-0.5 rounded-full border border-amber-500/60 shadow-lg backdrop-blur">
                        Mid ({val})
                      </span>
                      <ArrowDown className="w-3 h-3 text-amber-400" />
                    </div>
                  )}

                  {/* Floating Pointer: Left */}
                  {isL && !isM && (
                    <div className="absolute -top-8 flex flex-col items-center animate-bounce text-cyan-400 z-20 whitespace-nowrap pointer-events-none">
                      <span className="text-[9px] font-extrabold uppercase tracking-wider bg-cyan-950/90 text-cyan-300 px-2 py-0.5 rounded-full border border-cyan-500/60 shadow-lg backdrop-blur">
                        L
                      </span>
                      <ArrowDown className="w-3 h-3 text-cyan-400" />
                    </div>
                  )}

                  {/* Floating Pointer: Right */}
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
                        : inSortedHalf
                        ? 'border-emerald-500/70 bg-emerald-500/10 text-white'
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

      {/* 3. Sorted Half Routing Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-3 pt-1 border-t border-slate-800/80 shrink-0">
        <div className="p-2.5 rounded-xl bg-slate-950/70 border border-slate-800 flex flex-col justify-between gap-1">
          <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">
            Which Half is Sorted?
          </span>
          <div className="font-mono text-xs text-slate-200 bg-slate-900/90 p-2 rounded-lg border border-slate-800 flex items-center justify-between">
            <span>
              {sortedHalf === 'left' ? `Left: nums[${left}] <= nums[${mid}]` : `Right: nums[${mid}] < nums[${right}]`}
            </span>
            <span className="text-emerald-400 font-bold">
              {sortedHalf.toUpperCase()} SORTED
            </span>
          </div>
        </div>

        <div className="p-2.5 rounded-xl bg-slate-950/70 border border-slate-800 flex flex-col justify-between gap-1">
          <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider flex items-center gap-1.5">
            <ShieldCheck className="w-3.5 h-3.5 text-indigo-400" />
            Inflection Routing Rule
          </span>
          <p className="text-[11px] text-slate-300 leading-snug">
            Since one half is strictly sorted, we can test in $O(1)$ if the target lies within its boundaries. If yes, search it; if no, discard it!
          </p>
        </div>
      </div>
    </div>
  );
};
