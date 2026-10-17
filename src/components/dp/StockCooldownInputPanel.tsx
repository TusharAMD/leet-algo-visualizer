import React, { useState } from 'react';
import { Play, RotateCcw } from 'lucide-react';

interface StockCooldownInputPanelProps {
  initialPrices: number[];
  onApply: (prices: number[]) => void;
}

export const StockCooldownInputPanel: React.FC<StockCooldownInputPanelProps> = ({
  initialPrices,
  onApply,
}) => {
  const [inputVal, setInputVal] = useState<string>(initialPrices.join(', '));

  const presets = [
    { label: '[1, 2, 3, 0, 2] (Standard)', val: [1, 2, 3, 0, 2] },
    { label: '[1] (Single Day)', val: [1] },
    { label: '[1, 2, 4]', val: [1, 2, 4] },
    { label: '[2, 1, 4, 5, 2, 9, 7]', val: [2, 1, 4, 5, 2, 9, 7] },
    { label: '[6, 5, 4, 3, 2, 1] (Downtrend)', val: [6, 5, 4, 3, 2, 1] },
  ];

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const parsed = inputVal
      .split(',')
      .map((x) => parseInt(x.trim(), 10))
      .filter((x) => !isNaN(x) && x >= 0);

    if (parsed.length > 0) {
      onApply(parsed);
    }
  };

  return (
    <div className="bg-slate-900 border border-slate-800 rounded-xl p-4 flex flex-col gap-4">
      <div className="flex items-center justify-between">
        <h3 className="text-sm font-semibold text-slate-200">Stock Prices</h3>
        <span className="text-xs text-slate-400">Stock with Cooldown</span>
      </div>

      <form onSubmit={handleSubmit} className="flex flex-col gap-3">
        <div>
          <label className="text-xs text-slate-400 mb-1 block">Prices per Day</label>
          <input
            type="text"
            value={inputVal}
            onChange={(e) => setInputVal(e.target.value)}
            className="w-full bg-slate-950 border border-slate-700 rounded-lg px-3 py-2 text-sm text-slate-100 font-mono focus:outline-none focus:border-indigo-500"
            placeholder="e.g. 1, 2, 3, 0, 2"
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
              setInputVal(initialPrices.join(', '));
              onApply(initialPrices);
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
