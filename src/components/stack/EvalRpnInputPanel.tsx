import React, { useState } from 'react';
import { Sparkles } from 'lucide-react';

interface EvalRpnInputPanelProps {
  onUpdate: (tokens: string[]) => void;
  currentTokens: string[];
}

export const EvalRpnInputPanel: React.FC<EvalRpnInputPanelProps> = ({
  onUpdate,
  currentTokens
}) => {
  const [inputVal, setInputVal] = useState(currentTokens.join(' '));

  const presets = [
    { label: 'Standard ["2","1","+","3","*"] (9)', tokens: ['2', '1', '+', '3', '*'] },
    { label: 'Division ["4","13","5","/","+"] (6)', tokens: ['4', '13', '5', '/', '+'] },
    { label: 'Complex ["10","6","9","3","+","-11","*","/","*","17","+","5","+"] (22)', tokens: ['10', '6', '9', '3', '+', '-11', '*', '/', '*', '17', '+', '5', '+'] },
    { label: 'Sub-Zero ["3","4","-"] (-1)', tokens: ['3', '4', '-'] }
  ];

  const handleApply = (e: React.FormEvent) => {
    e.preventDefault();
    const parts = inputVal.trim().split(/\s+/).filter(Boolean);
    if (parts.length > 0) {
      onUpdate(parts);
    }
  };

  return (
    <div className="bg-slate-900/60 border border-slate-800 rounded-xl p-2.5 flex flex-col gap-2 shrink-0">
      <div className="flex items-center justify-between">
        <span className="text-[10px] uppercase font-mono font-bold tracking-wider text-slate-400">
          RPN Tokens:
        </span>
        <div className="flex items-center gap-1">
          {presets.map((p, idx) => (
            <button
              key={idx}
              onClick={() => {
                setInputVal(p.tokens.join(' '));
                onUpdate(p.tokens);
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
          placeholder="Space separated tokens: e.g. 2 1 + 3 *"
          className="flex-1 bg-slate-950/80 border border-slate-800 rounded-lg px-2.5 py-1 text-xs font-mono text-slate-200 focus:outline-none focus:border-indigo-500/50"
        />
        <button
          type="submit"
          className="px-3 py-1 rounded-lg bg-indigo-500 hover:bg-indigo-400 text-white font-semibold text-xs transition-colors flex items-center gap-1 shadow-md shadow-indigo-500/20"
        >
          <Sparkles className="w-3.5 h-3.5" /> Visualize
        </button>
      </form>
    </div>
  );
};
