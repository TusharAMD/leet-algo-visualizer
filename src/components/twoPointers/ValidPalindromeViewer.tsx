import React from 'react';
import { ValidPalindromeStep } from '../../algorithms/validPalindromeIntuitive';
import { ArrowLeftRight, CheckCircle2, AlertTriangle, ShieldCheck, Zap } from 'lucide-react';

interface ValidPalindromeViewerProps {
  step: ValidPalindromeStep;
}

export const ValidPalindromeViewer: React.FC<ValidPalindromeViewerProps> = ({ step }) => {
  const { rawStr, left, right, isMatch, action, isComplete, isValid } = step;

  const chars = Array.from(rawStr);

  return (
    <div className="flex-1 min-h-0 flex flex-col bg-slate-900/60 border border-slate-800 rounded-2xl p-3 shadow-xl overflow-hidden justify-between">
      {/* Top Banner */}
      <div className="bg-slate-950/70 border border-slate-800/80 rounded-xl p-2.5 flex items-center justify-between shrink-0">
        <div className="flex items-center gap-2">
          <span className="p-1.5 rounded-lg bg-cyan-500/10 text-cyan-400 border border-cyan-500/20">
            <ArrowLeftRight className="w-4 h-4" />
          </span>
          <div>
            <h3 className="text-xs font-semibold text-white tracking-wide">{step.headline}</h3>
            <p className="text-[11px] text-slate-400">{step.subtext}</p>
          </div>
        </div>
        <div className="flex items-center gap-2">
          {isComplete ? (
            isValid ? (
              <span className="px-2 py-0.5 rounded-md bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 text-[11px] font-semibold flex items-center gap-1">
                <ShieldCheck className="w-3.5 h-3.5" /> Valid Palindrome (True)
              </span>
            ) : (
              <span className="px-2 py-0.5 rounded-md bg-rose-500/10 border border-rose-500/20 text-rose-400 text-[11px] font-semibold flex items-center gap-1">
                <AlertTriangle className="w-3.5 h-3.5" /> Not a Palindrome (False)
              </span>
            )
          ) : (
            <span className="px-2 py-0.5 rounded-md bg-cyan-500/10 border border-cyan-500/20 text-cyan-400 text-[11px] font-mono">
              Step {step.stepIndex + 1} / {step.totalSteps}
            </span>
          )}
        </div>
      </div>

      {/* Main Visual Arena */}
      <div className="flex-1 min-h-0 flex flex-col justify-around gap-3 py-2 px-3">
        {/* String Visualization with Pointers */}
        <div className="flex flex-col gap-2">
          <span className="text-[10px] uppercase font-mono font-bold tracking-wider text-slate-400">
            Characters & Inward Pointers:
          </span>

          <div className="flex items-center justify-center gap-1.5 overflow-x-auto py-4 bg-slate-950/60 rounded-xl border border-slate-800/80 px-4">
            {chars.map((ch, idx) => {
              const isLeft = left === idx;
              const isRight = right === idx;
              const isPointersCoincide = isLeft && isRight;
              const isAlphanumeric = /^[a-z0-9]$/i.test(ch);

              let boxStyle = isAlphanumeric
                ? 'bg-slate-900 border-slate-700 text-slate-200'
                : 'bg-slate-950/40 border-dashed border-slate-800 text-slate-600';

              if (isLeft || isRight) {
                if (action === 'FAIL') {
                  boxStyle = 'bg-rose-500/20 border-rose-500 text-rose-300 font-bold scale-110 shadow-lg shadow-rose-500/20';
                } else if (action === 'COMPARE') {
                  boxStyle = 'bg-emerald-500/20 border-emerald-500 text-emerald-300 font-bold scale-110 shadow-lg shadow-emerald-500/20';
                } else if (action === 'SKIP_LEFT' || action === 'SKIP_RIGHT') {
                  boxStyle = 'bg-amber-500/20 border-amber-500 text-amber-300 font-bold scale-105';
                } else {
                  boxStyle = 'bg-cyan-500/20 border-cyan-500 text-cyan-300 font-bold scale-110';
                }
              }

              return (
                <div key={idx} className="flex flex-col items-center gap-1 shrink-0">
                  {/* Top Pointer Indicator */}
                  <div className="h-4 flex items-center justify-center text-[10px] font-mono font-bold">
                    {isPointersCoincide ? (
                      <span className="text-purple-400">L & R</span>
                    ) : isLeft ? (
                      <span className="text-cyan-400">L →</span>
                    ) : isRight ? (
                      <span className="text-amber-400">← R</span>
                    ) : null}
                  </div>

                  {/* Character Box */}
                  <div
                    className={`w-9 h-10 rounded-lg flex items-center justify-center font-mono text-sm border transition-all ${boxStyle}`}
                  >
                    {ch === ' ' ? '␣' : ch}
                  </div>

                  {/* Index */}
                  <span className="text-[9px] font-mono text-slate-500">{idx}</span>
                </div>
              );
            })}
          </div>
        </div>

        {/* Comparison Radar Box */}
        <div className="bg-slate-950/60 border border-slate-800/80 rounded-xl p-3 flex items-center justify-around">
          {/* Left Pointer Value */}
          <div className="flex flex-col items-center">
            <span className="text-[10px] uppercase font-mono text-cyan-400 font-semibold">Left Pointer (idx {left})</span>
            <div className="w-12 h-12 mt-1 rounded-xl bg-cyan-500/10 border border-cyan-500/30 flex items-center justify-center text-lg font-mono font-bold text-cyan-300">
              {chars[left] ?? '-'}
            </div>
          </div>

          {/* Squeeze Comparator */}
          <div className="flex flex-col items-center gap-1">
            <span className="text-[10px] font-mono text-slate-400">Lowercase Compare:</span>
            {isMatch === true ? (
              <span className="px-3 py-1 rounded-lg bg-emerald-500/20 border border-emerald-400 text-emerald-300 font-bold text-xs flex items-center gap-1">
                <CheckCircle2 className="w-3.5 h-3.5" /> EQUAL
              </span>
            ) : isMatch === false ? (
              <span className="px-3 py-1 rounded-lg bg-rose-500/20 border border-rose-400 text-rose-300 font-bold text-xs flex items-center gap-1">
                <AlertTriangle className="w-3.5 h-3.5" /> MISMATCH
              </span>
            ) : (
              <span className="px-3 py-1 rounded-lg bg-slate-800 border border-slate-700 text-slate-400 font-mono text-xs">
                Inward Squeeze
              </span>
            )}
          </div>

          {/* Right Pointer Value */}
          <div className="flex flex-col items-center">
            <span className="text-[10px] uppercase font-mono text-amber-400 font-semibold">Right Pointer (idx {right})</span>
            <div className="w-12 h-12 mt-1 rounded-xl bg-amber-500/10 border border-amber-500/30 flex items-center justify-center text-lg font-mono font-bold text-amber-300">
              {chars[right] ?? '-'}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
