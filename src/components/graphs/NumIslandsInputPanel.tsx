import React from 'react';
import { RotateCcw, Lightbulb } from 'lucide-react';

interface NumIslandsInputPanelProps {
  grid: string[][];
  setGrid: (grid: string[][]) => void;
  onResetToDefaults: () => void;
}

const PRESET_1 = [
  ['1', '1', '1', '1', '0'],
  ['1', '1', '0', '1', '0'],
  ['1', '1', '0', '0', '0'],
  ['0', '0', '0', '0', '0']
];

const PRESET_2 = [
  ['1', '1', '0', '0', '0'],
  ['1', '1', '0', '0', '0'],
  ['0', '0', '1', '0', '0'],
  ['0', '0', '0', '1', '1']
];

const PRESET_3 = [
  ['1', '0', '1', '0', '1'],
  ['0', '1', '0', '1', '0'],
  ['1', '0', '1', '0', '1']
];

export const NumIslandsInputPanel: React.FC<NumIslandsInputPanelProps> = ({
  setGrid,
  onResetToDefaults,
}) => {
  return (
    <div className="bg-slate-900/50 border border-slate-800 rounded-xl px-3 py-1.5 flex flex-wrap items-center justify-between gap-2.5 shrink-0">
      <div className="flex items-center gap-2.5 flex-wrap">
        <span className="text-[11px] font-semibold uppercase tracking-wider text-slate-400">
          Grid Map Configurations:
        </span>
      </div>

      {/* Presets */}
      <div className="flex items-center gap-1.5 text-xs">
        <span className="text-slate-500 text-[10px] font-medium flex items-center gap-1">
          <Lightbulb className="w-3 h-3 text-amber-400" /> Presets:
        </span>
        <button
          onClick={() => setGrid(PRESET_1)}
          className="px-2 py-0.5 text-[11px] rounded bg-indigo-500/10 hover:bg-indigo-500/20 text-indigo-300 border border-indigo-500/30 transition-colors"
        >
          LeetCode #1 (1 Giant Island)
        </button>
        <button
          onClick={() => setGrid(PRESET_2)}
          className="px-2 py-0.5 text-[11px] rounded bg-emerald-500/10 hover:bg-emerald-500/20 text-emerald-300 border border-emerald-500/30 transition-colors"
        >
          LeetCode #2 (3 Islands)
        </button>
        <button
          onClick={() => setGrid(PRESET_3)}
          className="px-2 py-0.5 text-[11px] rounded bg-cyan-500/10 hover:bg-cyan-500/20 text-cyan-300 border border-cyan-500/30 transition-colors"
        >
          Archipelago (Checkerboard)
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
