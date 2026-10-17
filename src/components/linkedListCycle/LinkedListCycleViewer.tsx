import React from 'react';
import { LinkedListCycleStep } from '../../algorithms/linkedListCycleIntuitive';
import { Repeat, CheckCircle2, XCircle, Sparkles, ArrowRight, CornerDownLeft } from 'lucide-react';

interface LinkedListCycleViewerProps {
  step: LinkedListCycleStep;
  values: number[];
  pos: number;
}

export const LinkedListCycleViewer: React.FC<LinkedListCycleViewerProps> = ({ step, values, pos }) => {
  const isCollision = step.slow === step.fast && step.slow !== -1 && step.stepIndex > 0;

  return (
    <div className="flex-1 min-h-0 flex flex-col bg-slate-900/60 border border-slate-800 rounded-2xl p-3 shadow-xl overflow-hidden justify-between">
      {/* Top Banner */}
      <div className="bg-slate-950/70 border border-slate-800/80 rounded-xl p-2.5 flex items-center justify-between shrink-0">
        <div className="flex items-center gap-2">
          <span className="p-1.5 rounded-lg bg-indigo-500/10 text-indigo-400 border border-indigo-500/20">
            <Repeat className="w-4 h-4" />
          </span>
          <div>
            <h3 className="text-xs font-semibold text-white tracking-wide">{step.headline}</h3>
            <p className="text-[11px] text-slate-400">{step.subtext}</p>
          </div>
        </div>
        <div className="flex items-center gap-2">
          {step.isComplete ? (
            step.hasCycle ? (
              <span className="px-2 py-0.5 rounded-md bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 text-[11px] font-semibold flex items-center gap-1">
                <CheckCircle2 className="w-3.5 h-3.5" /> Cycle Detected (True)
              </span>
            ) : (
              <span className="px-2 py-0.5 rounded-md bg-rose-500/10 border border-rose-500/20 text-rose-400 text-[11px] font-semibold flex items-center gap-1">
                <XCircle className="w-3.5 h-3.5" /> No Cycle (False)
              </span>
            )
          ) : (
            <span className="px-2 py-0.5 rounded-md bg-indigo-500/10 border border-indigo-500/20 text-indigo-400 text-[11px] font-mono">
              Step {step.stepIndex + 1} / {step.totalSteps}
            </span>
          )}
        </div>
      </div>

      {/* Main Track Visualization */}
      <div className="flex-1 min-h-0 flex flex-col items-center justify-center py-2 px-3 overflow-x-auto">
        <div className="flex flex-col items-center gap-4 min-w-max">
          {/* Node Track */}
          <div className="flex items-center gap-3">
            {step.nodes.map((node, index) => {
              const isSlow = step.slow === node.index;
              const isFast = step.fast === node.index;
              const isCycleEntry = pos === node.index;
              const isCol = isCollision && isSlow;

              return (
                <React.Fragment key={node.index}>
                  <div className="flex flex-col items-center justify-center relative">
                    {/* Runner Badges Above Node */}
                    <div className="h-6 flex items-center justify-center gap-1 mb-1">
                      {isSlow && (
                        <span
                          className={`px-1.5 py-0.5 text-[10px] font-bold rounded flex items-center gap-0.5 shadow ${
                            isCol
                              ? 'bg-rose-500 text-white animate-bounce'
                              : 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/40'
                          }`}
                        >
                          🐢 slow
                        </span>
                      )}
                      {isFast && (
                        <span
                          className={`px-1.5 py-0.5 text-[10px] font-bold rounded flex items-center gap-0.5 shadow ${
                            isCol
                              ? 'bg-rose-500 text-white animate-bounce'
                              : 'bg-cyan-500/20 text-cyan-300 border border-cyan-500/40'
                          }`}
                        >
                          🐇 fast
                        </span>
                      )}
                    </div>

                    {/* Node Card */}
                    <div
                      className={`w-16 h-16 rounded-2xl border-2 flex flex-col items-center justify-center relative transition-all duration-300 ${
                        isCol
                          ? 'border-rose-500 bg-rose-500/20 shadow-xl shadow-rose-500/30 scale-110 ring-2 ring-rose-500/50'
                          : isCycleEntry
                          ? 'border-amber-500/80 bg-amber-950/20 shadow-lg shadow-amber-500/10'
                          : isSlow && isFast
                          ? 'border-purple-500 bg-purple-950/30'
                          : isSlow
                          ? 'border-emerald-500/80 bg-emerald-950/30'
                          : isFast
                          ? 'border-cyan-500/80 bg-cyan-950/30'
                          : 'border-slate-800 bg-slate-900/80'
                      }`}
                    >
                      <span className="text-[10px] font-mono text-slate-400">Node[{node.index}]</span>
                      <span className="text-lg font-bold font-mono text-white">{node.val}</span>
                      {isCycleEntry && (
                        <span className="absolute -top-2.5 px-1.5 py-0.2 rounded bg-amber-500 text-[9px] font-bold text-slate-950 shadow">
                          LOOP ENTRANCE
                        </span>
                      )}
                    </div>

                    {/* Next Pointer label */}
                    <div className="h-5 flex items-center justify-center mt-1">
                      <span className="text-[10px] font-mono text-slate-400">
                        .next ➔ {node.nextIndex === -1 ? 'null' : `[${node.nextIndex}]`}
                      </span>
                    </div>
                  </div>

                  {/* Inter-node forward arrow */}
                  {index < step.nodes.length - 1 && (
                    <div className="flex items-center text-slate-600">
                      <ArrowRight className="w-5 h-5" />
                    </div>
                  )}
                </React.Fragment>
              );
            })}

            {/* If no cycle, show null terminal */}
            {pos === -1 && (
              <div className="flex items-center gap-2">
                <ArrowRight className="w-5 h-5 text-slate-600" />
                <div className="w-14 h-14 rounded-xl border border-dashed border-slate-700 bg-slate-950/50 flex flex-col items-center justify-center">
                  <span className="text-[10px] uppercase font-mono text-slate-500">None</span>
                  <span className="text-xs font-bold text-slate-400">null</span>
                </div>
              </div>
            )}
          </div>

          {/* Looped Return Wire (if pos >= 0) */}
          {pos >= 0 && pos < step.nodes.length && (
            <div className="w-full flex items-center justify-center">
              <div className="flex items-center gap-2 px-3 py-1.5 rounded-xl bg-amber-500/10 border border-amber-500/30 text-amber-300 text-xs font-mono">
                <CornerDownLeft className="w-4 h-4 text-amber-400" />
                <span>
                  Cycle Loop: Tail Node[{step.nodes.length - 1}] connects back to Node[{pos}] (pos = {pos})
                </span>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Bottom Explainer Footnote */}
      <div className="bg-slate-950/80 border border-slate-800/80 rounded-xl p-2.5 flex items-center justify-between gap-3 text-xs shrink-0">
        <div className="flex items-center gap-2">
          <span className="text-cyan-400 font-bold font-mono">Floyd's Principle:</span>
          <span className="text-slate-300">
            Speed difference is <code className="text-white">2 - 1 = 1 node/step</code>. Inside a closed loop of length <code className="text-amber-300">C</code>, the relative distance reduces by 1 on every iteration until collision is inevitable!
          </span>
        </div>
        <div className="flex items-center gap-3 shrink-0 text-[11px] font-mono text-slate-400">
          <span className="flex items-center gap-1 text-emerald-400">
            🐢 Slow: +1 step
          </span>
          <span className="flex items-center gap-1 text-cyan-400">
            🐇 Fast: +2 steps
          </span>
        </div>
      </div>
    </div>
  );
};
