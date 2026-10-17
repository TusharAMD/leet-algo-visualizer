import React from 'react';
import { ConnectedComponentsStep } from '../../algorithms/connectedComponentsIntuitive';
import { Network, CheckCircle2, Layers, Share2, Sparkles } from 'lucide-react';

interface ConnectedComponentsViewerProps {
  step: ConnectedComponentsStep;
}

const CLUSTER_COLORS = [
  { bg: '#312e81', stroke: '#818cf8', text: '#c7d2fe', badgeBg: 'bg-indigo-500/20 text-indigo-300 border-indigo-500/40' },
  { bg: '#064e3b', stroke: '#10b981', text: '#6ee7b7', badgeBg: 'bg-emerald-500/20 text-emerald-300 border-emerald-500/40' },
  { bg: '#78350f', stroke: '#f59e0b', text: '#fde68a', badgeBg: 'bg-amber-500/20 text-amber-300 border-amber-500/40' },
  { bg: '#881337', stroke: '#f43f5e', text: '#fda4af', badgeBg: 'bg-rose-500/20 text-rose-300 border-rose-500/40' },
  { bg: '#164e63', stroke: '#06b6d4', text: '#67e8f9', badgeBg: 'bg-cyan-500/20 text-cyan-300 border-cyan-500/40' },
  { bg: '#581c87', stroke: '#a855f7', text: '#d8b4fe', badgeBg: 'bg-purple-500/20 text-purple-300 border-purple-500/40' }
];

export const ConnectedComponentsViewer: React.FC<ConnectedComponentsViewerProps> = ({ step }) => {
  const {
    n,
    edges,
    activeEdgeIndex,
    activeEdge,
    componentCount,
    componentGroups,
    headline,
    subtext,
    isComplete,
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

  // Map each root to a color palette
  const uniqueRoots = Object.keys(componentGroups).map(Number);
  const rootColorMap: { [root: number]: number } = {};
  uniqueRoots.forEach((r, idx) => {
    rootColorMap[r] = idx % CLUSTER_COLORS.length;
  });

  const getNodeColor = (nodeVal: number) => {
    for (const [rStr, members] of Object.entries(componentGroups)) {
      if (members.includes(nodeVal)) {
        const root = Number(rStr);
        const colorIdx = rootColorMap[root] ?? 0;
        return CLUSTER_COLORS[colorIdx];
      }
    }
    return CLUSTER_COLORS[0];
  };

  return (
    <div className="flex-1 min-h-0 flex flex-col bg-slate-900/60 border border-slate-800 rounded-2xl p-3 shadow-xl overflow-hidden justify-between">
      {/* Top Banner */}
      <div className="bg-slate-950/70 border border-slate-800/80 rounded-xl p-2.5 flex items-center justify-between shrink-0">
        <div className="flex items-center gap-2">
          <span className="p-1.5 rounded-lg bg-indigo-500/10 text-indigo-400 border border-indigo-500/20">
            <Network className="w-4 h-4" />
          </span>
          <div>
            <h3 className="text-xs font-semibold text-white tracking-wide">{headline}</h3>
            <p className="text-[11px] text-slate-400">{subtext}</p>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <span className="px-2.5 py-0.5 rounded-md bg-indigo-500/10 border border-indigo-500/20 text-indigo-300 text-xs font-mono font-bold flex items-center gap-1">
            <Share2 className="w-3.5 h-3.5" /> {componentCount} Components
          </span>
          <span className="px-2 py-0.5 rounded-md bg-slate-800 text-slate-400 text-[11px] font-mono">
            Step {stepIndex + 1} / {totalSteps}
          </span>
        </div>
      </div>

      {/* Main Arena */}
      <div className="flex-1 min-h-0 grid grid-cols-1 md:grid-cols-12 gap-3 py-1 px-1">
        {/* Left: SVG Graph */}
        <div className="md:col-span-8 flex flex-col items-center justify-center p-2 rounded-xl bg-slate-950/40 border border-slate-800/60 relative overflow-hidden">
          <svg className="w-full h-full max-h-[300px]" viewBox="0 0 400 300">
            {/* Edges */}
            {edges.map(([u, v], idx) => {
              const posU = getNodePos(u);
              const posV = getNodePos(v);

              const isCurrent = activeEdgeIndex === idx;
              const isPast = activeEdgeIndex !== null && idx < activeEdgeIndex;

              let strokeColor = '#334155';
              let strokeWidth = '1.5';
              let strokeDash: string | undefined = '4 4';

              if (isCurrent) {
                strokeColor = '#f59e0b';
                strokeWidth = '3';
                strokeDash = undefined;
              } else if (isPast) {
                const nodeCol = getNodeColor(u);
                strokeColor = nodeCol.stroke;
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
              const col = getNodeColor(val);

              return (
                <g key={val} className="transition-all duration-300">
                  <circle
                    cx={node.x}
                    cy={node.y}
                    r="18"
                    fill={col.bg}
                    stroke={isNodeActive ? '#f59e0b' : col.stroke}
                    strokeWidth={isNodeActive ? '3' : '2'}
                  />
                  <text
                    x={node.x}
                    y={node.y + 4}
                    textAnchor="middle"
                    fill={col.text}
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

        {/* Right: Connected Component Clusters */}
        <div className="md:col-span-4 flex flex-col gap-2 min-h-0">
          <div className="bg-slate-950/40 border border-slate-800/60 rounded-xl p-2.5 flex flex-col gap-2 flex-1 min-h-0 overflow-y-auto">
            <span className="text-[10px] uppercase font-bold text-slate-400 tracking-wider flex items-center gap-1">
              <Layers className="w-3 h-3 text-indigo-400" /> Active Component Clusters ({uniqueRoots.length})
            </span>

            <div className="space-y-2 mt-1">
              {uniqueRoots.map((root) => {
                const members = componentGroups[root] || [];
                const colorIdx = rootColorMap[root] ?? 0;
                const col = CLUSTER_COLORS[colorIdx];

                return (
                  <div
                    key={root}
                    className={`p-2 rounded-xl border flex flex-col gap-1 ${col.badgeBg}`}
                  >
                    <div className="flex items-center justify-between text-xs font-bold">
                      <span>Component Root: Node {root}</span>
                      <span className="text-[10px] font-mono opacity-80">
                        {members.length} node{members.length > 1 ? 's' : ''}
                      </span>
                    </div>
                    <div className="flex flex-wrap gap-1">
                      {members.map((m) => (
                        <span
                          key={m}
                          className="px-2 py-0.5 rounded bg-slate-950/60 font-mono text-xs border border-white/10"
                        >
                          Node {m}
                        </span>
                      ))}
                    </div>
                  </div>
                );
              })}
            </div>

            <div className="mt-auto p-2 rounded-lg bg-slate-900/60 border border-slate-800 text-[11px] text-slate-300">
              <span className="font-semibold text-emerald-400">Union-Find Reduction:</span>
              <p className="text-[10px] text-slate-400 mt-0.5">
                Each non-redundant edge unites two disjoint components, strictly decreasing the component count by 1.
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Legend */}
      <div className="flex items-center justify-between bg-slate-950/60 border border-slate-800/60 rounded-xl px-3 py-1.5 shrink-0 text-xs">
        <div className="flex items-center gap-3">
          <div className="flex items-center gap-1.5">
            <span className="w-3 h-3 rounded-full bg-indigo-950 border border-indigo-500" />
            <span className="text-indigo-300 text-[11px]">Cluster 1</span>
          </div>
          <div className="flex items-center gap-1.5">
            <span className="w-3 h-3 rounded-full bg-emerald-950 border border-emerald-500" />
            <span className="text-emerald-300 text-[11px]">Cluster 2</span>
          </div>
          <div className="flex items-center gap-1.5">
            <span className="w-3 h-3 rounded-full bg-amber-950 border border-amber-500" />
            <span className="text-amber-300 text-[11px]">Cluster 3</span>
          </div>
        </div>

        {isComplete && (
          <div className="flex items-center gap-1 text-emerald-400 font-semibold text-[11px]">
            <CheckCircle2 className="w-3.5 h-3.5" /> Return: {componentCount}
          </div>
        )}
      </div>
    </div>
  );
};
