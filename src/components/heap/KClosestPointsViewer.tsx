import React from 'react';
import { KClosestPointsStep } from '../../algorithms/kClosestPointsIntuitive';
import { Target, CheckCircle2, ArrowRight, Layers, Crosshair } from 'lucide-react';

interface KClosestPointsViewerProps {
  step: KClosestPointsStep;
}

export const KClosestPointsViewer: React.FC<KClosestPointsViewerProps> = ({ step }) => {
  const { allPoints, minHeap, k, extractedPoints, currentExtracted, isComplete } = step;

  // Max coordinate for normalization
  const maxCoord = Math.max(
    5,
    ...allPoints.map((p) => Math.max(Math.abs(p.x), Math.abs(p.y)))
  );

  return (
    <div className="flex-1 min-h-0 flex flex-col bg-slate-900/60 border border-slate-800 rounded-2xl p-3 shadow-xl overflow-hidden justify-between">
      {/* Top Banner */}
      <div className="bg-slate-950/70 border border-slate-800/80 rounded-xl p-2.5 flex items-center justify-between shrink-0">
        <div className="flex items-center gap-2">
          <span className="p-1.5 rounded-lg bg-indigo-500/10 text-indigo-400 border border-indigo-500/20">
            <Crosshair className="w-4 h-4" />
          </span>
          <div>
            <h3 className="text-xs font-semibold text-white tracking-wide">{step.headline}</h3>
            <p className="text-[11px] text-slate-400">{step.subtext}</p>
          </div>
        </div>
        <div className="flex items-center gap-2">
          {isComplete ? (
            <span className="px-2 py-0.5 rounded-md bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 text-[11px] font-semibold flex items-center gap-1">
              <CheckCircle2 className="w-3.5 h-3.5" /> Found {k} Closest
            </span>
          ) : (
            <span className="px-2 py-0.5 rounded-md bg-indigo-500/10 border border-indigo-500/20 text-indigo-400 text-[11px] font-mono">
              Step {step.stepIndex + 1} / {step.totalSteps}
            </span>
          )}
        </div>
      </div>

      {/* Main Arena: 2D Radar & Min-Heap Side-by-Side */}
      <div className="flex-1 min-h-0 grid grid-cols-1 md:grid-cols-12 gap-3 py-2 px-1">
        {/* Left: 2D Plane Canvas (col-span-8) */}
        <div className="md:col-span-8 relative w-full h-full bg-slate-950/70 border border-slate-800/80 rounded-2xl p-2 flex items-center justify-center overflow-hidden">
          <svg className="absolute inset-0 w-full h-full pointer-events-none">
            {/* Coordinate grid crosshairs */}
            <line x1="50%" y1="0%" x2="50%" y2="100%" stroke="#1e293b" strokeWidth="1" strokeDasharray="3 3" />
            <line x1="0%" y1="50%" x2="100%" y2="50%" stroke="#1e293b" strokeWidth="1" strokeDasharray="3 3" />

            {/* Concentric distance rings */}
            <circle cx="50%" cy="50%" r="20%" fill="none" stroke="#1e293b" strokeWidth="1" />
            <circle cx="50%" cy="50%" r="38%" fill="none" stroke="#1e293b" strokeWidth="1" strokeDasharray="2 2" />

            {/* Vectors to extracted points */}
            {allPoints.map((p) => {
              const isExtracted = extractedPoints.some((ep) => ep.id === p.id);
              if (!isExtracted) return null;
              const px = 50 + (p.x / (maxCoord * 1.3)) * 40;
              const py = 50 - (p.y / (maxCoord * 1.3)) * 40;
              return (
                <line
                  key={`vec-${p.id}`}
                  x1="50%"
                  y1="50%"
                  x2={`${px}%`}
                  y2={`${py}%`}
                  stroke="#10b981"
                  strokeWidth="1.5"
                  strokeDasharray="3 2"
                  className="opacity-70"
                />
              );
            })}
          </svg>

          {/* Origin Marker (0,0) */}
          <div className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 flex flex-col items-center pointer-events-none">
            <div className="w-3.5 h-3.5 rounded-full bg-cyan-400 ring-4 ring-cyan-400/20 animate-pulse"></div>
            <span className="text-[9px] font-mono text-cyan-300 font-bold mt-1">(0,0)</span>
          </div>

          {/* Plotted Points */}
          {allPoints.map((p) => {
            const isExtracted = extractedPoints.some((ep) => ep.id === p.id);
            const isCurrent = currentExtracted?.id === p.id;
            const px = 50 + (p.x / (maxCoord * 1.3)) * 40;
            const py = 50 - (p.y / (maxCoord * 1.3)) * 40;

            let pointClass = 'bg-slate-900 border-slate-700 text-slate-400';
            if (isCurrent) {
              pointClass = 'bg-emerald-600 border-emerald-400 text-white ring-4 ring-emerald-500/40 scale-125 shadow-lg shadow-emerald-500/30';
            } else if (isExtracted) {
              pointClass = 'bg-emerald-500/25 border-emerald-500 text-emerald-200 ring-2 ring-emerald-500/30';
            }

            return (
              <div
                key={p.id}
                className="absolute -translate-x-1/2 -translate-y-1/2 flex flex-col items-center pointer-events-none transition-all duration-300"
                style={{ left: `${px}%`, top: `${py}%` }}
              >
                <div className={`px-2 py-0.5 rounded-lg border font-mono text-xs font-bold ${pointClass}`}>
                  [{p.x}, {p.y}]
                </div>
                <span className="text-[8px] font-mono text-slate-500 mt-0.5">d²={p.distSq}</span>
              </div>
            );
          })}
        </div>

        {/* Right: Min-Heap Queue (col-span-4) */}
        <div className="md:col-span-4 bg-slate-950/60 border border-slate-800/80 rounded-2xl p-2.5 flex flex-col justify-between overflow-hidden">
          <div className="flex items-center justify-between text-[10px] uppercase font-mono font-bold tracking-wider text-slate-400">
            <span>Min-Heap (By dist²):</span>
            <span className="text-slate-500">{minHeap.length} left</span>
          </div>

          <div className="flex-1 flex flex-col gap-1.5 overflow-y-auto py-1">
            {minHeap.length === 0 ? (
              <span className="text-slate-600 font-mono text-xs italic m-auto">Heap empty</span>
            ) : (
              minHeap.map((p, idx) => (
                <div
                  key={p.id}
                  className={`px-2.5 py-1.5 rounded-xl border font-mono text-xs flex items-center justify-between ${
                    idx === 0
                      ? 'bg-indigo-500/20 border-indigo-500/40 text-indigo-200 font-bold'
                      : 'bg-slate-900/80 border-slate-800 text-slate-300'
                  }`}
                >
                  <div className="flex items-center gap-1.5">
                    {idx === 0 && <span className="text-[9px] px-1 rounded bg-indigo-500/30 text-indigo-300">top</span>}
                    <span>[{p.x}, {p.y}]</span>
                  </div>
                  <span className="text-slate-400 text-[11px]">d² = {p.distSq}</span>
                </div>
              ))
            )}
          </div>
        </div>
      </div>

      {/* Bottom Result Chain Bar */}
      <div className="bg-slate-950/70 border border-slate-800/80 rounded-xl p-2.5 flex items-center justify-between text-xs font-mono shrink-0">
        <div className="flex items-center gap-2">
          <Target className="w-3.5 h-3.5 text-emerald-400" />
          <span className="text-slate-400">Extracted {k} Closest:</span>
          <div className="flex items-center gap-1.5 overflow-x-auto">
            {extractedPoints.length === 0 ? (
              <span className="text-slate-600 italic">None yet</span>
            ) : (
              extractedPoints.map((p, idx) => (
                <span
                  key={idx}
                  className="px-2 py-0.5 rounded-md bg-emerald-500/20 border border-emerald-500/40 text-emerald-300 font-bold text-xs"
                >
                  [{p.x}, {p.y}]
                </span>
              ))
            )}
          </div>
        </div>

        <span className="text-slate-400">
          Target: <span className="text-emerald-400 font-bold">k={k}</span> points
        </span>
      </div>
    </div>
  );
};
