import React, { useState } from 'react';
import { Sparkles } from 'lucide-react';

interface LongestConsecutiveInputPanelProps {
  onUpdate: (nums: number[]) => void;
  currentNums: number[];
}

export const LongestConsecutiveInputPanel: React.FC<LongestConsecutiveInputPanelProps> = ({
  onUpdate,
  currentNums
}) => {
  const [inputStr, setInputStr] = useState(currentNums.join(', '));

  const presets = [
    { label: 'Classic [100, 4, 200, 1, 3, 2]', nums: [100, 4, 200, 1, 3, 2] },
    { label: 'Long [0,3,7,2,5,8,4,6,0,1]', nums: [0, 3, 7, 2, 5, 8, 4, 6, 0, 1] },
    { label: 'Duplicates [1, 2, 0, 1]', nums: [1, 2, 0, 1] },
    { label: 'Single [99]', nums: [99] }
  ];

  const handleApply = (e: React.FormEvent) => {
    e.preventDefault();
    const parsed = inputStr
      .split(',')
      .map((s) => parseInt(s.trim(), 10))
      .filter((n) => !isNaN(n));

    if (parsed.length > 0) {
      onUpdate(parsed);
    }
  };

  return (
    <div className="bg-slate-900/60 border border-slate-800 rounded-xl p-2.5 flex flex-col gap-2 shrink-0">
      <div className="flex items-center justify-between">
        <span className="text-[10px] uppercase font-mono font-bold tracking-wider text-slate-400">
          Custom Array:
        </span>
        <div className="flex items-center gap-1">
          {presets.map((p, idx) => (
            <button
              key={idx}
              onClick={() => {
                setInputStr(p.nums.join(', '));
                onUpdate(p.nums);
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
          value={inputStr}
          onChange={(e) => setInputStr(e.target.value)}
          placeholder="e.g. 100, 4, 200, 1, 3, 2"
          className="flex-1 bg-slate-950/80 border border-slate-800 rounded-lg px-2.5 py-1 text-xs font-mono text-slate-200 focus:outline-none focus:border-emerald-500/50"
        />
        <button
          type="submit"
          className="px-3 py-1 rounded-lg bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-semibold text-xs transition-colors flex items-center gap-1 shadow-md shadow-emerald-500/20"
        >
          <Sparkles className="w-3.5 h-3.5" /> Visualize
        </button>
      </form>
    </div>
  );
};
