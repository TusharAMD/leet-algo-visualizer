import React, { useState } from 'react';
import { Play, RotateCcw } from 'lucide-react';

interface CoinChangeTwoInputPanelProps {
  initialAmount: number;
  initialCoins: number[];
  onApply: (amount: number, coins: number[]) => void;
}

export const CoinChangeTwoInputPanel: React.FC<CoinChangeTwoInputPanelProps> = ({
  initialAmount,
  initialCoins,
  onApply,
}) => {
  const [amount, setAmount] = useState<number>(initialAmount);
  const [coinsStr, setCoinsStr] = useState<string>(initialCoins.join(', '));

  const presets = [
    { label: 'Amount 5, coins [1, 2, 5]', amount: 5, coins: [1, 2, 5] },
    { label: 'Amount 3, coins [2]', amount: 3, coins: [2] },
    { label: 'Amount 10, coins [10]', amount: 10, coins: [10] },
    { label: 'Amount 4, coins [1, 2, 3]', amount: 4, coins: [1, 2, 3] },
  ];

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const parsedCoins = coinsStr
      .split(',')
      .map((x) => parseInt(x.trim(), 10))
      .filter((x) => !isNaN(x) && x > 0);

    if (amount >= 0 && amount <= 20 && parsedCoins.length > 0) {
      onApply(amount, parsedCoins);
    }
  };

  return (
    <div className="bg-slate-900 border border-slate-800 rounded-xl p-4 flex flex-col gap-4">
      <div className="flex items-center justify-between">
        <h3 className="text-sm font-semibold text-slate-200">Input Configuration</h3>
        <span className="text-xs text-slate-400">Coin Change II</span>
      </div>

      <form onSubmit={handleSubmit} className="flex flex-col gap-3">
        <div>
          <label className="text-xs text-slate-400 mb-1 block">Target Amount (0-20)</label>
          <input
            type="number"
            min={0}
            max={20}
            value={amount}
            onChange={(e) => setAmount(parseInt(e.target.value, 10) || 0)}
            className="w-full bg-slate-950 border border-slate-700 rounded-lg px-3 py-2 text-sm text-slate-100 font-mono focus:outline-none focus:border-indigo-500"
          />
        </div>

        <div>
          <label className="text-xs text-slate-400 mb-1 block">Coin Denominations (comma-separated)</label>
          <input
            type="text"
            value={coinsStr}
            onChange={(e) => setCoinsStr(e.target.value)}
            className="w-full bg-slate-950 border border-slate-700 rounded-lg px-3 py-2 text-sm text-slate-100 font-mono focus:outline-none focus:border-indigo-500"
            placeholder="e.g. 1, 2, 5"
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
                setAmount(p.amount);
                setCoinsStr(p.coins.join(', '));
                onApply(p.amount, p.coins);
              }}
              className="px-2.5 py-1 text-xs rounded bg-slate-800 hover:bg-slate-700 text-slate-300 border border-slate-700 transition-colors"
            >
              {p.label}
            </button>
          ))}
          <button
            onClick={() => {
              setAmount(initialAmount);
              setCoinsStr(initialCoins.join(', '));
              onApply(initialAmount, initialCoins);
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
