import React, { useState } from 'react';
import { Sparkles } from 'lucide-react';

interface CharReplacementInputPanelProps {
  onUpdate: (s: string, k: number) => void;
  currentStr: string;
  currentK: number;
}

export const CharReplacementInputPanel: React.FC<CharReplacementInputPanelProps> = ({
  onUpdate,
  currentStr,
  currentK
}) => {
  const [str, setStr] = useState(currentStr);
  const [kVal, setKVal] = useState(currentK);

  const presets = [
    { label: 'Standard "ABAB", k=2', s: 'ABAB', k: 2 },
    { label: 'Longer "AABABBA", k=1', s: 'AABABBA', k: 1 },
    { label: 'All Identical "AAAA", k=2', s: 'AAAA', k: 2 },
    { label: 'Alternating "ABBBACBA", k=2', s: 'ABBBACBA', k: 2 }
  ];

  const handleApply = (e: React.FormEvent) => {
    e.preventDefault();
    if (str.length > 0 && kVal >= 0) {
      onUpdate(str.toUpperCase(), kVal);
    }
  };

  return (
    <div className="bg-slate-900/60 border border-slate-800 rounded-xl p-2.5 flex flex-col gap-2 shrink-0">
      <div className="flex items-center justify-between">
        <span className="text-[10px] uppercase font-mono font-bold tracking-wider text-slate-400">
          Custom String & k Replacements:
        </span>
        <div className="flex items-center gap-1">
          {presets.map((p, idx) => (
            <button
              key={idx}
              onClick={() => {
                setStr(p.s);
                setKVal(p.k);
                onUpdate(p.s, p.k);
              }}
              className="text-[10px] px-2 py-0.5 rounded bg-slate-800 hover:bg-slate-700 text-slate-300 font-medium transition-colors"
            >
              {p.label.split(' ')[0]}
            </button>
          ))}
        </div>
      </div>

      <form onSubmit={handleApply} className="flex items-center gap-2">
        <input
          type="text"
          value={str}
          onChange={(e) => setStr(e.target.value.toUpperCase())}
          placeholder="e.g. AABABBA"
          className="flex-1 bg-slate-950/80 border border-slate-800 rounded-lg px-2.5 py-1 text-xs font-mono text-slate-200 focus:outline-none focus:border-pink-500/50"
        />
        <div className="flex items-center gap-1 bg-slate-950/80 border border-slate-800 rounded-lg px-2 py-1">
          <span className="text-[10px] font-mono text-slate-400">k:</span>
          <input
            type="number"
            min={0}
            max={10}
            value={kVal}
            onChange={(e) => setKVal(parseInt(e.target.value, 10) || 0)}
            className="w-10 bg-transparent text-xs font-mono text-pink-400 focus:outline-none"
          />
        </div>
        <button
          type="submit"
          className="px-3 py-1 rounded-lg bg-pink-500 hover:bg-pink-400 text-slate-950 font-semibold text-xs transition-colors flex items-center gap-1 shadow-md shadow-pink-500/20"
        >
          <Sparkles className="w-3.5 h-3.5" /> Visualize
        </button>
      </form>
    </div>
  );
};
