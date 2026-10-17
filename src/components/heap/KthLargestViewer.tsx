import React from 'react';
import { KthLargestStep } from '../../algorithms/kthLargestIntuitive';
import { Layers, CheckCircle2, ArrowRight, ShieldAlert, Award, Hash } from 'lucide-react';

interface KthLargestViewerProps {
  step: KthLargestStep;
}

export const KthLargestViewer: React.FC<KthLargestViewerProps> = ({ step }) => {
  const {
    nums,
    k,
    currentIndex,
    currentNum,
    minHeap,
    evictedNum,
    kthLargest,
    headline,
    subtext,
    isComplete,
    stepIndex,
    totalSteps
  } = step;

  return (
    <div className="flex-1 min-h-0 flex flex-col bg-slate-900/60 border border-slate-800 rounded-2xl p-3 shadow-xl overflow-hidden justify-between">
      {/* Top Banner */}
      <div className="bg-slate-950/70 border border-slate-800/80 rounded-xl p-2.5 flex items-center justify-between shrink-0">
        <div className="flex items-center gap-2">
          <span className="p-1.5 rounded-lg bg-indigo-500/10 text-indigo-400 border border-indigo-500/20">
            <Layers className="w-4 h-4" />
          </span>
          <div>
            <h3 className="text-xs font-semibold text-white tracking-wide">{headline}</h3>
            <p className="text-[11px] text-slate-400">{subtext}</p>
          </div>
        </div>
        <div className="flex items-center gap-2">
          {isComplete ? (
            <span className="px-2 py-0.5 rounded-md bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 text-[11px] font-semibold flex items-center gap-1">
              <CheckCircle2 className="w-3.5 h-3.5" /> Result: {kthLargest}
            </span>
          ) : (
            <span className="px-2 py-0.5 rounded-md bg-indigo-500/10 border border-indigo-500/20 text-indigo-400 text-[11px] font-mono">
              Step {stepIndex + 1} / {totalSteps}
            </span>
          )}
        </div>
      </div>

      {/* Array Stream */}
      <div className="bg-slate-950/50 border border-slate-800/70 rounded-xl p-2 shrink-0">
        <div className="text-[10px] uppercase font-semibold text-slate-400 mb-1.5 flex items-center gap-1">
          <Hash className="w-3 h-3 text-indigo-400" /> Input Stream (`nums`):
        </div>
        <div className="flex items-center gap-1.5 flex-wrap">
          {nums.map((val, idx) => {
            const isProcessed = idx < currentIndex;
            const isCurrent = idx === currentIndex;
            return (
              <div
                key={idx}
                className={`relative px-2.5 py-1 rounded-lg text-xs font-mono font-bold transition-all duration-200 border ${
                  isCurrent
                    ? 'bg-amber-500/20 border-amber-400 text-amber-200 shadow-lg shadow-amber-500/20 scale-105'
                    : isProcessed
                    ? 'bg-slate-900 border-slate-800 text-slate-500 opacity-60'
                    : 'bg-slate-850 border-slate-700/60 text-slate-300'
                }`}
              >
                {val}
                {isCurrent && (
                  <span className="absolute -top-2 left-1/2 -translate-x-1/2 text-[8px] bg-amber-500 text-slate-950 px-1 rounded-full font-bold">
                    cur
                  </span>
                )}
              </div>
            );
          })}
        </div>
      </div>

      {/* Center Arena: Min-Heap & Eviction Area */}
      <div className="flex-1 min-h-0 grid grid-cols-1 md:grid-cols-12 gap-3 py-1 px-1">
        {/* Min-Heap Container */}
        <div className="md:col-span-8 bg-slate-950/60 border border-slate-800 rounded-xl p-2.5 flex flex-col justify-between overflow-hidden">
          <div className="flex items-center justify-between border-b border-slate-800/70 pb-1.5 shrink-0">
            <span className="text-xs font-semibold text-slate-300 flex items-center gap-1.5">
              <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
              Min-Heap (Cap = {k}): Top {k} Largest Numbers So Far
            </span>
            <span className="text-[10px] font-mono text-slate-400 bg-slate-900 px-2 py-0.5 rounded border border-slate-800">
              Size: {minHeap.length} / {k}
            </span>
          </div>

          {/* Heap Elements Visualizer */}
          <div className="flex-1 flex flex-col items-center justify-center py-2">
            {minHeap.length === 0 ? (
              <div className="text-slate-600 text-xs italic">Heap is empty</div>
            ) : (
              <div className="flex flex-col items-center gap-3">
                {/* Root (Index 0) */}
                <div className="flex flex-col items-center">
                  <div className="text-[10px] font-semibold text-emerald-400 mb-0.5 flex items-center gap-1">
                    <Award className="w-3 h-3" /> Root: minHeap[0] (Smallest of Top {k})
                  </div>
                  <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-emerald-500/20 to-teal-500/10 border-2 border-emerald-400 flex flex-col items-center justify-center text-white font-mono font-bold text-lg shadow-lg shadow-emerald-500/20">
                    <span>{minHeap[0]}</span>
                    <span className="text-[9px] text-emerald-300/80 font-normal">idx: 0</span>
                  </div>
                </div>

                {/* Rest of heap elements */}
                {minHeap.length > 1 && (
                  <div className="flex items-center gap-2.5 flex-wrap justify-center">
                    {minHeap.slice(1).map((val, idx) => (
                      <div
                        key={idx + 1}
                        className="w-11 h-11 rounded-xl bg-slate-850 border border-slate-700/80 flex flex-col items-center justify-center text-slate-200 font-mono font-semibold text-sm shadow"
                      >
                        <span>{val}</span>
                        <span className="text-[8px] text-slate-500">idx: {idx + 1}</span>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            )}
          </div>

          <div className="text-[10px] text-slate-500 bg-slate-900/80 rounded-lg p-1.5 border border-slate-800/60 text-center shrink-0">
            Property: Root holds the minimum of the heap. Once all elements are processed, the root is exactly the {k}-th largest!
          </div>
        </div>

        {/* Eviction & Live Info Sidepanel */}
        <div className="md:col-span-4 flex flex-col gap-2 min-h-0">
          {/* Eviction Card */}
          <div className="bg-slate-950/60 border border-slate-800 rounded-xl p-2.5 flex-1 flex flex-col justify-between">
            <span className="text-xs font-semibold text-slate-300 flex items-center gap-1">
              <ShieldAlert className="w-3.5 h-3.5 text-rose-400" /> Evicted Chamber
            </span>

            <div className="flex-1 flex flex-col items-center justify-center py-2 text-center">
              {evictedNum !== null ? (
                <div className="flex flex-col items-center animate-bounce">
                  <div className="w-12 h-12 rounded-xl bg-rose-500/15 border border-rose-500/40 text-rose-300 font-mono font-bold text-base flex items-center justify-center line-through shadow-md shadow-rose-500/20">
                    {evictedNum}
                  </div>
                  <span className="text-[10px] text-rose-400 mt-1 font-medium">
                    Evicted (heap &gt; {k})
                  </span>
                </div>
              ) : (
                <span className="text-slate-600 text-xs italic">No eviction this step</span>
              )}
            </div>

            <p className="text-[10px] text-slate-500 leading-tight">
              When heap size reaches {k} + 1, the minimum element is purged.
            </p>
          </div>

          {/* Quick Metrics */}
          <div className="bg-slate-950/60 border border-slate-800 rounded-xl p-2.5 shrink-0 flex items-center justify-between text-xs">
            <div>
              <span className="text-[10px] text-slate-400 block">K Parameter</span>
              <span className="font-mono font-bold text-indigo-300">{k}</span>
            </div>
            <div className="text-right">
              <span className="text-[10px] text-slate-400 block">Current Answer</span>
              <span className="font-mono font-bold text-emerald-400">
                {minHeap.length > 0 ? minHeap[0] : '—'}
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
