import React, { useState } from 'react';
import { Lightbulb, RotateCcw } from 'lucide-react';

interface LetterCombinationsInputPanelProps {
  digits: string;
  setDigits: (d: string) => void;
  onResetToDefaults: () => void;
}

export const LetterCombinationsInputPanel: React.FC<LetterCombinationsInputPanelProps> = ({
  digits,
  setDigits,
  onResetToDefaults,
}) => {
  const [inputVal, setInputVal] = useState<string>(digits);

  const applyCustomInput = () => {
    const cleaned = inputVal.replace(/[^2-9]/g, '').slice(0, 4);
    setDigits(cleaned);
    setInputVal(cleaned);
  };

  const applyPreset = (preset: string) => {
    setDigits(preset);
    setInputVal(preset);
  };

  return (
    <div className="bg-slate-900/50 border border-slate-800 rounded-xl px-3 py-1.5 flex flex-wrap items-center justify-between gap-2.5 shrink-0">
      <div className="flex items-center gap-2.5 flex-wrap">
        <div className="flex items-center gap-1.5">
          <span className="text-[11px] font-semibold uppercase tracking-wider text-slate-400">
            Digits (2-9):
          </span>
          <input
            type="text"
            value={inputVal}
            onChange={(e) => setInputVal(e.target.value)}
            onBlur={applyCustomInput}
            onKeyDown={(e) => e.key === 'Enter' && applyCustomInput()}
            placeholder="23"
            className="w-28 bg-slate-950/80 border border-slate-700/70 rounded-lg px-2.5 py-0.5 text-xs text-white font-mono focus:outline-none focus:border-indigo-500"
          />
        </div>
      </div>

      {/* Presets */}
      <div className="flex items-center gap-1.5 text-xs">
        <span className="text-slate-500 text-[10px] font-medium flex items-center gap-1">
          <Lightbulb className="w-3 h-3 text-amber-400" /> Presets:
        </span>
        <button
          onClick={() => applyPreset('23')}
          className="px-2 py-0.5 text-[11px] rounded bg-indigo-500/10 hover:bg-indigo-500/20 text-indigo-300 border border-indigo-500/30 transition-colors"
        >
          LC #1 "23" (9 combos)
        </button>
        <button
          onClick={() => applyPreset('2')}
          className="px-2 py-0.5 text-[11px] rounded bg-cyan-500/10 hover:bg-cyan-500/20 text-cyan-300 border border-cyan-500/30 transition-colors"
        >
          Single "2" (3 combos)
        </button>
        <button
          onClick={() => applyPreset('79')}
          className="px-2 py-0.5 text-[11px] rounded bg-purple-500/10 hover:bg-purple-500/20 text-purple-300 border border-purple-500/30 transition-colors"
        >
          4-Letters "79" (16 combos)
        </button>
        <button
          onClick={onResetToDefaults}
          className="p-1 rounded bg-slate-800 hover:bg-slate-700 text-slate-400 hover:text-white transition-colors ml-1"
          title="Reset Defaults"
        >
          <RotateCcw className="w-3.5 h-3.5" />
        </button>
      </div>
    </div>
  );
};
