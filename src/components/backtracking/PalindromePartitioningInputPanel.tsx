import React, { useState } from 'react';
import { Lightbulb, RotateCcw } from 'lucide-react';

interface PalindromePartitioningInputPanelProps {
  s: string;
  setS: (s: string) => void;
  onResetToDefaults: () => void;
}

export const PalindromePartitioningInputPanel: React.FC<PalindromePartitioningInputPanelProps> = ({
  s,
  setS,
  onResetToDefaults,
}) => {
  const [inputVal, setInputVal] = useState<string>(s);

  const applyCustomInput = () => {
    const trimmed = inputVal.trim().toLowerCase().slice(0, 6);
    if (trimmed.length >= 1) {
      setS(trimmed);
      setInputVal(trimmed);
    }
  };

  const applyPreset = (preset: string) => {
    setS(preset);
    setInputVal(preset);
  };

  return (
    <div className="bg-slate-900/50 border border-slate-800 rounded-xl px-3 py-1.5 flex flex-wrap items-center justify-between gap-2.5 shrink-0">
      <div className="flex items-center gap-2.5 flex-wrap">
        <div className="flex items-center gap-1.5">
          <span className="text-[11px] font-semibold uppercase tracking-wider text-slate-400">
            String:
          </span>
          <input
            type="text"
            value={inputVal}
            onChange={(e) => setInputVal(e.target.value)}
            onBlur={applyCustomInput}
            onKeyDown={(e) => e.key === 'Enter' && applyCustomInput()}
            placeholder="aab"
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
          onClick={() => applyPreset('aab')}
          className="px-2 py-0.5 text-[11px] rounded bg-indigo-500/10 hover:bg-indigo-500/20 text-indigo-300 border border-indigo-500/30 transition-colors"
        >
          LC #1 "aab"
        </button>
        <button
          onClick={() => applyPreset('a')}
          className="px-2 py-0.5 text-[11px] rounded bg-cyan-500/10 hover:bg-cyan-500/20 text-cyan-300 border border-cyan-500/30 transition-colors"
        >
          Single "a"
        </button>
        <button
          onClick={() => applyPreset('racecar')}
          className="px-2 py-0.5 text-[11px] rounded bg-purple-500/10 hover:bg-purple-500/20 text-purple-300 border border-purple-500/30 transition-colors"
        >
          Palindrome "racecar"
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
