import React from 'react';
import { StockStep } from '../../algorithms/stockProfitIntuitive';
import { TrendingUp, ArrowDown, DollarSign, Trophy, ArrowRight, ShieldCheck } from 'lucide-react';

interface StockViewerProps {
  step: StockStep;
  prices: number[];
}

export const StockViewer: React.FC<StockViewerProps> = ({ step, prices }) => {
  const {
    currentDay,
    currentPrice,
    minPriceDay,
    minPrice,
    currentProfit,
    maxProfit,
    bestBuyDay,
    bestSellDay,
    headline,
    subtext,
    isComplete,
  } = step;

  const maxPrice = Math.max(...prices, 1);
  const chartHeightPx = 180;

  return (
    <div className="flex flex-col justify-between gap-3 p-4 bg-slate-900/40 border border-slate-800 rounded-2xl h-full overflow-hidden">
      {/* 1. Header Banner */}
      <div className="bg-gradient-to-r from-slate-900 via-indigo-950/40 to-slate-900 border border-indigo-500/20 rounded-xl p-3 shadow shrink-0">
        <div className="flex items-center justify-between gap-2 flex-wrap">
          <div className="flex items-center gap-2.5">
            <div className="w-9 h-9 rounded-xl bg-emerald-500/20 border border-emerald-500/40 flex items-center justify-center text-emerald-300 font-bold font-mono text-sm shrink-0">
              <TrendingUp className="w-5 h-5 text-emerald-400" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="text-[9px] uppercase font-bold tracking-wider px-1.5 py-0.2 rounded bg-indigo-500/10 text-indigo-400 border border-indigo-500/20">
                  {isComplete ? 'Analysis Finished' : `Day ${currentDay}`}
                </span>
                <span className="text-xs font-mono font-bold text-slate-300">
                  Price: ${currentPrice}
                </span>
              </div>
              <h2 className="text-xs font-bold text-white leading-tight mt-0.5">{headline}</h2>
            </div>
          </div>

          {/* Record Profit Badge */}
          <div className="flex items-center gap-2 shrink-0">
            <div className="flex items-center gap-1.5 px-3 py-1 rounded-xl bg-emerald-500/20 border border-emerald-500/50 text-emerald-300 font-bold text-xs shadow-lg shadow-emerald-500/10">
              <Trophy className="w-4 h-4 text-emerald-400" />
              <span>Max Profit: +${maxProfit}</span>
            </div>
          </div>
        </div>
        <p className="text-[11px] text-slate-300 mt-1.5 leading-normal font-sans line-clamp-2">{subtext}</p>
      </div>

      {/* 2. Stock Price Bars Chart */}
      <div className="flex-1 min-h-0 flex flex-col justify-end gap-2">
        <div className="flex items-center justify-between text-xs text-slate-400 px-1">
          <span className="flex items-center gap-1 font-semibold text-slate-300 text-[11px]">
            <TrendingUp className="w-3.5 h-3.5 text-emerald-400" />
            Daily Stock Prices & Valley/Peak Trade Markers
          </span>
          <span className="text-[10px] text-slate-500 font-mono">
            Lowest Buy Candidate: Day {minPriceDay} (${minPrice === Infinity ? '?' : minPrice})
          </span>
        </div>

        {/* The Bars Chart */}
        <div className="overflow-x-auto pt-10 pb-2">
          <div className="flex items-end gap-3 min-w-max px-6 justify-center" style={{ height: `${chartHeightPx + 40}px` }}>
            {prices.map((p, day) => {
              const isToday = day === currentDay && !isComplete;
              const isMinDay = day === minPriceDay && minPrice !== Infinity && !isComplete;
              const isFinalBuy = isComplete && day === bestBuyDay && maxProfit > 0;
              const isFinalSell = isComplete && day === bestSellDay && maxProfit > 0;
              const isPast = day < currentDay;

              const barHeightPx = (p / maxPrice) * chartHeightPx;

              return (
                <div key={day} className="relative flex flex-col items-center">
                  {/* Floating Marker: BUY */}
                  {(isMinDay || isFinalBuy) && (
                    <div className="absolute -top-8 flex flex-col items-center animate-bounce text-emerald-400 z-20 whitespace-nowrap pointer-events-none">
                      <span className="text-[9px] font-extrabold uppercase tracking-wider bg-emerald-950/90 text-emerald-300 px-2 py-0.5 rounded-full border border-emerald-500/60 shadow-lg backdrop-blur">
                        Buy (${p})
                      </span>
                      <ArrowDown className="w-3 h-3 text-emerald-400" />
                    </div>
                  )}

                  {/* Floating Marker: SELL */}
                  {(isToday && day !== minPriceDay) || isFinalSell ? (
                    <div className="absolute -top-8 flex flex-col items-center animate-bounce text-purple-400 z-20 whitespace-nowrap pointer-events-none">
                      <span className="text-[9px] font-extrabold uppercase tracking-wider bg-purple-950/90 text-purple-300 px-2 py-0.5 rounded-full border border-purple-500/60 shadow-lg backdrop-blur">
                        Sell (${p})
                      </span>
                      <ArrowDown className="w-3 h-3 text-purple-400" />
                    </div>
                  ) : null}

                  {/* Price Bar */}
                  <div
                    className={`w-12 rounded-t flex flex-col items-center justify-between pb-1 border transition-all ${
                      isFinalBuy || isFinalSell
                        ? 'border-emerald-400 bg-emerald-500/30 shadow-lg shadow-emerald-500/20 scale-105'
                        : isMinDay
                        ? 'border-emerald-400 bg-emerald-500/20 shadow-md shadow-emerald-500/20'
                        : isToday
                        ? 'border-purple-400 bg-purple-500/20 shadow-md shadow-purple-500/20'
                        : isPast
                        ? 'border-slate-700 bg-slate-800/80 text-slate-300'
                        : 'border-slate-800 bg-slate-900/40 text-slate-600 opacity-40'
                    }`}
                    style={{ height: `${Math.max(barHeightPx, 16)}px` }}
                  >
                    <span className="text-[9px] font-mono text-slate-400 pt-0.5">${p}</span>
                    <span className="text-[8px] font-mono font-bold text-slate-500">Day {day}</span>
                  </div>

                  {/* Day Label underneath */}
                  <div className="mt-1 text-center">
                    <span
                      className={`text-[10px] font-mono font-bold ${
                        isMinDay || isFinalBuy
                          ? 'text-emerald-400'
                          : isToday || isFinalSell
                          ? 'text-purple-400'
                          : 'text-slate-500'
                      }`}
                    >
                      D{day}
                    </span>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>

      {/* 3. The Trade Math & Sliding Valley Insight */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-3 pt-1 border-t border-slate-800/80 shrink-0">
        {/* Trade Math */}
        <div className="p-2.5 rounded-xl bg-slate-950/70 border border-slate-800 flex flex-col justify-between gap-1">
          <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider flex items-center gap-1.5">
            <DollarSign className="w-3.5 h-3.5 text-emerald-400" />
            Today's Profit Equation
          </span>
          <div className="font-mono text-xs text-slate-200 bg-slate-900/90 p-2 rounded-lg border border-slate-800 flex items-center justify-around">
            <span>Price: ${currentPrice}</span>
            <span className="text-slate-500">-</span>
            <span className="text-emerald-300">Min: ${minPrice === Infinity ? '?' : minPrice}</span>
            <span className="text-slate-500">=</span>
            <span className="text-emerald-400 font-bold text-sm">+${currentProfit}</span>
          </div>
          <p className="text-[10px] text-slate-400">
            Compare today's profit with the all-time record profit (${maxProfit}).
          </p>
        </div>

        {/* Mental Model Guarantee */}
        <div className="p-2.5 rounded-xl bg-slate-950/70 border border-slate-800 flex flex-col justify-between gap-1">
          <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider flex items-center gap-1.5">
            <ShieldCheck className="w-3.5 h-3.5 text-indigo-400" />
            The Valley & Peak Guarantee
          </span>
          <p className="text-[11px] text-slate-300 leading-snug">
            {isComplete ? (
              <span className="text-emerald-300 font-semibold flex items-center gap-1">
                <Trophy className="w-3.5 h-3.5 text-emerald-400" />
                Best trade: Buy Day {bestBuyDay} ($${prices[bestBuyDay]}), Sell Day {bestSellDay} ($${prices[bestSellDay]}) for +${maxProfit}!
              </span>
            ) : (
              <>
                To maximize profit when selling on Day {currentDay}, you MUST have bought at the lowest valley seen prior to today. Tracking <strong className="text-emerald-300">min_price</strong> guarantees optimal timing in a single O(n) pass.
              </>
            )}
          </p>
        </div>
      </div>
    </div>
  );
};
