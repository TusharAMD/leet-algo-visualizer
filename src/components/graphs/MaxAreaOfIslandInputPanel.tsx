import React from 'react';
import { Lightbulb, RotateCcw } from 'lucide-react';

interface MaxAreaOfIslandInputPanelProps {
  grid: number[][];
  setGrid: (g: number[][]) => void;
  onResetToDefaults: () => void;
}

export const MaxAreaOfIslandInputPanel: React.FC<MaxAreaOfIslandInputPanelProps> = ({
  grid,
  setGrid,
  onResetToDefaults,
}) => {
  const applyPreset1 = () => {
    setGrid([
      [0, 0, 1, 0, 0, 0, 0, 1, 0, 0],
      [0, 0, 0, 0, 0, 0, 0, 1, 1, 1],
      [0, 1, 1, 0, 1, 0, 0, 0, 0, 0],
      [0, 1, 0, 0, 1, 1, 0, 0, 1, 0],
      [0, 1, 0, 0, 1, 1, 0, 0, 1, 1],
      [0, 0, 0, 0, 0, 0, 0, 0, 0, 1]
    ]);
  };

  const applyPreset2 = () => {
    setGrid([
      [1, 1, 0, 0, 0],
      [1, 1, 0, 0, 0],
      [0, 0, 0, 1, 1],
      [0, 0, 0, 1, 1]
    ]);
  };

  const applyPreset3 = () => {
    setGrid([
      [0, 0, 0, 0],
      [0, 0, 0, 0],
      [0, 0, 0, 0]
    ]);
  };

  return (
    <div className="bg-slate-900/50 border border-slate-800 rounded-xl px-3 py-1.5 flex flex-wrap items-center justify-between gap-2.5 shrink-0">
      <div className="flex items-center gap-2 flex-wrap">
        <span className="text-[11px] font-semibold uppercase tracking-wider text-slate-400">
          Grid Map:
        </span>
        <span className="px-2 py-0.5 rounded bg-slate-950 text-indigo-300 font-mono text-xs border border-slate-800">
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
          className="px-2 py-0.5 text-[11px] rounded bg-indigo-500/10 hover:bg-indigo-500/20 text-indigo-300 border border-indigo-500/30 transition-colors"
        >
          LeetCode #1 (6x10 archipelago)
        </button>
        <button
          onClick={applyPreset2}
          className="px-2 py-0.5 text-[11px] rounded bg-cyan-500/10 hover:bg-cyan-500/20 text-cyan-300 border border-cyan-500/30 transition-colors"
        >
          Two 2x2 Islands
        </button>
        <button
          onClick={applyPreset3}
          className="px-2 py-0.5 text-[11px] rounded bg-purple-500/10 hover:bg-purple-500/20 text-purple-300 border border-purple-500/30 transition-colors"
        >
          All Water (Area = 0)
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
