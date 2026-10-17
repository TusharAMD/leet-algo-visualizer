import React from 'react';
import { MaxAreaOfIslandStep } from '../../algorithms/maxAreaOfIslandIntuitive';
import { Mountain, CheckCircle2, Award, Waves, Compass, Sparkles } from 'lucide-react';

interface MaxAreaOfIslandViewerProps {
  step: MaxAreaOfIslandStep;
}

export const MaxAreaOfIslandViewer: React.FC<MaxAreaOfIslandViewerProps> = ({ step }) => {
  const {
    grid,
    currentCell,
    activeIslandCells,
    visitedCells,
    currentArea,
    maxArea,
    islandCount,
    headline,
    subtext,
    isComplete,
    stepIndex,
    totalSteps
  } = step;

  const isCurrent = (r: number, c: number) => {
    return currentCell !== null && currentCell[0] === r && currentCell[1] === c;
  };

  const isInActiveIsland = (r: number, c: number) => {
    return activeIslandCells.some(([ar, ac]) => ar === r && ac === c);
  };

  const isVisited = (r: number, c: number) => {
    return visitedCells.some(([vr, vc]) => vr === r && vc === c);
  };

  return (
    <div className="flex-1 min-h-0 flex flex-col bg-slate-900/60 border border-slate-800 rounded-2xl p-3 shadow-xl overflow-hidden justify-between">
      {/* Top Banner */}
      <div className="bg-slate-950/70 border border-slate-800/80 rounded-xl p-2.5 flex items-center justify-between shrink-0">
        <div className="flex items-center gap-2">
          <span className="p-1.5 rounded-lg bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
            <Mountain className="w-4 h-4" />
          </span>
          <div>
            <h3 className="text-xs font-semibold text-white tracking-wide">{headline}</h3>
            <p className="text-[11px] text-slate-400">{subtext}</p>
          </div>
        </div>
        <div className="flex items-center gap-2">
          {maxArea > 0 && (
            <span className="px-2.5 py-0.5 rounded-md bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 text-xs font-mono font-bold flex items-center gap-1">
              <Award className="w-3.5 h-3.5" /> Max Area = {maxArea}
            </span>
          )}
          <span className="px-2 py-0.5 rounded-md bg-indigo-500/10 border border-indigo-500/20 text-indigo-400 text-[11px] font-mono">
            Step {stepIndex + 1} / {totalSteps}
          </span>
        </div>
      </div>

      {/* Main Arena: Grid Matrix & Area Counter */}
      <div className="flex-1 min-h-0 grid grid-cols-1 md:grid-cols-12 gap-3 py-1 px-1">
        {/* Left: 2D Matrix */}
        <div className="md:col-span-8 bg-slate-950/60 border border-slate-800 rounded-xl p-3 flex flex-col justify-between overflow-hidden">
          <div className="flex items-center justify-between border-b border-slate-800/70 pb-1.5 shrink-0">
            <span className="text-xs font-semibold text-slate-300 flex items-center gap-1.5">
              <Compass className="w-3.5 h-3.5 text-indigo-400" />
              Grid Map ({grid.length}x{grid[0]?.length || 0})
            </span>
            <span className="text-[10px] font-mono text-slate-400">
              Islands Encountered: {islandCount}
            </span>
          </div>

          {/* Grid Cells */}
          <div className="flex-1 flex items-center justify-center py-2">
            <div
              className="grid gap-1.5 p-2 bg-slate-900/90 rounded-2xl border border-slate-800"
              style={{
                gridTemplateColumns: `repeat(${grid[0]?.length || 4}, minmax(0, 1fr))`
              }}
            >
              {grid.map((row, r) =>
                row.map((val, c) => {
                  const isLand = val === 1;
                  const cur = isCurrent(r, c);
                  const inActive = isInActiveIsland(r, c);
                  const visited = isVisited(r, c);

                  return (
                    <div
                      key={`${r}-${c}`}
                      className={`w-9 h-9 sm:w-10 sm:h-10 rounded-xl flex items-center justify-center font-mono font-bold text-xs transition-all border ${
                        cur
                          ? 'bg-amber-500/30 border-amber-400 text-amber-200 ring-2 ring-amber-400 scale-105 shadow-lg shadow-amber-500/20'
                          : inActive
                          ? 'bg-emerald-500/30 border-emerald-400 text-emerald-200 ring-1 ring-emerald-400'
                          : visited
                          ? 'bg-emerald-950/40 border-emerald-900/40 text-emerald-500/60'
                          : isLand
                          ? 'bg-emerald-500/10 border-emerald-500/30 text-emerald-400'
                          : 'bg-slate-900/90 border-slate-800 text-slate-600'
                      }`}
                    >
                      {val}
                    </div>
                  );
                })
              )}
            </div>
          </div>

          <div className="text-[10px] text-slate-500 bg-slate-900/80 rounded-lg p-1.5 border border-slate-800/60 text-center shrink-0">
            0 = Water, 1 = Land. DFS explores full connected landmass and records its area.
          </div>
        </div>

        {/* Right: Metrics Panel */}
        <div className="md:col-span-4 flex flex-col gap-2 min-h-0">
          {/* Current Area Card */}
          <div className="bg-slate-950/60 border border-slate-800 rounded-xl p-3 flex-1 flex flex-col justify-between text-center">
            <span className="text-xs font-semibold text-slate-300">Active Island Area</span>
            <div className="text-4xl font-mono font-extrabold text-emerald-400 py-2">
              {currentArea}
            </div>
            <p className="text-[10px] text-slate-500">
              {activeIslandCells.length > 0
                ? `${activeIslandCells.length} connected land tiles counted`
                : 'Searching for next unvisited land...'}
            </p>
          </div>

          {/* Max Area Record Card */}
          <div className="bg-slate-950/60 border border-slate-800 rounded-xl p-3 flex-1 flex flex-col justify-between text-center">
            <span className="text-xs font-semibold text-amber-300 flex items-center justify-center gap-1">
              <Award className="w-3.5 h-3.5" /> Max Area Record
            </span>
            <div className="text-4xl font-mono font-extrabold text-amber-400 py-2">
              {maxArea}
            </div>
            <p className="text-[10px] text-slate-500">
              Highest area encountered across all discovered islands
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};
