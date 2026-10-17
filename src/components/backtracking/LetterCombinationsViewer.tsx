import React from 'react';
import { LetterCombinationsStep, PHONE_MAP } from '../../algorithms/letterCombinationsIntuitive';
import { Phone, CheckCircle2, ArrowRight, Layers, Sparkles, Smartphone } from 'lucide-react';

interface LetterCombinationsViewerProps {
  step: LetterCombinationsStep;
}

export const LetterCombinationsViewer: React.FC<LetterCombinationsViewerProps> = ({ step }) => {
  const {
    digits,
    digitIndex,
    currentDigit,
    activeChar,
    currentCombination,
    allCombinations,
    headline,
    subtext,
    isComplete,
    stepIndex,
    totalSteps
  } = step;

  const keypadDigits = ['1', '2', '3', '4', '5', '6', '7', '8', '9'];

  return (
    <div className="flex-1 min-h-0 flex flex-col bg-slate-900/60 border border-slate-800 rounded-2xl p-3 shadow-xl overflow-hidden justify-between">
      {/* Top Banner */}
      <div className="bg-slate-950/70 border border-slate-800/80 rounded-xl p-2.5 flex items-center justify-between shrink-0">
        <div className="flex items-center gap-2">
          <span className="p-1.5 rounded-lg bg-indigo-500/10 text-indigo-400 border border-indigo-500/20">
            <Smartphone className="w-4 h-4" />
          </span>
          <div>
            <h3 className="text-xs font-semibold text-white tracking-wide">{headline}</h3>
            <p className="text-[11px] text-slate-400">{subtext}</p>
          </div>
        </div>
        <div className="flex items-center gap-2">
          {allCombinations.length > 0 && (
            <span className="px-2 py-0.5 rounded-md bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 text-[11px] font-semibold flex items-center gap-1">
              <CheckCircle2 className="w-3.5 h-3.5" /> {allCombinations.length} Combinations
            </span>
          )}
          <span className="px-2 py-0.5 rounded-md bg-indigo-500/10 border border-indigo-500/20 text-indigo-400 text-[11px] font-mono">
            Step {stepIndex + 1} / {totalSteps}
          </span>
        </div>
      </div>

      {/* Main Arena */}
      <div className="flex-1 min-h-0 grid grid-cols-1 md:grid-cols-12 gap-3 py-1 px-1">
        {/* Left: Phone Keypad & Word Construction */}
        <div className="md:col-span-7 bg-slate-950/60 border border-slate-800 rounded-xl p-2.5 flex flex-col justify-between overflow-hidden">
          {/* Active Word Construction */}
          <div className="bg-slate-900/80 border border-slate-800 rounded-xl p-2 shrink-0 flex items-center justify-between">
            <span className="text-[10px] uppercase font-semibold text-slate-400">
              Current Word (`curStr`):
            </span>
            <div className="flex items-center gap-1.5">
              {digits.split('').map((_, idx) => {
                const charAtIdx = currentCombination[idx];
                const isCurrentSlot = idx === currentCombination.length - 1;
                return (
                  <div
                    key={idx}
                    className={`w-9 h-9 rounded-xl flex items-center justify-center font-mono font-bold text-sm border transition-all ${
                      charAtIdx
                        ? isCurrentSlot
                          ? 'bg-amber-500/25 border-amber-400 text-amber-200 ring-2 ring-amber-400 scale-105'
                          : 'bg-indigo-500/20 border-indigo-400 text-indigo-200'
                        : 'bg-slate-950 border-dashed border-slate-700 text-slate-600'
                    }`}
                  >
                    {charAtIdx || '—'}
                  </div>
                );
              })}
            </div>
          </div>

          {/* Keypad UI */}
          <div className="flex-1 flex flex-col items-center justify-center py-2">
            <div className="grid grid-cols-3 gap-2 p-2.5 bg-slate-900/90 rounded-2xl border border-slate-800">
              {keypadDigits.map((d) => {
                const letters = PHONE_MAP[d] || '';
                const isSelectedDigit = d === currentDigit;

                return (
                  <div
                    key={d}
                    className={`w-14 h-12 rounded-xl flex flex-col items-center justify-center border transition-all ${
                      isSelectedDigit
                        ? 'bg-amber-500/25 border-amber-400 ring-2 ring-amber-400/50 scale-105'
                        : 'bg-slate-850 border-slate-700/80'
                    }`}
                  >
                    <span
                      className={`text-sm font-mono font-bold ${
                        isSelectedDigit ? 'text-amber-200' : 'text-slate-200'
                      }`}
                    >
                      {d}
                    </span>
                    <span
                      className={`text-[9px] uppercase tracking-wider font-mono ${
                        isSelectedDigit ? 'text-amber-300 font-bold' : 'text-slate-500'
                      }`}
                    >
                      {letters || '—'}
                    </span>
                  </div>
                );
              })}
            </div>
          </div>

          <div className="text-[10px] text-slate-500 bg-slate-900/80 rounded-lg p-1.5 border border-slate-800/60 text-center shrink-0">
            Cartesian Product: Branching factor is 3 or 4 choices per digit (7 and 9 have 4 letters).
          </div>
        </div>

        {/* Right: Collected Combinations */}
        <div className="md:col-span-5 bg-slate-950/60 border border-slate-800 rounded-xl p-2.5 flex flex-col justify-between overflow-hidden">
          <div className="flex items-center justify-between border-b border-slate-800/70 pb-1.5 shrink-0">
            <span className="text-xs font-semibold text-emerald-400 flex items-center gap-1.5">
              <Sparkles className="w-3.5 h-3.5" />
              Combinations Formed
            </span>
            <span className="text-[10px] font-mono text-slate-400">
              {allCombinations.length} total
            </span>
          </div>

          <div className="flex-1 overflow-y-auto py-2 grid grid-cols-2 gap-1.5 content-start">
            {allCombinations.length === 0 ? (
              <span className="text-slate-600 text-xs italic col-span-2 text-center py-4">
                No combinations assembled yet
              </span>
            ) : (
              allCombinations.map((word, idx) => (
                <div
                  key={idx}
                  className="flex items-center justify-between px-2.5 py-1.5 rounded-xl bg-emerald-500/10 border border-emerald-500/30 text-emerald-300 font-mono text-xs font-bold shadow"
                >
                  <span className="text-slate-500 text-[9px]">#{idx + 1}</span>
                  <span>"{word}"</span>
                </div>
              ))
            )}
          </div>

          <div className="text-[10px] text-slate-500 bg-slate-900/80 rounded-lg p-1.5 border border-slate-800/60 text-center shrink-0">
            Complexity: O(4^N * N) worst case for all 7s and 9s.
          </div>
        </div>
      </div>
    </div>
  );
};
