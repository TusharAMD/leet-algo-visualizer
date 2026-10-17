import React from 'react';
import type { CoinChangeTwoStep } from '../../algorithms/coinChangeTwoIntuitive';

interface CoinChangeTwoViewerProps {
  step: CoinChangeTwoStep;
  amount: number;
  coins: number[];
}

export const CoinChangeTwoViewer: React.FC<CoinChangeTwoViewerProps> = ({
  step,
  amount,
  coins,
}) => {
  return (
    <div className="flex flex-col h-full gap-4 p-4 select-none">
      {/* Top Status & Variable Badges */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
        <div className="bg-slate-900 border border-slate-800 rounded-xl p-3 flex flex-col justify-center">
          <span className="text-xs text-slate-400 font-medium">Active Coin</span>
          <span className="text-base font-mono font-bold text-amber-300">
            {step.currentCoin > 0 ? `Coin ${step.currentCoin}` : '—'}
          </span>
        </div>
        <div className="bg-slate-900 border border-slate-800 rounded-xl p-3 flex flex-col justify-center">
          <span className="text-xs text-slate-400 font-medium">Target Sub-Amount a</span>
          <span className="text-base font-mono font-bold text-sky-400">
            a = {step.currentAmount} / {amount}
          </span>
        </div>
        <div className="bg-slate-900 border border-slate-800 rounded-xl p-3 flex flex-col justify-center">
          <span className="text-xs text-slate-400 font-medium">Adding from dp[a - c]</span>
          <span className="text-sm font-mono font-bold text-indigo-300">
            +{step.addedVal} ways
          </span>
        </div>
        <div className="bg-slate-900 border border-slate-800 rounded-xl p-3 flex flex-col justify-center">
          <span className="text-xs text-slate-400 font-medium">Total Combinations dp[amount]</span>
          <span className="text-2xl font-mono font-extrabold text-emerald-400">
            {step.dp[amount] ?? 0}
          </span>
        </div>
      </div>

      {/* Main Canvas: Coins Available + DP Array */}
      <div className="flex-1 bg-slate-900/60 border border-slate-800 rounded-xl p-6 flex flex-col justify-center items-center gap-8 relative overflow-hidden">
        {/* Coins Row */}
        <div className="flex flex-col items-center gap-2">
          <div className="text-xs font-semibold text-slate-400 uppercase tracking-wider">
            Available Coins
          </div>
          <div className="flex items-center gap-3">
            {coins.map((coin, idx) => {
              const isCurrent = coin === step.currentCoin;
              return (
                <div
                  key={idx}
                  className={`px-4 py-2 rounded-xl border font-mono font-bold text-base transition-all ${
                    isCurrent
                      ? 'border-amber-400 bg-amber-950/70 text-amber-300 scale-110 shadow-lg shadow-amber-500/20 ring-2 ring-amber-400/40'
                      : 'border-slate-800 bg-slate-900 text-slate-400'
                  }`}
                >
                  🪙 ${coin}
                </div>
              );
            })}
          </div>
        </div>

        {/* DP Array */}
        <div className="flex flex-col items-center gap-2 max-w-full overflow-x-auto">
          <div className="text-xs font-semibold text-slate-400 uppercase tracking-wider">
            DP Array: dp[a] (Ways to make amount a)
          </div>
          <div className="flex items-center gap-2 flex-wrap justify-center p-2">
            {step.dp.map((val, idx) => {
              const isCurrentAmount = idx === step.currentAmount && step.currentCoin > 0;
              const isSourceAmount =
                step.currentCoin > 0 && idx === step.currentAmount - step.currentCoin;

              let border = 'border-slate-800';
              let bg = 'bg-slate-950/60';
              let text = 'text-slate-300';

              if (isCurrentAmount) {
                border = 'border-amber-400 ring-2 ring-amber-400/40';
                bg = 'bg-amber-950/80';
                text = 'text-amber-200';
              } else if (isSourceAmount) {
                border = 'border-sky-400 ring-2 ring-sky-400/30';
                bg = 'bg-sky-950/60';
                text = 'text-sky-300';
              }

              return (
                <div key={idx} className="flex flex-col items-center gap-1">
                  <span className="text-[10px] font-mono text-slate-500">dp[{idx}]</span>
                  <div
                    className={`w-12 h-12 rounded-lg border flex items-center justify-center font-mono text-base font-bold transition-all ${border} ${bg} ${text}`}
                  >
                    {val}
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Formula Badge */}
        <div className="bg-slate-950/80 border border-slate-800 rounded-xl px-4 py-2 flex items-center gap-3 text-xs text-slate-400">
          <span className="font-semibold text-slate-300">Unbounded Knapsack Recurrence:</span>
          <span>dp[a] += dp[a - coin]</span>
        </div>
      </div>

      {/* Step Explanation */}
      <div className="bg-slate-950 border border-slate-800 rounded-xl p-3 text-sm text-slate-300 flex items-center gap-2">
        <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse shrink-0" />
        <span>{step.explanation}</span>
      </div>
    </div>
  );
};
