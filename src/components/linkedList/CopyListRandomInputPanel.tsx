import React from 'react';
import { Lightbulb, RotateCcw } from 'lucide-react';
import { RandomListNodeData } from '../../algorithms/copyListRandomIntuitive';

interface CopyListRandomInputPanelProps {
  nodes: RandomListNodeData[];
  setNodes: (nodes: RandomListNodeData[]) => void;
  onResetToDefaults: () => void;
}

export const CopyListRandomInputPanel: React.FC<CopyListRandomInputPanelProps> = ({
  nodes,
  setNodes,
  onResetToDefaults,
}) => {
  const applyPreset = (presetNodes: RandomListNodeData[]) => {
    setNodes(presetNodes);
  };

  return (
    <div className="bg-slate-900/50 border border-slate-800 rounded-xl px-3 py-1.5 flex flex-wrap items-center justify-between gap-2.5 shrink-0">
      <div className="flex items-center gap-2.5 flex-wrap">
        <span className="text-[11px] font-semibold uppercase tracking-wider text-slate-400">
          List: [{nodes.map((n) => `[${n.val}, ${n.randomId !== null ? n.randomId : 'null'}]`).join(', ')}]
        </span>
      </div>

      {/* Presets */}
      <div className="flex items-center gap-1.5 text-xs">
        <span className="text-slate-500 text-[10px] font-medium flex items-center gap-1">
          <Lightbulb className="w-3 h-3 text-amber-400" /> Presets:
        </span>
        <button
          onClick={() =>
            applyPreset([
              { id: 0, val: 7, randomId: null },
              { id: 1, val: 13, randomId: 0 },
              { id: 2, val: 11, randomId: 4 },
              { id: 3, val: 10, randomId: 2 },
              { id: 4, val: 1, randomId: 0 }
            ])
          }
          className="px-2 py-0.5 text-[11px] rounded bg-indigo-500/10 hover:bg-indigo-500/20 text-indigo-300 border border-indigo-500/30 transition-colors"
        >
          LeetCode #1 [[7,null],[13,0]...]
        </button>
        <button
          onClick={() =>
            applyPreset([
              { id: 0, val: 1, randomId: 1 },
              { id: 1, val: 2, randomId: 1 }
            ])
          }
          className="px-2 py-0.5 text-[11px] rounded bg-cyan-500/10 hover:bg-cyan-500/20 text-cyan-300 border border-cyan-500/30 transition-colors"
        >
          Cycle [[1,1],[2,1]]
        </button>
        <button
          onClick={() =>
            applyPreset([
              { id: 0, val: 3, randomId: null },
              { id: 1, val: 3, randomId: 0 },
              { id: 2, val: 3, randomId: null }
            ])
          }
          className="px-2 py-0.5 text-[11px] rounded bg-emerald-500/10 hover:bg-emerald-500/20 text-emerald-300 border border-emerald-500/30 transition-colors"
        >
          Duplicates
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
