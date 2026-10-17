import React, { useState } from 'react';
import { Lightbulb, RotateCcw } from 'lucide-react';

interface SameTreeInputPanelProps {
  pArray: (number | null)[];
  qArray: (number | null)[];
  setPArray: (arr: (number | null)[]) => void;
  setQArray: (arr: (number | null)[]) => void;
  onResetToDefaults: () => void;
}

export const SameTreeInputPanel: React.FC<SameTreeInputPanelProps> = ({
  pArray,
  qArray,
  setPArray,
  setQArray,
  onResetToDefaults,
}) => {
  const [pText, setPText] = useState<string>(
    pArray.map((v) => (v === null ? 'null' : v)).join(', ')
  );
  const [qText, setQText] = useState<string>(
    qArray.map((v) => (v === null ? 'null' : v)).join(', ')
  );

  const applyCustomInputs = () => {
    const parse = (text: string) =>
      text.split(',').map((s) => {
        const trimmed = s.trim();
        if (trimmed === 'null' || trimmed === '') return null;
        const num = parseInt(trimmed, 10);
        return isNaN(num) ? null : num;
      });

    const parsedP = parse(pText).slice(0, 7);
    const parsedQ = parse(qText).slice(0, 7);

    setPArray(parsedP);
    setQArray(parsedQ);
    setPText(parsedP.map((v) => (v === null ? 'null' : v)).join(', '));
    setQText(parsedQ.map((v) => (v === null ? 'null' : v)).join(', '));
  };

  const applyPreset = (presetP: (number | null)[], presetQ: (number | null)[]) => {
    setPArray(presetP);
    setQArray(presetQ);
    setPText(presetP.map((v) => (v === null ? 'null' : v)).join(', '));
    setQText(presetQ.map((v) => (v === null ? 'null' : v)).join(', '));
  };

  return (
    <div className="bg-slate-900/50 border border-slate-800 rounded-xl px-3 py-1.5 flex flex-wrap items-center justify-between gap-2.5 shrink-0">
      <div className="flex items-center gap-2.5 flex-wrap">
        <div className="flex items-center gap-1.5">
          <span className="text-[11px] font-semibold uppercase tracking-wider text-indigo-400">
            Tree P:
          </span>
          <input
            type="text"
            value={pText}
            onChange={(e) => setPText(e.target.value)}
            onBlur={applyCustomInputs}
            onKeyDown={(e) => e.key === 'Enter' && applyCustomInputs()}
            placeholder="e.g. 1, 2, 3"
            className="w-36 bg-slate-950/80 border border-slate-700/70 rounded-lg px-2.5 py-0.5 text-xs text-white font-mono focus:outline-none focus:border-indigo-500"
          />
        </div>

        <div className="flex items-center gap-1.5">
          <span className="text-[11px] font-semibold uppercase tracking-wider text-cyan-400">
            Tree Q:
          </span>
          <input
            type="text"
            value={qText}
            onChange={(e) => setQText(e.target.value)}
            onBlur={applyCustomInputs}
            onKeyDown={(e) => e.key === 'Enter' && applyCustomInputs()}
            placeholder="e.g. 1, 2, 3"
            className="w-36 bg-slate-950/80 border border-slate-700/70 rounded-lg px-2.5 py-0.5 text-xs text-white font-mono focus:outline-none focus:border-cyan-500"
          />
        </div>
      </div>

      {/* Presets */}
      <div className="flex items-center gap-1.5 text-xs">
        <span className="text-slate-500 text-[10px] font-medium flex items-center gap-1">
          <Lightbulb className="w-3 h-3 text-amber-400" /> Presets:
        </span>
        <button
          onClick={() => applyPreset([1, 2, 3], [1, 2, 3])}
          className="px-2 py-0.5 text-[11px] rounded bg-emerald-500/10 hover:bg-emerald-500/20 text-emerald-300 border border-emerald-500/30 transition-colors"
        >
          LeetCode #1 Same [1,2,3]
        </button>
        <button
          onClick={() => applyPreset([1, 2], [1, null, 2])}
          className="px-2 py-0.5 text-[11px] rounded bg-rose-500/10 hover:bg-rose-500/20 text-rose-300 border border-rose-500/30 transition-colors"
        >
          Structural Mismatch
        </button>
        <button
          onClick={() => applyPreset([1, 2, 1], [1, 1, 2])}
          className="px-2 py-0.5 text-[11px] rounded bg-amber-500/10 hover:bg-amber-500/20 text-amber-300 border border-amber-500/30 transition-colors"
        >
          Value Mismatch
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
