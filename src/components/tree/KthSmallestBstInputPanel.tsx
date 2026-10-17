import React, { useState } from 'react';
import { Lightbulb, RotateCcw } from 'lucide-react';

interface KthSmallestBstInputPanelProps {
  treeArray: (number | null)[];
  k: number;
  setTreeArray: (arr: (number | null)[]) => void;
  setK: (k: number) => void;
  onResetToDefaults: () => void;
}

export const KthSmallestBstInputPanel: React.FC<KthSmallestBstInputPanelProps> = ({
  treeArray,
  k,
  setTreeArray,
  setK,
  onResetToDefaults,
}) => {
  const [inputVal, setInputVal] = useState<string>(
    treeArray.map((v) => (v === null ? 'null' : v)).join(', ')
  );
  const [kInput, setKInput] = useState<number>(k);

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
      const validNodesCount = parsed.slice(0, 7).filter((x) => x !== null).length;
      const safeK = Math.max(1, Math.min(kInput, validNodesCount));
      setK(safeK);
      setKInput(safeK);
    }
  };

  const applyPreset = (preset: (number | null)[], presetK: number) => {
    setTreeArray(preset);
    setK(presetK);
    setInputVal(preset.map((v) => (v === null ? 'null' : v)).join(', '));
    setKInput(presetK);
  };

  return (
    <div className="bg-slate-900/50 border border-slate-800 rounded-xl px-3 py-1.5 flex flex-wrap items-center justify-between gap-2.5 shrink-0">
      <div className="flex items-center gap-2.5 flex-wrap">
        <div className="flex items-center gap-1.5">
          <span className="text-[11px] font-semibold uppercase tracking-wider text-slate-400">
            BST Array (≤7 nodes):
          </span>
          <input
            type="text"
            value={inputVal}
            onChange={(e) => setInputVal(e.target.value)}
            onBlur={applyCustomInputs}
            onKeyDown={(e) => e.key === 'Enter' && applyCustomInputs()}
            placeholder="e.g. 3, 1, 4, null, 2"
            className="w-48 bg-slate-950/80 border border-slate-700/70 rounded-lg px-2.5 py-0.5 text-xs text-white font-mono focus:outline-none focus:border-indigo-500"
          />
        </div>

        <div className="flex items-center gap-1.5">
          <span className="text-[11px] font-semibold uppercase tracking-wider text-slate-400">
            k:
          </span>
          <input
            type="number"
            min={1}
            max={7}
            value={kInput}
            onChange={(e) => {
              const val = parseInt(e.target.value, 10) || 1;
              setKInput(val);
              setK(val);
            }}
            className="w-16 bg-slate-950/80 border border-slate-700/70 rounded-lg px-2 py-0.5 text-xs text-white font-mono text-center focus:outline-none focus:border-indigo-500"
          />
        </div>
      </div>

      {/* Presets */}
      <div className="flex items-center gap-1.5 text-xs">
        <span className="text-slate-500 text-[10px] font-medium flex items-center gap-1">
          <Lightbulb className="w-3 h-3 text-amber-400" /> Presets:
        </span>
        <button
          onClick={() => applyPreset([3, 1, 4, null, 2], 1)}
          className="px-2 py-0.5 text-[11px] rounded bg-indigo-500/10 hover:bg-indigo-500/20 text-indigo-300 border border-indigo-500/30 transition-colors"
        >
          LeetCode #1 (k=1)
        </button>
        <button
          onClick={() => applyPreset([5, 3, 6, 2, 4, null, null], 3)}
          className="px-2 py-0.5 text-[11px] rounded bg-cyan-500/10 hover:bg-cyan-500/20 text-cyan-300 border border-cyan-500/30 transition-colors"
        >
          LeetCode #2 (k=3)
        </button>
        <button
          onClick={() => applyPreset([4, 2, 6, 1, 3, 5, 7], 4)}
          className="px-2 py-0.5 text-[11px] rounded bg-emerald-500/10 hover:bg-emerald-500/20 text-emerald-300 border border-emerald-500/30 transition-colors"
        >
          Median (k=4)
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
