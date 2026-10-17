import React from 'react';
import { ReverseListStep } from '../../algorithms/reverseListIntuitive';
import { ArrowRight, ArrowLeft, CheckCircle2, Sparkles, CornerDownRight } from 'lucide-react';

interface ReverseListViewerProps {
  step: ReverseListStep;
  initialValues: number[];
}

export const ReverseListViewer: React.FC<ReverseListViewerProps> = ({ step, initialValues }) => {
  return (
    <div className="flex-1 min-h-0 flex flex-col bg-slate-900/60 border border-slate-800 rounded-2xl p-3 shadow-xl overflow-hidden justify-between">
      {/* Top Banner */}
      <div className="bg-slate-950/70 border border-slate-800/80 rounded-xl p-2.5 flex items-center justify-between shrink-0">
        <div className="flex items-center gap-2">
          <span className="p-1.5 rounded-lg bg-indigo-500/10 text-indigo-400 border border-indigo-500/20">
            <CornerDownRight className="w-4 h-4" />
          </span>
          <div>
            <h3 className="text-xs font-semibold text-white tracking-wide">{step.headline}</h3>
            <p className="text-[11px] text-slate-400">{step.subtext}</p>
          </div>
        </div>
        <div className="flex items-center gap-2">
          {step.isComplete ? (
            <span className="px-2 py-0.5 rounded-md bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 text-[11px] font-semibold flex items-center gap-1">
              <CheckCircle2 className="w-3.5 h-3.5" /> Reversed
            </span>
          ) : (
            <span className="px-2 py-0.5 rounded-md bg-indigo-500/10 border border-indigo-500/20 text-indigo-400 text-[11px] font-mono">
              Step {step.stepIndex + 1} / {step.totalSteps}
            </span>
          )}
        </div>
      </div>

      {/* Main Visualization Board */}
      <div className="flex-1 min-h-0 flex flex-col items-center justify-center py-2 px-3 overflow-x-auto">
        <div className="flex items-center justify-center gap-3 md:gap-5 min-w-max px-4">
          {/* Virtual None on the Left */}
          <div className="flex flex-col items-center justify-center">
            <div
              className={`w-14 h-14 rounded-xl border flex flex-col items-center justify-center transition-all duration-300 ${
                step.prevId === -1 && !step.isComplete
                  ? 'border-amber-500/80 bg-amber-500/10 shadow-lg shadow-amber-500/10'
                  : 'border-slate-800 bg-slate-950/40 opacity-50'
              }`}
            >
              <span className="text-[10px] uppercase font-mono tracking-wider text-slate-500">None</span>
              <span className="text-xs font-bold text-slate-400">null</span>
            </div>
            <div className="h-5 flex items-center justify-center mt-1">
              {step.prevId === -1 && !step.isComplete && (
                <span className="px-1.5 py-0.2 text-[10px] font-mono font-bold rounded bg-amber-500/20 text-amber-300 border border-amber-500/40">
                  prev
                </span>
              )}
            </div>
          </div>

          {/* Node Chain */}
          {step.nodes.map((node, index) => {
            const isPrev = step.prevId === node.id;
            const isCurr = step.currId === node.id;
            const isNxt = step.nxtId === node.id;
            const isHead = step.newHeadId === node.id;
            const pointsBackward = node.pointsTo !== -1 && node.pointsTo < node.id;
            const pointsToNull = node.pointsTo === -1;
            const pointsForward = node.pointsTo > node.id;

            return (
              <React.Fragment key={node.id}>
                <div className="flex flex-col items-center justify-center relative">
                  {/* Floating Pointer Badges Above Node */}
                  <div className="h-6 flex items-center justify-center gap-1 mb-1">
                    {isPrev && (
                      <span className="px-2 py-0.5 text-[10px] font-mono font-bold rounded bg-amber-500/20 text-amber-300 border border-amber-500/40 animate-pulse">
                        prev
                      </span>
                    )}
                    {isCurr && (
                      <span className="px-2 py-0.5 text-[10px] font-mono font-bold rounded bg-indigo-500/20 text-indigo-300 border border-indigo-500/40 animate-bounce">
                        curr
                      </span>
                    )}
                    {isNxt && !isCurr && (
                      <span className="px-2 py-0.5 text-[10px] font-mono font-bold rounded bg-purple-500/20 text-purple-300 border border-purple-500/40">
                        nxt
                      </span>
                    )}
                  </div>

                  {/* Node Box */}
                  <div
                    className={`w-16 h-16 rounded-2xl border-2 flex flex-col items-center justify-center relative transition-all duration-300 ${
                      isHead
                        ? 'border-emerald-400 bg-emerald-500/20 shadow-xl shadow-emerald-500/20 scale-105'
                        : isCurr
                        ? 'border-indigo-500 bg-indigo-950/40 shadow-lg shadow-indigo-500/20 scale-105'
                        : isPrev
                        ? 'border-amber-500/80 bg-amber-950/30'
                        : 'border-slate-700 bg-slate-900/80'
                    }`}
                  >
                    <span className="text-[10px] font-mono text-slate-400">Node[{index}]</span>
                    <span className="text-lg font-bold font-mono text-white">{node.val}</span>
                    {isHead && (
                      <span className="absolute -top-2.5 -right-2 px-1.5 py-0.5 rounded-full bg-emerald-500 text-[9px] font-bold text-slate-950 shadow flex items-center gap-0.5">
                        <Sparkles className="w-2.5 h-2.5" /> NEW HEAD
                      </span>
                    )}
                  </div>

                  {/* Bottom: pointer destination label */}
                  <div className="h-5 flex items-center justify-center mt-1">
                    <span className="text-[10px] font-mono text-slate-400">
                      .next ➔ {node.pointsTo === -1 ? 'None' : `[${node.pointsTo}]`}
                    </span>
                  </div>
                </div>

                {/* Arrow Connector between nodes */}
                {index < step.nodes.length - 1 && (
                  <div className="flex flex-col items-center justify-center px-1">
                    {/* If next link is pointing backward */}
                    {step.nodes[index + 1].pointsTo === index ? (
                      <div className="flex flex-col items-center text-emerald-400">
                        <ArrowLeft className="w-5 h-5 stroke-[2.5] animate-pulse" />
                        <span className="text-[9px] font-mono font-bold text-emerald-400">reversed</span>
                      </div>
                    ) : node.pointsTo === index + 1 ? (
                      <div className="flex flex-col items-center text-slate-500">
                        <ArrowRight className="w-5 h-5 stroke-[2]" />
                        <span className="text-[9px] font-mono text-slate-500">original</span>
                      </div>
                    ) : (
                      <div className="flex flex-col items-center text-rose-500/70">
                        <span className="text-xs font-mono font-bold">✕</span>
                        <span className="text-[9px] font-mono text-rose-400">severed</span>
                      </div>
                    )}
                  </div>
                )}
              </React.Fragment>
            );
          })}

          {/* Virtual None on the Right */}
          <div className="flex flex-col items-center justify-center">
            <div
              className={`w-14 h-14 rounded-xl border flex flex-col items-center justify-center transition-all duration-300 ${
                step.currId === -1 && !step.isComplete
                  ? 'border-indigo-500/80 bg-indigo-500/10'
                  : 'border-slate-800 bg-slate-950/40 opacity-50'
              }`}
            >
              <span className="text-[10px] uppercase font-mono tracking-wider text-slate-500">None</span>
              <span className="text-xs font-bold text-slate-400">null</span>
            </div>
            <div className="h-5 flex items-center justify-center mt-1">
              {step.currId === -1 && (
                <span className="px-1.5 py-0.2 text-[10px] font-mono font-bold rounded bg-indigo-500/20 text-indigo-300 border border-indigo-500/40">
                  curr
                </span>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Mental Model Explainer Card */}
      <div className="bg-slate-950/80 border border-slate-800/80 rounded-xl p-2.5 flex items-center justify-between gap-3 text-xs shrink-0">
        <div className="flex items-center gap-2">
          <span className="text-amber-400 font-bold font-mono">Mental Rule:</span>
          <span className="text-slate-300">
            Never change <code className="text-indigo-300">curr.next</code> without saving{' '}
            <code className="text-purple-300">nxt = curr.next</code> first, or the rest of the list is severed forever.
          </span>
        </div>
        <div className="flex items-center gap-3 shrink-0 text-[11px] font-mono text-slate-400">
          <span className="flex items-center gap-1">
            <span className="w-2.5 h-2.5 rounded-full bg-amber-400"></span> prev
          </span>
          <span className="flex items-center gap-1">
            <span className="w-2.5 h-2.5 rounded-full bg-indigo-400"></span> curr
          </span>
          <span className="flex items-center gap-1">
            <span className="w-2.5 h-2.5 rounded-full bg-purple-400"></span> nxt
          </span>
        </div>
      </div>
    </div>
  );
};
