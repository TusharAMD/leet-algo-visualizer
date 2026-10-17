import React, { useState } from 'react';
import { Play, RotateCcw } from 'lucide-react';

interface DistinctSubsequencesInputPanelProps {
  initialS: string;
  initialT: string;
  onApply: (s: string, t: string) => void;
}

export const DistinctSubsequencesInputPanel: React.FC<DistinctSubsequencesInputPanelProps> = ({
  initialS,
  initialT,
  onApply,
}) => {
  const [s, setS] = useState<string>(initialS);
  const [t, setT] = useState<string>(initialT);

  const presets = [
    { label: 's="rabbbit", t="rabbit"', s: 'rabbbit', t: 'rabbit' },
    { label: 's="babgbag", t="bag"', s: 'babgbag', t: 'bag' },
    { label: 's="ananas", t="ana"', s: 'ananas', t: 'ana' },
    { label: 's="abc", t="d"', s: 'abc', t: 'd' },
  ];

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (s.trim().length > 0 && t.trim().length > 0) {
      onApply(s.trim(), t.trim());
    }
  };

  return (
    <div className="bg-slate-900 border border-slate-800 rounded-xl p-4 flex flex-col gap-4">
      <div className="flex items-center justify-between">
        <h3 className="text-sm font-semibold text-slate-200">Strings Input</h3>
        <span className="text-xs text-slate-400">Distinct Subsequences</span>
      </div>

      <form onSubmit={handleSubmit} className="flex flex-col gap-3">
        <div>
          <label className="text-xs text-slate-400 mb-1 block">Source String s (max 8 chars)</label>
          <input
            type="text"
            maxLength={8}
            value={s}
            onChange={(e) => setS(e.target.value)}
            className="w-full bg-slate-950 border border-slate-700 rounded-lg px-3 py-2 text-sm text-slate-100 font-mono focus:outline-none focus:border-indigo-500"
          />
        </div>

        <div>
          <label className="text-xs text-slate-400 mb-1 block">Target String t (max 6 chars)</label>
          <input
            type="text"
            maxLength={6}
            value={t}
            onChange={(e) => setT(e.target.value)}
            className="w-full bg-slate-950 border border-slate-700 rounded-lg px-3 py-2 text-sm text-slate-100 font-mono focus:outline-none focus:border-indigo-500"
          />
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
                setS(p.s);
                setT(p.t);
                onApply(p.s, p.t);
              }}
              className="px-2.5 py-1 text-xs rounded bg-slate-800 hover:bg-slate-700 text-slate-300 border border-slate-700 transition-colors"
            >
              {p.label}
            </button>
          ))}
          <button
            onClick={() => {
              setS(initialS);
              setT(initialT);
              onApply(initialS, initialT);
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
