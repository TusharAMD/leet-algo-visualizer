import React, { useState } from 'react';
import { Play, RotateCcw } from 'lucide-react';

interface PartitionLabelsInputPanelProps {
  initialS: string;
  onApply: (s: string) => void;
}

export const PartitionLabelsInputPanel: React.FC<PartitionLabelsInputPanelProps> = ({
  initialS,
  onApply,
}) => {
  const [s, setS] = useState<string>(initialS);

  const presets = [
    { label: 'Standard: ababcbacadefegdehijhklij', s: 'ababcbacadefegdehijhklij' },
    { label: 'Example 2: eccbbbbdec', s: 'eccbbbbdec' },
    { label: 'Distinct: abcdef', s: 'abcdef' },
    { label: 'Repeated: aaaaa', s: 'aaaaa' },
    { label: 'Interleaved: caedbdedda', s: 'caedbdedda' },
  ];

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const cleaned = s.trim().toLowerCase().replace(/[^a-z]/g, '');
    if (cleaned.length > 0) {
      onApply(cleaned);
    }
  };

  return (
    <div className="bg-slate-900 border border-slate-800 rounded-xl p-4 flex flex-col gap-4">
      <div className="flex items-center justify-between">
        <h3 className="text-sm font-semibold text-slate-200">Input String</h3>
        <span className="text-xs text-slate-400">Partition Labels</span>
      </div>

      <form onSubmit={handleSubmit} className="flex flex-col gap-3">
        <div>
          <label className="text-xs text-slate-400 mb-1 block">String (lowercase letters)</label>
          <input
            type="text"
            value={s}
            onChange={(e) => setS(e.target.value)}
            className="w-full bg-slate-950 border border-slate-700 rounded-lg px-3 py-2 text-sm text-slate-100 font-mono focus:outline-none focus:border-indigo-500"
            placeholder="e.g. ababcbacadefegdehijhklij"
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
              setS(initialS);
              onApply(initialS);
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
                setS(preset.s);
                onApply(preset.s);
              }}
              className="text-xs bg-slate-800 hover:bg-slate-700 text-slate-300 px-2.5 py-1 rounded-md transition border border-slate-700/60"
            >
              {preset.label}
            </button>
          ))}
        </div>
      </div>
    </div>
  );
};
