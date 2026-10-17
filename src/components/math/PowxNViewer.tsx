import React from 'react';
import type { PowStep } from '../../algorithms/powxNIntuitive';
import { HelpCircle, CheckCircle2, Zap } from 'lucide-react';

interface PowxNViewerProps {
  step: PowStep;
  initialX: number;
  initialN: number;
}

export const PowxNViewer: React.FC<PowxNViewerProps> = ({
  step,
  initialX,
  initialN,
}) => {
  return (
    <div className="flex flex-col h-full gap-3 p-4 select-none">
      {/* Top Status & Variable Badges */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
        <div className="bg-slate-900 border border-slate-800 rounded-xl p-3 flex flex-col justify-center">
          <span className="text-xs text-slate-400 font-medium">Exponent n (Remaining)</span>
          <span className="text-base font-mono font-bold text-sky-400">
            {step.nRemaining} (b: {step.nRemaining.toString(2)})
          </span>
        </div>
        <div className="bg-slate-900 border border-slate-800 rounded-xl p-3 flex flex-col justify-center">
          <span className="text-xs text-slate-400 font-medium">Current Multiplier (x^(2^k))</span>
          <span className="text-base font-mono font-bold text-indigo-300 truncate">
            {step.currentProduct.toFixed(4)}
          </span>
        </div>
        <div className="bg-slate-900 border border-slate-800 rounded-xl p-3 flex flex-col justify-center">
          <span className="text-xs text-slate-400 font-medium">Accumulator (res)</span>
          <span className="text-xl font-mono font-black text-amber-300 truncate">
            {step.result.toFixed(4)}
          </span>
        </div>
        <div className="bg-slate-900 border border-slate-800 rounded-xl p-3 flex flex-col justify-center">
          <span className="text-xs text-slate-400 font-medium">Bit Action</span>
          <span
            className={`text-sm font-semibold flex items-center gap-1 ${
              step.isBitOne ? 'text-amber-400' : 'text-slate-400'
            }`}
          >
            {step.isBitOne ? <><Zap className="w-4 h-4 text-amber-400" /> Bit=1 (Multiply res)</> : 'Bit=0 (Square only)'}
          </span>
        </div>
      </div>

      {/* Main Exponentiation Canvas */}
      <div className="flex-1 bg-slate-900/60 border border-slate-800 rounded-xl p-6 flex flex-col justify-between items-center gap-6 relative overflow-hidden">
        {/* Binary Bit decomposition breakdown */}
        <div className="w-full max-w-xl flex flex-col items-center gap-3">
          <div className="text-xs font-semibold text-slate-400 uppercase tracking-wider">
            Fast Binary Exponentiation: {initialX}^{initialN}
          </div>
          <div className="w-full bg-slate-950 border border-slate-800 rounded-2xl p-5 flex flex-col gap-4 shadow-lg">
            <div className="flex items-center justify-between border-b border-slate-800/80 pb-3">
              <span className="text-xs text-slate-400">Target Expression:</span>
              <span className="font-mono text-base font-bold text-indigo-300">
                {initialX}<sup>{initialN}</sup>
              </span>
            </div>
            <div className="flex items-center justify-between border-b border-slate-800/80 pb-3">
              <span className="text-xs text-slate-400">Current Base Power (curr):</span>
              <span className="font-mono text-base font-bold text-sky-400 truncate max-w-[280px]">
                {step.currentProduct.toFixed(6)}
              </span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-xs text-slate-400">Accumulated Result (res):</span>
              <span className="font-mono text-xl font-black text-emerald-400 truncate max-w-[280px]">
                {step.result.toFixed(6)}
              </span>
            </div>
          </div>
        </div>

        {/* Bottom Explanation Banner */}
        <div className="w-full bg-slate-950/80 border border-slate-800/80 rounded-xl px-4 py-2.5 text-xs text-slate-300 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <HelpCircle className="w-4 h-4 text-indigo-400 shrink-0" />
            <span>{step.explanation}</span>
          </div>
          {step.nRemaining === 0 && (
            <span className="text-emerald-400 font-semibold flex items-center gap-1 shrink-0">
              <CheckCircle2 className="w-4 h-4" /> Computed
            </span>
          )}
        </div>
      </div>
    </div>
  );
};
