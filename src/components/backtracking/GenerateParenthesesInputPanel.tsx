import React, { useState } from 'react';
import { Sparkles } from 'lucide-react';

interface GenerateParenthesesInputPanelProps {
  onUpdate: (n: number) => void;
  currentN: number;
}

export const GenerateParenthesesInputPanel: React.FC<GenerateParenthesesInputPanelProps> = ({
  onUpdate,
  currentN
}) => {
  const [nVal, setNVal] = useState(currentN);

  const presets = [
    { label: 'n = 1 (1 comb)', n: 1 },
    { label: 'n = 2 (2 combs)', n: 2 },
    { label: 'n = 3 (5 combs)', n: 3 },
    { label: 'n = 4 (14 combs)', n: 4 }
  ];

  return (
    <div className="bg-slate-900/60 border border-slate-800 rounded-xl p-2.5 flex items-center justify-between shrink-0">
      <div className="flex items-center gap-2">
        <span className="text-[10px] uppercase font-mono font-bold tracking-wider text-slate-400">
          Pairs (n):
        </span>
        <div className="flex items-center gap-1">
          {presets.map((p, idx) => (
            <button
              key={idx}
              onClick={() => {
                setNVal(p.n);
                onUpdate(p.n);
              }}
              className="text-[10px] px-2.5 py-1 rounded bg-slate-800 hover:bg-slate-700 text-slate-300 font-medium transition-colors"
            >
              {p.label}
            </button>
          ))}
        </div>
      </div>

      <div className="flex items-center gap-2">
        <span className="text-xs text-slate-400 font-mono">Custom n (1-4):</span>
        <input
          type="number"
          min={1}
          max={4}
          value={nVal}
          onChange={(e) => {
            const val = Math.min(4, Math.max(1, parseInt(e.target.value, 10) || 1));
            setNVal(val);
            onUpdate(val);
          }}
          className="w-12 bg-slate-950/80 border border-slate-800 rounded-lg px-2 py-0.5 text-xs font-mono text-cyan-400 focus:outline-none"
        />
      </div>
    </div>
  );
};
