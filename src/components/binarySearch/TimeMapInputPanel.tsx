import React from 'react';
import { TimeMapOperation } from '../../algorithms/timeMapIntuitive';
import { Sparkles } from 'lucide-react';

interface TimeMapInputPanelProps {
  onSelectSequence: (ops: TimeMapOperation[]) => void;
}

const PRESET_STANDARD: TimeMapOperation[] = [
  { type: 'SET', key: 'foo', value: 'bar', timestamp: 1 },
  { type: 'GET', key: 'foo', timestamp: 1 },
  { type: 'GET', key: 'foo', timestamp: 3 },
  { type: 'SET', key: 'foo', value: 'bar2', timestamp: 4 },
  { type: 'GET', key: 'foo', timestamp: 4 },
  { type: 'GET', key: 'foo', timestamp: 5 }
];

const PRESET_MULTIPLE_TIMESTAMPS: TimeMapOperation[] = [
  { type: 'SET', key: 'love', value: 'high', timestamp: 10 },
  { type: 'SET', key: 'love', value: 'low', timestamp: 20 },
  { type: 'GET', key: 'love', timestamp: 5 },
  { type: 'GET', key: 'love', timestamp: 10 },
  { type: 'GET', key: 'love', timestamp: 15 },
  { type: 'GET', key: 'love', timestamp: 20 },
  { type: 'GET', key: 'love', timestamp: 25 }
];

export const TimeMapInputPanel: React.FC<TimeMapInputPanelProps> = ({ onSelectSequence }) => {
  return (
    <div className="bg-slate-900/60 border border-slate-800 rounded-xl p-2.5 flex items-center justify-between shrink-0">
      <div className="flex items-center gap-2">
        <span className="text-[10px] uppercase font-mono font-bold tracking-wider text-slate-400">
          TimeMap Sequence:
        </span>
        <span className="text-xs text-slate-400">Choose a test execution workload:</span>
      </div>

      <div className="flex items-center gap-1.5">
        <button
          onClick={() => onSelectSequence(PRESET_STANDARD)}
          className="text-[11px] px-3 py-1 rounded-lg bg-indigo-500/20 hover:bg-indigo-500/30 border border-indigo-500/40 text-indigo-300 font-semibold transition-colors flex items-center gap-1"
        >
          <Sparkles className="w-3 h-3" /> Standard ["foo"]
        </button>
        <button
          onClick={() => onSelectSequence(PRESET_MULTIPLE_TIMESTAMPS)}
          className="text-[11px] px-3 py-1 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 font-medium transition-colors"
        >
          Multi-Timestamps ["love"]
        </button>
      </div>
    </div>
  );
};
