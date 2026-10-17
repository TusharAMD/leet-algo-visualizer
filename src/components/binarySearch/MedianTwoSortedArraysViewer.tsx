import React from 'react';
import { MedianTwoSortedArraysStep } from '../../algorithms/medianTwoSortedArraysIntuitive';
import { Split, Trophy, CheckCircle2, ShieldCheck, AlertCircle } from 'lucide-react';

interface MedianTwoSortedArraysViewerProps {
  step: MedianTwoSortedArraysStep;
}

export const MedianTwoSortedArraysViewer: React.FC<MedianTwoSortedArraysViewerProps> = ({ step }) => {
  const { nums1, nums2, partitionA, partitionB, aLeft, aRight, bLeft, bRight, isValidPartition, median, isComplete } = step;

  const aLeftStr = aLeft === -Infinity ? '-∞' : `${aLeft}`;
  const aRightStr = aRight === Infinity ? '∞' : `${aRight}`;
  const bLeftStr = bLeft === -Infinity ? '-∞' : `${bLeft}`;
  const bRightStr = bRight === Infinity ? '∞' : `${bRight}`;

  return (
    <div className="flex-1 min-h-0 flex flex-col bg-slate-900/60 border border-slate-800 rounded-2xl p-3 shadow-xl overflow-hidden justify-between">
      {/* Top Banner */}
      <div className="bg-slate-950/70 border border-slate-800/80 rounded-xl p-2.5 flex items-center justify-between shrink-0">
        <div className="flex items-center gap-2">
          <span className="p-1.5 rounded-lg bg-indigo-500/10 text-indigo-400 border border-indigo-500/20">
            <Split className="w-4 h-4" />
          </span>
          <div>
            <h3 className="text-xs font-semibold text-white tracking-wide">{step.headline}</h3>
            <p className="text-[11px] text-slate-400">{step.subtext}</p>
          </div>
        </div>
        <div className="flex items-center gap-2">
          {isComplete ? (
            <span className="px-2 py-0.5 rounded-md bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 text-[11px] font-semibold flex items-center gap-1">
              <CheckCircle2 className="w-3.5 h-3.5" /> Median = {median}
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
        {/* Row 1: Array A Partition */}
        <div className="bg-slate-950/60 border border-slate-800/80 rounded-xl p-2.5 flex flex-col gap-1.5">
          <div className="flex items-center justify-between text-[10px] font-mono">
            <span className="uppercase font-bold tracking-wider text-indigo-400">Array A (Shorter):</span>
            <span className="text-slate-400">Partition cut at index: <span className="text-white font-bold">{partitionA >= 0 ? partitionA : '—'}</span></span>
          </div>

          <div className="flex items-center gap-1.5 overflow-x-auto py-1">
            {nums1.map((val, idx) => {
              const inLeftHalf = idx < partitionA;
              return (
                <React.Fragment key={idx}>
                  {idx === partitionA && (
                    <div className="w-[3px] h-9 bg-amber-400 rounded-full mx-1 shadow-lg shadow-amber-500/50" />
                  )}
                  <div
                    className={`px-3 py-1.5 rounded-lg border font-mono text-xs font-bold transition-all ${
                      inLeftHalf
                        ? 'bg-indigo-500/20 border-indigo-500/40 text-indigo-300'
                        : 'bg-slate-900 border-slate-800 text-slate-400'
                    }`}
                  >
                    {val}
                  </div>
                </React.Fragment>
              );
            })}
            {partitionA === nums1.length && (
              <div className="w-[3px] h-9 bg-amber-400 rounded-full mx-1 shadow-lg shadow-amber-500/50" />
            )}
          </div>
        </div>

        {/* Row 2: Array B Partition */}
        <div className="bg-slate-950/60 border border-slate-800/80 rounded-xl p-2.5 flex flex-col gap-1.5">
          <div className="flex items-center justify-between text-[10px] font-mono">
            <span className="uppercase font-bold tracking-wider text-cyan-400">Array B (Longer):</span>
            <span className="text-slate-400">Partition cut at index: <span className="text-white font-bold">{partitionB >= 0 ? partitionB : '—'}</span></span>
          </div>

          <div className="flex items-center gap-1.5 overflow-x-auto py-1">
            {nums2.map((val, idx) => {
              const inLeftHalf = idx < partitionB;
              return (
                <React.Fragment key={idx}>
                  {idx === partitionB && (
                    <div className="w-[3px] h-9 bg-amber-400 rounded-full mx-1 shadow-lg shadow-amber-500/50" />
                  )}
                  <div
                    className={`px-3 py-1.5 rounded-lg border font-mono text-xs font-bold transition-all ${
                      inLeftHalf
                        ? 'bg-cyan-500/20 border-cyan-500/40 text-cyan-300'
                        : 'bg-slate-900 border-slate-800 text-slate-400'
                    }`}
                  >
                    {val}
                  </div>
                </React.Fragment>
              );
            })}
            {partitionB === nums2.length && (
              <div className="w-[3px] h-9 bg-amber-400 rounded-full mx-1 shadow-lg shadow-amber-500/50" />
            )}
          </div>
        </div>

        {/* Row 3: Cross Invariant Radar */}
        {partitionA >= 0 && partitionB >= 0 && (
          <div className="bg-slate-950/60 border border-slate-800/80 rounded-xl p-2.5 flex items-center justify-around text-xs font-mono">
            <div className="flex items-center gap-2">
              <span className="text-slate-400">Aleft ≤ Bright:</span>
              <span
                className={`px-2 py-0.5 rounded font-bold ${
                  aLeft <= bRight ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/30' : 'bg-rose-500/20 text-rose-300 border border-rose-500/30'
                }`}
              >
                {aLeftStr} ≤ {bRightStr} {aLeft <= bRight ? '✓' : '✗'}
              </span>
            </div>

            <div className="flex items-center gap-2">
              <span className="text-slate-400">Bleft ≤ Aright:</span>
              <span
                className={`px-2 py-0.5 rounded font-bold ${
                  bLeft <= aRight ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/30' : 'bg-rose-500/20 text-rose-300 border border-rose-500/30'
                }`}
              >
                {bLeftStr} ≤ {aRightStr} {bLeft <= aRight ? '✓' : '✗'}
              </span>
            </div>
          </div>
        )}

        {/* Row 4: Median Spotlight */}
        <div className="bg-slate-950/60 border border-slate-800/80 rounded-xl p-2.5 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Trophy className="w-4 h-4 text-emerald-400" />
            <span className="text-xs font-mono font-bold text-slate-300">
              Evaluated Median:
            </span>
          </div>
          <div className="flex items-center gap-2">
            <span className="px-3 py-0.5 rounded-lg bg-emerald-500/20 border border-emerald-400/40 text-emerald-300 font-mono text-sm font-bold shadow-md shadow-emerald-500/10">
              {median !== null ? median : 'Partitioning...'}
            </span>
          </div>
        </div>
      </div>
    </div>
  );
};
