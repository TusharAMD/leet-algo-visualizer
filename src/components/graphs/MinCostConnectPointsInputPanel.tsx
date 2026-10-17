import React from 'react';
import { Lightbulb, RotateCcw } from 'lucide-react';

interface MinCostConnectPointsInputPanelProps {
  points: [number, number][];
  setPoints: (p: [number, number][]) => void;
  onResetToDefaults: () => void;
}

export const MinCostConnectPointsInputPanel: React.FC<MinCostConnectPointsInputPanelProps> = ({
  points,
  setPoints,
  onResetToDefaults,
}) => {
  const applyPreset1 = () => {
    setPoints([
      [0, 0],
      [2, 2],
      [3, 10],
      [5, 2],
      [7, 0]
    ]);
  };

  const applyPreset2 = () => {
    setPoints([
      [3, 12],
      [-2, 5],
      [-4, 1]
    ]);
  };

  const applyPreset3 = () => {
    setPoints([
      [0, 0],
      [0, 4],
      [4, 4],
      [4, 0]
    ]);
  };

  return (
    <div className="bg-slate-900/50 border border-slate-800 rounded-xl px-3 py-1.5 flex flex-wrap items-center justify-between gap-2.5 shrink-0">
      <div className="flex items-center gap-2 flex-wrap">
        <span className="text-[11px] font-semibold uppercase tracking-wider text-slate-400">
          Point Cloud:
        </span>
        <span className="px-2 py-0.5 rounded bg-slate-950 text-emerald-300 font-mono text-xs border border-slate-800">
          {points.length} Coordinates
        </span>
      </div>

      {/* Presets */}
      <div className="flex items-center gap-1.5 text-xs">
        <span className="text-slate-500 text-[10px] font-medium flex items-center gap-1">
          <Lightbulb className="w-3 h-3 text-amber-400" /> Presets:
        </span>
        <button
          onClick={applyPreset1}
          className="px-2 py-0.5 text-[11px] rounded bg-emerald-500/10 hover:bg-emerald-500/20 text-emerald-300 border border-emerald-500/30 transition-colors"
        >
          LC #1 (5 Points, Cost: 20)
        </button>
        <button
          onClick={applyPreset2}
          className="px-2 py-0.5 text-[11px] rounded bg-indigo-500/10 hover:bg-indigo-500/20 text-indigo-300 border border-indigo-500/30 transition-colors"
        >
          LC #2 (3 Points, Cost: 18)
        </button>
        <button
          onClick={applyPreset3}
          className="px-2 py-0.5 text-[11px] rounded bg-purple-500/10 hover:bg-purple-500/20 text-purple-300 border border-purple-500/30 transition-colors"
        >
          4-Point Square (Cost: 12)
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
