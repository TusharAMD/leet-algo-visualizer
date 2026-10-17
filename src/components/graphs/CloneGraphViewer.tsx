import React from 'react';
import { CloneGraphStep } from '../../algorithms/cloneGraphIntuitive';
import { GitBranch, CheckCircle2, ArrowRight, Share2, Layers, Database, Copy } from 'lucide-react';

interface CloneGraphViewerProps {
  step: CloneGraphStep;
}

export const CloneGraphViewer: React.FC<CloneGraphViewerProps> = ({ step }) => {
  const {
    originalGraph,
    clonedGraph,
    oldToNew,
    activeNodeId,
    activeNeighborId,
    state,
    headline,
    subtext,
    isComplete,
    stepIndex,
    totalSteps
  } = step;

  return (
    <div className="flex-1 min-h-0 flex flex-col bg-slate-900/60 border border-slate-800 rounded-2xl p-3 shadow-xl overflow-hidden justify-between">
      {/* Top Banner */}
      <div className="bg-slate-950/70 border border-slate-800/80 rounded-xl p-2.5 flex items-center justify-between shrink-0">
        <div className="flex items-center gap-2">
          <span className="p-1.5 rounded-lg bg-indigo-500/10 text-indigo-400 border border-indigo-500/20">
            <Copy className="w-4 h-4" />
          </span>
          <div>
            <h3 className="text-xs font-semibold text-white tracking-wide">{headline}</h3>
            <p className="text-[11px] text-slate-400">{subtext}</p>
          </div>
        </div>
        <div className="flex items-center gap-2">
          {isComplete ? (
            <span className="px-2 py-0.5 rounded-md bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 text-[11px] font-semibold flex items-center gap-1">
              <CheckCircle2 className="w-3.5 h-3.5" /> Cloned {clonedGraph.length} Nodes
            </span>
          ) : (
            <span className="px-2 py-0.5 rounded-md bg-indigo-500/10 border border-indigo-500/20 text-indigo-400 text-[11px] font-mono">
              Step {stepIndex + 1} / {totalSteps}
            </span>
          )}
        </div>
      </div>

      {/* Main Dual Arena: Original Graph vs Cloned Graph */}
      <div className="flex-1 min-h-0 grid grid-cols-1 md:grid-cols-12 gap-3 py-1 px-1">
        {/* Left: Original Graph Canvas */}
        <div className="md:col-span-5 bg-slate-950/60 border border-slate-800 rounded-xl p-2 flex flex-col justify-between overflow-hidden relative">
          <div className="flex items-center justify-between text-[10px] text-slate-400 border-b border-slate-800/70 pb-1 shrink-0">
            <span className="font-semibold uppercase tracking-wider text-slate-300">
              Original Graph
            </span>
            <span className="font-mono">{originalGraph.length} Nodes</span>
          </div>

          <div className="flex-1 relative w-full h-full min-h-[140px]">
            <svg className="w-full h-full absolute inset-0">
              {originalGraph.map((node) =>
                node.neighbors.map((neiId) => {
                  const target = originalGraph.find((n) => n.id === neiId);
                  if (!target || node.id > target.id) return null; // draw each undirected edge once
                  const isEdgeActive =
                    (node.id === activeNodeId && neiId === activeNeighborId) ||
                    (node.id === activeNeighborId && neiId === activeNodeId);
                  return (
                    <line
                      key={`${node.id}-${neiId}`}
                      x1={`${node.x}%`}
                      y1={`${node.y}%`}
                      x2={`${target.x}%`}
                      y2={`${target.y}%`}
                      stroke={isEdgeActive ? '#818cf8' : '#334155'}
                      strokeWidth={isEdgeActive ? 3 : 2}
                    />
                  );
                })
              )}
            </svg>

            {/* Nodes */}
            {originalGraph.map((node) => {
              const isActive = node.id === activeNodeId;
              const isTargetNei = node.id === activeNeighborId;
              const isCloned = oldToNew[node.id] !== undefined;

              return (
                <div
                  key={node.id}
                  style={{
                    left: `${node.x}%`,
                    top: `${node.y}%`,
                    transform: 'translate(-50%, -50%)'
                  }}
                  className={`absolute w-10 h-10 rounded-2xl flex items-center justify-center font-mono font-bold text-xs border shadow-lg transition-all ${
                    isActive
                      ? 'bg-amber-500/25 border-amber-400 text-amber-200 ring-4 ring-amber-400/50 scale-110 z-10'
                      : isTargetNei
                      ? 'bg-indigo-500/25 border-indigo-400 text-indigo-200 ring-2 ring-indigo-400 scale-105 z-10'
                      : isCloned
                      ? 'bg-slate-850 border-slate-700 text-slate-400'
                      : 'bg-slate-900 border-slate-800 text-slate-200'
                  }`}
                >
                  {node.val}
                </div>
              );
            })}
          </div>

          <div className="text-[10px] text-slate-500 text-center shrink-0">
            Source references in memory
          </div>
        </div>

        {/* Center: Hash Map `oldToNew` */}
        <div className="md:col-span-2 bg-slate-950/80 border border-slate-800 rounded-xl p-2 flex flex-col justify-between overflow-hidden">
          <div className="text-[10px] uppercase font-bold text-slate-400 text-center border-b border-slate-800/70 pb-1 shrink-0">
            `oldToNew`
          </div>

          <div className="flex-1 overflow-y-auto py-1 flex flex-col gap-1 items-center justify-center">
            {Object.keys(oldToNew).length === 0 ? (
              <span className="text-slate-600 text-[10px] italic">Empty Map</span>
            ) : (
              Object.entries(oldToNew).map(([k, v]) => (
                <div
                  key={k}
                  className="px-2 py-0.5 rounded bg-slate-900 border border-slate-800 text-[10px] font-mono flex items-center gap-1"
                >
                  <span className="text-indigo-400">Node({k})</span>
                  <span className="text-slate-600">→</span>
                  <span className="text-emerald-400">Clone({v})</span>
                </div>
              ))
            )}
          </div>

          <span className="text-[9px] text-slate-500 text-center shrink-0">
            Maps old id to clone
          </span>
        </div>

        {/* Right: Cloned Graph Canvas */}
        <div className="md:col-span-5 bg-slate-950/60 border border-slate-800 rounded-xl p-2 flex flex-col justify-between overflow-hidden relative">
          <div className="flex items-center justify-between text-[10px] text-slate-400 border-b border-slate-800/70 pb-1 shrink-0">
            <span className="font-semibold uppercase tracking-wider text-emerald-400">
              Deep-Cloned Graph
            </span>
            <span className="font-mono text-emerald-300">
              {clonedGraph.length} Clones Created
            </span>
          </div>

          <div className="flex-1 relative w-full h-full min-h-[140px]">
            {clonedGraph.length === 0 ? (
              <div className="w-full h-full flex items-center justify-center text-slate-600 text-xs italic">
                Awaiting first clone instantiation...
              </div>
            ) : (
              <>
                <svg className="w-full h-full absolute inset-0">
                  {clonedGraph.map((node) =>
                    node.neighbors.map((neiId) => {
                      const target = clonedGraph.find((n) => n.id === neiId);
                      if (!target || node.id > target.id) return null;
                      return (
                        <line
                          key={`clone-${node.id}-${neiId}`}
                          x1={`${node.x}%`}
                          y1={`${node.y}%`}
                          x2={`${target.x}%`}
                          y2={`${target.y}%`}
                          stroke="#10b981"
                          strokeWidth="2"
                        />
                      );
                    })
                  )}
                </svg>

                {/* Nodes */}
                {clonedGraph.map((node) => (
                  <div
                    key={`cloned-${node.id}`}
                    style={{
                      left: `${node.x}%`,
                      top: `${node.y}%`,
                      transform: 'translate(-50%, -50%)'
                    }}
                    className="absolute w-10 h-10 rounded-2xl bg-emerald-500/20 border-2 border-emerald-400 text-emerald-200 flex items-center justify-center font-mono font-bold text-xs shadow-lg shadow-emerald-500/20"
                  >
                    {node.val}
                  </div>
                ))}
              </>
            )}
          </div>

          <div className="text-[10px] text-slate-500 text-center shrink-0">
            Completely new node references
          </div>
        </div>
      </div>
    </div>
  );
};
