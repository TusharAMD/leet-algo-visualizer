import React from 'react';
import type { GasStationStep } from '../../algorithms/gasStationIntuitive';

interface GasStationViewerProps {
  step: GasStationStep;
  gas: number[];
  cost: number[];
}

export const GasStationViewer: React.FC<GasStationViewerProps> = ({
  step,
  gas,
  cost,
}) => {
  return (
    <div className="flex flex-col h-full gap-4 p-4 select-none">
      {/* Top Status & Variable Badges */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
        <div className="bg-slate-900 border border-slate-800 rounded-xl p-3 flex flex-col justify-center">
          <span className="text-xs text-slate-400 font-medium">Inspecting Station</span>
          <span className="text-base font-mono font-bold text-sky-400">
            Station {step.currentStation}
          </span>
        </div>
        <div className="bg-slate-900 border border-slate-800 rounded-xl p-3 flex flex-col justify-center">
          <span className="text-xs text-slate-400 font-medium">Station Net (gas - cost)</span>
          <span className={`text-base font-mono font-bold ${step.netGain >= 0 ? 'text-emerald-400' : 'text-rose-400'}`}>
            {step.gasVal} - {step.costVal} = {step.netGain >= 0 ? `+${step.netGain}` : step.netGain}
          </span>
        </div>
        <div className="bg-slate-900 border border-slate-800 rounded-xl p-3 flex flex-col justify-center">
          <span className="text-xs text-slate-400 font-medium">Current Fuel Tank</span>
          <span className={`text-xl font-mono font-bold ${step.currTank >= 0 ? 'text-amber-400' : 'text-rose-400'}`}>
            {step.currTank} units
          </span>
        </div>
        <div className="bg-slate-900 border border-slate-800 rounded-xl p-3 flex flex-col justify-center">
          <span className="text-xs text-slate-400 font-medium">Candidate Start Station</span>
          <span className="text-2xl font-mono font-black text-emerald-400">
            {step.candidateStart >= 0 ? `Station ${step.candidateStart}` : 'None (-1)'}
          </span>
        </div>
      </div>

      {/* Main Circular Track Canvas */}
      <div className="flex-1 bg-slate-900/60 border border-slate-800 rounded-xl p-6 flex flex-col justify-center items-center gap-8 relative overflow-hidden">
        {step.tankDeficit && (
          <div className="bg-rose-950/70 border border-rose-500/50 px-4 py-2 rounded-xl text-rose-300 text-xs font-semibold animate-pulse">
            ⛽ Tank Dropped Below 0! Car cannot bridge this gap. Restarting candidate at Station {step.candidateStart}.
          </div>
        )}

        <div className="text-xs font-semibold text-slate-400 uppercase tracking-wider">
          Circular Circuit Stations (Gas Added vs Cost to Next)
        </div>

        {/* Stations Line/Circle */}
        <div className="flex items-center gap-3 flex-wrap justify-center">
          {gas.map((g, idx) => {
            const c = cost[idx];
            const net = g - c;
            const isCurrent = idx === step.currentStation;
            const isCandidate = idx === step.candidateStart;

            let border = 'border-slate-800';
            let bg = 'bg-slate-950/60';
            let text = 'text-slate-300';

            if (isCurrent) {
              border = 'border-amber-400 ring-4 ring-amber-400/40';
              bg = 'bg-amber-950/80';
              text = 'text-amber-200';
            } else if (isCandidate) {
              border = 'border-emerald-500 ring-2 ring-emerald-500/30';
              bg = 'bg-emerald-950/50';
              text = 'text-emerald-300';
            }

            return (
              <div key={idx} className="flex flex-col items-center gap-1">
                <span className="text-[10px] font-mono text-slate-500">Stn {idx}</span>
                <div
                  className={`w-18 h-20 rounded-2xl border-2 flex flex-col items-center justify-center font-mono font-bold transition-all relative p-2 ${border} ${bg} ${text}`}
                >
                  <div className="text-xs text-emerald-400">+{g} gas</div>
                  <div className="text-xs text-rose-400">-{c} cost</div>
                  <div className="text-[10px] text-slate-400 mt-1 font-sans">
                    {net >= 0 ? `+${net}` : net}
                  </div>
                  {isCandidate && (
                    <span className="text-[8px] absolute -top-2 px-1 rounded bg-emerald-500 text-slate-950 font-sans font-bold">
                      START
                    </span>
                  )}
                </div>
              </div>
            );
          })}
        </div>

        {/* Global Net Balance Check */}
        <div className="bg-slate-950/80 border border-slate-800 rounded-xl px-5 py-2.5 flex items-center gap-4 text-xs text-slate-300">
          <span className="text-slate-400">Total Circuit Net Balance:</span>
          <span className={`font-mono font-bold ${step.totalTank >= 0 ? 'text-emerald-400' : 'text-rose-400'}`}>
            {step.totalTank >= 0 ? `+${step.totalTank} (Feasible)` : `${step.totalTank} (Infeasible)`}
          </span>
        </div>
      </div>

      {/* Step Explanation */}
      <div className="bg-slate-950 border border-slate-800 rounded-xl p-3 text-sm text-slate-300 flex items-center gap-2">
        <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse shrink-0" />
        <span>{step.explanation}</span>
      </div>
    </div>
  );
};
