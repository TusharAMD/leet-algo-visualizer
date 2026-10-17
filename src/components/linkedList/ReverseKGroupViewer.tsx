import React from 'react';
import { ReverseKGroupStep } from '../../algorithms/reverseKGroupIntuitive';
import { Repeat, CheckCircle2, ArrowRight, Layers, Split, ShieldAlert } from 'lucide-react';

interface ReverseKGroupViewerProps {
  step: ReverseKGroupStep;
}

export const ReverseKGroupViewer: React.FC<ReverseKGroupViewerProps> = ({ step }) => {
  const {
    initialList,
    currentList,
    k,
    groupIndex,
    groupStart,
    groupEnd,
    activeReversingRange,
    isPartialRemaining,
    headline,
    subtext,
    isComplete,
    stepIndex,
    totalSteps
  } = step;

  return (
    <div className="flex-1 min-h-0 flex flex-col bg-slate-900/60 border border-slate-800 rounded-2xl p-3 shadow-xl overflow-hidden justify-between">
      {/* Top Banner */}
      <div className="bg-slate-950/70 border border-slate-800/80 rounded-xl p-2.5 flex items-center justify-between shrink-0">
        <div className="flex items-center gap-2">
          <span className="p-1.5 rounded-lg bg-indigo-500/10 text-indigo-400 border border-indigo-500/20">
            <Repeat className="w-4 h-4" />
          </span>
          <div>
            <h3 className="text-xs font-semibold text-white tracking-wide">{headline}</h3>
            <p className="text-[11px] text-slate-400">{subtext}</p>
          </div>
        </div>
        <div className="flex items-center gap-2">
          {isComplete ? (
            <span className="px-2 py-0.5 rounded-md bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 text-[11px] font-semibold flex items-center gap-1">
              <CheckCircle2 className="w-3.5 h-3.5" /> All Groups Reversed
            </span>
          ) : (
            <span className="px-2 py-0.5 rounded-md bg-indigo-500/10 border border-indigo-500/20 text-indigo-400 text-[11px] font-mono">
              Step {stepIndex + 1} / {totalSteps}
            </span>
          )}
        </div>
      </div>

      {/* Arena: Current Linked List with k-Group Highlighting */}
      <div className="flex-1 min-h-0 flex flex-col justify-between py-2 gap-2">
        {/* Current Linked List State */}
        <div className="bg-slate-950/60 border border-slate-800 rounded-xl p-3 flex-1 flex flex-col justify-between">
          <div className="flex items-center justify-between border-b border-slate-800/70 pb-1.5 shrink-0">
            <span className="text-xs font-semibold text-slate-300 flex items-center gap-1.5">
              <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
              Active Linked List (k = {k})
            </span>
            <span className="text-[10px] font-mono text-slate-400">
              {currentList.length} Nodes Total
            </span>
          </div>

          {/* Node Capsules with Arrows */}
          <div className="flex-1 flex items-center justify-center overflow-x-auto py-3">
            <div className="flex items-center gap-1.5">
              {/* Dummy Node */}
              <div className="flex flex-col items-center">
                <span className="text-[8px] text-slate-500 font-mono">dummy</span>
                <div className="w-9 h-9 rounded-xl bg-slate-900 border border-dashed border-slate-700 text-slate-500 flex items-center justify-center font-mono text-xs">
                  0
                </div>
              </div>
              <span className="text-slate-600 text-xs">→</span>

              {/* List Nodes */}
              {currentList.map((val, idx) => {
                const inActiveRange =
                  groupStart !== null &&
                  groupEnd !== null &&
                  idx >= groupStart &&
                  idx <= groupEnd;
                const isKthNode = idx === groupEnd && !isPartialRemaining;
                const isGroupHead = idx === groupStart && !isPartialRemaining;

                return (
                  <React.Fragment key={idx}>
                    <div className="flex flex-col items-center">
                      <span className="text-[8px] font-mono text-slate-500">
                        {isGroupHead ? (
                          <span className="text-amber-400 font-bold">head</span>
                        ) : isKthNode ? (
                          <span className="text-indigo-400 font-bold">k-th</span>
                        ) : (
                          `#${idx + 1}`
                        )}
                      </span>
                      <div
                        className={`w-11 h-11 rounded-2xl flex items-center justify-center font-mono font-bold text-sm border shadow-md transition-all ${
                          isPartialRemaining && inActiveRange
                            ? 'bg-slate-850 border-slate-700 text-slate-400'
                            : inActiveRange
                            ? 'bg-amber-500/20 border-amber-400 text-amber-200 ring-2 ring-amber-400/50 scale-105'
                            : idx < (groupStart ?? currentList.length)
                            ? 'bg-emerald-500/10 border-emerald-500/40 text-emerald-300'
                            : 'bg-slate-900 border-slate-800 text-slate-200'
                        }`}
                      >
                        {val}
                      </div>
                    </div>
                    {idx < currentList.length - 1 && (
                      <span className="text-slate-600 text-xs">→</span>
                    )}
                  </React.Fragment>
                );
              })}
              <span className="text-slate-600 text-xs">→ NULL</span>
            </div>
          </div>

          <div className="text-[10px] text-slate-500 bg-slate-900/80 rounded-lg p-1.5 border border-slate-800/60 text-center shrink-0">
            Invariant: Exactly k nodes are reversed per iteration. If fewer than k nodes remain at the end, they stay unaltered!
          </div>
        </div>

        {/* Reference: Initial List */}
        <div className="bg-slate-950/40 border border-slate-800/70 rounded-xl p-2 shrink-0 flex items-center justify-between text-xs">
          <div className="flex items-center gap-2">
            <span className="text-[10px] uppercase font-bold text-slate-500">Initial:</span>
            <span className="font-mono text-slate-400 text-xs">
              [{initialList.join(' → ')}]
            </span>
          </div>
          <div className="flex items-center gap-3">
            <span className="text-[10px] text-emerald-400 flex items-center gap-1">
              <span className="w-2 h-2 rounded-full bg-emerald-400" /> Done Group
            </span>
            <span className="text-[10px] text-amber-400 flex items-center gap-1">
              <span className="w-2 h-2 rounded-full bg-amber-400" /> Active Group
            </span>
          </div>
        </div>
      </div>
    </div>
  );
};
