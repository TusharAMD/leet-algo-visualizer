import React, { useState } from 'react';
import { Play, RotateCcw } from 'lucide-react';

interface PlusOneInputPanelProps {
  initialDigits: number[];
  onApply: (digits: number[]) => void;
}

export const PlusOneInputPanel: React.FC<PlusOneInputPanelProps> = ({
  initialDigits,
  onApply,
}) => {
  const [digitsStr, setDigitsStr] = useState<string>(
    initialDigits.join(', ')
  );

  const presets = [
    { label: 'Standard: [1, 2, 3]', digits: [1, 2, 3] },
    { label: 'Ends with 9: [4, 3, 2, 9]', digits: [4, 3, 2, 9] },
    { label: 'All 9s: [9, 9, 9]', digits: [9, 9, 9] },
    { label: 'Single 9: [9]', digits: [9] },
    { label: 'Single digit: [0]', digits: [0] },
  ];

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const parsed = digitsStr
      .split(',')
      .map((x) => parseInt(x.trim(), 10))
      .filter((x) => !isNaN(x) && x >= 0 && x <= 9);

    if (parsed.length > 0) {
      onApply(parsed);
    }
  };

  return (
    <div className="bg-slate-900 border border-slate-800 rounded-xl p-4 flex flex-col gap-4">
      <div className="flex items-center justify-between">
        <h3 className="text-sm font-semibold text-slate-200">Digits Configuration</h3>
        <span className="text-xs text-slate-400">Plus One</span>
      </div>

      <form onSubmit={handleSubmit} className="flex flex-col gap-3">
        <div>
          <label className="text-xs text-slate-400 mb-1 block">Digits (comma-separated 0-9)</label>
          <input
            type="text"
            value={digitsStr}
            onChange={(e) => setDigitsStr(e.target.value)}
            className="w-full bg-slate-950 border border-slate-700 rounded-lg px-3 py-2 text-sm text-slate-100 font-mono focus:outline-none focus:border-indigo-500"
            placeholder="1, 2, 3"
          />
        </div>

        <div className="flex gap-2">
          <button
            type="submit"
            className="flex-1 flex items-center justify-center gap-2 bg-indigo-600 hover:bg-indigo-500 text-white font-medium py-2 px-4 rounded-lg text-sm transition"
          >
            <Play className="w-4 h-4" />
            Apply Digits
          </button>
          <button
            type="button"
            onClick={() => {
              setDigitsStr(initialDigits.join(', '));
              onApply(initialDigits);
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
                setDigitsStr(preset.digits.join(', '));
                onApply(preset.digits);
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
