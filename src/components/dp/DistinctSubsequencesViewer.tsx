import React from 'react';
import type { DistinctSubsequencesStep } from '../../algorithms/distinctSubsequencesIntuitive';

interface DistinctSubsequencesViewerProps {
  step: DistinctSubsequencesStep;
  s: string;
  t: string;
}

export const DistinctSubsequencesViewer: React.FC<DistinctSubsequencesViewerProps> = ({
  step,
  s,
  t,
}) => {
  const m = s.length;
  const n = t.length;

  return (
    <div className="flex flex-col h-full gap-4 p-4 select-none">
      {/* Top Status & Variable Badges */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
        <div className="bg-slate-900 border border-slate-800 rounded-xl p-3 flex flex-col justify-center">
          <span className="text-xs text-slate-400 font-medium">Grid Position (i, j)</span>
          <span className="text-base font-mono font-bold text-sky-400">
            ({step.i}, {step.j})
          </span>
        </div>
        <div className="bg-slate-900 border border-slate-800 rounded-xl p-3 flex flex-col justify-center">
          <span className="text-xs text-slate-400 font-medium">Chars Comparison</span>
          <span className="text-sm font-mono font-bold text-amber-300">
            {step.charS ? `'${step.charS}' vs '${step.charT}'` : '—'}
          </span>
        </div>
        <div className="bg-slate-900 border border-slate-800 rounded-xl p-3 flex flex-col justify-center">
          <span className="text-xs text-slate-400 font-medium">Recurrence Choice</span>
          <span className={`text-xs font-mono font-bold ${step.isMatch ? 'text-emerald-400' : 'text-slate-400'}`}>
            {step.charS ? (step.isMatch ? `Take(${step.takeCount}) + Skip(${step.skipCount})` : `Skip(${step.skipCount})`) : '—'}
          </span>
        </div>
        <div className="bg-slate-900 border border-slate-800 rounded-xl p-3 flex flex-col justify-center">
          <span className="text-xs text-slate-400 font-medium">Distinct Subsequences</span>
          <span className="text-2xl font-mono font-black text-emerald-400">
            {step.dp[m]?.[n] ?? 0}
          </span>
        </div>
      </div>

      {/* Main Grid Visualizer */}
      <div className="flex-1 bg-slate-900/60 border border-slate-800 rounded-xl p-6 flex flex-col justify-center items-center gap-6 relative overflow-auto">
        <div className="text-xs font-semibold text-slate-400 uppercase tracking-wider">
          DP Matrix: dp[i][j] (Distinct subsequences of s[0..i-1] matching t[0..j-1])
        </div>

        {/* Matrix Grid with Headers */}
        <div className="overflow-auto max-w-full">
          <table className="border-collapse text-center">
            <thead>
              <tr>
                <th className="p-1.5 text-xs font-mono text-slate-500"></th>
                <th className="p-1.5 text-xs font-mono text-slate-500">Ø</th>
                {t.split('').map((char, idx) => (
                  <th key={idx} className="p-1.5 text-xs font-mono text-purple-300">
                    {char}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {step.dp.map((row, rIdx) => (
                <tr key={rIdx}>
                  <td className="p-1.5 text-xs font-mono text-sky-300">
                    {rIdx === 0 ? 'Ø' : s[rIdx - 1]}
                  </td>
                  {row.map((val, cIdx) => {
                    const isCurrent = rIdx === step.i && cIdx === step.j;
                    const isTakeSource =
                      step.isMatch && rIdx === step.i - 1 && cIdx === step.j - 1;
                    const isSkipSource = rIdx === step.i - 1 && cIdx === step.j;

                    let border = 'border-slate-800';
                    let bg = 'bg-slate-950/60';
                    let text = 'text-slate-400';

                    if (isCurrent) {
                      border = 'border-amber-400 ring-2 ring-amber-400/40';
                      bg = 'bg-amber-950/70';
                      text = 'text-amber-200';
                    } else if (isTakeSource) {
                      border = 'border-emerald-400 ring-2 ring-emerald-400/30';
                      bg = 'bg-emerald-950/50';
                      text = 'text-emerald-300';
                    } else if (isSkipSource) {
                      border = 'border-sky-400/80';
                      bg = 'bg-sky-950/40';
                      text = 'text-sky-300';
                    }

                    return (
                      <td key={cIdx} className="p-1">
                        <div
                          className={`w-11 h-11 rounded-lg border flex items-center justify-center font-mono text-sm font-bold transition-all ${border} ${bg} ${text}`}
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

        {/* Transition Badge */}
        <div className="bg-slate-950/80 border border-slate-800 rounded-xl px-4 py-2 flex items-center gap-3 text-xs text-slate-400">
          <span className="font-semibold text-slate-300">Recurrence:</span>
          <span>if s[i-1] == t[j-1]: dp[i][j] = dp[i-1][j-1] (take) + dp[i-1][j] (skip); else: dp[i-1][j]</span>
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
