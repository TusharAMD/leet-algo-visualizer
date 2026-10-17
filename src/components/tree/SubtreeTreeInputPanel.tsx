import React, { useState } from 'react';
import { Lightbulb, RotateCcw } from 'lucide-react';

interface SubtreeTreeInputPanelProps {
  rootArray: (number | null)[];
  subRootArray: (number | null)[];
  setRootArray: (arr: (number | null)[]) => void;
  setSubRootArray: (arr: (number | null)[]) => void;
  onResetToDefaults: () => void;
}

export const SubtreeTreeInputPanel: React.FC<SubtreeTreeInputPanelProps> = ({
  rootArray,
  subRootArray,
  setRootArray,
  setSubRootArray,
  onResetToDefaults,
}) => {
  const [rootText, setRootText] = useState<string>(
    rootArray.map((v) => (v === null ? 'null' : v)).join(', ')
  );
  const [subRootText, setSubRootText] = useState<string>(
    subRootArray.map((v) => (v === null ? 'null' : v)).join(', ')
  );

  const applyCustomInputs = () => {
    const parse = (text: string) =>
      text.split(',').map((s) => {
        const trimmed = s.trim();
        if (trimmed === 'null' || trimmed === '') return null;
        const num = parseInt(trimmed, 10);
        return isNaN(num) ? null : num;
      });

    const parsedR = parse(rootText).slice(0, 7);
    const parsedS = parse(subRootText).slice(0, 7);

    setRootArray(parsedR);
    setSubRootArray(parsedS);
    setRootText(parsedR.map((v) => (v === null ? 'null' : v)).join(', '));
    setSubRootText(parsedS.map((v) => (v === null ? 'null' : v)).join(', '));
  };

  const applyPreset = (presetR: (number | null)[], presetS: (number | null)[]) => {
    setRootArray(presetR);
    setSubRootArray(presetS);
    setRootText(presetR.map((v) => (v === null ? 'null' : v)).join(', '));
    setSubRootText(presetS.map((v) => (v === null ? 'null' : v)).join(', '));
  };

  return (
    <div className="bg-slate-900/50 border border-slate-800 rounded-xl px-3 py-1.5 flex flex-wrap items-center justify-between gap-2.5 shrink-0">
      <div className="flex items-center gap-2.5 flex-wrap">
        <div className="flex items-center gap-1.5">
          <span className="text-[11px] font-semibold uppercase tracking-wider text-indigo-400">
            Root:
          </span>
          <input
            type="text"
            value={rootText}
            onChange={(e) => setRootText(e.target.value)}
            onBlur={applyCustomInputs}
            onKeyDown={(e) => e.key === 'Enter' && applyCustomInputs()}
            placeholder="e.g. 3, 4, 5, 1, 2"
            className="w-36 bg-slate-950/80 border border-slate-700/70 rounded-lg px-2.5 py-0.5 text-xs text-white font-mono focus:outline-none focus:border-indigo-500"
          />
        </div>

        <div className="flex items-center gap-1.5">
          <span className="text-[11px] font-semibold uppercase tracking-wider text-amber-400">
            SubRoot:
          </span>
          <input
            type="text"
            value={subRootText}
            onChange={(e) => setSubRootText(e.target.value)}
            onBlur={applyCustomInputs}
            onKeyDown={(e) => e.key === 'Enter' && applyCustomInputs()}
            placeholder="e.g. 4, 1, 2"
            className="w-32 bg-slate-950/80 border border-slate-700/70 rounded-lg px-2.5 py-0.5 text-xs text-white font-mono focus:outline-none focus:border-amber-500"
          />
        </div>
      </div>

      {/* Presets */}
      <div className="flex items-center gap-1.5 text-xs">
        <span className="text-slate-500 text-[10px] font-medium flex items-center gap-1">
          <Lightbulb className="w-3 h-3 text-amber-400" /> Presets:
        </span>
        <button
          onClick={() => applyPreset([3, 4, 5, 1, 2], [4, 1, 2])}
          className="px-2 py-0.5 text-[11px] rounded bg-emerald-500/10 hover:bg-emerald-500/20 text-emerald-300 border border-emerald-500/30 transition-colors"
        >
          LeetCode #1 (Subtree: True)
        </button>
        <button
          onClick={() => applyPreset([3, 4, 5, 1, null], [4, 1, 2])}
          className="px-2 py-0.5 text-[11px] rounded bg-rose-500/10 hover:bg-rose-500/20 text-rose-300 border border-rose-500/30 transition-colors"
        >
          LeetCode #2 (False)
        </button>
        <button
          onClick={() => applyPreset([1, 1], [1])}
          className="px-2 py-0.5 text-[11px] rounded bg-cyan-500/10 hover:bg-cyan-500/20 text-cyan-300 border border-cyan-500/30 transition-colors"
        >
          Single Leaf [1] (True)
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
