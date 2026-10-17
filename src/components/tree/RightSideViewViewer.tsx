import React from 'react';
import { RightSideViewStep } from '../../algorithms/rightSideViewIntuitive';
import { Eye, CheckCircle2, ArrowRight, Layers } from 'lucide-react';

interface RightSideViewViewerProps {
  step: RightSideViewStep;
}

export const RightSideViewViewer: React.FC<RightSideViewViewerProps> = ({ step }) => {
  const nodesList = Object.values(step.nodes);

  return (
    <div className="flex-1 min-h-0 flex flex-col bg-slate-900/60 border border-slate-800 rounded-2xl p-3 shadow-xl overflow-hidden justify-between">
      {/* Top Banner */}
      <div className="bg-slate-950/70 border border-slate-800/80 rounded-xl p-2.5 flex items-center justify-between shrink-0">
        <div className="flex items-center gap-2">
          <span className="p-1.5 rounded-lg bg-indigo-500/10 text-indigo-400 border border-indigo-500/20">
            <Eye className="w-4 h-4" />
          </span>
          <div>
            <h3 className="text-xs font-semibold text-white tracking-wide">{step.headline}</h3>
            <p className="text-[11px] text-slate-400">{step.subtext}</p>
          </div>
        </div>
        <div className="flex items-center gap-2">
          {step.isComplete ? (
            <span className="px-2 py-0.5 rounded-md bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 text-[11px] font-semibold flex items-center gap-1">
              <CheckCircle2 className="w-3.5 h-3.5" /> View: [{step.collectedValues.join(', ')}]
            </span>
          ) : (
            <span className="px-2 py-0.5 rounded-md bg-indigo-500/10 border border-indigo-500/20 text-indigo-400 text-[11px] font-mono">
              Step {step.stepIndex + 1} / {step.totalSteps}
            </span>
          )}
        </div>
      </div>

      {/* Main Tree Canvas */}
      <div className="flex-1 min-h-0 relative w-full h-full flex items-center justify-center p-2">
        {/* Right Side Observer Eye indicator */}
        <div className="absolute right-3 top-1/2 -translate-y-1/2 flex flex-col items-center gap-1 text-cyan-400 bg-slate-950/80 border border-cyan-500/30 px-2 py-3 rounded-2xl shadow-xl z-10">
          <Eye className="w-5 h-5 animate-pulse" />
          <span className="text-[9px] font-mono uppercase tracking-wider font-bold">Right Eye</span>
        </div>

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

          {/* Sight lines from right eye towards right-visible nodes */}
          {step.rightVisibleIds.map((id) => {
            const n = step.nodes[id];
            if (!n) return null;
            return (
              <line
                key={`sight-${id}`}
                x1={`${n.x + 4}%`}
                y1={`${n.y}%`}
                x2="92%"
                y2={`${n.y}%`}
                stroke="#06b6d4"
                strokeWidth="1.5"
                strokeDasharray="4 3"
                className="opacity-70 animate-pulse"
              />
            );
          })}
        </svg>

        {/* Tree Nodes */}
        {nodesList.map((node) => {
          const isActive = step.activeNodeId === node.id;
          const isVisibleFromRight = step.rightVisibleIds.includes(node.id);

          let nodeStyle = 'bg-slate-900 border-slate-700 text-slate-300';
          if (isVisibleFromRight) {
            nodeStyle = 'bg-cyan-600 border-cyan-400 text-white ring-4 ring-cyan-500/40 scale-110 shadow-lg shadow-cyan-500/20';
          } else if (isActive) {
            nodeStyle = 'bg-indigo-600 border-indigo-400 text-white ring-4 ring-indigo-500/30 scale-105';
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
              {isVisibleFromRight && (
                <span className="mt-0.5 px-1.5 py-0.2 rounded-full text-[8px] font-mono font-bold bg-cyan-500/20 text-cyan-300 border border-cyan-500/30">
                  Visible
                </span>
              )}
            </div>
          );
        })}
      </div>

      {/* Bottom Result Chain Bar */}
      <div className="bg-slate-950/70 border border-slate-800/80 rounded-xl p-2.5 flex items-center justify-between text-xs font-mono shrink-0">
        <div className="flex items-center gap-2">
          <Layers className="w-3.5 h-3.5 text-cyan-400" />
          <span className="text-slate-400">Right Side View Array:</span>
          <div className="flex items-center gap-1.5 overflow-x-auto">
            {step.collectedValues.length === 0 ? (
              <span className="text-slate-600 italic">Empty</span>
            ) : (
              step.collectedValues.map((val, idx) => (
                <React.Fragment key={idx}>
                  <span className="w-6 h-6 rounded-md bg-cyan-500/20 border border-cyan-500/40 text-cyan-200 font-bold flex items-center justify-center text-xs">
                    {val}
                  </span>
                  {idx < step.collectedValues.length - 1 && (
                    <ArrowRight className="w-3 h-3 text-slate-600" />
                  )}
                </React.Fragment>
              ))
            )}
          </div>
        </div>

        <span className="text-slate-400">
          Total: <span className="text-cyan-400 font-bold">{step.collectedValues.length}</span> nodes
        </span>
      </div>
    </div>
  );
};
