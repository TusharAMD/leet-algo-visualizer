import React from 'react';
import type { DecodeWaysStep } from '../../algorithms/decodeWaysIntuitive';

interface DecodeWaysViewerProps {
  step: DecodeWaysStep;
  s: string;
}

export const DecodeWaysViewer: React.FC<DecodeWaysViewerProps> = ({
  step,
  s,
}) => {
  return (
    <div className="flex flex-col h-full gap-4 p-4 select-none">
      {/* Top Status & Variable Badges */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
        <div className="bg-slate-900 border border-slate-800 rounded-xl p-3 flex flex-col justify-center">
          <span className="text-xs text-slate-400 font-medium">Prefix Length i</span>
          <span className="text-base font-mono font-bold text-sky-400">
            i = {step.i} / {s.length}
          </span>
        </div>
        <div className="bg-slate-900 border border-slate-800 rounded-xl p-3 flex flex-col justify-center">
          <span className="text-xs text-slate-400 font-medium">1-Digit Option</span>
          <span className={`text-sm font-mono font-bold ${step.oneDigitValid ? 'text-emerald-400' : 'text-slate-500'}`}>
            {step.oneDigitVal ? `'${step.oneDigitVal}' (${step.oneDigitValid ? 'Valid' : 'Invalid'})` : '—'}
          </span>
        </div>
        <div className="bg-slate-900 border border-slate-800 rounded-xl p-3 flex flex-col justify-center">
          <span className="text-xs text-slate-400 font-medium">2-Digit Option</span>
          <span className={`text-sm font-mono font-bold ${step.twoDigitValid ? 'text-emerald-400' : 'text-slate-500'}`}>
            {step.twoDigitVal ? `"${step.twoDigitVal}" (${step.twoDigitValid ? 'Valid' : 'Invalid'})` : '—'}
          </span>
        </div>
        <div className="bg-slate-900 border border-slate-800 rounded-xl p-3 flex flex-col justify-center">
          <span className="text-xs text-slate-400 font-medium">Current dp[i]</span>
          <span className="text-xl font-extrabold text-amber-400">
            {step.dp[step.i] ?? 0}
          </span>
        </div>
      </div>

      {/* Digits and DP Array Visualization */}
      <div className="flex-1 bg-slate-900/60 border border-slate-800 rounded-xl p-6 flex flex-col justify-center items-center gap-8 relative overflow-hidden">
        {/* String Characters */}
        <div className="flex flex-col items-center gap-2">
          <div className="text-xs font-semibold text-slate-400 uppercase tracking-wider">
            Input Digits
          </div>
          <div className="flex items-center gap-3">
            {s.split('').map((char, idx) => {
              const isHighlight = step.highlightedIndices.includes(idx);
              return (
                <div key={idx} className="flex flex-col items-center gap-1">
                  <span className="text-[10px] font-mono text-slate-500">idx {idx}</span>
                  <div
                    className={`w-12 h-14 rounded-xl border-2 flex items-center justify-center font-mono text-xl font-bold transition-all duration-200 ${
                      isHighlight
                        ? 'border-sky-500 bg-sky-950/60 text-sky-200 scale-105 shadow-lg shadow-sky-500/20'
                        : 'border-slate-700 bg-slate-800/80 text-slate-300'
                    }`}
                  >
                    {char}
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* DP Array */}
        <div className="flex flex-col items-center gap-2">
          <div className="text-xs font-semibold text-slate-400 uppercase tracking-wider">
            DP Table: dp[k] (Number of decodings for prefix of length k)
          </div>
          <div className="flex items-center gap-2 flex-wrap justify-center">
            {step.dp.map((val, idx) => {
              const isCurrent = idx === step.i;
              const isPrev1 = idx === step.i - 1 && step.oneDigitValid;
              const isPrev2 = idx === step.i - 2 && step.twoDigitValid;

              let border = 'border-slate-800';
              let bg = 'bg-slate-950/60';
              let text = 'text-slate-400';

              if (isCurrent) {
                border = 'border-amber-400 ring-2 ring-amber-400/30';
                bg = 'bg-amber-950/60';
                text = 'text-amber-300';
              } else if (isPrev1 || isPrev2) {
                border = 'border-emerald-500/80';
                bg = 'bg-emerald-950/40';
                text = 'text-emerald-300';
              }

              return (
                <div key={idx} className="flex flex-col items-center gap-1">
                  <span className="text-[10px] font-mono text-slate-500">dp[{idx}]</span>
                  <div
                    className={`w-12 h-12 rounded-lg border flex items-center justify-center font-mono text-base font-bold transition-all duration-200 ${border} ${bg} ${text}`}
                  >
                    {val}
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Decoder Helper Mapping */}
        <div className="bg-slate-950/80 border border-slate-800 rounded-xl px-4 py-2.5 flex items-center gap-6 text-xs text-slate-400">
          <div className="flex items-center gap-1.5">
            <span className="font-semibold text-slate-300">Rule 1:</span>
            <span>Single digit '1'-'9' &rarr; maps to 'A'-'I' (+dp[i-1])</span>
          </div>
          <div className="flex items-center gap-1.5">
            <span className="font-semibold text-slate-300">Rule 2:</span>
            <span>Two digits '10'-'26' &rarr; maps to 'J'-'Z' (+dp[i-2])</span>
          </div>
        </div>
      </div>

      {/* Step Explanation */}
      <div className="bg-slate-950 border border-slate-800 rounded-xl p-3 text-sm text-slate-300 flex items-center gap-2">
        <span className="w-2 h-2 rounded-full bg-sky-400 animate-pulse shrink-0" />
        <span>{step.activeExplanation}</span>
      </div>
    </div>
  );
};
