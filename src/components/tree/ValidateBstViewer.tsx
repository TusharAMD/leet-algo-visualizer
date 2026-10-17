import React from 'react';
import { ValidateBstStep } from '../../algorithms/validateBstIntuitive';
import { ShieldCheck, CheckCircle2, XCircle, AlertTriangle, Binary } from 'lucide-react';

interface ValidateBstViewerProps {
  step: ValidateBstStep;
}

export const ValidateBstViewer: React.FC<ValidateBstViewerProps> = ({ step }) => {
  const nodesList = Object.values(step.nodes);

  return (
    <div className="flex-1 min-h-0 flex flex-col bg-slate-900/60 border border-slate-800 rounded-2xl p-3 shadow-xl overflow-hidden justify-between">
      {/* Top Banner */}
      <div className="bg-slate-950/70 border border-slate-800/80 rounded-xl p-2.5 flex items-center justify-between shrink-0">
        <div className="flex items-center gap-2">
          <span className="p-1.5 rounded-lg bg-indigo-500/10 text-indigo-400 border border-indigo-500/20">
            <Binary className="w-4 h-4" />
          </span>
          <div>
            <h3 className="text-xs font-semibold text-white tracking-wide">{step.headline}</h3>
            <p className="text-[11px] text-slate-400">{step.subtext}</p>
          </div>
        </div>
        <div className="flex items-center gap-2">
          {step.isComplete ? (
            step.isOverallValid ? (
              <span className="px-2 py-0.5 rounded-md bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 text-[11px] font-semibold flex items-center gap-1">
                <CheckCircle2 className="w-3.5 h-3.5" /> Valid BST: True
              </span>
            ) : (
              <span className="px-2 py-0.5 rounded-md bg-rose-500/10 border border-rose-500/20 text-rose-400 text-[11px] font-semibold flex items-center gap-1">
                <XCircle className="w-3.5 h-3.5" /> Valid BST: False
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
          const status = step.nodeValidStatus[node.id];
          const isViolated = step.violatedNodeId === node.id;

          let nodeStyle = 'bg-slate-900 border-slate-700 text-slate-300';
          if (isViolated) {
            nodeStyle = 'bg-rose-950/90 border-rose-500 text-rose-200 ring-4 ring-rose-500/50 scale-110 shadow-lg animate-pulse';
          } else if (isActive) {
            nodeStyle = 'bg-indigo-600 border-indigo-400 text-white ring-4 ring-indigo-500/30 scale-110 shadow-lg';
          } else if (status?.valid) {
            nodeStyle = 'bg-emerald-950/80 border-emerald-500 text-emerald-200 ring-2 ring-emerald-500/30';
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
              {status && (
                <span
                  className={`mt-0.5 px-1.5 py-0.2 rounded-full text-[8px] font-mono font-bold border ${
                    status.valid
                      ? 'bg-emerald-500/20 text-emerald-300 border-emerald-500/30'
                      : 'bg-rose-500/20 text-rose-300 border-rose-500/40'
                  }`}
                >
                  ({status.min}, {status.max})
                </span>
              )}
            </div>
          );
        })}
      </div>

      {/* Bottom Invariant Tracker Bar */}
      <div className="bg-slate-950/70 border border-slate-800/80 rounded-xl p-2.5 flex items-center justify-between text-xs font-mono shrink-0">
        <div className="flex items-center gap-2 text-slate-400">
          <ShieldCheck className="w-3.5 h-3.5 text-indigo-400" />
          <span>Active Boundary Constraint:</span>
          <span className="px-2 py-0.5 rounded bg-indigo-500/20 border border-indigo-500/30 text-indigo-200 font-bold">
            {step.leftBound === '-inf' ? '-∞' : step.leftBound} &lt; val &lt;{' '}
            {step.rightBound === '+inf' ? '+∞' : step.rightBound}
          </span>
        </div>

        <div className="flex items-center gap-1.5 text-slate-400">
          <span>BST Integrity:</span>
          <span
            className={`font-bold px-2 py-0.5 rounded ${
              step.isOverallValid
                ? 'bg-emerald-500/10 border border-emerald-500/30 text-emerald-400'
                : 'bg-rose-500/10 border border-rose-500/30 text-rose-400'
            }`}
          >
            {step.isOverallValid ? 'Valid Invariant ✓' : 'Invariant Broken ✗'}
          </span>
        </div>
      </div>
    </div>
  );
};
