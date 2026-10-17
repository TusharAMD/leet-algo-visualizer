import React, { useState } from 'react';
import { Play, RotateCcw } from 'lucide-react';

interface HandOfStraightsInputPanelProps {
  initialHand: number[];
  initialGroupSize: number;
  onApply: (hand: number[], groupSize: number) => void;
}

export const HandOfStraightsInputPanel: React.FC<HandOfStraightsInputPanelProps> = ({
  initialHand,
  initialGroupSize,
  onApply,
}) => {
  const [handStr, setHandStr] = useState<string>(initialHand.join(', '));
  const [groupSize, setGroupSize] = useState<number>(initialGroupSize);

  const presets = [
    { label: 'Standard: [1,2,3,6,2,3,4,7,8], size=3', hand: [1, 2, 3, 6, 2, 3, 4, 7, 8], size: 3 },
    { label: 'Impossible: [1,2,3,4,5], size=4', hand: [1, 2, 3, 4, 5], size: 4 },
    { label: 'Pairs: [1,2,2,3], size=2', hand: [1, 2, 2, 3], size: 2 },
    { label: 'Duplicates: [8,10,12], size=3', hand: [8, 10, 12], size: 3 },
  ];

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const parsed = handStr
      .split(',')
      .map((x) => parseInt(x.trim(), 10))
      .filter((x) => !isNaN(x) && x >= 0);

    if (parsed.length > 0 && groupSize > 0 && groupSize <= parsed.length) {
      onApply(parsed, groupSize);
    }
  };

  return (
    <div className="bg-slate-900 border border-slate-800 rounded-xl p-4 flex flex-col gap-4">
      <div className="flex items-center justify-between">
        <h3 className="text-sm font-semibold text-slate-200">Hand Configuration</h3>
        <span className="text-xs text-slate-400">Hand of Straights</span>
      </div>

      <form onSubmit={handleSubmit} className="flex flex-col gap-3">
        <div>
          <label className="text-xs text-slate-400 mb-1 block">Hand Cards (comma-separated)</label>
          <input
            type="text"
            value={handStr}
            onChange={(e) => setHandStr(e.target.value)}
            className="w-full bg-slate-950 border border-slate-700 rounded-lg px-3 py-2 text-sm text-slate-100 font-mono focus:outline-none focus:border-indigo-500"
            placeholder="e.g. 1, 2, 3, 6, 2, 3, 4, 7, 8"
          />
        </div>

        <div>
          <label className="text-xs text-slate-400 mb-1 block">Group Size</label>
          <input
            type="number"
            min={1}
            max={10}
            value={groupSize}
            onChange={(e) => setGroupSize(parseInt(e.target.value, 10) || 1)}
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
                setHandStr(p.hand.join(', '));
                setGroupSize(p.size);
                onApply(p.hand, p.size);
              }}
              className="px-2.5 py-1 text-xs rounded bg-slate-800 hover:bg-slate-700 text-slate-300 border border-slate-700 transition-colors"
            >
              {p.label}
            </button>
          ))}
          <button
            onClick={() => {
              setHandStr(initialHand.join(', '));
              setGroupSize(initialGroupSize);
              onApply(initialHand, initialGroupSize);
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
