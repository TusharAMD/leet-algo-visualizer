import React from 'react';
import type { SingleNumberStep } from '../../algorithms/singleNumberIntuitive';
import { HelpCircle, CheckCircle2, Binary } from 'lucide-react';

interface SingleNumberViewerProps {
  step: SingleNumberStep;
  nums: number[];
}

export const SingleNumberViewer: React.FC<SingleNumberViewerProps> = ({ step, nums }) => {
  return (
    <div className="flex flex-col h-full gap-3 p-4 select-none">
      {/* Top Status & Variable Badges */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
        <div className="bg-slate-900 border border-slate-800 rounded-xl p-3 flex flex-col justify-center">
          <span className="text-xs text-slate-400 font-medium">Scanning Num</span>
          <span className="text-base font-mono font-bold text-sky-400">
            {step.currentNum !== null ? `nums[${step.currentIndex}] = ${step.currentNum}` : '—'}
          </span>
        </div>
        <div className="bg-slate-900 border border-slate-800 rounded-xl p-3 flex flex-col justify-center">
          <span className="text-xs text-slate-400 font-medium">Accumulator (res)</span>
          <span className="text-2xl font-mono font-black text-amber-300">
            {step.newRes}
          </span>
        </div>
        <div className="bg-slate-900 border border-slate-800 rounded-xl p-3 flex flex-col justify-center">
          <span className="text-xs text-slate-400 font-medium">Binary State</span>
          <span className="text-base font-mono font-bold text-indigo-300">
            b: {step.newRes.toString(2).padStart(4, '0')}
          </span>
        </div>
        <div className="bg-slate-900 border border-slate-800 rounded-xl p-3 flex flex-col justify-center">
          <span className="text-xs text-slate-400 font-medium">XOR Property</span>
          <span className="text-xs font-semibold text-emerald-400">
            x ⊕ x = 0, x ⊕ 0 = x
          </span>
        </div>
      </div>

      {/* Main XOR Flow Canvas */}
      <div className="flex-1 bg-slate-900/60 border border-slate-800 rounded-xl p-6 flex flex-col justify-between items-center gap-6 relative overflow-hidden">
        {/* Stream of numbers */}
        <div className="w-full flex flex-col items-center gap-2">
          <div className="text-xs font-semibold text-slate-400 uppercase tracking-wider">
            Numbers Stream
          </div>
          <div className="flex items-center gap-2.5 flex-wrap justify-center">
            {nums.map((num, idx) => {
              const isCurrent = idx === step.currentIndex;
              const isPassed = idx < step.currentIndex;

              let cardStyle = 'bg-slate-950 border-slate-800 text-slate-300';
              if (isCurrent) {
                cardStyle = 'bg-amber-600 border-amber-300 text-white shadow-lg shadow-amber-500/40 scale-110 z-10';
              } else if (isPassed) {
                cardStyle = 'bg-slate-900 border-slate-700 text-slate-500 opacity-70';
              }

              return (
                <div key={idx} className="flex flex-col items-center gap-1">
                  <div
                    className={`w-12 h-14 md:w-14 md:h-16 rounded-xl border-2 flex flex-col items-center justify-center font-mono transition-all duration-200 ${cardStyle}`}
                  >
                    <span className="text-xl md:text-2xl font-black">{num}</span>
                    <span className="text-[9px] font-mono opacity-50">b:{num.toString(2)}</span>
                  </div>
                  <span className="text-[10px] font-mono text-slate-400">idx {idx}</span>
                </div>
              );
            })}
          </div>
        </div>

        {/* Live Bitwise XOR Breakdown Card */}
        {step.currentNum !== null && (
          <div className="w-full max-w-md bg-slate-950 border border-slate-800 rounded-2xl p-4 flex flex-col gap-2 font-mono">
            <div className="flex items-center justify-between text-xs text-slate-400 border-b border-slate-800/80 pb-2">
              <span className="flex items-center gap-1.5 font-bold text-indigo-400">
                <Binary className="w-4 h-4" /> Bitwise XOR Operation
              </span>
              <span>decimal / binary</span>
            </div>
            <div className="flex items-center justify-between text-sm">
              <span className="text-slate-400">Previous res:</span>
              <span className="text-slate-200 font-bold">{step.prevRes} (b: {step.prevRes.toString(2).padStart(4, '0')})</span>
            </div>
            <div className="flex items-center justify-between text-sm">
              <span className="text-sky-400">XOR with n:</span>
              <span className="text-sky-300 font-bold">^ {step.currentNum} (b: {step.currentNum.toString(2).padStart(4, '0')})</span>
            </div>
            <div className="flex items-center justify-between text-base border-t border-slate-800/80 pt-2">
              <span className="text-amber-400 font-bold">New res:</span>
              <span className="text-amber-300 font-black">{step.newRes} (b: {step.newRes.toString(2).padStart(4, '0')})</span>
            </div>
          </div>
        )}

        {/* Bottom Explanation Banner */}
        <div className="w-full bg-slate-950/80 border border-slate-800/80 rounded-xl px-4 py-2.5 text-xs text-slate-300 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <HelpCircle className="w-4 h-4 text-indigo-400 shrink-0" />
            <span>{step.explanation}</span>
          </div>
          {step.currentIndex >= nums.length && (
            <span className="text-emerald-400 font-semibold flex items-center gap-1 shrink-0">
              <CheckCircle2 className="w-4 h-4" /> Single Number: {step.newRes}
            </span>
          )}
        </div>
      </div>
    </div>
  );
};
