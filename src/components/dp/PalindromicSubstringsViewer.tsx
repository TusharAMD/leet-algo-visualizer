import React from 'react';
import type { PalindromicSubstringsStep } from '../../algorithms/palindromicSubstringsIntuitive';

interface PalindromicSubstringsViewerProps {
  step: PalindromicSubstringsStep;
  s: string;
}

export const PalindromicSubstringsViewer: React.FC<PalindromicSubstringsViewerProps> = ({
  step,
  s,
}) => {
  return (
    <div className="flex flex-col h-full gap-4 p-4 select-none">
      {/* Top Status & Variable Badges */}
      <div className="grid grid-cols-2 md:grid-cols-5 gap-3">
        <div className="bg-slate-900 border border-slate-800 rounded-xl p-3 flex flex-col justify-center">
          <span className="text-xs text-slate-400 font-medium">Center Type</span>
          <span className="text-sm font-bold text-amber-400 capitalize">
            {step.centerType} Center
          </span>
        </div>
        <div className="bg-slate-900 border border-slate-800 rounded-xl p-3 flex flex-col justify-center">
          <span className="text-xs text-slate-400 font-medium">Center Index</span>
          <span className="text-sm font-mono font-bold text-sky-400">
            {step.centerType === 'odd' ? `i = ${step.currentCenter}` : `between ${step.currentCenter} & ${step.currentCenter + 1}`}
          </span>
        </div>
        <div className="bg-slate-900 border border-slate-800 rounded-xl p-3 flex flex-col justify-center">
          <span className="text-xs text-slate-400 font-medium">Pointers (L, R)</span>
          <span className="text-sm font-mono font-bold text-indigo-300">
            [{step.left}, {step.right}]
          </span>
        </div>
        <div className="bg-slate-900 border border-slate-800 rounded-xl p-3 flex flex-col justify-center">
          <span className="text-xs text-slate-400 font-medium">Match Status</span>
          <span className={`text-sm font-bold ${step.match ? 'text-emerald-400' : 'text-rose-400'}`}>
            {step.match ? 'Match ✓' : 'Mismatch ✗'}
          </span>
        </div>
        <div className="bg-slate-900 border border-slate-800 rounded-xl p-3 flex flex-col justify-center">
          <span className="text-xs text-slate-400 font-medium">Total Count</span>
          <span className="text-xl font-extrabold text-emerald-400">
            {step.totalCount}
          </span>
        </div>
      </div>

      {/* Main String Visualizer */}
      <div className="flex-1 bg-slate-900/60 border border-slate-800 rounded-xl p-6 flex flex-col items-center justify-center relative overflow-hidden">
        <div className="text-xs font-semibold text-slate-400 mb-6 uppercase tracking-wider">
          Expanding around center to discover palindromes
        </div>

        <div className="flex items-center gap-2 flex-wrap justify-center">
          {s.split('').map((char, idx) => {
            const isLeft = idx === step.left;
            const isRight = idx === step.right;
            const isHighlighted = step.highlightedIndices.includes(idx);
            const isCenterOdd = step.centerType === 'odd' && idx === step.currentCenter;

            let borderColor = 'border-slate-700';
            let bgColor = 'bg-slate-800/80';
            let textColor = 'text-slate-200';

            if (isHighlighted) {
              borderColor = 'border-emerald-500 shadow-lg shadow-emerald-500/20';
              bgColor = 'bg-emerald-950/60';
              textColor = 'text-emerald-300';
            } else if ((isLeft || isRight) && !step.match) {
              borderColor = 'border-rose-500 shadow-lg shadow-rose-500/20';
              bgColor = 'bg-rose-950/60';
              textColor = 'text-rose-300';
            }

            return (
              <div key={idx} className="flex flex-col items-center gap-1.5">
                <span className="text-[10px] font-mono text-slate-500">{idx}</span>
                <div
                  className={`relative w-12 h-14 rounded-lg border-2 flex items-center justify-center font-mono text-xl font-bold transition-all duration-200 ${bgColor} ${borderColor} ${textColor}`}
                >
                  {char}
                  {isCenterOdd && (
                    <span className="absolute -top-2 px-1 rounded bg-amber-500/90 text-slate-950 text-[9px] font-bold">
                      C
                    </span>
                  )}
                  {isLeft && (
                    <span className="absolute -bottom-2 -left-1 px-1 rounded bg-indigo-600 text-white text-[9px] font-bold">
                      L
                    </span>
                  )}
                  {isRight && (
                    <span className="absolute -bottom-2 -right-1 px-1 rounded bg-purple-600 text-white text-[9px] font-bold">
                      R
                    </span>
                  )}
                </div>
              </div>
            );
          })}
        </div>

        {/* Current Active Substring Display */}
        {step.activeSubstring && (
          <div className="mt-8 flex items-center gap-3 bg-slate-950/70 border border-slate-800 px-4 py-2 rounded-xl">
            <span className="text-xs text-slate-400">Inspecting Substring:</span>
            <span className="font-mono text-base font-bold text-amber-300">
              "{step.activeSubstring}"
            </span>
            <span className={`text-xs px-2 py-0.5 rounded font-semibold ${step.match ? 'bg-emerald-500/20 text-emerald-400' : 'bg-rose-500/20 text-rose-400'}`}>
              {step.match ? 'Palindrome!' : 'Not a Palindrome'}
            </span>
          </div>
        )}
      </div>

      {/* Found Palindromes List */}
      <div className="bg-slate-900 border border-slate-800 rounded-xl p-4 max-h-36 overflow-y-auto">
        <div className="flex items-center justify-between mb-2">
          <span className="text-xs font-semibold text-slate-400 uppercase tracking-wide">
            Collected Palindromic Substrings ({step.foundPalindromes.length})
          </span>
        </div>
        <div className="flex flex-wrap gap-2">
          {step.foundPalindromes.length === 0 ? (
            <span className="text-xs text-slate-500 italic">None yet...</span>
          ) : (
            step.foundPalindromes.map((pal, idx) => (
              <span
                key={idx}
                className="font-mono text-xs font-medium px-2.5 py-1 rounded bg-emerald-950/60 border border-emerald-800/60 text-emerald-300"
              >
                "{pal}"
              </span>
            ))
          )}
        </div>
      </div>

      {/* Step Explanation */}
      <div className="bg-slate-950 border border-slate-800 rounded-xl p-3 text-sm text-slate-300 flex items-center gap-2">
        <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse shrink-0" />
        <span>{step.explanation}</span>
      </div>
    </div>
  );
};
