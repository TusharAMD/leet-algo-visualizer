import React from 'react';
import { IntuitiveStep } from '../types';
import { Trophy, Ban, HelpCircle, Layers, ArrowDown } from 'lucide-react';

interface IntuitiveChoiceViewerProps {
  step: IntuitiveStep;
  amount: number;
}

export const IntuitiveChoiceViewer: React.FC<IntuitiveChoiceViewerProps> = ({ step, amount }) => {
  const {
    targetAmount,
    activeChoiceIndex,
    choices,
    optimalCoinsForTarget,
    memoryBank,
    headline,
    subtext,
    phase,
  } = step;

  return (
    <div className="flex flex-col justify-between gap-2.5 p-3.5 bg-slate-900/40 border border-slate-800 rounded-2xl h-full overflow-hidden">
      {/* 1. Target Question Header Banner */}
      <div className="bg-gradient-to-r from-slate-900 via-indigo-950/40 to-slate-900 border border-indigo-500/20 rounded-xl p-2.5 shadow shrink-0">
        <div className="flex items-center justify-between gap-2 flex-wrap">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-lg bg-indigo-500/20 border border-indigo-500/40 flex items-center justify-center text-indigo-300 font-bold font-mono text-sm shrink-0">
              ${targetAmount}
            </div>
            <div>
              <div className="flex items-center gap-1.5">
                <span className="text-[9px] uppercase font-bold tracking-wider px-1.5 py-0.2 rounded bg-indigo-500/10 text-indigo-400 border border-indigo-500/20">
                  {phase === 'init'
                    ? 'Step 0: Base Case'
                    : phase === 'complete'
                    ? 'Finished!'
                    : `Evaluating Target $${targetAmount}`}
                </span>
              </div>
              <h2 className="text-xs font-bold text-white leading-tight mt-0.5">{headline}</h2>
            </div>
          </div>

          {optimalCoinsForTarget !== null && optimalCoinsForTarget > 0 && (
            <div className="flex items-center gap-1.5 bg-emerald-500/10 border border-emerald-500/30 px-2 py-1 rounded-lg shrink-0">
              <Trophy className="w-3.5 h-3.5 text-emerald-400" />
              <span className="text-[11px] font-semibold text-emerald-300">
                Best: <span className="font-mono font-bold text-white">{optimalCoinsForTarget} coins</span>
              </span>
            </div>
          )}
        </div>
        <p className="text-[11px] text-slate-300 mt-1 leading-normal font-sans line-clamp-2">{subtext}</p>
      </div>

      {/* 2. The Decision Cards (Options Comparison) */}
      {choices.length > 0 && phase !== 'complete' ? (
        <div className="flex flex-col gap-1.5 flex-1 min-h-0 justify-center">
          <div className="flex items-center justify-between shrink-0">
            <span className="text-[11px] font-bold text-slate-300 flex items-center gap-1">
              <HelpCircle className="w-3.5 h-3.5 text-indigo-400" />
              Which coin gives the lowest total?
            </span>
            <span className="text-[10px] text-slate-400 font-mono">
              Formula: <code className="text-indigo-300">1 + dp[remainder]</code>
            </span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-2.5 flex-1 min-h-0">
            {choices.map((choice, idx) => {
              const isActive = activeChoiceIndex === idx;
              const isOptimal = choice.status === 'optimal';
              const isTooLarge = choice.status === 'too_large';
              const isUnreachable = choice.status === 'unreachable';

              return (
                <div
                  key={choice.coin}
                  className={`p-2.5 rounded-xl border transition-all flex flex-col justify-between gap-1.5 relative ${
                    isOptimal
                      ? 'bg-emerald-950/30 border-emerald-500/60 shadow-md shadow-emerald-500/10 ring-1 ring-emerald-500/40'
                      : isActive
                      ? 'bg-indigo-950/40 border-indigo-400 shadow-md shadow-indigo-500/20 scale-[1.01]'
                      : isTooLarge || isUnreachable
                      ? 'bg-slate-950/30 border-slate-800/80 opacity-55'
                      : 'bg-slate-950/60 border-slate-800'
                  }`}
                >
                  {/* Winner / Active Badge */}
                  {isOptimal && (
                    <div className="absolute -top-2 right-2 bg-emerald-500 text-slate-950 text-[9px] font-extrabold uppercase tracking-wider px-1.5 py-0.2 rounded-full shadow flex items-center gap-0.5">
                      <Trophy className="w-2.5 h-2.5" /> Winner
                    </div>
                  )}
                  {isActive && !isOptimal && (
                    <div className="absolute -top-2 right-2 bg-indigo-500 text-white text-[9px] font-extrabold uppercase tracking-wider px-1.5 py-0.2 rounded-full shadow animate-pulse">
                      Testing
                    </div>
                  )}

                  {/* Choice Header */}
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-bold text-slate-300 flex items-center gap-1.5">
                      <span className="w-5 h-5 rounded-md bg-amber-500/10 border border-amber-500/30 flex items-center justify-center text-amber-300 font-mono text-xs">
                        ${choice.coin}
                      </span>
                      Pick ${choice.coin}
                    </span>
                    <span className="text-[10px] font-mono text-slate-400">
                      Rem: ${choice.remainingAmount}
                    </span>
                  </div>

                  {/* Visual calculation box */}
                  <div className="p-2 rounded-lg bg-slate-900/80 border border-slate-800/80 flex flex-col gap-1 text-[11px]">
                    {isTooLarge ? (
                      <div className="text-rose-400 flex items-center gap-1 font-medium text-[10px]">
                        <Ban className="w-3 h-3 shrink-0" />
                        <span>${choice.coin} &gt; ${targetAmount} (Impossible)</span>
                      </div>
                    ) : isUnreachable ? (
                      <div className="text-amber-400 flex items-center gap-1 font-medium text-[10px]">
                        <Ban className="w-3 h-3 shrink-0" />
                        <span>Remainder ${choice.remainingAmount} is unreachable</span>
                      </div>
                    ) : choice.subproblemCoins !== null ? (
                      <div className="space-y-0.5">
                        <div className="flex items-center justify-between text-slate-400 text-[10px]">
                          <span>1 coin (${choice.coin})</span>
                          <span className="text-white font-mono">+1</span>
                        </div>
                        <div className="flex items-center justify-between text-slate-400 text-[10px]">
                          <span>Best for ${choice.remainingAmount} (shelf)</span>
                          <span className="text-emerald-400 font-mono font-semibold">
                            +{choice.subproblemCoins}
                          </span>
                        </div>
                        <div className="border-t border-slate-800 pt-0.5 flex items-center justify-between font-bold">
                          <span className="text-slate-300 text-[10px]">Total:</span>
                          <span
                            className={`font-mono text-xs ${
                              isOptimal ? 'text-emerald-300' : 'text-white'
                            }`}
                          >
                            {choice.totalCoins} coins
                          </span>
                        </div>
                      </div>
                    ) : (
                      <div className="text-slate-500 italic text-[10px]">Waiting to test...</div>
                    )}
                  </div>

                  {/* Plain English explanation note */}
                  <div className="text-[10px] text-slate-400 leading-tight line-clamp-2">
                    {choice.explanation}
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      ) : (
        <div className="flex-1 flex items-center justify-center p-4 text-center">
          <div className="max-w-md bg-slate-950/50 p-4 rounded-xl border border-slate-800">
            <span className="text-sm font-bold text-indigo-300">
              {phase === 'init' ? 'Setting Up Base Cases' : 'All Targets Analyzed!'}
            </span>
            <p className="text-xs text-slate-400 mt-1">{subtext}</p>
          </div>
        </div>
      )}

      {/* 3. The "Memory Shelf / Answers Bank" (The DP Array dp[0...amount]) */}
      <div className="flex flex-col gap-1.5 pt-1.5 border-t border-slate-800/80 shrink-0">
        <div className="flex items-center justify-between flex-wrap gap-1">
          <div className="flex items-center gap-1.5">
            <Layers className="w-3.5 h-3.5 text-purple-400" />
            <span className="text-[11px] font-bold text-slate-200">
              Memory Shelf (<code className="text-purple-300 font-mono text-[10px]">dp[]</code>)
            </span>
          </div>
          <span className="text-[10px] text-slate-400">
            Stored subproblem answers
          </span>
        </div>

        {/* Shelves Row */}
        <div className="overflow-x-auto pt-7 pb-1.5">
          <div className="flex items-center gap-2 min-w-max px-8">
            {Object.entries(memoryBank).map(([amtStr, item]) => {
              const amt = Number(amtStr);
              const isTarget = amt === targetAmount;
              const isRemainderLookup =
                activeChoiceIndex !== null &&
                choices[activeChoiceIndex]?.remainingAmount === amt;
              const isFilled = item.coinsCount !== null;

              return (
                <div key={amt} className="relative flex flex-col items-center">
                  {/* Floating pointer for lookups */}
                  {isRemainderLookup && (
                    <div className="absolute -top-6 flex flex-col items-center animate-bounce text-emerald-400 z-20 whitespace-nowrap pointer-events-none">
                      <span className="text-[9px] font-bold uppercase tracking-wider bg-emerald-950/90 text-emerald-300 px-2 py-0.2 rounded-full border border-emerald-500/60 shadow-md backdrop-blur">
                        Looked Up
                      </span>
                      <ArrowDown className="w-2.5 h-2.5 text-emerald-400" />
                    </div>
                  )}

                  {/* Locker / Cell Box */}
                  <div
                    className={`w-12 h-13 rounded-lg border-2 flex flex-col items-center justify-center transition-all ${
                      isTarget
                        ? 'border-indigo-400 bg-indigo-500/20 shadow-sm shadow-indigo-500/30 scale-105'
                        : isRemainderLookup
                        ? 'border-emerald-400 bg-emerald-500/20 shadow-sm shadow-emerald-500/30 scale-105'
                        : isFilled
                        ? 'border-slate-700 bg-slate-800/90'
                        : 'border-slate-800 bg-slate-950/40 opacity-40'
                    }`}
                  >
                    <span
                      className={`text-xs font-bold font-mono ${
                        isFilled
                          ? isTarget
                            ? 'text-indigo-200'
                            : 'text-white'
                          : 'text-slate-600'
                      }`}
                    >
                      {isFilled ? item.coinsCount : '∞'}
                    </span>
                    <span className="text-[8px] text-slate-400 font-mono">
                      {isFilled ? (item.coinsCount === 1 ? 'coin' : 'coins') : 'empty'}
                    </span>
                  </div>

                  {/* Shelf Label */}
                  <div className="mt-1 text-center">
                    <span
                      className={`text-[10px] font-mono font-bold ${
                        isTarget
                          ? 'text-indigo-400'
                          : isRemainderLookup
                          ? 'text-emerald-400'
                          : 'text-slate-500'
                      }`}
                    >
                      ${amt}
                    </span>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
};
