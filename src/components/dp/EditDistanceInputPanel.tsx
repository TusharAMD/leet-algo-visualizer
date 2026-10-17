import React, { useState } from 'react';
import { Play, RotateCcw } from 'lucide-react';

interface EditDistanceInputPanelProps {
  initialWord1: string;
  initialWord2: string;
  onApply: (w1: string, w2: string) => void;
}

export const EditDistanceInputPanel: React.FC<EditDistanceInputPanelProps> = ({
  initialWord1,
  initialWord2,
  onApply,
}) => {
  const [w1, setW1] = useState<string>(initialWord1);
  const [w2, setW2] = useState<string>(initialWord2);

  const presets = [
    { label: '"horse" & "ros"', w1: 'horse', w2: 'ros' },
    { label: '"intention" & "execution"', w1: 'intend', w2: 'extend' },
    { label: '"kitten" & "sitting"', w1: 'kitten', w2: 'sitting' },
    { label: '"abc" & "abc" (0 ops)', w1: 'abc', w2: 'abc' },
  ];

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (w1.length <= 7 && w2.length <= 7) {
      onApply(w1.trim(), w2.trim());
    }
  };

  return (
    <div className="bg-slate-900 border border-slate-800 rounded-xl p-4 flex flex-col gap-4">
      <div className="flex items-center justify-between">
        <h3 className="text-sm font-semibold text-slate-200">Word Inputs</h3>
        <span className="text-xs text-slate-400">Edit Distance</span>
      </div>

      <form onSubmit={handleSubmit} className="flex flex-col gap-3">
        <div className="grid grid-cols-2 gap-3">
          <div>
            <label className="text-xs text-slate-400 mb-1 block">Word 1 (max 7 chars)</label>
            <input
              type="text"
              maxLength={7}
              value={w1}
              onChange={(e) => setW1(e.target.value)}
              className="w-full bg-slate-950 border border-slate-700 rounded-lg px-3 py-2 text-sm text-slate-100 font-mono focus:outline-none focus:border-indigo-500"
            />
          </div>
          <div>
            <label className="text-xs text-slate-400 mb-1 block">Word 2 (max 7 chars)</label>
            <input
              type="text"
              maxLength={7}
              value={w2}
              onChange={(e) => setW2(e.target.value)}
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
                setW1(p.w1);
                setW2(p.w2);
                onApply(p.w1, p.w2);
              }}
              className="px-2.5 py-1 text-xs rounded bg-slate-800 hover:bg-slate-700 text-slate-300 border border-slate-700 transition-colors"
            >
              {p.label}
            </button>
          ))}
          <button
            onClick={() => {
              setW1(initialWord1);
              setW2(initialWord2);
              onApply(initialWord1, initialWord2);
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
