import React, { useState } from 'react';
import { Sparkles } from 'lucide-react';

interface ValidPalindromeInputPanelProps {
  onUpdate: (str: string) => void;
  currentStr: string;
}

export const ValidPalindromeInputPanel: React.FC<ValidPalindromeInputPanelProps> = ({
  onUpdate,
  currentStr
}) => {
  const [inputVal, setInputVal] = useState(currentStr);

  const presets = [
    { label: 'A man, a plan...', value: 'A man, a plan, a canal: Panama' },
    { label: 'race a car (False)', value: 'race a car' },
    { label: 'Was it a car...', value: 'Was it a car or a cat I saw?' },
    { label: 'Empty space', value: ' ' }
  ];

  const handleApply = (e: React.FormEvent) => {
    e.preventDefault();
    if (inputVal.length > 0) {
      onUpdate(inputVal);
    }
  };

  return (
    <div className="bg-slate-900/60 border border-slate-800 rounded-xl p-2.5 flex flex-col gap-2 shrink-0">
      <div className="flex items-center justify-between">
        <span className="text-[10px] uppercase font-mono font-bold tracking-wider text-slate-400">
          Custom String:
        </span>
        <div className="flex items-center gap-1">
          {presets.map((p, idx) => (
            <button
              key={idx}
              onClick={() => {
                setInputVal(p.value);
                onUpdate(p.value);
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
          value={inputVal}
          onChange={(e) => setInputVal(e.target.value)}
          placeholder="e.g. A man, a plan, a canal: Panama"
          className="flex-1 bg-slate-950/80 border border-slate-800 rounded-lg px-2.5 py-1 text-xs font-mono text-slate-200 focus:outline-none focus:border-cyan-500/50"
        />
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
