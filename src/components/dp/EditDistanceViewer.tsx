import React from 'react';
import type { EditDistanceStep } from '../../algorithms/editDistanceIntuitive';

interface EditDistanceViewerProps {
  step: EditDistanceStep;
  word1: string;
  word2: string;
}

export const EditDistanceViewer: React.FC<EditDistanceViewerProps> = ({
  step,
  word1,
  word2,
}) => {
  const m = word1.length;
  const n = word2.length;

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
          <span className="text-xs text-slate-400 font-medium">Comparing Characters</span>
          <span className="text-sm font-mono font-bold text-amber-300">
            {step.char1 ? `'${step.char1}' vs '${step.char2}'` : '—'}
          </span>
        </div>
        <div className="bg-slate-900 border border-slate-800 rounded-xl p-3 flex flex-col justify-center">
          <span className="text-xs text-slate-400 font-medium">Optimal Operation</span>
          <span className="text-sm font-bold text-indigo-300 capitalize">
            {step.chosenOp}
          </span>
        </div>
        <div className="bg-slate-900 border border-slate-800 rounded-xl p-3 flex flex-col justify-center">
          <span className="text-xs text-slate-400 font-medium">Min Edit Distance</span>
          <span className="text-2xl font-mono font-black text-emerald-400">
            {step.dp[m]?.[n] ?? 0}
          </span>
        </div>
      </div>

      {/* Main Dual Grid & 3-Choice Panel */}
      <div className="flex-1 bg-slate-900/60 border border-slate-800 rounded-xl p-6 flex flex-col justify-center items-center gap-6 relative overflow-auto">
        <div className="text-xs font-semibold text-slate-400 uppercase tracking-wider">
          Levenshtein Distance Dynamic Matrix
        </div>

        {/* Matrix Grid with Headers */}
        <div className="overflow-auto max-w-full">
          <table className="border-collapse text-center">
            <thead>
              <tr>
                <th className="p-1.5 text-xs font-mono text-slate-500"></th>
                <th className="p-1.5 text-xs font-mono text-slate-500">Ø</th>
                {word2.split('').map((char, idx) => (
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
                    {rIdx === 0 ? 'Ø' : word1[rIdx - 1]}
                  </td>
                  {row.map((val, cIdx) => {
                    const isCurrent = rIdx === step.i && cIdx === step.j;
                    const isDiag = rIdx === step.i - 1 && cIdx === step.j - 1;
                    const isTop = rIdx === step.i - 1 && cIdx === step.j;
                    const isLeft = rIdx === step.i && cIdx === step.j - 1;

                    let border = 'border-slate-800';
                    let bg = 'bg-slate-950/60';
                    let text = 'text-slate-400';

                    if (isCurrent) {
                      border = 'border-amber-400 ring-2 ring-amber-400/40';
                      bg = 'bg-amber-950/70';
                      text = 'text-amber-200';
                    } else if (isDiag && (step.isMatch || step.chosenOp === 'replace')) {
                      border = 'border-emerald-400 ring-2 ring-emerald-400/30';
                      bg = 'bg-emerald-950/50';
                      text = 'text-emerald-300';
                    } else if (isTop && step.chosenOp === 'delete') {
                      border = 'border-rose-400/80';
                      bg = 'bg-rose-950/40';
                      text = 'text-rose-300';
                    } else if (isLeft && step.chosenOp === 'insert') {
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

        {/* 3 Operations Breakdown */}
        {step.char1 && (
          <div className="grid grid-cols-3 gap-3 w-full max-w-lg">
            <div
              className={`p-2.5 rounded-xl border text-center font-mono text-xs ${
                step.chosenOp === 'delete'
                  ? 'border-rose-400 bg-rose-950/50 text-rose-200'
                  : 'border-slate-800 bg-slate-950/60 text-slate-400'
              }`}
            >
              <span className="block text-[10px] uppercase font-sans text-slate-500">Delete (Top)</span>
              <span>1 + {step.deleteCost}</span>
            </div>
            <div
              className={`p-2.5 rounded-xl border text-center font-mono text-xs ${
                step.chosenOp === 'insert'
                  ? 'border-sky-400 bg-sky-950/50 text-sky-200'
                  : 'border-slate-800 bg-slate-950/60 text-slate-400'
              }`}
            >
              <span className="block text-[10px] uppercase font-sans text-slate-500">Insert (Left)</span>
              <span>1 + {step.insertCost}</span>
            </div>
            <div
              className={`p-2.5 rounded-xl border text-center font-mono text-xs ${
                step.chosenOp === 'replace' || step.chosenOp === 'match'
                  ? 'border-emerald-400 bg-emerald-950/50 text-emerald-200'
                  : 'border-slate-800 bg-slate-950/60 text-slate-400'
              }`}
            >
              <span className="block text-[10px] uppercase font-sans text-slate-500">
                {step.isMatch ? 'Match (Diag)' : 'Replace (Diag)'}
              </span>
              <span>{step.isMatch ? step.replaceCost : `1 + ${step.replaceCost}`}</span>
            </div>
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
