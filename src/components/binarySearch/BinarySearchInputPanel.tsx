import React, { useState } from 'react';
import { RotateCcw, Lightbulb } from 'lucide-react';

interface BinarySearchInputPanelProps {
  nums: number[];
  setNums: (nums: number[]) => void;
  target: number;
  setTarget: (target: number) => void;
  onResetToDefaults: () => void;
}

export const BinarySearchInputPanel: React.FC<BinarySearchInputPanelProps> = ({
  nums,
  setNums,
  target,
  setTarget,
  onResetToDefaults,
}) => {
  const [arrayInput, setArrayInput] = useState<string>(nums.join(', '));
  const [targetInput, setTargetInput] = useState<string>(target.toString());

  const applyCustomInputs = () => {
    const parsed = arrayInput
      .split(',')
      .map((s) => parseInt(s.trim(), 10))
      .filter((n) => !isNaN(n));

    parsed.sort((a, b) => a - b);
    const parsedTarget = parseInt(targetInput, 10);

    if (parsed.length >= 1) {
      setNums(parsed);
      setArrayInput(parsed.join(', '));
    }
    if (!isNaN(parsedTarget)) {
      setTarget(parsedTarget);
    }
  };

  const applyPreset = (presetNums: number[], presetTarget: number) => {
    setNums(presetNums);
    setTarget(presetTarget);
    setArrayInput(presetNums.join(', '));
    setTargetInput(presetTarget.toString());
  };

  return (
    <div className="bg-slate-900/50 border border-slate-800 rounded-xl px-3 py-1.5 flex flex-wrap items-center justify-between gap-2.5 shrink-0">
      {/* Array input & Target input */}
      <div className="flex items-center gap-2.5 flex-wrap">
        <div className="flex items-center gap-1.5">
          <span className="text-[11px] font-semibold uppercase tracking-wider text-slate-400">
            Sorted Array:
          </span>
          <input
            type="text"
            value={arrayInput}
            onChange={(e) => setArrayInput(e.target.value)}
            onBlur={applyCustomInputs}
            onKeyDown={(e) => e.key === 'Enter' && applyCustomInputs()}
            placeholder="e.g. -1, 0, 3, 5, 9, 12"
            className="w-48 bg-slate-950/80 border border-slate-700/70 rounded-lg px-2.5 py-0.5 text-xs text-white font-mono focus:outline-none focus:border-indigo-500"
          />
        </div>

        <div className="flex items-center gap-1.5">
          <span className="text-[11px] font-semibold uppercase tracking-wider text-slate-400">
            Target:
          </span>
          <input
            type="number"
            value={targetInput}
            onChange={(e) => setTargetInput(e.target.value)}
            onBlur={applyCustomInputs}
            onKeyDown={(e) => e.key === 'Enter' && applyCustomInputs()}
            className="w-16 bg-slate-950/80 border border-slate-700/70 rounded-lg px-2 py-0.5 text-xs text-white font-mono focus:outline-none focus:border-indigo-500"
          />
        </div>
      </div>

      {/* Presets */}
      <div className="flex items-center gap-1.5 text-xs">
        <span className="text-slate-500 text-[10px] font-medium flex items-center gap-1">
          <Lightbulb className="w-3 h-3 text-amber-400" /> Presets:
        </span>
        <button
          onClick={() => applyPreset([-1, 0, 3, 5, 9, 12], 9)}
          className="px-2 py-0.5 text-[11px] rounded bg-slate-800/80 hover:bg-slate-700 text-slate-300 transition-colors"
        >
          LeetCode #1 (T=9)
        </button>
        <button
          onClick={() => applyPreset([-1, 0, 3, 5, 9, 12], 2)}
          className="px-2 py-0.5 text-[11px] rounded bg-rose-500/10 hover:bg-rose-500/20 text-rose-300 border border-rose-500/30 transition-colors font-medium"
        >
          Missing (T=2 ➔ -1)
        </button>
        <button
          onClick={() => applyPreset([2, 5, 8, 12, 16, 23, 38, 56, 72, 91], 23)}
          className="px-2 py-0.5 text-[11px] rounded bg-cyan-500/10 hover:bg-cyan-500/20 text-cyan-300 border border-cyan-500/30 transition-colors"
        >
          10-Item Search (T=23)
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
