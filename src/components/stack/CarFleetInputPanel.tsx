import React, { useState } from 'react';
import { Sparkles } from 'lucide-react';

interface CarFleetInputPanelProps {
  onUpdate: (target: number, position: number[], speed: number[]) => void;
  currentTarget: number;
  currentPosition: number[];
  currentSpeed: number[];
}

export const CarFleetInputPanel: React.FC<CarFleetInputPanelProps> = ({
  onUpdate,
  currentTarget,
  currentPosition,
  currentSpeed
}) => {
  const [targetVal, setTargetVal] = useState(currentTarget);
  const [posStr, setPosStr] = useState(currentPosition.join(', '));
  const [speedStr, setSpeedStr] = useState(currentSpeed.join(', '));

  const presets = [
    {
      label: 'Standard target=12 (3 fleets)',
      target: 12,
      pos: [10, 8, 0, 5, 3],
      speed: [2, 4, 1, 1, 3]
    },
    {
      label: 'Single Car target=10 (1 fleet)',
      target: 10,
      pos: [3],
      speed: [3]
    },
    {
      label: 'Fast Trailer target=100 (1 fleet)',
      target: 100,
      pos: [0, 2, 4],
      speed: [4, 2, 1]
    },
    {
      label: 'All Equal Speed (4 fleets)',
      target: 10,
      pos: [6, 4, 2, 0],
      speed: [2, 2, 2, 2]
    }
  ];

  const handleApply = (e: React.FormEvent) => {
    e.preventDefault();
    const parsedPos = posStr.split(',').map((s) => parseInt(s.trim(), 10)).filter((n) => !isNaN(n));
    const parsedSpeed = speedStr.split(',').map((s) => parseInt(s.trim(), 10)).filter((n) => !isNaN(n));

    if (parsedPos.length > 0 && parsedPos.length === parsedSpeed.length && targetVal > 0) {
      onUpdate(targetVal, parsedPos, parsedSpeed);
    }
  };

  return (
    <div className="bg-slate-900/60 border border-slate-800 rounded-xl p-2.5 flex flex-col gap-2 shrink-0">
      <div className="flex items-center justify-between">
        <span className="text-[10px] uppercase font-mono font-bold tracking-wider text-slate-400">
          Target, Positions & Speeds:
        </span>
        <div className="flex items-center gap-1">
          {presets.map((p, idx) => (
            <button
              key={idx}
              onClick={() => {
                setTargetVal(p.target);
                setPosStr(p.pos.join(', '));
                setSpeedStr(p.speed.join(', '));
                onUpdate(p.target, p.pos, p.speed);
              }}
              className="text-[10px] px-2 py-0.5 rounded bg-slate-800 hover:bg-slate-700 text-slate-300 font-medium transition-colors"
            >
              {p.label.split(' ')[0]}
            </button>
          ))}
        </div>
      </div>

      <form onSubmit={handleApply} className="flex items-center gap-2">
        <div className="flex items-center gap-1 bg-slate-950/80 border border-slate-800 rounded-lg px-2.5 py-1">
          <span className="text-[10px] font-mono text-slate-400">Target:</span>
          <input
            type="number"
            min={1}
            value={targetVal}
            onChange={(e) => setTargetVal(parseInt(e.target.value, 10) || 1)}
            className="w-14 bg-transparent text-xs font-mono text-emerald-400 focus:outline-none"
          />
        </div>
        <div className="flex-1 flex items-center gap-1 bg-slate-950/80 border border-slate-800 rounded-lg px-2.5 py-1">
          <span className="text-[10px] font-mono text-slate-400">Pos:</span>
          <input
            type="text"
            value={posStr}
            onChange={(e) => setPosStr(e.target.value)}
            placeholder="e.g. 10, 8, 0, 5, 3"
            className="flex-1 bg-transparent text-xs font-mono text-slate-200 focus:outline-none"
          />
        </div>
        <div className="flex-1 flex items-center gap-1 bg-slate-950/80 border border-slate-800 rounded-lg px-2.5 py-1">
          <span className="text-[10px] font-mono text-slate-400">Speed:</span>
          <input
            type="text"
            value={speedStr}
            onChange={(e) => setSpeedStr(e.target.value)}
            placeholder="e.g. 2, 4, 1, 1, 3"
            className="flex-1 bg-transparent text-xs font-mono text-slate-200 focus:outline-none"
          />
        </div>
        <button
          type="submit"
          className="px-3 py-1 rounded-lg bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-semibold text-xs transition-colors flex items-center gap-1 shadow-md shadow-emerald-500/20"
        >
          <Sparkles className="w-3.5 h-3.5" /> Visualize
        </button>
      </form>
    </div>
  );
};
