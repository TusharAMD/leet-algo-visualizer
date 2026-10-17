import React, { useState } from 'react';
import { RotateCcw, Lightbulb } from 'lucide-react';

interface LcaBstInputPanelProps {
  treeArray: (number | null)[];
  setTreeArray: (arr: (number | null)[]) => void;
  pVal: number;
  setPVal: (v: number) => void;
  qVal: number;
  setQVal: (v: number) => void;
  onResetToDefaults: () => void;
}

export const LcaBstInputPanel: React.FC<LcaBstInputPanelProps> = ({
  treeArray,
  setTreeArray,
  pVal,
  setPVal,
  qVal,
  setQVal,
  onResetToDefaults,
}) => {
  const [treeInput, setTreeInput] = useState<string>(
    treeArray.map((v) => (v === null ? 'null' : v)).join(', ')
  );
  const [pInput, setPInput] = useState<string>(pVal.toString());
  const [qInput, setQInput] = useState<string>(qVal.toString());

  const applyCustomInputs = () => {
    const parsed = treeInput.split(',').map((s) => {
      const trimmed = s.trim();
      if (trimmed === 'null' || trimmed === '') return null;
      const num = parseInt(trimmed, 10);
      return isNaN(num) ? null : num;
    });

    const parsedP = parseInt(pInput, 10);
    const parsedQ = parseInt(qInput, 10);

    if (parsed.length >= 1 && parsed[0] !== null) {
      setTreeArray(parsed);
      setTreeInput(parsed.map((v) => (v === null ? 'null' : v)).join(', '));
    }
    if (!isNaN(parsedP)) setPVal(parsedP);
    if (!isNaN(parsedQ)) setQVal(parsedQ);
  };

  const applyPreset = (presetTree: (number | null)[], p: number, q: number) => {
    setTreeArray(presetTree);
    setPVal(p);
    setQVal(q);
    setTreeInput(presetTree.map((v) => (v === null ? 'null' : v)).join(', '));
    setPInput(p.toString());
    setQInput(q.toString());
  };

  return (
    <div className="bg-slate-900/50 border border-slate-800 rounded-xl px-3 py-1.5 flex flex-wrap items-center justify-between gap-2.5 shrink-0">
      <div className="flex items-center gap-2.5 flex-wrap">
        <div className="flex items-center gap-1.5">
          <span className="text-[11px] font-semibold uppercase tracking-wider text-slate-400">
            BST Array:
          </span>
          <input
            type="text"
            value={treeInput}
            onChange={(e) => setTreeInput(e.target.value)}
            onBlur={applyCustomInputs}
            onKeyDown={(e) => e.key === 'Enter' && applyCustomInputs()}
            placeholder="e.g. 6, 2, 8, 0, 4, 7, 9"
            className="w-44 bg-slate-950/80 border border-slate-700/70 rounded-lg px-2.5 py-0.5 text-xs text-white font-mono focus:outline-none focus:border-indigo-500"
          />
        </div>

        <div className="flex items-center gap-1.5">
          <span className="text-[11px] font-semibold uppercase tracking-wider text-slate-400">
            p:
          </span>
          <input
            type="number"
            value={pInput}
            onChange={(e) => setPInput(e.target.value)}
            onBlur={applyCustomInputs}
            onKeyDown={(e) => e.key === 'Enter' && applyCustomInputs()}
            className="w-14 bg-slate-950/80 border border-slate-700/70 rounded-lg px-2 py-0.5 text-xs text-white font-mono focus:outline-none focus:border-indigo-500"
          />
        </div>

        <div className="flex items-center gap-1.5">
          <span className="text-[11px] font-semibold uppercase tracking-wider text-slate-400">
            q:
          </span>
          <input
            type="number"
            value={qInput}
            onChange={(e) => setQInput(e.target.value)}
            onBlur={applyCustomInputs}
            onKeyDown={(e) => e.key === 'Enter' && applyCustomInputs()}
            className="w-14 bg-slate-950/80 border border-slate-700/70 rounded-lg px-2 py-0.5 text-xs text-white font-mono focus:outline-none focus:border-indigo-500"
          />
        </div>
      </div>

      {/* Presets */}
      <div className="flex items-center gap-1.5 text-xs">
        <span className="text-slate-500 text-[10px] font-medium flex items-center gap-1">
          <Lightbulb className="w-3 h-3 text-amber-400" /> Presets:
        </span>
        <button
          onClick={() => applyPreset([6, 2, 8, 0, 4, 7, 9], 2, 8)}
          className="px-2 py-0.5 text-[11px] rounded bg-indigo-500/10 hover:bg-indigo-500/20 text-indigo-300 border border-indigo-500/30 transition-colors"
        >
          LeetCode #1 (p=2, q=8 ➔ 6)
        </button>
        <button
          onClick={() => applyPreset([6, 2, 8, 0, 4, 7, 9], 2, 4)}
          className="px-2 py-0.5 text-[11px] rounded bg-cyan-500/10 hover:bg-cyan-500/20 text-cyan-300 border border-cyan-500/30 transition-colors"
        >
          Subtree (p=2, q=4 ➔ 2)
        </button>
        <button
          onClick={() => applyPreset([6, 2, 8, 0, 4, 7, 9], 7, 9)}
          className="px-2 py-0.5 text-[11px] rounded bg-purple-500/10 hover:bg-purple-500/20 text-purple-300 border border-purple-500/30 transition-colors"
        >
          Right Branch (p=7, q=9 ➔ 8)
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
