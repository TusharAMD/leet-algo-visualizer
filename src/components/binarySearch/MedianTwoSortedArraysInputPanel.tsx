import React, { useState } from 'react';
import { Sparkles } from 'lucide-react';

interface MedianTwoSortedArraysInputPanelProps {
  onUpdate: (nums1: number[], nums2: number[]) => void;
  currentNums1: number[];
  currentNums2: number[];
}

export const MedianTwoSortedArraysInputPanel: React.FC<MedianTwoSortedArraysInputPanelProps> = ({
  onUpdate,
  currentNums1,
  currentNums2
}) => {
  const [str1, setStr1] = useState(currentNums1.join(', '));
  const [str2, setStr2] = useState(currentNums2.join(', '));

  const presets = [
    { label: 'Odd Total [1, 3] & [2] (2)', nums1: [1, 3], nums2: [2] },
    { label: 'Even Total [1, 2] & [3, 4] (2.5)', nums1: [1, 2], nums2: [3, 4] },
    { label: 'Disjoint [1, 2, 3] & [4, 5, 6] (3.5)', nums1: [1, 2, 3], nums2: [4, 5, 6] },
    { label: 'Single [0, 0] & [0, 0] (0)', nums1: [0, 0], nums2: [0, 0] }
  ];

  const handleApply = (e: React.FormEvent) => {
    e.preventDefault();
    const p1 = str1.split(',').map((s) => parseInt(s.trim(), 10)).filter((n) => !isNaN(n));
    const p2 = str2.split(',').map((s) => parseInt(s.trim(), 10)).filter((n) => !isNaN(n));

    if (p1.length + p2.length > 0) {
      onUpdate(p1.sort((a, b) => a - b), p2.sort((a, b) => a - b));
    }
  };

  return (
    <div className="bg-slate-900/60 border border-slate-800 rounded-xl p-2.5 flex flex-col gap-2 shrink-0">
      <div className="flex items-center justify-between">
        <span className="text-[10px] uppercase font-mono font-bold tracking-wider text-slate-400">
          Two Sorted Arrays:
        </span>
        <div className="flex items-center gap-1">
          {presets.map((p, idx) => (
            <button
              key={idx}
              onClick={() => {
                setStr1(p.nums1.join(', '));
                setStr2(p.nums2.join(', '));
                onUpdate(p.nums1, p.nums2);
              }}
              className="text-[10px] px-2 py-0.5 rounded bg-slate-800 hover:bg-slate-700 text-slate-300 font-medium transition-colors"
            >
              {p.label.split(' ')[0]}
            </button>
          ))}
        </div>
      </div>

      <form onSubmit={handleApply} className="flex items-center gap-2">
        <div className="flex-1 flex items-center gap-1 bg-slate-950/80 border border-slate-800 rounded-lg px-2.5 py-1">
          <span className="text-[10px] font-mono text-slate-400">nums1:</span>
          <input
            type="text"
            value={str1}
            onChange={(e) => setStr1(e.target.value)}
            placeholder="e.g. 1, 3"
            className="flex-1 bg-transparent text-xs font-mono text-indigo-300 focus:outline-none"
          />
        </div>
        <div className="flex-1 flex items-center gap-1 bg-slate-950/80 border border-slate-800 rounded-lg px-2.5 py-1">
          <span className="text-[10px] font-mono text-slate-400">nums2:</span>
          <input
            type="text"
            value={str2}
            onChange={(e) => setStr2(e.target.value)}
            placeholder="e.g. 2"
            className="flex-1 bg-transparent text-xs font-mono text-cyan-300 focus:outline-none"
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
