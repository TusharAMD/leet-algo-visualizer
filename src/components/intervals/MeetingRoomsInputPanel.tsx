import React, { useState } from 'react';
import { Play, RotateCcw } from 'lucide-react';
import type { Interval } from '../../algorithms/meetingRoomsIntuitive';

interface MeetingRoomsInputPanelProps {
  initialIntervals: Interval[];
  onApply: (intervals: Interval[]) => void;
}

export const MeetingRoomsInputPanel: React.FC<MeetingRoomsInputPanelProps> = ({
  initialIntervals,
  onApply,
}) => {
  const [intervalsStr, setIntervalsStr] = useState<string>(
    JSON.stringify(initialIntervals)
  );

  const presets = [
    {
      label: 'Conflict: [[0,30],[5,10],[15,20]]',
      intervals: [
        [0, 30],
        [5, 10],
        [15, 20],
      ] as Interval[],
    },
    {
      label: 'Feasible: [[7,10],[2,4]]',
      intervals: [
        [7, 10],
        [2, 4],
      ] as Interval[],
    },
    {
      label: 'Back-to-back: [[1,3],[3,5],[5,8]]',
      intervals: [
        [1, 3],
        [3, 5],
        [5, 8],
      ] as Interval[],
    },
    {
      label: 'Enclosed: [[1,10],[2,5]]',
      intervals: [
        [1, 10],
        [2, 5],
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
        <h3 className="text-sm font-semibold text-slate-200">Meeting Schedule</h3>
        <span className="text-xs text-slate-400">Meeting Rooms</span>
      </div>

      <form onSubmit={handleSubmit} className="flex flex-col gap-3">
        <div>
          <label className="text-xs text-slate-400 mb-1 block">Meetings JSON [[start, end], ...]</label>
          <input
            type="text"
            value={intervalsStr}
            onChange={(e) => setIntervalsStr(e.target.value)}
            className="w-full bg-slate-950 border border-slate-700 rounded-lg px-3 py-2 text-sm text-slate-100 font-mono focus:outline-none focus:border-indigo-500"
            placeholder="[[0,30],[5,10],[15,20]]"
          />
        </div>

        <div className="flex gap-2">
          <button
            type="submit"
            className="flex-1 flex items-center justify-center gap-2 bg-indigo-600 hover:bg-indigo-500 text-white font-medium py-2 px-4 rounded-lg text-sm transition"
          >
            <Play className="w-4 h-4" />
            Apply Schedule
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
