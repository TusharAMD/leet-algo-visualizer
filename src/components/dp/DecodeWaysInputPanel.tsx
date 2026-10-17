import React, { useState } from 'react';
import { Play, RotateCcw } from 'lucide-react';

interface DecodeWaysInputPanelProps {
  initialString: string;
  onApply: (s: string) => void;
}

export const DecodeWaysInputPanel: React.FC<DecodeWaysInputPanelProps> = ({
  initialString,
  onApply,
}) => {
  const [s, setS] = useState(initialString);

  const presets = [
    { label: 'Classic "226"', val: '226' },
    { label: 'Leading zero "06"', val: '06' },
    { label: 'Valid "12"', val: '12' },
    { label: 'Longer "11106"', val: '11106' },
    { label: 'Zero mid "1020"', val: '1020' },
    { label: 'High digits "27"', val: '27' },
  ];

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (s.trim().length > 0 && /^\d+$/.test(s.trim())) {
      onApply(s.trim());
    }
  };

  return (
    <div className="bg-slate-900 border border-slate-800 rounded-xl p-4 flex flex-col gap-4">
      <div className="flex items-center justify-between">
        <h3 className="text-sm font-semibold text-slate-200">Input Configuration</h3>
        <span className="text-xs text-slate-400">Decode Ways</span>
      </div>

      <form onSubmit={handleSubmit} className="flex flex-col gap-3">
        <div>
          <label className="text-xs text-slate-400 mb-1 block">Encoded Digits s</label>
          <input
            type="text"
            value={s}
            maxLength={12}
            onChange={(e) => {
              const val = e.target.value.replace(/\D/g, '');
              setS(val);
            }}
            className="w-full bg-slate-950 border border-slate-700 rounded-lg px-3 py-2 text-sm text-slate-100 font-mono focus:outline-none focus:border-sky-500"
            placeholder="Digits only (e.g. 226)"
          />
        </div>

        <button
          type="submit"
          className="flex items-center justify-center gap-2 bg-sky-600 hover:bg-sky-500 text-white rounded-lg py-2 text-sm font-medium transition-colors"
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
                setS(p.val);
                onApply(p.val);
              }}
              className="px-2.5 py-1 text-xs rounded bg-slate-800 hover:bg-slate-700 text-slate-300 border border-slate-700 transition-colors"
            >
              {p.label}
            </button>
          ))}
          <button
            onClick={() => {
              setS(initialString);
              onApply(initialString);
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
