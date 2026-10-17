import React, { useState } from 'react';
import { Play, RotateCcw } from 'lucide-react';

interface PowxNInputPanelProps {
  initialX: number;
  initialN: number;
  onApply: (x: number, n: number) => void;
}

export const PowxNInputPanel: React.FC<PowxNInputPanelProps> = ({
  initialX,
  initialN,
  onApply,
}) => {
  const [xVal, setXVal] = useState<number>(initialX);
  const [nVal, setNVal] = useState<number>(initialN);

  const presets = [
    { label: '2.0 ^ 10 = 1024', x: 2.0, n: 10 },
    { label: '2.1 ^ 3 = 9.261', x: 2.1, n: 3 },
    { label: '2.0 ^ -2 = 0.25', x: 2.0, n: -2 },
    { label: '3.0 ^ 5 = 243', x: 3.0, n: 5 },
    { label: '1.5 ^ 4 = 5.0625', x: 1.5, n: 4 },
  ];

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!isNaN(xVal) && !isNaN(nVal)) {
      onApply(xVal, nVal);
    }
  };

  return (
    <div className="bg-slate-900 border border-slate-800 rounded-xl p-4 flex flex-col gap-4">
      <div className="flex items-center justify-between">
        <h3 className="text-sm font-semibold text-slate-200">Exponentiation Parameters</h3>
        <span className="text-xs text-slate-400">Pow(x, n)</span>
      </div>

      <form onSubmit={handleSubmit} className="grid grid-cols-1 md:grid-cols-12 gap-3">
        <div className="md:col-span-6">
          <label className="text-xs text-slate-400 mb-1 block">Base (x)</label>
          <input
            type="number"
            step="any"
            value={xVal}
            onChange={(e) => setXVal(parseFloat(e.target.value) || 0)}
            className="w-full bg-slate-950 border border-slate-700 rounded-lg px-3 py-2 text-sm text-slate-100 font-mono focus:outline-none focus:border-indigo-500"
            placeholder="2.0"
          />
        </div>

        <div className="md:col-span-6">
          <label className="text-xs text-slate-400 mb-1 block">Exponent (n)</label>
          <input
            type="number"
            value={nVal}
            onChange={(e) => setNVal(parseInt(e.target.value, 10) || 0)}
            className="w-full bg-slate-950 border border-slate-700 rounded-lg px-3 py-2 text-sm text-slate-100 font-mono focus:outline-none focus:border-indigo-500"
            placeholder="10"
          />
        </div>

        <div className="md:col-span-12 flex gap-2">
          <button
            type="submit"
            className="flex-1 flex items-center justify-center gap-2 bg-indigo-600 hover:bg-indigo-500 text-white font-medium py-2 px-4 rounded-lg text-sm transition"
          >
            <Play className="w-4 h-4" />
            Compute Pow(x, n)
          </button>
          <button
            type="button"
            onClick={() => {
              setXVal(initialX);
              setNVal(initialN);
              onApply(initialX, initialN);
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
                setXVal(preset.x);
                setNVal(preset.n);
                onApply(preset.x, preset.n);
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
