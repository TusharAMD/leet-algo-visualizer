import React from 'react';
import { LcaBstStep } from '../../algorithms/lcaBstIntuitive';
import { Split, CheckCircle2, Award, ArrowDownLeft, ArrowDownRight } from 'lucide-react';

interface LcaBstViewerProps {
  step: LcaBstStep;
}

export const LcaBstViewer: React.FC<LcaBstViewerProps> = ({ step }) => {
  const nodesList = Object.values(step.nodes);

  return (
    <div className="flex-1 min-h-0 flex flex-col bg-slate-900/60 border border-slate-800 rounded-2xl p-3 shadow-xl overflow-hidden justify-between">
      {/* Top Banner */}
      <div className="bg-slate-950/70 border border-slate-800/80 rounded-xl p-2.5 flex items-center justify-between shrink-0">
        <div className="flex items-center gap-2">
          <span className="p-1.5 rounded-lg bg-indigo-500/10 text-indigo-400 border border-indigo-500/20">
            <Split className="w-4 h-4" />
          </span>
          <div>
            <h3 className="text-xs font-semibold text-white tracking-wide">{step.headline}</h3>
            <p className="text-[11px] text-slate-400">{step.subtext}</p>
          </div>
        </div>
        <div className="flex items-center gap-2">
          {step.isComplete ? (
            <span className="px-2 py-0.5 rounded-md bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 text-[11px] font-semibold flex items-center gap-1">
              <CheckCircle2 className="w-3.5 h-3.5" /> LCA Confirmed
            </span>
          ) : (
            <span className="px-2 py-0.5 rounded-md bg-indigo-500/10 border border-indigo-500/20 text-indigo-400 text-[11px] font-mono">
              Step {step.stepIndex + 1} / {step.totalSteps}
            </span>
          )}
        </div>
      </div>

      {/* Main Tree Canvas */}
      <div className="flex-1 min-h-0 relative w-full flex items-center justify-center p-2">
        <svg className="absolute inset-0 w-full h-full pointer-events-none">
          {nodesList.map((node) => {
            const lines = [];
            if (node.leftId !== null && step.nodes[node.leftId]) {
              const child = step.nodes[node.leftId];
              const isPath = step.visitedIds.includes(node.id) && step.visitedIds.includes(child.id);
              lines.push(
                <line
                  key={`branch-${node.id}-${child.id}`}
                  x1={`${node.x}%`}
                  y1={`${node.y}%`}
                  x2={`${child.x}%`}
                  y2={`${child.y}%`}
                  stroke={isPath ? '#6366f1' : '#334155'}
                  strokeWidth={isPath ? '3' : '2'}
                  strokeDasharray={isPath ? 'none' : 'none'}
                />
              );
            }
            if (node.rightId !== null && step.nodes[node.rightId]) {
              const child = step.nodes[node.rightId];
              const isPath = step.visitedIds.includes(node.id) && step.visitedIds.includes(child.id);
              lines.push(
                <line
                  key={`branch-${node.id}-${child.id}`}
                  x1={`${node.x}%`}
                  y1={`${node.y}%`}
                  x2={`${child.x}%`}
                  y2={`${child.y}%`}
                  stroke={isPath ? '#6366f1' : '#334155'}
                  strokeWidth={isPath ? '3' : '2'}
                />
              );
            }
            return lines;
          })}
        </svg>

        {/* Tree Nodes */}
        <div className="absolute inset-0">
          {nodesList.map((node) => {
            const isCurr = step.currId === node.id;
            const isLca = step.lcaId === node.id;
            const isP = node.val === step.pVal;
            const isQ = node.val === step.qVal;
            const isVisited = step.visitedIds.includes(node.id);

            return (
              <div
                key={node.id}
                style={{
                  left: `${node.x}%`,
                  top: `${node.y}%`,
                  transform: 'translate(-50%, -50%)',
                }}
                className={`absolute w-12 h-12 rounded-2xl border-2 flex flex-col items-center justify-center transition-all duration-300 shadow-md ${
                  isLca
                    ? 'border-emerald-400 bg-emerald-950/95 text-white scale-130 z-30 shadow-xl shadow-emerald-500/30 ring-4 ring-emerald-400/40 animate-pulse'
                    : isCurr
                    ? 'border-indigo-400 bg-indigo-950/90 text-white scale-125 z-20 shadow-indigo-500/30 ring-2 ring-indigo-400'
                    : isP || isQ
                    ? 'border-amber-400 bg-amber-950/70 text-amber-200 z-10'
                    : isVisited
                    ? 'border-indigo-800 bg-indigo-950/40 text-slate-300'
                    : 'border-slate-700 bg-slate-900/90 text-slate-400'
                }`}
              >
                <span className="text-sm font-bold font-mono">{node.val}</span>
                {isLca && (
                  <span className="absolute -top-3.5 px-1.5 py-0.2 rounded-full bg-emerald-500 text-[8px] font-bold text-slate-950 uppercase tracking-wider flex items-center gap-0.5 shadow">
                    <Award className="w-2.5 h-2.5" /> LCA
                  </span>
                )}
                {isCurr && !isLca && (
                  <span className="absolute -top-3 px-1 py-0.2 rounded bg-indigo-500 text-[8px] font-bold text-white uppercase tracking-wider shadow">
                    Current
                  </span>
                )}
                {(isP || isQ) && !isLca && (
                  <span className="absolute -bottom-3 px-1.5 py-0.2 rounded bg-amber-500 text-[8px] font-bold text-slate-950 uppercase tracking-wider shadow">
                    {isP && isQ ? 'p & q' : isP ? 'p' : 'q'}
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
          <span className="text-amber-400 font-bold font-mono">BST Fork Decision:</span>
          <span className="text-slate-300">
            If both targets are &lt; curr, go left. If both &gt; curr, go right. The first node where they diverge is their Lowest Common Ancestor!
          </span>
        </div>
        <div className="flex items-center gap-3 shrink-0 text-[11px] font-mono text-slate-400">
          <span className="flex items-center gap-1 text-amber-300">
            Targets: p={step.pVal}, q={step.qVal}
          </span>
          {step.decision === 'left' && (
            <span className="flex items-center gap-0.5 text-indigo-400 font-bold">
              <ArrowDownLeft className="w-3.5 h-3.5" /> Branching Left
            </span>
          )}
          {step.decision === 'right' && (
            <span className="flex items-center gap-0.5 text-indigo-400 font-bold">
              <ArrowDownRight className="w-3.5 h-3.5" /> Branching Right
            </span>
          )}
          {step.decision === 'fork' && (
            <span className="flex items-center gap-0.5 text-emerald-400 font-bold">
              ★ LCA Located!
            </span>
          )}
        </div>
      </div>
    </div>
  );
};
