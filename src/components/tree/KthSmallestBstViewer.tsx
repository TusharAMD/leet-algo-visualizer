import React from 'react';
import { KthSmallestBstStep } from '../../algorithms/kthSmallestBstIntuitive';
import { Hash, CheckCircle2, ArrowRight, Layers, Trophy } from 'lucide-react';

interface KthSmallestBstViewerProps {
  step: KthSmallestBstStep;
}

export const KthSmallestBstViewer: React.FC<KthSmallestBstViewerProps> = ({ step }) => {
  const nodesList = Object.values(step.nodes);

  return (
    <div className="flex-1 min-h-0 flex flex-col bg-slate-900/60 border border-slate-800 rounded-2xl p-3 shadow-xl overflow-hidden justify-between">
      {/* Top Banner */}
      <div className="bg-slate-950/70 border border-slate-800/80 rounded-xl p-2.5 flex items-center justify-between shrink-0">
        <div className="flex items-center gap-2">
          <span className="p-1.5 rounded-lg bg-indigo-500/10 text-indigo-400 border border-indigo-500/20">
            <Hash className="w-4 h-4" />
          </span>
          <div>
            <h3 className="text-xs font-semibold text-white tracking-wide">{step.headline}</h3>
            <p className="text-[11px] text-slate-400">{step.subtext}</p>
          </div>
        </div>
        <div className="flex items-center gap-2">
          {step.isComplete ? (
            <span className="px-2 py-0.5 rounded-md bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 text-[11px] font-semibold flex items-center gap-1">
              <Trophy className="w-3.5 h-3.5" /> k={step.kTarget}th: {step.kthSmallestVal}
            </span>
          ) : (
            <span className="px-2 py-0.5 rounded-md bg-indigo-500/10 border border-indigo-500/20 text-indigo-400 text-[11px] font-mono">
              k remaining: {step.kRemaining}
            </span>
          )}
        </div>
      </div>

      {/* Main Tree Canvas */}
      <div className="flex-1 min-h-0 relative w-full h-full flex items-center justify-center p-2">
        <svg className="absolute inset-0 w-full h-full pointer-events-none">
          {nodesList.map((node) => {
            const lines = [];
            if (node.leftId !== null && step.nodes[node.leftId]) {
              const child = step.nodes[node.leftId];
              lines.push(
                <line
                  key={`branch-${node.id}-${child.id}`}
                  x1={`${node.x}%`}
                  y1={`${node.y}%`}
                  x2={`${child.x}%`}
                  y2={`${child.y}%`}
                  stroke="#334155"
                  strokeWidth="1.5"
                />
              );
            }
            if (node.rightId !== null && step.nodes[node.rightId]) {
              const child = step.nodes[node.rightId];
              lines.push(
                <line
                  key={`branch-${node.id}-${child.id}`}
                  x1={`${node.x}%`}
                  y1={`${node.y}%`}
                  x2={`${child.x}%`}
                  y2={`${child.y}%`}
                  stroke="#334155"
                  strokeWidth="1.5"
                />
              );
            }
            return lines;
          })}
        </svg>

        {/* Tree Nodes */}
        {nodesList.map((node) => {
          const isActive = step.activeNodeId === node.id;
          const isTargetKth = step.kthSmallestVal === node.val;
          const isVisited = step.visitedOrder.includes(node.val);

          let nodeStyle = 'bg-slate-900 border-slate-700 text-slate-300';
          if (isTargetKth) {
            nodeStyle = 'bg-emerald-600 border-emerald-400 text-white ring-4 ring-emerald-500/50 scale-115 shadow-xl shadow-emerald-500/30';
          } else if (isActive) {
            nodeStyle = 'bg-indigo-600 border-indigo-400 text-white ring-4 ring-indigo-500/30 scale-110 shadow-lg';
          } else if (isVisited) {
            nodeStyle = 'bg-slate-950/70 border-slate-800 text-slate-500';
          }

          return (
            <div
              key={node.id}
              className="absolute -translate-x-1/2 -translate-y-1/2 flex flex-col items-center pointer-events-none transition-all duration-300"
              style={{ left: `${node.x}%`, top: `${node.y}%` }}
            >
              <div
                className={`w-10 h-10 rounded-full border-2 font-mono text-xs font-bold flex items-center justify-center transition-all ${nodeStyle}`}
              >
                {node.val}
              </div>
              {isTargetKth && (
                <span className="mt-0.5 px-1.5 py-0.2 rounded-full text-[8px] font-mono font-bold bg-emerald-500/20 text-emerald-300 border border-emerald-500/30">
                  Target!
                </span>
              )}
            </div>
          );
        })}
      </div>

      {/* Bottom Stack & In-Order Sequence Bar */}
      <div className="bg-slate-950/70 border border-slate-800/80 rounded-xl p-2.5 flex items-center justify-between text-xs font-mono shrink-0">
        <div className="flex items-center gap-4">
          {/* Stack */}
          <div className="flex items-center gap-1.5 text-slate-400">
            <Layers className="w-3.5 h-3.5 text-indigo-400" />
            <span>Stack:</span>
            <div className="flex items-center gap-1">
              {step.stackValues.length === 0 ? (
                <span className="text-slate-600 italic">[]</span>
              ) : (
                step.stackValues.map((v, i) => (
                  <span
                    key={i}
                    className="px-1.5 py-0.2 rounded bg-indigo-500/20 border border-indigo-500/30 text-indigo-200 text-[11px]"
                  >
                    {v}
                  </span>
                ))
              )}
            </div>
          </div>

          {/* Sorted In-Order Sequence */}
          <div className="flex items-center gap-1.5 text-slate-400">
            <span className="text-slate-500">|</span>
            <span>Sorted In-Order:</span>
            <div className="flex items-center gap-1">
              {step.visitedOrder.map((v, i) => (
                <span
                  key={i}
                  className={`px-1.5 py-0.2 rounded border text-[11px] ${
                    i === step.kTarget - 1
                      ? 'bg-emerald-500/20 border-emerald-500/50 text-emerald-300 font-bold'
                      : 'bg-slate-900 border-slate-700 text-slate-300'
                  }`}
                >
                  {v}
                </span>
              ))}
            </div>
          </div>
        </div>

        <span className="text-slate-400">
          Target: <span className="text-emerald-400 font-bold">k={step.kTarget}</span>
        </span>
      </div>
    </div>
  );
};
