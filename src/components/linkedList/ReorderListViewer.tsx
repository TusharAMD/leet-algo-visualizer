import React from 'react';
import { ReorderListStep } from '../../algorithms/reorderListIntuitive';
import { Shuffle, ArrowRight, CheckCircle2, Split, RefreshCw, Layers } from 'lucide-react';

interface ReorderListViewerProps {
  step: ReorderListStep;
}

export const ReorderListViewer: React.FC<ReorderListViewerProps> = ({ step }) => {
  const { phase, initialNodes, firstHalf, secondHalf, reorderedNodes, slowIdx, fastIdx, isComplete } = step;

  const phaseColors: Record<string, { bg: string; border: string; text: string; icon: any; label: string }> = {
    FIND_MID: {
      bg: 'bg-indigo-500/10',
      border: 'border-indigo-500/30',
      text: 'text-indigo-400',
      icon: Split,
      label: 'Phase 1: Find Middle (Slow & Fast)'
    },
    REVERSE_SECOND: {
      bg: 'bg-amber-500/10',
      border: 'border-amber-500/30',
      text: 'text-amber-400',
      icon: RefreshCw,
      label: 'Phase 2: Reverse Second Half'
    },
    MERGE: {
      bg: 'bg-cyan-500/10',
      border: 'border-cyan-500/30',
      text: 'text-cyan-400',
      icon: Layers,
      label: 'Phase 3: Interleave Merge'
    },
    COMPLETE: {
      bg: 'bg-emerald-500/10',
      border: 'border-emerald-500/30',
      text: 'text-emerald-400',
      icon: CheckCircle2,
      label: 'Reorder Finished'
    }
  };

  const currentPhaseInfo = phaseColors[phase] || phaseColors.FIND_MID;
  const PhaseIcon = currentPhaseInfo.icon;

  return (
    <div className="flex-1 min-h-0 flex flex-col bg-slate-900/60 border border-slate-800 rounded-2xl p-3 shadow-xl overflow-hidden justify-between">
      {/* Top Banner */}
      <div className="bg-slate-950/70 border border-slate-800/80 rounded-xl p-2.5 flex items-center justify-between shrink-0">
        <div className="flex items-center gap-2">
          <span className={`p-1.5 rounded-lg ${currentPhaseInfo.bg} ${currentPhaseInfo.text} border ${currentPhaseInfo.border}`}>
            <PhaseIcon className="w-4 h-4" />
          </span>
          <div>
            <div className="flex items-center gap-2">
              <h3 className="text-xs font-semibold text-white tracking-wide">{step.headline}</h3>
              <span className={`text-[10px] font-mono px-2 py-0.5 rounded-full ${currentPhaseInfo.bg} ${currentPhaseInfo.text} border ${currentPhaseInfo.border}`}>
                {currentPhaseInfo.label}
              </span>
            </div>
            <p className="text-[11px] text-slate-400">{step.subtext}</p>
          </div>
        </div>
        <div className="flex items-center gap-2">
          {isComplete ? (
            <span className="px-2 py-0.5 rounded-md bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 text-[11px] font-semibold flex items-center gap-1">
              <CheckCircle2 className="w-3.5 h-3.5" /> Reordered ({reorderedNodes.length} Nodes)
            </span>
          ) : (
            <span className="px-2 py-0.5 rounded-md bg-indigo-500/10 border border-indigo-500/20 text-indigo-400 text-[11px] font-mono">
              Step {step.stepIndex + 1} / {step.totalSteps}
            </span>
          )}
        </div>
      </div>

      {/* Arena */}
      <div className="flex-1 min-h-0 flex flex-col justify-around gap-2 py-2 px-3">
        {/* Row 1: Original Linked List with Slow & Fast pointers */}
        <div className="bg-slate-950/60 border border-slate-800/80 rounded-xl p-2.5 flex flex-col gap-1.5">
          <div className="flex items-center justify-between">
            <span className="text-[10px] uppercase font-mono font-bold tracking-wider text-slate-400">
              Original List State:
            </span>
            <div className="flex items-center gap-3 text-[10px] font-mono">
              <span className="flex items-center gap-1 text-indigo-400">
                <span className="w-2 h-2 rounded-full bg-indigo-400 animate-pulse"></span> Slow (1x)
              </span>
              <span className="flex items-center gap-1 text-pink-400">
                <span className="w-2 h-2 rounded-full bg-pink-400 animate-pulse"></span> Fast (2x)
              </span>
            </div>
          </div>
          <div className="flex items-center gap-2 overflow-x-auto py-1">
            {initialNodes.map((val, idx) => {
              const isSlow = slowIdx === idx;
              const isFast = fastIdx === idx;

              let borderClass = 'border-slate-800 bg-slate-900/80 text-slate-200';
              if (isSlow && isFast) {
                borderClass = 'border-amber-400 bg-amber-500/20 text-amber-200 ring-2 ring-amber-400/50';
              } else if (isSlow) {
                borderClass = 'border-indigo-400 bg-indigo-500/20 text-indigo-200 ring-2 ring-indigo-400/50';
              } else if (isFast) {
                borderClass = 'border-pink-400 bg-pink-500/20 text-pink-200 ring-2 ring-pink-400/50';
              }

              return (
                <React.Fragment key={idx}>
                  <div className="flex flex-col items-center">
                    <div className={`w-9 h-9 rounded-lg border font-mono text-xs font-bold flex items-center justify-center transition-all ${borderClass}`}>
                      {val}
                    </div>
                    <div className="h-4 flex items-center gap-0.5 text-[9px] font-mono mt-0.5 font-bold">
                      {isSlow && <span className="text-indigo-400">S</span>}
                      {isSlow && isFast && <span className="text-slate-500">|</span>}
                      {isFast && <span className="text-pink-400">F</span>}
                    </div>
                  </div>
                  {idx < initialNodes.length - 1 && (
                    <ArrowRight className="w-3.5 h-3.5 text-slate-600 shrink-0 mb-4" />
                  )}
                </React.Fragment>
              );
            })}
          </div>
        </div>

        {/* Row 2: Two halves status when splitting / reversing */}
        <div className="grid grid-cols-2 gap-2.5">
          {/* First Half */}
          <div className="bg-slate-950/60 border border-slate-800/80 rounded-xl p-2 flex flex-col gap-1">
            <span className="text-[10px] uppercase font-mono font-bold tracking-wider text-indigo-400">
              First Half (L0, L1, …):
            </span>
            <div className="flex items-center gap-1.5 overflow-x-auto min-h-[36px]">
              {firstHalf.length === 0 ? (
                <span className="text-slate-600 font-mono text-xs italic">Exhausted</span>
              ) : (
                firstHalf.map((val, idx) => (
                  <React.Fragment key={idx}>
                    <div className="w-8 h-8 rounded-md bg-indigo-500/10 border border-indigo-500/30 font-mono text-xs font-bold text-indigo-300 flex items-center justify-center">
                      {val}
                    </div>
                    {idx < firstHalf.length - 1 && (
                      <ArrowRight className="w-3 h-3 text-slate-700 shrink-0" />
                    )}
                  </React.Fragment>
                ))
              )}
            </div>
          </div>

          {/* Second Half (Reversed) */}
          <div className="bg-slate-950/60 border border-slate-800/80 rounded-xl p-2 flex flex-col gap-1">
            <span className="text-[10px] uppercase font-mono font-bold tracking-wider text-amber-400">
              Second Half (Reversed Ln, Ln-1, …):
            </span>
            <div className="flex items-center gap-1.5 overflow-x-auto min-h-[36px]">
              {secondHalf.length === 0 ? (
                <span className="text-slate-600 font-mono text-xs italic">Exhausted</span>
              ) : (
                secondHalf.map((val, idx) => (
                  <React.Fragment key={idx}>
                    <div className="w-8 h-8 rounded-md bg-amber-500/10 border border-amber-500/30 font-mono text-xs font-bold text-amber-300 flex items-center justify-center">
                      {val}
                    </div>
                    {idx < secondHalf.length - 1 && (
                      <ArrowRight className="w-3 h-3 text-slate-700 shrink-0" />
                    )}
                  </React.Fragment>
                ))
              )}
            </div>
          </div>
        </div>

        {/* Row 3: Resulting Reordered Chain */}
        <div className="bg-slate-950/80 border border-emerald-500/20 rounded-xl p-2.5 flex flex-col gap-1.5">
          <div className="flex items-center justify-between">
            <span className="text-[10px] uppercase font-mono font-bold tracking-wider text-emerald-400 flex items-center gap-1.5">
              <Shuffle className="w-3.5 h-3.5" /> Reordered Chain (L0 → Ln → L1 → Ln-1 …):
            </span>
            <span className="text-[11px] font-mono text-emerald-300/80">
              {reorderedNodes.length} nodes connected
            </span>
          </div>
          <div className="flex items-center gap-2 overflow-x-auto py-1 min-h-[44px]">
            {reorderedNodes.length === 0 ? (
              <span className="text-slate-600 text-xs italic font-mono">
                Pointers interleaving will appear here...
              </span>
            ) : (
              reorderedNodes.map((val, idx) => {
                const isEven = idx % 2 === 0;
                return (
                  <React.Fragment key={idx}>
                    <div
                      className={`w-9 h-9 rounded-lg border font-mono text-xs font-bold flex items-center justify-center transition-all ${
                        isEven
                          ? 'bg-indigo-500/20 border-indigo-500/40 text-indigo-200'
                          : 'bg-amber-500/20 border-amber-500/40 text-amber-200'
                      }`}
                    >
                      {val}
                    </div>
                    {idx < reorderedNodes.length - 1 && (
                      <ArrowRight className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
                    )}
                  </React.Fragment>
                );
              })
            )}
            {isComplete && reorderedNodes.length > 0 && (
              <span className="text-[11px] font-mono text-slate-500 ml-1">→ None</span>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
