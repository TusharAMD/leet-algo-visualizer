import React, { useState } from 'react';
import { Sparkles } from 'lucide-react';

interface KokoBananasInputPanelProps {
  onUpdate: (piles: number[], h: number) => void;
  currentPiles: number[];
  currentH: number;
}

export const KokoBananasInputPanel: React.FC<KokoBananasInputPanelProps> = ({
  onUpdate,
  currentPiles,
  currentH
}) => {
  const [pilesStr, setPilesStr] = useState(currentPiles.join(', '));
  const [hVal, setHVal] = useState(currentH);

  const presets = [
    { label: 'Standard [3,6,7,11], h=8 (k=4)', piles: [3, 6, 7, 11], h: 8 },
    { label: 'Tight [30,11,23,4,20], h=5 (k=30)', piles: [30, 11, 23, 4, 20], h: 5 },
    { label: 'Generous [30,11,23,4,20], h=6 (k=23)', piles: [30, 11, 23, 4, 20], h: 6 },
    { label: 'Small [3, 3, 3], h=4 (k=3)', piles: [3, 3, 3], h: 4 }
  ];

  const handleApply = (e: React.FormEvent) => {
    e.preventDefault();
    const parsed = pilesStr
      .split(',')
      .map((s) => parseInt(s.trim(), 10))
      .filter((n) => !isNaN(n) && n > 0);

    if (parsed.length > 0 && hVal >= parsed.length) {
      onUpdate(parsed, hVal);
    }
  };

  return (
    <div className="bg-slate-900/60 border border-slate-800 rounded-xl p-2.5 flex flex-col gap-2 shrink-0">
      <div className="flex items-center justify-between">
        <span className="text-[10px] uppercase font-mono font-bold tracking-wider text-slate-400">
          Banana Piles & Hours Limit h:
        </span>
        <div className="flex items-center gap-1">
          {presets.map((p, idx) => (
            <button
              key={idx}
              onClick={() => {
                setPilesStr(p.piles.join(', '));
                setHVal(p.h);
                onUpdate(p.piles, p.h);
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
          value={pilesStr}
          onChange={(e) => setPilesStr(e.target.value)}
          placeholder="e.g. 3, 6, 7, 11"
          className="flex-1 bg-slate-950/80 border border-slate-800 rounded-lg px-2.5 py-1 text-xs font-mono text-slate-200 focus:outline-none focus:border-amber-500/50"
        />
        <div className="flex items-center gap-1 bg-slate-950/80 border border-slate-800 rounded-lg px-2 py-1">
          <span className="text-[10px] font-mono text-slate-400">h:</span>
          <input
            type="number"
            min={1}
            value={hVal}
            onChange={(e) => setHVal(parseInt(e.target.value, 10) || 1)}
            className="w-12 bg-transparent text-xs font-mono text-amber-400 focus:outline-none"
          />
        </div>
        <button
          type="submit"
          className="px-3 py-1 rounded-lg bg-amber-500 hover:bg-amber-400 text-slate-950 font-semibold text-xs transition-colors flex items-center gap-1 shadow-md shadow-amber-500/20"
        >
          <Sparkles className="w-3.5 h-3.5" /> Visualize
        </button>
      </form>
    </div>
  );
};
