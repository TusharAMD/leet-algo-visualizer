import React from 'react';
import type { RegexStep } from '../../algorithms/regularExpressionMatchingIntuitive';

interface RegexViewerProps {
  step: RegexStep;
  s: string;
  p: string;
}

export const RegularExpressionMatchingViewer: React.FC<RegexViewerProps> = ({
  step,
  s,
  p,
}) => {
  const m = s.length;
  const n = p.length;

  return (
    <div className="flex flex-col h-full gap-4 p-4 select-none">
      {/* Top Status & Variable Badges */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
        <div className="bg-slate-900 border border-slate-800 rounded-xl p-3 flex flex-col justify-center">
          <span className="text-xs text-slate-400 font-medium">Position (i, j)</span>
          <span className="text-base font-mono font-bold text-sky-400">
            ({step.i}, {step.j})
          </span>
        </div>
        <div className="bg-slate-900 border border-slate-800 rounded-xl p-3 flex flex-col justify-center">
          <span className="text-xs text-slate-400 font-medium">Comparing</span>
          <span className="text-sm font-mono font-bold text-amber-300">
            {step.charS ? `s[${step.i - 1}]='${step.charS}' vs p[${step.j - 1}]='${step.charP}'` : '—'}
          </span>
        </div>
        <div className="bg-slate-900 border border-slate-800 rounded-xl p-3 flex flex-col justify-center">
          <span className="text-xs text-slate-400 font-medium">Match Status</span>
          <span className={`text-sm font-bold ${step.isMatch ? 'text-emerald-400' : 'text-slate-400'}`}>
            {step.charS ? (step.isMatch ? 'Match ✓' : 'Mismatch ✗') : '—'}
          </span>
        </div>
        <div className="bg-slate-900 border border-slate-800 rounded-xl p-3 flex flex-col justify-center">
          <span className="text-xs text-slate-400 font-medium">Overall Match</span>
          <span className={`text-xl font-mono font-extrabold ${step.dp[m]?.[n] ? 'text-emerald-400' : 'text-rose-400'}`}>
            {step.dp[m]?.[n] ? 'True' : 'False'}
          </span>
        </div>
      </div>

      {/* Main Grid Visualizer */}
      <div className="flex-1 bg-slate-900/60 border border-slate-800 rounded-xl p-6 flex flex-col justify-center items-center gap-6 relative overflow-auto">
        <div className="text-xs font-semibold text-slate-400 uppercase tracking-wider">
          Regex Dynamic Programming Lattice
        </div>

        {/* Matrix Grid with Headers */}
        <div className="overflow-auto max-w-full">
          <table className="border-collapse text-center">
            <thead>
              <tr>
                <th className="p-1.5 text-xs font-mono text-slate-500"></th>
                <th className="p-1.5 text-xs font-mono text-slate-500">Ø</th>
                {p.split('').map((char, idx) => (
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
                    const isDiag = rIdx === step.i - 1 && cIdx === step.j - 1 && step.charP !== '*';
                    const isZeroStar = step.charP === '*' && rIdx === step.i && cIdx === step.j - 2;
                    const isOneStar = step.charP === '*' && rIdx === step.i - 1 && cIdx === step.j;

                    let border = 'border-slate-800';
                    let bg = 'bg-slate-950/60';
                    let text = 'text-slate-600';

                    if (isCurrent) {
                      border = 'border-amber-400 ring-2 ring-amber-400/40';
                      bg = 'bg-amber-950/70';
                      text = 'text-amber-200';
                    } else if (isDiag && val) {
                      border = 'border-emerald-400 ring-2 ring-emerald-400/30';
                      bg = 'bg-emerald-950/50';
                      text = 'text-emerald-300';
                    } else if ((isZeroStar && step.starZeroMatch) || (isOneStar && step.starOneMatch)) {
                      border = 'border-sky-400 ring-2 ring-sky-400/30';
                      bg = 'bg-sky-950/50';
                      text = 'text-sky-300';
                    } else if (val) {
                      border = 'border-emerald-600/70';
                      bg = 'bg-emerald-950/40';
                      text = 'text-emerald-300';
                    }

                    return (
                      <td key={cIdx} className="p-1">
                        <div
                          className={`w-11 h-11 rounded-lg border flex items-center justify-center font-mono text-sm font-bold transition-all ${border} ${bg} ${text}`}
                        >
                          {val ? 'T' : 'F'}
                        </div>
                      </td>
                    );
                  })}
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Wildcard Rule Explainer */}
        <div className="bg-slate-950/80 border border-slate-800 rounded-xl px-4 py-2 flex flex-wrap gap-4 text-xs text-slate-400 justify-center">
          <div><span className="font-semibold text-slate-300">'.' Wildcard:</span> Matches any single character.</div>
          <div><span className="font-semibold text-slate-300">'*' Kleene Star:</span> Matches 0 of prev char (left 2 cols) OR 1+ of prev char (top 1 row).</div>
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
