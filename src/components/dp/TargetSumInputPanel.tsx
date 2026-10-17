import React, { useState } from 'react';
import { Play, RotateCcw } from 'lucide-react';

interface TargetSumInputPanelProps {
  initialNums: number[];
  initialTarget: number;
  onApply: (nums: number[], target: number) => void;
}

export const TargetSumInputPanel: React.FC<TargetSumInputPanelProps> = ({
  initialNums,
  initialTarget,
  onApply,
}) => {
  const [numsStr, setNumsStr] = useState<string>(initialNums.join(', '));
  const [target, setTarget] = useState<number>(initialTarget);

  const presets = [
    { label: '[1, 1, 1, 1, 1], target=3', nums: [1, 1, 1, 1, 1], target: 3 },
    { label: '[1], target=1', nums: [1], target: 1 },
    { label: '[1, 2, 3, 2], target=2', nums: [1, 2, 3, 2], target: 2 },
    { label: '[2, 3, 5], target=0', nums: [2, 3, 5], target: 0 },
  ];

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const parsedNums = numsStr
      .split(',')
      .map((x) => parseInt(x.trim(), 10))
      .filter((x) => !isNaN(x) && x >= 0);

    if (parsedNums.length > 0 && parsedNums.length <= 10) {
      onApply(parsedNums, target);
    }
  };

  return (
    <div className="bg-slate-900 border border-slate-800 rounded-xl p-4 flex flex-col gap-4">
      <div className="flex items-center justify-between">
        <h3 className="text-sm font-semibold text-slate-200">Input Configuration</h3>
        <span className="text-xs text-slate-400">Target Sum</span>
      </div>

      <form onSubmit={handleSubmit} className="flex flex-col gap-3">
        <div>
          <label className="text-xs text-slate-400 mb-1 block">Array nums (max 10 elements)</label>
          <input
            type="text"
            value={numsStr}
            onChange={(e) => setNumsStr(e.target.value)}
            className="w-full bg-slate-950 border border-slate-700 rounded-lg px-3 py-2 text-sm text-slate-100 font-mono focus:outline-none focus:border-indigo-500"
            placeholder="e.g. 1, 1, 1, 1, 1"
          />
        </div>

        <div>
          <label className="text-xs text-slate-400 mb-1 block">Target Value</label>
          <input
            type="number"
            value={target}
            onChange={(e) => setTarget(parseInt(e.target.value, 10) || 0)}
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
                setNumsStr(p.nums.join(', '));
                setTarget(p.target);
                onApply(p.nums, p.target);
              }}
              className="px-2.5 py-1 text-xs rounded bg-slate-800 hover:bg-slate-700 text-slate-300 border border-slate-700 transition-colors"
            >
              {p.label}
            </button>
          ))}
          <button
            onClick={() => {
              setNumsStr(initialNums.join(', '));
              setTarget(initialTarget);
              onApply(initialNums, initialTarget);
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
