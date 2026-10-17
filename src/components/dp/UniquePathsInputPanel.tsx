import React, { useState } from 'react';
import { Play, RotateCcw } from 'lucide-react';

interface UniquePathsInputPanelProps {
  initialM: number;
  initialN: number;
  onApply: (m: number, n: number) => void;
}

export const UniquePathsInputPanel: React.FC<UniquePathsInputPanelProps> = ({
  initialM,
  initialN,
  onApply,
}) => {
  const [m, setM] = useState<number>(initialM);
  const [n, setN] = useState<number>(initialN);

  const presets = [
    { label: '3 x 7 (Standard)', m: 3, n: 7 },
    { label: '3 x 2', m: 3, n: 2 },
    { label: '3 x 3 (Square)', m: 3, n: 3 },
    { label: '4 x 4', m: 4, n: 4 },
    { label: '2 x 5', m: 2, n: 5 },
  ];

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (m >= 1 && m <= 8 && n >= 1 && n <= 8) {
      onApply(m, n);
    }
  };

  return (
    <div className="bg-slate-900 border border-slate-800 rounded-xl p-4 flex flex-col gap-4">
      <div className="flex items-center justify-between">
        <h3 className="text-sm font-semibold text-slate-200">Grid Dimensions</h3>
        <span className="text-xs text-slate-400">Unique Paths</span>
      </div>

      <form onSubmit={handleSubmit} className="flex flex-col gap-3">
        <div className="grid grid-cols-2 gap-3">
          <div>
            <label className="text-xs text-slate-400 mb-1 block">Rows (m, 1-8)</label>
            <input
              type="number"
              min={1}
              max={8}
              value={m}
              onChange={(e) => setM(parseInt(e.target.value, 10) || 1)}
              className="w-full bg-slate-950 border border-slate-700 rounded-lg px-3 py-2 text-sm text-slate-100 font-mono focus:outline-none focus:border-indigo-500"
            />
          </div>
          <div>
            <label className="text-xs text-slate-400 mb-1 block">Columns (n, 1-8)</label>
            <input
              type="number"
              min={1}
              max={8}
              value={n}
              onChange={(e) => setN(parseInt(e.target.value, 10) || 1)}
              className="w-full bg-slate-950 border border-slate-700 rounded-lg px-3 py-2 text-sm text-slate-100 font-mono focus:outline-none focus:border-indigo-500"
            />
          </div>
        </div>

        <button
          type="submit"
          className="flex items-center justify-center gap-2 bg-indigo-600 hover:bg-indigo-500 text-white rounded-lg py-2 text-sm font-medium transition-colors"
        >
          <Play className="w-4 h-4" /> Apply & Run
        </button>
      </form>

      {/* Presets */}
      <div>
        <span className="text-xs text-slate-400 mb-2 block font-medium">Quick Presets</span>
        <div className="flex flex-wrap gap-1.5">
          {presets.map((p, idx) => (
            <button
              key={idx}
              onClick={() => {
                setM(p.m);
                setN(p.n);
                onApply(p.m, p.n);
              }}
              className="px-2.5 py-1 text-xs rounded bg-slate-800 hover:bg-slate-700 text-slate-300 border border-slate-700 transition-colors"
            >
              {p.label}
            </button>
          ))}
          <button
            onClick={() => {
              setM(initialM);
              setN(initialN);
              onApply(initialM, initialN);
            }}
            className="px-2.5 py-1 text-xs rounded bg-slate-800 hover:bg-slate-700 text-slate-400 border border-slate-700 flex items-center gap-1"
          >
            <RotateCcw className="w-3 h-3" /> Reset
          </button>
        </div>
      </div>
    </div>
  );
};
