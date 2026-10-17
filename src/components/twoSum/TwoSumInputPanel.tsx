import React, { useState } from 'react';
import { RotateCcw, Lightbulb } from 'lucide-react';

interface TwoSumInputPanelProps {
  numbers: number[];
  setNumbers: (nums: number[]) => void;
  target: number;
  setTarget: (target: number) => void;
  onResetToDefaults: () => void;
}

export const TwoSumInputPanel: React.FC<TwoSumInputPanelProps> = ({
  numbers,
  setNumbers,
  target,
  setTarget,
  onResetToDefaults,
}) => {
  const [arrayInput, setArrayInput] = useState<string>(numbers.join(', '));
  const [targetInput, setTargetInput] = useState<string>(target.toString());

  const applyCustomInputs = () => {
    const parsed = arrayInput
      .split(',')
      .map((s) => parseInt(s.trim(), 10))
      .filter((n) => !isNaN(n));

    // Sort to maintain sorted invariant
    parsed.sort((a, b) => a - b);

    const parsedTarget = parseInt(targetInput, 10);

    if (parsed.length >= 2) {
      setNumbers(parsed);
      setArrayInput(parsed.join(', '));
    }
    if (!isNaN(parsedTarget)) {
      setTarget(parsedTarget);
    }
  };

  const applyPreset = (presetNums: number[], presetTarget: number) => {
    setNumbers(presetNums);
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
            placeholder="e.g. 2, 7, 11, 15"
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
          onClick={() => applyPreset([2, 7, 11, 15], 9)}
          className="px-2 py-0.5 text-[11px] rounded bg-slate-800/80 hover:bg-slate-700 text-slate-300 transition-colors"
        >
          Standard [2,7,11,15] T=9
        </button>
        <button
          onClick={() => applyPreset([1, 2, 4, 6, 8, 11, 15, 20], 14)}
          className="px-2 py-0.5 text-[11px] rounded bg-indigo-500/10 hover:bg-indigo-500/20 text-indigo-300 border border-indigo-500/30 transition-colors font-medium"
        >
          Long Squeeze T=14
        </button>
        <button
          onClick={() => applyPreset([-8, -3, 0, 2, 5, 9, 14], 6)}
          className="px-2 py-0.5 text-[11px] rounded bg-amber-500/10 hover:bg-amber-500/20 text-amber-300 border border-amber-500/30 transition-colors"
        >
          Negatives T=6
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
