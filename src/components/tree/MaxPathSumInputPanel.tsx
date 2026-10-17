import React, { useState } from 'react';
import { Lightbulb, RotateCcw } from 'lucide-react';

interface MaxPathSumInputPanelProps {
  treeArray: (number | null)[];
  setTreeArray: (arr: (number | null)[]) => void;
  onResetToDefaults: () => void;
}

export const MaxPathSumInputPanel: React.FC<MaxPathSumInputPanelProps> = ({
  treeArray,
  setTreeArray,
  onResetToDefaults,
}) => {
  const [inputVal, setInputVal] = useState<string>(
    treeArray.map((v) => (v === null ? 'null' : v)).join(', ')
  );

  const applyCustomInputs = () => {
    const parsed = inputVal.split(',').map((s) => {
      const trimmed = s.trim();
      if (trimmed === 'null' || trimmed === '') return null;
      const num = parseInt(trimmed, 10);
      return isNaN(num) ? null : num;
    });

    if (parsed.length > 0 && parsed[0] !== null) {
      setTreeArray(parsed.slice(0, 7));
      setInputVal(parsed.slice(0, 7).map((v) => (v === null ? 'null' : v)).join(', '));
    }
  };

  const applyPreset = (preset: (number | null)[]) => {
    setTreeArray(preset);
    setInputVal(preset.map((v) => (v === null ? 'null' : v)).join(', '));
  };

  return (
    <div className="bg-slate-900/50 border border-slate-800 rounded-xl px-3 py-1.5 flex flex-wrap items-center justify-between gap-2.5 shrink-0">
      <div className="flex items-center gap-2.5 flex-wrap">
        <div className="flex items-center gap-1.5">
          <span className="text-[11px] font-semibold uppercase tracking-wider text-slate-400">
            Tree Array (≤7 nodes):
          </span>
          <input
            type="text"
            value={inputVal}
            onChange={(e) => setInputVal(e.target.value)}
            onBlur={applyCustomInputs}
            onKeyDown={(e) => e.key === 'Enter' && applyCustomInputs()}
            placeholder="e.g. -10, 9, 20, null, null, 15, 7"
            className="w-56 bg-slate-950/80 border border-slate-700/70 rounded-lg px-2.5 py-0.5 text-xs text-white font-mono focus:outline-none focus:border-indigo-500"
          />
        </div>
      </div>

      {/* Presets */}
      <div className="flex items-center gap-1.5 text-xs">
        <span className="text-slate-500 text-[10px] font-medium flex items-center gap-1">
          <Lightbulb className="w-3 h-3 text-amber-400" /> Presets:
        </span>
        <button
          onClick={() => applyPreset([-10, 9, 20, null, null, 15, 7])}
          className="px-2 py-0.5 text-[11px] rounded bg-indigo-500/10 hover:bg-indigo-500/20 text-indigo-300 border border-indigo-500/30 transition-colors"
        >
          LeetCode #1 [-10, 9, 20...] (Max: 42)
        </button>
        <button
          onClick={() => applyPreset([1, 2, 3])}
          className="px-2 py-0.5 text-[11px] rounded bg-cyan-500/10 hover:bg-cyan-500/20 text-cyan-300 border border-cyan-500/30 transition-colors"
        >
          Simple [1, 2, 3] (Max: 6)
        </button>
        <button
          onClick={() => applyPreset([-3])}
          className="px-2 py-0.5 text-[11px] rounded bg-rose-500/10 hover:bg-rose-500/20 text-rose-300 border border-rose-500/30 transition-colors"
        >
          Single Negative [-3] (Max: -3)
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
