import React, { useState } from 'react';
import { Play, RotateCcw } from 'lucide-react';

interface HappyNumberInputPanelProps {
  initialN: number;
  onApply: (n: number) => void;
}

export const HappyNumberInputPanel: React.FC<HappyNumberInputPanelProps> = ({
  initialN,
  onApply,
}) => {
  const [num, setNum] = useState<number>(initialN);

  const presets = [
    { label: 'Happy: 19', n: 19 },
    { label: 'Happy: 7', n: 7 },
    { label: 'Happy: 100', n: 100 },
    { label: 'Unhappy: 2', n: 2 },
    { label: 'Unhappy: 4', n: 4 },
  ];

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (num > 0) {
      onApply(num);
    }
  };

  return (
    <div className="bg-slate-900 border border-slate-800 rounded-xl p-4 flex flex-col gap-4">
      <div className="flex items-center justify-between">
        <h3 className="text-sm font-semibold text-slate-200">Number Input</h3>
        <span className="text-xs text-slate-400">Happy Number</span>
      </div>

      <form onSubmit={handleSubmit} className="flex flex-col gap-3">
        <div>
          <label className="text-xs text-slate-400 mb-1 block">Positive Integer (n)</label>
          <input
            type="number"
            min={1}
            max={100000}
            value={num}
            onChange={(e) => setNum(parseInt(e.target.value, 10) || 1)}
            className="w-full bg-slate-950 border border-slate-700 rounded-lg px-3 py-2 text-sm text-slate-100 font-mono focus:outline-none focus:border-indigo-500"
            placeholder="19"
          />
        </div>

        <div className="flex gap-2">
          <button
            type="submit"
            className="flex-1 flex items-center justify-center gap-2 bg-indigo-600 hover:bg-indigo-500 text-white font-medium py-2 px-4 rounded-lg text-sm transition"
          >
            <Play className="w-4 h-4" />
            Check Number
          </button>
          <button
            type="button"
            onClick={() => {
              setNum(initialN);
              onApply(initialN);
            }}
            className="flex items-center justify-center bg-slate-800 hover:bg-slate-700 text-slate-300 py-2 px-3 rounded-lg text-sm transition"
            title="Reset to default"
          >
            <RotateCcw className="w-4 h-4" />
          </button>
        </div>
      </form>

      <div className="flex flex-col gap-1.5 pt-2 border-t border-slate-800/80">
        <span className="text-xs text-slate-400 font-medium">Presets:</span>
        <div className="flex flex-wrap gap-1.5">
          {presets.map((preset, idx) => (
            <button
              key={idx}
              onClick={() => {
                setNum(preset.n);
                onApply(preset.n);
              }}
              className="text-xs bg-slate-800 hover:bg-slate-700 text-slate-300 px-2.5 py-1 rounded-md transition border border-slate-700/60 font-mono"
            >
              {preset.label}
            </button>
          ))}
        </div>
      </div>
    </div>
  );
};
