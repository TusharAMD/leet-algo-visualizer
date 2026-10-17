import React from 'react';
import { SameTreeStep } from '../../algorithms/sameTreeIntuitive';
import { GitBranch, CheckCircle2, XCircle, ArrowLeftRight } from 'lucide-react';

interface SameTreeViewerProps {
  step: SameTreeStep;
}

export const SameTreeViewer: React.FC<SameTreeViewerProps> = ({ step }) => {
  const pList = Object.values(step.pNodes);
  const qList = Object.values(step.qNodes);

  return (
    <div className="flex-1 min-h-0 flex flex-col bg-slate-900/60 border border-slate-800 rounded-2xl p-3 shadow-xl overflow-hidden justify-between">
      {/* Top Banner */}
      <div className="bg-slate-950/70 border border-slate-800/80 rounded-xl p-2.5 flex items-center justify-between shrink-0">
        <div className="flex items-center gap-2">
          <span className="p-1.5 rounded-lg bg-indigo-500/10 text-indigo-400 border border-indigo-500/20">
            <ArrowLeftRight className="w-4 h-4" />
          </span>
          <div>
            <h3 className="text-xs font-semibold text-white tracking-wide">{step.headline}</h3>
            <p className="text-[11px] text-slate-400">{step.subtext}</p>
          </div>
        </div>
        <div className="flex items-center gap-2">
          {step.isComplete ? (
            step.isSame ? (
              <span className="px-2 py-0.5 rounded-md bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 text-[11px] font-semibold flex items-center gap-1">
                <CheckCircle2 className="w-3.5 h-3.5" /> Same: True
              </span>
            ) : (
              <span className="px-2 py-0.5 rounded-md bg-rose-500/10 border border-rose-500/20 text-rose-400 text-[11px] font-semibold flex items-center gap-1">
                <XCircle className="w-3.5 h-3.5" /> Same: False
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
      <div className="flex-1 min-h-0 grid grid-cols-2 gap-3 py-2 px-1">
        {/* Tree P Canvas */}
        <div className="relative w-full h-full bg-slate-950/50 border border-slate-800/80 rounded-xl overflow-hidden p-2 flex flex-col justify-between">
          <div className="flex items-center justify-between px-2 py-1 text-[10px] font-mono uppercase text-indigo-400 font-bold z-10">
            <span>Tree P</span>
            <span className="text-slate-500">{pList.length} Nodes</span>
          </div>

          <div className="flex-1 relative w-full h-full">
            <svg className="absolute inset-0 w-full h-full pointer-events-none">
              {pList.map((node) => {
                const lines = [];
                if (node.leftId !== null && step.pNodes[node.leftId]) {
                  const child = step.pNodes[node.leftId];
                  lines.push(
                    <line
                      key={`p-${node.id}-${child.id}`}
                      x1={`${node.x}%`}
                      y1={`${node.y}%`}
                      x2={`${child.x}%`}
                      y2={`${child.y}%`}
                      stroke="#334155"
                      strokeWidth="1.5"
                    />
                  );
                }
                if (node.rightId !== null && step.pNodes[node.rightId]) {
                  const child = step.pNodes[node.rightId];
                  lines.push(
                    <line
                      key={`p-${node.id}-${child.id}`}
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

            {pList.map((node) => {
              const isActive = step.activePId === node.id;
              const isMatched = step.matchedPairs.some(([p]) => p === node.id);
              const isMismatched = step.mismatchedPair && step.mismatchedPair[0] === node.id;

              let style = 'bg-slate-900 border-slate-700 text-slate-300';
              if (isActive) {
                style = 'bg-indigo-600 border-indigo-400 text-white ring-4 ring-indigo-500/30 scale-110 shadow-lg';
              } else if (isMismatched) {
                style = 'bg-rose-950/90 border-rose-500 text-rose-200 ring-2 ring-rose-500/40';
              } else if (isMatched) {
                style = 'bg-emerald-950/80 border-emerald-500 text-emerald-200 ring-2 ring-emerald-500/30';
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

        {/* Tree Q Canvas */}
        <div className="relative w-full h-full bg-slate-950/50 border border-slate-800/80 rounded-xl overflow-hidden p-2 flex flex-col justify-between">
          <div className="flex items-center justify-between px-2 py-1 text-[10px] font-mono uppercase text-cyan-400 font-bold z-10">
            <span>Tree Q</span>
            <span className="text-slate-500">{qList.length} Nodes</span>
          </div>

          <div className="flex-1 relative w-full h-full">
            <svg className="absolute inset-0 w-full h-full pointer-events-none">
              {qList.map((node) => {
                const lines = [];
                if (node.leftId !== null && step.qNodes[node.leftId]) {
                  const child = step.qNodes[node.leftId];
                  lines.push(
                    <line
                      key={`q-${node.id}-${child.id}`}
                      x1={`${node.x}%`}
                      y1={`${node.y}%`}
                      x2={`${child.x}%`}
                      y2={`${child.y}%`}
                      stroke="#334155"
                      strokeWidth="1.5"
                    />
                  );
                }
                if (node.rightId !== null && step.qNodes[node.rightId]) {
                  const child = step.qNodes[node.rightId];
                  lines.push(
                    <line
                      key={`q-${node.id}-${child.id}`}
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

            {qList.map((node) => {
              const isActive = step.activeQId === node.id;
              const isMatched = step.matchedPairs.some(([, q]) => q === node.id);
              const isMismatched = step.mismatchedPair && step.mismatchedPair[1] === node.id;

              let style = 'bg-slate-900 border-slate-700 text-slate-300';
              if (isActive) {
                style = 'bg-cyan-600 border-cyan-400 text-white ring-4 ring-cyan-500/30 scale-110 shadow-lg';
              } else if (isMismatched) {
                style = 'bg-rose-950/90 border-rose-500 text-rose-200 ring-2 ring-rose-500/40';
              } else if (isMatched) {
                style = 'bg-emerald-950/80 border-emerald-500 text-emerald-200 ring-2 ring-emerald-500/30';
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
      </div>

      {/* Bottom Summary Bar */}
      <div className="bg-slate-950/70 border border-slate-800/80 rounded-xl p-2 flex items-center justify-between text-xs font-mono shrink-0">
        <div className="flex items-center gap-4 text-slate-400">
          <span className="flex items-center gap-1.5 text-emerald-400">
            <span className="w-2.5 h-2.5 rounded-full bg-emerald-500"></span>
            Matched: {step.matchedPairs.length} Pairs
          </span>
          {step.mismatchedPair && (
            <span className="flex items-center gap-1.5 text-rose-400">
              <span className="w-2.5 h-2.5 rounded-full bg-rose-500"></span>
              Mismatch Detected
            </span>
          )}
        </div>

        <div className="flex items-center gap-1 text-slate-400">
          <span>Current Result:</span>
          <span className={`font-bold ${step.isSame ? 'text-emerald-400' : 'text-rose-400'}`}>
            {step.isSame ? 'Matching' : 'Violated'}
          </span>
        </div>
      </div>
    </div>
  );
};
