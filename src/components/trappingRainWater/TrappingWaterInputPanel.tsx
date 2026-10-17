import React, { useState } from 'react';
import { RotateCcw, Lightbulb } from 'lucide-react';

interface TrappingWaterInputPanelProps {
  heights: number[];
  setHeights: (h: number[]) => void;
  onResetToDefaults: () => void;
}

export const TrappingWaterInputPanel: React.FC<TrappingWaterInputPanelProps> = ({
  heights,
  setHeights,
  onResetToDefaults,
}) => {
  const [inputVal, setInputVal] = useState<string>(heights.join(', '));

  const applyCustomInput = () => {
    const parsed = inputVal
      .split(',')
      .map((s) => parseInt(s.trim(), 10))
      .filter((n) => !isNaN(n) && n >= 0);

    if (parsed.length >= 3) {
      setHeights(parsed);
      setInputVal(parsed.join(', '));
    }
  };

  const applyPreset = (preset: number[]) => {
    setHeights(preset);
    setInputVal(preset.join(', '));
  };

  return (
    <div className="bg-slate-900/50 border border-slate-800 rounded-xl px-3 py-1.5 flex flex-wrap items-center justify-between gap-2.5 shrink-0">
      {/* Heights Array Input */}
      <div className="flex items-center gap-2">
        <span className="text-[11px] font-semibold uppercase tracking-wider text-slate-400">
          Heights Array:
        </span>
        <input
          type="text"
          value={inputVal}
          onChange={(e) => setInputVal(e.target.value)}
          onBlur={applyCustomInput}
          onKeyDown={(e) => e.key === 'Enter' && applyCustomInput()}
          placeholder="e.g. 0, 1, 0, 2, 1, 0, 1, 3, 2, 1, 2, 1"
          className="w-64 bg-slate-950/80 border border-slate-700/70 rounded-lg px-2.5 py-0.5 text-xs text-white font-mono focus:outline-none focus:border-indigo-500"
        />
      </div>

      {/* Presets */}
      <div className="flex items-center gap-1.5 text-xs">
        <span className="text-slate-500 text-[10px] font-medium flex items-center gap-1">
          <Lightbulb className="w-3 h-3 text-amber-400" /> Presets:
        </span>
        <button
          onClick={() => applyPreset([0, 1, 0, 2, 1, 0, 1, 3, 2, 1, 2, 1])}
          className="px-2 py-0.5 text-[11px] rounded bg-slate-800/80 hover:bg-slate-700 text-slate-300 transition-colors"
        >
          LeetCode #1 (6 units)
        </button>
        <button
          onClick={() => applyPreset([4, 2, 0, 3, 2, 5])}
          className="px-2 py-0.5 text-[11px] rounded bg-blue-500/10 hover:bg-blue-500/20 text-blue-300 border border-blue-500/30 transition-colors font-medium"
        >
          Canyon Valley (9 units)
        </button>
        <button
          onClick={() => applyPreset([3, 0, 0, 2, 0, 4])}
          className="px-2 py-0.5 text-[11px] rounded bg-indigo-500/10 hover:bg-indigo-500/20 text-indigo-300 border border-indigo-500/30 transition-colors"
        >
          Deep V (10 units)
        </button>
        <button
          onClick={() => applyPreset([3, 2, 1, 0])}
          className="px-2 py-0.5 text-[11px] rounded bg-slate-800 hover:bg-slate-700 text-slate-400 transition-colors"
        >
          Slope (0 units)
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
