import React, { useState } from 'react';
import { Lightbulb, RotateCcw } from 'lucide-react';

interface KthLargestStreamInputPanelProps {
  k: number;
  setK: (k: number) => void;
  initialNums: number[];
  setInitialNums: (nums: number[]) => void;
  stream: number[];
  setStream: (stream: number[]) => void;
  onResetToDefaults: () => void;
}

export const KthLargestStreamInputPanel: React.FC<KthLargestStreamInputPanelProps> = ({
  k,
  setK,
  initialNums,
  setInitialNums,
  stream,
  setStream,
  onResetToDefaults,
}) => {
  const [kVal, setKVal] = useState<number>(k);
  const [initStr, setInitStr] = useState<string>(initialNums.join(', '));
  const [streamStr, setStreamStr] = useState<string>(stream.join(', '));

  const applyCustomInputs = () => {
    const parsedInit = initStr
      .split(',')
      .map((s) => parseInt(s.trim(), 10))
      .filter((n) => !isNaN(n));

    const parsedStream = streamStr
      .split(',')
      .map((s) => parseInt(s.trim(), 10))
      .filter((n) => !isNaN(n));

    const validK = Math.max(1, kVal);
    setK(validK);
    setKVal(validK);
    setInitialNums(parsedInit);
    setStream(parsedStream.length > 0 ? parsedStream : [1]);
    setInitStr(parsedInit.join(', '));
    setStreamStr(parsedStream.join(', '));
  };

  const applyPreset = (presetK: number, presetInit: number[], presetStream: number[]) => {
    setK(presetK);
    setKVal(presetK);
    setInitialNums(presetInit);
    setInitStr(presetInit.join(', '));
    setStream(presetStream);
    setStreamStr(presetStream.join(', '));
  };

  return (
    <div className="bg-slate-900/50 border border-slate-800 rounded-xl px-3 py-1.5 flex flex-wrap items-center justify-between gap-2.5 shrink-0">
      <div className="flex items-center gap-2.5 flex-wrap">
        <div className="flex items-center gap-1.5">
          <span className="text-[11px] font-semibold uppercase tracking-wider text-slate-400">
            K:
          </span>
          <input
            type="number"
            min={1}
            max={10}
            value={kVal}
            onChange={(e) => {
              const val = parseInt(e.target.value, 10);
              if (!isNaN(val)) {
                setKVal(val);
                setK(Math.max(1, val));
              }
            }}
            className="w-12 bg-slate-950/80 border border-slate-700/70 rounded-lg px-2 py-0.5 text-xs text-white font-mono focus:outline-none focus:border-indigo-500"
          />
        </div>

        <div className="flex items-center gap-1.5">
          <span className="text-[11px] font-semibold uppercase tracking-wider text-slate-400">
            Init:
          </span>
          <input
            type="text"
            value={initStr}
            onChange={(e) => setInitStr(e.target.value)}
            onBlur={applyCustomInputs}
            onKeyDown={(e) => e.key === 'Enter' && applyCustomInputs()}
            placeholder="4, 5, 8, 2"
            className="w-32 bg-slate-950/80 border border-slate-700/70 rounded-lg px-2.5 py-0.5 text-xs text-white font-mono focus:outline-none focus:border-indigo-500"
          />
        </div>

        <div className="flex items-center gap-1.5">
          <span className="text-[11px] font-semibold uppercase tracking-wider text-slate-400">
            Stream:
          </span>
          <input
            type="text"
            value={streamStr}
            onChange={(e) => setStreamStr(e.target.value)}
            onBlur={applyCustomInputs}
            onKeyDown={(e) => e.key === 'Enter' && applyCustomInputs()}
            placeholder="3, 5, 10, 9, 4"
            className="w-40 bg-slate-950/80 border border-slate-700/70 rounded-lg px-2.5 py-0.5 text-xs text-white font-mono focus:outline-none focus:border-indigo-500"
          />
        </div>
      </div>

      {/* Presets */}
      <div className="flex items-center gap-1.5 text-xs">
        <span className="text-slate-500 text-[10px] font-medium flex items-center gap-1">
          <Lightbulb className="w-3 h-3 text-amber-400" /> Presets:
        </span>
        <button
          onClick={() => applyPreset(3, [4, 5, 8, 2], [3, 5, 10, 9, 4])}
          className="px-2 py-0.5 text-[11px] rounded bg-indigo-500/10 hover:bg-indigo-500/20 text-indigo-300 border border-indigo-500/30 transition-colors"
        >
          LeetCode #1 (k=3)
        </button>
        <button
          onClick={() => applyPreset(1, [], [-3, -2, -4, 0, 4])}
          className="px-2 py-0.5 text-[11px] rounded bg-cyan-500/10 hover:bg-cyan-500/20 text-cyan-300 border border-cyan-500/30 transition-colors"
        >
          Max (k=1)
        </button>
        <button
          onClick={() => applyPreset(2, [0], [-1, 1, -2, 4])}
          className="px-2 py-0.5 text-[11px] rounded bg-purple-500/10 hover:bg-purple-500/20 text-purple-300 border border-purple-500/30 transition-colors"
        >
          Small (k=2)
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
