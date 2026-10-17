import React, { useState } from 'react';
import { Play, RotateCcw } from 'lucide-react';

interface LongestIncreasingPathInputPanelProps {
  initialMatrix: number[][];
  onApply: (matrix: number[][]) => void;
}

export const LongestIncreasingPathInputPanel: React.FC<LongestIncreasingPathInputPanelProps> = ({
  initialMatrix,
  onApply,
}) => {
  const [matrixText, setMatrixText] = useState<string>(
    initialMatrix.map((row) => row.join(', ')).join('\n')
  );

  const presets = [
    {
      label: 'LeetCode 3x3 Standard',
      mat: [
        [9, 9, 4],
        [6, 6, 8],
        [2, 1, 1],
      ],
    },
    {
      label: 'Strict Diagonal 3x3',
      mat: [
        [3, 4, 5],
        [3, 2, 6],
        [2, 2, 1],
      ],
    },
    {
      label: '2x2 Simple',
      mat: [
        [1, 2],
        [4, 3],
      ],
    },
    {
      label: 'All Equal (Length 1)',
      mat: [
        [7, 7, 7],
        [7, 7, 7],
      ],
    },
  ];

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const rows = matrixText
        .trim()
        .split('\n')
        .map((line) =>
          line
            .split(',')
            .map((x) => parseInt(x.trim(), 10))
            .filter((x) => !isNaN(x))
        )
        .filter((r) => r.length > 0);

      if (rows.length > 0 && rows[0].length > 0) {
        const colLen = rows[0].length;
        if (rows.every((r) => r.length === colLen) && rows.length <= 5 && colLen <= 5) {
          onApply(rows);
        }
      }
    } catch {}
  };

  return (
    <div className="bg-slate-900 border border-slate-800 rounded-xl p-4 flex flex-col gap-4">
      <div className="flex items-center justify-between">
        <h3 className="text-sm font-semibold text-slate-200">Matrix Input</h3>
        <span className="text-xs text-slate-400">Longest Increasing Path</span>
      </div>

      <form onSubmit={handleSubmit} className="flex flex-col gap-3">
        <div>
          <label className="text-xs text-slate-400 mb-1 block">
            Matrix Rows (1 line per row, comma-separated, max 5x5)
          </label>
          <textarea
            rows={3}
            value={matrixText}
            onChange={(e) => setMatrixText(e.target.value)}
            className="w-full bg-slate-950 border border-slate-700 rounded-lg px-3 py-2 text-sm text-slate-100 font-mono focus:outline-none focus:border-indigo-500"
          />
        </div>

        <button
          type="submit"
          className="flex items-center justify-center gap-2 bg-indigo-600 hover:bg-indigo-500 text-white rounded-lg py-2 text-sm font-medium transition-colors"
        >
          <Play className="w-4 h-4" /> Apply & Run
        </button>
      </form>

      {/* Presets */}
      <div>
        <span className="text-xs text-slate-400 mb-2 block font-medium">Quick Presets</span>
        <div className="flex flex-wrap gap-1.5">
          {presets.map((p, idx) => (
            <button
              key={idx}
              onClick={() => {
                setMatrixText(p.mat.map((r) => r.join(', ')).join('\n'));
                onApply(p.mat);
              }}
              className="px-2.5 py-1 text-xs rounded bg-slate-800 hover:bg-slate-700 text-slate-300 border border-slate-700 transition-colors"
            >
              {p.label}
            </button>
          ))}
          <button
            onClick={() => {
              setMatrixText(initialMatrix.map((r) => r.join(', ')).join('\n'));
              onApply(initialMatrix);
            }}
            className="px-2.5 py-1 text-xs rounded bg-slate-800 hover:bg-slate-700 text-slate-400 border border-slate-700 flex items-center gap-1"
          >
            <RotateCcw className="w-3 h-3" /> Reset
          </button>
        </div>
      </div>
    </div>
  );
};
