import React from 'react';
import { ThreeSumStep } from '../../algorithms/threeSumIntuitive';
import { Users, CheckCircle2, Award, ArrowRight } from 'lucide-react';

interface ThreeSumViewerProps {
  step: ThreeSumStep;
  rawNums: number[];
}

export const ThreeSumViewer: React.FC<ThreeSumViewerProps> = ({ step }) => {
  const { sortedNums, anchorIndex, leftIndex, rightIndex, currentSum, foundTriplets, action, isComplete } = step;

  return (
    <div className="flex-1 min-h-0 flex flex-col bg-slate-900/60 border border-slate-800 rounded-2xl p-3 shadow-xl overflow-hidden justify-between">
      {/* Top Banner */}
      <div className="bg-slate-950/70 border border-slate-800/80 rounded-xl p-2.5 flex items-center justify-between shrink-0">
        <div className="flex items-center gap-2">
          <span className="p-1.5 rounded-lg bg-indigo-500/10 text-indigo-400 border border-indigo-500/20">
            <Users className="w-4 h-4" />
          </span>
          <div>
            <h3 className="text-xs font-semibold text-white tracking-wide">{step.headline}</h3>
            <p className="text-[11px] text-slate-400">{step.subtext}</p>
          </div>
        </div>
        <div className="flex items-center gap-2">
          {isComplete ? (
            <span className="px-2 py-0.5 rounded-md bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 text-[11px] font-semibold flex items-center gap-1">
              <CheckCircle2 className="w-3.5 h-3.5" /> Total Triplets: {foundTriplets.length}
            </span>
          ) : (
            <span className="px-2 py-0.5 rounded-md bg-indigo-500/10 border border-indigo-500/20 text-indigo-400 text-[11px] font-mono">
              Step {step.stepIndex + 1} / {step.totalSteps}
            </span>
          )}
        </div>
      </div>

      {/* Main Visual Arena */}
      <div className="flex-1 min-h-0 flex flex-col justify-around gap-2 py-2 px-3">
        {/* Array Visualization with 3 Pointers */}
        <div className="flex flex-col gap-1.5">
          <span className="text-[10px] uppercase font-mono font-bold tracking-wider text-slate-400">
            Sorted Array & Pointers [Anchor (i), Left (l), Right (r)]:
          </span>

          <div className="flex items-center gap-2 overflow-x-auto py-3 px-3 bg-slate-950/60 rounded-xl border border-slate-800/80">
            {sortedNums.map((val, idx) => {
              const isAnchor = anchorIndex === idx;
              const isLeft = leftIndex === idx;
              const isRight = rightIndex === idx;

              let boxStyle = 'bg-slate-900 border-slate-700 text-slate-300';
              if (isAnchor) {
                boxStyle = 'bg-purple-500/20 border-purple-400 text-purple-300 font-bold scale-110 shadow-lg shadow-purple-500/30';
              } else if (isLeft) {
                boxStyle = 'bg-cyan-500/20 border-cyan-400 text-cyan-300 font-bold scale-110 shadow-lg shadow-cyan-500/30';
              } else if (isRight) {
                boxStyle = 'bg-amber-500/20 border-amber-400 text-amber-300 font-bold scale-110 shadow-lg shadow-amber-500/30';
              }

              return (
                <div key={idx} className="flex flex-col items-center gap-1 shrink-0">
                  {/* Pointer tag */}
                  <div className="h-5 flex items-center justify-center text-[10px] font-mono font-bold">
                    {isAnchor ? (
                      <span className="text-purple-400 bg-purple-500/10 px-1 rounded border border-purple-500/30">
                        i
                      </span>
                    ) : isLeft ? (
                      <span className="text-cyan-400 bg-cyan-500/10 px-1 rounded border border-cyan-500/30">
                        l
                      </span>
                    ) : isRight ? (
                      <span className="text-amber-400 bg-amber-500/10 px-1 rounded border border-amber-500/30">
                        r
                      </span>
                    ) : null}
                  </div>

                  {/* Number Box */}
                  <div
                    className={`w-10 h-10 rounded-lg flex items-center justify-center font-mono text-xs border transition-all ${boxStyle}`}
                  >
                    {val}
                  </div>

                  {/* Index */}
                  <span className="text-[9px] font-mono text-slate-500">{idx}</span>
                </div>
              );
            })}
          </div>
        </div>

        {/* Live Equation Bar */}
        {anchorIndex >= 0 && leftIndex >= 0 && rightIndex >= 0 && currentSum !== null && (
          <div className="bg-slate-950/60 border border-slate-800/80 rounded-xl p-2.5 flex items-center justify-center gap-3">
            <span className="px-2 py-1 rounded bg-purple-500/15 border border-purple-500/30 text-purple-300 font-mono text-xs font-bold">
              nums[{anchorIndex}] = {sortedNums[anchorIndex]}
            </span>
            <span className="text-slate-500 font-bold">+</span>
            <span className="px-2 py-1 rounded bg-cyan-500/15 border border-cyan-500/30 text-cyan-300 font-mono text-xs font-bold">
              nums[{leftIndex}] = {sortedNums[leftIndex]}
            </span>
            <span className="text-slate-500 font-bold">+</span>
            <span className="px-2 py-1 rounded bg-amber-500/15 border border-amber-500/30 text-amber-300 font-mono text-xs font-bold">
              nums[{rightIndex}] = {sortedNums[rightIndex]}
            </span>
            <span className="text-slate-500 font-bold">=</span>
            <span
              className={`px-3 py-1 rounded font-mono text-xs font-bold border ${
                currentSum === 0
                  ? 'bg-emerald-500/20 border-emerald-400 text-emerald-300'
                  : currentSum < 0
                  ? 'bg-blue-500/20 border-blue-400 text-blue-300'
                  : 'bg-rose-500/20 border-rose-400 text-rose-300'
              }`}
            >
              Sum: {currentSum} {currentSum === 0 ? '✓ (Match!)' : currentSum < 0 ? '(< 0, need larger)' : '(> 0, need smaller)'}
            </span>
          </div>
        )}

        {/* Found Triplets Shelf */}
        <div className="bg-slate-950/60 border border-slate-800/80 rounded-xl p-2.5 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Award className="w-4 h-4 text-emerald-400" />
            <span className="text-xs font-mono font-bold text-slate-300">
              Unique Zero-Sum Triplets:
            </span>
          </div>
          <div className="flex items-center gap-2 overflow-x-auto">
            {foundTriplets.length === 0 ? (
              <span className="text-xs text-slate-500 italic">No triplets found yet...</span>
            ) : (
              foundTriplets.map((trip, idx) => (
                <div
                  key={idx}
                  className="px-2.5 py-1 rounded-lg bg-emerald-500/20 border border-emerald-400/40 text-emerald-300 font-mono text-xs font-bold shadow-md shadow-emerald-500/10"
                >
                  [{trip.join(', ')}]
                </div>
              ))
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
