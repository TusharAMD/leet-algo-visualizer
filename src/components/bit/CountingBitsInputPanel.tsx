import React, { useState } from 'react';
import { Play, RotateCcw } from 'lucide-react';

interface CountingBitsInputPanelProps {
  initialN: number;
  onApply: (n: number) => void;
}

export const CountingBitsInputPanel: React.FC<CountingBitsInputPanelProps> = ({
  initialN,
  onApply,
}) => {
  const [nVal, setNVal] = useState<number>(initialN);

  const presets = [
    { label: 'n = 5 -> [0, 1, 1, 2, 1, 2]', n: 5 },
    { label: 'n = 2 -> [0, 1, 1]', n: 2 },
    { label: 'n = 8 -> 9 numbers', n: 8 },
    { label: 'n = 12 -> 13 numbers', n: 12 },
    { label: 'n = 15 -> 16 numbers', n: 15 },
  ];

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!isNaN(nVal) && nVal >= 0 && nVal <= 30) {
      onApply(nVal);
    }
  };

  return (
    <div className="bg-slate-900 border border-slate-800 rounded-xl p-4 flex flex-col gap-4">
      <div className="flex items-center justify-between">
        <h3 className="text-sm font-semibold text-slate-200">DP Range Limit</h3>
        <span className="text-xs text-slate-400">Counting Bits</span>
      </div>

      <form onSubmit={handleSubmit} className="flex flex-col gap-3">
        <div>
          <label className="text-xs text-slate-400 mb-1 block">Upper Bound n (0 to 20 for optimal visualization)</label>
          <input
            type="number"
            min={0}
            max={25}
            value={nVal}
            onChange={(e) => setNVal(parseInt(e.target.value, 10) || 0)}
            className="w-full bg-slate-950 border border-slate-700 rounded-lg px-3 py-2 text-sm text-slate-100 font-mono focus:outline-none focus:border-indigo-500"
            placeholder="5"
          />
        </div>

        <div className="flex gap-2">
          <button
            type="submit"
            className="flex-1 flex items-center justify-center gap-2 bg-indigo-600 hover:bg-indigo-500 text-white font-medium py-2 px-4 rounded-lg text-sm transition"
          >
            <Play className="w-4 h-4" />
            Compute DP Table
          </button>
          <button
            type="button"
            onClick={() => {
              setNVal(initialN);
              onApply(initialN);
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
                setNVal(preset.n);
                onApply(preset.n);
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
