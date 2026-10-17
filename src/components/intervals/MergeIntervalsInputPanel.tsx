import React, { useState } from 'react';
import { Play, RotateCcw } from 'lucide-react';
import type { Interval } from '../../algorithms/mergeIntervalsIntuitive';

interface MergeIntervalsInputPanelProps {
  initialIntervals: Interval[];
  onApply: (intervals: Interval[]) => void;
}

export const MergeIntervalsInputPanel: React.FC<MergeIntervalsInputPanelProps> = ({
  initialIntervals,
  onApply,
}) => {
  const [intervalsStr, setIntervalsStr] = useState<string>(
    JSON.stringify(initialIntervals)
  );

  const presets = [
    {
      label: 'Standard: [[1,3],[2,6],[8,10],[15,18]]',
      intervals: [
        [1, 3],
        [2, 6],
        [8, 10],
        [15, 18],
      ] as Interval[],
    },
    {
      label: 'Touching: [[1,4],[4,5]]',
      intervals: [
        [1, 4],
        [4, 5],
      ] as Interval[],
    },
    {
      label: 'Nested: [[1,4],[2,3]]',
      intervals: [
        [1, 4],
        [2, 3],
      ] as Interval[],
    },
    {
      label: 'Chain: [[1,4],[0,2],[3,5]]',
      intervals: [
        [1, 4],
        [0, 2],
        [3, 5],
      ] as Interval[],
    },
    {
      label: 'All Disjoint: [[1,2],[3,4],[5,6]]',
      intervals: [
        [1, 2],
        [3, 4],
        [5, 6],
      ] as Interval[],
    },
  ];

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const parsed = JSON.parse(intervalsStr);
      if (Array.isArray(parsed)) {
        const validated: Interval[] = [];
        for (const item of parsed) {
          if (
            Array.isArray(item) &&
            item.length === 2 &&
            typeof item[0] === 'number' &&
            typeof item[1] === 'number' &&
            item[0] <= item[1]
          ) {
            validated.push([item[0], item[1]]);
          }
        }
        if (validated.length > 0) {
          onApply(validated);
        }
      }
    } catch {
      // ignore
    }
  };

  return (
    <div className="bg-slate-900 border border-slate-800 rounded-xl p-4 flex flex-col gap-4">
      <div className="flex items-center justify-between">
        <h3 className="text-sm font-semibold text-slate-200">Intervals Configuration</h3>
        <span className="text-xs text-slate-400">Merge Intervals</span>
      </div>

      <form onSubmit={handleSubmit} className="flex flex-col gap-3">
        <div>
          <label className="text-xs text-slate-400 mb-1 block">Intervals JSON</label>
          <input
            type="text"
            value={intervalsStr}
            onChange={(e) => setIntervalsStr(e.target.value)}
            className="w-full bg-slate-950 border border-slate-700 rounded-lg px-3 py-2 text-sm text-slate-100 font-mono focus:outline-none focus:border-indigo-500"
            placeholder="[[1,3],[2,6],[8,10],[15,18]]"
          />
        </div>

        <div className="flex gap-2">
          <button
            type="submit"
            className="flex-1 flex items-center justify-center gap-2 bg-indigo-600 hover:bg-indigo-500 text-white font-medium py-2 px-4 rounded-lg text-sm transition"
          >
            <Play className="w-4 h-4" />
            Apply Input
          </button>
          <button
            type="button"
            onClick={() => {
              setIntervalsStr(JSON.stringify(initialIntervals));
              onApply(initialIntervals);
            }}
            className="flex items-center justify-center bg-slate-800 hover:bg-slate-700 text-slate-300 py-2 px-3 rounded-lg text-sm transition"
            title="Reset to default"
          >
            <RotateCcw className="w-4 h-4" />
          </button>
        </div>
      </form>

      <div className="flex flex-col gap-1.5 pt-2 border-t border-slate-800/80">
        <span className="text-xs text-slate-400 font-medium">Presets:</span>
        <div className="flex flex-wrap gap-1.5">
          {presets.map((preset, idx) => (
            <button
              key={idx}
              onClick={() => {
                setIntervalsStr(JSON.stringify(preset.intervals));
                onApply(preset.intervals);
              }}
              className="text-xs bg-slate-800 hover:bg-slate-700 text-slate-300 px-2.5 py-1 rounded-md transition border border-slate-700/60 font-mono"
            >
              {preset.label}
            </button>
          ))}
        </div>
      </div>
    </div>
  );
};
