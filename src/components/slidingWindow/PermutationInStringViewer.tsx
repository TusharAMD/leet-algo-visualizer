import React from 'react';
import { PermutationInStringStep } from '../../algorithms/permutationInStringIntuitive';
import { Shuffle, CheckCircle2, AlertTriangle, ShieldCheck, Scale } from 'lucide-react';

interface PermutationInStringViewerProps {
  step: PermutationInStringStep;
}

export const PermutationInStringViewer: React.FC<PermutationInStringViewerProps> = ({ step }) => {
  const { s1, s2, windowLeft, windowRight, s1Counts, windowCounts, isMatch, matchScore, totalUniqueChars, foundIndex, isComplete } = step;

  const charsS2 = Array.from(s2);

  return (
    <div className="flex-1 min-h-0 flex flex-col bg-slate-900/60 border border-slate-800 rounded-2xl p-3 shadow-xl overflow-hidden justify-between">
      {/* Top Banner */}
      <div className="bg-slate-950/70 border border-slate-800/80 rounded-xl p-2.5 flex items-center justify-between shrink-0">
        <div className="flex items-center gap-2">
          <span className="p-1.5 rounded-lg bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
            <Shuffle className="w-4 h-4" />
          </span>
          <div>
            <h3 className="text-xs font-semibold text-white tracking-wide">{step.headline}</h3>
            <p className="text-[11px] text-slate-400">{step.subtext}</p>
          </div>
        </div>
        <div className="flex items-center gap-2">
          {isComplete ? (
            isMatch ? (
              <span className="px-2 py-0.5 rounded-md bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 text-[11px] font-semibold flex items-center gap-1">
                <CheckCircle2 className="w-3.5 h-3.5" /> Permutation Found (True)
              </span>
            ) : (
              <span className="px-2 py-0.5 rounded-md bg-rose-500/10 border border-rose-500/20 text-rose-400 text-[11px] font-semibold flex items-center gap-1">
                <AlertTriangle className="w-3.5 h-3.5" /> No Permutation (False)
              </span>
            )
          ) : (
            <span className="px-2 py-0.5 rounded-md bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 text-[11px] font-mono">
              Step {step.stepIndex + 1} / {step.totalSteps}
            </span>
          )}
        </div>
      </div>

      {/* Main Visual Arena */}
      <div className="flex-1 min-h-0 flex flex-col justify-around gap-2 py-2 px-3">
        {/* Row 1: Target String s1 Template */}
        <div className="bg-slate-950/60 border border-slate-800/80 rounded-xl p-2.5 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <span className="text-[10px] uppercase font-mono font-bold tracking-wider text-slate-400">
              Target Signature Template (s1 = "{s1}"):
            </span>
            <div className="flex items-center gap-1">
              {Object.entries(s1Counts).map(([ch, cnt]) => (
                <span
                  key={ch}
                  className="px-2 py-0.5 rounded bg-emerald-500/15 border border-emerald-500/30 text-emerald-300 font-mono text-xs font-bold"
                >
                  {ch}: {cnt}
                </span>
              ))}
            </div>
          </div>
          <span className="text-[10px] font-mono text-slate-400">
            Fixed Window Width: <span className="text-emerald-400 font-bold">{s1.length}</span>
          </span>
        </div>

        {/* Row 2: Target String s2 with Sliding Window Frame */}
        <div className="flex flex-col gap-1.5">
          <span className="text-[10px] uppercase font-mono font-bold tracking-wider text-slate-400">
            String s2 & Fixed Sliding Window Frame:
          </span>

          <div className="flex items-center gap-1.5 overflow-x-auto py-3 px-3 bg-slate-950/60 rounded-xl border border-slate-800/80">
            {charsS2.map((ch, idx) => {
              const inWindow = idx >= windowLeft && idx <= windowRight;
              const isMatchWindow = inWindow && isMatch;

              let boxStyle = 'bg-slate-900 border-slate-800 text-slate-500 opacity-60';
              if (inWindow) {
                if (isMatchWindow) {
                  boxStyle = 'bg-emerald-500/30 border-emerald-400 text-emerald-200 font-bold scale-105 shadow-lg shadow-emerald-500/30';
                } else {
                  boxStyle = 'bg-indigo-500/20 border-indigo-500/60 text-indigo-200 font-bold';
                }
              }

              return (
                <div key={idx} className="flex flex-col items-center gap-1 shrink-0">
                  {/* Marker */}
                  <div className="h-4 flex items-center justify-center text-[10px] font-mono font-bold">
                    {idx === windowLeft ? (
                      <span className="text-indigo-400 font-bold">[</span>
                    ) : idx === windowRight ? (
                      <span className="text-indigo-400 font-bold">]</span>
                    ) : null}
                  </div>

                  {/* Character box */}
                  <div
                    className={`w-9 h-10 rounded-lg flex items-center justify-center font-mono text-sm border transition-all ${boxStyle}`}
                  >
                    {ch}
                  </div>

                  {/* Index */}
                  <span className="text-[9px] font-mono text-slate-500">{idx}</span>
                </div>
              );
            })}
          </div>
        </div>

        {/* Row 3: Current Window Frequency Counts Comparison */}
        <div className="bg-slate-950/60 border border-slate-800/80 rounded-xl p-2.5 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Scale className="w-4 h-4 text-emerald-400" />
            <span className="text-xs font-mono font-bold text-slate-300">
              Current Window Frequencies:
            </span>
          </div>
          <div className="flex items-center gap-2">
            <div className="flex items-center gap-1.5">
              {Object.keys(windowCounts).length === 0 ? (
                <span className="text-xs text-slate-500 italic">None</span>
              ) : (
                Object.entries(windowCounts).map(([ch, cnt]) => {
                  const targetCnt = s1Counts[ch] || 0;
                  const matchesTarget = cnt === targetCnt;
                  return (
                    <span
                      key={ch}
                      className={`px-2 py-0.5 rounded border font-mono text-xs font-bold ${
                        matchesTarget
                          ? 'bg-emerald-500/20 border-emerald-400 text-emerald-300'
                          : 'bg-rose-500/20 border-rose-400/50 text-rose-300'
                      }`}
                    >
                      {ch}: {cnt}/{targetCnt}
                    </span>
                  );
                })
              )}
            </div>
            <span className="text-xs font-mono font-bold text-slate-400 pl-2 border-l border-slate-800">
              Match Score: <span className="text-emerald-400">{matchScore} / {totalUniqueChars}</span>
            </span>
          </div>
        </div>
      </div>
    </div>
  );
};
