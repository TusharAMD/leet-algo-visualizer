import React from 'react';
import { ReconstructItineraryStep } from '../../algorithms/reconstructItineraryIntuitive';
import { Plane, CheckCircle2, ArrowRight, Compass, Layers, Ticket } from 'lucide-react';

interface ReconstructItineraryViewerProps {
  step: ReconstructItineraryStep;
}

export const ReconstructItineraryViewer: React.FC<ReconstructItineraryViewerProps> = ({ step }) => {
  const {
    tickets,
    adj,
    currentAirport,
    stack,
    itinerary,
    headline,
    subtext,
    isComplete,
    stepIndex,
    totalSteps
  } = step;

  // Collect all unique airports
  const airports = Array.from(new Set(tickets.flat()));

  // Layout airports around a circle
  const radius = 120;
  const centerX = 200;
  const centerY = 150;

  const airportPositions: { [code: string]: { x: number; y: number } } = {};
  airports.forEach((code, i) => {
    const angle = (2 * Math.PI * i) / airports.length - Math.PI / 2;
    airportPositions[code] = {
      x: centerX + radius * Math.cos(angle),
      y: centerY + radius * Math.sin(angle)
    };
  });

  return (
    <div className="flex-1 min-h-0 flex flex-col bg-slate-900/60 border border-slate-800 rounded-2xl p-3 shadow-xl overflow-hidden justify-between">
      {/* Top Banner */}
      <div className="bg-slate-950/70 border border-slate-800/80 rounded-xl p-2.5 flex items-center justify-between shrink-0">
        <div className="flex items-center gap-2">
          <span className="p-1.5 rounded-lg bg-sky-500/10 text-sky-400 border border-sky-500/20">
            <Plane className="w-4 h-4" />
          </span>
          <div>
            <h3 className="text-xs font-semibold text-white tracking-wide">{headline}</h3>
            <p className="text-[11px] text-slate-400">{subtext}</p>
          </div>
        </div>
        <div className="flex items-center gap-2">
          {isComplete ? (
            <span className="px-2.5 py-0.5 rounded-md bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 text-xs font-mono font-bold flex items-center gap-1">
              <CheckCircle2 className="w-3.5 h-3.5" /> {itinerary.length} Stops Valid
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
        {/* Left: SVG Flight Route Map */}
        <div className="md:col-span-8 flex flex-col items-center justify-center p-2 rounded-xl bg-slate-950/40 border border-slate-800/60 relative overflow-hidden">
          <svg className="w-full h-full max-h-[300px]" viewBox="0 0 400 300">
            <defs>
              <marker
                id="flight-arrow"
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

            {/* Flight Route Lines */}
            {tickets.map(([src, dst], idx) => {
              const p1 = airportPositions[src];
              const p2 = airportPositions[dst];
              if (!p1 || !p2) return null;

              const isAvailable = (adj[src] || []).includes(dst);
              const isActiveRoute = currentAirport === src;

              let strokeColor = '#334155';
              let strokeWidth = '1.5';
              if (isActiveRoute && isAvailable) {
                strokeColor = '#38bdf8';
                strokeWidth = '2.5';
              } else if (isAvailable) {
                strokeColor = '#64748b';
              } else {
                strokeColor = '#1e293b';
              }

              // Slight curve if reciprocal flight exists
              const dx = p2.x - p1.x;
              const dy = p2.y - p1.y;
              const cx = (p1.x + p2.x) / 2 - dy * 0.15;
              const cy = (p1.y + p2.y) / 2 + dx * 0.15;

              return (
                <path
                  key={idx}
                  d={`M ${p1.x} ${p1.y} Q ${cx} ${cy} ${p2.x} ${p2.y}`}
                  fill="none"
                  stroke={strokeColor}
                  strokeWidth={strokeWidth}
                  markerEnd={isAvailable ? 'url(#flight-arrow)' : undefined}
                  className="transition-all duration-300"
                />
              );
            })}

            {/* Airport Nodes */}
            {airports.map((code) => {
              const pos = airportPositions[code];
              if (!pos) return null;

              const isActive = currentAirport === code;
              const isStart = code === 'JFK';

              let fillColor = '#0f172a';
              let strokeColor = '#475569';
              let textColor = '#e2e8f0';

              if (isActive) {
                fillColor = '#0369a1';
                strokeColor = '#38bdf8';
                textColor = '#ffffff';
              } else if (isStart) {
                fillColor = '#1e1b4b';
                strokeColor = '#818cf8';
                textColor = '#c7d2fe';
              }

              return (
                <g key={code} className="transition-all duration-300">
                  <circle
                    cx={pos.x}
                    cy={pos.y}
                    r="20"
                    fill={fillColor}
                    stroke={strokeColor}
                    strokeWidth={isActive ? '3' : '2'}
                  />
                  <text
                    x={pos.x}
                    y={pos.y + 4}
                    textAnchor="middle"
                    fill={textColor}
                    fontSize="11"
                    fontFamily="monospace"
                    fontWeight="bold"
                  >
                    {code}
                  </text>
                </g>
              );
            })}
          </svg>
        </div>

        {/* Right: Flight Plan & Stack */}
        <div className="md:col-span-4 flex flex-col gap-2 min-h-0">
          {/* Reconstructed Path Tape */}
          <div className="bg-slate-950/40 border border-slate-800/60 rounded-xl p-2.5 flex flex-col gap-1.5 shrink-0">
            <span className="text-[10px] uppercase font-bold text-slate-400 tracking-wider flex items-center gap-1">
              <Ticket className="w-3 h-3 text-sky-400" /> Current Itinerary Sequence
            </span>
            <div className="flex items-center gap-1 overflow-x-auto p-1.5 bg-slate-900/70 border border-slate-800 rounded-lg min-h-[36px]">
              {itinerary.length === 0 ? (
                <span className="text-[11px] text-slate-500 italic">Exploring flights...</span>
              ) : (
                itinerary.map((code, idx) => (
                  <React.Fragment key={idx}>
                    <span className="px-2 py-0.5 rounded bg-sky-500/20 text-sky-300 border border-sky-500/40 text-xs font-mono font-bold shrink-0">
                      {code}
                    </span>
                    {idx < itinerary.length - 1 && (
                      <ArrowRight className="w-3 h-3 text-slate-600 shrink-0" />
                    )}
                  </React.Fragment>
                ))
              )}
            </div>
          </div>

          {/* DFS Stack */}
          <div className="bg-slate-950/40 border border-slate-800/60 rounded-xl p-2.5 flex flex-col gap-1.5 flex-1 min-h-0 overflow-y-auto">
            <div className="flex items-center justify-between">
              <span className="text-[10px] uppercase font-bold text-slate-400 tracking-wider flex items-center gap-1">
                <Layers className="w-3 h-3 text-indigo-400" /> DFS Call Stack
              </span>
              <span className="text-[10px] font-mono text-indigo-300">
                Depth: {stack.length}
              </span>
            </div>

            <div className="flex flex-col-reverse gap-1 mt-1">
              {stack.map((code, idx) => (
                <div
                  key={idx}
                  className={`px-2 py-1 rounded text-xs font-mono flex items-center justify-between border ${
                    idx === stack.length - 1
                      ? 'bg-sky-500/20 text-sky-300 border-sky-500/40 font-bold ring-1 ring-sky-400'
                      : 'bg-slate-900 text-slate-400 border-slate-800'
                  }`}
                >
                  <span>dfs("{code}")</span>
                  <span className="text-[9px] opacity-60">Level {idx + 1}</span>
                </div>
              ))}
            </div>

            <div className="mt-auto p-2 rounded-lg bg-slate-900/60 border border-slate-800 text-[11px] text-slate-300">
              <span className="font-semibold text-sky-400">Hierholzer's Algorithm:</span>
              <p className="text-[10px] text-slate-400 mt-0.5">
                Always take the lexicographically smallest airport first. When reaching a dead end, append the airport to the reverse postorder list.
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Legend */}
      <div className="flex items-center justify-between bg-slate-950/60 border border-slate-800/60 rounded-xl px-3 py-1.5 shrink-0 text-xs">
        <div className="flex items-center gap-3">
          <div className="flex items-center gap-1.5">
            <span className="w-3 h-3 rounded-full bg-sky-900 border border-sky-400" />
            <span className="text-sky-300 text-[11px]">Current Airport</span>
          </div>
          <div className="flex items-center gap-1.5">
            <span className="w-3 h-3 rounded-full bg-indigo-950 border border-indigo-500" />
            <span className="text-indigo-300 text-[11px]">Origin JFK</span>
          </div>
          <div className="flex items-center gap-1.5">
            <span className="w-4 h-0.5 bg-sky-400 rounded" />
            <span className="text-slate-400 text-[11px]">Active Flight Ticket</span>
          </div>
        </div>

        {isComplete && (
          <div className="flex items-center gap-1 text-emerald-400 font-semibold text-[11px]">
            <CheckCircle2 className="w-3.5 h-3.5" /> Valid Eulerian Tour Reconstructed
          </div>
        )}
      </div>
    </div>
  );
};
