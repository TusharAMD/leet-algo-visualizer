import React from 'react';
import { KthLargestStreamStep } from '../../algorithms/kthLargestStreamIntuitive';
import { Radio, CheckCircle2, ArrowRight, ShieldAlert, Award, Hash, History } from 'lucide-react';

interface KthLargestStreamViewerProps {
  step: KthLargestStreamStep;
}

export const KthLargestStreamViewer: React.FC<KthLargestStreamViewerProps> = ({ step }) => {
  const {
    k,
    minHeap,
    currentOp,
    incomingVal,
    evictedVal,
    kthLargest,
    history,
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
            <Radio className="w-4 h-4 animate-pulse" />
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

      {/* Main Grid: Stream & Heap vs History */}
      <div className="flex-1 min-h-0 grid grid-cols-1 md:grid-cols-12 gap-3 py-1 px-1">
        {/* Left Arena: Live Action & Min-Heap */}
        <div className="md:col-span-8 flex flex-col gap-2 min-h-0">
          {/* Active Event Banner */}
          <div className="bg-slate-950/60 border border-slate-800 rounded-xl p-2 shrink-0 flex items-center justify-between">
            <div className="flex items-center gap-2">
              <span className="text-[10px] uppercase font-bold text-slate-400">Current Action:</span>
              <span
                className={`px-2 py-0.5 rounded text-xs font-mono font-bold border ${
                  currentOp === 'ADD'
                    ? 'bg-amber-500/20 border-amber-500/40 text-amber-300'
                    : currentOp === 'EVICT'
                    ? 'bg-rose-500/20 border-rose-500/40 text-rose-300'
                    : currentOp === 'RETURN'
                    ? 'bg-emerald-500/20 border-emerald-500/40 text-emerald-300'
                    : 'bg-indigo-500/20 border-indigo-500/40 text-indigo-300'
                }`}
              >
                {currentOp === 'INIT' && 'Initializing Heap'}
                {currentOp === 'ADD' && `Pushing incoming add(${incomingVal})`}
                {currentOp === 'EVICT' && `Evicting min (${evictedVal})`}
                {currentOp === 'RETURN' && `Return k-th largest = ${kthLargest}`}
              </span>
            </div>
            {evictedVal !== null && (
              <span className="text-[10px] text-rose-400 font-mono flex items-center gap-1">
                <ShieldAlert className="w-3 h-3" /> Discarded {evictedVal}
              </span>
            )}
          </div>

          {/* Min-Heap Chamber */}
          <div className="flex-1 bg-slate-950/60 border border-slate-800 rounded-xl p-2.5 flex flex-col justify-between overflow-hidden">
            <div className="flex items-center justify-between border-b border-slate-800/70 pb-1 shrink-0">
              <span className="text-xs font-semibold text-slate-300 flex items-center gap-1.5">
                <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
                Min-Heap Chamber (Capacity = {k})
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
                <div className="flex flex-col items-center gap-2.5">
                  {/* Root (Index 0) */}
                  <div className="flex flex-col items-center">
                    <div className="text-[10px] font-semibold text-emerald-400 mb-0.5 flex items-center gap-1">
                      <Award className="w-3 h-3" /> Root: minHeap[0] (Current {k}-th Largest)
                    </div>
                    <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-emerald-500/20 to-teal-500/10 border-2 border-emerald-400 flex flex-col items-center justify-center text-white font-mono font-bold text-lg shadow-lg shadow-emerald-500/20">
                      <span>{minHeap[0]}</span>
                      <span className="text-[9px] text-emerald-300/80 font-normal">minHeap[0]</span>
                    </div>
                  </div>

                  {/* Rest of heap elements */}
                  {minHeap.length > 1 && (
                    <div className="flex items-center gap-2 flex-wrap justify-center">
                      {minHeap.slice(1).map((val, idx) => (
                        <div
                          key={idx + 1}
                          className="w-10 h-10 rounded-xl bg-slate-850 border border-slate-700/80 flex flex-col items-center justify-center text-slate-200 font-mono font-semibold text-xs shadow"
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
              Continuous Invariant: minHeap always maintains exactly the top {k} largest items; root is smallest of them.
            </div>
          </div>
        </div>

        {/* Right Side: Stream Call History */}
        <div className="md:col-span-4 bg-slate-950/60 border border-slate-800 rounded-xl p-2.5 flex flex-col justify-between overflow-hidden">
          <div className="flex items-center justify-between border-b border-slate-800/70 pb-1.5 shrink-0">
            <span className="text-xs font-semibold text-slate-300 flex items-center gap-1.5">
              <History className="w-3.5 h-3.5 text-indigo-400" />
              Stream Call Log
            </span>
            <span className="text-[10px] font-mono text-slate-400 bg-slate-900 px-1.5 py-0.5 rounded border border-slate-800">
              {history.length} ops
            </span>
          </div>

          <div className="flex-1 overflow-y-auto py-2 flex flex-col gap-1.5">
            {history.length === 0 ? (
              <span className="text-slate-600 text-xs italic text-center py-4">
                No stream operations yet
              </span>
            ) : (
              history.map((op, idx) => (
                <div
                  key={idx}
                  className="flex items-center justify-between bg-slate-900/80 border border-slate-800 rounded-lg px-2 py-1 text-xs font-mono"
                >
                  <span className="text-slate-400">add({op.val})</span>
                  <span className="text-slate-600">→</span>
                  <span className="text-emerald-400 font-bold">{op.returnedKth}</span>
                </div>
              ))
            )}
          </div>

          <div className="bg-slate-900/80 rounded-lg p-1.5 border border-slate-800/60 text-xs flex justify-between shrink-0">
            <span className="text-[10px] text-slate-400">Target K:</span>
            <span className="font-mono font-bold text-indigo-300">{k}</span>
          </div>
        </div>
      </div>
    </div>
  );
};
