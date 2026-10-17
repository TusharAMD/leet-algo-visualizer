import React from 'react';
import { TwoSumStep } from '../../algorithms/twoSumIntuitive';
import { ArrowDown, ArrowRight, ArrowLeft, CheckCircle2, Scale, Trash2, Trophy } from 'lucide-react';

interface TwoSumViewerProps {
  step: TwoSumStep;
  numbers: number[];
  target: number;
}

export const TwoSumViewer: React.FC<TwoSumViewerProps> = ({ step, numbers, target }) => {
  const {
    leftIndex,
    rightIndex,
    leftVal,
    rightVal,
    currentSum,
    comparison,
    action,
    eliminatedIndices,
    headline,
    subtext,
    isComplete,
    resultIndices,
  } = step;

  return (
    <div className="flex flex-col justify-between gap-3 p-4 bg-slate-900/40 border border-slate-800 rounded-2xl h-full overflow-hidden">
      {/* 1. Header Banner: Current Sum vs Target Comparison */}
      <div className="bg-gradient-to-r from-slate-900 via-indigo-950/40 to-slate-900 border border-indigo-500/20 rounded-xl p-3 shadow shrink-0">
        <div className="flex items-center justify-between gap-2 flex-wrap">
          <div className="flex items-center gap-2.5">
            <div className="w-9 h-9 rounded-xl bg-indigo-500/20 border border-indigo-500/40 flex items-center justify-center text-indigo-300 font-bold font-mono text-sm shrink-0">
              ${target}
            </div>
            <div>
              <div className="flex items-center gap-1.5">
                <span className="text-[9px] uppercase font-bold tracking-wider px-1.5 py-0.2 rounded bg-indigo-500/10 text-indigo-400 border border-indigo-500/20">
                  Target Sum
                </span>
                <span className="text-xs font-mono font-bold text-white">${target}</span>
              </div>
              <h2 className="text-xs font-bold text-white leading-tight mt-0.5">{headline}</h2>
            </div>
          </div>

          {/* Comparison Status Badge */}
          <div className="flex items-center gap-2 shrink-0">
            {isComplete ? (
              <div className="flex items-center gap-1.5 px-3 py-1 rounded-xl bg-emerald-500/20 border border-emerald-500/50 text-emerald-300 font-bold text-xs shadow-lg shadow-emerald-500/10">
                <Trophy className="w-4 h-4 text-emerald-400" />
                <span>Pair Found: Indices [{resultIndices?.[0]}, {resultIndices?.[1]}]</span>
              </div>
            ) : comparison === 'greater' ? (
              <div className="flex items-center gap-1.5 px-3 py-1 rounded-xl bg-rose-500/20 border border-rose-500/40 text-rose-300 font-bold text-xs">
                <span>Sum &gt; Target (${currentSum} &gt; ${target})</span>
                <ArrowLeft className="w-3.5 h-3.5 text-rose-400" />
              </div>
            ) : (
              <div className="flex items-center gap-1.5 px-3 py-1 rounded-xl bg-amber-500/20 border border-amber-500/40 text-amber-300 font-bold text-xs">
                <span>Sum &lt; Target (${currentSum} &lt; ${target})</span>
                <ArrowRight className="w-3.5 h-3.5 text-amber-400" />
              </div>
            )}
          </div>
        </div>
        <p className="text-[11px] text-slate-300 mt-1.5 leading-normal font-sans line-clamp-2">{subtext}</p>
      </div>

      {/* 2. The Interactive Pointer Track (Array Visualizer) */}
      <div className="flex-1 min-h-0 flex flex-col justify-center gap-3">
        <div className="flex items-center justify-between text-xs text-slate-400 px-1">
          <span className="flex items-center gap-1 font-semibold text-slate-300 text-[11px]">
            <Scale className="w-3.5 h-3.5 text-indigo-400" />
            Sorted Array & Active Two-Pointer Squeeze Window
          </span>
          <span className="text-[10px] text-slate-500">
            Search Space Remaining: {numbers.length - eliminatedIndices.length} / {numbers.length} elements
          </span>
        </div>

        {/* Array Cells Row with Floating Pointers */}
        <div className="overflow-x-auto pt-10 pb-4">
          <div className="flex items-center gap-3 min-w-max px-8">
            {numbers.map((val, idx) => {
              const isLeft = idx === leftIndex;
              const isRight = idx === rightIndex;
              const isEliminated = eliminatedIndices.includes(idx);
              const isInWindow = idx >= leftIndex && idx <= rightIndex;

              return (
                <div key={idx} className="relative flex flex-col items-center">
                  {/* Floating Pointer L */}
                  {isLeft && (
                    <div className="absolute -top-8 flex flex-col items-center animate-bounce text-cyan-400 z-20 whitespace-nowrap pointer-events-none">
                      <span className="text-[9px] font-extrabold uppercase tracking-wider bg-cyan-950/90 text-cyan-300 px-2 py-0.5 rounded-full border border-cyan-500/60 shadow-lg backdrop-blur">
                        Left (L)
                      </span>
                      <ArrowDown className="w-3 h-3 text-cyan-400" />
                    </div>
                  )}

                  {/* Floating Pointer R */}
                  {isRight && (
                    <div className="absolute -top-8 flex flex-col items-center animate-bounce text-purple-400 z-20 whitespace-nowrap pointer-events-none">
                      <span className="text-[9px] font-extrabold uppercase tracking-wider bg-purple-950/90 text-purple-300 px-2 py-0.5 rounded-full border border-purple-500/60 shadow-lg backdrop-blur">
                        Right (R)
                      </span>
                      <ArrowDown className="w-3 h-3 text-purple-400" />
                    </div>
                  )}

                  {/* The Number Box */}
                  <div
                    className={`w-14 h-16 rounded-xl border-2 flex flex-col items-center justify-center transition-all ${
                      isComplete && (isLeft || isRight)
                        ? 'border-emerald-400 bg-emerald-500/30 shadow-lg shadow-emerald-500/30 scale-110 z-10'
                        : isLeft
                        ? 'border-cyan-400 bg-cyan-500/20 shadow-md shadow-cyan-500/30 scale-105 z-10'
                        : isRight
                        ? 'border-purple-400 bg-purple-500/20 shadow-md shadow-purple-500/30 scale-105 z-10'
                        : isInWindow
                        ? 'border-slate-700 bg-slate-800/80 text-white'
                        : isEliminated
                        ? 'border-slate-800/60 bg-slate-950/30 text-slate-600 opacity-30 line-through'
                        : 'border-slate-800 bg-slate-900/50'
                    }`}
                  >
                    <span
                      className={`text-base font-bold font-mono ${
                        isComplete && (isLeft || isRight)
                          ? 'text-emerald-200'
                          : isLeft
                          ? 'text-cyan-200'
                          : isRight
                          ? 'text-purple-200'
                          : isEliminated
                          ? 'text-slate-600'
                          : 'text-white'
                      }`}
                    >
                      {val}
                    </span>
                    <span className="text-[8px] text-slate-400 font-mono">
                      idx {idx}
                    </span>
                  </div>

                  {/* 1-indexed Tag underneath */}
                  <div className="mt-1.5 text-center">
                    <span
                      className={`text-[10px] font-mono font-bold ${
                        isLeft
                          ? 'text-cyan-400'
                          : isRight
                          ? 'text-purple-400'
                          : 'text-slate-500'
                      }`}
                    >
                      [{idx + 1}]
                    </span>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>

      {/* 3. The Weighing Scale & Elimination Logic Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-3 pt-1 border-t border-slate-800/80 shrink-0">
        {/* Scale Breakdown Card */}
        <div className="p-3 rounded-xl bg-slate-950/70 border border-slate-800 flex flex-col justify-between gap-1.5">
          <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider flex items-center gap-1.5">
            <Scale className="w-3.5 h-3.5 text-indigo-400" />
            Active Equation
          </span>

          <div className="flex items-center justify-around p-2 rounded-lg bg-slate-900 border border-slate-800 font-mono text-xs">
            <div className="flex items-center gap-1.5">
              <span className="text-cyan-300 font-bold">{leftVal}</span>
              <span className="text-slate-500">+</span>
              <span className="text-purple-300 font-bold">{rightVal}</span>
              <span className="text-slate-500">=</span>
              <span className="text-white font-extrabold text-sm">{currentSum}</span>
            </div>

            <span
              className={`px-2 py-0.5 rounded text-xs font-bold ${
                isComplete
                  ? 'bg-emerald-500/20 text-emerald-400'
                  : comparison === 'greater'
                  ? 'bg-rose-500/20 text-rose-400'
                  : 'bg-amber-500/20 text-amber-400'
              }`}
            >
              {isComplete ? '==' : comparison === 'greater' ? '>' : '<'}
            </span>

            <div className="flex items-center gap-1">
              <span className="text-slate-400 text-[10px]">Target:</span>
              <span className="text-indigo-300 font-bold text-sm">{target}</span>
            </div>
          </div>
        </div>

        {/* Elimination Guarantee Card */}
        <div className="p-3 rounded-xl bg-slate-950/70 border border-slate-800 flex flex-col justify-between gap-1">
          <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider flex items-center gap-1.5">
            <Trash2 className="w-3.5 h-3.5 text-rose-400" />
            The Two-Pointers Mathematical Guarantee
          </span>
          <p className="text-[11px] text-slate-300 leading-snug">
            {isComplete ? (
              <span className="text-emerald-300 font-semibold">
                Found the unique answer in O(n) time and O(1) space!
              </span>
            ) : comparison === 'greater' ? (
              <>
                Because array is sorted, <strong className="text-purple-300">{rightVal}</strong> paired with ANY number ≥ {leftVal} exceeds target. Discarding index {rightIndex}.
              </>
            ) : (
              <>
                Because array is sorted, <strong className="text-cyan-300">{leftVal}</strong> paired with ANY number ≤ {rightVal} is below target. Discarding index {leftIndex}.
              </>
            )}
          </p>
        </div>
      </div>
    </div>
  );
};
