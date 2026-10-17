import React, { useState } from 'react';
import { Sparkles } from 'lucide-react';

interface SlidingWindowMaxInputPanelProps {
  onUpdate: (nums: number[], k: number) => void;
  currentNums: number[];
  currentK: number;
}

export const SlidingWindowMaxInputPanel: React.FC<SlidingWindowMaxInputPanelProps> = ({
  onUpdate,
  currentNums,
  currentK
}) => {
  const [numsStr, setNumsStr] = useState(currentNums.join(', '));
  const [kVal, setKVal] = useState(currentK);

  const presets = [
    { label: 'Standard [1,3,-1,-3,5,3,6,7], k=3', nums: [1, 3, -1, -3, 5, 3, 6, 7], k: 3 },
    { label: 'Single [1], k=1', nums: [1], k: 1 },
    { label: 'Ascending [1, 2, 3, 4, 5], k=3', nums: [1, 2, 3, 4, 5], k: 3 },
    { label: 'Descending [9, 8, 7, 6, 5], k=3', nums: [9, 8, 7, 6, 5], k: 3 }
  ];

  const handleApply = (e: React.FormEvent) => {
    e.preventDefault();
    const parsed = numsStr
      .split(',')
      .map((s) => parseInt(s.trim(), 10))
      .filter((n) => !isNaN(n));

    if (parsed.length > 0 && kVal > 0) {
      onUpdate(parsed, Math.min(kVal, parsed.length));
    }
  };

  return (
    <div className="bg-slate-900/60 border border-slate-800 rounded-xl p-2.5 flex flex-col gap-2 shrink-0">
      <div className="flex items-center justify-between">
        <span className="text-[10px] uppercase font-mono font-bold tracking-wider text-slate-400">
          Array & Window Size k:
        </span>
        <div className="flex items-center gap-1">
          {presets.map((p, idx) => (
            <button
              key={idx}
              onClick={() => {
                setNumsStr(p.nums.join(', '));
                setKVal(p.k);
                onUpdate(p.nums, p.k);
              }}
              className="text-[10px] px-2 py-0.5 rounded bg-slate-800 hover:bg-slate-700 text-slate-300 font-medium transition-colors"
            >
              {p.label.split(' ')[0]}
            </button>
          ))}
        </div>
      </div>

      <form onSubmit={handleApply} className="flex items-center gap-2">
        <input
          type="text"
          value={numsStr}
          onChange={(e) => setNumsStr(e.target.value)}
          placeholder="e.g. 1, 3, -1, -3, 5, 3, 6, 7"
          className="flex-1 bg-slate-950/80 border border-slate-800 rounded-lg px-2.5 py-1 text-xs font-mono text-slate-200 focus:outline-none focus:border-indigo-500/50"
        />
        <div className="flex items-center gap-1 bg-slate-950/80 border border-slate-800 rounded-lg px-2 py-1">
          <span className="text-[10px] font-mono text-slate-400">k:</span>
          <input
            type="number"
            min={1}
            max={10}
            value={kVal}
            onChange={(e) => setKVal(parseInt(e.target.value, 10) || 1)}
            className="w-10 bg-transparent text-xs font-mono text-indigo-400 focus:outline-none"
          />
        </div>
        <button
          type="submit"
          className="px-3 py-1 rounded-lg bg-indigo-500 hover:bg-indigo-400 text-white font-semibold text-xs transition-colors flex items-center gap-1 shadow-md shadow-indigo-500/20"
        >
          <Sparkles className="w-3.5 h-3.5" /> Visualize
        </button>
      </form>
    </div>
  );
};
