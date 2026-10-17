import React from 'react';
import { SwimInWaterStep } from '../../algorithms/swimInRisingWaterIntuitive';
import { Waves, CheckCircle2, Layers, Droplets, Compass } from 'lucide-react';

interface SwimInRisingWaterViewerProps {
  step: SwimInWaterStep;
}

export const SwimInRisingWaterViewer: React.FC<SwimInRisingWaterViewerProps> = ({ step }) => {
  const {
    grid,
    visited,
    currentCell,
    currentTime,
    heap,
    path,
    headline,
    subtext,
    isComplete,
    result,
    stepIndex,
    totalSteps
  } = step;

  const N = grid.length;

  const isVisited = (r: number, c: number) => {
    return visited.some(([vr, vc]) => vr === r && vc === c);
  };

  const isCurrent = (r: number, c: number) => {
    return currentCell !== null && currentCell[0] === r && currentCell[1] === c;
  };

  const isInPath = (r: number, c: number) => {
    return path.some(([pr, pc]) => pr === r && pc === c);
  };

  return (
    <div className="flex-1 min-h-0 flex flex-col bg-slate-900/60 border border-slate-800 rounded-2xl p-3 shadow-xl overflow-hidden justify-between">
      {/* Top Banner */}
      <div className="bg-slate-950/70 border border-slate-800/80 rounded-xl p-2.5 flex items-center justify-between shrink-0">
        <div className="flex items-center gap-2">
          <span className="p-1.5 rounded-lg bg-sky-500/10 text-sky-400 border border-sky-500/20">
            <Waves className="w-4 h-4" />
          </span>
          <div>
            <h3 className="text-xs font-semibold text-white tracking-wide">{headline}</h3>
            <p className="text-[11px] text-slate-400">{subtext}</p>
          </div>
        </div>
        <div className="flex items-center gap-2">
          {isComplete ? (
            <span className="px-2.5 py-0.5 rounded-md bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 text-xs font-mono font-bold flex items-center gap-1">
              <CheckCircle2 className="w-3.5 h-3.5" /> Minimum Time: {result}
            </span>
          ) : (
            <span className="px-2 py-0.5 rounded-md bg-indigo-500/10 border border-indigo-500/20 text-indigo-400 text-[11px] font-mono">
              Step {stepIndex + 1} / {totalSteps}
            </span>
          )}
        </div>
      </div>

      {/* Main Arena */}
      <div className="flex-1 min-h-0 grid grid-cols-1 md:grid-cols-12 gap-3 py-1 px-1">
        {/* Left: Elevation Matrix */}
        <div className="md:col-span-8 flex flex-col items-center justify-center p-2 rounded-xl bg-slate-950/40 border border-slate-800/60 relative overflow-hidden">
          <div className="flex flex-col gap-1.5 p-2 rounded-xl bg-slate-900/80 border border-slate-800 shadow-inner">
            {grid.map((row, r) => (
              <div key={r} className="flex gap-1.5">
                {row.map((elevation, c) => {
                  const current = isCurrent(r, c);
                  const inChosenPath = isInPath(r, c);
                  const submerged = elevation <= currentTime;
                  const isDestination = r === N - 1 && c === N - 1;
                  const isStart = r === 0 && c === 0;

                  let cellBg = 'bg-slate-900 text-slate-400 border-slate-800';

                  if (inChosenPath && isComplete) {
                    cellBg = 'bg-emerald-500/30 text-emerald-300 border-emerald-500/60 shadow-[0_0_12px_rgba(16,185,129,0.3)] font-bold';
                  } else if (submerged) {
                    cellBg = 'bg-sky-500/20 text-sky-200 border-sky-500/40 shadow-[0_0_8px_rgba(56,189,248,0.2)]';
                  } else {
                    cellBg = 'bg-slate-950/70 text-slate-600 border-slate-800/80';
                  }

                  if (current) {
                    cellBg += ' ring-2 ring-indigo-400 scale-105 z-10';
                  }

                  return (
                    <div
                      key={c}
                      className={`w-11 h-11 rounded-lg flex flex-col items-center justify-center font-mono border transition-all duration-200 relative select-none ${cellBg}`}
                    >
                      <span className="text-xs font-bold leading-none">{elevation}</span>
                      <span className="text-[8px] opacity-40 mt-1 leading-none">{r},{c}</span>

                      {current && (
                        <span className="absolute -top-1 -right-1 text-[11px] leading-none">
                          🏊
                        </span>
                      )}
                      {isDestination && !current && (
                        <span className="absolute -top-1 -right-1 text-[9px] leading-none text-emerald-400 font-bold">
                          🏁
                        </span>
                      )}
                      {isStart && !current && (
                        <span className="absolute -top-1 -left-1 text-[9px] leading-none text-sky-400 font-bold">
                          S
                        </span>
                      )}
                    </div>
                  );
                })}
              </div>
            ))}
          </div>
        </div>

        {/* Right: Water Depth Gauge & Min-Heap */}
        <div className="md:col-span-4 flex flex-col gap-2 min-h-0">
          {/* Water Depth Gauge */}
          <div className="bg-slate-950/40 border border-slate-800/60 rounded-xl p-2.5 flex items-center justify-between shrink-0">
            <div>
              <span className="text-[10px] text-slate-400 uppercase tracking-wider block flex items-center gap-1">
                <Droplets className="w-3 h-3 text-sky-400" /> Current Water Level
              </span>
              <span className="text-xl font-mono font-bold text-sky-400">t = {currentTime}</span>
            </div>
            <div className="text-right">
              <span className="text-[10px] text-slate-400 uppercase tracking-wider block">Destination Elevation</span>
              <span className="text-base font-mono font-bold text-emerald-400">{grid[N - 1][N - 1]}</span>
            </div>
          </div>

          {/* Min-Heap Priority Queue */}
          <div className="bg-slate-950/40 border border-slate-800/60 rounded-xl p-2.5 flex flex-col gap-1.5 flex-1 min-h-0 overflow-y-auto">
            <div className="flex items-center justify-between">
              <span className="text-[10px] uppercase font-bold text-slate-400 tracking-wider flex items-center gap-1">
                <Layers className="w-3 h-3 text-indigo-400" /> Min-Heap (Next Water Rise)
              </span>
              <span className="text-[10px] font-mono text-indigo-300">
                {heap.length} cells
              </span>
            </div>

            <div className="space-y-1 mt-0.5">
              {heap.slice(0, 5).map((item, hIdx) => (
                <div
                  key={hIdx}
                  className={`px-2 py-1 rounded text-xs font-mono flex items-center justify-between border ${
                    hIdx === 0
                      ? 'bg-sky-500/20 text-sky-300 border-sky-500/40 font-bold ring-1 ring-sky-400'
                      : 'bg-slate-900/60 text-slate-400 border-slate-800'
                  }`}
                >
                  <span>Cell ({item.r}, {item.c})</span>
                  <span className="text-[11px] font-bold">Needs t = {item.time}</span>
                </div>
              ))}
              {heap.length > 5 && (
                <div className="text-[10px] text-slate-500 text-center">
                  +{heap.length - 5} more cells in heap...
                </div>
              )}
            </div>

            <div className="mt-auto p-2 rounded-lg bg-slate-900/60 border border-slate-800 text-[11px] text-slate-300">
              <span className="font-semibold text-sky-400">Bottleneck Minimization:</span>
              <p className="text-[10px] text-slate-400 mt-0.5">
                Dijkstra's greedy expansion guarantees that the first time we touch the bottom-right corner <code>({N - 1}, {N - 1})</code>, the maximum water elevation encountered along the path is strictly minimized.
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Legend */}
      <div className="flex items-center justify-between bg-slate-950/60 border border-slate-800/60 rounded-xl px-3 py-1.5 shrink-0 text-xs">
        <div className="flex items-center gap-3">
          <div className="flex items-center gap-1.5">
            <span className="w-3 h-3 rounded bg-sky-500/30 border border-sky-500/60" />
            <span className="text-sky-300 text-[11px]">Submerged (&le; t)</span>
          </div>
          <div className="flex items-center gap-1.5">
            <span className="w-3 h-3 rounded bg-slate-950 border border-slate-800" />
            <span className="text-slate-500 text-[11px]">Above Water (&gt; t)</span>
          </div>
          <div className="flex items-center gap-1.5">
            <span className="w-3 h-3 rounded bg-emerald-500/30 border border-emerald-500/60" />
            <span className="text-emerald-300 text-[11px]">Optimal Swim Path</span>
          </div>
        </div>

        {isComplete && (
          <div className="flex items-center gap-1 text-emerald-400 font-semibold text-[11px]">
            <CheckCircle2 className="w-3.5 h-3.5" /> Optimal Swim Path Reached at t = {result}
          </div>
        )}
      </div>
    </div>
  );
};
