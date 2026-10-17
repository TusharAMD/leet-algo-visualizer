import React from 'react';
import { Lightbulb, RotateCcw } from 'lucide-react';

interface CheapestFlightsInputPanelProps {
  n: number;
  flights: [number, number, number][];
  src: number;
  dst: number;
  k: number;
  setN: (n: number) => void;
  setFlights: (f: [number, number, number][]) => void;
  setSrc: (s: number) => void;
  setDst: (d: number) => void;
  setK: (k: number) => void;
  onResetToDefaults: () => void;
}

export const CheapestFlightsInputPanel: React.FC<CheapestFlightsInputPanelProps> = ({
  n,
  flights,
  src,
  dst,
  k,
  setN,
  setFlights,
  setSrc,
  setDst,
  setK,
  onResetToDefaults,
}) => {
  const applyPreset1 = () => {
    setN(4);
    setFlights([
      [0, 1, 100],
      [1, 2, 100],
      [2, 0, 100],
      [1, 3, 600],
      [2, 3, 200]
    ]);
    setSrc(0);
    setDst(3);
    setK(1);
  };

  const applyPreset2 = () => {
    setN(3);
    setFlights([
      [0, 1, 100],
      [1, 2, 100],
      [0, 2, 500]
    ]);
    setSrc(0);
    setDst(2);
    setK(1);
  };

  const applyPreset3 = () => {
    setN(3);
    setFlights([
      [0, 1, 100],
      [1, 2, 100],
      [0, 2, 500]
    ]);
    setSrc(0);
    setDst(2);
    setK(0); // 0 stops -> direct flight only ($500)
  };

  return (
    <div className="bg-slate-900/50 border border-slate-800 rounded-xl px-3 py-1.5 flex flex-wrap items-center justify-between gap-2.5 shrink-0">
      <div className="flex items-center gap-2 flex-wrap">
        <span className="text-[11px] font-semibold uppercase tracking-wider text-slate-400">
          Flight Network:
        </span>
        <span className="px-2 py-0.5 rounded bg-slate-950 text-sky-300 font-mono text-xs border border-slate-800">
          City {src} &rarr; City {dst} (Max {k} Stop{k === 1 ? '' : 's'})
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
          LC #1 (4 Cities, k=1, $700)
        </button>
        <button
          onClick={applyPreset2}
          className="px-2 py-0.5 text-[11px] rounded bg-emerald-500/10 hover:bg-emerald-500/20 text-emerald-300 border border-emerald-500/30 transition-colors"
        >
          LC #2 (1 Stop, $200)
        </button>
        <button
          onClick={applyPreset3}
          className="px-2 py-0.5 text-[11px] rounded bg-purple-500/10 hover:bg-purple-500/20 text-purple-300 border border-purple-500/30 transition-colors"
        >
          0 Stops Direct ($500)
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
