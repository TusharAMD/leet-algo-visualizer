import React, { useState } from 'react';
import { Play, RotateCcw } from 'lucide-react';

interface SingleNumberInputPanelProps {
  initialNums: number[];
  onApply: (nums: number[]) => void;
}

export const SingleNumberInputPanel: React.FC<SingleNumberInputPanelProps> = ({
  initialNums,
  onApply,
}) => {
  const [numsStr, setNumsStr] = useState<string>(
    initialNums.join(', ')
  );

  const presets = [
    { label: '[2, 2, 1] -> 1', nums: [2, 2, 1] },
    { label: '[4, 1, 2, 1, 2] -> 4', nums: [4, 1, 2, 1, 2] },
    { label: '[1] -> 1', nums: [1] },
    { label: '[7, 3, 5, 3, 7] -> 5', nums: [7, 3, 5, 3, 7] },
    { label: '[10, 20, 10, 30, 20] -> 30', nums: [10, 20, 10, 30, 20] },
  ];

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const parsed = numsStr
      .split(',')
      .map((x) => parseInt(x.trim(), 10))
      .filter((x) => !isNaN(x));

    if (parsed.length > 0) {
      onApply(parsed);
    }
  };

  return (
    <div className="bg-slate-900 border border-slate-800 rounded-xl p-4 flex flex-col gap-4">
      <div className="flex items-center justify-between">
        <h3 className="text-sm font-semibold text-slate-200">Array Configuration</h3>
        <span className="text-xs text-slate-400">Single Number</span>
      </div>

      <form onSubmit={handleSubmit} className="flex flex-col gap-3">
        <div>
          <label className="text-xs text-slate-400 mb-1 block">Array (comma-separated integers with pairs + 1 single)</label>
          <input
            type="text"
            value={numsStr}
            onChange={(e) => setNumsStr(e.target.value)}
            className="w-full bg-slate-950 border border-slate-700 rounded-lg px-3 py-2 text-sm text-slate-100 font-mono focus:outline-none focus:border-indigo-500"
            placeholder="4, 1, 2, 1, 2"
          />
        </div>

        <div className="flex gap-2">
          <button
            type="submit"
            className="flex-1 flex items-center justify-center gap-2 bg-indigo-600 hover:bg-indigo-500 text-white font-medium py-2 px-4 rounded-lg text-sm transition"
          >
            <Play className="w-4 h-4" />
            Apply Numbers
          </button>
          <button
            type="button"
            onClick={() => {
              setNumsStr(initialNums.join(', '));
              onApply(initialNums);
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
                setNumsStr(preset.nums.join(', '));
                onApply(preset.nums);
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
