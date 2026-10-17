import React, { useState } from 'react';
import { Play, RotateCcw } from 'lucide-react';

interface MultiplyStringsInputPanelProps {
  initialNum1: string;
  initialNum2: string;
  onApply: (num1: string, num2: string) => void;
}

export const MultiplyStringsInputPanel: React.FC<MultiplyStringsInputPanelProps> = ({
  initialNum1,
  initialNum2,
  onApply,
}) => {
  const [num1, setNum1] = useState<string>(initialNum1);
  const [num2, setNum2] = useState<string>(initialNum2);

  const presets = [
    { label: '2 x 3 = 6', num1: '2', num2: '3' },
    { label: '123 x 456 = 56088', num1: '123', num2: '456' },
    { label: '99 x 99 = 9801', num1: '99', num2: '99' },
    { label: '0 x 456 = 0', num1: '0', num2: '456' },
    { label: '12 x 12 = 144', num1: '12', num2: '12' },
  ];

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const c1 = num1.trim().replace(/[^0-9]/g, '');
    const c2 = num2.trim().replace(/[^0-9]/g, '');
    if (c1.length > 0 && c2.length > 0) {
      onApply(c1, c2);
    }
  };

  return (
    <div className="bg-slate-900 border border-slate-800 rounded-xl p-4 flex flex-col gap-4">
      <div className="flex items-center justify-between">
        <h3 className="text-sm font-semibold text-slate-200">Input Numbers</h3>
        <span className="text-xs text-slate-400">Multiply Strings</span>
      </div>

      <form onSubmit={handleSubmit} className="grid grid-cols-1 md:grid-cols-12 gap-3">
        <div className="md:col-span-6">
          <label className="text-xs text-slate-400 mb-1 block">Number 1</label>
          <input
            type="text"
            value={num1}
            onChange={(e) => setNum1(e.target.value)}
            className="w-full bg-slate-950 border border-slate-700 rounded-lg px-3 py-2 text-sm text-slate-100 font-mono focus:outline-none focus:border-indigo-500"
            placeholder="123"
          />
        </div>

        <div className="md:col-span-6">
          <label className="text-xs text-slate-400 mb-1 block">Number 2</label>
          <input
            type="text"
            value={num2}
            onChange={(e) => setNum2(e.target.value)}
            className="w-full bg-slate-950 border border-slate-700 rounded-lg px-3 py-2 text-sm text-slate-100 font-mono focus:outline-none focus:border-indigo-500"
            placeholder="456"
          />
        </div>

        <div className="md:col-span-12 flex gap-2">
          <button
            type="submit"
            className="flex-1 flex items-center justify-center gap-2 bg-indigo-600 hover:bg-indigo-500 text-white font-medium py-2 px-4 rounded-lg text-sm transition"
          >
            <Play className="w-4 h-4" />
            Multiply
          </button>
          <button
            type="button"
            onClick={() => {
              setNum1(initialNum1);
              setNum2(initialNum2);
              onApply(initialNum1, initialNum2);
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
                setNum1(preset.num1);
                setNum2(preset.num2);
                onApply(preset.num1, preset.num2);
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
