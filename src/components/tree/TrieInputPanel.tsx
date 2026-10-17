import React from 'react';
import { Lightbulb, RotateCcw } from 'lucide-react';
import { TrieOperation } from '../../algorithms/trieIntuitive';

interface TrieInputPanelProps {
  operations: TrieOperation[];
  setOperations: (ops: TrieOperation[]) => void;
  onResetToDefaults: () => void;
}

export const TrieInputPanel: React.FC<TrieInputPanelProps> = ({
  operations,
  setOperations,
  onResetToDefaults,
}) => {
  const applyPreset = (presetOps: TrieOperation[]) => {
    setOperations(presetOps);
  };

  return (
    <div className="bg-slate-900/50 border border-slate-800 rounded-xl px-3 py-1.5 flex flex-wrap items-center justify-between gap-2.5 shrink-0">
      <div className="flex items-center gap-2.5 flex-wrap">
        <span className="text-[11px] font-semibold uppercase tracking-wider text-slate-400">
          Ops Sequence:
        </span>
        <div className="flex items-center gap-1.5 text-xs font-mono text-slate-300">
          {operations.map((o, idx) => (
            <span key={idx} className="px-1.5 py-0.5 rounded bg-slate-950/80 border border-slate-800 text-[11px]">
              {o.op}("{o.word}")
            </span>
          ))}
        </div>
      </div>

      {/* Presets */}
      <div className="flex items-center gap-1.5 text-xs">
        <span className="text-slate-500 text-[10px] font-medium flex items-center gap-1">
          <Lightbulb className="w-3 h-3 text-amber-400" /> Presets:
        </span>
        <button
          onClick={() =>
            applyPreset([
              { op: 'insert', word: 'apple' },
              { op: 'search', word: 'apple' },
              { op: 'search', word: 'app' },
              { op: 'startsWith', word: 'app' },
              { op: 'insert', word: 'app' },
              { op: 'search', word: 'app' }
            ])
          }
          className="px-2 py-0.5 text-[11px] rounded bg-indigo-500/10 hover:bg-indigo-500/20 text-indigo-300 border border-indigo-500/30 transition-colors"
        >
          LeetCode #1 ("apple", "app")
        </button>
        <button
          onClick={() =>
            applyPreset([
              { op: 'insert', word: 'cat' },
              { op: 'insert', word: 'car' },
              { op: 'insert', word: 'card' },
              { op: 'search', word: 'car' },
              { op: 'startsWith', word: 'ca' },
              { op: 'search', word: 'dog' }
            ])
          }
          className="px-2 py-0.5 text-[11px] rounded bg-cyan-500/10 hover:bg-cyan-500/20 text-cyan-300 border border-cyan-500/30 transition-colors"
        >
          Prefix Branching ("cat", "car")
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
