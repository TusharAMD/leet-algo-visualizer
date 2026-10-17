import React from 'react';
import { Lightbulb, RotateCcw } from 'lucide-react';

interface RottingOrangesInputPanelProps {
  grid: number[][];
  setGrid: (g: number[][]) => void;
  onResetToDefaults: () => void;
}

export const RottingOrangesInputPanel: React.FC<RottingOrangesInputPanelProps> = ({
  grid,
  setGrid,
  onResetToDefaults,
}) => {
  const applyPreset1 = () => {
    setGrid([
      [2, 1, 1],
      [1, 1, 0],
      [0, 1, 1]
    ]);
  };

  const applyPreset2 = () => {
    setGrid([
      [2, 1, 1],
      [0, 1, 1],
      [1, 0, 1]
    ]);
  };

  const applyPreset3 = () => {
    setGrid([
      [2, 1, 0, 2],
      [1, 1, 0, 1],
      [0, 1, 1, 1]
    ]);
  };

  return (
    <div className="bg-slate-900/50 border border-slate-800 rounded-xl px-3 py-1.5 flex flex-wrap items-center justify-between gap-2.5 shrink-0">
      <div className="flex items-center gap-2 flex-wrap">
        <span className="text-[11px] font-semibold uppercase tracking-wider text-slate-400">
          Oranges Grid:
        </span>
        <span className="px-2 py-0.5 rounded bg-slate-950 text-amber-300 font-mono text-xs border border-slate-800">
          {grid.length} x {grid[0]?.length || 0} Dimensions
        </span>
      </div>

      {/* Presets */}
      <div className="flex items-center gap-1.5 text-xs">
        <span className="text-slate-500 text-[10px] font-medium flex items-center gap-1">
          <Lightbulb className="w-3 h-3 text-amber-400" /> Presets:
        </span>
        <button
          onClick={applyPreset1}
          className="px-2 py-0.5 text-[11px] rounded bg-amber-500/10 hover:bg-amber-500/20 text-amber-300 border border-amber-500/30 transition-colors"
        >
          LC #1 (3x3 - 4 Minutes)
        </button>
        <button
          onClick={applyPreset2}
          className="px-2 py-0.5 text-[11px] rounded bg-rose-500/10 hover:bg-rose-500/20 text-rose-300 border border-rose-500/30 transition-colors"
        >
          LC #2 (Impossible: -1)
        </button>
        <button
          onClick={applyPreset3}
          className="px-2 py-0.5 text-[11px] rounded bg-lime-500/10 hover:bg-lime-500/20 text-lime-300 border border-lime-500/30 transition-colors"
        >
          Two Sources (3x4)
        </button>
        <button
          onClick={onResetToDefaults}
          className="p-1 rounded bg-slate-800 hover:bg-slate-700 text-slate-400 hover:text-white transition-colors ml-1"
          title="Reset Defaults"
        >
          <RotateCcw className="w-3.5 h-3.5" />
        </button>
      </div>
    </div>
  );
};
