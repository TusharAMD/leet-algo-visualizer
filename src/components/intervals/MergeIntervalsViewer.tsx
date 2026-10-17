import React from 'react';
import type { MergeIntervalsStep, Interval } from '../../algorithms/mergeIntervalsIntuitive';
import { HelpCircle, CheckCircle2 } from 'lucide-react';

interface MergeIntervalsViewerProps {
  step: MergeIntervalsStep;
  rawIntervals: Interval[];
}

export const MergeIntervalsViewer: React.FC<MergeIntervalsViewerProps> = ({
  step,
  rawIntervals,
}) => {
  const allPoints: number[] = [0];
  rawIntervals.forEach(([s, e]) => allPoints.push(s, e));
  const minCoord = Math.min(0, ...allPoints);
  const maxCoord = Math.max(12, ...allPoints) + 1;
  const range = Math.max(1, maxCoord - minCoord);

  const getPercentLeft = (val: number) => {
    return `${Math.max(2, Math.min(96, ((val - minCoord) / range) * 90 + 5))}%`;
  };

  const getPercentWidth = (start: number, end: number) => {
    const w = ((end - start) / range) * 90;
    return `${Math.max(4, Math.min(95, w))}%`;
  };

  return (
    <div className="flex flex-col h-full gap-3 p-4 select-none">
      {/* Top Status & Variable Badges */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
        <div className="bg-slate-900 border border-slate-800 rounded-xl p-3 flex flex-col justify-center">
          <span className="text-xs text-slate-400 font-medium">Examining Interval</span>
          <span className="text-base font-mono font-bold text-sky-400">
            {step.currentInterval ? `[${step.currentInterval[0]}, ${step.currentInterval[1]}]` : '—'}
          </span>
        </div>
        <div className="bg-slate-900 border border-slate-800 rounded-xl p-3 flex flex-col justify-center">
          <span className="text-xs text-slate-400 font-medium">Last Merged Tail</span>
          <span className="text-base font-mono font-bold text-amber-300">
            {step.lastMerged ? `[${step.lastMerged[0]}, ${step.lastMerged[1]}]` : '—'}
          </span>
        </div>
        <div className="bg-slate-900 border border-slate-800 rounded-xl p-3 flex flex-col justify-center">
          <span className="text-xs text-slate-400 font-medium">Overlap State</span>
          <span
            className={`text-sm font-semibold flex items-center gap-1 ${
              step.isOverlap ? 'text-amber-400' : 'text-emerald-400'
            }`}
          >
            {step.isOverlap ? 'Overlap (Merge & Extend)' : 'Disjoint (New Boundary)'}
          </span>
        </div>
        <div className="bg-slate-900 border border-slate-800 rounded-xl p-3 flex flex-col justify-center">
          <span className="text-xs text-slate-400 font-medium">Merged Output Count</span>
          <span className="text-2xl font-mono font-black text-emerald-400">
            {step.result.length}
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
              if (maxCoord > 16 && val % 2 !== 0 && val !== maxCoord) return null;
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

          {/* Track 1: Sorted Input Intervals */}
          <div className="flex flex-col gap-1.5">
            <div className="text-xs font-semibold text-slate-400 uppercase tracking-wider flex items-center justify-between">
              <span>Sorted Input Stream</span>
              <span className="text-[11px] text-slate-500 font-normal">
                {step.intervals.length} intervals sorted by start
              </span>
            </div>
            <div className="relative h-12 bg-slate-950/70 border border-slate-800 rounded-xl flex items-center px-2 overflow-hidden">
              {step.intervals.map(([s, e], idx) => {
                const isCurrent = idx === step.currentIndex;
                const isProcessed = idx < step.currentIndex;

                let colorClasses = 'bg-slate-800/90 border-slate-600 text-slate-200';
                if (isCurrent) {
                  colorClasses = step.isOverlap
                    ? 'bg-amber-600 border-amber-300 text-white shadow-lg shadow-amber-500/30 scale-105 z-10'
                    : 'bg-sky-600 border-sky-300 text-white shadow-lg shadow-sky-500/30 scale-105 z-10';
                } else if (isProcessed) {
                  colorClasses = 'bg-slate-900 border-slate-800 text-slate-500 opacity-60';
                }

                return (
                  <div
                    key={idx}
                    className={`absolute h-8 rounded-lg border flex items-center justify-center font-mono text-xs font-bold transition-all duration-300 ${colorClasses}`}
                    style={{
                      left: getPercentLeft(s),
                      width: getPercentWidth(s, e),
                    }}
                  >
                    [{s},{e}]
                  </div>
                );
              })}
            </div>
          </div>

          {/* Track 2: Merged Result Intervals */}
          <div className="flex flex-col gap-1.5">
            <div className="text-xs font-semibold text-emerald-400 uppercase tracking-wider flex items-center justify-between">
              <span>Merged Non-Overlapping Intervals</span>
              <span className="text-[11px] font-mono text-emerald-300">
                {step.result.map((int) => `[${int[0]},${int[1]}]`).join(', ')}
              </span>
            </div>
            <div className="relative h-12 bg-slate-950/70 border border-emerald-900/40 rounded-xl flex items-center px-2 overflow-hidden">
              {step.result.map(([s, e], idx) => {
                const isLatest = idx === step.result.length - 1 && step.currentIndex < step.intervals.length;
                return (
                  <div
                    key={idx}
                    className={`absolute h-8 rounded-lg font-mono text-xs font-bold flex items-center justify-center transition-all duration-300 ${
                      isLatest
                        ? 'bg-emerald-600 border border-emerald-300 text-white shadow-md shadow-emerald-500/30'
                        : 'bg-emerald-950/80 border border-emerald-500/60 text-emerald-200'
                    }`}
                    style={{
                      left: getPercentLeft(s),
                      width: getPercentWidth(s, e),
                    }}
                  >
                    [{s},{e}]
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
