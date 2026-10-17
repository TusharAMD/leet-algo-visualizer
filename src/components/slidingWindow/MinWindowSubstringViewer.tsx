import React from 'react';
import { MinWindowSubstringStep } from '../../algorithms/minWindowSubstringIntuitive';
import { Minimize2, CheckCircle2, Target, Award, Sparkles, AlertCircle } from 'lucide-react';

interface MinWindowSubstringViewerProps {
  step: MinWindowSubstringStep;
}

export const MinWindowSubstringViewer: React.FC<MinWindowSubstringViewerProps> = ({ step }) => {
  const { s, t, left, right, windowCounts, targetCounts, have, need, minLen, bestWindow, action, isComplete } = step;

  const charsS = Array.from(s);
  const bestSub = minLen !== Infinity && bestWindow[0] >= 0 ? s.slice(bestWindow[0], bestWindow[1] + 1) : '';

  return (
    <div className="flex-1 min-h-0 flex flex-col bg-slate-900/60 border border-slate-800 rounded-2xl p-3 shadow-xl overflow-hidden justify-between">
      {/* Top Banner */}
      <div className="bg-slate-950/70 border border-slate-800/80 rounded-xl p-2.5 flex items-center justify-between shrink-0">
        <div className="flex items-center gap-2">
          <span className="p-1.5 rounded-lg bg-cyan-500/10 text-cyan-400 border border-cyan-500/20">
            <Minimize2 className="w-4 h-4" />
          </span>
          <div>
            <h3 className="text-xs font-semibold text-white tracking-wide">{step.headline}</h3>
            <p className="text-[11px] text-slate-400">{step.subtext}</p>
          </div>
        </div>
        <div className="flex items-center gap-2">
          {isComplete ? (
            minLen !== Infinity && minLen > 0 ? (
              <span className="px-2 py-0.5 rounded-md bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 text-[11px] font-semibold flex items-center gap-1">
                <CheckCircle2 className="w-3.5 h-3.5" /> Found: "{bestSub}"
              </span>
            ) : (
              <span className="px-2 py-0.5 rounded-md bg-rose-500/10 border border-rose-500/20 text-rose-400 text-[11px] font-semibold flex items-center gap-1">
                <AlertCircle className="w-3.5 h-3.5" /> None Found
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
      <div className="flex-1 min-h-0 flex flex-col justify-around gap-2 py-2 px-3">
        {/* Row 1: Target Requirements Dashboard */}
        <div className="bg-slate-950/60 border border-slate-800/80 rounded-xl p-2.5 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Target className="w-4 h-4 text-cyan-400" />
            <span className="text-[10px] uppercase font-mono font-bold tracking-wider text-slate-400">
              Required Target Chars (t = "{t}"):
            </span>
            <div className="flex items-center gap-1.5">
              {Object.entries(targetCounts).map(([ch, reqCount]) => {
                const currentCount = windowCounts[ch] || 0;
                const isSatisfied = currentCount >= reqCount;
                return (
                  <span
                    key={ch}
                    className={`px-2 py-0.5 rounded border text-xs font-mono font-bold flex items-center gap-1 transition-all ${
                      isSatisfied
                        ? 'bg-emerald-500/20 border-emerald-400 text-emerald-300'
                        : 'bg-slate-900 border-slate-800 text-slate-400'
                    }`}
                  >
                    <span>{ch}:</span>
                    <span>{currentCount}/{reqCount}</span>
                    {isSatisfied && <CheckCircle2 className="w-3 h-3 text-emerald-400" />}
                  </span>
                );
              })}
            </div>
          </div>
          <div className="flex items-center gap-1.5">
            <span className="text-xs font-mono text-slate-400">Satisfaction:</span>
            <span
              className={`px-2 py-0.5 rounded font-mono text-xs font-bold ${
                have === need
                  ? 'bg-emerald-500/20 border border-emerald-400 text-emerald-300'
                  : 'bg-cyan-500/15 border border-cyan-500/30 text-cyan-300'
              }`}
            >
              have {have} / {need}
            </span>
          </div>
        </div>

        {/* Row 2: String s with Sliding Window */}
        <div className="flex flex-col gap-1.5">
          <span className="text-[10px] uppercase font-mono font-bold tracking-wider text-slate-400">
            Source String s & Active Window [l={left}, r={right}]:
          </span>

          <div className="flex items-center gap-1.5 overflow-x-auto py-3 px-3 bg-slate-950/60 rounded-xl border border-slate-800/80">
            {charsS.map((ch, idx) => {
              const inWindow = idx >= left && idx <= right;
              const isTargetChar = Boolean(targetCounts[ch]);
              const isLeft = idx === left;
              const isRight = idx === right;

              let boxStyle = 'bg-slate-900 border-slate-800 text-slate-500 opacity-60';
              if (inWindow) {
                if (have === need) {
                  boxStyle = 'bg-emerald-500/20 border-emerald-400 text-emerald-200 font-bold shadow-lg shadow-emerald-500/20';
                } else {
                  boxStyle = 'bg-cyan-500/20 border-cyan-500/60 text-cyan-200 font-bold';
                }
              }

              return (
                <div key={idx} className="flex flex-col items-center gap-1 shrink-0">
                  {/* Pointer tag */}
                  <div className="h-4 flex items-center justify-center text-[10px] font-mono font-bold">
                    {isLeft && isRight ? (
                      <span className="text-purple-400 font-bold">L,R</span>
                    ) : isLeft ? (
                      <span className="text-cyan-400 font-bold">L</span>
                    ) : isRight ? (
                      <span className="text-pink-400 font-bold">R</span>
                    ) : null}
                  </div>

                  {/* Character box */}
                  <div
                    className={`w-9 h-10 rounded-lg flex items-center justify-center font-mono text-sm border transition-all relative ${boxStyle}`}
                  >
                    {ch}
                    {isTargetChar && (
                      <span className="absolute top-0.5 right-0.5 w-1.5 h-1.5 rounded-full bg-cyan-400" />
                    )}
                  </div>

                  {/* Index */}
                  <span className="text-[9px] font-mono text-slate-500">{idx}</span>
                </div>
              );
            })}
          </div>
        </div>

        {/* Row 3: Best Minimum Window Trophy Box */}
        <div className="bg-slate-950/60 border border-slate-800/80 rounded-xl p-2.5 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Award className="w-4 h-4 text-emerald-400" />
            <span className="text-xs font-mono font-bold text-slate-300">
              Optimal Minimum Window Substring:
            </span>
          </div>
          <div className="flex items-center gap-2">
            {minLen !== Infinity && minLen > 0 ? (
              <div className="flex items-center gap-2">
                <span className="px-3 py-0.5 rounded-lg bg-emerald-500/20 border border-emerald-400/40 text-emerald-300 font-mono text-sm font-bold shadow-md shadow-emerald-500/10">
                  "{bestSub}"
                </span>
                <span className="text-xs font-mono text-slate-400">
                  (Length: {minLen}, Indices: [{bestWindow[0]}..{bestWindow[1]}])
                </span>
              </div>
            ) : (
              <span className="text-xs text-slate-500 italic">Awaiting valid window...</span>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
