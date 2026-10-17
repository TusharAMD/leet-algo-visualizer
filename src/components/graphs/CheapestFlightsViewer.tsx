import React from 'react';
import { CheapestFlightsStep } from '../../algorithms/cheapestFlightsIntuitive';
import { PlaneTakeoff, CheckCircle2, AlertTriangle, Layers, DollarSign } from 'lucide-react';

interface CheapestFlightsViewerProps {
  step: CheapestFlightsStep;
}

export const CheapestFlightsViewer: React.FC<CheapestFlightsViewerProps> = ({ step }) => {
  const {
    n,
    flights,
    src,
    dst,
    k,
    currentIteration,
    prices,
    activeFlight,
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
    const angle = (2 * Math.PI * i) / n - Math.PI / 2;
    return {
      id: i,
      x: centerX + radius * Math.cos(angle),
      y: centerY + radius * Math.sin(angle)
    };
  });

  const getNodePos = (id: number) => {
    return nodePositions.find(p => p.id === id) || { x: 200, y: 150 };
  };

  return (
    <div className="flex-1 min-h-0 flex flex-col bg-slate-900/60 border border-slate-800 rounded-2xl p-3 shadow-xl overflow-hidden justify-between">
      {/* Top Banner */}
      <div className="bg-slate-950/70 border border-slate-800/80 rounded-xl p-2.5 flex items-center justify-between shrink-0">
        <div className="flex items-center gap-2">
          <span className="p-1.5 rounded-lg bg-sky-500/10 text-sky-400 border border-sky-500/20">
            <PlaneTakeoff className="w-4 h-4" />
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
                <CheckCircle2 className="w-3.5 h-3.5" /> Best Price: ${result}
              </span>
            ) : (
              <span className="px-2.5 py-0.5 rounded-md bg-rose-500/10 border border-rose-500/20 text-rose-400 text-xs font-mono font-bold flex items-center gap-1">
                <AlertTriangle className="w-3.5 h-3.5" /> No Route (-1)
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
        {/* Left: SVG Flight Network */}
        <div className="md:col-span-8 flex flex-col items-center justify-center p-2 rounded-xl bg-slate-950/40 border border-slate-800/60 relative overflow-hidden">
          <svg className="w-full h-full max-h-[300px]" viewBox="0 0 400 300">
            <defs>
              <marker
                id="cf-arrow"
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
                id="cf-arrow-active"
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

            {/* Flights */}
            {flights.map(([s, d, p], idx) => {
              const p1 = getNodePos(s);
              const p2 = getNodePos(d);

              const isActive = activeFlight !== null && activeFlight[0] === s && activeFlight[1] === d;

              const dx = p2.x - p1.x;
              const dy = p2.y - p1.y;
              const cx = (p1.x + p2.x) / 2 - dy * 0.12;
              const cy = (p1.y + p2.y) / 2 + dx * 0.12;

              return (
                <g key={idx}>
                  <path
                    d={`M ${p1.x} ${p1.y} Q ${cx} ${cy} ${p2.x} ${p2.y}`}
                    fill="none"
                    stroke={isActive ? '#38bdf8' : '#334155'}
                    strokeWidth={isActive ? '3' : '1.5'}
                    markerEnd={isActive ? 'url(#cf-arrow-active)' : 'url(#cf-arrow)'}
                    className="transition-all duration-300"
                  />
                  {/* Price pill */}
                  <rect
                    x={cx - 12}
                    y={cy - 7}
                    width="24"
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
                    ${p}
                  </text>
                </g>
              );
            })}

            {/* City Nodes */}
            {nodePositions.map((node) => {
              const id = node.id;
              const isSrc = id === src;
              const isDst = id === dst;
              const priceVal = prices[id] === Infinity ? '∞' : `$${prices[id]}`;

              let fillColor = '#0f172a';
              let strokeColor = '#475569';
              let textColor = '#e2e8f0';

              if (isDst) {
                fillColor = '#064e3b';
                strokeColor = '#10b981';
                textColor = '#6ee7b7';
              } else if (isSrc) {
                fillColor = '#1e1b4b';
                strokeColor = '#818cf8';
                textColor = '#c7d2fe';
              }

              return (
                <g key={id} className="transition-all duration-300">
                  <circle
                    cx={node.x}
                    cy={node.y}
                    r="18"
                    fill={fillColor}
                    stroke={strokeColor}
                    strokeWidth={isSrc || isDst ? '3' : '2'}
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
                    {id}
                  </text>
                  {/* Price tag */}
                  <rect
                    x={node.x - 16}
                    y={node.y - 25}
                    width="32"
                    height="13"
                    rx="3"
                    fill="#020617"
                    stroke={prices[id] !== Infinity ? '#10b981' : '#334155'}
                  />
                  <text
                    x={node.x}
                    y={node.y - 15}
                    textAnchor="middle"
                    fill={prices[id] !== Infinity ? '#34d399' : '#64748b'}
                    fontSize="9"
                    fontFamily="monospace"
                    fontWeight="bold"
                  >
                    {priceVal}
                  </text>
                </g>
              );
            })}
          </svg>
        </div>

        {/* Right: Bellman-Ford Table */}
        <div className="md:col-span-4 flex flex-col gap-2 min-h-0">
          {/* Stops Constraint Badge */}
          <div className="bg-slate-950/40 border border-slate-800/60 rounded-xl p-2.5 flex items-center justify-between shrink-0">
            <div>
              <span className="text-[10px] text-slate-400 uppercase tracking-wider block">Max Stops Allowed</span>
              <span className="text-base font-mono font-bold text-indigo-300">{k} Stop{k === 1 ? '' : 's'} (Max {k + 1} Flights)</span>
            </div>
            <div className="text-right">
              <span className="text-[10px] text-slate-400 uppercase tracking-wider block">Current Round</span>
              <span className="text-base font-mono font-bold text-sky-400">Leg {currentIteration} / {k + 1}</span>
            </div>
          </div>

          {/* City Prices Table */}
          <div className="bg-slate-950/40 border border-slate-800/60 rounded-xl p-2.5 flex flex-col gap-1 flex-1 min-h-0 overflow-y-auto">
            <span className="text-[10px] uppercase font-bold text-slate-400 tracking-wider flex items-center gap-1">
              <DollarSign className="w-3 h-3 text-emerald-400" /> Best Price Per City
            </span>

            <div className="space-y-1 mt-1">
              {prices.map((p, cId) => {
                const isTarget = cId === dst;
                const isOrigin = cId === src;

                return (
                  <div
                    key={cId}
                    className={`px-2 py-1 rounded text-xs font-mono flex items-center justify-between border ${
                      isTarget
                        ? 'bg-emerald-500/20 text-emerald-300 border-emerald-500/40 font-bold'
                        : isOrigin
                        ? 'bg-indigo-500/20 text-indigo-300 border-indigo-500/40'
                        : 'bg-slate-900/60 text-slate-400 border-slate-800'
                    }`}
                  >
                    <span>
                      City {cId} {isOrigin ? '(Source)' : isTarget ? '(Destination)' : ''}
                    </span>
                    <span className="font-bold">
                      {p === Infinity ? '∞' : `$${p}`}
                    </span>
                  </div>
                );
              })}
            </div>

            <div className="mt-auto p-2 rounded-lg bg-slate-900/60 border border-slate-800 text-[11px] text-slate-300">
              <span className="font-semibold text-emerald-400">Temporary Array Copy:</span>
              <p className="text-[10px] text-slate-400 mt-0.5">
                Cloning prices at each iteration ensures flights relaxed in step <code>i</code> only use paths established in step <code>i - 1</code>, strictly preventing stop count overflows.
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
            <span className="text-indigo-300 text-[11px]">Source {src}</span>
          </div>
          <div className="flex items-center gap-1.5">
            <span className="w-3 h-3 rounded-full bg-emerald-950 border border-emerald-500" />
            <span className="text-emerald-300 text-[11px]">Destination {dst}</span>
          </div>
          <div className="flex items-center gap-1.5">
            <span className="w-4 h-0.5 bg-sky-400 rounded" />
            <span className="text-sky-300 text-[11px]">Flight Route</span>
          </div>
        </div>

        {isComplete && (
          <div className="flex items-center gap-1 text-[11px] font-semibold">
            {result !== -1 ? (
              <span className="text-emerald-400 flex items-center gap-1">
                <CheckCircle2 className="w-3.5 h-3.5" /> Best Route Found: ${result}
              </span>
            ) : (
              <span className="text-rose-400 flex items-center gap-1">
                <AlertTriangle className="w-3.5 h-3.5" /> Destination Unreachable
              </span>
            )}
          </div>
        )}
      </div>
    </div>
  );
};
