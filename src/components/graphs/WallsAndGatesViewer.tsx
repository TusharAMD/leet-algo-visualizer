import React from 'react';
import { WallsAndGatesStep, INF } from '../../algorithms/wallsAndGatesIntuitive';
import { Compass, CheckCircle2, Shield, Layers, DoorOpen } from 'lucide-react';

interface WallsAndGatesViewerProps {
  step: WallsAndGatesStep;
}

export const WallsAndGatesViewer: React.FC<WallsAndGatesViewerProps> = ({ step }) => {
  const {
    rooms,
    queue,
    currentCell,
    justFilled,
    distance,
    headline,
    subtext,
    isComplete,
    stepIndex,
    totalSteps
  } = step;

  const isCurrent = (r: number, c: number) => {
    return currentCell !== null && currentCell[0] === r && currentCell[1] === c;
  };

  const isJustFilled = (r: number, c: number) => {
    return justFilled.some(([jr, jc]) => jr === r && jc === c);
  };

  let gateCount = 0;
  let wallCount = 0;
  let filledCount = 0;
  let unreachableCount = 0;

  rooms.forEach(row => {
    row.forEach(val => {
      if (val === 0) gateCount++;
      else if (val === -1) wallCount++;
      else if (val === INF) unreachableCount++;
      else if (val > 0) filledCount++;
    });
  });

  return (
    <div className="flex-1 min-h-0 flex flex-col bg-slate-900/60 border border-slate-800 rounded-2xl p-3 shadow-xl overflow-hidden justify-between">
      {/* Top Banner */}
      <div className="bg-slate-950/70 border border-slate-800/80 rounded-xl p-2.5 flex items-center justify-between shrink-0">
        <div className="flex items-center gap-2">
          <span className="p-1.5 rounded-lg bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
            <DoorOpen className="w-4 h-4" />
          </span>
          <div>
            <h3 className="text-xs font-semibold text-white tracking-wide">{headline}</h3>
            <p className="text-[11px] text-slate-400">{subtext}</p>
          </div>
        </div>
        <div className="flex items-center gap-2">
          {isComplete ? (
            <span className="px-2.5 py-0.5 rounded-md bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 text-xs font-mono font-bold flex items-center gap-1">
              <CheckCircle2 className="w-3.5 h-3.5" /> All Distances Computed
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
        {/* Left: Rooms Matrix */}
        <div className="md:col-span-8 flex flex-col items-center justify-center p-2 rounded-xl bg-slate-950/40 border border-slate-800/60 relative overflow-hidden">
          <div className="flex flex-col gap-1.5 p-2 rounded-xl bg-slate-900/80 border border-slate-800 shadow-inner">
            {rooms.map((row, r) => (
              <div key={r} className="flex gap-1.5">
                {row.map((val, c) => {
                  const current = isCurrent(r, c);
                  const filled = isJustFilled(r, c);

                  let cellStyle = 'bg-slate-900 text-slate-400 border-slate-800';
                  let content = `${val}`;
                  let subtitle = `${r},${c}`;

                  if (val === -1) {
                    // Wall
                    cellStyle = 'bg-slate-800/90 text-slate-500 border-slate-700/80 font-bold';
                    content = 'WALL';
                  } else if (val === 0) {
                    // Gate
                    cellStyle = 'bg-emerald-500/20 text-emerald-300 border-emerald-500/50 font-bold shadow-[0_0_10px_rgba(16,185,129,0.25)]';
                    content = 'GATE';
                  } else if (val === INF) {
                    // Empty unvisited room
                    cellStyle = 'bg-slate-950/50 text-slate-600 border-slate-800/60 font-mono text-base';
                    content = '∞';
                  } else {
                    // Distance calculated
                    if (filled) {
                      cellStyle = 'bg-amber-500/30 text-amber-300 border-amber-400 shadow-[0_0_12px_rgba(245,158,11,0.4)] scale-105';
                    } else {
                      // Heatmap color based on distance
                      if (val <= 2) {
                        cellStyle = 'bg-sky-500/20 text-sky-300 border-sky-500/40';
                      } else if (val <= 4) {
                        cellStyle = 'bg-indigo-500/20 text-indigo-300 border-indigo-500/40';
                      } else {
                        cellStyle = 'bg-purple-500/20 text-purple-300 border-purple-500/40';
                      }
                    }
                    content = `${val}`;
                  }

                  if (current) {
                    cellStyle += ' ring-2 ring-indigo-400 scale-110 z-10';
                  }

                  return (
                    <div
                      key={c}
                      className={`w-12 h-12 rounded-lg flex flex-col items-center justify-center font-mono border transition-all duration-200 relative select-none ${cellStyle}`}
                    >
                      <span className="text-xs font-bold leading-none">{content}</span>
                      <span className="text-[8px] opacity-40 mt-1 leading-none">{subtitle}</span>
                      {current && (
                        <span className="absolute -top-1 -right-1 w-2.5 h-2.5 rounded-full bg-indigo-400 animate-ping" />
                      )}
                    </div>
                  );
                })}
              </div>
            ))}
          </div>
        </div>

        {/* Right: Info & Stats */}
        <div className="md:col-span-4 flex flex-col gap-2 min-h-0">
          {/* Stats Bar */}
          <div className="bg-slate-950/40 border border-slate-800/60 rounded-xl p-2.5 grid grid-cols-4 gap-1.5 shrink-0 text-center">
            <div className="bg-slate-900/60 border border-slate-800/80 rounded-lg p-1 flex flex-col items-center">
              <span className="text-[9px] text-slate-400 uppercase">Gates</span>
              <span className="text-sm font-bold text-emerald-400 font-mono">{gateCount}</span>
            </div>
            <div className="bg-slate-900/60 border border-slate-800/80 rounded-lg p-1 flex flex-col items-center">
              <span className="text-[9px] text-slate-400 uppercase">Walls</span>
              <span className="text-sm font-bold text-slate-400 font-mono">{wallCount}</span>
            </div>
            <div className="bg-slate-900/60 border border-slate-800/80 rounded-lg p-1 flex flex-col items-center">
              <span className="text-[9px] text-slate-400 uppercase">Filled</span>
              <span className="text-sm font-bold text-sky-400 font-mono">{filledCount}</span>
            </div>
            <div className="bg-slate-900/60 border border-slate-800/80 rounded-lg p-1 flex flex-col items-center">
              <span className="text-[9px] text-slate-400 uppercase">Empty</span>
              <span className="text-sm font-bold text-slate-500 font-mono">{unreachableCount}</span>
            </div>
          </div>

          {/* BFS Queue Card */}
          <div className="bg-slate-950/40 border border-slate-800/60 rounded-xl p-2.5 flex flex-col gap-1.5 flex-1 min-h-0 overflow-y-auto">
            <div className="flex items-center justify-between">
              <span className="text-[10px] uppercase font-bold text-slate-400 tracking-wider flex items-center gap-1">
                <Layers className="w-3 h-3 text-indigo-400" /> Multi-Source BFS Queue
              </span>
              <span className="text-[10px] font-mono text-indigo-300">
                {queue.length} in queue
              </span>
            </div>

            <div className="flex flex-wrap gap-1">
              {queue.length === 0 ? (
                <span className="text-[11px] text-slate-500 italic">Queue is empty</span>
              ) : (
                queue.map(([qr, qc], qIdx) => (
                  <span
                    key={qIdx}
                    className={`px-1.5 py-0.5 rounded text-[10px] font-mono border ${
                      qIdx === 0
                        ? 'bg-indigo-500/20 text-indigo-300 border-indigo-500/40 ring-1 ring-indigo-400'
                        : 'bg-slate-800/80 text-slate-400 border-slate-700/60'
                    }`}
                  >
                    ({qr},{qc})
                  </span>
                ))
              )}
            </div>

            <div className="mt-auto p-2 rounded-lg bg-slate-900/60 border border-slate-800 text-[11px] text-slate-300 space-y-1">
              <div className="font-semibold text-emerald-300 flex items-center gap-1">
                <Compass className="w-3 h-3 text-emerald-400" /> Simultaneous Wave Propagation
              </div>
              <div className="text-[10px] text-slate-400">
                Starting from all gates at distance 0 guarantees that the first time an empty room is reached, it is via the shortest path.
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Legend */}
      <div className="flex items-center justify-between bg-slate-950/60 border border-slate-800/60 rounded-xl px-3 py-1.5 shrink-0 text-xs">
        <div className="flex items-center gap-3">
          <div className="flex items-center gap-1">
            <span className="w-3 h-3 rounded bg-emerald-500/20 border border-emerald-500/50" />
            <span className="text-emerald-300 text-[11px]">0 (Gate)</span>
          </div>
          <div className="flex items-center gap-1">
            <span className="w-3 h-3 rounded bg-slate-800 border border-slate-700" />
            <span className="text-slate-400 text-[11px]">-1 (Wall)</span>
          </div>
          <div className="flex items-center gap-1">
            <span className="w-3 h-3 rounded bg-slate-950 border border-slate-800" />
            <span className="text-slate-500 text-[11px]">∞ (Empty)</span>
          </div>
          <div className="flex items-center gap-1">
            <span className="w-3 h-3 rounded bg-sky-500/20 border border-sky-500/40" />
            <span className="text-sky-300 text-[11px]">Distance &gt; 0</span>
          </div>
        </div>

        {isComplete && (
          <div className="flex items-center gap-1 text-emerald-400 font-semibold text-[11px]">
            <CheckCircle2 className="w-3.5 h-3.5" /> All Empty Rooms Labeled
          </div>
        )}
      </div>
    </div>
  );
};
