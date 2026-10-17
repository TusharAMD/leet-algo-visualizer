import React from 'react';
import { RedundantConnectionStep } from '../../algorithms/redundantConnectionIntuitive';
import { GitBranch, AlertTriangle, CheckCircle2, ShieldAlert, Sparkles } from 'lucide-react';

interface RedundantConnectionViewerProps {
  step: RedundantConnectionStep;
}

export const RedundantConnectionViewer: React.FC<RedundantConnectionViewerProps> = ({ step }) => {
  const {
    edges,
    activeEdgeIndex,
    activeEdge,
    parent,
    rank,
    redundantEdge,
    headline,
    subtext,
    isComplete,
    stepIndex,
    totalSteps
  } = step;

  const n = edges.length;

  // Node positions in a circle
  const radius = 120;
  const centerX = 200;
  const centerY = 150;

  const nodePositions = Array.from({ length: n }).map((_, i) => {
    const nodeVal = i + 1;
    const angle = (2 * Math.PI * i) / n - Math.PI / 2;
    return {
      val: nodeVal,
      x: centerX + radius * Math.cos(angle),
      y: centerY + radius * Math.sin(angle)
    };
  });

  const getNodePos = (val: number) => {
    return nodePositions.find(p => p.val === val) || { x: 200, y: 150 };
  };

  return (
    <div className="flex-1 min-h-0 flex flex-col bg-slate-900/60 border border-slate-800 rounded-2xl p-3 shadow-xl overflow-hidden justify-between">
      {/* Top Banner */}
      <div className="bg-slate-950/70 border border-slate-800/80 rounded-xl p-2.5 flex items-center justify-between shrink-0">
        <div className="flex items-center gap-2">
          <span className="p-1.5 rounded-lg bg-indigo-500/10 text-indigo-400 border border-indigo-500/20">
            <GitBranch className="w-4 h-4" />
          </span>
          <div>
            <h3 className="text-xs font-semibold text-white tracking-wide">{headline}</h3>
            <p className="text-[11px] text-slate-400">{subtext}</p>
          </div>
        </div>
        <div className="flex items-center gap-2">
          {redundantEdge ? (
            <span className="px-2.5 py-0.5 rounded-md bg-rose-500/10 border border-rose-500/20 text-rose-400 text-xs font-mono font-bold flex items-center gap-1">
              <AlertTriangle className="w-3.5 h-3.5" /> Redundant: [{redundantEdge.join(', ')}]
            </span>
          ) : (
            <span className="px-2 py-0.5 rounded-md bg-indigo-500/10 border border-indigo-500/20 text-indigo-400 text-[11px] font-mono">
              Step {stepIndex + 1} / {totalSteps}
            </span>
          )}
        </div>
      </div>

      {/* Main Arena */}
      <div className="flex-1 min-h-0 grid grid-cols-1 md:grid-cols-12 gap-3 py-1 px-1">
        {/* Left: SVG Graph Arena */}
        <div className="md:col-span-8 flex flex-col items-center justify-center p-2 rounded-xl bg-slate-950/40 border border-slate-800/60 relative overflow-hidden">
          <svg className="w-full h-full max-h-[300px]" viewBox="0 0 400 300">
            {/* Edges */}
            {edges.map(([u, v], idx) => {
              const posU = getNodePos(u);
              const posV = getNodePos(v);

              const isRedundant =
                redundantEdge !== null &&
                ((redundantEdge[0] === u && redundantEdge[1] === v) ||
                  (redundantEdge[0] === v && redundantEdge[1] === u));

              const isCurrent = activeEdgeIndex === idx;
              const isPast = activeEdgeIndex !== null && idx < activeEdgeIndex;

              let strokeColor = '#334155';
              let strokeWidth = '1.5';
              let strokeDash: string | undefined = '4 4';

              if (isRedundant) {
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
                <g key={idx}>
                  <line
                    x1={posU.x}
                    y1={posU.y}
                    x2={posV.x}
                    y2={posV.y}
                    stroke={strokeColor}
                    strokeWidth={strokeWidth}
                    strokeDasharray={strokeDash}
                    className="transition-all duration-300"
                  />
                  {/* Edge index label */}
                  <circle
                    cx={(posU.x + posV.x) / 2}
                    cy={(posU.y + posV.y) / 2}
                    r="8"
                    fill="#0f172a"
                    stroke={strokeColor}
                    strokeWidth="1"
                  />
                  <text
                    x={(posU.x + posV.x) / 2}
                    y={(posU.y + posV.y) / 2 + 3}
                    textAnchor="middle"
                    fill="#94a3b8"
                    fontSize="9"
                    fontFamily="monospace"
                  >
                    {idx + 1}
                  </text>
                </g>
              );
            })}

            {/* Nodes */}
            {nodePositions.map((node) => {
              const val = node.val;
              const isNodeActive =
                activeEdge !== null && (activeEdge[0] === val || activeEdge[1] === val);
              const isCycleNode =
                redundantEdge !== null &&
                (redundantEdge[0] === val || redundantEdge[1] === val);

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

        {/* Right: Union-Find State Card */}
        <div className="md:col-span-4 flex flex-col gap-2 min-h-0">
          {/* Disjoint Set Array */}
          <div className="bg-slate-950/40 border border-slate-800/60 rounded-xl p-2.5 flex flex-col gap-1.5 flex-1 min-h-0 overflow-y-auto">
            <span className="text-[10px] uppercase font-bold text-slate-400 tracking-wider flex items-center gap-1">
              <ShieldAlert className="w-3 h-3 text-indigo-400" /> Disjoint-Set (Parent Pointers)
            </span>

            <div className="space-y-1.5 mt-1">
              <div className="grid grid-cols-3 text-[10px] font-mono text-slate-500 uppercase px-1">
                <span>Node</span>
                <span>Parent</span>
                <span>Rank</span>
              </div>
              {Array.from({ length: n }).map((_, i) => {
                const nodeVal = i + 1;
                const parVal = parent[nodeVal] ?? nodeVal;
                const rVal = rank[nodeVal] ?? 1;
                const isRoot = parVal === nodeVal;

                return (
                  <div
                    key={nodeVal}
                    className={`grid grid-cols-3 items-center px-2 py-1 rounded text-xs font-mono border ${
                      isRoot
                        ? 'bg-indigo-500/10 border-indigo-500/30 text-indigo-200'
                        : 'bg-slate-900/60 border-slate-800 text-slate-400'
                    }`}
                  >
                    <span className="font-bold">Node {nodeVal}</span>
                    <span className="flex items-center gap-1">
                      {parVal} {isRoot && <span className="text-[9px] text-indigo-400">(Root)</span>}
                    </span>
                    <span>{rVal}</span>
                  </div>
                );
              })}
            </div>

            <div className="mt-auto p-2 rounded-lg bg-slate-900/60 border border-slate-800 text-[11px] text-slate-300">
              <div className="font-semibold text-rose-300 flex items-center gap-1 mb-0.5">
                <AlertTriangle className="w-3 h-3 text-rose-400" /> Redundancy Rule:
              </div>
              If an edge connects two nodes that already resolve to the exact same component root, it introduces an extra cycle.
            </div>
          </div>
        </div>
      </div>

      {/* Legend */}
      <div className="flex items-center justify-between bg-slate-950/60 border border-slate-800/60 rounded-xl px-3 py-1.5 shrink-0 text-xs">
        <div className="flex items-center gap-3">
          <div className="flex items-center gap-1.5">
            <span className="w-4 h-0.5 bg-emerald-500 rounded" />
            <span className="text-emerald-300 text-[11px]">Valid Tree Edge</span>
          </div>
          <div className="flex items-center gap-1.5">
            <span className="w-4 h-0.5 bg-indigo-400 rounded" />
            <span className="text-indigo-300 text-[11px]">Inspecting Edge</span>
          </div>
          <div className="flex items-center gap-1.5">
            <span className="w-4 h-0.5 bg-rose-500 rounded" />
            <span className="text-rose-400 text-[11px]">Redundant Cycle Edge</span>
          </div>
        </div>

        {redundantEdge && (
          <div className="flex items-center gap-1 text-rose-400 font-semibold text-[11px]">
            <Sparkles className="w-3.5 h-3.5" /> Return [{redundantEdge.join(', ')}]
          </div>
        )}
      </div>
    </div>
  );
};
