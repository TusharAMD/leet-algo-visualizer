import React from 'react';
import { NetworkDelayStep } from '../../algorithms/networkDelayTimeIntuitive';
import { Radio, CheckCircle2, AlertTriangle, Clock, Layers, ArrowRight } from 'lucide-react';

interface NetworkDelayTimeViewerProps {
  step: NetworkDelayStep;
}

export const NetworkDelayTimeViewer: React.FC<NetworkDelayTimeViewerProps> = ({ step }) => {
  const {
    n,
    k,
    times,
    distances,
    visited,
    minHeap,
    currentNode,
    activeEdge,
    maxTime,
    headline,
    subtext,
    isComplete,
    result,
    stepIndex,
    totalSteps
  } = step;

  // Node positions on circle
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
          <span className="p-1.5 rounded-lg bg-sky-500/10 text-sky-400 border border-sky-500/20">
            <Radio className="w-4 h-4" />
          </span>
          <div>
            <h3 className="text-xs font-semibold text-white tracking-wide">{headline}</h3>
            <p className="text-[11px] text-slate-400">{subtext}</p>
          </div>
        </div>
        <div className="flex items-center gap-2">
          {isComplete ? (
            result !== -1 ? (
              <span className="px-2.5 py-0.5 rounded-md bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 text-xs font-mono font-bold flex items-center gap-1">
                <CheckCircle2 className="w-3.5 h-3.5" /> Delay: {result} ms
              </span>
            ) : (
              <span className="px-2.5 py-0.5 rounded-md bg-rose-500/10 border border-rose-500/20 text-rose-400 text-xs font-mono font-bold flex items-center gap-1">
                <AlertTriangle className="w-3.5 h-3.5" /> Unreachable (-1)
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
        {/* Left: SVG Directed Graph */}
        <div className="md:col-span-8 flex flex-col items-center justify-center p-2 rounded-xl bg-slate-950/40 border border-slate-800/60 relative overflow-hidden">
          <svg className="w-full h-full max-h-[300px]" viewBox="0 0 400 300">
            <defs>
              <marker
                id="dir-arrow"
                viewBox="0 0 10 10"
                refX="22"
                refY="5"
                markerWidth="6"
                markerHeight="6"
                orient="auto-start-reverse"
              >
                <path d="M 0 1 L 10 5 L 0 9 z" fill="#64748b" />
              </marker>
              <marker
                id="dir-arrow-active"
                viewBox="0 0 10 10"
                refX="22"
                refY="5"
                markerWidth="6"
                markerHeight="6"
                orient="auto-start-reverse"
              >
                <path d="M 0 1 L 10 5 L 0 9 z" fill="#38bdf8" />
              </marker>
            </defs>

            {/* Directed Edges */}
            {times.map(([u, v, w], idx) => {
              const p1 = getNodePos(u);
              const p2 = getNodePos(v);

              const isActive = activeEdge !== null && activeEdge[0] === u && activeEdge[1] === v;
              const isSourceVisited = visited.includes(u);

              // Curved path for bidirectional clarity
              const dx = p2.x - p1.x;
              const dy = p2.y - p1.y;
              const cx = (p1.x + p2.x) / 2 - dy * 0.12;
              const cy = (p1.y + p2.y) / 2 + dx * 0.12;

              return (
                <g key={idx}>
                  <path
                    d={`M ${p1.x} ${p1.y} Q ${cx} ${cy} ${p2.x} ${p2.y}`}
                    fill="none"
                    stroke={isActive ? '#38bdf8' : isSourceVisited ? '#10b981' : '#334155'}
                    strokeWidth={isActive ? '3' : '1.5'}
                    markerEnd={isActive ? 'url(#dir-arrow-active)' : 'url(#dir-arrow)'}
                    className="transition-all duration-300"
                  />
                  {/* Weight pill */}
                  <rect
                    x={cx - 10}
                    y={cy - 7}
                    width="20"
                    height="14"
                    rx="3"
                    fill="#0f172a"
                    stroke={isActive ? '#38bdf8' : '#334155'}
                    strokeWidth="1"
                  />
                  <text
                    x={cx}
                    y={cy + 3}
                    textAnchor="middle"
                    fill={isActive ? '#38bdf8' : '#94a3b8'}
                    fontSize="9"
                    fontFamily="monospace"
                  >
                    {w}
                  </text>
                </g>
              );
            })}

            {/* Nodes */}
            {nodePositions.map((node) => {
              const val = node.val;
              const isSource = val === k;
              const isVisited = visited.includes(val);
              const isCurrent = currentNode === val;
              const dist = distances[val] === Infinity ? '∞' : `${distances[val]}ms`;

              let fillColor = '#0f172a';
              let strokeColor = '#475569';
              let textColor = '#e2e8f0';

              if (isCurrent) {
                fillColor = '#0369a1';
                strokeColor = '#38bdf8';
                textColor = '#ffffff';
              } else if (isVisited) {
                fillColor = '#064e3b';
                strokeColor = '#10b981';
                textColor = '#a7f3d0';
              } else if (isSource) {
                fillColor = '#1e1b4b';
                strokeColor = '#818cf8';
                textColor = '#c7d2fe';
              }

              return (
                <g key={val} className="transition-all duration-300">
                  <circle
                    cx={node.x}
                    cy={node.y}
                    r="18"
                    fill={fillColor}
                    stroke={strokeColor}
                    strokeWidth={isCurrent || isSource ? '3' : '2'}
                  />
                  <text
                    x={node.x}
                    y={node.y + 4}
                    textAnchor="middle"
                    fill={textColor}
                    fontSize="12"
                    fontFamily="monospace"
                    fontWeight="bold"
                  >
                    {val}
                  </text>
                  {/* Distance badge above node */}
                  <rect
                    x={node.x - 16}
                    y={node.y - 25}
                    width="32"
                    height="13"
                    rx="3"
                    fill="#020617"
                    stroke={isVisited ? '#10b981' : '#334155'}
                  />
                  <text
                    x={node.x}
                    y={node.y - 15}
                    textAnchor="middle"
                    fill={isVisited ? '#34d399' : '#64748b'}
                    fontSize="9"
                    fontFamily="monospace"
                    fontWeight="bold"
                  >
                    {dist}
                  </text>
                </g>
              );
            })}
          </svg>
        </div>

        {/* Right: Dijkstra Table & Min-Heap */}
        <div className="md:col-span-4 flex flex-col gap-2 min-h-0">
          {/* Max Time Card */}
          <div className="bg-slate-950/40 border border-slate-800/60 rounded-xl p-2.5 flex items-center justify-between shrink-0">
            <div>
              <span className="text-[10px] text-slate-400 uppercase tracking-wider block">Max Propagation Delay</span>
              <span className="text-xl font-mono font-bold text-sky-400">{maxTime} ms</span>
            </div>
            <div className="text-right">
              <span className="text-[10px] text-slate-400 uppercase tracking-wider block">Nodes Reached</span>
              <span className="text-base font-mono font-bold text-emerald-400">{visited.length} / {n}</span>
            </div>
          </div>

          {/* Min-Heap Priority Queue */}
          <div className="bg-slate-950/40 border border-slate-800/60 rounded-xl p-2.5 flex flex-col gap-1.5 flex-1 min-h-0 overflow-y-auto">
            <div className="flex items-center justify-between">
              <span className="text-[10px] uppercase font-bold text-slate-400 tracking-wider flex items-center gap-1">
                <Layers className="w-3 h-3 text-indigo-400" /> Dijkstra Min-Heap (Arrivals)
              </span>
              <span className="text-[10px] font-mono text-indigo-300">
                {minHeap.length} entries
              </span>
            </div>

            <div className="space-y-1 mt-0.5">
              {minHeap.map((item, hIdx) => (
                <div
                  key={hIdx}
                  className={`px-2 py-1 rounded text-xs font-mono flex items-center justify-between border ${
                    hIdx === 0
                      ? 'bg-sky-500/20 text-sky-300 border-sky-500/40 font-bold ring-1 ring-sky-400'
                      : 'bg-slate-900/60 text-slate-400 border-slate-800'
                  }`}
                >
                  <span>Node {item.node}</span>
                  <span className="text-[11px] font-bold">Time: {item.time} ms</span>
                </div>
              ))}
              {minHeap.length === 0 && (
                <span className="text-[11px] text-slate-500 italic">Queue is empty</span>
              )}
            </div>

            <div className="mt-auto p-2 rounded-lg bg-slate-900/60 border border-slate-800 text-[11px] text-slate-300">
              <span className="font-semibold text-sky-400">Dijkstra Principle:</span>
              <p className="text-[10px] text-slate-400 mt-0.5">
                Always pops the node with the minimum cumulative delay time first, ensuring optimal shortest paths without negative weights.
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Legend */}
      <div className="flex items-center justify-between bg-slate-950/60 border border-slate-800/60 rounded-xl px-3 py-1.5 shrink-0 text-xs">
        <div className="flex items-center gap-3">
          <div className="flex items-center gap-1.5">
            <span className="w-3 h-3 rounded-full bg-indigo-950 border border-indigo-400" />
            <span className="text-indigo-300 text-[11px]">Source K ({k})</span>
          </div>
          <div className="flex items-center gap-1.5">
            <span className="w-3 h-3 rounded-full bg-emerald-950 border border-emerald-500" />
            <span className="text-emerald-300 text-[11px]">Visited (Settled)</span>
          </div>
          <div className="flex items-center gap-1.5">
            <span className="w-4 h-0.5 bg-sky-400 rounded" />
            <span className="text-sky-300 text-[11px]">Active Signal</span>
          </div>
        </div>

        {isComplete && (
          <div className="flex items-center gap-1 text-[11px] font-semibold">
            {result !== -1 ? (
              <span className="text-emerald-400 flex items-center gap-1">
                <CheckCircle2 className="w-3.5 h-3.5" /> Delay Complete: {result} ms
              </span>
            ) : (
              <span className="text-rose-400 flex items-center gap-1">
                <AlertTriangle className="w-3.5 h-3.5" /> Some Nodes Unreachable
              </span>
            )}
          </div>
        )}
      </div>
    </div>
  );
};
