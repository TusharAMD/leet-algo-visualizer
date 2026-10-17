import React from 'react';
import type { InsertIntervalStep, Interval } from '../../algorithms/insertIntervalIntuitive';
import { HelpCircle, CheckCircle2, ArrowRight } from 'lucide-react';

interface InsertIntervalViewerProps {
  step: InsertIntervalStep;
  originalIntervals: Interval[];
  initialNewInterval: Interval;
}

export const InsertIntervalViewer: React.FC<InsertIntervalViewerProps> = ({
  step,
  originalIntervals,
  initialNewInterval,
}) => {
  // Compute min and max coordinates across all intervals for normalized axis
  const allPoints: number[] = [0, initialNewInterval[0], initialNewInterval[1]];
  originalIntervals.forEach(([s, e]) => {
    allPoints.push(s, e);
  });
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
          <span className="text-xs text-slate-400 font-medium">Inspecting Index</span>
          <span className="text-base font-mono font-bold text-sky-400">
            {step.currentIndex >= 0 && step.currentIndex < originalIntervals.length
              ? `i = ${step.currentIndex} [${originalIntervals[step.currentIndex][0]}, ${originalIntervals[step.currentIndex][1]}]`
              : step.phase === 'complete'
              ? 'Complete'
              : '—'}
          </span>
        </div>
        <div className="bg-slate-900 border border-slate-800 rounded-xl p-3 flex flex-col justify-center">
          <span className="text-xs text-slate-400 font-medium">Working New Interval</span>
          <span className="text-base font-mono font-bold text-amber-300">
            [{step.workingNewInterval[0]}, {step.workingNewInterval[1]}]
          </span>
        </div>
        <div className="bg-slate-900 border border-slate-800 rounded-xl p-3 flex flex-col justify-center">
          <span className="text-xs text-slate-400 font-medium">Phase</span>
          <span className="text-sm font-semibold capitalize text-indigo-300 flex items-center gap-1">
            {step.phase === 'init' && '1. Initialization'}
            {step.phase === 'before' && '2. Left Disjoint (end < start)'}
            {step.phase === 'merge' && '3. Merging Overlap'}
            {step.phase === 'insert_new' && '4. Insert Merged'}
            {step.phase === 'after' && '5. Right Disjoint (start > end)'}
            {step.phase === 'complete' && '6. Done'}
          </span>
        </div>
        <div className="bg-slate-900 border border-slate-800 rounded-xl p-3 flex flex-col justify-center">
          <span className="text-xs text-slate-400 font-medium">Result Size</span>
          <span className="text-2xl font-mono font-black text-emerald-400">
            {step.result.length}
          </span>
        </div>
      </div>

      {/* Main Interval Timeline Canvas */}
      <div className="flex-1 bg-slate-900/60 border border-slate-800 rounded-xl p-5 flex flex-col justify-between gap-5 relative overflow-hidden">
        {/* Timeline Tracks */}
        <div className="flex flex-col gap-5 w-full">
          {/* Axis Header */}
          <div className="relative h-6 border-b border-slate-800/80 w-full">
            {Array.from({ length: maxCoord - minCoord + 1 }, (_, idx) => {
              const val = minCoord + idx;
              if (maxCoord > 15 && val % 2 !== 0 && val !== maxCoord) return null;
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

          {/* Track 1: Original Intervals */}
          <div className="flex flex-col gap-1.5">
            <div className="text-xs font-semibold text-slate-400 uppercase tracking-wider flex items-center justify-between">
              <span>Original Intervals</span>
              <span className="text-[11px] text-slate-500 font-normal">
                {originalIntervals.length} interval{originalIntervals.length !== 1 ? 's' : ''}
              </span>
            </div>
            <div className="relative h-12 bg-slate-950/70 border border-slate-800 rounded-xl flex items-center px-2 overflow-hidden">
              {originalIntervals.map(([s, e], idx) => {
                const isCurrent = idx === step.currentIndex;
                const isMerged = step.mergedIndices.includes(idx);
                const isPassed = idx < step.currentIndex && !isMerged;

                let colorClasses = 'bg-slate-800/90 border-slate-600 text-slate-200';
                if (isMerged) {
                  colorClasses = 'bg-purple-950/70 border-purple-500 text-purple-200 line-through opacity-60';
                } else if (isCurrent) {
                  colorClasses = 'bg-sky-600 border-sky-300 text-white shadow-lg shadow-sky-500/30 scale-105 z-10';
                } else if (isPassed) {
                  colorClasses = 'bg-emerald-950/50 border-emerald-600/60 text-emerald-300';
                }

                return (
                  <div
                    key={idx}
                    className={`absolute h-8 rounded-lg border flex items-center justify-center font-mono text-xs font-bold transition-all duration-300 ${colorClasses}`}
                    style={{
                      left: getPercentLeft(s),
                      width: getPercentWidth(s, e),
                    }}
                    title={`Interval [${s}, ${e}]`}
                  >
                    [{s},{e}]
                  </div>
                );
              })}
            </div>
          </div>

          {/* Track 2: Working New Interval */}
          <div className="flex flex-col gap-1.5">
            <div className="text-xs font-semibold text-amber-400 uppercase tracking-wider flex items-center justify-between">
              <span>Inserting Interval (Expanding on Overlaps)</span>
              <span className="text-[11px] font-mono text-amber-300">
                Initial: [{initialNewInterval[0]}, {initialNewInterval[1]}]
              </span>
            </div>
            <div className="relative h-12 bg-slate-950/70 border border-amber-900/40 rounded-xl flex items-center px-2 overflow-hidden">
              <div
                className="absolute h-8 rounded-lg bg-gradient-to-r from-amber-600 to-amber-500 border border-amber-300 text-slate-950 font-mono text-xs font-bold flex items-center justify-center shadow-lg shadow-amber-500/20 transition-all duration-300 z-10"
                style={{
                  left: getPercentLeft(step.workingNewInterval[0]),
                  width: getPercentWidth(step.workingNewInterval[0], step.workingNewInterval[1]),
                }}
              >
                [{step.workingNewInterval[0]}, {step.workingNewInterval[1]}]
              </div>
            </div>
          </div>

          {/* Track 3: Result Intervals */}
          <div className="flex flex-col gap-1.5">
            <div className="text-xs font-semibold text-emerald-400 uppercase tracking-wider flex items-center justify-between">
              <span>Result Intervals</span>
              <span className="text-[11px] font-mono text-emerald-300">
                {step.result.map((int) => `[${int[0]},${int[1]}]`).join(', ') || '[]'}
              </span>
            </div>
            <div className="relative h-12 bg-slate-950/70 border border-emerald-900/40 rounded-xl flex items-center px-2 overflow-hidden">
              {step.result.map(([s, e], idx) => (
                <div
                  key={idx}
                  className="absolute h-8 rounded-lg bg-emerald-900/80 border border-emerald-400 text-emerald-100 font-mono text-xs font-bold flex items-center justify-center shadow-sm transition-all duration-300"
                  style={{
                    left: getPercentLeft(s),
                    width: getPercentWidth(s, e),
                  }}
                >
                  [{s},{e}]
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Bottom Explanation Banner */}
        <div className="w-full bg-slate-950/80 border border-slate-800/80 rounded-xl px-4 py-2.5 text-xs text-slate-300 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <HelpCircle className="w-4 h-4 text-indigo-400 shrink-0" />
            <span>{step.explanation}</span>
          </div>
          {step.phase === 'complete' && (
            <span className="text-emerald-400 font-semibold flex items-center gap-1 shrink-0">
              <CheckCircle2 className="w-4 h-4" /> Ready
            </span>
          )}
        </div>
      </div>
    </div>
  );
};
