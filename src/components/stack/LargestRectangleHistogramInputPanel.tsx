import React, { useState } from 'react';
import { Sparkles } from 'lucide-react';

interface LargestRectangleHistogramInputPanelProps {
  onUpdate: (heights: number[]) => void;
  currentHeights: number[];
}

export const LargestRectangleHistogramInputPanel: React.FC<LargestRectangleHistogramInputPanelProps> = ({
  onUpdate,
  currentHeights
}) => {
  const [inputVal, setInputVal] = useState(currentHeights.join(', '));

  const presets = [
    { label: 'Classic [2, 1, 5, 6, 2, 3] (10)', heights: [2, 1, 5, 6, 2, 3] },
    { label: 'Two Bars [2, 4] (4)', heights: [2, 4] },
    { label: 'Ascending [1, 2, 3, 4, 5] (9)', heights: [1, 2, 3, 4, 5] },
    { label: 'Plateau [4, 4, 4, 4] (16)', heights: [4, 4, 4, 4] }
  ];

  const handleApply = (e: React.FormEvent) => {
    e.preventDefault();
    const parsed = inputVal
      .split(',')
      .map((s) => parseInt(s.trim(), 10))
      .filter((n) => !isNaN(n) && n >= 0);

    if (parsed.length > 0) {
      onUpdate(parsed);
    }
  };

  return (
    <div className="bg-slate-900/60 border border-slate-800 rounded-xl p-2.5 flex flex-col gap-2 shrink-0">
      <div className="flex items-center justify-between">
        <span className="text-[10px] uppercase font-mono font-bold tracking-wider text-slate-400">
          Bar Heights:
        </span>
        <div className="flex items-center gap-1">
          {presets.map((p, idx) => (
            <button
              key={idx}
              onClick={() => {
                setInputVal(p.heights.join(', '));
                onUpdate(p.heights);
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
          value={inputVal}
          onChange={(e) => setInputVal(e.target.value)}
          placeholder="e.g. 2, 1, 5, 6, 2, 3"
          className="flex-1 bg-slate-950/80 border border-slate-800 rounded-lg px-2.5 py-1 text-xs font-mono text-slate-200 focus:outline-none focus:border-indigo-500/50"
        />
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
