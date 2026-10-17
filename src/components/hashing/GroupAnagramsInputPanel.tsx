import React, { useState } from 'react';
import { RotateCcw, Lightbulb } from 'lucide-react';

interface GroupAnagramsInputPanelProps {
  strs: string[];
  setStrs: (strs: string[]) => void;
  onResetToDefaults: () => void;
}

export const GroupAnagramsInputPanel: React.FC<GroupAnagramsInputPanelProps> = ({
  strs,
  setStrs,
  onResetToDefaults,
}) => {
  const [inputVal, setInputVal] = useState<string>(strs.join(', '));

  const applyCustomInputs = () => {
    const parsed = inputVal
      .split(',')
      .map((s) => s.trim().toLowerCase())
      .filter((s) => s.length > 0);

    if (parsed.length >= 1) {
      setStrs(parsed);
      setInputVal(parsed.join(', '));
    }
  };

  const applyPreset = (preset: string[]) => {
    setStrs(preset);
    setInputVal(preset.join(', '));
  };

  return (
    <div className="bg-slate-900/50 border border-slate-800 rounded-xl px-3 py-1.5 flex flex-wrap items-center justify-between gap-2.5 shrink-0">
      <div className="flex items-center gap-2.5 flex-wrap">
        <div className="flex items-center gap-1.5">
          <span className="text-[11px] font-semibold uppercase tracking-wider text-slate-400">
            Words:
          </span>
          <input
            type="text"
            value={inputVal}
            onChange={(e) => setInputVal(e.target.value)}
            onBlur={applyCustomInputs}
            onKeyDown={(e) => e.key === 'Enter' && applyCustomInputs()}
            placeholder="e.g. eat, tea, tan, ate, nat, bat"
            className="w-56 bg-slate-950/80 border border-slate-700/70 rounded-lg px-2.5 py-0.5 text-xs text-white font-mono focus:outline-none focus:border-indigo-500"
          />
        </div>
      </div>

      {/* Presets */}
      <div className="flex items-center gap-1.5 text-xs">
        <span className="text-slate-500 text-[10px] font-medium flex items-center gap-1">
          <Lightbulb className="w-3 h-3 text-amber-400" /> Presets:
        </span>
        <button
          onClick={() => applyPreset(['eat', 'tea', 'tan', 'ate', 'nat', 'bat'])}
          className="px-2 py-0.5 text-[11px] rounded bg-indigo-500/10 hover:bg-indigo-500/20 text-indigo-300 border border-indigo-500/30 transition-colors"
        >
          LeetCode #1 (6 words)
        </button>
        <button
          onClick={() => applyPreset(['listen', 'silent', 'enlist', 'inlets', 'google'])}
          className="px-2 py-0.5 text-[11px] rounded bg-emerald-500/10 hover:bg-emerald-500/20 text-emerald-300 border border-emerald-500/30 transition-colors"
        >
          ("listen", "silent"...)
        </button>
        <button
          onClick={() => applyPreset(['a'])}
          className="px-2 py-0.5 text-[11px] rounded bg-cyan-500/10 hover:bg-cyan-500/20 text-cyan-300 border border-cyan-500/30 transition-colors"
        >
          Single ["a"]
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
