import React from 'react';
import type { PlusOneStep } from '../../algorithms/plusOneIntuitive';
import { HelpCircle, CheckCircle2, ArrowLeft } from 'lucide-react';

interface PlusOneViewerProps {
  step: PlusOneStep;
}

export const PlusOneViewer: React.FC<PlusOneViewerProps> = ({ step }) => {
  return (
    <div className="flex flex-col h-full gap-3 p-4 select-none">
      {/* Top Status & Variable Badges */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
        <div className="bg-slate-900 border border-slate-800 rounded-xl p-3 flex flex-col justify-center">
          <span className="text-xs text-slate-400 font-medium">Scanning Index (Right-to-Left)</span>
          <span className="text-base font-mono font-bold text-sky-400">
            {step.currentIndex >= 0 ? `i = ${step.currentIndex}` : step.isComplete ? 'Done' : '—'}
          </span>
        </div>
        <div className="bg-slate-900 border border-slate-800 rounded-xl p-3 flex flex-col justify-center">
          <span className="text-xs text-slate-400 font-medium">Carry Ripple</span>
          <span
            className={`text-sm font-semibold flex items-center gap-1 ${
              step.carryPropagated ? 'text-amber-400' : 'text-slate-400'
            }`}
          >
            {step.carryPropagated ? <><ArrowLeft className="w-4 h-4 text-amber-400" /> Carry Leftwards</> : 'No Carry'}
          </span>
        </div>
        <div className="bg-slate-900 border border-slate-800 rounded-xl p-3 flex flex-col justify-center">
          <span className="text-xs text-slate-400 font-medium">Current Digits Count</span>
          <span className="text-2xl font-mono font-black text-indigo-400">
            {step.digits.length}
          </span>
        </div>
        <div className="bg-slate-900 border border-slate-800 rounded-xl p-3 flex flex-col justify-center">
          <span className="text-xs text-slate-400 font-medium">Resulting Integer</span>
          <span className="text-xl font-mono font-black text-emerald-400 truncate">
            {step.digits.join('')}
          </span>
        </div>
      </div>

      {/* Main Digits Row Canvas */}
      <div className="flex-1 bg-slate-900/60 border border-slate-800 rounded-xl p-6 flex flex-col justify-center items-center gap-6 relative overflow-hidden">
        <div className="text-xs font-semibold text-slate-400 uppercase tracking-wider">
          Digits Array with In-Place Ripple Increment
        </div>

        {/* Digits Blocks */}
        <div className="flex items-center gap-2 flex-wrap justify-center">
          {step.digits.map((digit, idx) => {
            const isCurrent = idx === step.currentIndex;
            const isNewPrepended = step.isComplete && step.currentIndex === -1 && idx === 0;

            let cardStyle = 'bg-slate-950 border-slate-800 text-slate-200';
            if (isNewPrepended) {
              cardStyle = 'bg-emerald-600 border-emerald-300 text-white shadow-lg shadow-emerald-500/30 scale-110 animate-bounce';
            } else if (isCurrent) {
              cardStyle = digit === 0
                ? 'bg-amber-600 border-amber-300 text-white shadow-lg shadow-amber-500/40 scale-110'
                : 'bg-emerald-600 border-emerald-300 text-white shadow-lg shadow-emerald-500/40 scale-110';
            }

            return (
              <div key={idx} className="flex flex-col items-center gap-1">
                <div
                  className={`w-14 h-16 md:w-16 md:h-20 rounded-2xl border-2 flex flex-col items-center justify-center font-mono transition-all duration-200 ${cardStyle}`}
                >
                  <span className="text-2xl md:text-3xl font-black">{digit}</span>
                </div>
                <span className="text-[10px] font-mono text-slate-400">idx {idx}</span>
              </div>
            );
          })}
        </div>

        {/* Bottom Explanation Banner */}
        <div className="w-full bg-slate-950/80 border border-slate-800/80 rounded-xl px-4 py-2.5 text-xs text-slate-300 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <HelpCircle className="w-4 h-4 text-indigo-400 shrink-0" />
            <span>{step.explanation}</span>
          </div>
          {step.isComplete && (
            <span className="text-emerald-400 font-semibold flex items-center gap-1 shrink-0">
              <CheckCircle2 className="w-4 h-4" /> Finished
            </span>
          )}
        </div>
      </div>
    </div>
  );
};
