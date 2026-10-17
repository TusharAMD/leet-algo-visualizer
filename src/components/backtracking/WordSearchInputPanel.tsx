import React, { useState } from 'react';
import { Lightbulb, RotateCcw } from 'lucide-react';

interface WordSearchInputPanelProps {
  board: string[][];
  setBoard: (b: string[][]) => void;
  word: string;
  setWord: (w: string) => void;
  onResetToDefaults: () => void;
}

export const WordSearchInputPanel: React.FC<WordSearchInputPanelProps> = ({
  board,
  setBoard,
  word,
  setWord,
  onResetToDefaults,
}) => {
  const [wordVal, setWordVal] = useState<string>(word);

  const applyCustomWord = () => {
    const trimmed = wordVal.trim().toUpperCase();
    if (trimmed.length >= 1) {
      setWord(trimmed);
      setWordVal(trimmed);
    }
  };

  const applyPreset1 = () => {
    setBoard([
      ['A', 'B', 'C', 'E'],
      ['S', 'F', 'C', 'S'],
      ['A', 'D', 'E', 'E']
    ]);
    setWord('ABCCED');
    setWordVal('ABCCED');
  };

  const applyPreset2 = () => {
    setBoard([
      ['A', 'B', 'C', 'E'],
      ['S', 'F', 'C', 'S'],
      ['A', 'D', 'E', 'E']
    ]);
    setWord('SEE');
    setWordVal('SEE');
  };

  const applyPreset3 = () => {
    setBoard([
      ['A', 'B', 'C', 'E'],
      ['S', 'F', 'C', 'S'],
      ['A', 'D', 'E', 'E']
    ]);
    setWord('ABCB'); // Impossible word with loop
    setWordVal('ABCB');
  };

  return (
    <div className="bg-slate-900/50 border border-slate-800 rounded-xl px-3 py-1.5 flex flex-wrap items-center justify-between gap-2.5 shrink-0">
      <div className="flex items-center gap-2.5 flex-wrap">
        <div className="flex items-center gap-1.5">
          <span className="text-[11px] font-semibold uppercase tracking-wider text-slate-400">
            Word:
          </span>
          <input
            type="text"
            value={wordVal}
            onChange={(e) => setWordVal(e.target.value)}
            onBlur={applyCustomWord}
            onKeyDown={(e) => e.key === 'Enter' && applyCustomWord()}
            placeholder="ABCCED"
            className="w-36 bg-slate-950/80 border border-slate-700/70 rounded-lg px-2.5 py-0.5 text-xs text-white font-mono focus:outline-none focus:border-indigo-500 uppercase"
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
          LC #1 "ABCCED" (True)
        </button>
        <button
          onClick={applyPreset2}
          className="px-2 py-0.5 text-[11px] rounded bg-cyan-500/10 hover:bg-cyan-500/20 text-cyan-300 border border-cyan-500/30 transition-colors"
        >
          LC #2 "SEE" (True)
        </button>
        <button
          onClick={applyPreset3}
          className="px-2 py-0.5 text-[11px] rounded bg-purple-500/10 hover:bg-purple-500/20 text-purple-300 border border-purple-500/30 transition-colors"
        >
          LC #3 "ABCB" (False)
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
