import React from 'react';
import { ContainsDuplicateStep } from '../../algorithms/containsDuplicateIntuitive';
import { ShieldCheck, CheckCircle2, AlertTriangle, Database, Zap } from 'lucide-react';

interface ContainsDuplicateViewerProps {
  step: ContainsDuplicateStep;
  nums: number[];
}

export const ContainsDuplicateViewer: React.FC<ContainsDuplicateViewerProps> = ({ step, nums }) => {
  const { currentIndex, currentNum, seen, isDuplicate, duplicateNum, collisionIndex, isComplete } = step;

  return (
    <div className="flex-1 min-h-0 flex flex-col bg-slate-900/60 border border-slate-800 rounded-2xl p-3 shadow-xl overflow-hidden justify-between">
      {/* Top Banner */}
      <div className="bg-slate-950/70 border border-slate-800/80 rounded-xl p-2.5 flex items-center justify-between shrink-0">
        <div className="flex items-center gap-2">
          <span className="p-1.5 rounded-lg bg-indigo-500/10 text-indigo-400 border border-indigo-500/20">
            <Zap className="w-4 h-4" />
          </span>
          <div>
            <h3 className="text-xs font-semibold text-white tracking-wide">{step.headline}</h3>
            <p className="text-[11px] text-slate-400">{step.subtext}</p>
          </div>
        </div>
        <div className="flex items-center gap-2">
          {isComplete ? (
            isDuplicate ? (
              <span className="px-2 py-0.5 rounded-md bg-rose-500/10 border border-rose-500/20 text-rose-400 text-[11px] font-semibold flex items-center gap-1">
                <AlertTriangle className="w-3.5 h-3.5" /> Duplicate Exists (True)
              </span>
            ) : (
              <span className="px-2 py-0.5 rounded-md bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 text-[11px] font-semibold flex items-center gap-1">
                <ShieldCheck className="w-3.5 h-3.5" /> All Unique (False)
              </span>
            )
          ) : (
            <span className="px-2 py-0.5 rounded-md bg-indigo-500/10 border border-indigo-500/20 text-indigo-400 text-[11px] font-mono">
              Step {step.stepIndex + 1} / {step.totalSteps}
            </span>
          )}
        </div>
      </div>

      {/* Main Visual Arena */}
      <div className="flex-1 min-h-0 flex flex-col justify-center gap-3 py-2 px-3">
        {/* Array Strip */}
        <div className="flex flex-col gap-1">
          <span className="text-[10px] uppercase font-mono font-bold tracking-wider text-slate-400">
            Input Array (Scanning left to right):
          </span>
          <div className="flex items-center gap-2 overflow-x-auto pb-1">
            {nums.map((num, idx) => {
              const isScanning = currentIndex === idx;
              const isCollision1 = collisionIndex === idx;
              const isCollision2 = isDuplicate && isScanning;

              return (
                <div key={idx} className="flex flex-col items-center">
                  <div
                    className={`w-12 h-12 md:w-14 md:h-14 rounded-2xl border-2 flex flex-col items-center justify-center transition-all duration-300 relative ${
                      isCollision2
                        ? 'border-rose-500 bg-rose-500/30 scale-110 shadow-lg shadow-rose-500/30 ring-2 ring-rose-400 animate-pulse'
                        : isCollision1
                        ? 'border-amber-400 bg-amber-500/20 scale-105 shadow-md shadow-amber-500/20 ring-2 ring-amber-300'
                        : isScanning
                        ? 'border-indigo-400 bg-indigo-950/80 scale-105 ring-2 ring-indigo-400'
                        : idx < currentIndex
                        ? 'border-slate-700 bg-slate-900/60 text-slate-400'
                        : 'border-slate-800 bg-slate-950/80 text-slate-500'
                    }`}
                  >
                    <span className="text-[9px] font-mono text-slate-500">[{idx}]</span>
                    <span className="text-base font-bold font-mono text-white">{num}</span>

                    {isCollision2 && (
                      <span className="absolute -top-2.5 px-1 py-0.2 rounded bg-rose-500 text-[8px] font-bold text-white uppercase tracking-wider">
                        DUPLICATE!
                      </span>
                    )}
                    {isCollision1 && (
                      <span className="absolute -top-2.5 px-1 py-0.2 rounded bg-amber-500 text-[8px] font-bold text-slate-950 uppercase tracking-wider">
                        FIRST SEEN
                      </span>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Seen Vault Hash Set */}
        <div className="bg-slate-950/80 border border-slate-800/80 rounded-xl p-3 flex flex-col gap-2">
          <div className="flex items-center justify-between text-xs">
            <span className="text-indigo-400 font-bold font-mono flex items-center gap-1.5">
              <Database className="w-3.5 h-3.5" /> Seen Vault (Hash Set - O(1) Lookups):
            </span>
            <span className="text-[11px] font-mono text-slate-500">
              {seen.length} elements vaulted
            </span>
          </div>

          <div className="flex items-center gap-2 flex-wrap min-h-10">
            {seen.length === 0 ? (
              <span className="text-slate-600 italic text-xs">Hash set is empty...</span>
            ) : (
              seen.map((item, idx) => {
                const isConflictItem = isDuplicate && item === duplicateNum;
                return (
                  <span
                    key={idx}
                    className={`px-3 py-1 rounded-xl border text-xs font-mono font-bold transition-all duration-300 ${
                      isConflictItem
                        ? 'border-rose-500 bg-rose-500/20 text-rose-300 shadow-md shadow-rose-500/20 ring-2 ring-rose-400 animate-bounce'
                        : 'border-emerald-500/40 bg-emerald-500/10 text-emerald-300'
                    }`}
                  >
                    {item}
                  </span>
                );
              })
            )}
          </div>
        </div>
      </div>

      {/* Mental Model Explainer Card */}
      <div className="bg-slate-950/80 border border-slate-800/80 rounded-xl p-2.5 flex items-center justify-between gap-3 text-xs shrink-0">
        <div className="flex items-center gap-2">
          <span className="text-indigo-400 font-bold font-mono">Set Lookup:</span>
          <span className="text-slate-300">
            Instead of checking all previous items in $O(n^2)$, hash sets compute an instant hash index to confirm membership in average $O(1)$ time.
          </span>
        </div>
        <div className="flex items-center gap-3 shrink-0 text-[11px] font-mono text-slate-400">
          <span className="text-emerald-400 font-bold">Time: O(n)</span>
          <span className="text-indigo-400 font-bold">Space: O(n)</span>
        </div>
      </div>
    </div>
  );
};
