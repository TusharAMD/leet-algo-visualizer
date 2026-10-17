import React from 'react';
import type { HandOfStraightsStep } from '../../algorithms/handOfStraightsIntuitive';

interface HandOfStraightsViewerProps {
  step: HandOfStraightsStep;
  groupSize: number;
}

export const HandOfStraightsViewer: React.FC<HandOfStraightsViewerProps> = ({
  step,
  groupSize,
}) => {
  const sortedCards = Object.keys(step.cardCounts)
    .map(Number)
    .sort((a, b) => a - b);

  return (
    <div className="flex flex-col h-full gap-4 p-4 select-none">
      {/* Top Status & Variable Badges */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
        <div className="bg-slate-900 border border-slate-800 rounded-xl p-3 flex flex-col justify-center">
          <span className="text-xs text-slate-400 font-medium">Group Size</span>
          <span className="text-base font-mono font-bold text-sky-400">
            size = {groupSize}
          </span>
        </div>
        <div className="bg-slate-900 border border-slate-800 rounded-xl p-3 flex flex-col justify-center">
          <span className="text-xs text-slate-400 font-medium">Active Card</span>
          <span className="text-base font-mono font-bold text-amber-300">
            {step.currentCard >= 0 ? `Card ${step.currentCard}` : '—'}
          </span>
        </div>
        <div className="bg-slate-900 border border-slate-800 rounded-xl p-3 flex flex-col justify-center">
          <span className="text-xs text-slate-400 font-medium">Formed Straights</span>
          <span className="text-base font-mono font-bold text-indigo-300">
            {step.formedGroups.length} groups
          </span>
        </div>
        <div className="bg-slate-900 border border-slate-800 rounded-xl p-3 flex flex-col justify-center">
          <span className="text-xs text-slate-400 font-medium">Valid Partition</span>
          <span className={`text-2xl font-mono font-black ${step.isPossible ? 'text-emerald-400' : 'text-rose-400'}`}>
            {step.isPossible ? 'True' : 'False'}
          </span>
        </div>
      </div>

      {/* Main Canvas: Cards Inventory & Formed Groups */}
      <div className="flex-1 bg-slate-900/60 border border-slate-800 rounded-xl p-6 flex flex-col justify-center items-center gap-6 relative overflow-auto">
        {/* Missing Card Alert */}
        {step.failedCard !== undefined && (
          <div className="bg-rose-950/70 border border-rose-500/50 px-4 py-2 rounded-xl text-rose-300 text-xs font-semibold animate-bounce">
            ❌ Missing Card {step.failedCard}! Cannot complete consecutive straight.
          </div>
        )}

        {/* Available Cards Inventory */}
        <div className="flex flex-col items-center gap-2">
          <div className="text-xs font-semibold text-slate-400 uppercase tracking-wider">
            Card Inventory (Sorted Min-Heap)
          </div>
          <div className="flex items-center gap-2.5 flex-wrap justify-center">
            {sortedCards.map((card) => {
              const count = step.cardCounts[card];
              const isCurrent = card === step.currentCard;

              let border = 'border-slate-800';
              let bg = 'bg-slate-950/60';
              let text = 'text-slate-300';

              if (isCurrent) {
                border = 'border-amber-400 ring-4 ring-amber-400/40';
                bg = 'bg-amber-950/80';
                text = 'text-amber-200';
              } else if (count > 0) {
                border = 'border-sky-500/60';
                bg = 'bg-sky-950/40';
                text = 'text-sky-200';
              } else {
                border = 'border-slate-800 border-dashed opacity-40';
                bg = 'bg-slate-950/20';
                text = 'text-slate-600';
              }

              return (
                <div
                  key={card}
                  className={`w-14 h-18 rounded-xl border-2 flex flex-col items-center justify-between p-1.5 font-mono font-bold transition-all relative ${border} ${bg} ${text}`}
                >
                  <span className="text-base">{card}</span>
                  <span
                    className={`text-[10px] px-1.5 py-0.2 rounded ${
                      count > 0 ? 'bg-sky-500/20 text-sky-300 font-bold' : 'text-slate-600'
                    }`}
                  >
                    &times;{count}
                  </span>
                </div>
              );
            })}
          </div>
        </div>

        {/* Current Straight in progress */}
        {step.activeGroup.length > 0 && (
          <div className="bg-slate-950/80 border border-amber-500/30 rounded-xl p-3 flex items-center gap-3">
            <span className="text-xs text-amber-400 font-semibold">Building Straight:</span>
            <div className="flex items-center gap-1.5">
              {step.activeGroup.map((c, idx) => (
                <div
                  key={idx}
                  className="w-10 h-12 rounded-lg bg-amber-500/20 border border-amber-400 text-amber-200 font-mono font-bold flex items-center justify-center text-sm"
                >
                  {c}
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Completed Straights */}
        {step.formedGroups.length > 0 && (
          <div className="flex flex-col items-center gap-2 max-w-full">
            <div className="text-xs font-semibold text-slate-400 uppercase tracking-wider">
              Completed Straights ({step.formedGroups.length})
            </div>
            <div className="flex flex-wrap gap-2 justify-center max-h-36 overflow-y-auto">
              {step.formedGroups.map((g, idx) => (
                <div
                  key={idx}
                  className="px-3 py-1.5 rounded-xl bg-emerald-950/60 border border-emerald-700/60 text-emerald-300 font-mono text-xs flex items-center gap-1"
                >
                  [{g.join(', ')}]
                </div>
              ))}
            </div>
          </div>
        )}
      </div>

      {/* Step Explanation */}
      <div className="bg-slate-950 border border-slate-800 rounded-xl p-3 text-sm text-slate-300 flex items-center gap-2">
        <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse shrink-0" />
        <span>{step.explanation}</span>
      </div>
    </div>
  );
};
