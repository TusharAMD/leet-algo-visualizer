import React from 'react';
import { LevelOrderStep } from '../../algorithms/levelOrderIntuitive';
import { Layers, CheckCircle2, ListFilter } from 'lucide-react';

interface LevelOrderViewerProps {
  step: LevelOrderStep;
}

export const LevelOrderViewer: React.FC<LevelOrderViewerProps> = ({ step }) => {
  const nodesList = Object.values(step.nodes);

  const levelColors = [
    { border: 'border-indigo-400', bg: 'bg-indigo-950/60', text: 'text-indigo-300', badge: 'bg-indigo-500/20 text-indigo-300 border-indigo-500/30' },
    { border: 'border-cyan-400', bg: 'bg-cyan-950/60', text: 'text-cyan-300', badge: 'bg-cyan-500/20 text-cyan-300 border-cyan-500/30' },
    { border: 'border-amber-400', bg: 'bg-amber-950/60', text: 'text-amber-300', badge: 'bg-amber-500/20 text-amber-300 border-amber-500/30' },
  ];

  return (
    <div className="flex-1 min-h-0 flex flex-col bg-slate-900/60 border border-slate-800 rounded-2xl p-3 shadow-xl overflow-hidden justify-between">
      {/* Top Banner */}
      <div className="bg-slate-950/70 border border-slate-800/80 rounded-xl p-2.5 flex items-center justify-between shrink-0">
        <div className="flex items-center gap-2">
          <span className="p-1.5 rounded-lg bg-indigo-500/10 text-indigo-400 border border-indigo-500/20">
            <Layers className="w-4 h-4" />
          </span>
          <div>
            <h3 className="text-xs font-semibold text-white tracking-wide">{step.headline}</h3>
            <p className="text-[11px] text-slate-400">{step.subtext}</p>
          </div>
        </div>
        <div className="flex items-center gap-2">
          {step.isComplete ? (
            <span className="px-2 py-0.5 rounded-md bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 text-[11px] font-semibold flex items-center gap-1">
              <CheckCircle2 className="w-3.5 h-3.5" /> Traversed
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
              lines.push(
                <line
                  key={`branch-${node.id}-${child.id}`}
                  x1={`${node.x}%`}
                  y1={`${node.y}%`}
                  x2={`${child.x}%`}
                  y2={`${child.y}%`}
                  stroke="#334155"
                  strokeWidth="2"
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
                  strokeWidth="2"
                />
              );
            }
            return lines;
          })}
        </svg>

        {/* Tree Nodes */}
        <div className="absolute inset-0">
          {nodesList.map((node) => {
            const isActive = step.activeNodeId === node.id;
            const inQueue = step.queue.includes(node.id);
            const color = levelColors[node.level % levelColors.length];

            return (
              <div
                key={node.id}
                style={{
                  left: `${node.x}%`,
                  top: `${node.y}%`,
                  transform: 'translate(-50%, -50%)',
                }}
                className={`absolute w-12 h-12 rounded-2xl border-2 flex flex-col items-center justify-center transition-all duration-300 shadow-md ${
                  isActive
                    ? 'border-emerald-400 bg-emerald-950/90 text-white scale-125 z-20 shadow-emerald-500/30 ring-2 ring-emerald-400'
                    : inQueue
                    ? 'border-indigo-400 bg-indigo-950/80 text-white scale-110 z-10 shadow-indigo-500/20'
                    : `${color.border} ${color.bg} text-slate-200 z-0`
                }`}
              >
                <span className="text-sm font-bold font-mono">{node.val}</span>
                {isActive && (
                  <span className="absolute -top-3 px-1 py-0.2 rounded bg-emerald-500 text-[8px] font-bold text-slate-950 uppercase tracking-wider shadow">
                    Popped
                  </span>
                )}
                {inQueue && !isActive && (
                  <span className="absolute -top-3 px-1 py-0.2 rounded bg-indigo-500 text-[8px] font-bold text-white uppercase tracking-wider shadow">
                    In Queue
                  </span>
                )}
              </div>
            );
          })}
        </div>
      </div>

      {/* Levels Output Tray */}
      <div className="bg-slate-950/80 border border-slate-800/80 rounded-xl p-2.5 flex items-center justify-between gap-3 text-xs shrink-0">
        <div className="flex items-center gap-2 flex-wrap">
          <span className="text-indigo-400 font-bold font-mono flex items-center gap-1">
            <ListFilter className="w-3.5 h-3.5" /> Levels:
          </span>
          {step.result.length === 0 ? (
            <span className="text-slate-500 italic text-[11px]">No levels completed yet...</span>
          ) : (
            step.result.map((lvl, idx) => {
              const color = levelColors[idx % levelColors.length];
              return (
                <div
                  key={idx}
                  className={`px-2 py-0.5 rounded-lg border text-xs font-mono font-semibold flex items-center gap-1.5 ${color.badge}`}
                >
                  <span className="text-[10px] text-slate-400">L{idx}:</span>
                  <span>[{lvl.join(', ')}]</span>
                </div>
              );
            })
          )}
          {step.currentLevel.length > 0 && !step.isComplete && (
            <div className="px-2 py-0.5 rounded-lg border border-dashed border-slate-600 bg-slate-900/50 text-xs font-mono text-slate-300 flex items-center gap-1.5 animate-pulse">
              <span className="text-[10px] text-slate-400">L{step.levelNum} building:</span>
              <span>[{step.currentLevel.join(', ')}]</span>
            </div>
          )}
        </div>

        <div className="flex items-center gap-2 shrink-0 text-[11px] font-mono text-slate-400">
          <span>
            Queue: <strong className="text-white">[{step.queue.map((id) => step.nodes[id]?.val).join(', ')}]</strong>
          </span>
        </div>
      </div>
    </div>
  );
};
