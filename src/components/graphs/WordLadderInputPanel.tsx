import React from 'react';
import { Lightbulb, RotateCcw } from 'lucide-react';

interface WordLadderInputPanelProps {
  beginWord: string;
  endWord: string;
  wordList: string[];
  setBeginWord: (w: string) => void;
  setEndWord: (w: string) => void;
  setWordList: (wl: string[]) => void;
  onResetToDefaults: () => void;
}

export const WordLadderInputPanel: React.FC<WordLadderInputPanelProps> = ({
  beginWord,
  endWord,
  wordList,
  setBeginWord,
  setEndWord,
  setWordList,
  onResetToDefaults,
}) => {
  const applyPreset1 = () => {
    setBeginWord('hit');
    setEndWord('cog');
    setWordList(['hot', 'dot', 'dog', 'lot', 'log', 'cog']);
  };

  const applyPreset2 = () => {
    setBeginWord('hit');
    setEndWord('cog');
    setWordList(['hot', 'dot', 'dog', 'lot', 'log']);
  };

  const applyPreset3 = () => {
    setBeginWord('cold');
    setEndWord('warm');
    setWordList(['cord', 'card', 'ward', 'warm']);
  };

  return (
    <div className="bg-slate-900/50 border border-slate-800 rounded-xl px-3 py-1.5 flex flex-wrap items-center justify-between gap-2.5 shrink-0">
      <div className="flex items-center gap-2 flex-wrap">
        <span className="text-[11px] font-semibold uppercase tracking-wider text-slate-400">
          Word Ladder:
        </span>
        <span className="px-2 py-0.5 rounded bg-slate-950 text-indigo-300 font-mono text-xs border border-slate-800">
          "{beginWord}" &rarr; "{endWord}" ({wordList.length} words in dict)
        </span>
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
          LC #1 ("hit" &rarr; "cog", 5)
        </button>
        <button
          onClick={applyPreset2}
          className="px-2 py-0.5 text-[11px] rounded bg-rose-500/10 hover:bg-rose-500/20 text-rose-300 border border-rose-500/30 transition-colors"
        >
          LC #2 (Target Missing: 0)
        </button>
        <button
          onClick={applyPreset3}
          className="px-2 py-0.5 text-[11px] rounded bg-emerald-500/10 hover:bg-emerald-500/20 text-emerald-300 border border-emerald-500/30 transition-colors"
        >
          "cold" &rarr; "warm"
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
