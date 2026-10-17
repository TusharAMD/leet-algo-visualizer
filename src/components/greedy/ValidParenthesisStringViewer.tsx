import React from 'react';
import type { ValidParenthesisStep } from '../../algorithms/validParenthesisStringIntuitive';
import { CheckCircle2, XCircle, HelpCircle } from 'lucide-react';

interface ValidParenthesisStringViewerProps {
  step: ValidParenthesisStep;
  s: string;
}

export const ValidParenthesisStringViewer: React.FC<ValidParenthesisStringViewerProps> = ({
  step,
  s,
}) => {
  const maxRange = Math.max(s.length, 5);

  return (
    <div className="flex flex-col h-full gap-3 p-4 select-none">
      {/* Top Status & Variable Badges */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
        <div className="bg-slate-900 border border-slate-800 rounded-xl p-3 flex flex-col justify-center">
          <span className="text-xs text-slate-400 font-medium">Scanning Char</span>
          <span className="text-base font-mono font-bold text-sky-400">
            {step.index >= 0 && step.index < s.length ? `idx ${step.index}: '${step.char}'` : '—'}
          </span>
        </div>
        <div className="bg-slate-900 border border-slate-800 rounded-xl p-3 flex flex-col justify-center">
          <span className="text-xs text-slate-400 font-medium">Min Open (cmin)</span>
          <span className="text-base font-mono font-bold text-emerald-400">
            {step.cmin}
          </span>
        </div>
        <div className="bg-slate-900 border border-slate-800 rounded-xl p-3 flex flex-col justify-center">
          <span className="text-xs text-slate-400 font-medium">Max Open (cmax)</span>
          <span className="text-base font-mono font-bold text-purple-400">
            {step.cmax}
          </span>
        </div>
        <div className="bg-slate-900 border border-slate-800 rounded-xl p-3 flex flex-col justify-center">
          <span className="text-xs text-slate-400 font-medium">Status</span>
          <div className="flex items-center gap-1.5 mt-0.5">
            {step.isComplete ? (
              step.result ? (
                <span className="text-sm font-bold text-emerald-400 flex items-center gap-1">
                  <CheckCircle2 className="w-4 h-4" /> Valid
                </span>
              ) : (
                <span className="text-sm font-bold text-rose-400 flex items-center gap-1">
                  <XCircle className="w-4 h-4" /> Invalid
                </span>
              )
            ) : !step.isValidSoFar ? (
              <span className="text-sm font-bold text-rose-400 flex items-center gap-1">
                <XCircle className="w-4 h-4" /> Too many ')'
              </span>
            ) : (
              <span className="text-sm font-bold text-sky-400">Tracking Range</span>
            )}
          </div>
        </div>
      </div>

      {/* Main String & Range Gauge Visual */}
      <div className="flex-1 bg-slate-900/60 border border-slate-800 rounded-xl p-5 flex flex-col justify-between items-center gap-4 relative overflow-hidden">
        {/* Character Stream */}
        <div className="w-full flex flex-col items-center gap-2">
          <div className="text-xs font-semibold text-slate-400 uppercase tracking-wider">
            Parenthesis String Characters
          </div>
          <div className="flex items-center gap-2 flex-wrap justify-center max-w-full">
            {s.split('').map((ch, idx) => {
              const isCurrent = idx === step.index;
              const isPast = idx < step.index;

              let charColor = 'text-slate-300';
              let charBg = 'bg-slate-800/80 border-slate-700';

              if (ch === '(') {
                charColor = 'text-sky-300';
                charBg = isCurrent ? 'bg-sky-950/80 border-sky-400 shadow-md shadow-sky-500/20' : 'bg-sky-950/30 border-sky-800/50';
              } else if (ch === ')') {
                charColor = 'text-amber-300';
                charBg = isCurrent ? 'bg-amber-950/80 border-amber-400 shadow-md shadow-amber-500/20' : 'bg-amber-950/30 border-amber-800/50';
              } else if (ch === '*') {
                charColor = 'text-purple-300';
                charBg = isCurrent ? 'bg-purple-950/80 border-purple-400 shadow-md shadow-purple-500/20' : 'bg-purple-950/30 border-purple-800/50';
              }

              return (
                <div
                  key={idx}
                  className={`flex flex-col items-center transition-all duration-200 ${
                    isCurrent ? 'scale-110 -translate-y-1' : isPast ? 'opacity-70' : 'opacity-40'
                  }`}
                >
                  <div
                    className={`w-11 h-12 rounded-xl flex items-center justify-center font-mono text-xl font-bold border-2 ${charBg} ${charColor}`}
                  >
                    {ch}
                  </div>
                  <span className="text-[10px] font-mono text-slate-400 mt-1">{idx}</span>
                </div>
              );
            })}
          </div>
        </div>

        {/* Dynamic Bracket Balance Range Gauge */}
        <div className="w-full max-w-2xl bg-slate-950/70 border border-slate-800 rounded-xl p-4 flex flex-col gap-3">
          <div className="flex items-center justify-between text-xs text-slate-300">
            <span className="font-semibold flex items-center gap-1.5">
              <span>Feasible Open Parenthesis Balance Range:</span>
              <span className="font-mono text-indigo-400 text-sm font-bold">
                [{step.cmin} .. {step.cmax}]
              </span>
            </span>
            <span className="text-slate-400">Range of open '(' still needed to balance</span>
          </div>

          {/* Bar / Number Line */}
          <div className="relative h-12 bg-slate-900 rounded-lg border border-slate-800 flex items-center px-4 overflow-hidden">
            {/* Range highlight */}
            {step.cmax >= 0 && (
              <div
                className="absolute top-1 bottom-1 rounded-md bg-gradient-to-r from-emerald-500/30 via-indigo-500/30 to-purple-500/30 border border-indigo-400/50 transition-all duration-300"
                style={{
                  left: `${(Math.max(0, step.cmin) / maxRange) * 85 + 5}%`,
                  width: `${(Math.max(0, step.cmax - Math.max(0, step.cmin)) / maxRange) * 85 + 5}%`,
                }}
              />
            )}

            {/* Scale tick markers */}
            {Array.from({ length: Math.min(maxRange + 1, 10) }, (_, i) => (
              <div
                key={i}
                className="absolute flex flex-col items-center -translate-x-1/2"
                style={{ left: `${(i / maxRange) * 85 + 5}%` }}
              >
                <div
                  className={`w-0.5 h-3 ${
                    i >= step.cmin && i <= step.cmax
                      ? 'bg-indigo-400'
                      : 'bg-slate-700'
                  }`}
                />
                <span
                  className={`text-[10px] font-mono mt-1 ${
                    i === 0
                      ? 'font-bold text-emerald-400'
                      : i >= step.cmin && i <= step.cmax
                      ? 'text-indigo-200 font-semibold'
                      : 'text-slate-500'
                  }`}
                >
                  {i}
                </span>
              </div>
            ))}
          </div>

          <div className="flex items-center justify-between text-[11px] text-slate-400 pt-1">
            <span className="flex items-center gap-1">
              <span className="w-2 h-2 rounded-full bg-emerald-400"></span>
              <span>Target: balance = 0 at end</span>
            </span>
            <span>
              {step.cmin === 0 ? '✅ 0 is achievable in current range' : '⏳ 0 not yet in range'}
            </span>
          </div>
        </div>

        {/* Asterisk rule quick guide or branching clue */}
        <div className="w-full max-w-2xl grid grid-cols-3 gap-2 text-center text-xs">
          <div className="bg-sky-950/30 border border-sky-800/40 rounded-lg p-2">
            <span className="font-mono font-bold text-sky-400">'('</span>
            <div className="text-[11px] text-slate-300 mt-0.5">Increases both cmin & cmax by +1</div>
          </div>
          <div className="bg-amber-950/30 border border-amber-800/40 rounded-lg p-2">
            <span className="font-mono font-bold text-amber-400">')'</span>
            <div className="text-[11px] text-slate-300 mt-0.5">Decreases cmin (≥0) & cmax by -1</div>
          </div>
          <div className="bg-purple-950/30 border border-purple-800/40 rounded-lg p-2">
            <span className="font-mono font-bold text-purple-400">'*'</span>
            <div className="text-[11px] text-slate-300 mt-0.5">Can be ')' (cmin-1) or '(' (cmax+1)</div>
          </div>
        </div>

        {/* Explanation text */}
        <div className="w-full bg-slate-950/80 border border-slate-800/80 rounded-xl px-4 py-2.5 text-xs text-slate-300">
          <div className="flex items-center gap-2">
            <HelpCircle className="w-4 h-4 text-indigo-400 shrink-0" />
            <span>{step.explanation}</span>
          </div>
        </div>
      </div>
    </div>
  );
};
