import React from 'react';
import type { InterleavingStringStep } from '../../algorithms/interleavingStringIntuitive';

interface InterleavingStringViewerProps {
  step: InterleavingStringStep;
  s1: string;
  s2: string;
  s3: string;
}

export const InterleavingStringViewer: React.FC<InterleavingStringViewerProps> = ({
  step,
  s1,
  s2,
  s3,
}) => {
  const m = s1.length;
  const n = s2.length;

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
          <span className="text-xs text-slate-400 font-medium">Matching Target Char</span>
          <span className="text-base font-mono font-bold text-amber-300">
            {step.char3 ? `s3[${step.i + step.j - 1}] = '${step.char3}'` : '—'}
          </span>
        </div>
        <div className="bg-slate-900 border border-slate-800 rounded-xl p-3 flex flex-col justify-center">
          <span className="text-xs text-slate-400 font-medium">Step Feasibility</span>
          <span className={`text-sm font-mono font-bold ${step.canInterleave ? 'text-emerald-400' : 'text-slate-400'}`}>
            {step.canInterleave ? 'Interleaving Reached ✓' : 'Checking'}
          </span>
        </div>
        <div className="bg-slate-900 border border-slate-800 rounded-xl p-3 flex flex-col justify-center">
          <span className="text-xs text-slate-400 font-medium">Overall Valid</span>
          <span className={`text-xl font-mono font-extrabold ${step.dp[m]?.[n] ? 'text-emerald-400' : 'text-rose-400'}`}>
            {step.dp[m]?.[n] ? 'True' : 'False'}
          </span>
        </div>
      </div>

      {/* Main Canvas: 2D Grid with s1 (rows) and s2 (cols) */}
      <div className="flex-1 bg-slate-900/60 border border-slate-800 rounded-xl p-6 flex flex-col justify-center items-center gap-6 relative overflow-auto">
        <div className="text-xs font-semibold text-slate-400 uppercase tracking-wider">
          Interleaving Grid: Moving Down consumes s1, Moving Right consumes s2
        </div>

        {/* Matrix Grid with Headers */}
        <div className="overflow-auto max-w-full">
          <table className="border-collapse text-center">
            <thead>
              <tr>
                <th className="p-1.5 text-xs font-mono text-slate-500"></th>
                <th className="p-1.5 text-xs font-mono text-slate-500">Ø</th>
                {s2.split('').map((c, idx) => (
                  <th key={idx} className="p-1.5 text-xs font-mono text-purple-300">
                    {c} ({idx})
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {step.dp.map((row, rIdx) => (
                <tr key={rIdx}>
                  <td className="p-1.5 text-xs font-mono text-sky-300">
                    {rIdx === 0 ? 'Ø' : `${s1[rIdx - 1]} (${rIdx - 1})`}
                  </td>
                  {row.map((val, cIdx) => {
                    const isCurrent = rIdx === step.i && cIdx === step.j;
                    const isTopSource = step.match1 && rIdx === step.i - 1 && cIdx === step.j;
                    const isLeftSource = step.match2 && rIdx === step.i && cIdx === step.j - 1;

                    let border = 'border-slate-800';
                    let bg = 'bg-slate-950/60';
                    let text = 'text-slate-600';

                    if (isCurrent) {
                      border = 'border-amber-400 ring-2 ring-amber-400/40';
                      bg = 'bg-amber-950/70';
                      text = 'text-amber-200';
                    } else if (isTopSource || isLeftSource) {
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

        {/* Target String s3 Character Sequence */}
        <div className="flex flex-col items-center gap-1.5">
          <span className="text-xs text-slate-400">Target Interleaved String (s3):</span>
          <div className="flex items-center gap-1">
            {s3.split('').map((char, idx) => {
              const isConsumed = idx < step.i + step.j;
              const isCurrent = idx === step.i + step.j - 1;

              return (
                <div
                  key={idx}
                  className={`w-8 h-9 rounded border flex items-center justify-center font-mono text-xs font-bold transition-all ${
                    isCurrent
                      ? 'border-amber-400 bg-amber-950 text-amber-200 ring-1 ring-amber-400/40'
                      : isConsumed
                      ? 'border-emerald-600/60 bg-emerald-950/40 text-emerald-300'
                      : 'border-slate-800 bg-slate-950 text-slate-500'
                  }`}
                >
                  {char}
                </div>
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
