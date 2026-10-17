import React, { useState } from 'react';
import { Lightbulb, RotateCcw } from 'lucide-react';

interface RemoveNthNodeInputPanelProps {
  nodes: number[];
  n: number;
  setNodes: (nodes: number[]) => void;
  setN: (n: number) => void;
  onResetToDefaults: () => void;
}

export const RemoveNthNodeInputPanel: React.FC<RemoveNthNodeInputPanelProps> = ({
  nodes,
  n,
  setNodes,
  setN,
  onResetToDefaults,
}) => {
  const [nodesInput, setNodesInput] = useState<string>(nodes.join(', '));
  const [nInput, setNInput] = useState<number>(n);

  const applyCustomInputs = () => {
    const parsed = nodesInput
      .split(',')
      .map((s) => parseInt(s.trim(), 10))
      .filter((num) => !isNaN(num));

    if (parsed.length >= 1) {
      setNodes(parsed);
      setNodesInput(parsed.join(', '));
      const validN = Math.max(1, Math.min(nInput, parsed.length));
      setN(validN);
      setNInput(validN);
    }
  };

  const applyPreset = (presetNodes: number[], presetN: number) => {
    setNodes(presetNodes);
    setN(presetN);
    setNodesInput(presetNodes.join(', '));
    setNInput(presetN);
  };

  return (
    <div className="bg-slate-900/50 border border-slate-800 rounded-xl px-3 py-1.5 flex flex-wrap items-center justify-between gap-2.5 shrink-0">
      <div className="flex items-center gap-2.5 flex-wrap">
        <div className="flex items-center gap-1.5">
          <span className="text-[11px] font-semibold uppercase tracking-wider text-slate-400">
            List:
          </span>
          <input
            type="text"
            value={nodesInput}
            onChange={(e) => setNodesInput(e.target.value)}
            onBlur={applyCustomInputs}
            onKeyDown={(e) => e.key === 'Enter' && applyCustomInputs()}
            placeholder="e.g. 1, 2, 3, 4, 5"
            className="w-48 bg-slate-950/80 border border-slate-700/70 rounded-lg px-2.5 py-0.5 text-xs text-white font-mono focus:outline-none focus:border-indigo-500"
          />
        </div>

        <div className="flex items-center gap-1.5">
          <span className="text-[11px] font-semibold uppercase tracking-wider text-slate-400">
            n:
          </span>
          <input
            type="number"
            min={1}
            max={nodes.length}
            value={nInput}
            onChange={(e) => {
              const val = parseInt(e.target.value, 10) || 1;
              setNInput(val);
              setN(Math.max(1, Math.min(val, nodes.length)));
            }}
            className="w-16 bg-slate-950/80 border border-slate-700/70 rounded-lg px-2 py-0.5 text-xs text-white font-mono text-center focus:outline-none focus:border-indigo-500"
          />
        </div>
      </div>

      {/* Presets */}
      <div className="flex items-center gap-1.5 text-xs">
        <span className="text-slate-500 text-[10px] font-medium flex items-center gap-1">
          <Lightbulb className="w-3 h-3 text-amber-400" /> Presets:
        </span>
        <button
          onClick={() => applyPreset([1, 2, 3, 4, 5], 2)}
          className="px-2 py-0.5 text-[11px] rounded bg-indigo-500/10 hover:bg-indigo-500/20 text-indigo-300 border border-indigo-500/30 transition-colors"
        >
          LeetCode #1 [1..5], n=2
        </button>
        <button
          onClick={() => applyPreset([1], 1)}
          className="px-2 py-0.5 text-[11px] rounded bg-cyan-500/10 hover:bg-cyan-500/20 text-cyan-300 border border-cyan-500/30 transition-colors"
        >
          Single [1], n=1
        </button>
        <button
          onClick={() => applyPreset([1, 2], 1)}
          className="px-2 py-0.5 text-[11px] rounded bg-emerald-500/10 hover:bg-emerald-500/20 text-emerald-300 border border-emerald-500/30 transition-colors"
        >
          Remove Tail [1, 2], n=1
        </button>
        <button
          onClick={() => applyPreset([1, 2], 2)}
          className="px-2 py-0.5 text-[11px] rounded bg-amber-500/10 hover:bg-amber-500/20 text-amber-300 border border-amber-500/30 transition-colors"
        >
          Remove Head [1, 2], n=2
        </button>
        <button
          onClick={onResetToDefaults}
          className="p-1 rounded bg-slate-800 hover:bg-slate-700 text-slate-400 hover:text-slate-200 transition-colors ml-1"
          title="Reset to default inputs"
        >
          <RotateCcw className="w-3.5 h-3.5" />
        </button>
      </div>
    </div>
  );
};
