import React from 'react';
import { CarFleetStep } from '../../algorithms/carFleetIntuitive';
import { Car, Flag, CheckCircle2, ShieldCheck, Trophy, Layers } from 'lucide-react';

interface CarFleetViewerProps {
  step: CarFleetStep;
}

export const CarFleetViewer: React.FC<CarFleetViewerProps> = ({ step }) => {
  const { target, sortedCars, currentCarIdx, fleetTimesStack, action, isComplete } = step;

  return (
    <div className="flex-1 min-h-0 flex flex-col bg-slate-900/60 border border-slate-800 rounded-2xl p-3 shadow-xl overflow-hidden justify-between">
      {/* Top Banner */}
      <div className="bg-slate-950/70 border border-slate-800/80 rounded-xl p-2.5 flex items-center justify-between shrink-0">
        <div className="flex items-center gap-2">
          <span className="p-1.5 rounded-lg bg-indigo-500/10 text-indigo-400 border border-indigo-500/20">
            <Car className="w-4 h-4" />
          </span>
          <div>
            <h3 className="text-xs font-semibold text-white tracking-wide">{step.headline}</h3>
            <p className="text-[11px] text-slate-400">{step.subtext}</p>
          </div>
        </div>
        <div className="flex items-center gap-2">
          {isComplete ? (
            <span className="px-2 py-0.5 rounded-md bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 text-[11px] font-semibold flex items-center gap-1">
              <CheckCircle2 className="w-3.5 h-3.5" /> Total Fleets: {fleetTimesStack.length}
            </span>
          ) : (
            <span className="px-2 py-0.5 rounded-md bg-indigo-500/10 border border-indigo-500/20 text-indigo-400 text-[11px] font-mono">
              Step {step.stepIndex + 1} / {step.totalSteps}
            </span>
          )}
        </div>
      </div>

      {/* Main Arena */}
      <div className="flex-1 min-h-0 flex flex-col justify-around gap-2 py-2 px-3">
        {/* Row 1: Highway Simulation Track */}
        <div className="bg-slate-950/60 border border-slate-800/80 rounded-xl p-3 flex flex-col gap-2 relative overflow-hidden">
          <div className="flex items-center justify-between text-[10px] font-mono text-slate-400">
            <span>Start (0 miles)</span>
            <span className="flex items-center gap-1 text-emerald-400 font-bold">
              <Flag className="w-3.5 h-3.5" /> Finish Target ({target} miles)
            </span>
          </div>

          {/* Road Strip */}
          <div className="h-16 w-full bg-slate-900/90 rounded-lg border border-slate-800 relative flex items-center px-4 overflow-hidden">
            {/* Road dashed center line */}
            <div className="absolute inset-x-0 h-[2px] border-b border-dashed border-slate-700/60 top-1/2 -translate-y-1/2" />

            {/* Cars on the road */}
            {sortedCars.map((car, idx) => {
              const isCurrent = idx === currentCarIdx;
              const percent = Math.min(94, Math.max(4, (car.position / target) * 100));

              let carColor = 'bg-slate-800 border-slate-700 text-slate-400';
              if (isCurrent) {
                carColor = action === 'MERGE'
                  ? 'bg-cyan-500/30 border-cyan-400 text-cyan-200 scale-125 shadow-lg shadow-cyan-500/30 z-20'
                  : 'bg-emerald-500/30 border-emerald-400 text-emerald-200 scale-125 shadow-lg shadow-emerald-500/30 z-20';
              }

              return (
                <div
                  key={idx}
                  className="absolute flex flex-col items-center -translate-x-1/2 transition-all duration-300"
                  style={{ left: `${percent}%` }}
                >
                  <div
                    className={`px-2 py-1 rounded-md border text-[10px] font-mono font-bold flex items-center gap-1 shadow-md ${carColor}`}
                  >
                    <Car className="w-3 h-3" />
                    <span>p:{car.position}</span>
                  </div>
                  <span className="text-[9px] font-mono text-slate-500 mt-0.5">
                    {car.timeToTarget}s
                  </span>
                </div>
              );
            })}
          </div>
        </div>

        {/* Row 2: Fleet Leaders Monotonic Stack */}
        <div className="bg-slate-950/60 border border-slate-800/80 rounded-xl p-2.5 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Layers className="w-4 h-4 text-emerald-400" />
            <span className="text-xs font-mono font-bold text-slate-300">
              Fleet Arrival Times Stack (Monotonically Strictly Increasing):
            </span>
          </div>

          <div className="flex items-center gap-2 overflow-x-auto">
            {fleetTimesStack.length === 0 ? (
              <span className="text-xs text-slate-500 italic">No fleets registered</span>
            ) : (
              fleetTimesStack.map((t, idx) => (
                <div
                  key={idx}
                  className="px-3 py-1 rounded-lg bg-emerald-500/20 border border-emerald-400/40 text-emerald-300 font-mono text-xs font-bold shadow-md shadow-emerald-500/10 flex items-center gap-1.5"
                >
                  <span className="text-[10px] text-emerald-400/70">Fleet #{idx + 1}:</span>
                  <span>{t}s</span>
                </div>
              ))
            )}
          </div>
        </div>

        {/* Row 3: Result Summary Trophy */}
        <div className="bg-slate-950/60 border border-slate-800/80 rounded-xl p-2.5 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Trophy className="w-4 h-4 text-emerald-400" />
            <span className="text-xs font-mono font-bold text-slate-300">
              Total Fleets Formed at Destination:
            </span>
          </div>
          <div className="flex items-center gap-2">
            <span className="px-3 py-0.5 rounded-lg bg-emerald-500/20 border border-emerald-400/40 text-emerald-300 font-mono text-sm font-bold shadow-md shadow-emerald-500/10">
              {fleetTimesStack.length} Car Fleet{fleetTimesStack.length === 1 ? '' : 's'}
            </span>
          </div>
        </div>
      </div>
    </div>
  );
};
