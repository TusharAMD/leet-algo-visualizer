import React from 'react';
import { GraphValidTreeStep } from '../../algorithms/graphValidTreeIntuitive';
import { Trees, CheckCircle2, AlertTriangle, ShieldCheck, Check, X } from 'lucide-react';

interface GraphValidTreeViewerProps {
  step: GraphValidTreeStep;
}

export const GraphValidTreeViewer: React.FC<GraphValidTreeViewerProps> = ({ step }) => {
  const {
    n,
    edges,
    activeEdgeIndex,
    activeEdge,
    parent,
    cycleEdge,
    headline,
    subtext,
    isComplete,
    isValid,
    stepIndex,
    totalSteps
  } = step;

  const radius = 120;
  const centerX = 200;
  const centerY = 150;

  const nodePositions = Array.from({ length: n }).map((_, i) => {
    const angle = (2 * Math.PI * i) / n - Math.PI / 2;
    return {
      val: i,
      x: centerX + radius * Math.cos(angle),
      y: centerY + radius * Math.sin(angle)
    };
  });

  const getNodePos = (val: number) => {
    return nodePositions.find(p => p.val === val) || { x: 200, y: 150 };
  };

  const edgeCountMatches = edges.length === n - 1;
  const acyclicMatches = cycleEdge === null && (isComplete ? isValid : true);

  return (
    <div className="flex-1 min-h-0 flex flex-col bg-slate-900/60 border border-slate-800 rounded-2xl p-3 shadow-xl overflow-hidden justify-between">
      {/* Top Banner */}
      <div className="bg-slate-950/70 border border-slate-800/80 rounded-xl p-2.5 flex items-center justify-between shrink-0">
        <div className="flex items-center gap-2">
          <span className="p-1.5 rounded-lg bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
            <Trees className="w-4 h-4" />
          </span>
          <div>
            <h3 className="text-xs font-semibold text-white tracking-wide">{headline}</h3>
            <p className="text-[11px] text-slate-400">{subtext}</p>
          </div>
        </div>
        <div className="flex items-center gap-2">
          {isComplete ? (
            isValid ? (
              <span className="px-2.5 py-0.5 rounded-md bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 text-xs font-mono font-bold flex items-center gap-1">
                <CheckCircle2 className="w-3.5 h-3.5" /> Valid Tree (True)
              </span>
            ) : (
              <span className="px-2.5 py-0.5 rounded-md bg-rose-500/10 border border-rose-500/20 text-rose-400 text-xs font-mono font-bold flex items-center gap-1">
                <AlertTriangle className="w-3.5 h-3.5" /> Invalid Tree (False)
              </span>
            )
          ) : (
            <span className="px-2 py-0.5 rounded-md bg-indigo-500/10 border border-indigo-500/20 text-indigo-400 text-[11px] font-mono">
              Step {stepIndex + 1} / {totalSteps}
            </span>
          )}
        </div>
      </div>

      {/* Main Arena */}
      <div className="flex-1 min-h-0 grid grid-cols-1 md:grid-cols-12 gap-3 py-1 px-1">
        {/* Left: Graph SVG */}
        <div className="md:col-span-8 flex flex-col items-center justify-center p-2 rounded-xl bg-slate-950/40 border border-slate-800/60 relative overflow-hidden">
          <svg className="w-full h-full max-h-[300px]" viewBox="0 0 400 300">
            {/* Edges */}
            {edges.map(([u, v], idx) => {
              const posU = getNodePos(u);
              const posV = getNodePos(v);

              const isCycle =
                cycleEdge !== null &&
                ((cycleEdge[0] === u && cycleEdge[1] === v) ||
                  (cycleEdge[0] === v && cycleEdge[1] === u));

              const isCurrent = activeEdgeIndex === idx;
              const isPast = activeEdgeIndex !== null && idx < activeEdgeIndex;

              let strokeColor = '#334155';
              let strokeWidth = '1.5';
              let strokeDash: string | undefined = '4 4';

              if (isCycle) {
                strokeColor = '#f43f5e';
                strokeWidth = '3.5';
                strokeDash = undefined;
              } else if (isCurrent) {
                strokeColor = '#818cf8';
                strokeWidth = '3';
                strokeDash = undefined;
              } else if (isPast) {
                strokeColor = '#10b981';
                strokeWidth = '2';
                strokeDash = undefined;
              }

              return (
                <line
                  key={idx}
                  x1={posU.x}
                  y1={posU.y}
                  x2={posV.x}
                  y2={posV.y}
                  stroke={strokeColor}
                  strokeWidth={strokeWidth}
                  strokeDasharray={strokeDash}
                  className="transition-all duration-300"
                />
              );
            })}

            {/* Nodes */}
            {nodePositions.map((node) => {
              const val = node.val;
              const isNodeActive =
                activeEdge !== null && (activeEdge[0] === val || activeEdge[1] === val);
              const isCycleNode =
                cycleEdge !== null && (cycleEdge[0] === val || cycleEdge[1] === val);

              let fillColor = '#0f172a';
              let strokeColor = '#475569';
              let textColor = '#e2e8f0';

              if (isCycleNode) {
                fillColor = '#881337';
                strokeColor = '#f43f5e';
                textColor = '#fda4af';
              } else if (isNodeActive) {
                fillColor = '#312e81';
                strokeColor = '#818cf8';
                textColor = '#ffffff';
              }

              return (
                <g key={val} className="transition-all duration-300">
                  <circle
                    cx={node.x}
                    cy={node.y}
                    r="18"
                    fill={fillColor}
                    stroke={strokeColor}
                    strokeWidth={isNodeActive || isCycleNode ? '3' : '2'}
                  />
                  <text
                    x={node.x}
                    y={node.y + 4}
                    textAnchor="middle"
                    fill={textColor}
                    fontSize="13"
                    fontFamily="monospace"
                    fontWeight="bold"
                  >
                    {val}
                  </text>
                </g>
              );
            })}
          </svg>
        </div>

        {/* Right: Tree Axioms Verification */}
        <div className="md:col-span-4 flex flex-col gap-2 min-h-0">
          <div className="bg-slate-950/40 border border-slate-800/60 rounded-xl p-2.5 flex flex-col gap-2 shrink-0">
            <span className="text-[10px] uppercase font-bold text-slate-400 tracking-wider flex items-center gap-1">
              <ShieldCheck className="w-3 h-3 text-indigo-400" /> 2 Tree Invariants
            </span>

            {/* Condition 1 Card */}
            <div
              className={`p-2 rounded-lg border text-xs flex items-center justify-between ${
                edgeCountMatches
                  ? 'bg-emerald-500/10 border-emerald-500/30 text-emerald-300'
                  : 'bg-rose-500/10 border-rose-500/30 text-rose-300'
              }`}
            >
              <div>
                <div className="font-semibold text-[11px]">1. Edge Count (|E| = |V| - 1)</div>
                <div className="text-[10px] opacity-80">
                  {edges.length} edges vs {n - 1} required
                </div>
              </div>
              {edgeCountMatches ? (
                <Check className="w-4 h-4 text-emerald-400" />
              ) : (
                <X className="w-4 h-4 text-rose-400" />
              )}
            </div>

            {/* Condition 2 Card */}
            <div
              className={`p-2 rounded-lg border text-xs flex items-center justify-between ${
                acyclicMatches
                  ? 'bg-emerald-500/10 border-emerald-500/30 text-emerald-300'
                  : 'bg-rose-500/10 border-rose-500/30 text-rose-300'
              }`}
            >
              <div>
                <div className="font-semibold text-[11px]">2. No Cycles (Acyclic)</div>
                <div className="text-[10px] opacity-80">
                  {cycleEdge ? `Cycle at (${cycleEdge.join(', ')})` : 'No cycles found so far'}
                </div>
              </div>
              {acyclicMatches ? (
                <Check className="w-4 h-4 text-emerald-400" />
              ) : (
                <X className="w-4 h-4 text-rose-400" />
              )}
            </div>
          </div>

          {/* DSU Parent Array */}
          <div className="bg-slate-950/40 border border-slate-800/60 rounded-xl p-2.5 flex flex-col gap-1 flex-1 min-h-0 overflow-y-auto">
            <span className="text-[10px] uppercase font-bold text-slate-400 tracking-wider">
              DSU Parent Array
            </span>
            <div className="flex flex-wrap gap-1.5 mt-1">
              {parent.map((p, idx) => (
                <div
                  key={idx}
                  className="px-2 py-0.5 rounded bg-slate-900 border border-slate-800 text-[11px] font-mono text-slate-300 flex items-center gap-1"
                >
                  <span className="text-slate-500">{idx}&rarr;</span>
                  <span className="text-indigo-300 font-bold">{p}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Legend */}
      <div className="flex items-center justify-between bg-slate-950/60 border border-slate-800/60 rounded-xl px-3 py-1.5 shrink-0 text-xs">
        <div className="flex items-center gap-3">
          <div className="flex items-center gap-1.5">
            <span className="w-3 h-3 rounded-full bg-emerald-950 border border-emerald-500" />
            <span className="text-emerald-300 text-[11px]">Tree Edge</span>
          </div>
          <div className="flex items-center gap-1.5">
            <span className="w-3 h-3 rounded-full bg-indigo-900 border border-indigo-400" />
            <span className="text-indigo-300 text-[11px]">Checking</span>
          </div>
          <div className="flex items-center gap-1.5">
            <span className="w-3 h-3 rounded-full bg-rose-950 border border-rose-500" />
            <span className="text-rose-400 text-[11px]">Cycle Edge</span>
          </div>
        </div>

        {isComplete && (
          <div className="flex items-center gap-1 font-semibold text-[11px]">
            {isValid ? (
              <span className="text-emerald-400 flex items-center gap-1">
                <CheckCircle2 className="w-3.5 h-3.5" /> Valid Tree Confirmed
              </span>
            ) : (
              <span className="text-rose-400 flex items-center gap-1">
                <AlertTriangle className="w-3.5 h-3.5" /> Graph Fails Tree Axioms
              </span>
            )}
          </div>
        )}
      </div>
    </div>
  );
};
