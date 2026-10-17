import React from 'react';
import { Lightbulb, RotateCcw } from 'lucide-react';
import { LRUCacheOperation } from '../../algorithms/lruCacheIntuitive';

interface LRUCacheInputPanelProps {
  capacity: number;
  operations: LRUCacheOperation[];
  setCapacity: (cap: number) => void;
  setOperations: (ops: LRUCacheOperation[]) => void;
  onResetToDefaults: () => void;
}

export const LRUCacheInputPanel: React.FC<LRUCacheInputPanelProps> = ({
  capacity,
  operations,
  setCapacity,
  setOperations,
  onResetToDefaults,
}) => {
  const applyPreset = (newCap: number, newOps: LRUCacheOperation[]) => {
    setCapacity(newCap);
    setOperations(newOps);
  };

  return (
    <div className="bg-slate-900/50 border border-slate-800 rounded-xl px-3 py-1.5 flex flex-wrap items-center justify-between gap-2.5 shrink-0">
      <div className="flex items-center gap-2.5 flex-wrap">
        <span className="text-[11px] font-semibold uppercase tracking-wider text-slate-400">
          Capacity: <span className="text-white font-mono">{capacity}</span>
        </span>
        <span className="text-slate-600">|</span>
        <span className="text-[11px] text-slate-400 font-mono">
          Ops: {operations.map((o) => `${o.op}(${o.key}${o.val !== undefined ? `,${o.val}` : ''})`).join(' → ')}
        </span>
      </div>

      {/* Presets */}
      <div className="flex items-center gap-1.5 text-xs">
        <span className="text-slate-500 text-[10px] font-medium flex items-center gap-1">
          <Lightbulb className="w-3 h-3 text-amber-400" /> Presets:
        </span>
        <button
          onClick={() =>
            applyPreset(2, [
              { op: 'put', key: 1, val: 1 },
              { op: 'put', key: 2, val: 2 },
              { op: 'get', key: 1 },
              { op: 'put', key: 3, val: 3 },
              { op: 'get', key: 2 },
              { op: 'put', key: 4, val: 4 },
              { op: 'get', key: 1 },
              { op: 'get', key: 3 },
              { op: 'get', key: 4 }
            ])
          }
          className="px-2 py-0.5 text-[11px] rounded bg-indigo-500/10 hover:bg-indigo-500/20 text-indigo-300 border border-indigo-500/30 transition-colors"
        >
          LeetCode #1 (Cap=2)
        </button>
        <button
          onClick={() =>
            applyPreset(3, [
              { op: 'put', key: 10, val: 100 },
              { op: 'put', key: 20, val: 200 },
              { op: 'put', key: 30, val: 300 },
              { op: 'get', key: 10 },
              { op: 'put', key: 40, val: 400 },
              { op: 'get', key: 20 }
            ])
          }
          className="px-2 py-0.5 text-[11px] rounded bg-cyan-500/10 hover:bg-cyan-500/20 text-cyan-300 border border-cyan-500/30 transition-colors"
        >
          Cap=3 Evict 20
        </button>
        <button
          onClick={() =>
            applyPreset(1, [
              { op: 'put', key: 1, val: 10 },
              { op: 'get', key: 1 },
              { op: 'put', key: 2, val: 20 },
              { op: 'get', key: 1 },
              { op: 'get', key: 2 }
            ])
          }
          className="px-2 py-0.5 text-[11px] rounded bg-emerald-500/10 hover:bg-emerald-500/20 text-emerald-300 border border-emerald-500/30 transition-colors"
        >
          Cap=1 Single Slot
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
