import React, { useState } from 'react';
import { Lightbulb, RotateCcw } from 'lucide-react';

interface CombinationSumTwoInputPanelProps {
  candidates: number[];
  setCandidates: (c: number[]) => void;
  target: number;
  setTarget: (t: number) => void;
  onResetToDefaults: () => void;
}

export const CombinationSumTwoInputPanel: React.FC<CombinationSumTwoInputPanelProps> = ({
  candidates,
  setCandidates,
  target,
  setTarget,
  onResetToDefaults,
}) => {
  const [candidatesStr, setCandidatesStr] = useState<string>(candidates.join(', '));
  const [targetVal, setTargetVal] = useState<number>(target);

  const applyCustomInputs = () => {
    const parsed = candidatesStr
      .split(',')
      .map((s) => parseInt(s.trim(), 10))
      .filter((n) => !isNaN(n) && n > 0);

    if (parsed.length >= 1) {
      const trimmed = parsed.slice(0, 7);
      setCandidates(trimmed);
      setTarget(Math.max(1, targetVal));
      setCandidatesStr(trimmed.join(', '));
    }
  };

  const applyPreset = (presetCandidates: number[], presetTarget: number) => {
    setCandidates(presetCandidates);
    setTarget(presetTarget);
    setTargetVal(presetTarget);
    setCandidatesStr(presetCandidates.join(', '));
  };

  return (
    <div className="bg-slate-900/50 border border-slate-800 rounded-xl px-3 py-1.5 flex flex-wrap items-center justify-between gap-2.5 shrink-0">
      <div className="flex items-center gap-2.5 flex-wrap">
        <div className="flex items-center gap-1.5">
          <span className="text-[11px] font-semibold uppercase tracking-wider text-slate-400">
            Candidates:
          </span>
          <input
            type="text"
            value={candidatesStr}
            onChange={(e) => setCandidatesStr(e.target.value)}
            onBlur={applyCustomInputs}
            onKeyDown={(e) => e.key === 'Enter' && applyCustomInputs()}
            placeholder="10, 1, 2, 7, 6, 1, 5"
            className="w-48 bg-slate-950/80 border border-slate-700/70 rounded-lg px-2.5 py-0.5 text-xs text-white font-mono focus:outline-none focus:border-indigo-500"
          />
        </div>

        <div className="flex items-center gap-1.5">
          <span className="text-[11px] font-semibold uppercase tracking-wider text-slate-400">
            Target:
          </span>
          <input
            type="number"
            min={1}
            max={35}
            value={targetVal}
            onChange={(e) => {
              const val = parseInt(e.target.value, 10);
              if (!isNaN(val)) {
                setTargetVal(val);
                setTarget(Math.max(1, val));
              }
            }}
            className="w-14 bg-slate-950/80 border border-slate-700/70 rounded-lg px-2 py-0.5 text-xs text-white font-mono focus:outline-none focus:border-indigo-500"
          />
        </div>
      </div>

      {/* Presets */}
      <div className="flex items-center gap-1.5 text-xs">
        <span className="text-slate-500 text-[10px] font-medium flex items-center gap-1">
          <Lightbulb className="w-3 h-3 text-amber-400" /> Presets:
        </span>
        <button
          onClick={() => applyPreset([10, 1, 2, 7, 6, 1, 5], 8)}
          className="px-2 py-0.5 text-[11px] rounded bg-indigo-500/10 hover:bg-indigo-500/20 text-indigo-300 border border-indigo-500/30 transition-colors"
        >
          LC #1 [10,1,2,7,6,1,5] T=8
        </button>
        <button
          onClick={() => applyPreset([2, 5, 2, 1, 2], 5)}
          className="px-2 py-0.5 text-[11px] rounded bg-cyan-500/10 hover:bg-cyan-500/20 text-cyan-300 border border-cyan-500/30 transition-colors"
        >
          LC #2 [2,5,2,1,2] T=5
        </button>
        <button
          onClick={() => applyPreset([1, 1, 1, 2, 2], 4)}
          className="px-2 py-0.5 text-[11px] rounded bg-purple-500/10 hover:bg-purple-500/20 text-purple-300 border border-purple-500/30 transition-colors"
        >
          Heavy Dups [1,1,1,2,2] T=4
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
