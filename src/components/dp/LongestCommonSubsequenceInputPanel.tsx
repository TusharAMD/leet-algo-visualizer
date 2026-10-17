import React, { useState } from 'react';
import { Play, RotateCcw } from 'lucide-react';

interface LongestCommonSubsequenceInputPanelProps {
  initialText1: string;
  initialText2: string;
  onApply: (text1: string, text2: string) => void;
}

export const LongestCommonSubsequenceInputPanel: React.FC<LongestCommonSubsequenceInputPanelProps> = ({
  initialText1,
  initialText2,
  onApply,
}) => {
  const [text1, setText1] = useState<string>(initialText1);
  const [text2, setText2] = useState<string>(initialText2);

  const presets = [
    { label: '"abcde" & "ace"', t1: 'abcde', t2: 'ace' },
    { label: '"abc" & "abc"', t1: 'abc', t2: 'abc' },
    { label: '"abc" & "def"', t1: 'abc', t2: 'def' },
    { label: '"oxcp" & "actp"', t1: 'oxcp', t2: 'actp' },
    { label: '"aggtab" & "gxtxayb"', t1: 'aggtab', t2: 'gxtxayb' },
  ];

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (text1.trim().length > 0 && text2.trim().length > 0) {
      onApply(text1.trim(), text2.trim());
    }
  };

  return (
    <div className="bg-slate-900 border border-slate-800 rounded-xl p-4 flex flex-col gap-4">
      <div className="flex items-center justify-between">
        <h3 className="text-sm font-semibold text-slate-200">Strings Input</h3>
        <span className="text-xs text-slate-400">Longest Common Subsequence</span>
      </div>

      <form onSubmit={handleSubmit} className="flex flex-col gap-3">
        <div className="grid grid-cols-2 gap-3">
          <div>
            <label className="text-xs text-slate-400 mb-1 block">Text 1 (max 8 chars)</label>
            <input
              type="text"
              maxLength={8}
              value={text1}
              onChange={(e) => setText1(e.target.value)}
              className="w-full bg-slate-950 border border-slate-700 rounded-lg px-3 py-2 text-sm text-slate-100 font-mono focus:outline-none focus:border-indigo-500"
            />
          </div>
          <div>
            <label className="text-xs text-slate-400 mb-1 block">Text 2 (max 8 chars)</label>
            <input
              type="text"
              maxLength={8}
              value={text2}
              onChange={(e) => setText2(e.target.value)}
              className="w-full bg-slate-950 border border-slate-700 rounded-lg px-3 py-2 text-sm text-slate-100 font-mono focus:outline-none focus:border-indigo-500"
            />
          </div>
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
                setText1(p.t1);
                setText2(p.t2);
                onApply(p.t1, p.t2);
              }}
              className="px-2.5 py-1 text-xs rounded bg-slate-800 hover:bg-slate-700 text-slate-300 border border-slate-700 transition-colors"
            >
              {p.label}
            </button>
          ))}
          <button
            onClick={() => {
              setText1(initialText1);
              setText2(initialText2);
              onApply(initialText1, initialText2);
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
