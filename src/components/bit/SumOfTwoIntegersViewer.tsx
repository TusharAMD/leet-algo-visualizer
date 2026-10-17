import React from 'react';
import type { SumStep } from '../../algorithms/sumOfTwoIntegersIntuitive';
import { HelpCircle, CheckCircle2, Binary } from 'lucide-react';

interface SumOfTwoIntegersViewerProps {
  step: SumStep;
  initialA: number;
  initialB: number;
}

export const SumOfTwoIntegersViewer: React.FC<SumOfTwoIntegersViewerProps> = ({
  step,
  initialA,
  initialB,
}) => {
  return (
    <div className="flex flex-col h-full gap-3 p-4 select-none">
      {/* Top Status & Variable Badges */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
        <div className="bg-slate-900 border border-slate-800 rounded-xl p-3 flex flex-col justify-center">
          <span className="text-xs text-slate-400 font-medium">Iteration Round</span>
          <span className="text-base font-mono font-bold text-sky-400">
            Round #{step.iteration}
          </span>
        </div>
        <div className="bg-slate-900 border border-slate-800 rounded-xl p-3 flex flex-col justify-center">
          <span className="text-xs text-slate-400 font-medium">Accumulated a (Sum)</span>
          <span className="text-2xl font-mono font-black text-amber-300">
            {step.a}
          </span>
        </div>
        <div className="bg-slate-900 border border-slate-800 rounded-xl p-3 flex flex-col justify-center">
          <span className="text-xs text-slate-400 font-medium">Carry b (Shifted)</span>
          <span
            className={`text-2xl font-mono font-black ${
              step.b !== 0 ? 'text-indigo-400' : 'text-emerald-400'
            }`}
          >
            {step.b}
          </span>
        </div>
        <div className="bg-slate-900 border border-slate-800 rounded-xl p-3 flex flex-col justify-center">
          <span className="text-xs text-slate-400 font-medium">Adder State</span>
          <span className="text-xs font-semibold text-emerald-400">
            {step.b === 0 ? 'Carry Cleared (Complete)' : 'Ripple Propagating'}
          </span>
        </div>
      </div>

      {/* Main Full-Adder Logic Canvas */}
      <div className="flex-1 bg-slate-900/60 border border-slate-800 rounded-xl p-6 flex flex-col justify-between items-center gap-6 relative overflow-hidden">
        {/* Expression Box */}
        <div className="flex items-center gap-4 bg-slate-950 px-6 py-2.5 rounded-2xl border border-slate-800 font-mono text-lg font-bold">
          <span className="text-sky-300">a = {initialA}</span>
          <span className="text-slate-500">+</span>
          <span className="text-indigo-300">b = {initialB}</span>
          <span className="text-slate-500">=</span>
          <span className="text-emerald-400 font-black">{step.isComplete ? step.a : '...'}</span>
        </div>

        {/* Binary Register Rows */}
        <div className="w-full max-w-xl bg-slate-950 border border-slate-800 rounded-2xl p-4 flex flex-col gap-3 font-mono">
          <div className="flex items-center justify-between text-xs text-slate-400 border-b border-slate-800 pb-1.5">
            <span className="flex items-center gap-1.5 font-bold text-indigo-400">
              <Binary className="w-4 h-4" /> Bitwise Hardware Adder Simulation
            </span>
            <span>16-bit register</span>
          </div>

          <div className="flex items-center justify-between text-xs">
            <span className="text-sky-400 w-28">Register a:</span>
            <span className="tracking-widest text-sky-200">{step.aBinary}</span>
            <span className="text-sky-400 font-bold w-12 text-right">({step.a})</span>
          </div>

          <div className="flex items-center justify-between text-xs">
            <span className="text-indigo-400 w-28">Register b:</span>
            <span className="tracking-widest text-indigo-200">{step.bBinary}</span>
            <span className="text-indigo-400 font-bold w-12 text-right">({step.b})</span>
          </div>
        </div>

        {/* Bottom Explanation Banner */}
        <div className="w-full bg-slate-950/80 border border-slate-800/80 rounded-xl px-4 py-2.5 text-xs text-slate-300 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <HelpCircle className="w-4 h-4 text-indigo-400 shrink-0" />
            <span>{step.explanation}</span>
          </div>
          {step.isComplete && (
            <span className="text-emerald-400 font-semibold flex items-center gap-1 shrink-0">
              <CheckCircle2 className="w-4 h-4" /> Sum: {step.a}
            </span>
          )}
        </div>
      </div>
    </div>
  );
};
