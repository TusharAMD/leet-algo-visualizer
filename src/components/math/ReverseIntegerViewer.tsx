import React from 'react';
import type { ReverseIntegerStep } from '../../algorithms/reverseIntegerIntuitive';
import { HelpCircle, CheckCircle2, AlertTriangle } from 'lucide-react';

interface ReverseIntegerViewerProps {
  step: ReverseIntegerStep;
  originalX: number;
}

export const ReverseIntegerViewer: React.FC<ReverseIntegerViewerProps> = ({
  step,
  originalX,
}) => {
  return (
    <div className="flex flex-col h-full gap-3 p-4 select-none">
      {/* Top Status & Variable Badges */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
        <div className="bg-slate-900 border border-slate-800 rounded-xl p-3 flex flex-col justify-center">
          <span className="text-xs text-slate-400 font-medium">Extracted Digit</span>
          <span className="text-base font-mono font-bold text-sky-400">
            {step.extractedDigit >= 0 ? `digit = ${step.extractedDigit}` : '—'}
          </span>
        </div>
        <div className="bg-slate-900 border border-slate-800 rounded-xl p-3 flex flex-col justify-center">
          <span className="text-xs text-slate-400 font-medium">Accumulator (res)</span>
          <span className="text-2xl font-mono font-black text-amber-300">
            {step.accumulator}
          </span>
        </div>
        <div className="bg-slate-900 border border-slate-800 rounded-xl p-3 flex flex-col justify-center">
          <span className="text-xs text-slate-400 font-medium">32-Bit Bound Status</span>
          <span
            className={`text-sm font-semibold flex items-center gap-1 ${
              step.overflowDetected ? 'text-rose-400' : 'text-emerald-400'
            }`}
          >
            {step.overflowDetected ? (
              <><AlertTriangle className="w-4 h-4 text-rose-400" /> Overflow! Return 0</>
            ) : (
              'Within [-2³¹, 2³¹ - 1]'
            )}
          </span>
        </div>
        <div className="bg-slate-900 border border-slate-800 rounded-xl p-3 flex flex-col justify-center">
          <span className="text-xs text-slate-400 font-medium">Remaining x</span>
          <span className="text-base font-mono font-bold text-indigo-300">
            {step.xRemaining}
          </span>
        </div>
      </div>

      {/* Main Digit Pipeline Canvas */}
      <div className="flex-1 bg-slate-900/60 border border-slate-800 rounded-xl p-6 flex flex-col justify-between items-center gap-6 relative overflow-hidden">
        {/* Source and Reversed Comparison */}
        <div className="w-full max-w-xl flex flex-col items-center gap-4">
          <div className="text-xs font-semibold text-slate-400 uppercase tracking-wider">
            32-bit Integer Digit Pipeline
          </div>

          <div className="w-full bg-slate-950 border border-slate-800 rounded-2xl p-5 flex flex-col gap-4 shadow-xl">
            <div className="flex items-center justify-between border-b border-slate-800 pb-3">
              <span className="text-xs text-slate-400">Original Value:</span>
              <span className="font-mono text-xl font-bold text-sky-400">{originalX}</span>
            </div>

            <div className="flex items-center justify-between border-b border-slate-800 pb-3">
              <span className="text-xs text-slate-400">Reversal Formula:</span>
              <span className="font-mono text-sm text-indigo-300">
                res = res * 10 + digit
              </span>
            </div>

            <div className="flex items-center justify-between">
              <span className="text-xs text-slate-400">Accumulated Output:</span>
              <span className="font-mono text-2xl font-black text-emerald-400">
                {step.overflowDetected ? '0 (Clamped)' : `${step.sign < 0 ? '-' : ''}${step.accumulator}`}
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
          {step.isComplete && (
            <span
              className={`font-semibold flex items-center gap-1 shrink-0 ${
                step.overflowDetected ? 'text-rose-400' : 'text-emerald-400'
              }`}
            >
              {step.overflowDetected ? (
                <><AlertTriangle className="w-4 h-4" /> Overflow Clamped</>
              ) : (
                <><CheckCircle2 className="w-4 h-4" /> Reversed: {step.sign * step.accumulator}</>
              )}
            </span>
          )}
        </div>
      </div>
    </div>
  );
};
