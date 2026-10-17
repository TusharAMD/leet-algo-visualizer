import React from 'react';
import { Lightbulb, RotateCcw } from 'lucide-react';

interface SwimInRisingWaterInputPanelProps {
  grid: number[][];
  setGrid: (g: number[][]) => void;
  onResetToDefaults: () => void;
}

export const SwimInRisingWaterInputPanel: React.FC<SwimInRisingWaterInputPanelProps> = ({
  grid,
  setGrid,
  onResetToDefaults,
}) => {
  const applyPreset1 = () => {
    setGrid([
      [0, 2],
      [1, 3]
    ]);
  };

  const applyPreset2 = () => {
    setGrid([
      [0, 1, 2, 3, 4],
      [24, 23, 22, 21, 5],
      [12, 13, 14, 15, 16],
      [11, 17, 18, 19, 20],
      [10, 9, 8, 7, 6]
    ]);
  };

  const applyPreset3 = () => {
    setGrid([
      [0, 1, 5],
      [1, 5, 2],
      [5, 2, 0]
    ]);
  };

  return (
    <div className="bg-slate-900/50 border border-slate-800 rounded-xl px-3 py-1.5 flex flex-wrap items-center justify-between gap-2.5 shrink-0">
      <div className="flex items-center gap-2 flex-wrap">
        <span className="text-[11px] font-semibold uppercase tracking-wider text-slate-400">
          Topography Grid:
        </span>
        <span className="px-2 py-0.5 rounded bg-slate-950 text-sky-300 font-mono text-xs border border-slate-800">
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
          className="px-2 py-0.5 text-[11px] rounded bg-sky-500/10 hover:bg-sky-500/20 text-sky-300 border border-sky-500/30 transition-colors"
        >
          LC #1 (2x2, Time: 3)
        </button>
        <button
          onClick={applyPreset2}
          className="px-2 py-0.5 text-[11px] rounded bg-emerald-500/10 hover:bg-emerald-500/20 text-emerald-300 border border-emerald-500/30 transition-colors"
        >
          LC #2 (5x5 Spiral, Time: 16)
        </button>
        <button
          onClick={applyPreset3}
          className="px-2 py-0.5 text-[11px] rounded bg-purple-500/10 hover:bg-purple-500/20 text-purple-300 border border-purple-500/30 transition-colors"
        >
          3x3 Ridge
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
