import React from 'react';
import type { MergeTripletsStep } from '../../algorithms/mergeTripletsIntuitive';

interface MergeTripletsViewerProps {
  step: MergeTripletsStep;
  triplets: [number, number, number][];
  target: [number, number, number];
}

export const MergeTripletsViewer: React.FC<MergeTripletsViewerProps> = ({
  step,
  triplets,
  target,
}) => {
  return (
    <div className="flex flex-col h-full gap-4 p-4 select-none">
      {/* Top Status & Variable Badges */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
        <div className="bg-slate-900 border border-slate-800 rounded-xl p-3 flex flex-col justify-center">
          <span className="text-xs text-slate-400 font-medium">Target Triplet</span>
          <span className="text-base font-mono font-bold text-amber-300">
            [{target.join(', ')}]
          </span>
        </div>
        <div className="bg-slate-900 border border-slate-800 rounded-xl p-3 flex flex-col justify-center">
          <span className="text-xs text-slate-400 font-medium">Current Triplet</span>
          <span className="text-base font-mono font-bold text-sky-400">
            {step.currentIndex >= 0 ? `[${step.currentTriplet.join(', ')}]` : '—'}
          </span>
        </div>
        <div className="bg-slate-900 border border-slate-800 rounded-xl p-3 flex flex-col justify-center">
          <span className="text-xs text-slate-400 font-medium">Matched Positions</span>
          <span className="text-base font-mono font-bold text-indigo-300">
            {step.matchedIndices.length} / 3 ({step.matchedIndices.map((i) => `dim ${i}`).join(', ') || 'none'})
          </span>
        </div>
        <div className="bg-slate-900 border border-slate-800 rounded-xl p-3 flex flex-col justify-center">
          <span className="text-xs text-slate-400 font-medium">Target Achievable</span>
          <span className={`text-2xl font-mono font-black ${step.matchedIndices.length === 3 ? 'text-emerald-400' : 'text-slate-400'}`}>
            {step.matchedIndices.length === 3 ? 'True' : 'Checking'}
          </span>
        </div>
      </div>

      {/* Main Canvas: Target Dimensions Alignment + Triplets List */}
      <div className="flex-1 bg-slate-900/60 border border-slate-800 rounded-xl p-6 flex flex-col justify-center items-center gap-6 relative overflow-auto">
        {/* Target 3 Dimensions Check Card */}
        <div className="flex flex-col items-center gap-2">
          <div className="text-xs font-semibold text-slate-400 uppercase tracking-wider">
            Target Dimensions Lock Status
          </div>
          <div className="flex items-center gap-4">
            {[0, 1, 2].map((dim) => {
              const isLocked = step.matchedIndices.includes(dim);
              return (
                <div
                  key={dim}
                  className={`px-5 py-3 rounded-xl border-2 flex flex-col items-center gap-1 transition-all ${
                    isLocked
                      ? 'border-emerald-500 bg-emerald-950/70 text-emerald-200 ring-2 ring-emerald-500/30'
                      : 'border-slate-800 bg-slate-950/60 text-slate-400'
                  }`}
                >
                  <span className="text-[10px] font-sans text-slate-500 uppercase">
                    Dimension {dim}
                  </span>
                  <span className="font-mono text-xl font-bold">
                    target[{dim}] = {target[dim]}
                  </span>
                  <span className={`text-xs font-semibold ${isLocked ? 'text-emerald-400' : 'text-slate-500'}`}>
                    {isLocked ? '✓ Matched' : '○ Pending'}
                  </span>
                </div>
              );
            })}
          </div>
        </div>

        {/* Triplets List */}
        <div className="flex flex-col items-center gap-2 max-w-full">
          <div className="text-xs font-semibold text-slate-400 uppercase tracking-wider">
            Triplets Stream (Usable vs Discarded)
          </div>
          <div className="flex flex-wrap gap-2.5 justify-center max-h-48 overflow-y-auto p-2">
            {triplets.map((t, idx) => {
              const isCurrent = idx === step.currentIndex;
              const exceeds =
                t[0] > target[0] || t[1] > target[1] || t[2] > target[2];
              const isPast = idx <= step.currentIndex;

              let border = 'border-slate-800';
              let bg = 'bg-slate-950/60';
              let text = 'text-slate-400';

              if (isCurrent) {
                border = step.isUsable
                  ? 'border-emerald-400 ring-4 ring-emerald-400/40'
                  : 'border-rose-400 ring-4 ring-rose-400/40';
                bg = step.isUsable ? 'bg-emerald-950/80' : 'bg-rose-950/80';
                text = step.isUsable ? 'text-emerald-200' : 'text-rose-200';
              } else if (isPast && exceeds) {
                border = 'border-rose-900/60 opacity-40';
                bg = 'bg-rose-950/20';
                text = 'text-rose-400 line-through';
              } else if (isPast && !exceeds) {
                border = 'border-emerald-700/60';
                bg = 'bg-emerald-950/40';
                text = 'text-emerald-300';
              }

              return (
                <div
                  key={idx}
                  className={`px-3 py-1.5 rounded-xl border font-mono text-xs flex items-center gap-1.5 transition-all ${border} ${bg} ${text}`}
                >
                  <span>[{t.join(', ')}]</span>
                  {isCurrent && (
                    <span className="text-[9px] font-sans font-bold px-1 rounded bg-slate-900">
                      {step.isUsable ? 'VALID' : 'EXCEEDS'}
                    </span>
                  )}
                </div>
              );
            })}
          </div>
        </div>

        {/* Merged So Far */}
        <div className="bg-slate-950/80 border border-slate-800 rounded-xl px-5 py-2 flex items-center gap-3 text-xs text-slate-300">
          <span className="text-slate-400">Current Element-wise Max:</span>
          <span className="font-mono font-bold text-indigo-300">
            [{step.mergedSoFar.join(', ')}]
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
