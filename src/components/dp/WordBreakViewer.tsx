import React from 'react';
import type { WordBreakStep } from '../../algorithms/wordBreakIntuitive';

interface WordBreakViewerProps {
  step: WordBreakStep;
  s: string;
  wordDict: string[];
}

export const WordBreakViewer: React.FC<WordBreakViewerProps> = ({
  step,
  s,
  wordDict,
}) => {
  return (
    <div className="flex flex-col h-full gap-4 p-4 select-none">
      {/* Top Status & Variable Badges */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
        <div className="bg-slate-900 border border-slate-800 rounded-xl p-3 flex flex-col justify-center">
          <span className="text-xs text-slate-400 font-medium">Prefix Boundary</span>
          <span className="text-base font-mono font-bold text-sky-400">
            i = {step.i} / {s.length}
          </span>
        </div>
        <div className="bg-slate-900 border border-slate-800 rounded-xl p-3 flex flex-col justify-center">
          <span className="text-xs text-slate-400 font-medium">Testing Word</span>
          <span className="text-base font-mono font-bold text-amber-300">
            {step.currentWord ? `"${step.currentWord}"` : '—'}
          </span>
        </div>
        <div className="bg-slate-900 border border-slate-800 rounded-xl p-3 flex flex-col justify-center">
          <span className="text-xs text-slate-400 font-medium">Segment Match</span>
          <span className={`text-base font-bold ${step.isMatch ? 'text-emerald-400' : 'text-slate-400'}`}>
            {step.isMatch ? 'Match Found ✓' : 'Checking / No match'}
          </span>
        </div>
        <div className="bg-slate-900 border border-slate-800 rounded-xl p-3 flex flex-col justify-center">
          <span className="text-xs text-slate-400 font-medium">Can Segment dp[i]</span>
          <span className={`text-xl font-mono font-extrabold ${step.dp[step.i] ? 'text-emerald-400' : 'text-rose-400'}`}>
            {step.dp[step.i] ? 'True' : 'False'}
          </span>
        </div>
      </div>

      {/* Main String & DP Table Canvas */}
      <div className="flex-1 bg-slate-900/60 border border-slate-800 rounded-xl p-6 flex flex-col justify-center items-center gap-8 relative overflow-hidden">
        {/* String with boundary markers */}
        <div className="flex flex-col items-center gap-2">
          <div className="text-xs font-semibold text-slate-400 uppercase tracking-wider">
            String Characters with Split Boundaries
          </div>
          <div className="flex items-center">
            {s.split('').map((char, idx) => {
              const inRange =
                idx >= step.substringRange[0] && idx < step.substringRange[1];

              return (
                <div key={idx} className="flex items-center">
                  {/* Boundary marker before char */}
                  <div className="flex flex-col items-center">
                    <span
                      className={`text-[9px] font-mono px-1 rounded ${
                        step.i === idx
                          ? 'bg-sky-500 text-slate-950 font-bold'
                          : 'text-slate-500'
                      }`}
                    >
                      |{idx}
                    </span>
                  </div>

                  {/* Character box */}
                  <div className="flex flex-col items-center mx-1">
                    <div
                      className={`w-11 h-13 rounded-lg border-2 flex items-center justify-center font-mono text-lg font-bold transition-all duration-200 ${
                        inRange
                          ? step.isMatch
                            ? 'border-emerald-400 bg-emerald-950/70 text-emerald-200 ring-2 ring-emerald-500/30'
                            : 'border-amber-400 bg-amber-950/60 text-amber-200'
                          : 'border-slate-700 bg-slate-800/80 text-slate-300'
                      }`}
                    >
                      {char}
                    </div>
                  </div>
                </div>
              );
            })}
            {/* Final boundary marker */}
            <div className="flex flex-col items-center">
              <span
                className={`text-[9px] font-mono px-1 rounded ${
                  step.i === s.length
                    ? 'bg-sky-500 text-slate-950 font-bold'
                    : 'text-slate-500'
                }`}
              >
                |{s.length}
              </span>
            </div>
          </div>
        </div>

        {/* DP Array */}
        <div className="flex flex-col items-center gap-2">
          <div className="text-xs font-semibold text-slate-400 uppercase tracking-wider">
            DP Array: dp[k] (Can s[0..k] be segmented?)
          </div>
          <div className="flex items-center gap-1.5 flex-wrap justify-center">
            {step.dp.map((can, idx) => {
              const isCurrent = idx === step.i;
              const isCheckStart = idx === step.substringRange[0] && step.substringRange[1] > 0;

              return (
                <div key={idx} className="flex flex-col items-center gap-1">
                  <span className="text-[10px] font-mono text-slate-500">[{idx}]</span>
                  <div
                    className={`w-11 h-10 rounded-lg border text-xs font-mono font-bold flex items-center justify-center transition-all ${
                      isCurrent
                        ? 'border-sky-400 bg-sky-950 text-sky-300 ring-2 ring-sky-400/30'
                        : isCheckStart
                        ? 'border-amber-400 bg-amber-950/60 text-amber-300'
                        : can
                        ? 'border-emerald-600/70 bg-emerald-950/40 text-emerald-300'
                        : 'border-slate-800 bg-slate-950/60 text-slate-600'
                    }`}
                  >
                    {can ? 'T' : 'F'}
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Dictionary Badges */}
        <div className="flex flex-col items-center gap-2">
          <div className="text-xs font-semibold text-slate-400 uppercase tracking-wider">
            Dictionary Words
          </div>
          <div className="flex flex-wrap gap-2 justify-center">
            {wordDict.map((w, idx) => {
              const isTesting = w === step.currentWord;
              const isMatched = w === step.matchedWord;

              return (
                <span
                  key={idx}
                  className={`px-3 py-1 rounded-lg text-xs font-mono border transition-all ${
                    isMatched
                      ? 'bg-emerald-500/20 border-emerald-400 text-emerald-300 font-bold scale-105'
                      : isTesting
                      ? 'bg-amber-500/20 border-amber-400 text-amber-300 font-bold'
                      : 'bg-slate-900 border-slate-800 text-slate-400'
                  }`}
                >
                  "{w}"
                </span>
              );
            })}
          </div>
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
