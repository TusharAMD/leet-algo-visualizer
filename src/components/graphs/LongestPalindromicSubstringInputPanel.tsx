import React, { useState } from 'react';
import { Lightbulb, RotateCcw } from 'lucide-react';

interface LongestPalindromeInputPanelProps {
  s: string;
  setS: (str: string) => void;
  onResetToDefaults: () => void;
}

export const LongestPalindromicSubstringInputPanel: React.FC<LongestPalindromeInputPanelProps> = ({
  s,
  setS,
  onResetToDefaults,
}) => {
  const [customInput, setCustomInput] = useState<string>(s);

  const applyCustom = () => {
    if (customInput.trim().length > 0) {
      setS(customInput.trim());
    }
  };

  const applyPreset1 = () => {
    setS('babad');
    setCustomInput('babad');
  };

  const applyPreset2 = () => {
    setS('cbbd');
    setCustomInput('cbbd');
  };

  const applyPreset3 = () => {
    setS('racecar');
    setCustomInput('racecar');
  };

  return (
    <div className="bg-slate-900/50 border border-slate-800 rounded-xl px-3 py-1.5 flex flex-wrap items-center justify-between gap-2.5 shrink-0">
      <div className="flex items-center gap-2 flex-wrap">
        <span className="text-[11px] font-semibold uppercase tracking-wider text-slate-400">
          Input String:
        </span>
        <div className="flex items-center gap-1.5">
          <input
            type="text"
            value={customInput}
            onChange={(e) => setCustomInput(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && applyCustom()}
            className="px-2.5 py-0.5 rounded bg-slate-950 text-pink-300 font-mono text-xs border border-slate-800 focus:outline-none focus:border-pink-500 w-36"
            maxLength={18}
          />
          <button
            onClick={applyCustom}
            className="px-2 py-0.5 text-[11px] rounded bg-pink-500/10 hover:bg-pink-500/20 text-pink-300 border border-pink-500/30 transition-colors"
          >
            Apply
          </button>
        </div>
      </div>

      {/* Presets */}
      <div className="flex items-center gap-1.5 text-xs">
        <span className="text-slate-500 text-[10px] font-medium flex items-center gap-1">
          <Lightbulb className="w-3 h-3 text-amber-400" /> Presets:
        </span>
        <button
          onClick={applyPreset1}
          className="px-2 py-0.5 text-[11px] rounded bg-pink-500/10 hover:bg-pink-500/20 text-pink-300 border border-pink-500/30 transition-colors"
        >
          LC #1 ("babad")
        </button>
        <button
          onClick={applyPreset2}
          className="px-2 py-0.5 text-[11px] rounded bg-indigo-500/10 hover:bg-indigo-500/20 text-indigo-300 border border-indigo-500/30 transition-colors"
        >
          Even ("cbbd")
        </button>
        <button
          onClick={applyPreset3}
          className="px-2 py-0.5 text-[11px] rounded bg-emerald-500/10 hover:bg-emerald-500/20 text-emerald-300 border border-emerald-500/30 transition-colors"
        >
          "racecar"
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
