import React from 'react';
import { TopKFrequentStep } from '../../algorithms/topKFrequentIntuitive';
import { BarChart3, Layers, Trophy, CheckCircle2, Zap } from 'lucide-react';

interface TopKFrequentViewerProps {
  step: TopKFrequentStep;
  nums: number[];
}

export const TopKFrequentViewer: React.FC<TopKFrequentViewerProps> = ({ step, nums }) => {
  const { k, phase, currentIndex, currentNum, counts, buckets, currentFreq, result, isComplete } = step;

  const maxFreq = nums.length;
  // Bounded bucket display: show buckets from 1 up to maxFreq (or max observed freq + 1)
  const highestObservedFreq = Math.max(1, ...Object.values(counts));
  const bucketKeys = Array.from({ length: Math.min(maxFreq, Math.max(highestObservedFreq + 1, 3)) }, (_, i) => i + 1);

  return (
    <div className="flex-1 min-h-0 flex flex-col bg-slate-900/60 border border-slate-800 rounded-2xl p-3 shadow-xl overflow-hidden justify-between">
      {/* Top Banner */}
      <div className="bg-slate-950/70 border border-slate-800/80 rounded-xl p-2.5 flex items-center justify-between shrink-0">
        <div className="flex items-center gap-2">
          <span className="p-1.5 rounded-lg bg-amber-500/10 text-amber-400 border border-amber-500/20">
            <BarChart3 className="w-4 h-4" />
          </span>
          <div>
            <h3 className="text-xs font-semibold text-white tracking-wide">{step.headline}</h3>
            <p className="text-[11px] text-slate-400">{step.subtext}</p>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <span className="px-2 py-0.5 rounded-md bg-amber-500/10 border border-amber-500/20 text-amber-400 text-[11px] font-mono">
            Phase: {phase}
          </span>
          {isComplete && (
            <span className="px-2 py-0.5 rounded-md bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 text-[11px] font-semibold flex items-center gap-1">
              <CheckCircle2 className="w-3.5 h-3.5" /> Top {k} Found
            </span>
          )}
        </div>
      </div>

      {/* Main Visual Arena */}
      <div className="flex-1 min-h-0 flex flex-col justify-around gap-2 py-2 px-3">
        {/* Row 1: Input Array */}
        <div className="flex flex-col gap-1">
          <span className="text-[10px] uppercase font-mono font-bold tracking-wider text-slate-400">
            1. Input Array Scan:
          </span>
          <div className="flex items-center gap-1.5 overflow-x-auto pb-1">
            {nums.map((val, idx) => {
              const isCurrent = currentIndex === idx;
              return (
                <div
                  key={idx}
                  className={`w-9 h-9 rounded-lg flex items-center justify-center font-mono text-xs font-bold transition-all border ${
                    isCurrent
                      ? 'bg-amber-500 text-slate-950 border-amber-300 scale-110 shadow-lg shadow-amber-500/30'
                      : 'bg-slate-800/80 text-slate-300 border-slate-700/80'
                  }`}
                >
                  {val}
                </div>
              );
            })}
          </div>
        </div>

        {/* Row 2: Frequency Table & Bucket Shelf Side-by-side */}
        <div className="grid grid-cols-2 gap-3 min-h-0">
          {/* Frequencies Map */}
          <div className="bg-slate-950/60 border border-slate-800/80 rounded-xl p-2.5 flex flex-col gap-1.5 overflow-hidden">
            <span className="text-[10px] uppercase font-mono font-bold tracking-wider text-slate-400 flex items-center gap-1">
              <Layers className="w-3 h-3 text-cyan-400" /> Count Map: count[n]
            </span>
            <div className="flex flex-wrap gap-1.5 overflow-y-auto max-h-24">
              {Object.keys(counts).length === 0 ? (
                <span className="text-xs text-slate-500 italic">Empty map...</span>
              ) : (
                Object.entries(counts).map(([numStr, count]) => {
                  const n = Number(numStr);
                  const isCurrent = currentNum === n;
                  return (
                    <div
                      key={n}
                      className={`px-2 py-1 rounded-md border text-xs font-mono flex items-center gap-1.5 transition-all ${
                        isCurrent
                          ? 'bg-cyan-500/20 border-cyan-400 text-cyan-300 font-bold scale-105'
                          : 'bg-slate-900 border-slate-800 text-slate-300'
                      }`}
                    >
                      <span className="text-white">{n}</span>
                      <span className="text-slate-500">→</span>
                      <span className="text-cyan-400 font-bold">{count}x</span>
                    </div>
                  );
                })
              )}
            </div>
          </div>

          {/* Buckets */}
          <div className="bg-slate-950/60 border border-slate-800/80 rounded-xl p-2.5 flex flex-col gap-1.5 overflow-hidden">
            <span className="text-[10px] uppercase font-mono font-bold tracking-wider text-slate-400 flex items-center gap-1">
              <BarChart3 className="w-3 h-3 text-amber-400" /> Buckets by Frequency [idx = count]
            </span>
            <div className="flex items-center gap-2 overflow-x-auto max-h-24 pb-1">
              {bucketKeys.map((freq) => {
                const isScanningFreq = currentFreq === freq;
                const items = buckets[freq] || [];
                return (
                  <div
                    key={freq}
                    className={`flex flex-col items-center p-1.5 rounded-lg border min-w-[50px] transition-all ${
                      isScanningFreq
                        ? 'bg-amber-500/20 border-amber-400 scale-105'
                        : 'bg-slate-900/80 border-slate-800'
                    }`}
                  >
                    <span className="text-[9px] font-mono text-slate-400 font-bold">Freq {freq}</span>
                    <div className="flex flex-wrap gap-1 mt-1 justify-center">
                      {items.length === 0 ? (
                        <span className="text-[10px] text-slate-600">-</span>
                      ) : (
                        items.map((n, i) => (
                          <span
                            key={i}
                            className="w-5 h-5 rounded bg-amber-400/20 border border-amber-400/40 text-amber-300 font-mono text-[10px] flex items-center justify-center font-bold"
                          >
                            {n}
                          </span>
                        ))
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>

        {/* Row 3: Result Shelf */}
        <div className="bg-slate-950/60 border border-slate-800/80 rounded-xl p-2.5 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Trophy className="w-4 h-4 text-emerald-400" />
            <span className="text-xs font-mono font-bold text-slate-300">
              Top K Result Shelf (k = {k}):
            </span>
          </div>
          <div className="flex items-center gap-1.5">
            {result.length === 0 ? (
              <span className="text-xs text-slate-500 italic">Awaiting collection...</span>
            ) : (
              result.map((n, i) => (
                <div
                  key={i}
                  className="px-2.5 py-1 rounded-lg bg-emerald-500/20 border border-emerald-400/40 text-emerald-300 font-mono text-xs font-bold shadow-md shadow-emerald-500/10"
                >
                  {n}
                </div>
              ))
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
