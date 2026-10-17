import React from 'react';
import { BalancedTreeStep } from '../../algorithms/balancedTreeIntuitive';
import { Scale, CheckCircle2, XCircle, Layers, AlertTriangle } from 'lucide-react';

interface BalancedTreeViewerProps {
  step: BalancedTreeStep;
}

export const BalancedTreeViewer: React.FC<BalancedTreeViewerProps> = ({ step }) => {
  const nodesList = Object.values(step.nodes);

  return (
    <div className="flex-1 min-h-0 flex flex-col bg-slate-900/60 border border-slate-800 rounded-2xl p-3 shadow-xl overflow-hidden justify-between">
      {/* Top Banner */}
      <div className="bg-slate-950/70 border border-slate-800/80 rounded-xl p-2.5 flex items-center justify-between shrink-0">
        <div className="flex items-center gap-2">
          <span className="p-1.5 rounded-lg bg-indigo-500/10 text-indigo-400 border border-indigo-500/20">
            <Scale className="w-4 h-4" />
          </span>
          <div>
            <h3 className="text-xs font-semibold text-white tracking-wide">{step.headline}</h3>
            <p className="text-[11px] text-slate-400">{step.subtext}</p>
          </div>
        </div>
        <div className="flex items-center gap-2">
          {step.isComplete ? (
            step.isOverallBalanced ? (
              <span className="px-2 py-0.5 rounded-md bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 text-[11px] font-semibold flex items-center gap-1">
                <CheckCircle2 className="w-3.5 h-3.5" /> Balanced: True
              </span>
            ) : (
              <span className="px-2 py-0.5 rounded-md bg-rose-500/10 border border-rose-500/20 text-rose-400 text-[11px] font-semibold flex items-center gap-1">
                <XCircle className="w-3.5 h-3.5" /> Balanced: False
              </span>
            )
          ) : (
            <span className="px-2 py-0.5 rounded-md bg-indigo-500/10 border border-indigo-500/20 text-indigo-400 text-[11px] font-mono">
              Step {step.stepIndex + 1} / {step.totalSteps}
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
              const isActiveBranch = step.activeNodeId === node.id || step.activeNodeId === child.id;
              lines.push(
                <line
                  key={`branch-${node.id}-${child.id}`}
                  x1={`${node.x}%`}
                  y1={`${node.y}%`}
                  x2={`${child.x}%`}
                  y2={`${child.y}%`}
                  stroke={isActiveBranch ? '#818cf8' : '#334155'}
                  strokeWidth={isActiveBranch ? '2.5' : '1.5'}
                  className="transition-all duration-300"
                />
              );
            }
            if (node.rightId !== null && step.nodes[node.rightId]) {
              const child = step.nodes[node.rightId];
              const isActiveBranch = step.activeNodeId === node.id || step.activeNodeId === child.id;
              lines.push(
                <line
                  key={`branch-${node.id}-${child.id}`}
                  x1={`${node.x}%`}
                  y1={`${node.y}%`}
                  x2={`${child.x}%`}
                  y2={`${child.y}%`}
                  stroke={isActiveBranch ? '#818cf8' : '#334155'}
                  strokeWidth={isActiveBranch ? '2.5' : '1.5'}
                  className="transition-all duration-300"
                />
              );
            }
            return lines;
          })}
        </svg>

        {/* Tree Nodes */}
        {nodesList.map((node) => {
          const isActive = step.activeNodeId === node.id;
          const balanceData = step.nodeBalance[node.id];
          const height = step.nodeHeights[node.id];

          let nodeStyle = 'bg-slate-900 border-slate-700 text-slate-300';
          if (isActive) {
            nodeStyle = 'bg-indigo-600 border-indigo-400 text-white ring-4 ring-indigo-500/30 scale-110 shadow-lg shadow-indigo-500/30';
          } else if (balanceData && !balanceData.balanced) {
            nodeStyle = 'bg-rose-950/80 border-rose-500 text-rose-200 ring-2 ring-rose-500/30';
          } else if (balanceData && balanceData.balanced) {
            nodeStyle = 'bg-emerald-950/70 border-emerald-500 text-emerald-200 ring-2 ring-emerald-500/20';
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
              {balanceData && (
                <div className="flex items-center gap-1 mt-0.5">
                  <span
                    className={`px-1 py-0.2 rounded text-[8px] font-mono font-bold border ${
                      balanceData.balanced
                        ? 'bg-emerald-500/20 text-emerald-300 border-emerald-500/30'
                        : 'bg-rose-500/20 text-rose-300 border-rose-500/40'
                    }`}
                  >
                    Δ={balanceData.diff} {balanceData.balanced ? '✓' : '✗'}
                  </span>
                  <span className="px-1 py-0.2 rounded text-[8px] font-mono bg-slate-800 text-slate-400 border border-slate-700">
                    h:{height}
                  </span>
                </div>
              )}
            </div>
          );
        })}
      </div>

      {/* Bottom call stack & status */}
      <div className="bg-slate-950/70 border border-slate-800/80 rounded-xl p-2 flex items-center justify-between text-xs font-mono shrink-0">
        <div className="flex items-center gap-2">
          <Layers className="w-3.5 h-3.5 text-indigo-400" />
          <span className="text-slate-400">Call Stack:</span>
          <div className="flex items-center gap-1">
            {step.callStack.map((val, idx) => (
              <span
                key={idx}
                className="px-2 py-0.5 rounded bg-indigo-500/20 border border-indigo-500/40 text-indigo-200 text-[11px]"
              >
                dfs({val})
              </span>
            ))}
          </div>
        </div>

        <div className="flex items-center gap-1.5 text-slate-400">
          <span>Overall Balanced:</span>
          <span
            className={`font-extrabold px-2 py-0.5 rounded text-xs border ${
              step.isOverallBalanced
                ? 'bg-emerald-500/10 border-emerald-500/30 text-emerald-400'
                : 'bg-rose-500/10 border-rose-500/30 text-rose-400'
            }`}
          >
            {step.isOverallBalanced ? 'True (Balanced)' : 'False (Unbalanced)'}
          </span>
        </div>
      </div>
    </div>
  );
};
