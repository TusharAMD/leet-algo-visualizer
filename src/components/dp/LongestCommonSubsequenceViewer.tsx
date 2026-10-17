import React from 'react';
import type { LCSStep } from '../../algorithms/longestCommonSubsequenceIntuitive';

interface LongestCommonSubsequenceViewerProps {
  step: LCSStep;
  text1: string;
  text2: string;
}

export const LongestCommonSubsequenceViewer: React.FC<LongestCommonSubsequenceViewerProps> = ({
  step,
  text1,
  text2,
}) => {
  const m = text1.length;
  const n = text2.length;

  return (
    <div className="flex flex-col h-full gap-4 p-4 select-none">
      {/* Top Status & Variable Badges */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
        <div className="bg-slate-900 border border-slate-800 rounded-xl p-3 flex flex-col justify-center">
          <span className="text-xs text-slate-400 font-medium">Indices (i, j)</span>
          <span className="text-base font-mono font-bold text-sky-400">
            ({step.i}, {step.j})
          </span>
        </div>
        <div className="bg-slate-900 border border-slate-800 rounded-xl p-3 flex flex-col justify-center">
          <span className="text-xs text-slate-400 font-medium">Comparing Characters</span>
          <span className="text-sm font-mono font-bold text-amber-300">
            {step.char1 ? `'${step.char1}' vs '${step.char2}'` : '—'}
          </span>
        </div>
        <div className="bg-slate-900 border border-slate-800 rounded-xl p-3 flex flex-col justify-center">
          <span className="text-xs text-slate-400 font-medium">Match Condition</span>
          <span className={`text-sm font-bold ${step.isMatch ? 'text-emerald-400' : 'text-slate-400'}`}>
            {step.char1 ? (step.isMatch ? 'Match (Diagonal + 1)' : 'Mismatch (max(top, left))') : '—'}
          </span>
        </div>
        <div className="bg-slate-900 border border-slate-800 rounded-xl p-3 flex flex-col justify-center">
          <span className="text-xs text-slate-400 font-medium">LCS Length</span>
          <span className="text-2xl font-mono font-extrabold text-emerald-400">
            {step.dp[m]?.[n] ?? 0}
          </span>
        </div>
      </div>

      {/* 2D DP Matrix Visualizer */}
      <div className="flex-1 bg-slate-900/60 border border-slate-800 rounded-xl p-6 flex flex-col justify-center items-center gap-4 relative overflow-auto">
        <div className="text-xs font-semibold text-slate-400 uppercase tracking-wider mb-2">
          LCS Dynamic Programming Table
        </div>

        {/* Matrix Grid with Row/Col Headers */}
        <div className="overflow-auto max-w-full">
          <table className="border-collapse text-center">
            <thead>
              <tr>
                <th className="p-1.5 text-xs font-mono text-slate-500"></th>
                <th className="p-1.5 text-xs font-mono text-slate-500">Ø</th>
                {text2.split('').map((c, idx) => (
                  <th key={idx} className="p-1.5 text-xs font-mono text-indigo-300">
                    {c}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {step.dp.map((row, rIdx) => (
                <tr key={rIdx}>
                  <td className="p-1.5 text-xs font-mono text-indigo-300">
                    {rIdx === 0 ? 'Ø' : text1[rIdx - 1]}
                  </td>
                  {row.map((val, cIdx) => {
                    const isCurrent = rIdx === step.i && cIdx === step.j;
                    const isDiagSource =
                      step.isMatch && rIdx === step.i - 1 && cIdx === step.j - 1;
                    const isTopSource =
                      !step.isMatch && rIdx === step.i - 1 && cIdx === step.j;
                    const isLeftSource =
                      !step.isMatch && rIdx === step.i && cIdx === step.j - 1;

                    let border = 'border-slate-800';
                    let bg = 'bg-slate-950/60';
                    let text = 'text-slate-400';

                    if (isCurrent) {
                      border = 'border-amber-400 ring-2 ring-amber-400/40';
                      bg = 'bg-amber-950/70';
                      text = 'text-amber-200';
                    } else if (isDiagSource) {
                      border = 'border-emerald-400 ring-2 ring-emerald-400/30';
                      bg = 'bg-emerald-950/50';
                      text = 'text-emerald-300';
                    } else if (isTopSource || isLeftSource) {
                      border = 'border-sky-400/80';
                      bg = 'bg-sky-950/40';
                      text = 'text-sky-300';
                    }

                    return (
                      <td key={cIdx} className="p-1">
                        <div
                          className={`w-10 h-10 rounded-lg border flex items-center justify-center font-mono text-sm font-bold transition-all ${border} ${bg} ${text}`}
                        >
                          {val}
                        </div>
                      </td>
                    );
                  })}
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* LCS Reconstructed Substring if available */}
        {step.lcsSoFar && (
          <div className="mt-2 bg-emerald-950/40 border border-emerald-800/60 px-4 py-2 rounded-xl flex items-center gap-2">
            <span className="text-xs text-emerald-400 font-semibold">Common Subsequence:</span>
            <span className="text-sm font-mono font-bold text-emerald-200">
              "{step.lcsSoFar}"
            </span>
          </div>
        )}
      </div>

      {/* Step Explanation */}
      <div className="bg-slate-950 border border-slate-800 rounded-xl p-3 text-sm text-slate-300 flex items-center gap-2">
        <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse shrink-0" />
        <span>{step.explanation}</span>
      </div>
    </div>
  );
};
