import React, { useState } from 'react';
import { Play, RotateCcw } from 'lucide-react';

interface WordBreakInputPanelProps {
  initialString: string;
  initialDict: string[];
  onApply: (s: string, dict: string[]) => void;
}

export const WordBreakInputPanel: React.FC<WordBreakInputPanelProps> = ({
  initialString,
  initialDict,
  onApply,
}) => {
  const [s, setS] = useState(initialString);
  const [dictStr, setDictStr] = useState(initialDict.join(', '));

  const presets = [
    {
      label: 'leetcode ["leet", "code"]',
      s: 'leetcode',
      dict: ['leet', 'code'],
    },
    {
      label: 'applepenapple ["apple", "pen"]',
      s: 'applepenapple',
      dict: ['apple', 'pen'],
    },
    {
      label: 'catsandog ["cats", "dog", "sand", "and", "cat"]',
      s: 'catsandog',
      dict: ['cats', 'dog', 'sand', 'and', 'cat'],
    },
    {
      label: 'bb ["a", "b", "bbb", "bbbb"]',
      s: 'bb',
      dict: ['a', 'b', 'bbb', 'bbbb'],
    },
  ];

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const words = dictStr
      .split(',')
      .map((w) => w.trim())
      .filter((w) => w.length > 0);

    if (s.trim().length > 0 && words.length > 0) {
      onApply(s.trim(), words);
    }
  };

  return (
    <div className="bg-slate-900 border border-slate-800 rounded-xl p-4 flex flex-col gap-4">
      <div className="flex items-center justify-between">
        <h3 className="text-sm font-semibold text-slate-200">Input Configuration</h3>
        <span className="text-xs text-slate-400">Word Break</span>
      </div>

      <form onSubmit={handleSubmit} className="flex flex-col gap-3">
        <div>
          <label className="text-xs text-slate-400 mb-1 block">Target String s</label>
          <input
            type="text"
            value={s}
            maxLength={18}
            onChange={(e) => setS(e.target.value)}
            className="w-full bg-slate-950 border border-slate-700 rounded-lg px-3 py-2 text-sm text-slate-100 font-mono focus:outline-none focus:border-indigo-500"
            placeholder="e.g. leetcode"
          />
        </div>

        <div>
          <label className="text-xs text-slate-400 mb-1 block">Dictionary Words (comma separated)</label>
          <input
            type="text"
            value={dictStr}
            onChange={(e) => setDictStr(e.target.value)}
            className="w-full bg-slate-950 border border-slate-700 rounded-lg px-3 py-2 text-sm text-slate-100 font-mono focus:outline-none focus:border-indigo-500"
            placeholder="e.g. leet, code"
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
                setS(p.s);
                setDictStr(p.dict.join(', '));
                onApply(p.s, p.dict);
              }}
              className="px-2.5 py-1 text-xs rounded bg-slate-800 hover:bg-slate-700 text-slate-300 border border-slate-700 transition-colors"
            >
              {p.label}
            </button>
          ))}
          <button
            onClick={() => {
              setS(initialString);
              setDictStr(initialDict.join(', '));
              onApply(initialString, initialDict);
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
