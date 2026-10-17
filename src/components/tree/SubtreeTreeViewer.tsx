import React from 'react';
import { SubtreeTreeStep } from '../../algorithms/subtreeTreeIntuitive';
import { Network, CheckCircle2, XCircle, Search } from 'lucide-react';

interface SubtreeTreeViewerProps {
  step: SubtreeTreeStep;
}

export const SubtreeTreeViewer: React.FC<SubtreeTreeViewerProps> = ({ step }) => {
  const rootList = Object.values(step.rootNodes);
  const subRootList = Object.values(step.subRootNodes);

  return (
    <div className="flex-1 min-h-0 flex flex-col bg-slate-900/60 border border-slate-800 rounded-2xl p-3 shadow-xl overflow-hidden justify-between">
      {/* Top Banner */}
      <div className="bg-slate-950/70 border border-slate-800/80 rounded-xl p-2.5 flex items-center justify-between shrink-0">
        <div className="flex items-center gap-2">
          <span className="p-1.5 rounded-lg bg-indigo-500/10 text-indigo-400 border border-indigo-500/20">
            <Network className="w-4 h-4" />
          </span>
          <div>
            <h3 className="text-xs font-semibold text-white tracking-wide">{step.headline}</h3>
            <p className="text-[11px] text-slate-400">{step.subtext}</p>
          </div>
        </div>
        <div className="flex items-center gap-2">
          {step.isComplete ? (
            step.isSubtree ? (
              <span className="px-2 py-0.5 rounded-md bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 text-[11px] font-semibold flex items-center gap-1">
                <CheckCircle2 className="w-3.5 h-3.5" /> Subtree: True
              </span>
            ) : (
              <span className="px-2 py-0.5 rounded-md bg-rose-500/10 border border-rose-500/20 text-rose-400 text-[11px] font-semibold flex items-center gap-1">
                <XCircle className="w-3.5 h-3.5" /> Subtree: False
              </span>
            )
          ) : (
            <span className="px-2 py-0.5 rounded-md bg-indigo-500/10 border border-indigo-500/20 text-indigo-400 text-[11px] font-mono">
              Step {step.stepIndex + 1} / {step.totalSteps}
            </span>
          )}
        </div>
      </div>

      {/* Main Dual Tree Canvas */}
      <div className="flex-1 min-h-0 grid grid-cols-12 gap-3 py-2 px-1">
        {/* Main Tree Canvas (col-span-8) */}
        <div className="col-span-7 relative w-full h-full bg-slate-950/50 border border-slate-800/80 rounded-xl overflow-hidden p-2 flex flex-col justify-between">
          <div className="flex items-center justify-between px-2 py-1 text-[10px] font-mono uppercase text-indigo-400 font-bold z-10">
            <span>Main Tree (Root)</span>
            <span className="text-slate-500">{rootList.length} Nodes</span>
          </div>

          <div className="flex-1 relative w-full h-full">
            <svg className="absolute inset-0 w-full h-full pointer-events-none">
              {rootList.map((node) => {
                const lines = [];
                if (node.leftId !== null && step.rootNodes[node.leftId]) {
                  const child = step.rootNodes[node.leftId];
                  lines.push(
                    <line
                      key={`r-${node.id}-${child.id}`}
                      x1={`${node.x}%`}
                      y1={`${node.y}%`}
                      x2={`${child.x}%`}
                      y2={`${child.y}%`}
                      stroke="#334155"
                      strokeWidth="1.5"
                    />
                  );
                }
                if (node.rightId !== null && step.rootNodes[node.rightId]) {
                  const child = step.rootNodes[node.rightId];
                  lines.push(
                    <line
                      key={`r-${node.id}-${child.id}`}
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

            {rootList.map((node) => {
              const isCandidate = step.activeRootCandidateId === node.id;
              const isMatchedSubtreeNode = step.matchedSubtreeNodeIds.includes(node.id);

              let style = 'bg-slate-900 border-slate-700 text-slate-300';
              if (isMatchedSubtreeNode) {
                style = 'bg-emerald-600 border-emerald-400 text-white ring-4 ring-emerald-500/40 scale-105 shadow-lg shadow-emerald-500/20';
              } else if (isCandidate) {
                style = 'bg-indigo-600 border-indigo-400 text-white ring-4 ring-indigo-500/30 scale-105 shadow-lg';
              }

              return (
                <div
                  key={node.id}
                  className="absolute -translate-x-1/2 -translate-y-1/2 pointer-events-none transition-all duration-300"
                  style={{ left: `${node.x}%`, top: `${node.y}%` }}
                >
                  <div className={`w-9 h-9 rounded-full border-2 font-mono text-xs font-bold flex items-center justify-center ${style}`}>
                    {node.val}
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Subtree Template Canvas (col-span-5) */}
        <div className="col-span-5 relative w-full h-full bg-slate-950/50 border border-slate-800/80 rounded-xl overflow-hidden p-2 flex flex-col justify-between">
          <div className="flex items-center justify-between px-2 py-1 text-[10px] font-mono uppercase text-amber-400 font-bold z-10">
            <span>Target (subRoot)</span>
            <span className="text-slate-500">{subRootList.length} Nodes</span>
          </div>

          <div className="flex-1 relative w-full h-full">
            <svg className="absolute inset-0 w-full h-full pointer-events-none">
              {subRootList.map((node) => {
                const lines = [];
                if (node.leftId !== null && step.subRootNodes[node.leftId]) {
                  const child = step.subRootNodes[node.leftId];
                  lines.push(
                    <line
                      key={`s-${node.id}-${child.id}`}
                      x1={`${node.x}%`}
                      y1={`${node.y}%`}
                      x2={`${child.x}%`}
                      y2={`${child.y}%`}
                      stroke="#334155"
                      strokeWidth="1.5"
                    />
                  );
                }
                if (node.rightId !== null && step.subRootNodes[node.rightId]) {
                  const child = step.subRootNodes[node.rightId];
                  lines.push(
                    <line
                      key={`s-${node.id}-${child.id}`}
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

            {subRootList.map((node) => {
              const isMatched = step.matchedSubtreeNodeIds.length > 0;
              let style = isMatched
                ? 'bg-emerald-600 border-emerald-400 text-white ring-2 ring-emerald-400/50'
                : 'bg-amber-500/20 border-amber-500/40 text-amber-200';

              return (
                <div
                  key={node.id}
                  className="absolute -translate-x-1/2 -translate-y-1/2 pointer-events-none transition-all duration-300"
                  style={{ left: `${node.x}%`, top: `${node.y}%` }}
                >
                  <div className={`w-9 h-9 rounded-full border-2 font-mono text-xs font-bold flex items-center justify-center ${style}`}>
                    {node.val}
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>

      {/* Bottom status bar */}
      <div className="bg-slate-950/70 border border-slate-800/80 rounded-xl p-2 flex items-center justify-between text-xs font-mono shrink-0">
        <div className="flex items-center gap-2 text-slate-400">
          <Search className="w-3.5 h-3.5 text-indigo-400" />
          <span>Candidate: {step.activeRootCandidateId !== null ? `Node(${step.rootNodes[step.activeRootCandidateId]?.val})` : 'None'}</span>
        </div>

        <div className="flex items-center gap-1 text-slate-400">
          <span>Match:</span>
          <span className={`font-bold ${step.isSubtree ? 'text-emerald-400' : 'text-slate-400'}`}>
            {step.isSubtree ? 'Subtree Verified ✓' : 'Searching...'}
          </span>
        </div>
      </div>
    </div>
  );
};
