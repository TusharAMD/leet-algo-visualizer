import React, { useState } from 'react';
import { Play, RotateCcw } from 'lucide-react';

interface MergeTripletsInputPanelProps {
  initialTriplets: [number, number, number][];
  initialTarget: [number, number, number];
  onApply: (
    triplets: [number, number, number][],
    target: [number, number, number]
  ) => void;
}

export const MergeTripletsInputPanel: React.FC<MergeTripletsInputPanelProps> = ({
  initialTriplets,
  initialTarget,
  onApply,
}) => {
  const [tripletsText, setTripletsText] = useState<string>(
    initialTriplets.map((t) => t.join(', ')).join('\n')
  );
  const [targetStr, setTargetStr] = useState<string>(initialTarget.join(', '));

  const presets = [
    {
      label: 'True: [[2,5,3],[1,8,4],[1,7,5]], target=[2,7,5]',
      triplets: [
        [2, 5, 3],
        [1, 8, 4],
        [1, 7, 5],
      ] as [number, number, number][],
      target: [2, 7, 5] as [number, number, number],
    },
    {
      label: 'False: [[3,4,5],[4,5,6]], target=[3,2,5]',
      triplets: [
        [3, 4, 5],
        [4, 5, 6],
      ] as [number, number, number][],
      target: [3, 2, 5] as [number, number, number],
    },
    {
      label: 'True: [[2,5,3],[2,3,4],[1,2,5],[5,2,3]], target=[5,5,5]',
      triplets: [
        [2, 5, 3],
        [2, 3, 4],
        [1, 2, 5],
        [5, 2, 3],
      ] as [number, number, number][],
      target: [5, 5, 5] as [number, number, number],
    },
  ];

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const parsedTriplets = tripletsText
        .trim()
        .split('\n')
        .map((line) =>
          line
            .split(',')
            .map((x) => parseInt(x.trim(), 10))
            .filter((x) => !isNaN(x))
        )
        .filter((r) => r.length === 3) as [number, number, number][];

      const parsedTarget = targetStr
        .split(',')
        .map((x) => parseInt(x.trim(), 10))
        .filter((x) => !isNaN(x));

      if (parsedTriplets.length > 0 && parsedTarget.length === 3) {
        onApply(parsedTriplets, parsedTarget as [number, number, number]);
      }
    } catch {}
  };

  return (
    <div className="bg-slate-900 border border-slate-800 rounded-xl p-4 flex flex-col gap-4">
      <div className="flex items-center justify-between">
        <h3 className="text-sm font-semibold text-slate-200">Input Configuration</h3>
        <span className="text-xs text-slate-400">Merge Triplets</span>
      </div>

      <form onSubmit={handleSubmit} className="flex flex-col gap-3">
        <div>
          <label className="text-xs text-slate-400 mb-1 block">
            Triplets (1 triplet per line, comma-separated)
          </label>
          <textarea
            rows={3}
            value={tripletsText}
            onChange={(e) => setTripletsText(e.target.value)}
            className="w-full bg-slate-950 border border-slate-700 rounded-lg px-3 py-2 text-sm text-slate-100 font-mono focus:outline-none focus:border-indigo-500"
          />
        </div>

        <div>
          <label className="text-xs text-slate-400 mb-1 block">Target Triplet (3 numbers)</label>
          <input
            type="text"
            value={targetStr}
            onChange={(e) => setTargetStr(e.target.value)}
            className="w-full bg-slate-950 border border-slate-700 rounded-lg px-3 py-2 text-sm text-slate-100 font-mono focus:outline-none focus:border-indigo-500"
            placeholder="e.g. 2, 7, 5"
          />
        </div>

        <button
          type="submit"
          className="flex items-center justify-center gap-2 bg-indigo-600 hover:bg-indigo-500 text-white rounded-lg py-2 text-sm font-medium transition-colors"
        >
          <Play className="w-4 h-4" /> Apply & Run
        </button>
      </form>

      {/* Presets */}
      <div>
        <span className="text-xs text-slate-400 mb-2 block font-medium">Quick Presets</span>
        <div className="flex flex-wrap gap-1.5">
          {presets.map((p, idx) => (
            <button
              key={idx}
              onClick={() => {
                setTripletsText(p.triplets.map((t) => t.join(', ')).join('\n'));
                setTargetStr(p.target.join(', '));
                onApply(p.triplets, p.target);
              }}
              className="px-2.5 py-1 text-xs rounded bg-slate-800 hover:bg-slate-700 text-slate-300 border border-slate-700 transition-colors"
            >
              {p.label}
            </button>
          ))}
          <button
            onClick={() => {
              setTripletsText(initialTriplets.map((t) => t.join(', ')).join('\n'));
              setTargetStr(initialTarget.join(', '));
              onApply(initialTriplets, initialTarget);
            }}
            className="px-2.5 py-1 text-xs rounded bg-slate-800 hover:bg-slate-700 text-slate-400 border border-slate-700 flex items-center gap-1"
          >
            <RotateCcw className="w-3 h-3" /> Reset
          </button>
        </div>
      </div>
    </div>
  );
};
