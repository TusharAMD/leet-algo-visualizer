import React from 'react';
import { MedianStreamStep } from '../../algorithms/findMedianStreamIntuitive';
import { Scale, CheckCircle2, ArrowRight, Layers, ArrowLeftRight, Award } from 'lucide-react';

interface FindMedianViewerProps {
  step: MedianStreamStep;
}

export const FindMedianViewer: React.FC<FindMedianViewerProps> = ({ step }) => {
  const {
    stream,
    currentIndex,
    smallMaxHeap,
    largeMinHeap,
    median,
    phase,
    headline,
    subtext,
    isComplete,
    stepIndex,
    totalSteps
  } = step;

  const totalCount = smallMaxHeap.length + largeMinHeap.length;
  const isOdd = totalCount % 2 === 1;

  return (
    <div className="flex-1 min-h-0 flex flex-col bg-slate-900/60 border border-slate-800 rounded-2xl p-3 shadow-xl overflow-hidden justify-between">
      {/* Top Banner */}
      <div className="bg-slate-950/70 border border-slate-800/80 rounded-xl p-2.5 flex items-center justify-between shrink-0">
        <div className="flex items-center gap-2">
          <span className="p-1.5 rounded-lg bg-indigo-500/10 text-indigo-400 border border-indigo-500/20">
            <Scale className="w-4 h-4" />
          </span>
          <div>
            <h3 className="text-xs font-semibold text-white tracking-wide">{headline}</h3>
            <p className="text-[11px] text-slate-400">{subtext}</p>
          </div>
        </div>
        <div className="flex items-center gap-2">
          {median !== null && (
            <span className="px-2.5 py-0.5 rounded-md bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 text-xs font-mono font-bold flex items-center gap-1">
              <CheckCircle2 className="w-3.5 h-3.5" /> Median = {median}
            </span>
          )}
          <span className="px-2 py-0.5 rounded-md bg-indigo-500/10 border border-indigo-500/20 text-indigo-400 text-[11px] font-mono">
            Step {stepIndex + 1} / {totalSteps}
          </span>
        </div>
      </div>

      {/* Stream Row */}
      <div className="bg-slate-950/50 border border-slate-800/70 rounded-xl p-2 shrink-0">
        <div className="text-[10px] uppercase font-semibold text-slate-400 mb-1.5 flex items-center justify-between">
          <span>Data Stream (`stream`):</span>
          <span className="text-slate-500 font-mono">Processed {currentIndex + 1} of {stream.length}</span>
        </div>
        <div className="flex items-center gap-1.5 flex-wrap">
          {stream.map((val, idx) => {
            const isProcessed = idx < currentIndex;
            const isCurrent = idx === currentIndex;
            return (
              <div
                key={idx}
                className={`relative px-2.5 py-1 rounded-lg text-xs font-mono font-bold transition-all border ${
                  isCurrent
                    ? 'bg-amber-500/20 border-amber-400 text-amber-200 ring-2 ring-amber-400/50 scale-105'
                    : isProcessed
                    ? 'bg-slate-900 border-slate-800 text-slate-500 opacity-60'
                    : 'bg-slate-850 border-slate-700/60 text-slate-300'
                }`}
              >
                {val}
                {isCurrent && (
                  <span className="absolute -top-2 left-1/2 -translate-x-1/2 text-[8px] bg-amber-500 text-slate-950 px-1 rounded-full font-bold">
                    add
                  </span>
                )}
              </div>
            );
          })}
        </div>
      </div>

      {/* Center Arena: Two Heaps Balance */}
      <div className="flex-1 min-h-0 grid grid-cols-1 md:grid-cols-12 gap-3 py-1 px-1">
        {/* Left: Max-Heap (Small / Lower Half) */}
        <div className="md:col-span-5 bg-slate-950/60 border border-slate-800 rounded-xl p-2.5 flex flex-col justify-between">
          <div className="flex items-center justify-between border-b border-slate-800/70 pb-1.5 shrink-0">
            <span className="text-xs font-semibold text-emerald-400 flex items-center gap-1.5">
              <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
              Small (Max-Heap)
            </span>
            <span className="text-[10px] font-mono text-slate-400 bg-slate-900 px-1.5 py-0.5 rounded border border-slate-800">
              Size: {smallMaxHeap.length}
            </span>
          </div>

          <div className="flex-1 flex flex-col items-center justify-center py-2">
            {smallMaxHeap.length === 0 ? (
              <span className="text-slate-600 text-xs italic">Empty</span>
            ) : (
              <div className="flex flex-col items-center gap-2">
                <div className="flex flex-col items-center">
                  <span className="text-[9px] text-emerald-300 font-semibold mb-0.5">
                    Root (Max of Lower):
                  </span>
                  <div className="w-13 h-13 px-3 py-1.5 rounded-xl bg-emerald-500/20 border-2 border-emerald-400 text-white font-mono font-bold text-base flex flex-col items-center shadow-lg shadow-emerald-500/20">
                    <span>{smallMaxHeap[0]}</span>
                    <span className="text-[8px] text-emerald-300">small[0]</span>
                  </div>
                </div>

                {smallMaxHeap.length > 1 && (
                  <div className="flex items-center gap-1.5 flex-wrap justify-center">
                    {smallMaxHeap.slice(1).map((val, idx) => (
                      <div
                        key={idx}
                        className="px-2 py-0.5 rounded bg-slate-850 border border-slate-700 text-slate-300 text-xs font-mono"
                      >
                        {val}
                      </div>
                    ))}
                  </div>
                )}
              </div>
            )}
          </div>

          <div className="text-[10px] text-slate-500 text-center shrink-0">
            Contains smaller half of all numbers
          </div>
        </div>

        {/* Center: Median Fulcrum */}
        <div className="md:col-span-2 flex flex-col items-center justify-center gap-2 bg-slate-950/80 border border-slate-800 rounded-xl p-2 text-center">
          <Scale className="w-6 h-6 text-indigo-400" />
          <div className="text-[10px] uppercase font-bold text-slate-400">Current Median</div>
          <div className="text-xl font-bold font-mono text-emerald-400 bg-emerald-500/10 border border-emerald-500/30 px-3 py-1 rounded-xl">
            {median !== null ? median : '—'}
          </div>
          <span className="text-[9px] text-slate-500">
            {totalCount === 0
              ? 'Awaiting input'
              : isOdd
              ? 'Odd: small[0]'
              : 'Even: (small[0]+large[0])/2'}
          </span>
        </div>

        {/* Right: Min-Heap (Large / Upper Half) */}
        <div className="md:col-span-5 bg-slate-950/60 border border-slate-800 rounded-xl p-2.5 flex flex-col justify-between">
          <div className="flex items-center justify-between border-b border-slate-800/70 pb-1.5 shrink-0">
            <span className="text-xs font-semibold text-cyan-400 flex items-center gap-1.5">
              <span className="w-2 h-2 rounded-full bg-cyan-400 animate-pulse" />
              Large (Min-Heap)
            </span>
            <span className="text-[10px] font-mono text-slate-400 bg-slate-900 px-1.5 py-0.5 rounded border border-slate-800">
              Size: {largeMinHeap.length}
            </span>
          </div>

          <div className="flex-1 flex flex-col items-center justify-center py-2">
            {largeMinHeap.length === 0 ? (
              <span className="text-slate-600 text-xs italic">Empty</span>
            ) : (
              <div className="flex flex-col items-center gap-2">
                <div className="flex flex-col items-center">
                  <span className="text-[9px] text-cyan-300 font-semibold mb-0.5">
                    Root (Min of Upper):
                  </span>
                  <div className="w-13 h-13 px-3 py-1.5 rounded-xl bg-cyan-500/20 border-2 border-cyan-400 text-white font-mono font-bold text-base flex flex-col items-center shadow-lg shadow-cyan-500/20">
                    <span>{largeMinHeap[0]}</span>
                    <span className="text-[8px] text-cyan-300">large[0]</span>
                  </div>
                </div>

                {largeMinHeap.length > 1 && (
                  <div className="flex items-center gap-1.5 flex-wrap justify-center">
                    {largeMinHeap.slice(1).map((val, idx) => (
                      <div
                        key={idx}
                        className="px-2 py-0.5 rounded bg-slate-850 border border-slate-700 text-slate-300 text-xs font-mono"
                      >
                        {val}
                      </div>
                    ))}
                  </div>
                )}
              </div>
            )}
          </div>

          <div className="text-[10px] text-slate-500 text-center shrink-0">
            Contains larger half of all numbers
          </div>
        </div>
      </div>
    </div>
  );
};
