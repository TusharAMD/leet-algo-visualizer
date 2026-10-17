import React from 'react';
import { PacificAtlanticStep } from '../../algorithms/pacificAtlanticIntuitive';
import { Waves, CheckCircle2, ArrowRight, Compass, Sparkles, Droplets } from 'lucide-react';

interface PacificAtlanticViewerProps {
  step: PacificAtlanticStep;
}

export const PacificAtlanticViewer: React.FC<PacificAtlanticViewerProps> = ({ step }) => {
  const {
    heights,
    pacCells,
    atlCells,
    intersectionCells,
    currentCell,
    currentOcean,
    headline,
    subtext,
    isComplete,
    stepIndex,
    totalSteps
  } = step;

  const isCurrent = (r: number, c: number) => {
    return currentCell !== null && currentCell[0] === r && currentCell[1] === c;
  };

  const isPac = (r: number, c: number) => {
    return pacCells.some(([pr, pc]) => pr === r && pc === c);
  };

  const isAtl = (r: number, c: number) => {
    return atlCells.some(([ar, ac]) => ar === r && ac === c);
  };

  const isBoth = (r: number, c: number) => {
    return (
      intersectionCells.some(([br, bc]) => br === r && bc === c) ||
      (isPac(r, c) && isAtl(r, c) && isComplete)
    );
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
              <CheckCircle2 className="w-3.5 h-3.5" /> Both: {intersectionCells.length} Cells
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
        {/* Left: Topographic Map with Ocean Borders */}
        <div className="md:col-span-8 bg-slate-950/60 border border-slate-800 rounded-xl p-3 flex flex-col justify-between overflow-hidden">
          {/* Pacific Border Banner (Top) */}
          <div className="text-center bg-sky-950/40 border border-sky-500/30 rounded-lg py-1 text-[10px] font-bold text-sky-300 uppercase tracking-widest shrink-0">
            ~ Pacific Ocean (Top & Left Borders) ~
          </div>

          {/* Grid with Left & Right Labels */}
          <div className="flex-1 flex items-center justify-center py-2">
            <div className="flex items-center gap-2">
              <div className="text-[9px] font-bold text-sky-400 uppercase tracking-widest -rotate-90">
                PACIFIC
              </div>

              <div
                className="grid gap-1.5 p-2 bg-slate-900/90 rounded-2xl border border-slate-800"
                style={{
                  gridTemplateColumns: `repeat(${heights[0]?.length || 5}, minmax(0, 1fr))`
                }}
              >
                {heights.map((row, r) =>
                  row.map((val, c) => {
                    const cur = isCurrent(r, c);
                    const both = isBoth(r, c);
                    const pacific = isPac(r, c);
                    const atlantic = isAtl(r, c);

                    return (
                      <div
                        key={`${r}-${c}`}
                        className={`relative w-9 h-9 sm:w-11 sm:h-11 rounded-xl flex flex-col items-center justify-center font-mono font-bold text-xs transition-all border ${
                          cur
                            ? 'bg-amber-500/30 border-amber-400 text-amber-200 ring-2 ring-amber-400 scale-105'
                            : both
                            ? 'bg-emerald-500/30 border-emerald-400 text-emerald-200 ring-2 ring-emerald-400/60 shadow-lg shadow-emerald-500/20'
                            : pacific && atlantic
                            ? 'bg-purple-500/25 border-purple-400 text-purple-200'
                            : pacific
                            ? 'bg-sky-500/20 border-sky-500/40 text-sky-200'
                            : atlantic
                            ? 'bg-amber-500/20 border-amber-500/40 text-amber-200'
                            : 'bg-slate-850 border-slate-700/80 text-slate-300'
                        }`}
                      >
                        <span>{val}</span>
                        {both && (
                          <span className="absolute -top-1 -right-1 text-[7px] bg-emerald-500 text-slate-950 font-extrabold px-1 rounded-full">
                            ★
                          </span>
                        )}
                      </div>
                    );
                  })
                )}
              </div>

              <div className="text-[9px] font-bold text-amber-400 uppercase tracking-widest rotate-90">
                ATLANTIC
              </div>
            </div>
          </div>

          {/* Atlantic Border Banner (Bottom) */}
          <div className="text-center bg-amber-950/40 border border-amber-500/30 rounded-lg py-1 text-[10px] font-bold text-amber-300 uppercase tracking-widest shrink-0">
            ~ Atlantic Ocean (Bottom & Right Borders) ~
          </div>
        </div>

        {/* Right: Legend & Valid Coordinates */}
        <div className="md:col-span-4 flex flex-col gap-2 min-h-0">
          {/* Legend */}
          <div className="bg-slate-950/60 border border-slate-800 rounded-xl p-2.5 shrink-0 flex flex-col gap-1.5">
            <span className="text-[10px] font-bold text-slate-400 uppercase">Ocean Drainage Legend:</span>
            <div className="flex flex-col gap-1 text-xs font-mono">
              <span className="text-sky-300 flex items-center gap-1.5">
                <span className="w-2.5 h-2.5 rounded bg-sky-500" /> Pacific Reachable
              </span>
              <span className="text-amber-300 flex items-center gap-1.5">
                <span className="w-2.5 h-2.5 rounded bg-amber-500" /> Atlantic Reachable
              </span>
              <span className="text-emerald-300 font-bold flex items-center gap-1.5">
                <span className="w-2.5 h-2.5 rounded bg-emerald-400" /> Both Oceans (Answer)
              </span>
            </div>
          </div>

          {/* Results List */}
          <div className="flex-1 bg-slate-950/60 border border-slate-800 rounded-xl p-2.5 flex flex-col justify-between overflow-hidden">
            <div className="flex items-center justify-between border-b border-slate-800/70 pb-1 shrink-0">
              <span className="text-xs font-semibold text-emerald-400 flex items-center gap-1">
                <Sparkles className="w-3.5 h-3.5" /> Both Oceans Set
              </span>
              <span className="text-[10px] font-mono text-slate-400">
                {intersectionCells.length} cells
              </span>
            </div>

            <div className="flex-1 overflow-y-auto py-2 grid grid-cols-2 gap-1.5 content-start">
              {intersectionCells.length === 0 ? (
                <span className="text-slate-600 text-xs italic col-span-2 text-center py-4">
                  Evaluating uphill flows...
                </span>
              ) : (
                intersectionCells.map(([r, c], idx) => (
                  <div
                    key={idx}
                    className="px-2 py-1 rounded-lg bg-emerald-500/10 border border-emerald-500/30 text-emerald-300 font-mono text-xs font-bold text-center"
                  >
                    [{r}, {c}]
                  </div>
                ))
              )}
            </div>

            <div className="text-[10px] text-slate-500 bg-slate-900/80 rounded-lg p-1.5 border border-slate-800/60 text-center shrink-0">
              O(M * N) optimal time by reversing flow direction from boundaries.
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
