import React, { useState } from 'react';
import { Lightbulb, RotateCcw } from 'lucide-react';

interface LastStoneWeightInputPanelProps {
  stones: number[];
  setStones: (stones: number[]) => void;
  onResetToDefaults: () => void;
}

export const LastStoneWeightInputPanel: React.FC<LastStoneWeightInputPanelProps> = ({
  stones,
  setStones,
  onResetToDefaults,
}) => {
  const [inputVal, setInputVal] = useState<string>(stones.join(', '));

  const applyCustomInputs = () => {
    const parsed = inputVal
      .split(',')
      .map((s) => parseInt(s.trim(), 10))
      .filter((n) => !isNaN(n) && n > 0);

    if (parsed.length >= 1) {
      setStones(parsed);
      setInputVal(parsed.join(', '));
    }
  };

  const applyPreset = (presetStones: number[]) => {
    setStones(presetStones);
    setInputVal(presetStones.join(', '));
  };

  return (
    <div className="bg-slate-900/50 border border-slate-800 rounded-xl px-3 py-1.5 flex flex-wrap items-center justify-between gap-2.5 shrink-0">
      <div className="flex items-center gap-2.5 flex-wrap">
        <div className="flex items-center gap-1.5">
          <span className="text-[11px] font-semibold uppercase tracking-wider text-slate-400">
            Stone Weights:
          </span>
          <input
            type="text"
            value={inputVal}
            onChange={(e) => setInputVal(e.target.value)}
            onBlur={applyCustomInputs}
            onKeyDown={(e) => e.key === 'Enter' && applyCustomInputs()}
            placeholder="e.g. 2, 7, 4, 1, 8, 1"
            className="w-52 bg-slate-950/80 border border-slate-700/70 rounded-lg px-2.5 py-0.5 text-xs text-white font-mono focus:outline-none focus:border-indigo-500"
          />
        </div>
      </div>

      {/* Presets */}
      <div className="flex items-center gap-1.5 text-xs">
        <span className="text-slate-500 text-[10px] font-medium flex items-center gap-1">
          <Lightbulb className="w-3 h-3 text-amber-400" /> Presets:
        </span>
        <button
          onClick={() => applyPreset([2, 7, 4, 1, 8, 1])}
          className="px-2 py-0.5 text-[11px] rounded bg-indigo-500/10 hover:bg-indigo-500/20 text-indigo-300 border border-indigo-500/30 transition-colors"
        >
          LeetCode #1 [2, 7, 4, 1, 8, 1]
        </button>
        <button
          onClick={() => applyPreset([1])}
          className="px-2 py-0.5 text-[11px] rounded bg-cyan-500/10 hover:bg-cyan-500/20 text-cyan-300 border border-cyan-500/30 transition-colors"
        >
          Single Stone [1]
        </button>
        <button
          onClick={() => applyPreset([2, 2])}
          className="px-2 py-0.5 text-[11px] rounded bg-rose-500/10 hover:bg-rose-500/20 text-rose-300 border border-rose-500/30 transition-colors"
        >
          Mutual Annihilation [2, 2]
        </button>
        <button
          onClick={onResetToDefaults}
          className="p-1 rounded bg-slate-800 hover:bg-slate-700 text-slate-400 hover:text-slate-200 transition-colors ml-1"
          title="Reset to default inputs"
        >
          <RotateCcw className="w-3.5 h-3.5" />
        </button>
      </div>
    </div>
  );
};
