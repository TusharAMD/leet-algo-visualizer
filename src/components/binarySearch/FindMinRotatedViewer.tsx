import React from 'react';
import { FindMinRotatedStep } from '../../algorithms/findMinRotatedIntuitive';
import { Compass, Trophy, CheckCircle2, ShieldCheck, Flame } from 'lucide-react';

interface FindMinRotatedViewerProps {
  step: FindMinRotatedStep;
}

export const FindMinRotatedViewer: React.FC<FindMinRotatedViewerProps> = ({ step }) => {
  const { nums, left, right, mid, foundMin, isComplete } = step;

  const maxVal = Math.max(...nums, 1);
  const minVal = Math.min(...nums, 0);
  const span = Math.max(1, maxVal - minVal);

  return (
    <div className="flex-1 min-h-0 flex flex-col bg-slate-900/60 border border-slate-800 rounded-2xl p-3 shadow-xl overflow-hidden justify-between">
      {/* Top Banner */}
      <div className="bg-slate-950/70 border border-slate-800/80 rounded-xl p-2.5 flex items-center justify-between shrink-0">
        <div className="flex items-center gap-2">
          <span className="p-1.5 rounded-lg bg-indigo-500/10 text-indigo-400 border border-indigo-500/20">
            <Compass className="w-4 h-4" />
          </span>
          <div>
            <h3 className="text-xs font-semibold text-white tracking-wide">{step.headline}</h3>
            <p className="text-[11px] text-slate-400">{step.subtext}</p>
          </div>
        </div>
        <div className="flex items-center gap-2">
          {isComplete ? (
            <span className="px-2 py-0.5 rounded-md bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 text-[11px] font-semibold flex items-center gap-1">
              <CheckCircle2 className="w-3.5 h-3.5" /> Minimum: {foundMin}
            </span>
          ) : (
            <span className="px-2 py-0.5 rounded-md bg-indigo-500/10 border border-indigo-500/20 text-indigo-400 text-[11px] font-mono">
              Step {step.stepIndex + 1} / {step.totalSteps}
            </span>
          )}
        </div>
      </div>

      {/* Main Arena: Rotated Height Chart */}
      <div className="flex-1 min-h-0 flex flex-col justify-end py-2 px-4 relative overflow-hidden">
        <div className="flex items-end justify-center gap-3 sm:gap-4 h-44 px-2 border-b border-slate-700 bg-slate-950/60 rounded-xl p-2">
          {nums.map((val, idx) => {
            const isLeft = left === idx;
            const isRight = right === idx;
            const isMid = mid === idx;
            const inRange = idx >= left && idx <= right;
            const isFinalMin = isComplete && idx === left;

            const heightPercent = Math.round(((val - minVal + 1) / (span + 1)) * 100);

            let barColor = 'bg-slate-800 border-slate-700 text-slate-500 opacity-40';
            if (inRange) {
              barColor = 'bg-slate-800/90 border-slate-700 text-slate-300';
            }

            if (isFinalMin) {
              barColor = 'bg-emerald-500/30 border-emerald-400 text-emerald-200 scale-110 shadow-lg shadow-emerald-500/30 ring-2 ring-emerald-400';
            } else if (isMid) {
              barColor = 'bg-amber-500/30 border-amber-400 text-amber-200 scale-105 shadow-md shadow-amber-500/20 ring-2 ring-amber-400';
            }

            return (
              <div key={idx} className="flex-1 max-w-[48px] flex flex-col items-center h-full justify-end">
                {/* Pointer Tag */}
                <div className="h-5 flex items-center justify-center text-[10px] font-mono font-bold">
                  {isFinalMin ? (
                    <span className="text-emerald-400 font-bold flex items-center gap-0.5">
                      <Flame className="w-3 h-3 text-emerald-400" /> MIN
                    </span>
                  ) : isMid ? (
                    <span className="text-amber-400 bg-amber-500/10 px-1 rounded border border-amber-500/30">
                      M
                    </span>
                  ) : isLeft ? (
                    <span className="text-cyan-400 bg-cyan-500/10 px-1 rounded border border-cyan-500/30">
                      L
                    </span>
                  ) : isRight ? (
                    <span className="text-pink-400 bg-pink-500/10 px-1 rounded border border-pink-500/30">
                      R
                    </span>
                  ) : null}
                </div>

                {/* Vertical Bar */}
                <div
                  className={`w-full rounded-t-md border transition-all duration-300 flex items-start justify-center pt-1 ${barColor}`}
                  style={{ height: `${Math.max(16, heightPercent)}%` }}
                >
                  <span className="text-[10px] font-mono font-bold text-white drop-shadow">
                    {val}
                  </span>
                </div>

                {/* Subscript */}
                <span className="text-[9px] font-mono text-slate-500 mt-1">{idx}</span>
              </div>
            );
          })}
        </div>

        {/* Pointer Coordinate Legend */}
        <div className="flex items-center justify-between text-xs font-mono text-slate-400 pt-2 px-4">
          <div className="flex items-center gap-3">
            <span className="text-cyan-400 font-bold">L = {left} (nums[{left}]={nums[left]})</span>
            <span className="text-slate-600">|</span>
            {mid >= 0 && (
              <span className="text-amber-400 font-bold">M = {mid} (nums[{mid}]={nums[mid]})</span>
            )}
            <span className="text-slate-600">|</span>
            <span className="text-pink-400 font-bold">R = {right} (nums[{right}]={nums[right]})</span>
          </div>
          <span className="text-slate-500 text-[11px]">Inflection Pivot Decision</span>
        </div>
      </div>

      {/* Bottom Summary Bar */}
      <div className="bg-slate-950/60 border border-slate-800/80 rounded-xl p-2.5 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Trophy className="w-4 h-4 text-emerald-400" />
          <span className="text-xs font-mono font-bold text-slate-300">
            Minimum Rotated Element:
          </span>
        </div>
        <div className="flex items-center gap-2">
          <span className="px-3 py-0.5 rounded-lg bg-emerald-500/20 border border-emerald-400/40 text-emerald-300 font-mono text-sm font-bold shadow-md shadow-emerald-500/10">
            {foundMin !== null ? foundMin : 'Searching...'}
          </span>
        </div>
      </div>
    </div>
  );
};
