import React, { useState } from 'react';
import { Play, RotateCcw } from 'lucide-react';

interface ReverseIntegerInputPanelProps {
  initialX: number;
  onApply: (x: number) => void;
}

export const ReverseIntegerInputPanel: React.FC<ReverseIntegerInputPanelProps> = ({
  initialX,
  onApply,
}) => {
  const [x, setX] = useState<number>(initialX);

  const presets = [
    { label: '123 -> 321', x: 123 },
    { label: '-123 -> -321', x: -123 },
    { label: '120 -> 21', x: 120 },
    { label: '1534236469 -> 0 (Overflow)', x: 1534236469 },
    { label: '-2147483412 -> -2143847412', x: -2147483412 },
  ];

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!isNaN(x)) {
      onApply(x);
    }
  };

  return (
    <div className="bg-slate-900 border border-slate-800 rounded-xl p-4 flex flex-col gap-4">
      <div className="flex items-center justify-between">
        <h3 className="text-sm font-semibold text-slate-200">Integer Configuration</h3>
        <span className="text-xs text-slate-400">Reverse Integer</span>
      </div>

      <form onSubmit={handleSubmit} className="flex flex-col gap-3">
        <div>
          <label className="text-xs text-slate-400 mb-1 block">Signed 32-bit Integer (x)</label>
          <input
            type="number"
            value={x}
            onChange={(e) => setX(parseInt(e.target.value, 10) || 0)}
            className="w-full bg-slate-950 border border-slate-700 rounded-lg px-3 py-2 text-sm text-slate-100 font-mono focus:outline-none focus:border-indigo-500"
            placeholder="123"
          />
        </div>

        <div className="flex gap-2">
          <button
            type="submit"
            className="flex-1 flex items-center justify-center gap-2 bg-indigo-600 hover:bg-indigo-500 text-white font-medium py-2 px-4 rounded-lg text-sm transition"
          >
            <Play className="w-4 h-4" />
            Reverse Integer
          </button>
          <button
            type="button"
            onClick={() => {
              setX(initialX);
              onApply(initialX);
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
                setX(preset.x);
                onApply(preset.x);
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
