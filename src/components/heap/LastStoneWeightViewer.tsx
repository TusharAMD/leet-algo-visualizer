import React from 'react';
import { LastStoneStep } from '../../algorithms/lastStoneWeightIntuitive';
import { Hammer, CheckCircle2, Flame, Trophy, Zap, ArrowDown } from 'lucide-react';

interface LastStoneWeightViewerProps {
  step: LastStoneStep;
}

export const LastStoneWeightViewer: React.FC<LastStoneWeightViewerProps> = ({ step }) => {
  const { stonesHeap, stone1, stone2, smashedDiff, isDestroyed, lastStoneRemaining, isComplete } = step;

  return (
    <div className="flex-1 min-h-0 flex flex-col bg-slate-900/60 border border-slate-800 rounded-2xl p-3 shadow-xl overflow-hidden justify-between">
      {/* Top Banner */}
      <div className="bg-slate-950/70 border border-slate-800/80 rounded-xl p-2.5 flex items-center justify-between shrink-0">
        <div className="flex items-center gap-2">
          <span className="p-1.5 rounded-lg bg-amber-500/10 text-amber-400 border border-amber-500/20">
            <Hammer className="w-4 h-4" />
          </span>
          <div>
            <h3 className="text-xs font-semibold text-white tracking-wide">{step.headline}</h3>
            <p className="text-[11px] text-slate-400">{step.subtext}</p>
          </div>
        </div>
        <div className="flex items-center gap-2">
          {isComplete ? (
            <span className="px-2 py-0.5 rounded-md bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 text-[11px] font-semibold flex items-center gap-1">
              <Trophy className="w-3.5 h-3.5" /> Result: {lastStoneRemaining}
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
        {/* Smash Collision Arena */}
        <div className="bg-slate-950/80 border border-slate-800 rounded-2xl p-3 flex flex-col items-center justify-center min-h-[110px] relative overflow-hidden">
          {stone1 !== null && stone2 !== null ? (
            <div className="flex items-center gap-6">
              {/* Stone 1 */}
              <div className="flex flex-col items-center gap-1">
                <span className="text-[10px] font-mono text-amber-400 uppercase font-bold">Stone Y (Heaviest)</span>
                <div className="w-14 h-14 rounded-2xl bg-amber-500/20 border-2 border-amber-400 text-amber-100 font-mono text-lg font-bold flex items-center justify-center shadow-lg shadow-amber-500/20 animate-bounce">
                  {stone1}
                </div>
              </div>

              {/* Smash Icon / Collision */}
              <div className="flex flex-col items-center">
                {isDestroyed ? (
                  <div className="flex flex-col items-center text-rose-400 animate-pulse">
                    <Flame className="w-6 h-6" />
                    <span className="text-[10px] font-mono font-bold mt-1">DESTROYED</span>
                  </div>
                ) : smashedDiff !== null ? (
                  <div className="flex flex-col items-center text-emerald-400">
                    <Zap className="w-6 h-6" />
                    <span className="text-[10px] font-mono font-bold mt-1">Diff: {smashedDiff}</span>
                  </div>
                ) : (
                  <Hammer className="w-6 h-6 text-slate-500 animate-pulse" />
                )}
              </div>

              {/* Stone 2 */}
              <div className="flex flex-col items-center gap-1">
                <span className="text-[10px] font-mono text-indigo-400 uppercase font-bold">Stone X (2nd)</span>
                <div className="w-14 h-14 rounded-2xl bg-indigo-500/20 border-2 border-indigo-400 text-indigo-100 font-mono text-lg font-bold flex items-center justify-center shadow-lg shadow-indigo-500/20 animate-bounce">
                  {stone2}
                </div>
              </div>
            </div>
          ) : (
            <div className="text-slate-500 text-xs font-mono flex items-center gap-2">
              <Hammer className="w-4 h-4 text-slate-600" />
              <span>Smash arena idle — waiting for heaviest stones extraction...</span>
            </div>
          )}
        </div>

        {/* Max-Heap Inventory Display */}
        <div className="bg-slate-950/60 border border-slate-800/80 rounded-xl p-3 flex flex-col gap-2">
          <div className="flex items-center justify-between">
            <span className="text-[10px] uppercase font-mono font-bold tracking-wider text-slate-400">
              Max-Heap In-Memory (Descending Order):
            </span>
            <span className="text-[11px] font-mono text-slate-500">
              {stonesHeap.length} stone(s) left
            </span>
          </div>

          <div className="flex items-center gap-2 overflow-x-auto py-1 min-h-[48px]">
            {stonesHeap.length === 0 ? (
              <span className="text-slate-600 font-mono text-xs italic">
                {isComplete ? 'All stones annihilated! (Weight = 0)' : 'Heap empty...'}
              </span>
            ) : (
              stonesHeap.map((weight, idx) => {
                const isSurvivor = isComplete && idx === 0;
                return (
                  <div
                    key={idx}
                    className={`w-11 h-11 rounded-xl border font-mono text-sm font-bold flex flex-col items-center justify-center transition-all ${
                      isSurvivor
                        ? 'bg-emerald-500/30 border-emerald-400 text-emerald-100 ring-4 ring-emerald-500/40 scale-110 shadow-lg shadow-emerald-500/25'
                        : idx === 0
                        ? 'bg-amber-500/20 border-amber-500/40 text-amber-200'
                        : 'bg-slate-900 border-slate-800 text-slate-300'
                    }`}
                  >
                    <span>{weight}</span>
                    {idx === 0 && !isComplete && (
                      <span className="text-[8px] text-amber-400 font-normal">top</span>
                    )}
                  </div>
                );
              })
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
