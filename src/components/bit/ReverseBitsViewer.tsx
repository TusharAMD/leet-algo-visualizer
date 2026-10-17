import React from 'react';
import type { ReverseBitsStep } from '../../algorithms/reverseBitsIntuitive';
import { HelpCircle, CheckCircle2 } from 'lucide-react';

interface ReverseBitsViewerProps {
  step: ReverseBitsStep;
  initialN: number;
}

export const ReverseBitsViewer: React.FC<ReverseBitsViewerProps> = ({
  step,
  initialN,
}) => {
  return (
    <div className="flex flex-col h-full gap-3 p-4 select-none">
      {/* Top Status & Variable Badges */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
        <div className="bg-slate-900 border border-slate-800 rounded-xl p-3 flex flex-col justify-center">
          <span className="text-xs text-slate-400 font-medium">Extracting Bit</span>
          <span className="text-base font-mono font-bold text-sky-400">
            {step.bitIndex >= 0 ? `bit #${step.bitIndex} = ${step.extractedBit}` : '—'}
          </span>
        </div>
        <div className="bg-slate-900 border border-slate-800 rounded-xl p-3 flex flex-col justify-center">
          <span className="text-xs text-slate-400 font-medium">Target Position</span>
          <span className="text-base font-mono font-bold text-amber-300">
            {step.targetPos >= 0 ? `bit #${step.targetPos}` : '—'}
          </span>
        </div>
        <div className="bg-slate-900 border border-slate-800 rounded-xl p-3 flex flex-col justify-center">
          <span className="text-xs text-slate-400 font-medium">Reversed Value</span>
          <span className="text-xl font-mono font-black text-emerald-400 truncate">
            {step.currentRes}
          </span>
        </div>
        <div className="bg-slate-900 border border-slate-800 rounded-xl p-3 flex flex-col justify-center">
          <span className="text-xs text-slate-400 font-medium">Reversal Progress</span>
          <span className="text-base font-mono font-bold text-indigo-300">
            {step.bitIndex >= 0 ? `${step.bitIndex + 1} / 32 Bits` : '0 / 32'}
          </span>
        </div>
      </div>

      {/* Main Dual Register Canvas */}
      <div className="flex-1 bg-slate-900/60 border border-slate-800 rounded-xl p-6 flex flex-col justify-between items-center gap-5 relative overflow-hidden">
        {/* Register 1: Source */}
        <div className="w-full flex flex-col items-center gap-1.5">
          <div className="text-xs font-semibold text-sky-400 uppercase tracking-wider flex items-center justify-between w-full max-w-2xl">
            <span>Source Register: {initialN}</span>
            <span className="text-[11px] font-mono text-slate-400">Scanning LSB to MSB</span>
          </div>
          <div className="grid grid-cols-8 md:grid-cols-16 gap-1 p-3 bg-slate-950 border border-slate-800 rounded-xl max-w-2xl w-full">
            {step.inputBinary.split('').map((bit, idx) => {
              const bitPos = 31 - idx;
              const isCurrent = step.bitIndex === bitPos;

              return (
                <div key={idx} className="flex flex-col items-center">
                  <div
                    className={`w-7 h-8 rounded border flex items-center justify-center font-mono text-xs font-bold transition-all ${
                      isCurrent
                        ? 'bg-sky-600 border-sky-300 text-white shadow-md shadow-sky-500/40 scale-110 z-10'
                        : bit === '1'
                        ? 'bg-sky-950/40 border-sky-800 text-sky-200'
                        : 'bg-slate-900 border-slate-800 text-slate-600'
                    }`}
                  >
                    {bit}
                  </div>
                  <span className="text-[7px] font-mono text-slate-400">{bitPos}</span>
                </div>
              );
            })}
          </div>
        </div>

        {/* Register 2: Reversed Target */}
        <div className="w-full flex flex-col items-center gap-1.5">
          <div className="text-xs font-semibold text-emerald-400 uppercase tracking-wider flex items-center justify-between w-full max-w-2xl">
            <span>Reversed Target Register: {step.currentRes}</span>
            <span className="text-[11px] font-mono text-slate-400">Written MSB to LSB</span>
          </div>
          <div className="grid grid-cols-8 md:grid-cols-16 gap-1 p-3 bg-slate-950 border border-slate-800 rounded-xl max-w-2xl w-full">
            {step.resBinary.split('').map((bit, idx) => {
              const bitPos = 31 - idx;
              const isTarget = step.targetPos === bitPos;

              return (
                <div key={idx} className="flex flex-col items-center">
                  <div
                    className={`w-7 h-8 rounded border flex items-center justify-center font-mono text-xs font-bold transition-all ${
                      isTarget
                        ? 'bg-emerald-600 border-emerald-300 text-white shadow-md shadow-emerald-500/40 scale-110 z-10'
                        : bit === '1'
                        ? 'bg-emerald-950/40 border-emerald-800 text-emerald-200'
                        : 'bg-slate-900 border-slate-800 text-slate-600'
                    }`}
                  >
                    {bit}
                  </div>
                  <span className="text-[7px] font-mono text-slate-400">{bitPos}</span>
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
          {step.isComplete && (
            <span className="text-emerald-400 font-semibold flex items-center gap-1 shrink-0">
              <CheckCircle2 className="w-4 h-4" /> Reversal Done
            </span>
          )}
        </div>
      </div>
    </div>
  );
};
