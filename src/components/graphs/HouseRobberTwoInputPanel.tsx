import React from 'react';
import { Lightbulb, RotateCcw } from 'lucide-react';

interface HouseRobberTwoInputPanelProps {
  nums: number[];
  setNums: (n: number[]) => void;
  onResetToDefaults: () => void;
}

export const HouseRobberTwoInputPanel: React.FC<HouseRobberTwoInputPanelProps> = ({
  nums,
  setNums,
  onResetToDefaults,
}) => {
  const applyPreset1 = () => {
    setNums([2, 3, 2]);
  };

  const applyPreset2 = () => {
    setNums([1, 2, 3, 1]);
  };

  const applyPreset3 = () => {
    setNums([1, 2, 3]);
  };

  return (
    <div className="bg-slate-900/50 border border-slate-800 rounded-xl px-3 py-1.5 flex flex-wrap items-center justify-between gap-2.5 shrink-0">
      <div className="flex items-center gap-2 flex-wrap">
        <span className="text-[11px] font-semibold uppercase tracking-wider text-slate-400">
          Circular Street:
        </span>
        <span className="px-2 py-0.5 rounded bg-slate-950 text-amber-300 font-mono text-xs border border-slate-800">
          {nums.length} Houses in Ring: [{nums.join(', ')}]
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
          LC #1 ([2,3,2] &rarr; $3)
        </button>
        <button
          onClick={applyPreset2}
          className="px-2 py-0.5 text-[11px] rounded bg-emerald-500/10 hover:bg-emerald-500/20 text-emerald-300 border border-emerald-500/30 transition-colors"
        >
          LC #2 ([1,2,3,1] &rarr; $4)
        </button>
        <button
          onClick={applyPreset3}
          className="px-2 py-0.5 text-[11px] rounded bg-purple-500/10 hover:bg-purple-500/20 text-purple-300 border border-purple-500/30 transition-colors"
        >
          LC #3 ([1,2,3] &rarr; $3)
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
