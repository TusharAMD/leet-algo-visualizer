import React, { useState } from 'react';
import { Sparkles } from 'lucide-react';

interface ContainerWithWaterInputPanelProps {
  onUpdate: (heights: number[]) => void;
  currentHeights: number[];
}

export const ContainerWithWaterInputPanel: React.FC<ContainerWithWaterInputPanelProps> = ({
  onUpdate,
  currentHeights
}) => {
  const [inputVal, setInputVal] = useState(currentHeights.join(', '));

  const presets = [
    { label: 'Classic [1,8,6,2,5,4,8,3,7]', heights: [1, 8, 6, 2, 5, 4, 8, 3, 7] },
    { label: 'Two Walls [1, 1]', heights: [1, 1] },
    { label: 'Ascending [1, 2, 3, 4, 5, 6]', heights: [1, 2, 3, 4, 5, 6] },
    { label: 'Valley [8, 2, 1, 2, 8]', heights: [8, 2, 1, 2, 8] }
  ];

  const handleApply = (e: React.FormEvent) => {
    e.preventDefault();
    const parsed = inputVal
      .split(',')
      .map((s) => parseInt(s.trim(), 10))
      .filter((n) => !isNaN(n) && n >= 0);

    if (parsed.length >= 2) {
      onUpdate(parsed);
    }
  };

  return (
    <div className="bg-slate-900/60 border border-slate-800 rounded-xl p-2.5 flex flex-col gap-2 shrink-0">
      <div className="flex items-center justify-between">
        <span className="text-[10px] uppercase font-mono font-bold tracking-wider text-slate-400">
          Wall Heights:
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
          placeholder="e.g. 1, 8, 6, 2, 5, 4, 8, 3, 7"
          className="flex-1 bg-slate-950/80 border border-slate-800 rounded-lg px-2.5 py-1 text-xs font-mono text-slate-200 focus:outline-none focus:border-sky-500/50"
        />
        <button
          type="submit"
          className="px-3 py-1 rounded-lg bg-sky-500 hover:bg-sky-400 text-slate-950 font-semibold text-xs transition-colors flex items-center gap-1 shadow-md shadow-sky-500/20"
        >
          <Sparkles className="w-3.5 h-3.5" /> Visualize
        </button>
      </form>
    </div>
  );
};
