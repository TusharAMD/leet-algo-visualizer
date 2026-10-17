import React, { useState } from 'react';
import { Play, RotateCcw } from 'lucide-react';
import type { Point } from '../../algorithms/detectSquaresIntuitive';

interface DetectSquaresInputPanelProps {
  initialPoints: Point[];
  initialQuery: Point;
  onApply: (points: Point[], query: Point) => void;
}

export const DetectSquaresInputPanel: React.FC<DetectSquaresInputPanelProps> = ({
  initialPoints,
  initialQuery,
  onApply,
}) => {
  const [pointsStr, setPointsStr] = useState<string>(
    JSON.stringify(initialPoints)
  );
  const [queryStr, setQueryStr] = useState<string>(
    JSON.stringify(initialQuery)
  );

  const presets = [
    {
      label: 'LeetCode Ex: [[3,10],[11,2],[3,2]], [11,10]',
      points: [
        [3, 10],
        [11, 2],
        [3, 2],
      ] as Point[],
      query: [11, 10] as Point,
    },
    {
      label: 'Multiple: [[1,1],[1,3],[3,1],[3,3],[1,1]], [1,3]',
      points: [
        [1, 1],
        [1, 3],
        [3, 1],
        [3, 3],
        [1, 1],
      ] as Point[],
      query: [1, 3] as Point,
    },
    {
      label: 'Zero Matches: [[1,2],[3,4]], [5,6]',
      points: [
        [1, 2],
        [3, 4],
      ] as Point[],
      query: [5, 6] as Point,
    },
  ];

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const parsedPoints = JSON.parse(pointsStr);
      const parsedQuery = JSON.parse(queryStr);
      if (
        Array.isArray(parsedPoints) &&
        Array.isArray(parsedQuery) &&
        parsedQuery.length === 2
      ) {
        onApply(parsedPoints, [parsedQuery[0], parsedQuery[1]]);
      }
    } catch {
      // ignore
    }
  };

  return (
    <div className="bg-slate-900 border border-slate-800 rounded-xl p-4 flex flex-col gap-4">
      <div className="flex items-center justify-between">
        <h3 className="text-sm font-semibold text-slate-200">Point Stream & Query</h3>
        <span className="text-xs text-slate-400">Detect Squares</span>
      </div>

      <form onSubmit={handleSubmit} className="grid grid-cols-1 md:grid-cols-12 gap-3">
        <div className="md:col-span-8">
          <label className="text-xs text-slate-400 mb-1 block">Points [[x, y], ...]</label>
          <input
            type="text"
            value={pointsStr}
            onChange={(e) => setPointsStr(e.target.value)}
            className="w-full bg-slate-950 border border-slate-700 rounded-lg px-3 py-2 text-sm text-slate-100 font-mono focus:outline-none focus:border-indigo-500"
            placeholder="[[3,10],[11,2],[3,2]]"
          />
        </div>

        <div className="md:col-span-4">
          <label className="text-xs text-slate-400 mb-1 block">Query Point [x, y]</label>
          <input
            type="text"
            value={queryStr}
            onChange={(e) => setQueryStr(e.target.value)}
            className="w-full bg-slate-950 border border-slate-700 rounded-lg px-3 py-2 text-sm text-slate-100 font-mono focus:outline-none focus:border-indigo-500"
            placeholder="[11, 10]"
          />
        </div>

        <div className="md:col-span-12 flex gap-2">
          <button
            type="submit"
            className="flex-1 flex items-center justify-center gap-2 bg-indigo-600 hover:bg-indigo-500 text-white font-medium py-2 px-4 rounded-lg text-sm transition"
          >
            <Play className="w-4 h-4" />
            Apply Points & Query
          </button>
          <button
            type="button"
            onClick={() => {
              setPointsStr(JSON.stringify(initialPoints));
              setQueryStr(JSON.stringify(initialQuery));
              onApply(initialPoints, initialQuery);
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
                setPointsStr(JSON.stringify(preset.points));
                setQueryStr(JSON.stringify(preset.query));
                onApply(preset.points, preset.query);
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
