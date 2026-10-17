import React from 'react';
import { ContainerWithWaterStep } from '../../algorithms/containerWithWaterIntuitive';
import { Droplet, Trophy, CheckCircle2, Waves, ArrowRightLeft } from 'lucide-react';

interface ContainerWithWaterViewerProps {
  step: ContainerWithWaterStep;
  heights: number[];
}

export const ContainerWithWaterViewer: React.FC<ContainerWithWaterViewerProps> = ({ step, heights }) => {
  const { left, right, currentWidth, currentMinHeight, currentArea, maxArea, bestLeft, bestRight, isComplete } = step;

  const maxHeightVal = Math.max(...heights, 1);

  return (
    <div className="flex-1 min-h-0 flex flex-col bg-slate-900/60 border border-slate-800 rounded-2xl p-3 shadow-xl overflow-hidden justify-between">
      {/* Top Banner */}
      <div className="bg-slate-950/70 border border-slate-800/80 rounded-xl p-2.5 flex items-center justify-between shrink-0">
        <div className="flex items-center gap-2">
          <span className="p-1.5 rounded-lg bg-sky-500/10 text-sky-400 border border-sky-500/20">
            <Waves className="w-4 h-4" />
          </span>
          <div>
            <h3 className="text-xs font-semibold text-white tracking-wide">{step.headline}</h3>
            <p className="text-[11px] text-slate-400">{step.subtext}</p>
          </div>
        </div>
        <div className="flex items-center gap-2">
          {isComplete ? (
            <span className="px-2 py-0.5 rounded-md bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 text-[11px] font-semibold flex items-center gap-1">
              <CheckCircle2 className="w-3.5 h-3.5" /> Max Water: {maxArea}
            </span>
          ) : (
            <span className="px-2 py-0.5 rounded-md bg-sky-500/10 border border-sky-500/20 text-sky-400 text-[11px] font-mono">
              Step {step.stepIndex + 1} / {step.totalSteps}
            </span>
          )}
        </div>
      </div>

      {/* Main Visual Arena: Interactive Vertical Wall Basin */}
      <div className="flex-1 min-h-0 flex flex-col justify-end py-4 px-4 relative overflow-hidden">
        {/* Background Grid */}
        <div className="absolute inset-0 bg-gradient-to-t from-sky-950/20 via-transparent to-transparent pointer-events-none" />

        {/* Basin Bars Container */}
        <div className="flex items-end justify-center gap-3 sm:gap-4 h-44 relative z-10 w-full px-2 border-b border-slate-700">
          {heights.map((hVal, idx) => {
            const isLeft = left === idx;
            const isRight = right === idx;
            const isInsideBasin = idx > left && idx < right;
            const heightPercent = Math.round((hVal / maxHeightVal) * 100);
            const waterHeightPercent = Math.round((currentMinHeight / maxHeightVal) * 100);

            let barColor = 'bg-slate-700/80 border-slate-600';
            if (isLeft || isRight) {
              barColor = 'bg-sky-400 border-sky-300 shadow-lg shadow-sky-500/40';
            } else if (isComplete && (idx === bestLeft || idx === bestRight)) {
              barColor = 'bg-emerald-400 border-emerald-300 shadow-lg shadow-emerald-500/40';
            }

            return (
              <div key={idx} className="flex-1 max-w-[48px] flex flex-col items-center h-full justify-end relative">
                {/* Pointer Tag */}
                <div className="h-6 flex items-center justify-center text-[10px] font-mono font-bold">
                  {isLeft ? (
                    <span className="text-sky-400 font-bold bg-sky-500/10 px-1 rounded border border-sky-500/30">
                      L
                    </span>
                  ) : isRight ? (
                    <span className="text-amber-400 font-bold bg-amber-500/10 px-1 rounded border border-amber-500/30">
                      R
                    </span>
                  ) : null}
                </div>

                {/* Vertical Wall Bar */}
                <div
                  className={`w-full rounded-t-md border transition-all duration-300 relative flex items-start justify-center pt-1 ${barColor}`}
                  style={{ height: `${Math.max(12, heightPercent)}%` }}
                >
                  <span className="text-[10px] font-mono font-bold text-slate-900 drop-shadow">
                    {hVal}
                  </span>
                </div>

                {/* Water overlay between L and R */}
                {isInsideBasin && !isComplete && (
                  <div
                    className="absolute bottom-0 w-full bg-sky-500/30 border-t border-sky-400/50 backdrop-blur-[1px] transition-all duration-300 pointer-events-none"
                    style={{ height: `${waterHeightPercent}%` }}
                  />
                )}

                {/* Index subscript */}
                <span className="text-[10px] font-mono text-slate-500 mt-1">{idx}</span>
              </div>
            );
          })}
        </div>

        {/* Dimension Indicators */}
        <div className="flex items-center justify-between text-xs font-mono text-slate-400 pt-2 px-4">
          <div className="flex items-center gap-1.5">
            <span className="text-sky-400 font-bold">h = min({heights[left]}, {heights[right]}) = {currentMinHeight}</span>
          </div>
          <div className="flex items-center gap-1.5">
            <span className="text-amber-400 font-bold">w = {right} - {left} = {currentWidth}</span>
          </div>
          <div className="flex items-center gap-1.5">
            <span className="text-emerald-400 font-bold">Area = {currentArea}</span>
          </div>
        </div>
      </div>

      {/* Bottom Summary Bar */}
      <div className="bg-slate-950/60 border border-slate-800/80 rounded-xl p-2.5 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Trophy className="w-4 h-4 text-emerald-400" />
          <span className="text-xs font-mono font-bold text-slate-300">
            Maximum Water Stored:
          </span>
        </div>
        <div className="flex items-center gap-2">
          <span className="px-3 py-0.5 rounded-lg bg-emerald-500/20 border border-emerald-400/40 text-emerald-300 font-mono text-sm font-bold shadow-md shadow-emerald-500/10">
            {maxArea} Units²
          </span>
          <span className="text-xs font-mono text-slate-400">
            (Pointers: [{bestLeft}, {bestRight}])
          </span>
        </div>
      </div>
    </div>
  );
};
