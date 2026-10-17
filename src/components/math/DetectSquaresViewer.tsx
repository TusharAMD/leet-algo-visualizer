import React from 'react';
import type { DetectSquaresStep, Point } from '../../algorithms/detectSquaresIntuitive';
import { HelpCircle, CheckCircle2 } from 'lucide-react';

interface DetectSquaresViewerProps {
  step: DetectSquaresStep;
  rawPoints: Point[];
  queryPoint: Point;
}

export const DetectSquaresViewer: React.FC<DetectSquaresViewerProps> = ({
  step,
  rawPoints,
  queryPoint,
}) => {
  const allX = [...rawPoints.map((p) => p[0]), queryPoint[0]];
  const allY = [...rawPoints.map((p) => p[1]), queryPoint[1]];
  const minX = Math.min(0, ...allX);
  const maxX = Math.max(10, ...allX) + 1;
  const minY = Math.min(0, ...allY);
  const maxY = Math.max(10, ...allY) + 1;

  const rangeX = Math.max(1, maxX - minX);
  const rangeY = Math.max(1, maxY - minY);

  const getLeft = (x: number) => `${((x - minX) / rangeX) * 80 + 10}%`;
  const getTop = (y: number) => `${(1 - (y - minY) / rangeY) * 80 + 10}%`;

  return (
    <div className="flex flex-col h-full gap-3 p-4 select-none">
      {/* Top Status & Variable Badges */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
        <div className="bg-slate-900 border border-slate-800 rounded-xl p-3 flex flex-col justify-center">
          <span className="text-xs text-slate-400 font-medium">Query Corner</span>
          <span className="text-base font-mono font-bold text-amber-400">
            ({queryPoint[0]}, {queryPoint[1]})
          </span>
        </div>
        <div className="bg-slate-900 border border-slate-800 rounded-xl p-3 flex flex-col justify-center">
          <span className="text-xs text-slate-400 font-medium">Diagonal Candidate</span>
          <span className="text-base font-mono font-bold text-sky-400">
            {step.diagonalCandidate ? `(${step.diagonalCandidate[0]}, ${step.diagonalCandidate[1]})` : '—'}
          </span>
        </div>
        <div className="bg-slate-900 border border-slate-800 rounded-xl p-3 flex flex-col justify-center">
          <span className="text-xs text-slate-400 font-medium">Current Match Ways</span>
          <span className="text-base font-mono font-bold text-purple-300">
            {step.currentFoundCount > 0 ? `+${step.currentFoundCount} squares` : '—'}
          </span>
        </div>
        <div className="bg-slate-900 border border-slate-800 rounded-xl p-3 flex flex-col justify-center">
          <span className="text-xs text-slate-400 font-medium">Total Squares Found</span>
          <span className="text-2xl font-mono font-black text-emerald-400">
            {step.totalSquares}
          </span>
        </div>
      </div>

      {/* Main Coordinate Grid Canvas */}
      <div className="flex-1 bg-slate-900/60 border border-slate-800 rounded-xl p-6 flex flex-col justify-between items-center gap-4 relative overflow-hidden">
        <div className="text-xs font-semibold text-slate-400 uppercase tracking-wider">
          2D Point Plane & Axis-Aligned Square Detection
        </div>

        {/* 2D Plane Box */}
        <div className="relative w-full max-w-lg aspect-square bg-slate-950 border border-slate-800 rounded-2xl overflow-hidden p-4">
          {/* Subtle Grid Lines */}
          <div className="absolute inset-0 grid grid-cols-10 grid-rows-10 opacity-15 pointer-events-none">
            {Array.from({ length: 100 }, (_, i) => (
              <div key={i} className="border-r border-b border-slate-600" />
            ))}
          </div>

          {/* Active matched square outline if in match step */}
          {step.diagonalCandidate && step.corner1 && step.corner2 && (
            <div
              className="absolute border-2 border-emerald-400 bg-emerald-500/20 rounded-lg pointer-events-none transition-all duration-300 z-10"
              style={{
                left: `${Math.min(parseFloat(getLeft(queryPoint[0])), parseFloat(getLeft(step.diagonalCandidate[0])))}%`,
                top: `${Math.min(parseFloat(getTop(queryPoint[1])), parseFloat(getTop(step.diagonalCandidate[1])))}%`,
                width: `${Math.abs(parseFloat(getLeft(queryPoint[0])) - parseFloat(getLeft(step.diagonalCandidate[0])))}%`,
                height: `${Math.abs(parseFloat(getTop(queryPoint[1])) - parseFloat(getTop(step.diagonalCandidate[1])))}%`,
              }}
            />
          )}

          {/* Existing points plotted */}
          {Object.entries(step.pointFrequencies).map(([key, count]) => {
            const [x, y] = key.split(',').map(Number);
            const isDiag = step.diagonalCandidate && step.diagonalCandidate[0] === x && step.diagonalCandidate[1] === y;
            const isCorner1 = step.corner1 && step.corner1[0] === x && step.corner1[1] === y;
            const isCorner2 = step.corner2 && step.corner2[0] === x && step.corner2[1] === y;

            let dotStyle = 'bg-sky-500 border-sky-300';
            if (isDiag) dotStyle = 'bg-purple-500 border-purple-300 scale-125 z-20';
            else if (isCorner1 || isCorner2) dotStyle = 'bg-emerald-400 border-emerald-200 scale-125 z-20';

            return (
              <div
                key={key}
                className="absolute flex flex-col items-center -translate-x-1/2 -translate-y-1/2 transition-all duration-200 z-10"
                style={{ left: getLeft(x), top: getTop(y) }}
              >
                <div className={`w-3.5 h-3.5 rounded-full border-2 shadow-md ${dotStyle}`} />
                <span className="text-[9px] font-mono text-slate-400 bg-slate-900/90 px-1 rounded mt-0.5 whitespace-nowrap">
                  ({x},{y}){count > 1 ? `x${count}` : ''}
                </span>
              </div>
            );
          })}

          {/* Query Point Crosshair */}
          <div
            className="absolute flex flex-col items-center -translate-x-1/2 -translate-y-1/2 z-30 transition-all duration-200"
            style={{ left: getLeft(queryPoint[0]), top: getTop(queryPoint[1]) }}
          >
            <div className="w-5 h-5 rounded-full border-2 border-amber-400 bg-amber-500/40 flex items-center justify-center animate-ping absolute" />
            <div className="w-5 h-5 rounded-full border-2 border-amber-400 bg-amber-500 flex items-center justify-center shadow-lg shadow-amber-500/50">
              <div className="w-1.5 h-1.5 rounded-full bg-slate-950" />
            </div>
            <span className="text-[10px] font-mono font-bold text-amber-300 bg-slate-950/90 border border-amber-400/60 px-1.5 rounded mt-0.5 whitespace-nowrap">
              Query ({queryPoint[0]},{queryPoint[1]})
            </span>
          </div>
        </div>

        {/* Bottom Explanation Banner */}
        <div className="w-full bg-slate-950/80 border border-slate-800/80 rounded-xl px-4 py-2.5 text-xs text-slate-300 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <HelpCircle className="w-4 h-4 text-indigo-400 shrink-0" />
            <span>{step.explanation}</span>
          </div>
          {step.diagonalCandidate === null && step.totalSquares >= 0 && (
            <span className="text-emerald-400 font-semibold flex items-center gap-1 shrink-0">
              <CheckCircle2 className="w-4 h-4" /> Solved
            </span>
          )}
        </div>
      </div>
    </div>
  );
};
