import React from 'react';
import { MinCostStep } from '../../algorithms/minCostConnectPointsIntuitive';
import { Waypoints, CheckCircle2, Layers, Sparkles, Hash } from 'lucide-react';

interface MinCostConnectPointsViewerProps {
  step: MinCostStep;
}

export const MinCostConnectPointsViewer: React.FC<MinCostConnectPointsViewerProps> = ({ step }) => {
  const {
    points,
    visitedPoints,
    mstEdges,
    currentNode,
    activeEdge,
    heap,
    totalCost,
    headline,
    subtext,
    isComplete,
    stepIndex,
    totalSteps
  } = step;

  // Compute bounding box for SVG projection
  const xs = points.map(p => p[0]);
  const ys = points.map(p => p[1]);
  const minX = Math.min(...xs, 0);
  const maxX = Math.max(...xs, 10);
  const minY = Math.min(...ys, 0);
  const maxY = Math.max(...ys, 10);

  const padding = 40;
  const svgWidth = 400;
  const svgHeight = 280;

  const projectX = (x: number) => {
    const range = maxX - minX || 1;
    return padding + ((x - minX) / range) * (svgWidth - 2 * padding);
  };

  const projectY = (y: number) => {
    const range = maxY - minY || 1;
    // Invert Y for standard Cartesian coordinates
    return svgHeight - padding - ((y - minY) / range) * (svgHeight - 2 * padding);
  };

  return (
    <div className="flex-1 min-h-0 flex flex-col bg-slate-900/60 border border-slate-800 rounded-2xl p-3 shadow-xl overflow-hidden justify-between">
      {/* Top Banner */}
      <div className="bg-slate-950/70 border border-slate-800/80 rounded-xl p-2.5 flex items-center justify-between shrink-0">
        <div className="flex items-center gap-2">
          <span className="p-1.5 rounded-lg bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
            <Waypoints className="w-4 h-4" />
          </span>
          <div>
            <h3 className="text-xs font-semibold text-white tracking-wide">{headline}</h3>
            <p className="text-[11px] text-slate-400">{subtext}</p>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <span className="px-2.5 py-0.5 rounded-md bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 text-xs font-mono font-bold flex items-center gap-1">
            Cost: {totalCost}
          </span>
          <span className="px-2 py-0.5 rounded-md bg-slate-800 text-slate-400 text-[11px] font-mono">
            Step {stepIndex + 1} / {totalSteps}
          </span>
        </div>
      </div>

      {/* Main Arena */}
      <div className="flex-1 min-h-0 grid grid-cols-1 md:grid-cols-12 gap-3 py-1 px-1">
        {/* Left: 2D Plane Coordinate SVG */}
        <div className="md:col-span-8 flex flex-col items-center justify-center p-2 rounded-xl bg-slate-950/40 border border-slate-800/60 relative overflow-hidden">
          <svg className="w-full h-full max-h-[300px]" viewBox={`0 0 ${svgWidth} ${svgHeight}`}>
            {/* Grid Lines */}
            <line x1={padding} y1={svgHeight - padding} x2={svgWidth - padding} y2={svgHeight - padding} stroke="#334155" strokeWidth="1" />
            <line x1={padding} y1={padding} x2={padding} y2={svgHeight - padding} stroke="#334155" strokeWidth="1" />

            {/* MST Edges */}
            {mstEdges.map(([from, to, cost], idx) => {
              const p1 = points[from];
              const p2 = points[to];
              const x1 = projectX(p1[0]);
              const y1 = projectY(p1[1]);
              const x2 = projectX(p2[0]);
              const y2 = projectY(p2[1]);

              const isCurrentEdge =
                activeEdge !== null &&
                ((activeEdge[0] === from && activeEdge[1] === to) ||
                  (activeEdge[0] === to && activeEdge[1] === from));

              return (
                <g key={idx}>
                  <line
                    x1={x1}
                    y1={y1}
                    x2={x2}
                    y2={y2}
                    stroke={isCurrentEdge ? '#38bdf8' : '#10b981'}
                    strokeWidth={isCurrentEdge ? '3' : '2'}
                    className="transition-all duration-300"
                  />
                  {/* Distance badge */}
                  <rect
                    x={(x1 + x2) / 2 - 10}
                    y={(y1 + y2) / 2 - 8}
                    width="20"
                    height="14"
                    rx="3"
                    fill="#0f172a"
                    stroke="#10b981"
                    strokeWidth="1"
                  />
                  <text
                    x={(x1 + x2) / 2}
                    y={(y1 + y2) / 2 + 3}
                    textAnchor="middle"
                    fill="#6ee7b7"
                    fontSize="9"
                    fontFamily="monospace"
                    fontWeight="bold"
                  >
                    {cost}
                  </text>
                </g>
              );
            })}

            {/* Points */}
            {points.map((p, idx) => {
              const px = projectX(p[0]);
              const py = projectY(p[1]);
              const isVisited = visitedPoints.includes(idx);
              const isCurrent = currentNode === idx;

              let fillColor = '#0f172a';
              let strokeColor = '#475569';
              let textColor = '#94a3b8';

              if (isCurrent) {
                fillColor = '#065f46';
                strokeColor = '#34d399';
                textColor = '#ffffff';
              } else if (isVisited) {
                fillColor = '#064e3b';
                strokeColor = '#10b981';
                textColor = '#a7f3d0';
              }

              return (
                <g key={idx} className="transition-all duration-300">
                  <circle
                    cx={px}
                    cy={py}
                    r="16"
                    fill={fillColor}
                    stroke={strokeColor}
                    strokeWidth={isCurrent ? '3' : '2'}
                  />
                  <text
                    x={px}
                    y={py + 4}
                    textAnchor="middle"
                    fill={textColor}
                    fontSize="11"
                    fontFamily="monospace"
                    fontWeight="bold"
                  >
                    {idx}
                  </text>
                  <text
                    x={px}
                    y={py - 18}
                    textAnchor="middle"
                    fill="#94a3b8"
                    fontSize="9"
                    fontFamily="monospace"
                  >
                    ({p[0]},{p[1]})
                  </text>
                </g>
              );
            })}
          </svg>
        </div>

        {/* Right: Heap Queue & Cost Breakdown */}
        <div className="md:col-span-4 flex flex-col gap-2 min-h-0">
          {/* Total Cost Display */}
          <div className="bg-slate-950/40 border border-slate-800/60 rounded-xl p-2.5 flex items-center justify-between shrink-0">
            <div>
              <span className="text-[10px] text-slate-400 uppercase tracking-wider block">MST Total Cost</span>
              <span className="text-xl font-mono font-bold text-emerald-400">{totalCost}</span>
            </div>
            <div className="text-right">
              <span className="text-[10px] text-slate-400 uppercase tracking-wider block">Points Connected</span>
              <span className="text-base font-mono font-bold text-sky-400">{visitedPoints.length} / {points.length}</span>
            </div>
          </div>

          {/* Min-Heap Priority Queue */}
          <div className="bg-slate-950/40 border border-slate-800/60 rounded-xl p-2.5 flex flex-col gap-1.5 flex-1 min-h-0 overflow-y-auto">
            <div className="flex items-center justify-between">
              <span className="text-[10px] uppercase font-bold text-slate-400 tracking-wider flex items-center gap-1">
                <Layers className="w-3 h-3 text-indigo-400" /> Prim's Min-Heap
              </span>
              <span className="text-[10px] font-mono text-indigo-300">
                {heap.length} edges
              </span>
            </div>

            <div className="space-y-1 mt-0.5">
              {heap.slice(0, 5).map((h, hIdx) => (
                <div
                  key={hIdx}
                  className={`px-2 py-1 rounded text-xs font-mono flex items-center justify-between border ${
                    hIdx === 0
                      ? 'bg-emerald-500/20 text-emerald-300 border-emerald-500/40 font-bold ring-1 ring-emerald-400'
                      : 'bg-slate-900/60 text-slate-400 border-slate-800'
                  }`}
                >
                  <span>P{h.from} &rarr; P{h.to}</span>
                  <span className="text-[11px] font-bold">Cost: {h.cost}</span>
                </div>
              ))}
              {heap.length > 5 && (
                <div className="text-[10px] text-slate-500 text-center">
                  +{heap.length - 5} more edges in heap...
                </div>
              )}
            </div>

            <div className="mt-auto p-2 rounded-lg bg-slate-900/60 border border-slate-800 text-[11px] text-slate-300">
              <span className="font-semibold text-emerald-300">Greedy Optimality:</span>
              <p className="text-[10px] text-slate-400 mt-0.5">
                Always picking the minimum-cost edge crossing the cut between the visited tree and unvisited nodes guarantees an optimal MST.
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Legend */}
      <div className="flex items-center justify-between bg-slate-950/60 border border-slate-800/60 rounded-xl px-3 py-1.5 shrink-0 text-xs">
        <div className="flex items-center gap-3">
          <div className="flex items-center gap-1.5">
            <span className="w-3 h-3 rounded-full bg-emerald-950 border border-emerald-500" />
            <span className="text-emerald-300 text-[11px]">Point in Tree</span>
          </div>
          <div className="flex items-center gap-1.5">
            <span className="w-4 h-0.5 bg-emerald-500 rounded" />
            <span className="text-emerald-300 text-[11px]">MST Edge</span>
          </div>
          <div className="flex items-center gap-1.5">
            <span className="w-3 h-3 rounded-full bg-slate-900 border border-slate-700" />
            <span className="text-slate-400 text-[11px]">Unvisited</span>
          </div>
        </div>

        {isComplete && (
          <div className="flex items-center gap-1 text-emerald-400 font-semibold text-[11px]">
            <CheckCircle2 className="w-3.5 h-3.5" /> Optimal MST Constructed: Total {totalCost}
          </div>
        )}
      </div>
    </div>
  );
};
