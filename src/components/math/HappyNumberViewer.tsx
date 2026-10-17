import React from 'react';
import type { HappyNumberStep } from '../../algorithms/happyNumberIntuitive';
import { HelpCircle, CheckCircle2, XCircle, ArrowRight, Sparkles } from 'lucide-react';

interface HappyNumberViewerProps {
  step: HappyNumberStep;
}

export const HappyNumberViewer: React.FC<HappyNumberViewerProps> = ({ step }) => {
  return (
    <div className="flex flex-col h-full gap-3 p-4 select-none">
      {/* Top Status & Variable Badges */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
        <div className="bg-slate-900 border border-slate-800 rounded-xl p-3 flex flex-col justify-center">
          <span className="text-xs text-slate-400 font-medium">Current Value</span>
          <span className="text-2xl font-mono font-black text-sky-400">
            {step.currentNum}
          </span>
        </div>
        <div className="bg-slate-900 border border-slate-800 rounded-xl p-3 flex flex-col justify-center">
          <span className="text-xs text-slate-400 font-medium">Digit Squared Sum</span>
          <span className="text-base font-mono font-bold text-amber-300">
            {step.digits.map((d) => `${d}²`).join(' + ')} = {step.squareSum}
          </span>
        </div>
        <div className="bg-slate-900 border border-slate-800 rounded-xl p-3 flex flex-col justify-center">
          <span className="text-xs text-slate-400 font-medium">History Chain Length</span>
          <span className="text-2xl font-mono font-black text-indigo-400">
            {step.history.length}
          </span>
        </div>
        <div className="bg-slate-900 border border-slate-800 rounded-xl p-3 flex flex-col justify-center">
          <span className="text-xs text-slate-400 font-medium">Verdict</span>
          <div className="flex items-center gap-1.5 mt-0.5">
            {step.isHappy === true ? (
              <span className="text-sm font-bold text-emerald-400 flex items-center gap-1">
                <CheckCircle2 className="w-4 h-4" /> Happy Number! 🎉
              </span>
            ) : step.isHappy === false ? (
              <span className="text-sm font-bold text-rose-400 flex items-center gap-1">
                <XCircle className="w-4 h-4" /> Unhappy (Cycle)
              </span>
            ) : (
              <span className="text-sm font-bold text-sky-400 flex items-center gap-1">
                <Sparkles className="w-4 h-4" /> Calculating...
              </span>
            )}
          </div>
        </div>
      </div>

      {/* Main Calculation & Chain Canvas */}
      <div className="flex-1 bg-slate-900/60 border border-slate-800 rounded-xl p-5 flex flex-col justify-between items-center gap-4 relative overflow-hidden">
        {/* Digits Expansion Row */}
        <div className="flex flex-col items-center gap-3">
          <div className="text-xs font-semibold text-slate-400 uppercase tracking-wider">
            Digit Square Expansion for {step.currentNum}
          </div>
          <div className="flex items-center gap-3 flex-wrap justify-center">
            {step.digits.map((digit, idx) => (
              <div
                key={idx}
                className="flex flex-col items-center p-3 bg-slate-950 border border-slate-800 rounded-xl shadow-md min-w-[70px]"
              >
                <span className="text-2xl font-mono font-black text-slate-100">{digit}</span>
                <span className="text-xs font-mono text-amber-400 mt-1">{digit}² = {digit * digit}</span>
              </div>
            ))}
            <div className="flex items-center text-slate-400 font-bold px-1">=</div>
            <div className="flex flex-col items-center p-3 bg-indigo-950/80 border border-indigo-500 rounded-xl shadow-lg min-w-[80px]">
              <span className="text-2xl font-mono font-black text-indigo-200">{step.squareSum}</span>
              <span className="text-[10px] font-mono text-indigo-400 mt-1">Next Number</span>
            </div>
          </div>
        </div>

        {/* Number Sequence Trail */}
        <div className="w-full max-w-3xl flex flex-col gap-2">
          <div className="text-xs font-semibold text-slate-400 uppercase tracking-wider flex items-center justify-between">
            <span>Traversed State Trail</span>
            <span className="text-[11px] font-mono text-slate-400">
              {step.cycleDetected ? '⚠️ Repeating loop detected' : 'Tracking visited numbers'}
            </span>
          </div>
          <div className="flex items-center gap-2 overflow-x-auto p-3 bg-slate-950 border border-slate-800 rounded-xl min-h-[56px]">
            {step.history.map((val, idx) => {
              const isCurrent = idx === step.history.length - 1;
              const isTargetOne = val === 1;
              const isDuplicate = step.cycleDetected && isCurrent;

              let badgeStyle = 'bg-slate-900 border-slate-700 text-slate-300';
              if (isTargetOne) {
                badgeStyle = 'bg-emerald-600 border-emerald-300 text-white shadow-lg shadow-emerald-500/30 scale-105';
              } else if (isDuplicate) {
                badgeStyle = 'bg-rose-600 border-rose-300 text-white shadow-lg shadow-rose-500/30 animate-pulse';
              } else if (isCurrent) {
                badgeStyle = 'bg-sky-600 border-sky-300 text-white shadow-md';
              }

              return (
                <React.Fragment key={idx}>
                  <div
                    className={`px-3 py-1.5 rounded-lg border font-mono text-sm font-bold flex items-center justify-center shrink-0 transition-all ${badgeStyle}`}
                  >
                    <span>{val}</span>
                  </div>
                  {idx < step.history.length - 1 && (
                    <ArrowRight className="w-4 h-4 text-slate-600 shrink-0" />
                  )}
                </React.Fragment>
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
          {step.isHappy !== null && (
            <span
              className={`font-semibold flex items-center gap-1 shrink-0 ${
                step.isHappy ? 'text-emerald-400' : 'text-rose-400'
              }`}
            >
              {step.isHappy ? <CheckCircle2 className="w-4 h-4" /> : <XCircle className="w-4 h-4" />}
              {step.isHappy ? 'Happy (True)' : 'Cycle (False)'}
            </span>
          )}
        </div>
      </div>
    </div>
  );
};
