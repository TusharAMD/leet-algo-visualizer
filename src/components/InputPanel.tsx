import React, { useState } from 'react';
import { Plus, X, RotateCcw, Lightbulb } from 'lucide-react';

interface InputPanelProps {
  coins: number[];
  setCoins: (coins: number[]) => void;
  amount: number;
  setAmount: (amount: number) => void;
  onResetToDefaults: () => void;
}

export const InputPanel: React.FC<InputPanelProps> = ({
  coins,
  setCoins,
  amount,
  setAmount,
  onResetToDefaults
}) => {
  const [newCoin, setNewCoin] = useState<string>('');

  const handleAddCoin = () => {
    const val = parseInt(newCoin, 10);
    if (!isNaN(val) && val > 0 && !coins.includes(val)) {
      setCoins([...coins, val].sort((a, b) => a - b));
      setNewCoin('');
    }
  };

  const handleRemoveCoin = (c: number) => {
    if (coins.length <= 1) return;
    setCoins(coins.filter(item => item !== c));
  };

  const applyPreset = (presetCoins: number[], presetAmount: number) => {
    setCoins(presetCoins);
    setAmount(presetAmount);
  };

  return (
    <div className="bg-slate-900/50 border border-slate-800 rounded-xl px-3 py-1.5 flex flex-wrap items-center justify-between gap-2.5 shrink-0">
      {/* Coins selection */}
      <div className="flex items-center gap-2">
        <span className="text-[11px] font-semibold uppercase tracking-wider text-slate-400">
          Coins:
        </span>
        <div className="flex items-center gap-1.5 flex-wrap">
          {coins.map((c) => (
            <span
              key={c}
              className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-bold bg-amber-500/10 text-amber-300 border border-amber-500/30 shadow-sm"
            >
              🪙 ${c}
              {coins.length > 1 && (
                <button
                  onClick={() => handleRemoveCoin(c)}
                  className="text-amber-400 hover:text-rose-400 ml-0.5 rounded-full"
                  title="Remove coin"
                >
                  <X className="w-2.5 h-2.5" />
                </button>
              )}
            </span>
          ))}

          {/* Add coin input */}
          <div className="flex items-center gap-1 bg-slate-950/60 border border-slate-700/60 rounded-full px-2 py-0.5">
            <span className="text-[11px] text-slate-400">$</span>
            <input
              type="number"
              min="1"
              max="20"
              value={newCoin}
              onChange={(e) => setNewCoin(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && handleAddCoin()}
              placeholder="add"
              className="w-10 bg-transparent text-[11px] text-white focus:outline-none placeholder:text-slate-600"
            />
            <button
              onClick={handleAddCoin}
              className="p-0.5 rounded-full text-slate-400 hover:text-white hover:bg-slate-800"
            >
              <Plus className="w-3 h-3" />
            </button>
          </div>
        </div>
      </div>

      {/* Target Amount */}
      <div className="flex items-center gap-2">
        <span className="text-[11px] font-semibold uppercase tracking-wider text-slate-400">
          Target:
        </span>
        <input
          type="range"
          min="1"
          max="12"
          value={amount}
          onChange={(e) => setAmount(Number(e.target.value))}
          className="w-24 accent-indigo-500 cursor-pointer h-1.5"
        />
        <div className="w-7 h-5 rounded-md bg-indigo-500/10 border border-indigo-500/30 flex items-center justify-center font-bold text-xs text-indigo-300 font-mono">
          ${amount}
        </div>
      </div>

      {/* Presets */}
      <div className="flex items-center gap-1.5 text-xs">
        <span className="text-slate-500 text-[10px] font-medium flex items-center gap-1">
          <Lightbulb className="w-3 h-3 text-amber-400" /> Presets:
        </span>
        <button
          onClick={() => applyPreset([1, 2, 5], 7)}
          className="px-2 py-0.5 text-[11px] rounded bg-slate-800/80 hover:bg-slate-700 text-slate-300 transition-colors"
        >
          [1,2,5] $7
        </button>
        <button
          onClick={() => applyPreset([1, 3, 4], 6)}
          className="px-2 py-0.5 text-[11px] rounded bg-amber-500/10 hover:bg-amber-500/20 text-amber-300 border border-amber-500/30 transition-colors font-medium"
          title="Greedy picks 4+1+1 (3 coins), DP picks 3+3 (2 coins)!"
        >
          🔥 Greedy Trap [1,3,4] $6
        </button>
        <button
          onClick={() => applyPreset([2, 5], 3)}
          className="px-2 py-0.5 text-[11px] rounded bg-rose-500/10 hover:bg-rose-500/20 text-rose-300 border border-rose-500/30 transition-colors"
        >
          [2,5] $3
        </button>
        <button
          onClick={onResetToDefaults}
          className="p-1 rounded text-slate-400 hover:text-white hover:bg-slate-800 transition-colors ml-1"
          title="Reset"
        >
          <RotateCcw className="w-3 h-3" />
        </button>
      </div>
    </div>
  );
};
