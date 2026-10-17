import React from 'react';
import { RemoveNthNodeStep } from '../../algorithms/removeNthNodeIntuitive';
import { Trash2, ArrowRight, CheckCircle2, ShieldAlert, Sparkles, Navigation } from 'lucide-react';

interface RemoveNthNodeViewerProps {
  step: RemoveNthNodeStep;
}

export const RemoveNthNodeViewer: React.FC<RemoveNthNodeViewerProps> = ({ step }) => {
  const { initialNodes, n, leftIdx, rightIdx, targetToDeleteIdx, currentNodes, deletedVal, phase, isComplete } = step;

  return (
    <div className="flex-1 min-h-0 flex flex-col bg-slate-900/60 border border-slate-800 rounded-2xl p-3 shadow-xl overflow-hidden justify-between">
      {/* Top Banner */}
      <div className="bg-slate-950/70 border border-slate-800/80 rounded-xl p-2.5 flex items-center justify-between shrink-0">
        <div className="flex items-center gap-2">
          <span className="p-1.5 rounded-lg bg-indigo-500/10 text-indigo-400 border border-indigo-500/20">
            <Trash2 className="w-4 h-4" />
          </span>
          <div>
            <h3 className="text-xs font-semibold text-white tracking-wide">{step.headline}</h3>
            <p className="text-[11px] text-slate-400">{step.subtext}</p>
          </div>
        </div>
        <div className="flex items-center gap-2">
          {isComplete ? (
            <span className="px-2 py-0.5 rounded-md bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 text-[11px] font-semibold flex items-center gap-1">
              <CheckCircle2 className="w-3.5 h-3.5" /> Removed Node {deletedVal}
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
        {/* Pointer Info Card */}
        <div className="bg-slate-950/60 border border-slate-800/80 rounded-xl p-2 flex items-center justify-between">
          <div className="flex items-center gap-4 text-xs font-mono">
            <span className="flex items-center gap-1.5 text-indigo-400">
              <span className="w-2.5 h-2.5 rounded-full bg-indigo-500"></span>
              <span>Left: {leftIdx === 'DUMMY' ? 'Dummy (Sentinel)' : `Node(${initialNodes[leftIdx]})`}</span>
            </span>
            <span className="flex items-center gap-1.5 text-cyan-400">
              <span className="w-2.5 h-2.5 rounded-full bg-cyan-500"></span>
              <span>Right: {rightIdx === null ? 'None (End)' : `Node(${initialNodes[rightIdx]})`}</span>
            </span>
          </div>
          <span className="px-2 py-0.5 rounded bg-slate-900 border border-slate-700/60 text-[11px] font-mono text-slate-300">
            Target: {n}th from end
          </span>
        </div>

        {/* Chain with Dummy & Pointers */}
        <div className="bg-slate-950/80 border border-slate-800 rounded-xl p-3 flex flex-col gap-2">
          <span className="text-[10px] uppercase font-mono font-bold tracking-wider text-slate-400">
            Linked List Arena:
          </span>
          <div className="flex items-center gap-2 overflow-x-auto py-2">
            {/* Dummy Node */}
            <div className="flex flex-col items-center">
              <div
                className={`w-10 h-10 rounded-lg border font-mono text-xs font-bold flex items-center justify-center transition-all ${
                  leftIdx === 'DUMMY'
                    ? 'bg-indigo-500/25 border-indigo-400 text-indigo-200 ring-2 ring-indigo-400/60 scale-105'
                    : 'bg-slate-900/90 border-dashed border-slate-700 text-slate-400'
                }`}
              >
                dum
              </div>
              <div className="h-4 flex items-center text-[10px] font-mono mt-1 font-bold text-indigo-400">
                {leftIdx === 'DUMMY' && 'left'}
              </div>
            </div>

            <ArrowRight className="w-4 h-4 text-slate-600 shrink-0 mb-5" />

            {/* List Nodes */}
            {initialNodes.map((val, idx) => {
              const isLeft = leftIdx === idx;
              const isRight = rightIdx === idx;
              const isTarget = targetToDeleteIdx === idx;
              const isBypassed = isComplete && targetToDeleteIdx === null && !currentNodes.includes(val);

              let nodeClass = 'bg-slate-900/80 border-slate-800 text-slate-200';
              if (isTarget) {
                nodeClass = 'bg-rose-500/25 border-rose-500 text-rose-200 ring-2 ring-rose-500 animate-pulse';
              } else if (isLeft && isRight) {
                nodeClass = 'bg-purple-500/25 border-purple-400 text-purple-200 ring-2 ring-purple-400';
              } else if (isLeft) {
                nodeClass = 'bg-indigo-500/25 border-indigo-400 text-indigo-200 ring-2 ring-indigo-400';
              } else if (isRight) {
                nodeClass = 'bg-cyan-500/25 border-cyan-400 text-cyan-200 ring-2 ring-cyan-400';
              } else if (isBypassed) {
                nodeClass = 'bg-rose-950/20 border-rose-900/40 text-rose-500 line-through opacity-40';
              }

              return (
                <React.Fragment key={idx}>
                  <div className="flex flex-col items-center">
                    <div className={`w-10 h-10 rounded-lg border font-mono text-xs font-bold flex items-center justify-center transition-all ${nodeClass}`}>
                      {val}
                    </div>
                    <div className="h-4 flex items-center gap-1 text-[10px] font-mono mt-1 font-bold">
                      {isLeft && <span className="text-indigo-400">left</span>}
                      {isRight && <span className="text-cyan-400">right</span>}
                      {isTarget && <span className="text-rose-400 font-extrabold">DEL</span>}
                    </div>
                  </div>
                  {idx < initialNodes.length - 1 && (
                    <ArrowRight className="w-4 h-4 text-slate-600 shrink-0 mb-5" />
                  )}
                </React.Fragment>
              );
            })}

            <ArrowRight className="w-4 h-4 text-slate-600 shrink-0 mb-5" />
            <div className="flex flex-col items-center">
              <div className="w-10 h-10 rounded-lg border border-dashed border-slate-800 font-mono text-xs text-slate-500 flex items-center justify-center mb-5">
                None
              </div>
            </div>
          </div>
        </div>

        {/* Final Result Row */}
        <div className="bg-slate-950/70 border border-emerald-500/20 rounded-xl p-2.5 flex items-center gap-3">
          <span className="text-[10px] uppercase font-mono font-bold tracking-wider text-emerald-400 w-24 shrink-0">
            Result List:
          </span>
          <div className="flex items-center gap-2 overflow-x-auto py-1">
            {currentNodes.length === 0 ? (
              <span className="text-slate-600 font-mono text-xs italic">Empty List (None)</span>
            ) : (
              currentNodes.map((val, idx) => (
                <React.Fragment key={idx}>
                  <div className="w-8 h-8 rounded-lg bg-emerald-500/10 border border-emerald-500/30 font-mono text-xs font-bold text-emerald-300 flex items-center justify-center">
                    {val}
                  </div>
                  {idx < currentNodes.length - 1 && (
                    <ArrowRight className="w-3.5 h-3.5 text-emerald-500/60 shrink-0" />
                  )}
                </React.Fragment>
              ))
            )}
            {currentNodes.length > 0 && (
              <span className="text-xs font-mono text-slate-500">→ None</span>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
