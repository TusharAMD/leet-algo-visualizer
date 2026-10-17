import React from 'react';
import type { MinIntervalQueriesStep, Interval } from '../../algorithms/minIntervalQueriesIntuitive';
import { HelpCircle, CheckCircle2 } from 'lucide-react';

interface MinIntervalQueriesViewerProps {
  step: MinIntervalQueriesStep;
  rawIntervals: Interval[];
  rawQueries: number[];
}

export const MinIntervalQueriesViewer: React.FC<MinIntervalQueriesViewerProps> = ({
  step,
  rawIntervals,
  rawQueries,
}) => {
  const allPoints: number[] = [0, ...rawQueries];
  rawIntervals.forEach(([s, e]) => allPoints.push(s, e));
  const minCoord = Math.min(0, ...allPoints);
  const maxCoord = Math.max(10, ...allPoints) + 1;
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
          <span className="text-xs text-slate-400 font-medium">Inspecting Query</span>
          <span className="text-base font-mono font-bold text-sky-400">
            {step.currentQuery !== null ? `q = ${step.currentQuery}` : '—'}
          </span>
        </div>
        <div className="bg-slate-900 border border-slate-800 rounded-xl p-3 flex flex-col justify-center">
          <span className="text-xs text-slate-400 font-medium">Min Enclosing Length</span>
          <span className="text-2xl font-mono font-black text-amber-300">
            {step.activeAnswer !== null ? (step.activeAnswer >= 0 ? step.activeAnswer : 'None (-1)') : '—'}
          </span>
        </div>
        <div className="bg-slate-900 border border-slate-800 rounded-xl p-3 flex flex-col justify-center">
          <span className="text-xs text-slate-400 font-medium">Active Min-Heap Items</span>
          <span className="text-2xl font-mono font-black text-indigo-400">
            {step.heap.length}
          </span>
        </div>
        <div className="bg-slate-900 border border-slate-800 rounded-xl p-3 flex flex-col justify-center">
          <span className="text-xs text-slate-400 font-medium">Progress</span>
          <span className="text-sm font-mono font-bold text-emerald-400">
            {Object.keys(step.answersMap).length} / {rawQueries.length} Queries
          </span>
        </div>
      </div>

      {/* Main Coordinate Canvas & Min Heap */}
      <div className="flex-1 bg-slate-900/60 border border-slate-800 rounded-xl p-5 flex flex-col justify-between gap-4 relative overflow-hidden">
        <div className="flex flex-col gap-5 w-full">
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

          {/* Intervals & Query Pin */}
          <div className="flex flex-col gap-1.5">
            <div className="text-xs font-semibold text-slate-400 uppercase tracking-wider flex items-center justify-between">
              <span>Intervals with Query Pin</span>
              <span className="text-[11px] font-mono text-slate-400">
                Sorted stream index i = {step.intervalsPointer}
              </span>
            </div>
            <div className="relative h-28 bg-slate-950/70 border border-slate-800 rounded-xl flex items-center px-2 overflow-hidden">
              {/* Query Pin */}
              {step.currentQuery !== null && (
                <div
                  className="absolute top-0 bottom-0 w-1 bg-amber-400 z-30 flex flex-col items-center transition-all duration-300"
                  style={{ left: getPercentLeft(step.currentQuery) }}
                >
                  <span className="absolute -top-1 px-1.5 py-0.5 rounded bg-amber-400 text-slate-950 font-mono text-[10px] font-black -translate-x-1/2 shadow-lg">
                    q={step.currentQuery}
                  </span>
                </div>
              )}

              {step.intervals.map(([s, e], idx) => {
                const len = e - s + 1;
                const isEnclosing = step.currentQuery !== null && s <= step.currentQuery && e >= step.currentQuery;
                const isBest = isEnclosing && step.heap[0] && step.heap[0].left === s && step.heap[0].right === e;

                let colorClasses = 'bg-slate-800/80 border-slate-700 text-slate-400 opacity-60';
                if (isBest) {
                  colorClasses = 'bg-amber-600 border-amber-300 text-white shadow-lg shadow-amber-500/30 scale-105 z-20';
                } else if (isEnclosing) {
                  colorClasses = 'bg-indigo-900/80 border-indigo-400 text-indigo-200 z-10';
                }

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
                    <span>[{s},{e}] (L={len})</span>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Active Min-Heap Visual */}
          <div className="flex flex-col gap-1.5">
            <div className="text-xs font-semibold text-indigo-300 uppercase tracking-wider flex items-center justify-between">
              <span>Active Min-Heap (Ordered by Interval Length)</span>
              <span className="text-[11px] font-mono text-indigo-400">Top element answers query</span>
            </div>
            <div className="flex items-center gap-2 overflow-x-auto py-1">
              {step.heap.length === 0 ? (
                <div className="text-xs text-slate-500 italic px-3 py-2 border border-slate-800 rounded-lg">
                  Heap is empty (no intervals enclose current query)
                </div>
              ) : (
                step.heap.map((item, idx) => (
                  <div
                    key={idx}
                    className={`px-3 py-2 rounded-xl border flex flex-col items-center gap-0.5 shrink-0 transition-all ${
                      idx === 0
                        ? 'bg-amber-500/20 border-amber-400 text-amber-200 shadow-md shadow-amber-500/20'
                        : 'bg-slate-900 border-slate-800 text-slate-300'
                    }`}
                  >
                    <span className="text-xs font-bold font-mono">
                      Length: {item.size} {idx === 0 && '👑 Top'}
                    </span>
                    <span className="text-[10px] text-slate-400 font-mono">
                      [{item.left}, {item.right}] (ends at {item.right})
                    </span>
                  </div>
                ))
              )}
            </div>
          </div>
        </div>

        {/* Bottom Explanation Banner */}
        <div className="w-full bg-slate-950/80 border border-slate-800/80 rounded-xl px-4 py-2.5 text-xs text-slate-300 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <HelpCircle className="w-4 h-4 text-indigo-400 shrink-0" />
            <span>{step.explanation}</span>
          </div>
          {step.queryIndex >= rawQueries.length && (
            <span className="text-emerald-400 font-semibold flex items-center gap-1 shrink-0">
              <CheckCircle2 className="w-4 h-4" /> Finished
            </span>
          )}
        </div>
      </div>
    </div>
  );
};
