import React from 'react';
import { SlidingWindowMaxStep } from '../../algorithms/slidingWindowMaxIntuitive';
import { Layers, Trophy, CheckCircle2, ArrowRight, ShieldCheck, Flame } from 'lucide-react';

interface SlidingWindowMaxViewerProps {
  step: SlidingWindowMaxStep;
}

export const SlidingWindowMaxViewer: React.FC<SlidingWindowMaxViewerProps> = ({ step }) => {
  const { nums, k, left, right, dequeIndices, dequeValues, action, crushedValue, evictedValue, result, isComplete } = step;

  return (
    <div className="flex-1 min-h-0 flex flex-col bg-slate-900/60 border border-slate-800 rounded-2xl p-3 shadow-xl overflow-hidden justify-between">
      {/* Top Banner */}
      <div className="bg-slate-950/70 border border-slate-800/80 rounded-xl p-2.5 flex items-center justify-between shrink-0">
        <div className="flex items-center gap-2">
          <span className="p-1.5 rounded-lg bg-indigo-500/10 text-indigo-400 border border-indigo-500/20">
            <Layers className="w-4 h-4" />
          </span>
          <div>
            <h3 className="text-xs font-semibold text-white tracking-wide">{step.headline}</h3>
            <p className="text-[11px] text-slate-400">{step.subtext}</p>
          </div>
        </div>
        <div className="flex items-center gap-2">
          {isComplete ? (
            <span className="px-2 py-0.5 rounded-md bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 text-[11px] font-semibold flex items-center gap-1">
              <CheckCircle2 className="w-3.5 h-3.5" /> Complete ({result.length} Maxima)
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
        {/* Row 1: Array and Sliding Window */}
        <div className="flex flex-col gap-1.5">
          <div className="flex items-center justify-between">
            <span className="text-[10px] uppercase font-mono font-bold tracking-wider text-slate-400">
              Array & Sliding Window [k = {k}]:
            </span>
            <span className="text-[10px] font-mono text-slate-400">
              Active window: <span className="text-indigo-400 font-bold">[{Math.max(0, left)} .. {Math.max(0, right)}]</span>
            </span>
          </div>

          <div className="flex items-center gap-2 overflow-x-auto py-3 px-3 bg-slate-950/60 rounded-xl border border-slate-800/80">
            {nums.map((val, idx) => {
              const inWindow = idx >= left && idx <= right;
              const isFrontMax = dequeIndices.length > 0 && dequeIndices[0] === idx;
              const isRight = idx === right;

              let boxStyle = 'bg-slate-900 border-slate-800 text-slate-500 opacity-50';
              if (inWindow) {
                if (isFrontMax) {
                  boxStyle = 'bg-emerald-500/25 border-emerald-400 text-emerald-200 font-bold scale-105 shadow-lg shadow-emerald-500/20 ring-2 ring-emerald-500/30';
                } else {
                  boxStyle = 'bg-indigo-500/20 border-indigo-500/60 text-indigo-200 font-bold';
                }
              }

              return (
                <div key={idx} className="flex flex-col items-center gap-1 shrink-0">
                  {/* Indicator */}
                  <div className="h-4 flex items-center justify-center text-[10px] font-mono font-bold">
                    {isFrontMax ? (
                      <span className="text-emerald-400 font-bold flex items-center gap-0.5">
                        <Flame className="w-3 h-3 text-emerald-400" /> MAX
                      </span>
                    ) : isRight ? (
                      <span className="text-pink-400 font-bold">NEW</span>
                    ) : null}
                  </div>

                  {/* Number box */}
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

        {/* Row 2: Monotonic Deque Tube */}
        <div className="bg-slate-950/60 border border-slate-800/80 rounded-xl p-2.5 flex flex-col gap-1.5">
          <div className="flex items-center justify-between">
            <span className="text-[10px] uppercase font-mono font-bold tracking-wider text-slate-400 flex items-center gap-1.5">
              <Layers className="w-3.5 h-3.5 text-indigo-400" /> Monotonic Deque (Strictly Decreasing: Front is Window Max)
            </span>
            <div className="flex items-center gap-2 text-[10px] font-mono">
              <span className="text-emerald-400 font-bold">← FRONT (Max)</span>
              <span className="text-slate-600">|</span>
              <span className="text-amber-400 font-bold">BACK (Push/Pop) →</span>
            </div>
          </div>

          <div className="flex items-center gap-2 min-h-[46px] p-2 rounded-lg bg-slate-900/80 border border-slate-800 overflow-x-auto">
            {dequeIndices.length === 0 ? (
              <span className="text-xs text-slate-500 italic">Deque empty</span>
            ) : (
              dequeIndices.map((idx, pos) => {
                const val = nums[idx];
                const isFront = pos === 0;
                return (
                  <React.Fragment key={idx}>
                    <div
                      className={`px-3 py-1 rounded-lg border font-mono text-xs flex items-center gap-1.5 transition-all ${
                        isFront
                          ? 'bg-emerald-500/25 border-emerald-400 text-emerald-300 font-bold shadow-md shadow-emerald-500/20 scale-105'
                          : 'bg-indigo-500/15 border-indigo-500/30 text-indigo-300'
                      }`}
                    >
                      <span className="text-white font-bold">{val}</span>
                      <span className="text-[9px] text-slate-400">(idx {idx})</span>
                    </div>
                    {pos < dequeIndices.length - 1 && (
                      <span className="text-slate-600 font-bold">›</span>
                    )}
                  </React.Fragment>
                );
              })
            )}

            {/* Crushed animation bubble */}
            {action === 'POP_BACK' && crushedValue !== null && (
              <div className="ml-2 px-2 py-0.5 rounded bg-rose-500/20 border border-rose-500/50 text-rose-400 font-mono text-[10px] animate-pulse">
                💥 Crushed {crushedValue}
              </div>
            )}
            {/* Evicted animation bubble */}
            {action === 'POP_FRONT' && evictedValue !== null && (
              <div className="ml-2 px-2 py-0.5 rounded bg-amber-500/20 border border-amber-500/50 text-amber-400 font-mono text-[10px] animate-pulse">
                🚪 Expired {evictedValue}
              </div>
            )}
          </div>
        </div>

        {/* Row 3: Result Maxima Shelf */}
        <div className="bg-slate-950/60 border border-slate-800/80 rounded-xl p-2.5 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Trophy className="w-4 h-4 text-emerald-400" />
            <span className="text-xs font-mono font-bold text-slate-300">
              Output Array (Collected Window Maxima):
            </span>
          </div>
          <div className="flex items-center gap-1.5 overflow-x-auto">
            {result.length === 0 ? (
              <span className="text-xs text-slate-500 italic">Awaiting first complete window...</span>
            ) : (
              result.map((m, idx) => (
                <div
                  key={idx}
                  className="px-2.5 py-1 rounded-lg bg-emerald-500/20 border border-emerald-400/40 text-emerald-300 font-mono text-xs font-bold shadow-md shadow-emerald-500/10"
                >
                  {m}
                </div>
              ))
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
