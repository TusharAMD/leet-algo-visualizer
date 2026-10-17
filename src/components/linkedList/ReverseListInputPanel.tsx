import React, { useState } from 'react';
import { RotateCcw, Lightbulb } from 'lucide-react';

interface ReverseListInputPanelProps {
  nodes: number[];
  setNodes: (nodes: number[]) => void;
  onResetToDefaults: () => void;
}

export const ReverseListInputPanel: React.FC<ReverseListInputPanelProps> = ({
  nodes,
  setNodes,
  onResetToDefaults,
}) => {
  const [nodesInput, setNodesInput] = useState<string>(nodes.join(', '));

  const applyCustomInputs = () => {
    const parsed = nodesInput
      .split(',')
      .map((s) => parseInt(s.trim(), 10))
      .filter((n) => !isNaN(n));

    if (parsed.length >= 1) {
      setNodes(parsed);
      setNodesInput(parsed.join(', '));
    }
  };

  const applyPreset = (presetNodes: number[]) => {
    setNodes(presetNodes);
    setNodesInput(presetNodes.join(', '));
  };

  return (
    <div className="bg-slate-900/50 border border-slate-800 rounded-xl px-3 py-1.5 flex flex-wrap items-center justify-between gap-2.5 shrink-0">
      <div className="flex items-center gap-2.5 flex-wrap">
        <div className="flex items-center gap-1.5">
          <span className="text-[11px] font-semibold uppercase tracking-wider text-slate-400">
            Linked List Nodes:
          </span>
          <input
            type="text"
            value={nodesInput}
            onChange={(e) => setNodesInput(e.target.value)}
            onBlur={applyCustomInputs}
            onKeyDown={(e) => e.key === 'Enter' && applyCustomInputs()}
            placeholder="e.g. 1, 2, 3, 4, 5"
            className="w-56 bg-slate-950/80 border border-slate-700/70 rounded-lg px-2.5 py-0.5 text-xs text-white font-mono focus:outline-none focus:border-indigo-500"
          />
        </div>
      </div>

      {/* Presets */}
      <div className="flex items-center gap-1.5 text-xs">
        <span className="text-slate-500 text-[10px] font-medium flex items-center gap-1">
          <Lightbulb className="w-3 h-3 text-amber-400" /> Presets:
        </span>
        <button
          onClick={() => applyPreset([1, 2, 3, 4, 5])}
          className="px-2 py-0.5 text-[11px] rounded bg-indigo-500/10 hover:bg-indigo-500/20 text-indigo-300 border border-indigo-500/30 transition-colors"
        >
          LeetCode #1 [1..5]
        </button>
        <button
          onClick={() => applyPreset([1, 2])}
          className="px-2 py-0.5 text-[11px] rounded bg-cyan-500/10 hover:bg-cyan-500/20 text-cyan-300 border border-cyan-500/30 transition-colors"
        >
          Short [1, 2]
        </button>
        <button
          onClick={() => applyPreset([10, 20, 30, 40, 50, 60])}
          className="px-2 py-0.5 text-[11px] rounded bg-purple-500/10 hover:bg-purple-500/20 text-purple-300 border border-purple-500/30 transition-colors"
        >
          6 Nodes [10..60]
        </button>
        <button
          onClick={() => applyPreset([42])}
          className="px-2 py-0.5 text-[11px] rounded bg-amber-500/10 hover:bg-amber-500/20 text-amber-300 border border-amber-500/30 transition-colors"
        >
          Single [42]
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
