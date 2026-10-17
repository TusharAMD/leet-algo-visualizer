import React from 'react';
import type { NumberOfOneBitsStep } from '../../algorithms/numberOfOneBitsIntuitive';
import { HelpCircle, CheckCircle2, Binary } from 'lucide-react';

interface NumberOfOneBitsViewerProps {
  step: NumberOfOneBitsStep;
  initialN: number;
}

export const NumberOfOneBitsViewer: React.FC<NumberOfOneBitsViewerProps> = ({
  step,
  initialN,
}) => {
  return (
    <div className="flex flex-col h-full gap-3 p-4 select-none">
      {/* Top Status & Variable Badges */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
        <div className="bg-slate-900 border border-slate-800 rounded-xl p-3 flex flex-col justify-center">
          <span className="text-xs text-slate-400 font-medium">Current n</span>
          <span className="text-base font-mono font-bold text-sky-400">
            {step.currentN}
          </span>
        </div>
        <div className="bg-slate-900 border border-slate-800 rounded-xl p-3 flex flex-col justify-center">
          <span className="text-xs text-slate-400 font-medium">Dropped Bit</span>
          <span className="text-base font-mono font-bold text-amber-300">
            {step.clearedBitPos >= 0 ? `Bit Pos ${step.clearedBitPos} (2^${step.clearedBitPos})` : '—'}
          </span>
        </div>
        <div className="bg-slate-900 border border-slate-800 rounded-xl p-3 flex flex-col justify-center">
          <span className="text-xs text-slate-400 font-medium">1-Bits Count (res)</span>
          <span className="text-2xl font-mono font-black text-emerald-400">
            {step.resCount}
          </span>
        </div>
        <div className="bg-slate-900 border border-slate-800 rounded-xl p-3 flex flex-col justify-center">
          <span className="text-xs text-slate-400 font-medium">Technique</span>
          <span className="text-xs font-semibold text-indigo-300 font-mono">
            n & (n - 1)
          </span>
        </div>
      </div>

      {/* Main 32-bit Register Canvas */}
      <div className="flex-1 bg-slate-900/60 border border-slate-800 rounded-xl p-6 flex flex-col justify-between items-center gap-6 relative overflow-hidden">
        <div className="w-full flex flex-col items-center gap-2">
          <div className="text-xs font-semibold text-slate-400 uppercase tracking-wider flex items-center gap-1.5">
            <Binary className="w-4 h-4 text-indigo-400" />
            <span>32-Bit Binary Register State</span>
          </div>

          {/* 32-bit blocks grid: 4 bytes of 8 bits */}
          <div className="grid grid-cols-8 md:grid-cols-16 gap-1.5 p-4 bg-slate-950 border border-slate-800 rounded-2xl max-w-2xl">
            {step.binaryString.split('').map((bit, idx) => {
              const bitPos = 31 - idx;
              const isOne = bit === '1';
              const wasJustCleared = step.clearedBitPos === bitPos;

              let bitStyle = 'bg-slate-900 border-slate-800 text-slate-600';
              if (wasJustCleared) {
                bitStyle = 'bg-rose-950/80 border-rose-500 text-rose-300 animate-pulse';
              } else if (isOne) {
                bitStyle = 'bg-emerald-950/90 border-emerald-500 text-emerald-200 shadow-sm';
              }

              return (
                <div key={idx} className="flex flex-col items-center">
                  <div
                    className={`w-8 h-10 rounded-lg border flex flex-col items-center justify-center font-mono text-sm font-bold transition-all ${bitStyle}`}
                  >
                    <span>{bit}</span>
                  </div>
                  <span className="text-[8px] font-mono text-slate-400 mt-0.5">{bitPos}</span>
                </div>
              );
            })}
          </div>
        </div>

        {/* Formula breakdown card */}
        <div className="w-full max-w-md bg-slate-950 border border-slate-800 rounded-xl p-3 flex items-center justify-around font-mono text-xs text-slate-300">
          <div>
            <span className="text-slate-400 block text-[10px]">Input:</span>
            <span className="font-bold text-sky-300">{initialN}</span>
          </div>
          <div>
            <span className="text-slate-400 block text-[10px]">Algorithm:</span>
            <span className="font-bold text-indigo-300">Kernighan's Bit Trick</span>
          </div>
          <div>
            <span className="text-slate-400 block text-[10px]">Hamming Weight:</span>
            <span className="font-bold text-emerald-300">{step.resCount} Bits</span>
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
              <CheckCircle2 className="w-4 h-4" /> Result: {step.resCount}
            </span>
          )}
        </div>
      </div>
    </div>
  );
};
