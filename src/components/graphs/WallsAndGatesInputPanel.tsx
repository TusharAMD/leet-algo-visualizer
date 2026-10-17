import React from 'react';
import { Lightbulb, RotateCcw } from 'lucide-react';
import { INF } from '../../algorithms/wallsAndGatesIntuitive';

interface WallsAndGatesInputPanelProps {
  rooms: number[][];
  setRooms: (r: number[][]) => void;
  onResetToDefaults: () => void;
}

export const WallsAndGatesInputPanel: React.FC<WallsAndGatesInputPanelProps> = ({
  rooms,
  setRooms,
  onResetToDefaults,
}) => {
  const applyPreset1 = () => {
    setRooms([
      [INF, -1, 0, INF],
      [INF, INF, INF, -1],
      [INF, -1, INF, -1],
      [0, -1, INF, INF]
    ]);
  };

  const applyPreset2 = () => {
    setRooms([
      [0, INF, INF, INF],
      [INF, -1, INF, INF],
      [INF, INF, -1, INF],
      [INF, INF, INF, INF]
    ]);
  };

  const applyPreset3 = () => {
    setRooms([
      [INF, INF, INF, INF, INF],
      [INF, -1, INF, -1, INF],
      [INF, INF, 0, INF, INF],
      [INF, -1, INF, -1, INF],
      [INF, INF, INF, INF, INF]
    ]);
  };

  return (
    <div className="bg-slate-900/50 border border-slate-800 rounded-xl px-3 py-1.5 flex flex-wrap items-center justify-between gap-2.5 shrink-0">
      <div className="flex items-center gap-2 flex-wrap">
        <span className="text-[11px] font-semibold uppercase tracking-wider text-slate-400">
          Rooms Grid:
        </span>
        <span className="px-2 py-0.5 rounded bg-slate-950 text-emerald-300 font-mono text-xs border border-slate-800">
          {rooms.length} x {rooms[0]?.length || 0} Dimensions
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
          LC #1 (4x4 Two Gates)
        </button>
        <button
          onClick={applyPreset2}
          className="px-2 py-0.5 text-[11px] rounded bg-indigo-500/10 hover:bg-indigo-500/20 text-indigo-300 border border-indigo-500/30 transition-colors"
        >
          Corner Gate (4x4)
        </button>
        <button
          onClick={applyPreset3}
          className="px-2 py-0.5 text-[11px] rounded bg-purple-500/10 hover:bg-purple-500/20 text-purple-300 border border-purple-500/30 transition-colors"
        >
          Center Gate (5x5)
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
