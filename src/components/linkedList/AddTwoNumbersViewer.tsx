import React from 'react';
import { AddTwoNumbersStep } from '../../algorithms/addTwoNumbersIntuitive';
import { Plus, ArrowRight, CheckCircle2, Hash, ArrowDown } from 'lucide-react';

interface AddTwoNumbersViewerProps {
  step: AddTwoNumbersStep;
}

export const AddTwoNumbersViewer: React.FC<AddTwoNumbersViewerProps> = ({ step }) => {
  const { list1, list2, p1, p2, v1, v2, carry, sumVal, digitPlaced, resultDigits, isComplete } = step;

  return (
    <div className="flex-1 min-h-0 flex flex-col bg-slate-900/60 border border-slate-800 rounded-2xl p-3 shadow-xl overflow-hidden justify-between">
      {/* Top Banner */}
      <div className="bg-slate-950/70 border border-slate-800/80 rounded-xl p-2.5 flex items-center justify-between shrink-0">
        <div className="flex items-center gap-2">
          <span className="p-1.5 rounded-lg bg-indigo-500/10 text-indigo-400 border border-indigo-500/20">
            <Plus className="w-4 h-4" />
          </span>
          <div>
            <h3 className="text-xs font-semibold text-white tracking-wide">{step.headline}</h3>
            <p className="text-[11px] text-slate-400">{step.subtext}</p>
          </div>
        </div>
        <div className="flex items-center gap-2">
          {isComplete ? (
            <span className="px-2 py-0.5 rounded-md bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 text-[11px] font-semibold flex items-center gap-1">
              <CheckCircle2 className="w-3.5 h-3.5" /> Sum ({resultDigits.length} Digits)
            </span>
          ) : (
            <span className="px-2 py-0.5 rounded-md bg-indigo-500/10 border border-indigo-500/20 text-indigo-400 text-[11px] font-mono">
              Step {step.stepIndex + 1} / {step.totalSteps}
            </span>
          )}
        </div>
      </div>

      {/* Main Arena */}
      <div className="flex-1 min-h-0 flex flex-col justify-around gap-2 py-2 px-3">
        {/* Arithmetic Box */}
        <div className="bg-slate-950/60 border border-slate-800/80 rounded-xl p-2 flex items-center justify-between">
          <div className="flex items-center gap-3 text-xs font-mono">
            <span className="text-indigo-400 font-bold">v1: {v1}</span>
            <span className="text-slate-500">+</span>
            <span className="text-cyan-400 font-bold">v2: {v2}</span>
            <span className="text-slate-500">+</span>
            <span className="text-amber-400 font-bold">carry: {carry}</span>
            <span className="text-slate-500">=</span>
            <span className="text-white font-extrabold bg-slate-900 px-2 py-0.5 rounded border border-slate-700">
              {sumVal}
            </span>
            <span className="text-slate-400 text-[11px]">
              (Place <span className="text-emerald-400 font-bold">{digitPlaced}</span>, carry <span className="text-amber-400 font-bold">{Math.floor(sumVal / 10)}</span>)
            </span>
          </div>
          <span className="px-2 py-0.5 rounded bg-amber-500/10 border border-amber-500/30 text-amber-300 text-[11px] font-mono">
            Carry: {carry}
          </span>
        </div>

        {/* List 1 Row */}
        <div className="bg-slate-950/60 border border-slate-800/80 rounded-xl p-2 flex items-center gap-3">
          <span className="text-[10px] uppercase font-mono font-bold tracking-wider text-indigo-400 w-14 shrink-0">
            List 1:
          </span>
          <div className="flex items-center gap-2 overflow-x-auto py-1">
            {list1.map((val, idx) => {
              const isCurrent = idx === p1 && !isComplete;
              const isDone = idx < p1;

              let nodeClass = 'bg-slate-900/80 border-slate-800 text-slate-300';
              if (isDone) {
                nodeClass = 'bg-slate-950/50 border-slate-900 text-slate-600 opacity-50';
              } else if (isCurrent) {
                nodeClass = 'bg-indigo-500/25 border-indigo-400 text-indigo-200 ring-2 ring-indigo-400 scale-105 shadow-md shadow-indigo-500/20';
              }

              return (
                <React.Fragment key={idx}>
                  <div className={`w-9 h-9 rounded-lg border font-mono text-xs font-bold flex items-center justify-center transition-all ${nodeClass}`}>
                    {val}
                  </div>
                  {idx < list1.length - 1 && (
                    <ArrowRight className="w-3.5 h-3.5 text-slate-700 shrink-0" />
                  )}
                </React.Fragment>
              );
            })}
            <ArrowRight className="w-3.5 h-3.5 text-slate-700 shrink-0" />
            <span className="font-mono text-xs text-slate-600">None</span>
          </div>
        </div>

        {/* List 2 Row */}
        <div className="bg-slate-950/60 border border-slate-800/80 rounded-xl p-2 flex items-center gap-3">
          <span className="text-[10px] uppercase font-mono font-bold tracking-wider text-cyan-400 w-14 shrink-0">
            List 2:
          </span>
          <div className="flex items-center gap-2 overflow-x-auto py-1">
            {list2.map((val, idx) => {
              const isCurrent = idx === p2 && !isComplete;
              const isDone = idx < p2;

              let nodeClass = 'bg-slate-900/80 border-slate-800 text-slate-300';
              if (isDone) {
                nodeClass = 'bg-slate-950/50 border-slate-900 text-slate-600 opacity-50';
              } else if (isCurrent) {
                nodeClass = 'bg-cyan-500/25 border-cyan-400 text-cyan-200 ring-2 ring-cyan-400 scale-105 shadow-md shadow-cyan-500/20';
              }

              return (
                <React.Fragment key={idx}>
                  <div className={`w-9 h-9 rounded-lg border font-mono text-xs font-bold flex items-center justify-center transition-all ${nodeClass}`}>
                    {val}
                  </div>
                  {idx < list2.length - 1 && (
                    <ArrowRight className="w-3.5 h-3.5 text-slate-700 shrink-0" />
                  )}
                </React.Fragment>
              );
            })}
            <ArrowRight className="w-3.5 h-3.5 text-slate-700 shrink-0" />
            <span className="font-mono text-xs text-slate-600">None</span>
          </div>
        </div>

        {/* Result Chain Row */}
        <div className="bg-slate-950/80 border border-emerald-500/25 rounded-xl p-2.5 flex items-center gap-3">
          <span className="text-[10px] uppercase font-mono font-bold tracking-wider text-emerald-400 w-14 shrink-0 flex items-center gap-1">
            Sum List:
          </span>
          <div className="flex items-center gap-2 overflow-x-auto py-1">
            {resultDigits.length === 0 ? (
              <span className="text-slate-600 text-xs italic font-mono">
                Digits will be appended here...
              </span>
            ) : (
              resultDigits.map((digit, idx) => {
                const isLatest = idx === resultDigits.length - 1 && !isComplete;
                return (
                  <React.Fragment key={idx}>
                    <div
                      className={`w-9 h-9 rounded-lg border font-mono text-xs font-bold flex items-center justify-center transition-all ${
                        isLatest
                          ? 'bg-emerald-500/30 border-emerald-400 text-emerald-100 ring-2 ring-emerald-400 scale-105 shadow-md shadow-emerald-500/20'
                          : 'bg-emerald-500/15 border-emerald-500/35 text-emerald-200'
                      }`}
                    >
                      {digit}
                    </div>
                    {idx < resultDigits.length - 1 && (
                      <ArrowRight className="w-3.5 h-3.5 text-emerald-500/60 shrink-0" />
                    )}
                  </React.Fragment>
                );
              })
            )}
            {isComplete && resultDigits.length > 0 && (
              <>
                <ArrowRight className="w-3.5 h-3.5 text-emerald-500/60 shrink-0" />
                <span className="font-mono text-xs text-slate-500">None</span>
              </>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
