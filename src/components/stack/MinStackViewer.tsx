import React from 'react';
import { MinStackStep } from '../../algorithms/minStackIntuitive';
import { Layers, ArrowDown, ArrowUp, ShieldCheck, CheckCircle2, Zap } from 'lucide-react';

interface MinStackViewerProps {
  step: MinStackStep;
}

export const MinStackViewer: React.FC<MinStackViewerProps> = ({ step }) => {
  const { operation, stack, minStack, currentTop, currentMin, isComplete } = step;

  return (
    <div className="flex-1 min-h-0 flex flex-col bg-slate-900/60 border border-slate-800 rounded-2xl p-3 shadow-xl overflow-hidden justify-between">
      {/* Top Banner */}
      <div className="bg-slate-950/70 border border-slate-800/80 rounded-xl p-2.5 flex items-center justify-between shrink-0">
        <div className="flex items-center gap-2">
          <span className="p-1.5 rounded-lg bg-indigo-500/10 text-indigo-400 border border-indigo-500/20">
            <Layers className="w-4 h-4" />
          </span>
          <div>
            <h3 className="text-xs font-semibold text-white tracking-wide">{step.headline}</h3>
            <p className="text-[11px] text-slate-400">{step.subtext}</p>
          </div>
        </div>
        <div className="flex items-center gap-2">
          {isComplete ? (
            <span className="px-2 py-0.5 rounded-md bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 text-[11px] font-semibold flex items-center gap-1">
              <CheckCircle2 className="w-3.5 h-3.5" /> O(1) All Ops Verified
            </span>
          ) : (
            <span className="px-2 py-0.5 rounded-md bg-indigo-500/10 border border-indigo-500/20 text-indigo-400 text-[11px] font-mono">
              Step {step.stepIndex + 1} / {step.totalSteps}
            </span>
          )}
        </div>
      </div>

      {/* Main Arena: Dual Stacks Side-by-Side */}
      <div className="flex-1 min-h-0 flex items-center justify-around gap-6 py-2 px-4">
        {/* Left Stack: Main Values */}
        <div className="flex flex-col items-center gap-2 h-full max-h-56 w-36">
          <span className="text-[10px] uppercase font-mono font-bold tracking-wider text-indigo-400 flex items-center gap-1">
            <ArrowDown className="w-3 h-3" /> Value Stack
          </span>

          <div className="flex-1 w-full bg-slate-950/80 border-2 border-indigo-500/30 rounded-xl p-2 flex flex-col-reverse items-center gap-1.5 overflow-y-auto shadow-inner">
            {stack.length === 0 ? (
              <span className="text-xs text-slate-600 italic my-auto">Stack empty</span>
            ) : (
              stack.map((val, idx) => {
                const isTop = idx === stack.length - 1;
                return (
                  <div
                    key={idx}
                    className={`w-full py-1.5 px-3 rounded-lg border text-xs font-mono font-bold text-center transition-all ${
                      isTop
                        ? 'bg-indigo-500/25 border-indigo-400 text-indigo-200 scale-105 shadow-md shadow-indigo-500/20'
                        : 'bg-slate-900 border-slate-800 text-slate-300'
                    }`}
                  >
                    {val} {isTop && <span className="text-[9px] text-indigo-400 uppercase ml-1">(top)</span>}
                  </div>
                );
              })
            )}
          </div>
        </div>

        {/* Middle Status Gauges */}
        <div className="flex flex-col items-center justify-center gap-4 bg-slate-950/60 p-4 rounded-2xl border border-slate-800/80">
          <div className="flex flex-col items-center">
            <span className="text-[10px] uppercase font-mono text-slate-400 font-semibold">top()</span>
            <div className="w-14 h-12 mt-1 rounded-xl bg-indigo-500/15 border border-indigo-500/30 flex items-center justify-center text-sm font-mono font-bold text-indigo-300 shadow-md">
              {currentTop !== null ? currentTop : '—'}
            </div>
          </div>

          <div className="flex flex-col items-center">
            <span className="text-[10px] uppercase font-mono text-emerald-400 font-semibold">getMin()</span>
            <div className="w-14 h-12 mt-1 rounded-xl bg-emerald-500/15 border border-emerald-500/30 flex items-center justify-center text-sm font-mono font-bold text-emerald-300 shadow-md">
              {currentMin !== null ? currentMin : '—'}
            </div>
          </div>
        </div>

        {/* Right Stack: Running Min Stack */}
        <div className="flex flex-col items-center gap-2 h-full max-h-56 w-36">
          <span className="text-[10px] uppercase font-mono font-bold tracking-wider text-emerald-400 flex items-center gap-1">
            <ShieldCheck className="w-3 h-3" /> Min Stack
          </span>

          <div className="flex-1 w-full bg-slate-950/80 border-2 border-emerald-500/30 rounded-xl p-2 flex flex-col-reverse items-center gap-1.5 overflow-y-auto shadow-inner">
            {minStack.length === 0 ? (
              <span className="text-xs text-slate-600 italic my-auto">Min stack empty</span>
            ) : (
              minStack.map((val, idx) => {
                const isTop = idx === minStack.length - 1;
                return (
                  <div
                    key={idx}
                    className={`w-full py-1.5 px-3 rounded-lg border text-xs font-mono font-bold text-center transition-all ${
                      isTop
                        ? 'bg-emerald-500/25 border-emerald-400 text-emerald-200 scale-105 shadow-md shadow-emerald-500/20'
                        : 'bg-slate-900 border-slate-800 text-slate-400'
                    }`}
                  >
                    {val} {isTop && <span className="text-[9px] text-emerald-400 uppercase ml-1">(min)</span>}
                  </div>
                );
              })
            )}
          </div>
        </div>
      </div>

      {/* Bottom Summary Bar */}
      <div className="bg-slate-950/60 border border-slate-800/80 rounded-xl p-2.5 flex items-center justify-between text-xs font-mono">
        <div className="flex items-center gap-2">
          <span className="text-slate-400">Current Action:</span>
          <span className="px-2 py-0.5 rounded bg-indigo-500/20 border border-indigo-500/40 text-indigo-300 font-bold">
            {operation.type}{operation.value !== undefined ? `(${operation.value})` : '()'}
          </span>
        </div>
        <div className="flex items-center gap-3">
          <span className="text-slate-400">Stack Height: <span className="text-white font-bold">{stack.length}</span></span>
          <span className="text-slate-500">|</span>
          <span className="text-emerald-400 font-bold">Time Complexity: O(1) All Ops</span>
        </div>
      </div>
    </div>
  );
};
