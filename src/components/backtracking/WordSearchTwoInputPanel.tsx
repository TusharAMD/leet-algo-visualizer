import React, { useState } from 'react';
import { Lightbulb, RotateCcw } from 'lucide-react';

interface WordSearchTwoInputPanelProps {
  board: string[][];
  setBoard: (b: string[][]) => void;
  words: string[];
  setWords: (w: string[]) => void;
  onResetToDefaults: () => void;
}

export const WordSearchTwoInputPanel: React.FC<WordSearchTwoInputPanelProps> = ({
  board,
  setBoard,
  words,
  setWords,
  onResetToDefaults,
}) => {
  const [wordsStr, setWordsStr] = useState<string>(words.join(', '));

  const applyCustomWords = () => {
    const parsed = wordsStr
      .split(',')
      .map((s) => s.trim().toLowerCase())
      .filter((s) => s.length > 0);

    if (parsed.length >= 1) {
      setWords(parsed);
      setWordsStr(parsed.join(', '));
    }
  };

  const applyPreset1 = () => {
    setBoard([
      ['o', 'a', 'a', 'n'],
      ['e', 't', 'a', 'e'],
      ['i', 'h', 'k', 'r'],
      ['i', 'f', 'l', 'v']
    ]);
    setWords(['oath', 'pea', 'eat', 'rain']);
    setWordsStr('oath, pea, eat, rain');
  };

  const applyPreset2 = () => {
    setBoard([
      ['a', 'b'],
      ['c', 'd']
    ]);
    setWords(['abcb', 'ab', 'ac']);
    setWordsStr('abcb, ab, ac');
  };

  const applyPreset3 = () => {
    setBoard([
      ['s', 'e', 'e'],
      ['a', 'b', 'c'],
      ['f', 'n', 'd']
    ]);
    setWords(['see', 'cab', 'sea', 'bed']);
    setWordsStr('see, cab, sea, bed');
  };

  return (
    <div className="bg-slate-900/50 border border-slate-800 rounded-xl px-3 py-1.5 flex flex-wrap items-center justify-between gap-2.5 shrink-0">
      <div className="flex items-center gap-2.5 flex-wrap">
        <div className="flex items-center gap-1.5">
          <span className="text-[11px] font-semibold uppercase tracking-wider text-slate-400">
            Target Words:
          </span>
          <input
            type="text"
            value={wordsStr}
            onChange={(e) => setWordsStr(e.target.value)}
            onBlur={applyCustomWords}
            onKeyDown={(e) => e.key === 'Enter' && applyCustomWords()}
            placeholder="oath, pea, eat, rain"
            className="w-56 bg-slate-950/80 border border-slate-700/70 rounded-lg px-2.5 py-0.5 text-xs text-white font-mono focus:outline-none focus:border-indigo-500"
          />
        </div>
      </div>

      {/* Presets */}
      <div className="flex items-center gap-1.5 text-xs">
        <span className="text-slate-500 text-[10px] font-medium flex items-center gap-1">
          <Lightbulb className="w-3 h-3 text-amber-400" /> Presets:
        </span>
        <button
          onClick={applyPreset1}
          className="px-2 py-0.5 text-[11px] rounded bg-indigo-500/10 hover:bg-indigo-500/20 text-indigo-300 border border-indigo-500/30 transition-colors"
        >
          LC #1 4x4 [oath, pea, eat, rain]
        </button>
        <button
          onClick={applyPreset2}
          className="px-2 py-0.5 text-[11px] rounded bg-cyan-500/10 hover:bg-cyan-500/20 text-cyan-300 border border-cyan-500/30 transition-colors"
        >
          2x2 [ab, ac]
        </button>
        <button
          onClick={applyPreset3}
          className="px-2 py-0.5 text-[11px] rounded bg-purple-500/10 hover:bg-purple-500/20 text-purple-300 border border-purple-500/30 transition-colors"
        >
          3x3 [see, cab, sea]
        </button>
        <button
          onClick={onResetToDefaults}
          className="p-1 rounded bg-slate-800 hover:bg-slate-700 text-slate-400 hover:text-white transition-colors ml-1"
          title="Reset Defaults"
        >
          <RotateCcw className="w-3.5 h-3.5" />
        </button>
      </div>
    </div>
  );
};
