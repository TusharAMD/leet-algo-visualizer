import React, { useState } from 'react';
import { Lightbulb, RotateCcw } from 'lucide-react';

interface AddTwoNumbersInputPanelProps {
  list1: number[];
  list2: number[];
  setList1: (l1: number[]) => void;
  setList2: (l2: number[]) => void;
  onResetToDefaults: () => void;
}

export const AddTwoNumbersInputPanel: React.FC<AddTwoNumbersInputPanelProps> = ({
  list1,
  list2,
  setList1,
  setList2,
  onResetToDefaults,
}) => {
  const [l1Text, setL1Text] = useState<string>(list1.join(', '));
  const [l2Text, setL2Text] = useState<string>(list2.join(', '));

  const applyCustomInputs = () => {
    const p1 = l1Text
      .split(',')
      .map((s) => parseInt(s.trim(), 10))
      .filter((n) => !isNaN(n) && n >= 0 && n <= 9);

    const p2 = l2Text
      .split(',')
      .map((s) => parseInt(s.trim(), 10))
      .filter((n) => !isNaN(n) && n >= 0 && n <= 9);

    if (p1.length > 0 && p2.length > 0) {
      setList1(p1);
      setList2(p2);
      setL1Text(p1.join(', '));
      setL2Text(p2.join(', '));
    }
  };

  const applyPreset = (preset1: number[], preset2: number[]) => {
    setList1(preset1);
    setList2(preset2);
    setL1Text(preset1.join(', '));
    setL2Text(preset2.join(', '));
  };

  return (
    <div className="bg-slate-900/50 border border-slate-800 rounded-xl px-3 py-1.5 flex flex-wrap items-center justify-between gap-2.5 shrink-0">
      <div className="flex items-center gap-2.5 flex-wrap">
        <div className="flex items-center gap-1.5">
          <span className="text-[11px] font-semibold uppercase tracking-wider text-slate-400">
            Digits 1 (rev):
          </span>
          <input
            type="text"
            value={l1Text}
            onChange={(e) => setL1Text(e.target.value)}
            onBlur={applyCustomInputs}
            onKeyDown={(e) => e.key === 'Enter' && applyCustomInputs()}
            placeholder="e.g. 2, 4, 3"
            className="w-36 bg-slate-950/80 border border-slate-700/70 rounded-lg px-2.5 py-0.5 text-xs text-white font-mono focus:outline-none focus:border-indigo-500"
          />
        </div>

        <div className="flex items-center gap-1.5">
          <span className="text-[11px] font-semibold uppercase tracking-wider text-slate-400">
            Digits 2 (rev):
          </span>
          <input
            type="text"
            value={l2Text}
            onChange={(e) => setL2Text(e.target.value)}
            onBlur={applyCustomInputs}
            onKeyDown={(e) => e.key === 'Enter' && applyCustomInputs()}
            placeholder="e.g. 5, 6, 4"
            className="w-36 bg-slate-950/80 border border-slate-700/70 rounded-lg px-2.5 py-0.5 text-xs text-white font-mono focus:outline-none focus:border-indigo-500"
          />
        </div>
      </div>

      {/* Presets */}
      <div className="flex items-center gap-1.5 text-xs">
        <span className="text-slate-500 text-[10px] font-medium flex items-center gap-1">
          <Lightbulb className="w-3 h-3 text-amber-400" /> Presets:
        </span>
        <button
          onClick={() => applyPreset([2, 4, 3], [5, 6, 4])}
          className="px-2 py-0.5 text-[11px] rounded bg-indigo-500/10 hover:bg-indigo-500/20 text-indigo-300 border border-indigo-500/30 transition-colors"
        >
          LeetCode #1 (342 + 465)
        </button>
        <button
          onClick={() => applyPreset([9, 9, 9, 9], [9, 9])}
          className="px-2 py-0.5 text-[11px] rounded bg-rose-500/10 hover:bg-rose-500/20 text-rose-300 border border-rose-500/30 transition-colors"
        >
          Cascading 9s
        </button>
        <button
          onClick={() => applyPreset([0], [0])}
          className="px-2 py-0.5 text-[11px] rounded bg-emerald-500/10 hover:bg-emerald-500/20 text-emerald-300 border border-emerald-500/30 transition-colors"
        >
          Zeroes [0] + [0]
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
