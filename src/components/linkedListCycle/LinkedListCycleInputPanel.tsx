import React, { useState } from 'react';
import { RotateCcw, Lightbulb } from 'lucide-react';

interface LinkedListCycleInputPanelProps {
  values: number[];
  setValues: (values: number[]) => void;
  pos: number;
  setPos: (pos: number) => void;
  onResetToDefaults: () => void;
}

export const LinkedListCycleInputPanel: React.FC<LinkedListCycleInputPanelProps> = ({
  values,
  setValues,
  pos,
  setPos,
  onResetToDefaults,
}) => {
  const [valuesInput, setValuesInput] = useState<string>(values.join(', '));
  const [posInput, setPosInput] = useState<string>(pos.toString());

  const applyCustomInputs = () => {
    const parsed = valuesInput
      .split(',')
      .map((s) => parseInt(s.trim(), 10))
      .filter((n) => !isNaN(n));

    const parsedPos = parseInt(posInput, 10);

    if (parsed.length >= 1) {
      setValues(parsed);
      setValuesInput(parsed.join(', '));
    }
    if (!isNaN(parsedPos)) {
      setPos(parsedPos);
    }
  };

  const applyPreset = (presetValues: number[], presetPos: number) => {
    setValues(presetValues);
    setPos(presetPos);
    setValuesInput(presetValues.join(', '));
    setPosInput(presetPos.toString());
  };

  return (
    <div className="bg-slate-900/50 border border-slate-800 rounded-xl px-3 py-1.5 flex flex-wrap items-center justify-between gap-2.5 shrink-0">
      <div className="flex items-center gap-2.5 flex-wrap">
        <div className="flex items-center gap-1.5">
          <span className="text-[11px] font-semibold uppercase tracking-wider text-slate-400">
            List Values:
          </span>
          <input
            type="text"
            value={valuesInput}
            onChange={(e) => setValuesInput(e.target.value)}
            onBlur={applyCustomInputs}
            onKeyDown={(e) => e.key === 'Enter' && applyCustomInputs()}
            placeholder="e.g. 3, 2, 0, -4"
            className="w-44 bg-slate-950/80 border border-slate-700/70 rounded-lg px-2.5 py-0.5 text-xs text-white font-mono focus:outline-none focus:border-indigo-500"
          />
        </div>

        <div className="flex items-center gap-1.5">
          <span className="text-[11px] font-semibold uppercase tracking-wider text-slate-400">
            Cycle Pos (-1 = None):
          </span>
          <input
            type="number"
            value={posInput}
            onChange={(e) => setPosInput(e.target.value)}
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
          onClick={() => applyPreset([3, 2, 0, -4], 1)}
          className="px-2 py-0.5 text-[11px] rounded bg-indigo-500/10 hover:bg-indigo-500/20 text-indigo-300 border border-indigo-500/30 transition-colors"
        >
          LeetCode #1 (pos=1)
        </button>
        <button
          onClick={() => applyPreset([1, 2], 0)}
          className="px-2 py-0.5 text-[11px] rounded bg-purple-500/10 hover:bg-purple-500/20 text-purple-300 border border-purple-500/30 transition-colors"
        >
          Two Node (pos=0)
        </button>
        <button
          onClick={() => applyPreset([1, 2, 3, 4, 5], -1)}
          className="px-2 py-0.5 text-[11px] rounded bg-rose-500/10 hover:bg-rose-500/20 text-rose-300 border border-rose-500/30 transition-colors font-medium"
        >
          No Cycle (pos=-1)
        </button>
        <button
          onClick={() => applyPreset([7], 0)}
          className="px-2 py-0.5 text-[11px] rounded bg-amber-500/10 hover:bg-amber-500/20 text-amber-300 border border-amber-500/30 transition-colors"
        >
          Self Loop (pos=0)
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
