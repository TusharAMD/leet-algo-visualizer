import React, { useState } from 'react';
import { Play, RotateCcw } from 'lucide-react';

interface NumberOfOneBitsInputPanelProps {
  initialN: number;
  onApply: (n: number) => void;
}

export const NumberOfOneBitsInputPanel: React.FC<NumberOfOneBitsInputPanelProps> = ({
  initialN,
  onApply,
}) => {
  const [num, setNum] = useState<number>(initialN);

  const presets = [
    { label: '11 (b: 1011 -> 3 bits)', n: 11 },
    { label: '128 (b: 10000000 -> 1 bit)', n: 128 },
    { label: '2147483645 (b: ...1101 -> 30 bits)', n: 2147483645 },
    { label: '15 (b: 1111 -> 4 bits)', n: 15 },
    { label: '255 (b: 11111111 -> 8 bits)', n: 255 },
  ];

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!isNaN(num) && num >= 0) {
      onApply(num);
    }
  };

  return (
    <div className="bg-slate-900 border border-slate-800 rounded-xl p-4 flex flex-col gap-4">
      <div className="flex items-center justify-between">
        <h3 className="text-sm font-semibold text-slate-200">Integer Input</h3>
        <span className="text-xs text-slate-400">Number of 1 Bits</span>
      </div>

      <form onSubmit={handleSubmit} className="flex flex-col gap-3">
        <div>
          <label className="text-xs text-slate-400 mb-1 block">Unsigned 32-bit Integer (n)</label>
          <input
            type="number"
            min={0}
            value={num}
            onChange={(e) => setNum(parseInt(e.target.value, 10) || 0)}
            className="w-full bg-slate-950 border border-slate-700 rounded-lg px-3 py-2 text-sm text-slate-100 font-mono focus:outline-none focus:border-indigo-500"
            placeholder="11"
          />
        </div>

        <div className="flex gap-2">
          <button
            type="submit"
            className="flex-1 flex items-center justify-center gap-2 bg-indigo-600 hover:bg-indigo-500 text-white font-medium py-2 px-4 rounded-lg text-sm transition"
          >
            <Play className="w-4 h-4" />
            Count 1-Bits
          </button>
          <button
            type="button"
            onClick={() => {
              setNum(initialN);
              onApply(initialN);
            }}
            className="flex items-center justify-center bg-slate-800 hover:bg-slate-700 text-slate-300 py-2 px-3 rounded-lg text-sm transition"
            title="Reset to default"
          >
            <RotateCcw className="w-4 h-4" />
          </button>
        </div>
      </form>

      <div className="flex flex-col gap-1.5 pt-2 border-t border-slate-800/80">
        <span className="text-xs text-slate-400 font-medium">Presets:</span>
        <div className="flex flex-wrap gap-1.5">
          {presets.map((preset, idx) => (
            <button
              key={idx}
              onClick={() => {
                setNum(preset.n);
                onApply(preset.n);
              }}
              className="text-xs bg-slate-800 hover:bg-slate-700 text-slate-300 px-2.5 py-1 rounded-md transition border border-slate-700/60 font-mono"
            >
              {preset.label}
            </button>
          ))}
        </div>
      </div>
    </div>
  );
};
