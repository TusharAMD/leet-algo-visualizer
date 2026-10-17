import React from 'react';
import { RottingOrangesStep } from '../../algorithms/rottingOrangesIntuitive';
import { Clock, AlertTriangle, CheckCircle2, Flame, Layers } from 'lucide-react';

interface RottingOrangesViewerProps {
  step: RottingOrangesStep;
}

export const RottingOrangesViewer: React.FC<RottingOrangesViewerProps> = ({ step }) => {
  const {
    grid,
    freshCount,
    time,
    queue,
    activeRotten,
    justRotted,
    headline,
    subtext,
    isComplete,
    result,
    stepIndex,
    totalSteps
  } = step;

  const isCurrentActive = (r: number, c: number) => {
    return activeRotten !== null && activeRotten[0] === r && activeRotten[1] === c;
  };

  const isJustRotted = (r: number, c: number) => {
    return justRotted.some(([jr, jc]) => jr === r && jc === c);
  };

  let rottenCount = 0;
  grid.forEach(row => row.forEach(val => {
    if (val === 2) rottenCount++;
  }));

  return (
    <div className="flex-1 min-h-0 flex flex-col bg-slate-900/60 border border-slate-800 rounded-2xl p-3 shadow-xl overflow-hidden justify-between">
      {/* Top Banner */}
      <div className="bg-slate-950/70 border border-slate-800/80 rounded-xl p-2.5 flex items-center justify-between shrink-0">
        <div className="flex items-center gap-2">
          <span className="p-1.5 rounded-lg bg-amber-500/10 text-amber-400 border border-amber-500/20">
            <Clock className="w-4 h-4" />
          </span>
          <div>
            <h3 className="text-xs font-semibold text-white tracking-wide">{headline}</h3>
            <p className="text-[11px] text-slate-400">{subtext}</p>
          </div>
        </div>
        <div className="flex items-center gap-2">
          {isComplete ? (
            result !== -1 ? (
              <span className="px-2.5 py-0.5 rounded-md bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 text-xs font-mono font-bold flex items-center gap-1">
                <CheckCircle2 className="w-3.5 h-3.5" /> All Rotted in {result}m
              </span>
            ) : (
              <span className="px-2.5 py-0.5 rounded-md bg-rose-500/10 border border-rose-500/20 text-rose-400 text-xs font-mono font-bold flex items-center gap-1">
                <AlertTriangle className="w-3.5 h-3.5" /> Impossible (-1)
              </span>
            )
          ) : (
            <span className="px-2 py-0.5 rounded-md bg-indigo-500/10 border border-indigo-500/20 text-indigo-400 text-[11px] font-mono">
              Step {stepIndex + 1} / {totalSteps}
            </span>
          )}
        </div>
      </div>

      {/* Main Arena */}
      <div className="flex-1 min-h-0 grid grid-cols-1 md:grid-cols-12 gap-3 py-1 px-1">
        {/* Left: Matrix Grid */}
        <div className="md:col-span-8 flex flex-col items-center justify-center p-2 rounded-xl bg-slate-950/40 border border-slate-800/60 relative overflow-hidden">
          <div className="flex flex-col gap-2 p-3 rounded-xl bg-slate-900/80 border border-slate-800 shadow-inner">
            {grid.map((row, r) => (
              <div key={r} className="flex gap-2">
                {row.map((val, c) => {
                  const isActive = isCurrentActive(r, c);
                  const isNewRot = isJustRotted(r, c);

                  let cellBg = 'bg-slate-950/60 border-slate-800 text-slate-600';
                  let label = '·';
                  let subLabel = 'Empty';

                  if (val === 1) {
                    // Fresh
                    cellBg = 'bg-amber-500/20 border-amber-500/40 text-amber-300 shadow-[0_0_10px_rgba(245,158,11,0.2)]';
                    label = '🍊';
                    subLabel = 'Fresh';
                  } else if (val === 2) {
                    // Rotten
                    if (isNewRot) {
                      cellBg = 'bg-emerald-500/30 border-emerald-400 text-emerald-300 shadow-[0_0_14px_rgba(16,185,129,0.5)] scale-105';
                      label = '🦠';
                      subLabel = 'Rotted!';
                    } else {
                      cellBg = 'bg-lime-950/60 border-lime-600/40 text-lime-400 shadow-[0_0_8px_rgba(101,163,13,0.2)]';
                      label = '🤢';
                      subLabel = 'Rotten';
                    }
                  }

                  if (isActive) {
                    cellBg += ' ring-2 ring-indigo-400 scale-110 z-10';
                  }

                  return (
                    <div
                      key={c}
                      className={`w-14 h-14 rounded-xl flex flex-col items-center justify-center border transition-all duration-200 relative select-none ${cellBg}`}
                    >
                      <span className="text-xl leading-none">{label}</span>
                      <span className="text-[9px] font-mono opacity-60 mt-0.5">
                        {r},{c}
                      </span>
                      {isActive && (
                        <span className="absolute -top-1 -right-1 w-2.5 h-2.5 rounded-full bg-indigo-400 animate-ping" />
                      )}
                    </div>
                  );
                })}
              </div>
            ))}
          </div>
        </div>

        {/* Right: Info, Queue & Stats */}
        <div className="md:col-span-4 flex flex-col gap-2 min-h-0">
          {/* Minutes Clock & Counters */}
          <div className="bg-slate-950/40 border border-slate-800/60 rounded-xl p-2.5 grid grid-cols-3 gap-2 shrink-0 text-center">
            <div className="bg-slate-900/60 border border-slate-800/80 rounded-lg p-1.5 flex flex-col items-center">
              <span className="text-[10px] text-slate-400 uppercase tracking-wider">Minutes</span>
              <span className="text-lg font-bold text-sky-400 font-mono">{time}m</span>
            </div>
            <div className="bg-slate-900/60 border border-slate-800/80 rounded-lg p-1.5 flex flex-col items-center">
              <span className="text-[10px] text-slate-400 uppercase tracking-wider">Fresh</span>
              <span className="text-lg font-bold text-amber-400 font-mono">{freshCount}</span>
            </div>
            <div className="bg-slate-900/60 border border-slate-800/80 rounded-lg p-1.5 flex flex-col items-center">
              <span className="text-[10px] text-slate-400 uppercase tracking-wider">Rotten</span>
              <span className="text-lg font-bold text-lime-400 font-mono">{rottenCount}</span>
            </div>
          </div>

          {/* BFS Queue Preview */}
          <div className="bg-slate-950/40 border border-slate-800/60 rounded-xl p-2.5 flex flex-col gap-1.5 flex-1 min-h-0 overflow-y-auto">
            <div className="flex items-center justify-between">
              <span className="text-[10px] uppercase font-bold text-slate-400 tracking-wider flex items-center gap-1">
                <Layers className="w-3 h-3 text-indigo-400" /> Multi-Source BFS Queue
              </span>
              <span className="text-[10px] font-mono text-indigo-300">
                {queue.length} items
              </span>
            </div>

            <div className="flex flex-wrap gap-1.5">
              {queue.length === 0 ? (
                <span className="text-[11px] text-slate-500 italic">Queue is empty</span>
              ) : (
                queue.map(([qr, qc], qIdx) => (
                  <span
                    key={qIdx}
                    className={`px-2 py-0.5 rounded text-[11px] font-mono border ${
                      qIdx === 0
                        ? 'bg-indigo-500/20 text-indigo-300 border-indigo-500/40 ring-1 ring-indigo-400'
                        : 'bg-slate-800/80 text-slate-400 border-slate-700/60'
                    }`}
                  >
                    ({qr}, {qc})
                  </span>
                ))
              )}
            </div>

            <div className="mt-auto p-2 rounded-lg bg-slate-900/60 border border-slate-800 text-[11px] text-slate-300">
              <div className="font-semibold text-indigo-300 flex items-center gap-1 mb-1">
                <Flame className="w-3 h-3 text-amber-400" /> Parallel Contamination
              </div>
              All rotten oranges infect 4-directionally adjacent fresh oranges during each discrete minute tick.
            </div>
          </div>
        </div>
      </div>

      {/* Legend */}
      <div className="flex items-center justify-between bg-slate-950/60 border border-slate-800/60 rounded-xl px-3 py-1.5 shrink-0 text-xs">
        <div className="flex items-center gap-4">
          <div className="flex items-center gap-1.5">
            <span className="w-3 h-3 rounded bg-amber-500/30 border border-amber-500/60" />
            <span className="text-amber-300 text-[11px]">1: Fresh Orange</span>
          </div>
          <div className="flex items-center gap-1.5">
            <span className="w-3 h-3 rounded bg-lime-500/30 border border-lime-500/60" />
            <span className="text-lime-300 text-[11px]">2: Rotten Orange</span>
          </div>
          <div className="flex items-center gap-1.5">
            <span className="w-3 h-3 rounded bg-slate-800 border border-slate-700" />
            <span className="text-slate-400 text-[11px]">0: Empty Cell</span>
          </div>
        </div>

        {isComplete && (
          <div className="flex items-center gap-1 text-[11px] font-semibold">
            {result !== -1 ? (
              <span className="text-emerald-400 flex items-center gap-1">
                <CheckCircle2 className="w-3.5 h-3.5" /> Simulation Complete: {result} Minutes
              </span>
            ) : (
              <span className="text-rose-400 flex items-center gap-1">
                <AlertTriangle className="w-3.5 h-3.5" /> Fresh Oranges Trapped
              </span>
            )}
          </div>
        )}
      </div>
    </div>
  );
};
