import React, { useState } from 'react';
import { RotateCcw, Lightbulb } from 'lucide-react';

interface TemperaturesInputPanelProps {
  temperatures: number[];
  setTemperatures: (temps: number[]) => void;
  onResetToDefaults: () => void;
}

export const TemperaturesInputPanel: React.FC<TemperaturesInputPanelProps> = ({
  temperatures,
  setTemperatures,
  onResetToDefaults,
}) => {
  const [inputVal, setInputVal] = useState<string>(temperatures.join(', '));

  const applyCustomInput = () => {
    const parsed = inputVal
      .split(',')
      .map((s) => parseInt(s.trim(), 10))
      .filter((n) => !isNaN(n) && n > 0);

    if (parsed.length >= 2) {
      setTemperatures(parsed);
      setInputVal(parsed.join(', '));
    }
  };

  const applyPreset = (preset: number[]) => {
    setTemperatures(preset);
    setInputVal(preset.join(', '));
  };

  return (
    <div className="bg-slate-900/50 border border-slate-800 rounded-xl px-3 py-1.5 flex flex-wrap items-center justify-between gap-2.5 shrink-0">
      {/* Input */}
      <div className="flex items-center gap-2">
        <span className="text-[11px] font-semibold uppercase tracking-wider text-slate-400">
          Daily Temps:
        </span>
        <input
          type="text"
          value={inputVal}
          onChange={(e) => setInputVal(e.target.value)}
          onBlur={applyCustomInput}
          onKeyDown={(e) => e.key === 'Enter' && applyCustomInput()}
          placeholder="e.g. 73, 74, 75, 71, 69, 72, 76, 73"
          className="w-56 bg-slate-950/80 border border-slate-700/70 rounded-lg px-2.5 py-0.5 text-xs text-white font-mono focus:outline-none focus:border-indigo-500"
        />
      </div>

      {/* Presets */}
      <div className="flex items-center gap-1.5 text-xs">
        <span className="text-slate-500 text-[10px] font-medium flex items-center gap-1">
          <Lightbulb className="w-3 h-3 text-amber-400" /> Presets:
        </span>
        <button
          onClick={() => applyPreset([73, 74, 75, 71, 69, 72, 76, 73])}
          className="px-2 py-0.5 text-[11px] rounded bg-slate-800/80 hover:bg-slate-700 text-slate-300 transition-colors"
        >
          LeetCode #1 (8 days)
        </button>
        <button
          onClick={() => applyPreset([30, 40, 50, 60])}
          className="px-2 py-0.5 text-[11px] rounded bg-orange-500/10 hover:bg-orange-500/20 text-orange-300 border border-orange-500/30 transition-colors font-medium"
        >
          Rising [1, 1, 1, 0]
        </button>
        <button
          onClick={() => applyPreset([30, 60, 90])}
          className="px-2 py-0.5 text-[11px] rounded bg-indigo-500/10 hover:bg-indigo-500/20 text-indigo-300 border border-indigo-500/30 transition-colors"
        >
          Quick Jump [1, 1, 0]
        </button>
        <button
          onClick={() => applyPreset([89, 62, 70, 58, 47, 43, 76, 37])}
          className="px-2 py-0.5 text-[11px] rounded bg-slate-800 hover:bg-slate-700 text-slate-400 transition-colors"
        >
          Rollercoaster
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
