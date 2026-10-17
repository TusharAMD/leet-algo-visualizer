import React, { useState } from 'react';
import { RotateCcw, Lightbulb } from 'lucide-react';

interface ContainsDuplicateInputPanelProps {
  nums: number[];
  setNums: (nums: number[]) => void;
  onResetToDefaults: () => void;
}

export const ContainsDuplicateInputPanel: React.FC<ContainsDuplicateInputPanelProps> = ({
  nums,
  setNums,
  onResetToDefaults,
}) => {
  const [inputVal, setInputVal] = useState<string>(nums.join(', '));

  const applyCustomInputs = () => {
    const parsed = inputVal
      .split(',')
      .map((s) => parseInt(s.trim(), 10))
      .filter((n) => !isNaN(n));

    if (parsed.length >= 1) {
      setNums(parsed);
      setInputVal(parsed.join(', '));
    }
  };

  const applyPreset = (preset: number[]) => {
    setNums(preset);
    setInputVal(preset.join(', '));
  };

  return (
    <div className="bg-slate-900/50 border border-slate-800 rounded-xl px-3 py-1.5 flex flex-wrap items-center justify-between gap-2.5 shrink-0">
      <div className="flex items-center gap-2.5 flex-wrap">
        <div className="flex items-center gap-1.5">
          <span className="text-[11px] font-semibold uppercase tracking-wider text-slate-400">
            Array Elements:
          </span>
          <input
            type="text"
            value={inputVal}
            onChange={(e) => setInputVal(e.target.value)}
            onBlur={applyCustomInputs}
            onKeyDown={(e) => e.key === 'Enter' && applyCustomInputs()}
            placeholder="e.g. 1, 2, 3, 1"
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
          onClick={() => applyPreset([1, 2, 3, 1])}
          className="px-2 py-0.5 text-[11px] rounded bg-indigo-500/10 hover:bg-indigo-500/20 text-indigo-300 border border-indigo-500/30 transition-colors"
        >
          LeetCode #1 [1, 2, 3, 1] (True)
        </button>
        <button
          onClick={() => applyPreset([1, 2, 3, 4])}
          className="px-2 py-0.5 text-[11px] rounded bg-emerald-500/10 hover:bg-emerald-500/20 text-emerald-300 border border-emerald-500/30 transition-colors"
        >
          Unique [1, 2, 3, 4] (False)
        </button>
        <button
          onClick={() => applyPreset([1, 1, 1, 3, 3, 4, 3, 2, 4, 2])}
          className="px-2 py-0.5 text-[11px] rounded bg-purple-500/10 hover:bg-purple-500/20 text-purple-300 border border-purple-500/30 transition-colors"
        >
          Many Duplicates (True)
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
