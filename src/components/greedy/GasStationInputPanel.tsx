import React, { useState } from 'react';
import { Play, RotateCcw } from 'lucide-react';

interface GasStationInputPanelProps {
  initialGas: number[];
  initialCost: number[];
  onApply: (gas: number[], cost: number[]) => void;
}

export const GasStationInputPanel: React.FC<GasStationInputPanelProps> = ({
  initialGas,
  initialCost,
  onApply,
}) => {
  const [gasStr, setGasStr] = useState<string>(initialGas.join(', '));
  const [costStr, setCostStr] = useState<string>(initialCost.join(', '));

  const presets = [
    { label: 'Standard gas=[1,2,3,4,5], cost=[3,4,5,1,2]', gas: [1, 2, 3, 4, 5], cost: [3, 4, 5, 1, 2] },
    { label: 'Impossible gas=[2,3,4], cost=[3,4,3]', gas: [2, 3, 4], cost: [3, 4, 3] },
    { label: 'Equal gas=[5,1,2,3,4], cost=[4,4,1,5,1]', gas: [5, 1, 2, 3, 4], cost: [4, 4, 1, 5, 1] },
    { label: 'Small gas=[3,1,1], cost=[1,2,2]', gas: [3, 1, 1], cost: [1, 2, 2] },
  ];

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const g = gasStr
      .split(',')
      .map((x) => parseInt(x.trim(), 10))
      .filter((x) => !isNaN(x) && x >= 0);
    const c = costStr
      .split(',')
      .map((x) => parseInt(x.trim(), 10))
      .filter((x) => !isNaN(x) && x >= 0);

    if (g.length > 0 && g.length === c.length && g.length <= 10) {
      onApply(g, c);
    }
  };

  return (
    <div className="bg-slate-900 border border-slate-800 rounded-xl p-4 flex flex-col gap-4">
      <div className="flex items-center justify-between">
        <h3 className="text-sm font-semibold text-slate-200">Gas Station Setup</h3>
        <span className="text-xs text-slate-400">Gas Station</span>
      </div>

      <form onSubmit={handleSubmit} className="flex flex-col gap-3">
        <div>
          <label className="text-xs text-slate-400 mb-1 block">Gas Array (comma-separated)</label>
          <input
            type="text"
            value={gasStr}
            onChange={(e) => setGasStr(e.target.value)}
            className="w-full bg-slate-950 border border-slate-700 rounded-lg px-3 py-2 text-sm text-slate-100 font-mono focus:outline-none focus:border-indigo-500"
            placeholder="e.g. 1, 2, 3, 4, 5"
          />
        </div>

        <div>
          <label className="text-xs text-slate-400 mb-1 block">Cost Array (same length)</label>
          <input
            type="text"
            value={costStr}
            onChange={(e) => setCostStr(e.target.value)}
            className="w-full bg-slate-950 border border-slate-700 rounded-lg px-3 py-2 text-sm text-slate-100 font-mono focus:outline-none focus:border-indigo-500"
            placeholder="e.g. 3, 4, 5, 1, 2"
          />
        </div>

        <button
          type="submit"
          className="flex items-center justify-center gap-2 bg-indigo-600 hover:bg-indigo-500 text-white rounded-lg py-2 text-sm font-medium transition-colors"
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
                setGasStr(p.gas.join(', '));
                setCostStr(p.cost.join(', '));
                onApply(p.gas, p.cost);
              }}
              className="px-2.5 py-1 text-xs rounded bg-slate-800 hover:bg-slate-700 text-slate-300 border border-slate-700 transition-colors"
            >
              {p.label}
            </button>
          ))}
          <button
            onClick={() => {
              setGasStr(initialGas.join(', '));
              setCostStr(initialCost.join(', '));
              onApply(initialGas, initialCost);
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
