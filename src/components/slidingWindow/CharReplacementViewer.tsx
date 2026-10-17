import React from 'react';
import { CharReplacementStep } from '../../algorithms/charReplacementIntuitive';
import { Repeat, CheckCircle2, AlertCircle, Trophy, Sparkles } from 'lucide-react';

interface CharReplacementViewerProps {
  step: CharReplacementStep;
}

export const CharReplacementViewer: React.FC<CharReplacementViewerProps> = ({ step }) => {
  const { rawStr, k, left, right, counts, maxFreq, windowLen, replacementsNeeded, isValid, longest, isComplete } = step;

  const chars = Array.from(rawStr);

  return (
    <div className="flex-1 min-h-0 flex flex-col bg-slate-900/60 border border-slate-800 rounded-2xl p-3 shadow-xl overflow-hidden justify-between">
      {/* Top Banner */}
      <div className="bg-slate-950/70 border border-slate-800/80 rounded-xl p-2.5 flex items-center justify-between shrink-0">
        <div className="flex items-center gap-2">
          <span className="p-1.5 rounded-lg bg-pink-500/10 text-pink-400 border border-pink-500/20">
            <Repeat className="w-4 h-4" />
          </span>
          <div>
            <h3 className="text-xs font-semibold text-white tracking-wide">{step.headline}</h3>
            <p className="text-[11px] text-slate-400">{step.subtext}</p>
          </div>
        </div>
        <div className="flex items-center gap-2">
          {isComplete ? (
            <span className="px-2 py-0.5 rounded-md bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 text-[11px] font-semibold flex items-center gap-1">
              <CheckCircle2 className="w-3.5 h-3.5" /> Longest: {longest}
            </span>
          ) : (
            <span className="px-2 py-0.5 rounded-md bg-pink-500/10 border border-pink-500/20 text-pink-400 text-[11px] font-mono">
              Step {step.stepIndex + 1} / {step.totalSteps}
            </span>
          )}
        </div>
      </div>

      {/* Main Visual Arena */}
      <div className="flex-1 min-h-0 flex flex-col justify-around gap-2 py-2 px-3">
        {/* Sliding Window String Ribbon */}
        <div className="flex flex-col gap-1.5">
          <div className="flex items-center justify-between">
            <span className="text-[10px] uppercase font-mono font-bold tracking-wider text-slate-400">
              String Ribbon & Sliding Window [l, r]:
            </span>
            <span className="text-[10px] font-mono text-slate-400">
              Max replacements allowed: <span className="text-pink-400 font-bold">k = {k}</span>
            </span>
          </div>

          <div className="flex items-center gap-1.5 overflow-x-auto py-3 px-3 bg-slate-950/60 rounded-xl border border-slate-800/80">
            {chars.map((ch, idx) => {
              const inWindow = idx >= left && idx <= right;
              const isLeft = idx === left;
              const isRight = idx === right;

              let boxStyle = 'bg-slate-900 border-slate-800 text-slate-500 opacity-60';
              if (inWindow) {
                if (!isValid) {
                  boxStyle = 'bg-rose-500/20 border-rose-500/60 text-rose-300 font-bold shadow-lg shadow-rose-500/20';
                } else {
                  boxStyle = 'bg-pink-500/20 border-pink-500/60 text-pink-200 font-bold shadow-lg shadow-pink-500/20';
                }
              }

              return (
                <div key={idx} className="flex flex-col items-center gap-1 shrink-0">
                  {/* Pointer markers */}
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

        {/* Math & Frequency Cards Row */}
        <div className="grid grid-cols-2 gap-3">
          {/* Window Frequency Map */}
          <div className="bg-slate-950/60 border border-slate-800/80 rounded-xl p-2.5 flex flex-col gap-1.5">
            <span className="text-[10px] uppercase font-mono font-bold tracking-wider text-slate-400">
              Window Frequencies (Dominant max_f = {maxFreq}):
            </span>
            <div className="flex flex-wrap gap-1.5">
              {Object.keys(counts).length === 0 ? (
                <span className="text-xs text-slate-500 italic">No chars in window</span>
              ) : (
                Object.entries(counts).map(([ch, cnt]) => {
                  if (cnt <= 0) return null;
                  const isMax = cnt === maxFreq;
                  return (
                    <div
                      key={ch}
                      className={`px-2 py-0.5 rounded border text-xs font-mono flex items-center gap-1 ${
                        isMax
                          ? 'bg-pink-500/20 border-pink-400 text-pink-300 font-bold'
                          : 'bg-slate-900 border-slate-800 text-slate-300'
                      }`}
                    >
                      <span className="text-white font-bold">{ch}</span>
                      <span className="text-slate-500">:</span>
                      <span>{cnt}</span>
                      {isMax && <span className="text-[9px] text-pink-400 uppercase font-bold">(max)</span>}
                    </div>
                  );
                })
              )}
            </div>
          </div>

          {/* Validation Equation */}
          <div className="bg-slate-950/60 border border-slate-800/80 rounded-xl p-2.5 flex flex-col justify-between">
            <span className="text-[10px] uppercase font-mono font-bold tracking-wider text-slate-400">
              Validity Formula: (Length - max_f) ≤ k
            </span>
            <div className="flex items-center gap-2 mt-1">
              <span className="text-xs font-mono text-slate-300">
                ({windowLen} - {maxFreq}) = <span className="font-bold text-white">{replacementsNeeded}</span>
              </span>
              <span className="text-xs font-mono text-slate-400">vs k={k}</span>
              {isValid ? (
                <span className="px-2 py-0.5 rounded bg-emerald-500/20 border border-emerald-400/40 text-emerald-300 text-[11px] font-bold flex items-center gap-1">
                  <CheckCircle2 className="w-3 h-3" /> Valid
                </span>
              ) : (
                <span className="px-2 py-0.5 rounded bg-rose-500/20 border border-rose-400/40 text-rose-300 text-[11px] font-bold flex items-center gap-1">
                  <AlertCircle className="w-3 h-3" /> Must Shrink Left
                </span>
              )}
            </div>
          </div>
        </div>

        {/* Longest Window Champion Banner */}
        <div className="bg-slate-950/60 border border-slate-800/80 rounded-xl p-2.5 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Trophy className="w-4 h-4 text-pink-400" />
            <span className="text-xs font-mono font-bold text-slate-300">
              Longest Repeating Substring Window:
            </span>
          </div>
          <div className="flex items-center gap-2">
            <span className="px-3 py-0.5 rounded-lg bg-pink-500/20 border border-pink-400/40 text-pink-300 font-mono text-sm font-bold shadow-md shadow-pink-500/10">
              Length: {longest}
            </span>
          </div>
        </div>
      </div>
    </div>
  );
};
