import React from 'react';
import type { PartitionLabelsStep } from '../../algorithms/partitionLabelsIntuitive';

interface PartitionLabelsViewerProps {
  step: PartitionLabelsStep;
  s: string;
}

export const PartitionLabelsViewer: React.FC<PartitionLabelsViewerProps> = ({
  step,
  s,
}) => {
  return (
    <div className="flex flex-col h-full gap-4 p-4 select-none">
      {/* Top Status & Variable Badges */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
        <div className="bg-slate-900 border border-slate-800 rounded-xl p-3 flex flex-col justify-center">
          <span className="text-xs text-slate-400 font-medium">Scanning Character</span>
          <span className="text-base font-mono font-bold text-sky-400">
            {step.currentIndex >= 0 ? `idx ${step.currentIndex}: '${step.currentChar}'` : '—'}
          </span>
        </div>
        <div className="bg-slate-900 border border-slate-800 rounded-xl p-3 flex flex-col justify-center">
          <span className="text-xs text-slate-400 font-medium">Last Occurrence</span>
          <span className="text-base font-mono font-bold text-amber-300">
            {step.currentChar ? `last['${step.currentChar}'] = ${step.charLastIdx}` : '—'}
          </span>
        </div>
        <div className="bg-slate-900 border border-slate-800 rounded-xl p-3 flex flex-col justify-center">
          <span className="text-xs text-slate-400 font-medium">Partition Window</span>
          <span className="text-base font-mono font-bold text-indigo-300">
            [{step.start} .. {step.end}]
          </span>
        </div>
        <div className="bg-slate-900 border border-slate-800 rounded-xl p-3 flex flex-col justify-center">
          <span className="text-xs text-slate-400 font-medium">Partitions Count</span>
          <span className="text-2xl font-mono font-black text-emerald-400">
            {step.partitions.length}
          </span>
        </div>
      </div>

      {/* Main String Canvas with Windows & Cut Lines */}
      <div className="flex-1 bg-slate-900/60 border border-slate-800 rounded-xl p-6 flex flex-col justify-center items-center gap-8 relative overflow-hidden">
        {step.isPartitionCut && (
          <div className="bg-emerald-950/70 border border-emerald-500/50 px-4 py-2 rounded-xl text-emerald-300 text-xs font-semibold animate-pulse">
            ✂️ Partition Cut at index {step.currentIndex}! Locked partition of length {step.end - step.start + 1}.
          </div>
        )}

        {/* String Characters Row */}
        <div className="flex flex-col items-center gap-2">
          <div className="text-xs font-semibold text-slate-400 uppercase tracking-wider">
            String Characters with Dynamic Partition Boundaries
          </div>
          <div className="flex items-center gap-1.5 flex-wrap justify-center">
            {s.split('').map((char, idx) => {
              const isCurrent = idx === step.currentIndex;
              const inCurrentWindow = idx >= step.start && idx <= step.end;
              const isWindowEnd = idx === step.end;

              let border = 'border-slate-800';
              let bg = 'bg-slate-950/60';
              let text = 'text-slate-400';

              if (isCurrent) {
                border = 'border-amber-400 ring-4 ring-amber-400/40';
                bg = 'bg-amber-950/80';
                text = 'text-amber-200';
              } else if (isWindowEnd) {
                border = 'border-indigo-400 ring-2 ring-indigo-400/30';
                bg = 'bg-indigo-950/60';
                text = 'text-indigo-200';
              } else if (inCurrentWindow) {
                border = 'border-sky-500/70';
                bg = 'bg-sky-950/40';
                text = 'text-sky-200';
              }

              return (
                <div key={idx} className="flex flex-col items-center gap-1">
                  <span className="text-[10px] font-mono text-slate-500">{idx}</span>
                  <div
                    className={`w-11 h-14 rounded-xl border-2 flex flex-col items-center justify-center font-mono font-bold text-lg transition-all relative ${border} ${bg} ${text}`}
                  >
                    <span>{char}</span>
                    {isWindowEnd && (
                      <span className="text-[7px] text-indigo-300 absolute -bottom-1">
                        END
                      </span>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Partition Sizes List */}
        <div className="bg-slate-950/80 border border-slate-800 rounded-xl px-5 py-3 flex items-center gap-4 text-xs text-slate-300">
          <span className="text-slate-400">Partition Sizes:</span>
          <div className="flex items-center gap-2">
            {step.partitions.length === 0 ? (
              <span className="text-slate-500 italic">None yet...</span>
            ) : (
              step.partitions.map((sz, idx) => (
                <span
                  key={idx}
                  className="px-2.5 py-1 rounded bg-emerald-950/80 border border-emerald-600/60 text-emerald-300 font-mono font-bold text-sm"
                >
                  {sz}
                </span>
              ))
            )}
          </div>
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
