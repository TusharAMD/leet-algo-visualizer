import React, { useState } from 'react';
import { Play, RotateCcw } from 'lucide-react';

interface InterleavingStringInputPanelProps {
  initialS1: string;
  initialS2: string;
  initialS3: string;
  onApply: (s1: string, s2: string, s3: string) => void;
}

export const InterleavingStringInputPanel: React.FC<InterleavingStringInputPanelProps> = ({
  initialS1,
  initialS2,
  initialS3,
  onApply,
}) => {
  const [s1, setS1] = useState<string>(initialS1);
  const [s2, setS2] = useState<string>(initialS2);
  const [s3, setS3] = useState<string>(initialS3);

  const presets = [
    {
      label: 'True: "aabcc", "dbbca" -> "aadbbcbcac"',
      s1: 'aabcc',
      s2: 'dbbca',
      s3: 'aadbbcbcac',
    },
    {
      label: 'False: "aabcc", "dbbca" -> "aadbbbaccc"',
      s1: 'aabcc',
      s2: 'dbbca',
      s3: 'aadbbbaccc',
    },
    {
      label: 'Simple: "a", "b" -> "ab"',
      s1: 'a',
      s2: 'b',
      s3: 'ab',
    },
    {
      label: 'Empty strings: "", "" -> ""',
      s1: '',
      s2: '',
      s3: '',
    },
  ];

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onApply(s1.trim(), s2.trim(), s3.trim());
  };

  return (
    <div className="bg-slate-900 border border-slate-800 rounded-xl p-4 flex flex-col gap-4">
      <div className="flex items-center justify-between">
        <h3 className="text-sm font-semibold text-slate-200">Input Strings</h3>
        <span className="text-xs text-slate-400">Interleaving String</span>
      </div>

      <form onSubmit={handleSubmit} className="flex flex-col gap-3">
        <div className="grid grid-cols-2 gap-3">
          <div>
            <label className="text-xs text-slate-400 mb-1 block">s1 (max 7 chars)</label>
            <input
              type="text"
              maxLength={7}
              value={s1}
              onChange={(e) => setS1(e.target.value)}
              className="w-full bg-slate-950 border border-slate-700 rounded-lg px-3 py-2 text-sm text-slate-100 font-mono focus:outline-none focus:border-indigo-500"
            />
          </div>
          <div>
            <label className="text-xs text-slate-400 mb-1 block">s2 (max 7 chars)</label>
            <input
              type="text"
              maxLength={7}
              value={s2}
              onChange={(e) => setS2(e.target.value)}
              className="w-full bg-slate-950 border border-slate-700 rounded-lg px-3 py-2 text-sm text-slate-100 font-mono focus:outline-none focus:border-indigo-500"
            />
          </div>
        </div>

        <div>
          <label className="text-xs text-slate-400 mb-1 block">s3 Target (len = len(s1)+len(s2))</label>
          <input
            type="text"
            maxLength={14}
            value={s3}
            onChange={(e) => setS3(e.target.value)}
            className="w-full bg-slate-950 border border-slate-700 rounded-lg px-3 py-2 text-sm text-slate-100 font-mono focus:outline-none focus:border-indigo-500"
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
                setS1(p.s1);
                setS2(p.s2);
                setS3(p.s3);
                onApply(p.s1, p.s2, p.s3);
              }}
              className="px-2.5 py-1 text-xs rounded bg-slate-800 hover:bg-slate-700 text-slate-300 border border-slate-700 transition-colors"
            >
              {p.label}
            </button>
          ))}
          <button
            onClick={() => {
              setS1(initialS1);
              setS2(initialS2);
              setS3(initialS3);
              onApply(initialS1, initialS2, initialS3);
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
