import React, { useState } from 'react';
import { Play, RotateCcw } from 'lucide-react';

interface MaximumSubarrayInputPanelProps {
  initialNums: number[];
  onApply: (nums: number[]) => void;
}

export const MaximumSubarrayInputPanel: React.FC<MaximumSubarrayInputPanelProps> = ({
  initialNums,
  onApply,
}) => {
  const [numsStr, setNumsStr] = useState<string>(initialNums.join(', '));

  const presets = [
    { label: 'LeetCode [-2, 1, -3, 4, -1, 2, 1, -5, 4]', nums: [-2, 1, -3, 4, -1, 2, 1, -5, 4] },
    { label: 'Single [1]', nums: [1] },
    { label: 'All Positive [5, 4, -1, 7, 8]', nums: [5, 4, -1, 7, 8] },
    { label: 'All Negative [-3, -2, -1, -4]', nums: [-3, -2, -1, -4] },
    { label: 'Oscillating [-1, 2, -1, 2, -1, 2]', nums: [-1, 2, -1, 2, -1, 2] },
  ];

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const parsed = numsStr
      .split(',')
      .map((x) => parseInt(x.trim(), 10))
      .filter((x) => !isNaN(x));

    if (parsed.length > 0 && parsed.length <= 15) {
      onApply(parsed);
    }
  };

  return (
    <div className="bg-slate-900 border border-slate-800 rounded-xl p-4 flex flex-col gap-4">
      <div className="flex items-center justify-between">
        <h3 className="text-sm font-semibold text-slate-200">Array Configuration</h3>
        <span className="text-xs text-slate-400">Maximum Subarray</span>
      </div>

      <form onSubmit={handleSubmit} className="flex flex-col gap-3">
        <div>
          <label className="text-xs text-slate-400 mb-1 block">Array nums (comma-separated)</label>
          <input
            type="text"
            value={numsStr}
            onChange={(e) => setNumsStr(e.target.value)}
            className="w-full bg-slate-950 border border-slate-700 rounded-lg px-3 py-2 text-sm text-slate-100 font-mono focus:outline-none focus:border-indigo-500"
            placeholder="e.g. -2, 1, -3, 4, -1, 2, 1, -5, 4"
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
                setNumsStr(p.nums.join(', '));
                onApply(p.nums);
              }}
              className="px-2.5 py-1 text-xs rounded bg-slate-800 hover:bg-slate-700 text-slate-300 border border-slate-700 transition-colors"
            >
              {p.label}
            </button>
          ))}
          <button
            onClick={() => {
              setNumsStr(initialNums.join(', '));
              onApply(initialNums);
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
