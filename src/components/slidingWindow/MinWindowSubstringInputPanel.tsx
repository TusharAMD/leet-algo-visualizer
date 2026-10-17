import React, { useState } from 'react';
import { Sparkles } from 'lucide-react';

interface MinWindowSubstringInputPanelProps {
  onUpdate: (s: string, t: string) => void;
  currentS: string;
  currentT: string;
}

export const MinWindowSubstringInputPanel: React.FC<MinWindowSubstringInputPanelProps> = ({
  onUpdate,
  currentS,
  currentT
}) => {
  const [sVal, setSVal] = useState(currentS);
  const [tVal, setTVal] = useState(currentT);

  const presets = [
    { label: 'Classic "ADOBECODEBANC", t="ABC"', s: 'ADOBECODEBANC', t: 'ABC' },
    { label: 'Single "a", t="a"', s: 'a', t: 'a' },
    { label: 'No Match "a", t="aa"', s: 'a', t: 'aa' },
    { label: 'Short "ABAACBAB", t="ABC"', s: 'ABAACBAB', t: 'ABC' }
  ];

  const handleApply = (e: React.FormEvent) => {
    e.preventDefault();
    if (sVal.length > 0 && tVal.length > 0) {
      onUpdate(sVal, tVal);
    }
  };

  return (
    <div className="bg-slate-900/60 border border-slate-800 rounded-xl p-2.5 flex flex-col gap-2 shrink-0">
      <div className="flex items-center justify-between">
        <span className="text-[10px] uppercase font-mono font-bold tracking-wider text-slate-400">
          Source String s & Target t:
        </span>
        <div className="flex items-center gap-1">
          {presets.map((p, idx) => (
            <button
              key={idx}
              onClick={() => {
                setSVal(p.s);
                setTVal(p.t);
                onUpdate(p.s, p.t);
              }}
              className="text-[10px] px-2 py-0.5 rounded bg-slate-800 hover:bg-slate-700 text-slate-300 font-medium transition-colors"
            >
              {p.label.split(' ')[0]}
            </button>
          ))}
        </div>
      </div>

      <form onSubmit={handleApply} className="flex items-center gap-2">
        <div className="flex-1 flex items-center gap-1 bg-slate-950/80 border border-slate-800 rounded-lg px-2.5 py-1">
          <span className="text-[10px] font-mono text-slate-400">s:</span>
          <input
            type="text"
            value={sVal}
            onChange={(e) => setSVal(e.target.value)}
            placeholder="e.g. ADOBECODEBANC"
            className="flex-1 bg-transparent text-xs font-mono text-slate-200 focus:outline-none"
          />
        </div>
        <div className="flex items-center gap-1 bg-slate-950/80 border border-slate-800 rounded-lg px-2.5 py-1">
          <span className="text-[10px] font-mono text-slate-400">t:</span>
          <input
            type="text"
            value={tVal}
            onChange={(e) => setTVal(e.target.value)}
            placeholder="e.g. ABC"
            className="w-20 bg-transparent text-xs font-mono text-cyan-400 focus:outline-none"
          />
        </div>
        <button
          type="submit"
          className="px-3 py-1 rounded-lg bg-cyan-500 hover:bg-cyan-400 text-slate-950 font-semibold text-xs transition-colors flex items-center gap-1 shadow-md shadow-cyan-500/20"
        >
          <Sparkles className="w-3.5 h-3.5" /> Visualize
        </button>
      </form>
    </div>
  );
};
