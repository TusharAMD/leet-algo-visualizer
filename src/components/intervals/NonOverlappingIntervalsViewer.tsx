import React from 'react';
import type { NonOverlappingStep, Interval } from '../../algorithms/nonOverlappingIntervalsIntuitive';
import { HelpCircle, Trash2, CheckCircle2 } from 'lucide-react';

interface NonOverlappingIntervalsViewerProps {
  step: NonOverlappingStep;
  rawIntervals: Interval[];
}

export const NonOverlappingIntervalsViewer: React.FC<NonOverlappingIntervalsViewerProps> = ({
  step,
  rawIntervals,
}) => {
  const allPoints: number[] = [0];
  rawIntervals.forEach(([s, e]) => allPoints.push(s, e));
  const minCoord = Math.min(0, ...allPoints);
  const maxCoord = Math.max(8, ...allPoints) + 1;
  const range = Math.max(1, maxCoord - minCoord);

  const getPercentLeft = (val: number) => {
    return `${Math.max(2, Math.min(96, ((val - minCoord) / range) * 90 + 5))}%`;
  };

  const getPercentWidth = (start: number, end: number) => {
    const w = ((end - start) / range) * 90;
    return `${Math.max(5, Math.min(95, w))}%`;
  };

  return (
    <div className="flex flex-col h-full gap-3 p-4 select-none">
      {/* Top Status & Variable Badges */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
        <div className="bg-slate-900 border border-slate-800 rounded-xl p-3 flex flex-col justify-center">
          <span className="text-xs text-slate-400 font-medium">Current Interval</span>
          <span className="text-base font-mono font-bold text-sky-400">
            {step.currentInterval ? `[${step.currentInterval[0]}, ${step.currentInterval[1]}]` : '—'}
          </span>
        </div>
        <div className="bg-slate-900 border border-slate-800 rounded-xl p-3 flex flex-col justify-center">
          <span className="text-xs text-slate-400 font-medium">Prev Horizon End</span>
          <span className="text-base font-mono font-bold text-indigo-300">
            {step.prevEnd}
          </span>
        </div>
        <div className="bg-slate-900 border border-slate-800 rounded-xl p-3 flex flex-col justify-center">
          <span className="text-xs text-slate-400 font-medium">Conflict State</span>
          <span
            className={`text-sm font-semibold flex items-center gap-1 ${
              step.isConflict ? 'text-rose-400' : 'text-emerald-400'
            }`}
          >
            {step.isConflict ? 'Conflict (Discard Larger)' : 'Valid Non-Overlap'}
          </span>
        </div>
        <div className="bg-slate-900 border border-slate-800 rounded-xl p-3 flex flex-col justify-center">
          <span className="text-xs text-slate-400 font-medium">Removals (res)</span>
          <span className="text-2xl font-mono font-black text-rose-400">
            {step.removalsCount}
          </span>
        </div>
      </div>

      {/* Main Coordinate Canvas */}
      <div className="flex-1 bg-slate-900/60 border border-slate-800 rounded-xl p-5 flex flex-col justify-between gap-5 relative overflow-hidden">
        <div className="flex flex-col gap-6 w-full">
          {/* Axis Ticks */}
          <div className="relative h-6 border-b border-slate-800/80 w-full">
            {Array.from({ length: maxCoord - minCoord + 1 }, (_, idx) => {
              const val = minCoord + idx;
              return (
                <div
                  key={val}
                  className="absolute flex flex-col items-center -translate-x-1/2"
                  style={{ left: getPercentLeft(val) }}
                >
                  <div className="w-0.5 h-2 bg-slate-700" />
                  <span className="text-[10px] font-mono text-slate-400">{val}</span>
                </div>
              );
            })}
          </div>

          {/* Sorted Intervals Track with Discard / Keep Badges */}
          <div className="flex flex-col gap-2">
            <div className="text-xs font-semibold text-slate-400 uppercase tracking-wider flex items-center justify-between">
              <span>Sorted Intervals with Greedy Pruning Decisions</span>
              <span className="text-[11px] text-slate-500 font-normal">
                {step.keptIndices.length} kept, {step.removedIndices.length} removed
              </span>
            </div>
            <div className="relative h-28 bg-slate-950/70 border border-slate-800 rounded-xl flex items-center px-2 overflow-hidden">
              {/* Vertical line indicator at prevEnd */}
              <div
                className="absolute top-0 bottom-0 w-0.5 bg-indigo-500/60 z-20 transition-all duration-300"
                style={{ left: getPercentLeft(step.prevEnd) }}
              >
                <span className="absolute -top-1 -right-8 text-[9px] font-mono bg-indigo-900 text-indigo-200 px-1 rounded">
                  end={step.prevEnd}
                </span>
              </div>

              {step.intervals.map(([s, e], idx) => {
                const isCurrent = idx === step.currentIndex;
                const isRemoved = step.removedIndices.includes(idx);
                const isKept = step.keptIndices.includes(idx);

                let colorClasses = 'bg-slate-800/90 border-slate-600 text-slate-300';
                if (isRemoved) {
                  colorClasses = 'bg-rose-950/70 border-rose-500 text-rose-300 line-through opacity-50';
                } else if (isCurrent) {
                  colorClasses = step.isConflict
                    ? 'bg-rose-600 border-rose-300 text-white shadow-lg shadow-rose-500/30 scale-105 z-10'
                    : 'bg-sky-600 border-sky-300 text-white shadow-lg shadow-sky-500/30 scale-105 z-10';
                } else if (isKept) {
                  colorClasses = 'bg-emerald-900/80 border-emerald-400 text-emerald-200 shadow-sm';
                }

                // Stagger intervals slightly based on index to avoid total visual occlusion
                const topOffset = (idx % 3) * 32 + 8;

                return (
                  <div
                    key={idx}
                    className={`absolute h-7 rounded-lg border font-mono text-xs font-bold flex items-center justify-center transition-all duration-300 ${colorClasses}`}
                    style={{
                      left: getPercentLeft(s),
                      width: getPercentWidth(s, e),
                      top: `${topOffset}px`,
                    }}
                  >
                    <span>[{s},{e}]</span>
                    {isRemoved && <Trash2 className="w-3 h-3 ml-1 text-rose-400 inline" />}
                  </div>
                );
              })}
            </div>
          </div>

          {/* Kept Non-overlapping Subsequence */}
          <div className="flex flex-col gap-1.5">
            <div className="text-xs font-semibold text-emerald-400 uppercase tracking-wider flex items-center justify-between">
              <span>Optimal Non-Overlapping Set ({step.keptIndices.length})</span>
              <span className="text-[11px] font-mono text-emerald-300">
                {step.keptIndices.map((i) => `[${step.intervals[i]?.[0]},${step.intervals[i]?.[1]}]`).join(', ')}
              </span>
            </div>
            <div className="relative h-12 bg-slate-950/70 border border-emerald-900/40 rounded-xl flex items-center px-2 overflow-hidden">
              {step.keptIndices.map((i) => {
                const int = step.intervals[i];
                if (!int) return null;
                return (
                  <div
                    key={i}
                    className="absolute h-8 rounded-lg bg-emerald-950/80 border border-emerald-400 text-emerald-200 font-mono text-xs font-bold flex items-center justify-center shadow-sm transition-all duration-300"
                    style={{
                      left: getPercentLeft(int[0]),
                      width: getPercentWidth(int[0], int[1]),
                    }}
                  >
                    [{int[0]},{int[1]}]
                  </div>
                );
              })}
            </div>
          </div>
        </div>

        {/* Bottom Explanation Banner */}
        <div className="w-full bg-slate-950/80 border border-slate-800/80 rounded-xl px-4 py-2.5 text-xs text-slate-300 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <HelpCircle className="w-4 h-4 text-indigo-400 shrink-0" />
            <span>{step.explanation}</span>
          </div>
          {step.currentIndex >= step.intervals.length && (
            <span className="text-emerald-400 font-semibold flex items-center gap-1 shrink-0">
              <CheckCircle2 className="w-4 h-4" /> Ready
            </span>
          )}
        </div>
      </div>
    </div>
  );
};
