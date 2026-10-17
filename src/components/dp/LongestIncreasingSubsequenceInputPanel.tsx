import React, { useState } from 'react';
import { Play, RotateCcw } from 'lucide-react';

interface LongestIncreasingSubsequenceInputPanelProps {
  initialNums: number[];
  onApply: (nums: number[]) => void;
}

export const LongestIncreasingSubsequenceInputPanel: React.FC<LongestIncreasingSubsequenceInputPanelProps> = ({
  initialNums,
  onApply,
}) => {
  const [inputVal, setInputVal] = useState<string>(initialNums.join(', '));

  const presets = [
    { label: 'LeetCode [10, 9, 2, 5, 3, 7, 101, 18]', val: [10, 9, 2, 5, 3, 7, 101, 18] },
    { label: 'All Increasing [0, 1, 0, 3, 2, 3]', val: [0, 1, 0, 3, 2, 3] },
    { label: 'Duplicates [7, 7, 7, 7, 7]', val: [7, 7, 7, 7, 7] },
    { label: 'Decreasing [5, 4, 3, 2, 1]', val: [5, 4, 3, 2, 1] },
    { label: 'Small [3, 10, 2, 1, 20]', val: [3, 10, 2, 1, 20] },
  ];

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const parsed = inputVal
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
        <h3 className="text-sm font-semibold text-slate-200">Input Configuration</h3>
        <span className="text-xs text-slate-400">Longest Increasing Subsequence</span>
      </div>

      <form onSubmit={handleSubmit} className="flex flex-col gap-3">
        <div>
          <label className="text-xs text-slate-400 mb-1 block">Array nums (comma separated)</label>
          <input
            type="text"
            value={inputVal}
            onChange={(e) => setInputVal(e.target.value)}
            className="w-full bg-slate-950 border border-slate-700 rounded-lg px-3 py-2 text-sm text-slate-100 font-mono focus:outline-none focus:border-indigo-500"
            placeholder="e.g. 10, 9, 2, 5, 3, 7, 101, 18"
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
                setInputVal(p.val.join(', '));
                onApply(p.val);
              }}
              className="px-2.5 py-1 text-xs rounded bg-slate-800 hover:bg-slate-700 text-slate-300 border border-slate-700 transition-colors"
            >
              {p.label}
            </button>
          ))}
          <button
            onClick={() => {
              setInputVal(initialNums.join(', '));
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
