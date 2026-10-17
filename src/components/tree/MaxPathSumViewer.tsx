import React from 'react';
import { MaxPathSumStep } from '../../algorithms/maxPathSumIntuitive';
import { TrendingUp, CheckCircle2, Flame, Layers } from 'lucide-react';

interface MaxPathSumViewerProps {
  step: MaxPathSumStep;
}

export const MaxPathSumViewer: React.FC<MaxPathSumViewerProps> = ({ step }) => {
  const nodesList = Object.values(step.nodes);

  return (
    <div className="flex-1 min-h-0 flex flex-col bg-slate-900/60 border border-slate-800 rounded-2xl p-3 shadow-xl overflow-hidden justify-between">
      {/* Top Banner */}
      <div className="bg-slate-950/70 border border-slate-800/80 rounded-xl p-2.5 flex items-center justify-between shrink-0">
        <div className="flex items-center gap-2">
          <span className="p-1.5 rounded-lg bg-indigo-500/10 text-indigo-400 border border-indigo-500/20">
            <Flame className="w-4 h-4" />
          </span>
          <div>
            <h3 className="text-xs font-semibold text-white tracking-wide">{step.headline}</h3>
            <p className="text-[11px] text-slate-400">{step.subtext}</p>
          </div>
        </div>
        <div className="flex items-center gap-2">
          {step.isComplete ? (
            <span className="px-2 py-0.5 rounded-md bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 text-[11px] font-semibold flex items-center gap-1">
              <CheckCircle2 className="w-3.5 h-3.5" /> Max Path Sum: {step.globalMax}
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
          {nodesList.map((node) => {
            const lines = [];
            if (node.leftId !== null && step.nodes[node.leftId]) {
              const child = step.nodes[node.leftId];
              const isPathEdge =
                step.winningPathNodeIds.includes(node.id) &&
                step.winningPathNodeIds.includes(child.id);
              lines.push(
                <line
                  key={`branch-${node.id}-${child.id}`}
                  x1={`${node.x}%`}
                  y1={`${node.y}%`}
                  x2={`${child.x}%`}
                  y2={`${child.y}%`}
                  stroke={isPathEdge ? '#10b981' : '#334155'}
                  strokeWidth={isPathEdge ? '3' : '1.5'}
                  className="transition-all duration-300"
                />
              );
            }
            if (node.rightId !== null && step.nodes[node.rightId]) {
              const child = step.nodes[node.rightId];
              const isPathEdge =
                step.winningPathNodeIds.includes(node.id) &&
                step.winningPathNodeIds.includes(child.id);
              lines.push(
                <line
                  key={`branch-${node.id}-${child.id}`}
                  x1={`${node.x}%`}
                  y1={`${node.y}%`}
                  x2={`${child.x}%`}
                  y2={`${child.y}%`}
                  stroke={isPathEdge ? '#10b981' : '#334155'}
                  strokeWidth={isPathEdge ? '3' : '1.5'}
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
          const isWinningPath = step.winningPathNodeIds.includes(node.id);

          let nodeStyle = 'bg-slate-900 border-slate-700 text-slate-300';
          if (isWinningPath) {
            nodeStyle = 'bg-emerald-600 border-emerald-400 text-white ring-4 ring-emerald-500/50 scale-110 shadow-lg shadow-emerald-500/20';
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
              {isWinningPath && (
                <span className="mt-0.5 px-1.5 py-0.2 rounded-full text-[8px] font-mono font-bold bg-emerald-500/20 text-emerald-300 border border-emerald-500/30">
                  Best Path
                </span>
              )}
            </div>
          );
        })}
      </div>

      {/* Bottom Math & Global Max Bar */}
      <div className="bg-slate-950/70 border border-slate-800/80 rounded-xl p-2.5 flex items-center justify-between text-xs font-mono shrink-0">
        <div className="flex items-center gap-3">
          <TrendingUp className="w-3.5 h-3.5 text-indigo-400" />
          {step.activeNodeId !== null && (
            <span className="text-slate-300">
              Split: val({step.nodes[step.activeNodeId]?.val}) + leftGain({step.leftGain}) + rightGain({step.rightGain}) = <span className="text-emerald-400 font-bold">{step.localPathSum}</span>
            </span>
          )}
        </div>

        <div className="flex items-center gap-1.5 text-slate-400">
          <span>Global Maximum:</span>
          <span className="font-extrabold text-emerald-400 px-2 py-0.5 rounded bg-emerald-500/10 border border-emerald-500/30">
            {step.globalMax === -Infinity ? '...' : step.globalMax}
          </span>
        </div>
      </div>
    </div>
  );
};
