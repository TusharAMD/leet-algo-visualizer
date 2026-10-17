import React, { useState } from 'react';
import { Lightbulb, RotateCcw } from 'lucide-react';

interface ValidateBstInputPanelProps {
  treeArray: (number | null)[];
  setTreeArray: (arr: (number | null)[]) => void;
  onResetToDefaults: () => void;
}

export const ValidateBstInputPanel: React.FC<ValidateBstInputPanelProps> = ({
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
            placeholder="e.g. 2, 1, 3"
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
          onClick={() => applyPreset([2, 1, 3])}
          className="px-2 py-0.5 text-[11px] rounded bg-emerald-500/10 hover:bg-emerald-500/20 text-emerald-300 border border-emerald-500/30 transition-colors"
        >
          LeetCode #1 [2, 1, 3] (Valid: True)
        </button>
        <button
          onClick={() => applyPreset([5, 1, 4, null, null, 3, 6])}
          className="px-2 py-0.5 text-[11px] rounded bg-rose-500/10 hover:bg-rose-500/20 text-rose-300 border border-rose-500/30 transition-colors"
        >
          LeetCode #2 [5, 1, 4...] (False)
        </button>
        <button
          onClick={() => applyPreset([10, 5, 15, null, null, 6, 20])}
          className="px-2 py-0.5 text-[11px] rounded bg-amber-500/10 hover:bg-amber-500/20 text-amber-300 border border-amber-500/30 transition-colors"
        >
          Subtree Trap 6 &lt; 10 (False)
        </button>
        <button
          onClick={() => applyPreset([4, 2, 6, 1, 3, 5, 7])}
          className="px-2 py-0.5 text-[11px] rounded bg-cyan-500/10 hover:bg-cyan-500/20 text-cyan-300 border border-cyan-500/30 transition-colors"
        >
          Full 3-Level BST (True)
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
