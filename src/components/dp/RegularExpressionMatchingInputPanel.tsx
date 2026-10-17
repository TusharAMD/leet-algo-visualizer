import React, { useState } from 'react';
import { Play, RotateCcw } from 'lucide-react';

interface RegexInputPanelProps {
  initialS: string;
  initialP: string;
  onApply: (s: string, p: string) => void;
}

export const RegularExpressionMatchingInputPanel: React.FC<RegexInputPanelProps> = ({
  initialS,
  initialP,
  onApply,
}) => {
  const [s, setS] = useState<string>(initialS);
  const [p, setP] = useState<string>(initialP);

  const presets = [
    { label: 's="aa", p="a*" (True)', s: 'aa', p: 'a*' },
    { label: 's="ab", p=".*" (True)', s: 'ab', p: '.*' },
    { label: 's="aa", p="a" (False)', s: 'aa', p: 'a' },
    { label: 's="aab", p="c*a*b" (True)', s: 'aab', p: 'c*a*b' },
    { label: 's="mississippi", p="mis*is*p*." (False)', s: 'mississippi', p: 'mis*is*p*.' },
  ];

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (s.length <= 8 && p.length <= 8) {
      onApply(s.trim(), p.trim());
    }
  };

  return (
    <div className="bg-slate-900 border border-slate-800 rounded-xl p-4 flex flex-col gap-4">
      <div className="flex items-center justify-between">
        <h3 className="text-sm font-semibold text-slate-200">Strings Input</h3>
        <span className="text-xs text-slate-400">Regular Expression Matching</span>
      </div>

      <form onSubmit={handleSubmit} className="flex flex-col gap-3">
        <div>
          <label className="text-xs text-slate-400 mb-1 block">String s (max 8 chars)</label>
          <input
            type="text"
            maxLength={8}
            value={s}
            onChange={(e) => setS(e.target.value)}
            className="w-full bg-slate-950 border border-slate-700 rounded-lg px-3 py-2 text-sm text-slate-100 font-mono focus:outline-none focus:border-indigo-500"
          />
        </div>

        <div>
          <label className="text-xs text-slate-400 mb-1 block">Pattern p (max 8 chars, with . and *)</label>
          <input
            type="text"
            maxLength={8}
            value={p}
            onChange={(e) => setP(e.target.value)}
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
          {presets.map((preset, idx) => (
            <button
              key={idx}
              onClick={() => {
                setS(preset.s);
                setP(preset.p);
                onApply(preset.s, preset.p);
              }}
              className="px-2.5 py-1 text-xs rounded bg-slate-800 hover:bg-slate-700 text-slate-300 border border-slate-700 transition-colors"
            >
              {preset.label}
            </button>
          ))}
          <button
            onClick={() => {
              setS(initialS);
              setP(initialP);
              onApply(initialS, initialP);
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
