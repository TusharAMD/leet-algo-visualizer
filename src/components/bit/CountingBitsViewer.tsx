import React from 'react';
import type { CountingBitsStep } from '../../algorithms/countingBitsIntuitive';
import { HelpCircle, CheckCircle2, ArrowRight } from 'lucide-react';

interface CountingBitsViewerProps {
  step: CountingBitsStep;
  n: number;
}

export const CountingBitsViewer: React.FC<CountingBitsViewerProps> = ({ step, n }) => {
  return (
    <div className="flex flex-col h-full gap-3 p-4 select-none">
      {/* Top Status & Variable Badges */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
        <div className="bg-slate-900 border border-slate-800 rounded-xl p-3 flex flex-col justify-center">
          <span className="text-xs text-slate-400 font-medium">Computing Index</span>
          <span className="text-base font-mono font-bold text-sky-400">
            i = {step.currentI} (b: {step.currentI.toString(2)})
          </span>
        </div>
        <div className="bg-slate-900 border border-slate-800 rounded-xl p-3 flex flex-col justify-center">
          <span className="text-xs text-slate-400 font-medium">Shift Half: dp[i &gt;&gt; 1]</span>
          <span className="text-base font-mono font-bold text-indigo-300">
            dp[{step.halfI}] = {step.dpArray[step.halfI]}
          </span>
        </div>
        <div className="bg-slate-900 border border-slate-800 rounded-xl p-3 flex flex-col justify-center">
          <span className="text-xs text-slate-400 font-medium">LSB: (i &amp; 1)</span>
          <span className="text-base font-mono font-bold text-amber-300">
            +{step.lastBit}
          </span>
        </div>
        <div className="bg-slate-900 border border-slate-800 rounded-xl p-3 flex flex-col justify-center">
          <span className="text-xs text-slate-400 font-medium">Result dp[i]</span>
          <span className="text-2xl font-mono font-black text-emerald-400">
            {step.dpArray[step.currentI]}
          </span>
        </div>
      </div>

      {/* Main DP Array Canvas */}
      <div className="flex-1 bg-slate-900/60 border border-slate-800 rounded-xl p-6 flex flex-col justify-between items-center gap-6 relative overflow-hidden">
        {/* DP Array */}
        <div className="w-full flex flex-col items-center gap-2">
          <div className="text-xs font-semibold text-slate-400 uppercase tracking-wider flex items-center justify-between w-full max-w-2xl">
            <span>DP 1-Bit Counts Array (dp[0 .. {n}])</span>
            <span className="text-[11px] font-mono text-indigo-400">
              dp[i] = dp[i &gt;&gt; 1] + (i &amp; 1)
            </span>
          </div>
          <div className="flex items-center gap-2 flex-wrap justify-center max-w-2xl">
            {step.dpArray.map((val, idx) => {
              const isCurrent = idx === step.currentI;
              const isHalf = step.currentI > 0 && idx === step.halfI;
              const isFilled = idx <= step.currentI;

              let cardStyle = 'bg-slate-950 border-slate-800 text-slate-500 opacity-50';
              if (isCurrent) {
                cardStyle = 'bg-emerald-600 border-emerald-300 text-white shadow-lg shadow-emerald-500/40 scale-110 z-10';
              } else if (isHalf) {
                cardStyle = 'bg-indigo-950/80 border-indigo-400 text-indigo-200 shadow-md scale-105';
              } else if (isFilled) {
                cardStyle = 'bg-slate-900 border-slate-700 text-slate-200';
              }

              return (
                <div key={idx} className="flex flex-col items-center gap-1">
                  <div
                    className={`w-12 h-14 rounded-xl border-2 flex flex-col items-center justify-center font-mono transition-all duration-200 ${cardStyle}`}
                  >
                    <span className="text-lg font-black">{isFilled ? val : '?'}</span>
                    <span className="text-[8px] font-mono opacity-60">b:{idx.toString(2)}</span>
                  </div>
                  <span className="text-[10px] font-mono text-slate-400">i={idx}</span>
                </div>
              );
            })}
          </div>
        </div>

        {/* Formula Connection Banner */}
        {step.currentI > 0 && (
          <div className="flex items-center gap-3 bg-slate-950 px-5 py-2.5 rounded-xl border border-slate-800 font-mono text-xs">
            <span className="text-indigo-400">dp[{step.halfI}] ({step.dpArray[step.halfI]})</span>
            <span className="text-slate-500">+</span>
            <span className="text-amber-400">LSB ({step.lastBit})</span>
            <ArrowRight className="w-4 h-4 text-slate-600" />
            <span className="text-emerald-400 font-bold">dp[{step.currentI}] = {step.dpArray[step.currentI]}</span>
          </div>
        )}

        {/* Bottom Explanation Banner */}
        <div className="w-full bg-slate-950/80 border border-slate-800/80 rounded-xl px-4 py-2.5 text-xs text-slate-300 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <HelpCircle className="w-4 h-4 text-indigo-400 shrink-0" />
            <span>{step.explanation}</span>
          </div>
          {step.isComplete && (
            <span className="text-emerald-400 font-semibold flex items-center gap-1 shrink-0">
              <CheckCircle2 className="w-4 h-4" /> Ready: [{step.dpArray.join(', ')}]
            </span>
          )}
        </div>
      </div>
    </div>
  );
};
