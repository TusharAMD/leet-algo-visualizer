import React from 'react';
import type { MultiplyStep } from '../../algorithms/multiplyStringsIntuitive';
import { HelpCircle, CheckCircle2 } from 'lucide-react';

interface MultiplyStringsViewerProps {
  step: MultiplyStep;
}

export const MultiplyStringsViewer: React.FC<MultiplyStringsViewerProps> = ({ step }) => {
  return (
    <div className="flex flex-col h-full gap-3 p-4 select-none">
      {/* Top Status & Variable Badges */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
        <div className="bg-slate-900 border border-slate-800 rounded-xl p-3 flex flex-col justify-center">
          <span className="text-xs text-slate-400 font-medium">Digits Pair</span>
          <span className="text-base font-mono font-bold text-sky-400">
            {step.i1 >= 0 && step.i2 >= 0 ? `${step.digit1} × ${step.digit2}` : '—'}
          </span>
        </div>
        <div className="bg-slate-900 border border-slate-800 rounded-xl p-3 flex flex-col justify-center">
          <span className="text-xs text-slate-400 font-medium">Product</span>
          <span className="text-2xl font-mono font-black text-amber-300">
            {step.product}
          </span>
        </div>
        <div className="bg-slate-900 border border-slate-800 rounded-xl p-3 flex flex-col justify-center">
          <span className="text-xs text-slate-400 font-medium">Target Column</span>
          <span className="text-base font-mono font-bold text-indigo-300">
            {step.i1 >= 0 && step.i2 >= 0 ? `col ${step.i1 + step.i2}` : '—'}
          </span>
        </div>
        <div className="bg-slate-900 border border-slate-800 rounded-xl p-3 flex flex-col justify-center">
          <span className="text-xs text-slate-400 font-medium">Product Output</span>
          <span className="text-xl font-mono font-black text-emerald-400 truncate">
            {step.resArray.slice().reverse().join('').replace(/^0+(?!$)/, '') || '0'}
          </span>
        </div>
      </div>

      {/* Main Column Arithmetic Canvas */}
      <div className="flex-1 bg-slate-900/60 border border-slate-800 rounded-xl p-6 flex flex-col justify-between items-center gap-6 relative overflow-hidden">
        {/* Alignment header */}
        <div className="flex flex-col items-center gap-2">
          <div className="text-xs font-semibold text-slate-400 uppercase tracking-wider">
            Grade-School Column Multiplication
          </div>
          <div className="flex items-center gap-4 bg-slate-950 px-6 py-3 rounded-2xl border border-slate-800 font-mono text-xl font-bold">
            <span className="text-sky-300">{step.num1Str}</span>
            <span className="text-slate-500">×</span>
            <span className="text-purple-300">{step.num2Str}</span>
          </div>
        </div>

        {/* Accumulator column array */}
        <div className="w-full max-w-2xl flex flex-col gap-2">
          <div className="text-xs font-semibold text-slate-400 uppercase tracking-wider flex items-center justify-between">
            <span>Result Columns Array (Reversed order: col 0 on right)</span>
          </div>
          <div className="flex items-center gap-2 justify-center flex-wrap">
            {step.resArray.map((val, idx) => {
              const isActiveCol = step.i1 >= 0 && step.i2 >= 0 && (idx === step.i1 + step.i2 || idx === step.i1 + step.i2 + 1);

              return (
                <div key={idx} className="flex flex-col items-center gap-1">
                  <div
                    className={`w-12 h-14 md:w-14 md:h-16 rounded-xl border-2 flex flex-col items-center justify-center font-mono transition-all duration-200 ${
                      isActiveCol
                        ? 'bg-amber-600 border-amber-300 text-white shadow-lg shadow-amber-500/30 scale-105'
                        : 'bg-slate-950 border-slate-800 text-slate-200'
                    }`}
                  >
                    <span className="text-xl md:text-2xl font-black">{val}</span>
                  </div>
                  <span className="text-[10px] font-mono text-slate-400">col {idx}</span>
                </div>
              );
            })}
          </div>
        </div>

        {/* Bottom Explanation Banner */}
        <div className="w-full bg-slate-950/80 border border-slate-800/80 rounded-xl px-4 py-2.5 text-xs text-slate-300 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <HelpCircle className="w-4 h-4 text-indigo-400 shrink-0" />
            <span>{step.explanation}</span>
          </div>
          {step.i1 >= step.num1Str.length && (
            <span className="text-emerald-400 font-semibold flex items-center gap-1 shrink-0">
              <CheckCircle2 className="w-4 h-4" /> Multiplied
            </span>
          )}
        </div>
      </div>
    </div>
  );
};
