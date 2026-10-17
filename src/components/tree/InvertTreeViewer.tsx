import React from 'react';
import { InvertTreeStep } from '../../algorithms/invertTreeIntuitive';
import { GitBranch, CheckCircle2, ArrowLeftRight } from 'lucide-react';

interface InvertTreeViewerProps {
  step: InvertTreeStep;
}

export const InvertTreeViewer: React.FC<InvertTreeViewerProps> = ({ step }) => {
  const nodesList = Object.values(step.nodes);

  return (
    <div className="flex-1 min-h-0 flex flex-col bg-slate-900/60 border border-slate-800 rounded-2xl p-3 shadow-xl overflow-hidden justify-between">
      {/* Top Banner */}
      <div className="bg-slate-950/70 border border-slate-800/80 rounded-xl p-2.5 flex items-center justify-between shrink-0">
        <div className="flex items-center gap-2">
          <span className="p-1.5 rounded-lg bg-indigo-500/10 text-indigo-400 border border-indigo-500/20">
            <GitBranch className="w-4 h-4" />
          </span>
          <div>
            <h3 className="text-xs font-semibold text-white tracking-wide">{step.headline}</h3>
            <p className="text-[11px] text-slate-400">{step.subtext}</p>
          </div>
        </div>
        <div className="flex items-center gap-2">
          {step.isComplete ? (
            <span className="px-2 py-0.5 rounded-md bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 text-[11px] font-semibold flex items-center gap-1">
              <CheckCircle2 className="w-3.5 h-3.5" /> Inverted
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
        <svg className="absolute inset-0 w-full h-full pointer-events-none">
          {/* Draw branch lines between parent and children */}
          {nodesList.map((node) => {
            const lines = [];
            if (node.leftId !== null && step.nodes[node.leftId]) {
              const child = step.nodes[node.leftId];
              const isSwapping = step.activeNodeId === node.id;
              lines.push(
                <line
                  key={`branch-${node.id}-${child.id}`}
                  x1={`${node.x}%`}
                  y1={`${node.y}%`}
                  x2={`${child.x}%`}
                  y2={`${child.y}%`}
                  stroke={isSwapping ? '#818cf8' : '#334155'}
                  strokeWidth={isSwapping ? '3' : '2'}
                  strokeDasharray={isSwapping ? '4 2' : 'none'}
                  className="transition-all duration-300"
                />
              );
            }
            if (node.rightId !== null && step.nodes[node.rightId]) {
              const child = step.nodes[node.rightId];
              const isSwapping = step.activeNodeId === node.id;
              lines.push(
                <line
                  key={`branch-${node.id}-${child.id}`}
                  x1={`${node.x}%`}
                  y1={`${node.y}%`}
                  x2={`${child.x}%`}
                  y2={`${child.y}%`}
                  stroke={isSwapping ? '#818cf8' : '#334155'}
                  strokeWidth={isSwapping ? '3' : '2'}
                  strokeDasharray={isSwapping ? '4 2' : 'none'}
                  className="transition-all duration-300"
                />
              );
            }
            return lines;
          })}
        </svg>

        {/* Node Bubbles */}
        <div className="absolute inset-0">
          {nodesList.map((node) => {
            const isActive = step.activeNodeId === node.id;
            const isSwappingChild =
              step.swappingLeftId === node.id || step.swappingRightId === node.id;

            return (
              <div
                key={node.id}
                style={{
                  left: `${node.x}%`,
                  top: `${node.y}%`,
                  transform: 'translate(-50%, -50%)',
                }}
                className={`absolute w-12 h-12 rounded-2xl border-2 flex flex-col items-center justify-center transition-all duration-500 shadow-lg ${
                  isActive
                    ? 'border-indigo-400 bg-indigo-950/90 text-white scale-125 z-20 shadow-indigo-500/30 ring-2 ring-indigo-400'
                    : isSwappingChild
                    ? 'border-cyan-400 bg-cyan-950/80 text-cyan-200 scale-110 z-10 shadow-cyan-500/20'
                    : 'border-slate-700 bg-slate-900/90 text-slate-200 z-0'
                }`}
              >
                <span className="text-sm font-bold font-mono">{node.val}</span>
                {isActive && (
                  <span className="absolute -top-3 px-1 py-0.2 rounded bg-indigo-500 text-[8px] font-bold text-white uppercase tracking-wider flex items-center gap-0.5 shadow">
                    <ArrowLeftRight className="w-2 h-2" /> Swapping
                  </span>
                )}
              </div>
            );
          })}
        </div>
      </div>

      {/* Mental Model Explainer Card */}
      <div className="bg-slate-950/80 border border-slate-800/80 rounded-xl p-2.5 flex items-center justify-between gap-3 text-xs shrink-0">
        <div className="flex items-center gap-2">
          <span className="text-indigo-400 font-bold font-mono">Mirror Principle:</span>
          <span className="text-slate-300">
            For every node, swapping its left and right subtrees inverts the entire tree top-to-bottom. Max Howell famously tweet-complained about this at Google!
          </span>
        </div>
        <div className="flex items-center gap-3 shrink-0 text-[11px] font-mono text-slate-400">
          <span className="flex items-center gap-1 text-indigo-400">
            <span className="w-2 h-2 rounded-full bg-indigo-400"></span> Active Parent
          </span>
          <span className="flex items-center gap-1 text-cyan-400">
            <span className="w-2 h-2 rounded-full bg-cyan-400"></span> Swapping Children
          </span>
        </div>
      </div>
    </div>
  );
};
