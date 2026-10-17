import React, { useState } from 'react';
import { RotateCcw, Lightbulb } from 'lucide-react';

interface ValidAnagramInputPanelProps {
  s: string;
  setS: (s: string) => void;
  t: string;
  setT: (t: string) => void;
  onResetToDefaults: () => void;
}

export const ValidAnagramInputPanel: React.FC<ValidAnagramInputPanelProps> = ({
  s,
  setS,
  t,
  setT,
  onResetToDefaults,
}) => {
  const [sInput, setSInput] = useState<string>(s);
  const [tInput, setTInput] = useState<string>(t);

  const applyCustomInputs = () => {
    if (sInput.trim().length > 0 && tInput.trim().length > 0) {
      setS(sInput.trim().toLowerCase());
      setT(tInput.trim().toLowerCase());
    }
  };

  const applyPreset = (presetS: string, presetT: string) => {
    setS(presetS);
    setT(presetT);
    setSInput(presetS);
    setTInput(presetT);
  };

  return (
    <div className="bg-slate-900/50 border border-slate-800 rounded-xl px-3 py-1.5 flex flex-wrap items-center justify-between gap-2.5 shrink-0">
      <div className="flex items-center gap-2.5 flex-wrap">
        <div className="flex items-center gap-1.5">
          <span className="text-[11px] font-semibold uppercase tracking-wider text-slate-400">
            s:
          </span>
          <input
            type="text"
            value={sInput}
            onChange={(e) => setSInput(e.target.value)}
            onBlur={applyCustomInputs}
            onKeyDown={(e) => e.key === 'Enter' && applyCustomInputs()}
            className="w-28 bg-slate-950/80 border border-slate-700/70 rounded-lg px-2.5 py-0.5 text-xs text-white font-mono focus:outline-none focus:border-indigo-500"
          />
        </div>

        <div className="flex items-center gap-1.5">
          <span className="text-[11px] font-semibold uppercase tracking-wider text-slate-400">
            t:
          </span>
          <input
            type="text"
            value={tInput}
            onChange={(e) => setTInput(e.target.value)}
            onBlur={applyCustomInputs}
            onKeyDown={(e) => e.key === 'Enter' && applyCustomInputs()}
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
          onClick={() => applyPreset('anagram', 'nagaram')}
          className="px-2 py-0.5 text-[11px] rounded bg-indigo-500/10 hover:bg-indigo-500/20 text-indigo-300 border border-indigo-500/30 transition-colors"
        >
          LeetCode #1 ("anagram", "nagaram")
        </button>
        <button
          onClick={() => applyPreset('rat', 'car')}
          className="px-2 py-0.5 text-[11px] rounded bg-rose-500/10 hover:bg-rose-500/20 text-rose-300 border border-rose-500/30 transition-colors font-medium"
        >
          Mismatch ("rat", "car")
        </button>
        <button
          onClick={() => applyPreset('listen', 'silent')}
          className="px-2 py-0.5 text-[11px] rounded bg-emerald-500/10 hover:bg-emerald-500/20 text-emerald-300 border border-emerald-500/30 transition-colors"
        >
          ("listen", "silent")
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
