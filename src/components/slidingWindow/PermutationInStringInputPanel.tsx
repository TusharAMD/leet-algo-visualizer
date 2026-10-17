import React, { useState } from 'react';
import { Sparkles } from 'lucide-react';

interface PermutationInStringInputPanelProps {
  onUpdate: (s1: string, s2: string) => void;
  currentS1: string;
  currentS2: string;
}

export const PermutationInStringInputPanel: React.FC<PermutationInStringInputPanelProps> = ({
  onUpdate,
  currentS1,
  currentS2
}) => {
  const [s1Val, setS1Val] = useState(currentS1);
  const [s2Val, setS2Val] = useState(currentS2);

  const presets = [
    { label: 'Match "ab" in "eidbaooo"', s1: 'ab', s2: 'eidbaooo' },
    { label: 'Mismatch "ab" in "eidboaoo"', s1: 'ab', s2: 'eidboaoo' },
    { label: 'Anagram "adc" in "dcda"', s1: 'adc', s2: 'dcda' },
    { label: 'Single "a" in "ab"', s1: 'a', s2: 'ab' }
  ];

  const handleApply = (e: React.FormEvent) => {
    e.preventDefault();
    if (s1Val.length > 0 && s2Val.length > 0) {
      onUpdate(s1Val.toLowerCase(), s2Val.toLowerCase());
    }
  };

  return (
    <div className="bg-slate-900/60 border border-slate-800 rounded-xl p-2.5 flex flex-col gap-2 shrink-0">
      <div className="flex items-center justify-between">
        <span className="text-[10px] uppercase font-mono font-bold tracking-wider text-slate-400">
          Strings s1 & s2:
        </span>
        <div className="flex items-center gap-1">
          {presets.map((p, idx) => (
            <button
              key={idx}
              onClick={() => {
                setS1Val(p.s1);
                setS2Val(p.s2);
                onUpdate(p.s1, p.s2);
              }}
              className="text-[10px] px-2 py-0.5 rounded bg-slate-800 hover:bg-slate-700 text-slate-300 font-medium transition-colors"
            >
              {p.label.split(' ')[0]}
            </button>
          ))}
        </div>
      </div>

      <form onSubmit={handleApply} className="flex items-center gap-2">
        <div className="flex items-center gap-1 bg-slate-950/80 border border-slate-800 rounded-lg px-2.5 py-1">
          <span className="text-[10px] font-mono text-slate-400">s1:</span>
          <input
            type="text"
            value={s1Val}
            onChange={(e) => setS1Val(e.target.value)}
            placeholder="e.g. ab"
            className="w-20 bg-transparent text-xs font-mono text-emerald-400 focus:outline-none"
          />
        </div>
        <div className="flex-1 flex items-center gap-1 bg-slate-950/80 border border-slate-800 rounded-lg px-2.5 py-1">
          <span className="text-[10px] font-mono text-slate-400">s2:</span>
          <input
            type="text"
            value={s2Val}
            onChange={(e) => setS2Val(e.target.value)}
            placeholder="e.g. eidbaooo"
            className="flex-1 bg-transparent text-xs font-mono text-slate-200 focus:outline-none"
          />
        </div>
        <button
          type="submit"
          className="px-3 py-1 rounded-lg bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-semibold text-xs transition-colors flex items-center gap-1 shadow-md shadow-emerald-500/20"
        >
          <Sparkles className="w-3.5 h-3.5" /> Visualize
        </button>
      </form>
    </div>
  );
};
