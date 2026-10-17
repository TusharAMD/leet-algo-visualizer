import React, { useState } from 'react';
import { Play, RotateCcw } from 'lucide-react';

interface SumOfTwoIntegersInputPanelProps {
  initialA: number;
  initialB: number;
  onApply: (a: number, b: number) => void;
}

export const SumOfTwoIntegersInputPanel: React.FC<SumOfTwoIntegersInputPanelProps> = ({
  initialA,
  initialB,
  onApply,
}) => {
  const [a, setA] = useState<number>(initialA);
  const [b, setB] = useState<number>(initialB);

  const presets = [
    { label: '1 + 2 = 3', a: 1, b: 2 },
    { label: '2 + 3 = 5', a: 2, b: 3 },
    { label: '9 + 11 = 20', a: 9, b: 11 },
    { label: '15 + 1 = 16', a: 15, b: 1 },
    { label: '20 + 30 = 50', a: 20, b: 30 },
  ];

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!isNaN(a) && !isNaN(b)) {
      onApply(a, b);
    }
  };

  return (
    <div className="bg-slate-900 border border-slate-800 rounded-xl p-4 flex flex-col gap-4">
      <div className="flex items-center justify-between">
        <h3 className="text-sm font-semibold text-slate-200">Addition Operands</h3>
        <span className="text-xs text-slate-400">Sum of Two Integers</span>
      </div>

      <form onSubmit={handleSubmit} className="grid grid-cols-1 md:grid-cols-12 gap-3">
        <div className="md:col-span-6">
          <label className="text-xs text-slate-400 mb-1 block">Integer a</label>
          <input
            type="number"
            value={a}
            onChange={(e) => setA(parseInt(e.target.value, 10) || 0)}
            className="w-full bg-slate-950 border border-slate-700 rounded-lg px-3 py-2 text-sm text-slate-100 font-mono focus:outline-none focus:border-indigo-500"
            placeholder="1"
          />
        </div>

        <div className="md:col-span-6">
          <label className="text-xs text-slate-400 mb-1 block">Integer b</label>
          <input
            type="number"
            value={b}
            onChange={(e) => setB(parseInt(e.target.value, 10) || 0)}
            className="w-full bg-slate-950 border border-slate-700 rounded-lg px-3 py-2 text-sm text-slate-100 font-mono focus:outline-none focus:border-indigo-500"
            placeholder="2"
          />
        </div>

        <div className="md:col-span-12 flex gap-2">
          <button
            type="submit"
            className="flex-1 flex items-center justify-center gap-2 bg-indigo-600 hover:bg-indigo-500 text-white font-medium py-2 px-4 rounded-lg text-sm transition"
          >
            <Play className="w-4 h-4" />
            Compute Sum
          </button>
          <button
            type="button"
            onClick={() => {
              setA(initialA);
              setB(initialB);
              onApply(initialA, initialB);
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
                setA(preset.a);
                setB(preset.b);
                onApply(preset.a, preset.b);
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
