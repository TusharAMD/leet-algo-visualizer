import React from 'react';
import { TrappingWaterStep } from '../../algorithms/trappingRainWaterIntuitive';
import { Droplet, ArrowDown, Waves, ShieldCheck, Trophy } from 'lucide-react';

interface TrappingWaterViewerProps {
  step: TrappingWaterStep;
  heights: number[];
}

export const TrappingWaterViewer: React.FC<TrappingWaterViewerProps> = ({ step, heights }) => {
  const {
    leftIndex,
    rightIndex,
    leftMax,
    rightMax,
    activeSide,
    currentCol,
    waterAtCol,
    totalWater,
    waterGrid,
    headline,
    subtext,
    isComplete,
  } = step;

  const maxHeight = Math.max(...heights, 1);
  const chartHeightPx = 180; // Total height of the visual chart

  return (
    <div className="flex flex-col justify-between gap-3 p-4 bg-slate-900/40 border border-slate-800 rounded-2xl h-full overflow-hidden">
      {/* 1. Header Banner: Current Step & Total Water */}
      <div className="bg-gradient-to-r from-slate-900 via-indigo-950/40 to-slate-900 border border-indigo-500/20 rounded-xl p-3 shadow shrink-0">
        <div className="flex items-center justify-between gap-2 flex-wrap">
          <div className="flex items-center gap-2.5">
            <div className="w-9 h-9 rounded-xl bg-blue-500/20 border border-blue-500/40 flex items-center justify-center text-blue-300 font-bold font-mono text-sm shrink-0">
              <Droplet className="w-5 h-5 text-blue-400 fill-blue-400" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="text-[9px] uppercase font-bold tracking-wider px-1.5 py-0.2 rounded bg-indigo-500/10 text-indigo-400 border border-indigo-500/20">
                  {isComplete ? 'Finished' : `Active Column ${currentCol}`}
                </span>
                <span className="text-xs font-mono font-bold text-blue-300">
                  Total Trapped: {totalWater} units
                </span>
              </div>
              <h2 className="text-xs font-bold text-white leading-tight mt-0.5">{headline}</h2>
            </div>
          </div>

          {/* Wall Max Badges */}
          <div className="flex items-center gap-2 shrink-0">
            <div className="flex items-center gap-1.5 px-2.5 py-1 rounded-xl bg-cyan-950/60 border border-cyan-500/40 text-cyan-300 text-xs font-mono">
              <span className="text-[10px] text-slate-400 font-sans">Left Barrier:</span>
              <span className="font-bold">{leftMax}</span>
            </div>
            <div className="flex items-center gap-1.5 px-2.5 py-1 rounded-xl bg-purple-950/60 border border-purple-500/40 text-purple-300 text-xs font-mono">
              <span className="text-[10px] text-slate-400 font-sans">Right Barrier:</span>
              <span className="font-bold">{rightMax}</span>
            </div>
          </div>
        </div>
        <p className="text-[11px] text-slate-300 mt-1.5 leading-normal font-sans line-clamp-2">{subtext}</p>
      </div>

      {/* 2. The Visual Landscape: Elevation Bars + Water Blocks */}
      <div className="flex-1 min-h-0 flex flex-col justify-end gap-2">
        <div className="flex items-center justify-between text-xs text-slate-400 px-1">
          <span className="flex items-center gap-1 font-semibold text-slate-300 text-[11px]">
            <Waves className="w-3.5 h-3.5 text-blue-400" />
            Elevation Terrain & Trapped Water Levels
          </span>
          <span className="text-[10px] text-slate-500 font-mono">
            Max Height: {maxHeight} units
          </span>
        </div>

        {/* The Bars Chart */}
        <div className="overflow-x-auto pt-10 pb-2">
          <div className="flex items-end gap-2 min-w-max px-6 justify-center" style={{ height: `${chartHeightPx + 40}px` }}>
            {heights.map((h, col) => {
              const isLeft = col === leftIndex;
              const isRight = col === rightIndex;
              const water = waterGrid[col] || 0;
              const barHeightPx = (h / maxHeight) * chartHeightPx;
              const waterHeightPx = (water / maxHeight) * chartHeightPx;

              return (
                <div key={col} className="relative flex flex-col items-center">
                  {/* Floating Pointer L */}
                  {isLeft && !isComplete && (
                    <div className="absolute -top-8 flex flex-col items-center animate-bounce text-cyan-400 z-20 whitespace-nowrap pointer-events-none">
                      <span className="text-[9px] font-extrabold uppercase tracking-wider bg-cyan-950/90 text-cyan-300 px-2 py-0.5 rounded-full border border-cyan-500/60 shadow-lg backdrop-blur">
                        L
                      </span>
                      <ArrowDown className="w-3 h-3 text-cyan-400" />
                    </div>
                  )}

                  {/* Floating Pointer R */}
                  {isRight && !isComplete && (
                    <div className="absolute -top-8 flex flex-col items-center animate-bounce text-purple-400 z-20 whitespace-nowrap pointer-events-none">
                      <span className="text-[9px] font-extrabold uppercase tracking-wider bg-purple-950/90 text-purple-300 px-2 py-0.5 rounded-full border border-purple-500/60 shadow-lg backdrop-blur">
                        R
                      </span>
                      <ArrowDown className="w-3 h-3 text-purple-400" />
                    </div>
                  )}

                  {/* Combined Stack (Water on top of Bar) */}
                  <div className="w-10 flex flex-col justify-end items-center">
                    {/* Water Block on Top */}
                    {water > 0 && (
                      <div
                        className="w-full bg-gradient-to-b from-blue-400/90 to-blue-600/80 border-t border-x border-blue-300/80 rounded-t flex flex-col items-center justify-center text-[10px] font-bold text-white shadow-md shadow-blue-500/30 transition-all duration-300 animate-in fade-in"
                        style={{ height: `${Math.max(waterHeightPx, 18)}px` }}
                        title={`${water} unit(s) of water`}
                      >
                        <span className="font-mono text-[9px] drop-shadow">💧+{water}</span>
                      </div>
                    )}

                    {/* Elevation Ground Bar */}
                    <div
                      className={`w-full rounded-t flex flex-col items-center justify-end pb-1 border transition-all ${
                        isLeft
                          ? 'border-cyan-400 bg-slate-700 shadow-md shadow-cyan-500/20'
                          : isRight
                          ? 'border-purple-400 bg-slate-700 shadow-md shadow-purple-500/20'
                          : 'border-slate-600 bg-slate-800'
                      }`}
                      style={{ height: `${Math.max(barHeightPx, 4)}px` }}
                    >
                      {h > 0 && (
                        <span className="text-[10px] font-mono font-bold text-slate-300">
                          {h}
                        </span>
                      )}
                    </div>
                  </div>

                  {/* Column Index underneath */}
                  <div className="mt-1.5 text-center">
                    <span
                      className={`text-[10px] font-mono font-bold ${
                        isLeft
                          ? 'text-cyan-400'
                          : isRight
                          ? 'text-purple-400'
                          : 'text-slate-500'
                      }`}
                    >
                      {col}
                    </span>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>

      {/* 3. The Math & Two-Pointer Bottleneck Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-3 pt-1 border-t border-slate-800/80 shrink-0">
        {/* Formula breakdown */}
        <div className="p-2.5 rounded-xl bg-slate-950/70 border border-slate-800 flex flex-col justify-between gap-1">
          <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider flex items-center gap-1.5">
            <Waves className="w-3.5 h-3.5 text-blue-400" />
            Column Water Formula
          </span>
          <div className="font-mono text-xs text-blue-200 bg-slate-900/90 p-2 rounded-lg border border-slate-800">
            water = max(0, min(left_max, right_max) - height[col])
          </div>
          <p className="text-[10px] text-slate-400">
            Water rises to the shorter of the two surrounding barrier walls.
          </p>
        </div>

        {/* Why Two Pointers Guarantee */}
        <div className="p-2.5 rounded-xl bg-slate-950/70 border border-slate-800 flex flex-col justify-between gap-1">
          <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider flex items-center gap-1.5">
            <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" />
            Why Left/Right Decision is 100% Safe
          </span>
          <p className="text-[11px] text-slate-300 leading-snug">
            {isComplete ? (
              <span className="text-emerald-300 font-semibold flex items-center gap-1">
                <Trophy className="w-3.5 h-3.5 text-emerald-400" /> Solved all columns in O(n) single pass with O(1) extra space!
              </span>
            ) : heights[leftIndex] < heights[rightIndex] ? (
              <>
                Since <code className="text-cyan-300 font-mono">height[L] &lt; height[R]</code>, the bottleneck is strictly bounded by <strong className="text-cyan-300">left_max ({leftMax})</strong>. We can safely process Column {leftIndex}!
              </>
            ) : (
              <>
                Since <code className="text-purple-300 font-mono">height[R] &le; height[L]</code>, the bottleneck is strictly bounded by <strong className="text-purple-300">right_max ({rightMax})</strong>. We can safely process Column {rightIndex}!
              </>
            )}
          </p>
        </div>
      </div>
    </div>
  );
};
