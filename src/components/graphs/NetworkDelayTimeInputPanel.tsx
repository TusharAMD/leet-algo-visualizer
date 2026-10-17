import React from 'react';
import { Lightbulb, RotateCcw } from 'lucide-react';

interface NetworkDelayTimeInputPanelProps {
  times: [number, number, number][];
  n: number;
  k: number;
  setTimes: (t: [number, number, number][]) => void;
  setN: (n: number) => void;
  setK: (k: number) => void;
  onResetToDefaults: () => void;
}

export const NetworkDelayTimeInputPanel: React.FC<NetworkDelayTimeInputPanelProps> = ({
  times,
  n,
  k,
  setTimes,
  setN,
  setK,
  onResetToDefaults,
}) => {
  const applyPreset1 = () => {
    setTimes([
      [2, 1, 1],
      [2, 3, 1],
      [3, 4, 1]
    ]);
    setN(4);
    setK(2);
  };

  const applyPreset2 = () => {
    setTimes([[1, 2, 1]]);
    setN(2);
    setK(1);
  };

  const applyPreset3 = () => {
    setTimes([[1, 2, 1]]);
    setN(2);
    setK(2);
  };

  return (
    <div className="bg-slate-900/50 border border-slate-800 rounded-xl px-3 py-1.5 flex flex-wrap items-center justify-between gap-2.5 shrink-0">
      <div className="flex items-center gap-2 flex-wrap">
        <span className="text-[11px] font-semibold uppercase tracking-wider text-slate-400">
          Network Topology:
        </span>
        <span className="px-2 py-0.5 rounded bg-slate-950 text-sky-300 font-mono text-xs border border-slate-800">
          {n} Nodes, {times.length} Edges (Broadcast Source: Node {k})
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
          LC #1 (4 Nodes, Source 2)
        </button>
        <button
          onClick={applyPreset2}
          className="px-2 py-0.5 text-[11px] rounded bg-emerald-500/10 hover:bg-emerald-500/20 text-emerald-300 border border-emerald-500/30 transition-colors"
        >
          2 Nodes (1 &rarr; 2)
        </button>
        <button
          onClick={applyPreset3}
          className="px-2 py-0.5 text-[11px] rounded bg-rose-500/10 hover:bg-rose-500/20 text-rose-300 border border-rose-500/30 transition-colors"
        >
          LC #3 (Unreachable: -1)
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
