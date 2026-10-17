import React, { useState } from 'react';
import { RotateCcw, Lightbulb } from 'lucide-react';

interface SubstringInputPanelProps {
  s: string;
  setS: (s: string) => void;
  onResetToDefaults: () => void;
}

export const SubstringInputPanel: React.FC<SubstringInputPanelProps> = ({
  s,
  setS,
  onResetToDefaults,
}) => {
  const [inputVal, setInputVal] = useState<string>(s);

  const applyCustomInput = () => {
    if (inputVal.trim().length > 0) {
      setS(inputVal.trim());
    }
  };

  const applyPreset = (preset: string) => {
    setS(preset);
    setInputVal(preset);
  };

  return (
    <div className="bg-slate-900/50 border border-slate-800 rounded-xl px-3 py-1.5 flex flex-wrap items-center justify-between gap-2.5 shrink-0">
      {/* String Input */}
      <div className="flex items-center gap-2">
        <span className="text-[11px] font-semibold uppercase tracking-wider text-slate-400">
          Input String:
        </span>
        <input
          type="text"
          value={inputVal}
          onChange={(e) => setInputVal(e.target.value)}
          onBlur={applyCustomInput}
          onKeyDown={(e) => e.key === 'Enter' && applyCustomInput()}
          placeholder="e.g. abcabcbb"
          className="w-48 bg-slate-950/80 border border-slate-700/70 rounded-lg px-2.5 py-0.5 text-xs text-white font-mono focus:outline-none focus:border-indigo-500"
        />
      </div>

      {/* Presets */}
      <div className="flex items-center gap-1.5 text-xs">
        <span className="text-slate-500 text-[10px] font-medium flex items-center gap-1">
          <Lightbulb className="w-3 h-3 text-amber-400" /> Presets:
        </span>
        <button
          onClick={() => applyPreset('abcabcbb')}
          className="px-2 py-0.5 text-[11px] rounded bg-slate-800/80 hover:bg-slate-700 text-slate-300 transition-colors font-mono"
        >
          "abcabcbb" (3)
        </button>
        <button
          onClick={() => applyPreset('pwwkew')}
          className="px-2 py-0.5 text-[11px] rounded bg-purple-500/10 hover:bg-purple-500/20 text-purple-300 border border-purple-500/30 transition-colors font-mono font-medium"
        >
          "pwwkew" (3)
        </button>
        <button
          onClick={() => applyPreset('tmmzuxt')}
          className="px-2 py-0.5 text-[11px] rounded bg-indigo-500/10 hover:bg-indigo-500/20 text-indigo-300 border border-indigo-500/30 transition-colors font-mono"
        >
          "tmmzuxt" (5)
        </button>
        <button
          onClick={() => applyPreset('bbbbb')}
          className="px-2 py-0.5 text-[11px] rounded bg-slate-800 hover:bg-slate-700 text-slate-400 transition-colors font-mono"
        >
          "bbbbb" (1)
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
