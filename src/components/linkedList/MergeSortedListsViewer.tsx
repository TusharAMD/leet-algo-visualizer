import React from 'react';
import { MergeSortedListsStep } from '../../algorithms/mergeSortedListsIntuitive';
import { GitMerge, ArrowRight, CheckCircle2, ShieldCheck, Zap } from 'lucide-react';

interface MergeSortedListsViewerProps {
  step: MergeSortedListsStep;
}

export const MergeSortedListsViewer: React.FC<MergeSortedListsViewerProps> = ({ step }) => {
  const { list1, list2, l1Idx, l2Idx, mergedList, tailVal, chosenFrom, isComplete } = step;

  return (
    <div className="flex-1 min-h-0 flex flex-col bg-slate-900/60 border border-slate-800 rounded-2xl p-3 shadow-xl overflow-hidden justify-between">
      {/* Top Banner */}
      <div className="bg-slate-950/70 border border-slate-800/80 rounded-xl p-2.5 flex items-center justify-between shrink-0">
        <div className="flex items-center gap-2">
          <span className="p-1.5 rounded-lg bg-indigo-500/10 text-indigo-400 border border-indigo-500/20">
            <GitMerge className="w-4 h-4" />
          </span>
          <div>
            <h3 className="text-xs font-semibold text-white tracking-wide">{step.headline}</h3>
            <p className="text-[11px] text-slate-400">{step.subtext}</p>
          </div>
        </div>
        <div className="flex items-center gap-2">
          {isComplete ? (
            <span className="px-2 py-0.5 rounded-md bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 text-[11px] font-semibold flex items-center gap-1">
              <CheckCircle2 className="w-3.5 h-3.5" /> Merged ({mergedList.length} Nodes)
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
        {/* Row 1: List 1 */}
        <div className="bg-slate-950/60 border border-slate-800/80 rounded-xl p-2 flex items-center gap-3">
          <span className="text-[10px] uppercase font-mono font-bold tracking-wider text-indigo-400 w-14 shrink-0">
            List 1:
          </span>
          <div className="flex items-center gap-2 overflow-x-auto py-1">
            {list1.map((val, idx) => {
              const isCurrent = idx === l1Idx && !isComplete;
              const isProcessed = idx < l1Idx;

              let nodeStyle = 'bg-slate-900 border-slate-800 text-slate-300';
              if (isProcessed) {
                nodeStyle = 'bg-slate-950/60 border-slate-900 text-slate-600 opacity-40';
              } else if (isCurrent) {
                nodeStyle = 'bg-indigo-500/25 border-indigo-400 text-indigo-200 scale-105 shadow-md shadow-indigo-500/20 ring-2 ring-indigo-400';
              }

              return (
                <React.Fragment key={idx}>
                  <div className={`w-9 h-9 rounded-lg border font-mono text-xs font-bold flex items-center justify-center transition-all ${nodeStyle}`}>
                    {val}
                  </div>
                  {idx < list1.length - 1 && (
                    <ArrowRight className="w-3 h-3 text-slate-700 shrink-0" />
                  )}
                </React.Fragment>
              );
            })}
          </div>
        </div>

        {/* Row 2: List 2 */}
        <div className="bg-slate-950/60 border border-slate-800/80 rounded-xl p-2 flex items-center gap-3">
          <span className="text-[10px] uppercase font-mono font-bold tracking-wider text-cyan-400 w-14 shrink-0">
            List 2:
          </span>
          <div className="flex items-center gap-2 overflow-x-auto py-1">
            {list2.map((val, idx) => {
              const isCurrent = idx === l2Idx && !isComplete;
              const isProcessed = idx < l2Idx;

              let nodeStyle = 'bg-slate-900 border-slate-800 text-slate-300';
              if (isProcessed) {
                nodeStyle = 'bg-slate-950/60 border-slate-900 text-slate-600 opacity-40';
              } else if (isCurrent) {
                nodeStyle = 'bg-cyan-500/25 border-cyan-400 text-cyan-200 scale-105 shadow-md shadow-cyan-500/20 ring-2 ring-cyan-400';
              }

              return (
                <React.Fragment key={idx}>
                  <div className={`w-9 h-9 rounded-lg border font-mono text-xs font-bold flex items-center justify-center transition-all ${nodeStyle}`}>
                    {val}
                  </div>
                  {idx < list2.length - 1 && (
                    <ArrowRight className="w-3 h-3 text-slate-700 shrink-0" />
                  )}
                </React.Fragment>
              );
            })}
          </div>
        </div>

        {/* Row 3: Merged List Chain */}
        <div className="bg-slate-950/60 border border-slate-800/80 rounded-xl p-2.5 flex flex-col gap-1.5">
          <div className="flex items-center justify-between text-[10px] font-mono">
            <span className="uppercase font-bold tracking-wider text-emerald-400">Merged Chain (tail.next):</span>
            <span className="text-slate-400">Active Tail: <span className="text-white font-bold">{tailVal ?? 'dummy'}</span></span>
          </div>

          <div className="flex items-center gap-1.5 overflow-x-auto py-1.5">
            {/* Dummy head */}
            <div className="px-2.5 py-1.5 rounded-lg border border-slate-700 bg-slate-900/60 text-slate-500 font-mono text-xs italic">
              dummy
            </div>
            <ArrowRight className="w-3 h-3 text-slate-600 shrink-0" />

            {mergedList.map((val, idx) => {
              const isTail = idx === mergedList.length - 1;
              return (
                <React.Fragment key={idx}>
                  <div
                    className={`w-9 h-9 rounded-lg border font-mono text-xs font-bold flex items-center justify-center transition-all ${
                      isTail
                        ? 'bg-emerald-500/30 border-emerald-400 text-emerald-200 scale-105 shadow-md shadow-emerald-500/20'
                        : 'bg-emerald-500/15 border-emerald-500/30 text-emerald-300'
                    }`}
                  >
                    {val}
                  </div>
                  {idx < mergedList.length - 1 && (
                    <ArrowRight className="w-3 h-3 text-emerald-600 shrink-0" />
                  )}
                </React.Fragment>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
};
