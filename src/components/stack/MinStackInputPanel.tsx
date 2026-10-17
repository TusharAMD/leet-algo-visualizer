import React from 'react';
import { MinStackOperation } from '../../algorithms/minStackIntuitive';
import { Sparkles } from 'lucide-react';

interface MinStackInputPanelProps {
  onSelectSequence: (ops: MinStackOperation[]) => void;
}

const PRESET_CLASSIC: MinStackOperation[] = [
  { type: 'PUSH', value: -2 },
  { type: 'PUSH', value: 0 },
  { type: 'PUSH', value: -3 },
  { type: 'GET_MIN' },
  { type: 'POP' },
  { type: 'TOP' },
  { type: 'GET_MIN' }
];

const PRESET_DESCENDING: MinStackOperation[] = [
  { type: 'PUSH', value: 10 },
  { type: 'PUSH', value: 8 },
  { type: 'PUSH', value: 5 },
  { type: 'PUSH', value: 2 },
  { type: 'GET_MIN' },
  { type: 'POP' },
  { type: 'GET_MIN' },
  { type: 'POP' },
  { type: 'GET_MIN' }
];

const PRESET_ASCENDING: MinStackOperation[] = [
  { type: 'PUSH', value: 1 },
  { type: 'PUSH', value: 3 },
  { type: 'PUSH', value: 5 },
  { type: 'PUSH', value: 7 },
  { type: 'GET_MIN' },
  { type: 'POP' },
  { type: 'GET_MIN' }
];

const PRESET_NEGATIVE: MinStackOperation[] = [
  { type: 'PUSH', value: -5 },
  { type: 'PUSH', value: -10 },
  { type: 'PUSH', value: -2 },
  { type: 'GET_MIN' },
  { type: 'POP' },
  { type: 'GET_MIN' }
];

export const MinStackInputPanel: React.FC<MinStackInputPanelProps> = ({ onSelectSequence }) => {
  return (
    <div className="bg-slate-900/60 border border-slate-800 rounded-xl p-2.5 flex items-center justify-between shrink-0">
      <div className="flex items-center gap-2">
        <span className="text-[10px] uppercase font-mono font-bold tracking-wider text-slate-400">
          Operation Sequence:
        </span>
        <span className="text-xs text-slate-400">Choose an execution sequence:</span>
      </div>

      <div className="flex items-center gap-1.5">
        <button
          onClick={() => onSelectSequence(PRESET_CLASSIC)}
          className="text-[11px] px-3 py-1 rounded-lg bg-indigo-500/20 hover:bg-indigo-500/30 border border-indigo-500/40 text-indigo-300 font-semibold transition-colors flex items-center gap-1"
        >
          <Sparkles className="w-3 h-3" /> Classic [-2, 0, -3]
        </button>
        <button
          onClick={() => onSelectSequence(PRESET_DESCENDING)}
          className="text-[11px] px-3 py-1 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 font-medium transition-colors"
        >
          Descending [10, 8, 5, 2]
        </button>
        <button
          onClick={() => onSelectSequence(PRESET_ASCENDING)}
          className="text-[11px] px-3 py-1 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 font-medium transition-colors"
        >
          Ascending [1, 3, 5, 7]
        </button>
        <button
          onClick={() => onSelectSequence(PRESET_NEGATIVE)}
          className="text-[11px] px-3 py-1 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 font-medium transition-colors"
        >
          Negative Values
        </button>
      </div>
    </div>
  );
};
