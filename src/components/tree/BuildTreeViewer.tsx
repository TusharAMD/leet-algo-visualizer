import React from 'react';
import { BuildTreeStep } from '../../algorithms/buildTreeIntuitive';
import { Hammer, CheckCircle2, ArrowRight, Split, GitFork } from 'lucide-react';

interface BuildTreeViewerProps {
  step: BuildTreeStep;
}

export const BuildTreeViewer: React.FC<BuildTreeViewerProps> = ({ step }) => {
  const nodesList = Object.values(step.constructedNodes);

  return (
    <div className="flex-1 min-h-0 flex flex-col bg-slate-900/60 border border-slate-800 rounded-2xl p-3 shadow-xl overflow-hidden justify-between">
      {/* Top Banner */}
      <div className="bg-slate-950/70 border border-slate-800/80 rounded-xl p-2.5 flex items-center justify-between shrink-0">
        <div className="flex items-center gap-2">
          <span className="p-1.5 rounded-lg bg-indigo-500/10 text-indigo-400 border border-indigo-500/20">
            <Hammer className="w-4 h-4" />
          </span>
          <div>
            <h3 className="text-xs font-semibold text-white tracking-wide">{step.headline}</h3>
            <p className="text-[11px] text-slate-400">{step.subtext}</p>
          </div>
        </div>
        <div className="flex items-center gap-2">
          {step.isComplete ? (
            <span className="px-2 py-0.5 rounded-md bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 text-[11px] font-semibold flex items-center gap-1">
              <CheckCircle2 className="w-3.5 h-3.5" /> Tree Built ({nodesList.length} Nodes)
            </span>
          ) : (
            <span className="px-2 py-0.5 rounded-md bg-indigo-500/10 border border-indigo-500/20 text-indigo-400 text-[11px] font-mono">
              Step {step.stepIndex + 1} / {step.totalSteps}
            </span>
          )}
        </div>
      </div>

      {/* Array Sub-problem Partition Cards */}
      <div className="bg-slate-950/60 border border-slate-800/80 rounded-xl p-2 flex flex-col gap-1.5 shrink-0">
        <div className="flex items-center justify-between text-xs font-mono">
          <div className="flex items-center gap-2">
            <span className="text-[10px] uppercase font-bold text-indigo-400">Preorder:</span>
            <div className="flex items-center gap-1">
              {step.preorder.map((val, idx) => (
                <span
                  key={idx}
                  className={`px-1.5 py-0.2 rounded text-[11px] border font-bold ${
                    idx === 0 && !step.isComplete
                      ? 'bg-indigo-500/30 border-indigo-400 text-indigo-200 ring-2 ring-indigo-400/50'
                      : 'bg-slate-900 border-slate-800 text-slate-400'
                  }`}
                >
                  {val}
                </span>
              ))}
            </div>
          </div>

          <div className="flex items-center gap-2">
            <span className="text-[10px] uppercase font-bold text-amber-400">Inorder:</span>
            <div className="flex items-center gap-1">
              {step.inorder.map((val, idx) => {
                const isMid = val === step.currRootVal && !step.isComplete;
                return (
                  <span
                    key={idx}
                    className={`px-1.5 py-0.2 rounded text-[11px] border font-bold ${
                      isMid
                        ? 'bg-amber-500/30 border-amber-400 text-amber-200 ring-2 ring-amber-400/50'
                        : 'bg-slate-900 border-slate-800 text-slate-400'
                    }`}
                  >
                    {val}
                  </span>
                );
              })}
            </div>
          </div>
        </div>
      </div>

      {/* Growing Tree Canvas */}
      <div className="flex-1 min-h-0 relative w-full h-full flex items-center justify-center p-2">
        <svg className="absolute inset-0 w-full h-full pointer-events-none">
          {nodesList.map((node) => {
            const lines = [];
            if (node.leftId !== null && step.constructedNodes[node.leftId]) {
              const child = step.constructedNodes[node.leftId];
              lines.push(
                <line
                  key={`b-${node.id}-${child.id}`}
                  x1={`${node.x}%`}
                  y1={`${node.y}%`}
                  x2={`${child.x}%`}
                  y2={`${child.y}%`}
                  stroke="#818cf8"
                  strokeWidth="2"
                  className="transition-all duration-300"
                />
              );
            }
            if (node.rightId !== null && step.constructedNodes[node.rightId]) {
              const child = step.constructedNodes[node.rightId];
              lines.push(
                <line
                  key={`b-${node.id}-${child.id}`}
                  x1={`${node.x}%`}
                  y1={`${node.y}%`}
                  x2={`${child.x}%`}
                  y2={`${child.y}%`}
                  stroke="#818cf8"
                  strokeWidth="2"
                  className="transition-all duration-300"
                />
              );
            }
            return lines;
          })}
        </svg>

        {nodesList.map((node) => {
          const isLatest = node.val === step.currRootVal && !step.isComplete;
          return (
            <div
              key={node.id}
              className="absolute -translate-x-1/2 -translate-y-1/2 flex flex-col items-center pointer-events-none transition-all duration-300"
              style={{ left: `${node.x}%`, top: `${node.y}%` }}
            >
              <div
                className={`w-10 h-10 rounded-full border-2 font-mono text-xs font-bold flex items-center justify-center transition-all ${
                  isLatest
                    ? 'bg-amber-600 border-amber-400 text-white ring-4 ring-amber-500/40 scale-110 shadow-lg'
                    : 'bg-indigo-950/90 border-indigo-500 text-indigo-200'
                }`}
              >
                {node.val}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
