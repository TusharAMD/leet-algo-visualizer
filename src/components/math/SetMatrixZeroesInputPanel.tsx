import React, { useState } from 'react';
import { Play, RotateCcw } from 'lucide-react';

interface SetMatrixZeroesInputPanelProps {
  initialMatrix: number[][];
  onApply: (matrix: number[][]) => void;
}

export const SetMatrixZeroesInputPanel: React.FC<SetMatrixZeroesInputPanelProps> = ({
  initialMatrix,
  onApply,
}) => {
  const [matrixStr, setMatrixStr] = useState<string>(
    JSON.stringify(initialMatrix)
  );

  const presets = [
    {
      label: 'Center Zero: [[1,1,1],[1,0,1],[1,1,1]]',
      matrix: [
        [1, 1, 1],
        [1, 0, 1],
        [1, 1, 1],
      ],
    },
    {
      label: 'Corners: [[0,1,2,0],[3,4,5,2],[1,3,1,5]]',
      matrix: [
        [0, 1, 2, 0],
        [3, 4, 5, 2],
        [1, 3, 1, 5],
      ],
    },
    {
      label: 'Two Zeroes: [[1,2,3,4],[5,0,7,8],[0,10,11,12],[13,14,15,16]]',
      matrix: [
        [1, 2, 3, 4],
        [5, 0, 7, 8],
        [0, 10, 11, 12],
        [13, 14, 15, 16],
      ],
    },
  ];

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const parsed = JSON.parse(matrixStr);
      if (
        Array.isArray(parsed) &&
        parsed.length >= 1 &&
        parsed.every((row) => Array.isArray(row) && row.length === parsed[0].length)
      ) {
        onApply(parsed);
      }
    } catch {
      // ignore
    }
  };

  return (
    <div className="bg-slate-900 border border-slate-800 rounded-xl p-4 flex flex-col gap-4">
      <div className="flex items-center justify-between">
        <h3 className="text-sm font-semibold text-slate-200">Matrix Configuration</h3>
        <span className="text-xs text-slate-400">Set Matrix Zeroes</span>
      </div>

      <form onSubmit={handleSubmit} className="flex flex-col gap-3">
        <div>
          <label className="text-xs text-slate-400 mb-1 block">M x N Matrix JSON</label>
          <input
            type="text"
            value={matrixStr}
            onChange={(e) => setMatrixStr(e.target.value)}
            className="w-full bg-slate-950 border border-slate-700 rounded-lg px-3 py-2 text-sm text-slate-100 font-mono focus:outline-none focus:border-indigo-500"
            placeholder="[[1,1,1],[1,0,1],[1,1,1]]"
          />
        </div>

        <div className="flex gap-2">
          <button
            type="submit"
            className="flex-1 flex items-center justify-center gap-2 bg-indigo-600 hover:bg-indigo-500 text-white font-medium py-2 px-4 rounded-lg text-sm transition"
          >
            <Play className="w-4 h-4" />
            Apply Matrix
          </button>
          <button
            type="button"
            onClick={() => {
              setMatrixStr(JSON.stringify(initialMatrix));
              onApply(initialMatrix);
            }}
            className="flex items-center justify-center bg-slate-800 hover:bg-slate-700 text-slate-300 py-2 px-3 rounded-lg text-sm transition"
            title="Reset to default"
          >
            <RotateCcw className="w-4 h-4" />
          </button>
        </div>
      </form>

      <div className="flex flex-col gap-1.5 pt-2 border-t border-slate-800/80">
        <span className="text-xs text-slate-400 font-medium">Presets:</span>
        <div className="flex flex-wrap gap-1.5">
          {presets.map((preset, idx) => (
            <button
              key={idx}
              onClick={() => {
                setMatrixStr(JSON.stringify(preset.matrix));
                onApply(preset.matrix);
              }}
              className="text-xs bg-slate-800 hover:bg-slate-700 text-slate-300 px-2.5 py-1 rounded-md transition border border-slate-700/60 font-mono"
            >
              {preset.label}
            </button>
          ))}
        </div>
      </div>
    </div>
  );
};
