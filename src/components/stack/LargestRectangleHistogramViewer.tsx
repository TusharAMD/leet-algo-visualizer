import React from 'react';
import { LargestRectangleHistogramStep } from '../../algorithms/largestRectangleHistogramIntuitive';
import { BarChart2, Trophy, CheckCircle2, Layers } from 'lucide-react';

interface LargestRectangleHistogramViewerProps {
  step: LargestRectangleHistogramStep;
}

export const LargestRectangleHistogramViewer: React.FC<LargestRectangleHistogramViewerProps> = ({ step }) => {
  const { heights, currentIndex, stack, activeRect, maxArea, bestRect, isComplete } = step;

  const maxHeightVal = Math.max(...heights, 1);
  const targetRect = isComplete ? bestRect : activeRect;

  return (
    <div className="flex-1 min-h-0 flex flex-col bg-slate-900/60 border border-slate-800 rounded-2xl p-3 shadow-xl overflow-hidden justify-between">
      {/* Top Banner */}
      <div className="bg-slate-950/70 border border-slate-800/80 rounded-xl p-2.5 flex items-center justify-between shrink-0">
        <div className="flex items-center gap-2">
          <span className="p-1.5 rounded-lg bg-indigo-500/10 text-indigo-400 border border-indigo-500/20">
            <BarChart2 className="w-4 h-4" />
          </span>
          <div>
            <h3 className="text-xs font-semibold text-white tracking-wide">{step.headline}</h3>
            <p className="text-[11px] text-slate-400">{step.subtext}</p>
          </div>
        </div>
        <div className="flex items-center gap-2">
          {isComplete ? (
            <span className="px-2 py-0.5 rounded-md bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 text-[11px] font-semibold flex items-center gap-1">
              <CheckCircle2 className="w-3.5 h-3.5" /> Max Area: {maxArea}
            </span>
          ) : (
            <span className="px-2 py-0.5 rounded-md bg-indigo-500/10 border border-indigo-500/20 text-indigo-400 text-[11px] font-mono">
              Step {step.stepIndex + 1} / {step.totalSteps}
            </span>
          )}
        </div>
      </div>

      {/* Main Arena: Histogram Bars with Rectangle Overlay */}
      <div className="flex-1 min-h-0 flex flex-col justify-end py-2 px-4 relative overflow-hidden">
        {/* Bars Container */}
        <div className="flex items-end justify-center gap-3 sm:gap-4 h-44 relative z-10 w-full px-2 border-b border-slate-700">
          {heights.map((hVal, idx) => {
            const isCurrent = currentIndex === idx;
            const inActiveRect = targetRect && idx >= targetRect.startIdx && idx <= targetRect.endIdx;
            const heightPercent = Math.round((hVal / maxHeightVal) * 100);

            let barColor = 'bg-slate-800 border-slate-700 text-slate-300';
            if (inActiveRect) {
              barColor = isComplete
                ? 'bg-emerald-500/40 border-emerald-400 text-emerald-200 shadow-lg shadow-emerald-500/30'
                : 'bg-indigo-500/40 border-indigo-400 text-indigo-200 shadow-lg shadow-indigo-500/30';
            } else if (isCurrent) {
              barColor = 'bg-amber-500/40 border-amber-400 text-amber-200 scale-105';
            }

            return (
              <div key={idx} className="flex-1 max-w-[48px] flex flex-col items-center h-full justify-end relative">
                {/* Pointer Tag */}
                <div className="h-5 flex items-center justify-center text-[10px] font-mono font-bold">
                  {isCurrent && (
                    <span className="text-amber-400 bg-amber-500/10 px-1 rounded border border-amber-500/30">
                      i
                    </span>
                  )}
                </div>

                {/* Vertical Bar */}
                <div
                  className={`w-full rounded-t-md border transition-all duration-300 relative flex items-start justify-center pt-1 ${barColor}`}
                  style={{ height: `${Math.max(12, heightPercent)}%` }}
                >
                  <span className="text-[10px] font-mono font-bold text-white drop-shadow">
                    {hVal}
                  </span>
                </div>

                {/* Index subscript */}
                <span className="text-[10px] font-mono text-slate-500 mt-1">{idx}</span>
              </div>
            );
          })}
        </div>

        {/* Dimension Indicators */}
        <div className="flex items-center justify-between text-xs font-mono text-slate-400 pt-2 px-4">
          {targetRect ? (
            <div className="flex items-center gap-3">
              <span className="text-indigo-400 font-bold">
                Height = {targetRect.height}
              </span>
              <span className="text-slate-600">×</span>
              <span className="text-amber-400 font-bold">
                Width = {targetRect.endIdx - targetRect.startIdx + 1}
              </span>
              <span className="text-slate-600">=</span>
              <span className="text-emerald-400 font-bold">
                Area = {targetRect.area}
              </span>
              <span className="text-slate-500 text-[10px]">
                (Cols [{targetRect.startIdx}..{targetRect.endIdx}])
              </span>
            </div>
          ) : (
            <span className="text-slate-500 italic text-[11px]">Advancing monotonic stack...</span>
          )}

          <div className="flex items-center gap-2">
            <Layers className="w-3.5 h-3.5 text-indigo-400" />
            <span className="text-[10px] font-mono text-slate-400">
              Stack: [{stack.map((s) => `(${s.startIdx},${s.height})`).join(' ')}]
            </span>
          </div>
        </div>
      </div>

      {/* Bottom Summary Bar */}
      <div className="bg-slate-950/60 border border-slate-800/80 rounded-xl p-2.5 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Trophy className="w-4 h-4 text-emerald-400" />
          <span className="text-xs font-mono font-bold text-slate-300">
            Largest Rectangle Area:
          </span>
        </div>
        <div className="flex items-center gap-2">
          <span className="px-3 py-0.5 rounded-lg bg-emerald-500/20 border border-emerald-400/40 text-emerald-300 font-mono text-sm font-bold shadow-md shadow-emerald-500/10">
            {maxArea} Units²
          </span>
        </div>
      </div>
    </div>
  );
};
