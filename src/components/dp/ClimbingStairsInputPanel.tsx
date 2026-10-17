import React from 'react';
import { RotateCcw, Lightbulb } from 'lucide-react';

interface ClimbingStairsInputPanelProps {
  n: number;
  setN: (n: number) => void;
  onResetToDefaults: () => void;
}

export const ClimbingStairsInputPanel: React.FC<ClimbingStairsInputPanelProps> = ({
  n,
  setN,
  onResetToDefaults,
}) => {
  return (
    <div className="bg-slate-900/50 border border-slate-800 rounded-xl px-3 py-1.5 flex flex-wrap items-center justify-between gap-2.5 shrink-0">
      <div className="flex items-center gap-2.5 flex-wrap">
        <div className="flex items-center gap-1.5">
          <span className="text-[11px] font-semibold uppercase tracking-wider text-slate-400">
            Number of Stairs (N):
          </span>
          <div className="flex items-center gap-1">
            {[3, 4, 5, 6, 7].map((val) => (
              <button
                key={val}
                onClick={() => setN(val)}
                className={`px-3 py-0.5 rounded-lg text-xs font-mono font-bold transition-all ${
                  n === val
                    ? 'bg-indigo-600 text-white shadow-md shadow-indigo-500/20'
                    : 'bg-slate-800 text-slate-400 hover:text-white hover:bg-slate-700'
                }`}
              >
                {val}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Presets */}
      <div className="flex items-center gap-1.5 text-xs">
        <span className="text-slate-500 text-[10px] font-medium flex items-center gap-1">
          <Lightbulb className="w-3 h-3 text-amber-400" /> Presets:
        </span>
        <button
          onClick={() => setN(3)}
          className={`px-2 py-0.5 text-[11px] rounded transition-colors ${
            n === 3
              ? 'bg-indigo-500/20 text-indigo-300 border border-indigo-500/40'
              : 'bg-slate-800/80 text-slate-300 hover:bg-slate-700'
          }`}
        >
          LeetCode #1 (n=3 ➔ 3 ways)
        </button>
        <button
          onClick={() => setN(5)}
          className={`px-2 py-0.5 text-[11px] rounded transition-colors ${
            n === 5
              ? 'bg-indigo-500/20 text-indigo-300 border border-indigo-500/40'
              : 'bg-slate-800/80 text-slate-300 hover:bg-slate-700'
          }`}
        >
          Fibonacci Step (n=5 ➔ 8 ways)
        </button>
        <button
          onClick={() => setN(7)}
          className={`px-2 py-0.5 text-[11px] rounded transition-colors ${
            n === 7
              ? 'bg-indigo-500/20 text-indigo-300 border border-indigo-500/40'
              : 'bg-slate-800/80 text-slate-300 hover:bg-slate-700'
          }`}
        >
          High Podium (n=7 ➔ 21 ways)
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
