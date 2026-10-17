import React from 'react';
import { KokoBananasStep } from '../../algorithms/kokoBananasIntuitive';
import { Utensils, CheckCircle2, AlertTriangle, Trophy, Zap, Clock } from 'lucide-react';

interface KokoBananasViewerProps {
  step: KokoBananasStep;
}

export const KokoBananasViewer: React.FC<KokoBananasViewerProps> = ({ step }) => {
  const { piles, h, left, right, midK, pileHours, totalHours, isFeasible, minSpeed, isComplete } = step;

  const maxPileVal = Math.max(...piles, 1);

  return (
    <div className="flex-1 min-h-0 flex flex-col bg-slate-900/60 border border-slate-800 rounded-2xl p-3 shadow-xl overflow-hidden justify-between">
      {/* Top Banner */}
      <div className="bg-slate-950/70 border border-slate-800/80 rounded-xl p-2.5 flex items-center justify-between shrink-0">
        <div className="flex items-center gap-2">
          <span className="p-1.5 rounded-lg bg-amber-500/10 text-amber-400 border border-amber-500/20">
            <Utensils className="w-4 h-4" />
          </span>
          <div>
            <h3 className="text-xs font-semibold text-white tracking-wide">{step.headline}</h3>
            <p className="text-[11px] text-slate-400">{step.subtext}</p>
          </div>
        </div>
        <div className="flex items-center gap-2">
          {isComplete ? (
            <span className="px-2 py-0.5 rounded-md bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 text-[11px] font-semibold flex items-center gap-1">
              <CheckCircle2 className="w-3.5 h-3.5" /> Optimal k = {minSpeed}
            </span>
          ) : (
            <span className="px-2 py-0.5 rounded-md bg-amber-500/10 border border-amber-500/20 text-amber-400 text-[11px] font-mono">
              Step {step.stepIndex + 1} / {step.totalSteps}
            </span>
          )}
        </div>
      </div>

      {/* Main Arena */}
      <div className="flex-1 min-h-0 flex flex-col justify-around gap-2 py-2 px-3">
        {/* Row 1: Banana Piles Chart */}
        <div className="flex flex-col gap-1.5">
          <span className="text-[10px] uppercase font-mono font-bold tracking-wider text-slate-400">
            Banana Piles (Hours needed at speed k={midK > 0 ? midK : '—'}/hr):
          </span>

          <div className="flex items-end justify-center gap-3 sm:gap-4 h-36 px-2 border-b border-slate-800 bg-slate-950/60 rounded-xl p-2">
            {piles.map((p, idx) => {
              const heightPercent = Math.round((p / maxPileVal) * 100);
              const hrs = pileHours[idx] ?? Math.ceil(p / (midK > 0 ? midK : 1));

              return (
                <div key={idx} className="flex-1 max-w-[56px] flex flex-col items-center h-full justify-end">
                  {/* Hours needed pill */}
                  <span className="text-[10px] font-mono font-bold text-amber-400 mb-1">
                    {midK > 0 ? `${hrs}h` : ''}
                  </span>

                  {/* Vertical bar */}
                  <div
                    className="w-full rounded-t-md bg-amber-500/20 border border-amber-400/50 flex items-start justify-center pt-1 transition-all"
                    style={{ height: `${Math.max(16, heightPercent)}%` }}
                  >
                    <span className="text-[11px] font-mono font-bold text-white drop-shadow">
                      {p}
                    </span>
                  </div>

                  {/* Pile index */}
                  <span className="text-[9px] font-mono text-slate-500 mt-1">P{idx}</span>
                </div>
              );
            })}
          </div>
        </div>

        {/* Row 2: Speed Binary Search Range Tracker */}
        <div className="bg-slate-950/60 border border-slate-800/80 rounded-xl p-2.5 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <span className="text-xs font-mono text-slate-400">Search Space:</span>
            <span className="px-2 py-0.5 rounded bg-indigo-500/20 border border-indigo-500/30 text-indigo-300 font-mono text-xs font-bold">
              [{left} .. {right}]
            </span>
            {midK > 0 && (
              <span className="text-xs font-mono text-slate-300">
                Test Speed: <span className="text-amber-400 font-bold">{midK}</span> bananas/hr
              </span>
            )}
          </div>

          {/* Time Limit Meter */}
          {midK > 0 && (
            <div className="flex items-center gap-2">
              <Clock className="w-3.5 h-3.5 text-slate-400" />
              <span className="text-xs font-mono text-slate-300">
                Total: <span className="font-bold text-white">{totalHours}h</span> / {h}h
              </span>
              <span
                className={`px-2 py-0.5 rounded text-[10px] font-bold ${
                  isFeasible
                    ? 'bg-emerald-500/20 border border-emerald-500/40 text-emerald-300'
                    : 'bg-rose-500/20 border border-rose-500/40 text-rose-300'
                }`}
              >
                {isFeasible ? '✓ In Time' : '✗ Overtime'}
              </span>
            </div>
          )}
        </div>

        {/* Row 3: Optimal Speed Trophy */}
        <div className="bg-slate-950/60 border border-slate-800/80 rounded-xl p-2.5 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Trophy className="w-4 h-4 text-emerald-400" />
            <span className="text-xs font-mono font-bold text-slate-300">
              Minimum Feasible Eating Speed (k):
            </span>
          </div>
          <div className="flex items-center gap-2">
            <span className="px-3 py-0.5 rounded-lg bg-emerald-500/20 border border-emerald-400/40 text-emerald-300 font-mono text-sm font-bold shadow-md shadow-emerald-500/10">
              k = {minSpeed} bananas/hr
            </span>
          </div>
        </div>
      </div>
    </div>
  );
};
