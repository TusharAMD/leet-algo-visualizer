import React, { useState } from 'react';
import { Play, RotateCcw } from 'lucide-react';
import type { Interval } from '../../algorithms/insertIntervalIntuitive';

interface InsertIntervalInputPanelProps {
  initialIntervals: Interval[];
  initialNewInterval: Interval;
  onApply: (intervals: Interval[], newInterval: Interval) => void;
}

export const InsertIntervalInputPanel: React.FC<InsertIntervalInputPanelProps> = ({
  initialIntervals,
  initialNewInterval,
  onApply,
}) => {
  const [intervalsStr, setIntervalsStr] = useState<string>(
    JSON.stringify(initialIntervals)
  );
  const [newIntervalStr, setNewIntervalStr] = useState<string>(
    JSON.stringify(initialNewInterval)
  );

  const presets = [
    {
      label: 'Ex 1: [[1,3],[6,9]], [2,5]',
      intervals: [[1, 3], [6, 9]] as Interval[],
      newInterval: [2, 5] as Interval,
    },
    {
      label: 'Ex 2: [[1,2],[3,5],[6,7],[8,10],[12,16]], [4,8]',
      intervals: [
        [1, 2],
        [3, 5],
        [6, 7],
        [8, 10],
        [12, 16],
      ] as Interval[],
      newInterval: [4, 8] as Interval,
    },
    {
      label: 'Prepend: [[3,5],[6,8]], [1,2]',
      intervals: [[3, 5], [6, 8]] as Interval[],
      newInterval: [1, 2] as Interval,
    },
    {
      label: 'Append: [[1,2],[3,5]], [6,8]',
      intervals: [[1, 2], [3, 5]] as Interval[],
      newInterval: [6, 8] as Interval,
    },
    {
      label: 'Merge All: [[1,3],[4,6],[8,10]], [0,12]',
      intervals: [[1, 3], [4, 6], [8, 10]] as Interval[],
      newInterval: [0, 12] as Interval,
    },
  ];

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const parsedIntervals = JSON.parse(intervalsStr);
      const parsedNew = JSON.parse(newIntervalStr);

      if (
        Array.isArray(parsedIntervals) &&
        Array.isArray(parsedNew) &&
        parsedNew.length === 2 &&
        typeof parsedNew[0] === 'number' &&
        typeof parsedNew[1] === 'number' &&
        parsedNew[0] <= parsedNew[1]
      ) {
        const validated: Interval[] = [];
        for (const item of parsedIntervals) {
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
        validated.sort((a, b) => a[0] - b[0]);
        onApply(validated, [parsedNew[0], parsedNew[1]]);
      }
    } catch {
      // ignore parse error
    }
  };

  return (
    <div className="bg-slate-900 border border-slate-800 rounded-xl p-4 flex flex-col gap-4">
      <div className="flex items-center justify-between">
        <h3 className="text-sm font-semibold text-slate-200">Intervals Configuration</h3>
        <span className="text-xs text-slate-400">Insert Interval</span>
      </div>

      <form onSubmit={handleSubmit} className="grid grid-cols-1 md:grid-cols-12 gap-3">
        <div className="md:col-span-8">
          <label className="text-xs text-slate-400 mb-1 block">Intervals JSON</label>
          <input
            type="text"
            value={intervalsStr}
            onChange={(e) => setIntervalsStr(e.target.value)}
            className="w-full bg-slate-950 border border-slate-700 rounded-lg px-3 py-2 text-sm text-slate-100 font-mono focus:outline-none focus:border-indigo-500"
            placeholder="[[1,3],[6,9]]"
          />
        </div>

        <div className="md:col-span-4">
          <label className="text-xs text-slate-400 mb-1 block">New Interval [start, end]</label>
          <input
            type="text"
            value={newIntervalStr}
            onChange={(e) => setNewIntervalStr(e.target.value)}
            className="w-full bg-slate-950 border border-slate-700 rounded-lg px-3 py-2 text-sm text-slate-100 font-mono focus:outline-none focus:border-indigo-500"
            placeholder="[2,5]"
          />
        </div>

        <div className="md:col-span-12 flex gap-2">
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
              setNewIntervalStr(JSON.stringify(initialNewInterval));
              onApply(initialIntervals, initialNewInterval);
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
                setNewIntervalStr(JSON.stringify(preset.newInterval));
                onApply(preset.intervals, preset.newInterval);
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
