import React, { useState } from 'react';
import { RotateCcw, Lightbulb } from 'lucide-react';

interface StockInputPanelProps {
  prices: number[];
  setPrices: (p: number[]) => void;
  onResetToDefaults: () => void;
}

export const StockInputPanel: React.FC<StockInputPanelProps> = ({
  prices,
  setPrices,
  onResetToDefaults,
}) => {
  const [inputVal, setInputVal] = useState<string>(prices.join(', '));

  const applyCustomInput = () => {
    const parsed = inputVal
      .split(',')
      .map((s) => parseInt(s.trim(), 10))
      .filter((n) => !isNaN(n) && n >= 0);

    if (parsed.length >= 2) {
      setPrices(parsed);
      setInputVal(parsed.join(', '));
    }
  };

  const applyPreset = (preset: number[]) => {
    setPrices(preset);
    setInputVal(preset.join(', '));
  };

  return (
    <div className="bg-slate-900/50 border border-slate-800 rounded-xl px-3 py-1.5 flex flex-wrap items-center justify-between gap-2.5 shrink-0">
      {/* Prices Input */}
      <div className="flex items-center gap-2">
        <span className="text-[11px] font-semibold uppercase tracking-wider text-slate-400">
          Stock Prices:
        </span>
        <input
          type="text"
          value={inputVal}
          onChange={(e) => setInputVal(e.target.value)}
          onBlur={applyCustomInput}
          onKeyDown={(e) => e.key === 'Enter' && applyCustomInput()}
          placeholder="e.g. 7, 1, 5, 3, 6, 4"
          className="w-56 bg-slate-950/80 border border-slate-700/70 rounded-lg px-2.5 py-0.5 text-xs text-white font-mono focus:outline-none focus:border-indigo-500"
        />
      </div>

      {/* Presets */}
      <div className="flex items-center gap-1.5 text-xs">
        <span className="text-slate-500 text-[10px] font-medium flex items-center gap-1">
          <Lightbulb className="w-3 h-3 text-amber-400" /> Presets:
        </span>
        <button
          onClick={() => applyPreset([7, 1, 5, 3, 6, 4])}
          className="px-2 py-0.5 text-[11px] rounded bg-slate-800/80 hover:bg-slate-700 text-slate-300 transition-colors"
        >
          LeetCode #1 (+5)
        </button>
        <button
          onClick={() => applyPreset([2, 4, 1, 7, 3, 9])}
          className="px-2 py-0.5 text-[11px] rounded bg-emerald-500/10 hover:bg-emerald-500/20 text-emerald-300 border border-emerald-500/30 transition-colors font-medium"
        >
          Bull Run (+8)
        </button>
        <button
          onClick={() => applyPreset([7, 6, 4, 3, 1])}
          className="px-2 py-0.5 text-[11px] rounded bg-rose-500/10 hover:bg-rose-500/20 text-rose-300 border border-rose-500/30 transition-colors"
        >
          Strict Decline ($0)
        </button>
        <button
          onClick={onResetToDefaults}
          className="p-1 rounded text-slate-400 hover:text-white hover:bg-slate-800 transition-colors ml-1"
          title="Reset"
        >
          <RotateCcw className="w-3 h-3" />
        </button>
      </div>
    </div>
  );
};
