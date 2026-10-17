import React, { useState } from 'react';
import { Sparkles } from 'lucide-react';

interface SearchMatrix2DInputPanelProps {
  onUpdate: (matrix: number[][], target: number) => void;
  currentMatrix: number[][];
  currentTarget: number;
}

const PRESET_MATRIX_1: number[][] = [
  [1, 3, 5, 7],
  [10, 11, 16, 20],
  [23, 30, 34, 60]
];

export const SearchMatrix2DInputPanel: React.FC<SearchMatrix2DInputPanelProps> = ({
  onUpdate,
  currentMatrix,
  currentTarget
}) => {
  const [targetVal, setTargetVal] = useState(currentTarget);

  const presets = [
    { label: 'Target 3 (True)', target: 3 },
    { label: 'Target 13 (False)', target: 13 },
    { label: 'Target 1 (True, Corner)', target: 1 },
    { label: 'Target 60 (True, End)', target: 60 }
  ];

  return (
    <div className="bg-slate-900/60 border border-slate-800 rounded-xl p-2.5 flex items-center justify-between shrink-0">
      <div className="flex items-center gap-2">
        <span className="text-[10px] uppercase font-mono font-bold tracking-wider text-slate-400">
          Search Target:
        </span>
        <div className="flex items-center gap-1">
          {presets.map((p, idx) => (
            <button
              key={idx}
              onClick={() => {
                setTargetVal(p.target);
                onUpdate(PRESET_MATRIX_1, p.target);
              }}
              className="text-[10px] px-2.5 py-1 rounded bg-slate-800 hover:bg-slate-700 text-slate-300 font-medium transition-colors"
            >
              {p.label}
            </button>
          ))}
        </div>
      </div>

      <div className="flex items-center gap-2">
        <span className="text-xs text-slate-400 font-mono">Custom Target:</span>
        <input
          type="number"
          value={targetVal}
          onChange={(e) => {
            const val = parseInt(e.target.value, 10);
            if (!isNaN(val)) {
              setTargetVal(val);
              onUpdate(PRESET_MATRIX_1, val);
            }
          }}
          className="w-16 bg-slate-950/80 border border-slate-800 rounded-lg px-2 py-0.5 text-xs font-mono text-emerald-400 focus:outline-none"
        />
      </div>
    </div>
  );
};
