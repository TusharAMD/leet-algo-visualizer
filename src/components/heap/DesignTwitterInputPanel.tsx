import React from 'react';
import { Lightbulb, RotateCcw } from 'lucide-react';
import { TwitterAction } from '../../algorithms/designTwitterIntuitive';

interface DesignTwitterInputPanelProps {
  actions: TwitterAction[];
  setActions: (actions: TwitterAction[]) => void;
  onResetToDefaults: () => void;
}

export const DesignTwitterInputPanel: React.FC<DesignTwitterInputPanelProps> = ({
  actions,
  setActions,
  onResetToDefaults,
}) => {
  const applyPreset1 = () => {
    // LeetCode Default Example
    setActions([
      { type: 'post', user: 1, tweetId: 5 },
      { type: 'feed', user: 1 },
      { type: 'follow', user: 1, target: 2 },
      { type: 'post', user: 2, tweetId: 6 },
      { type: 'feed', user: 1 },
      { type: 'unfollow', user: 1, target: 2 },
      { type: 'feed', user: 1 }
    ]);
  };

  const applyPreset2 = () => {
    // Multi-user interleaving
    setActions([
      { type: 'post', user: 1, tweetId: 101 },
      { type: 'post', user: 2, tweetId: 201 },
      { type: 'post', user: 3, tweetId: 301 },
      { type: 'follow', user: 1, target: 2 },
      { type: 'follow', user: 1, target: 3 },
      { type: 'post', user: 2, tweetId: 202 },
      { type: 'feed', user: 1 }
    ]);
  };

  const applyPreset3 = () => {
    // Overflow > 10 tweets
    setActions([
      { type: 'post', user: 1, tweetId: 1 },
      { type: 'post', user: 1, tweetId: 2 },
      { type: 'post', user: 1, tweetId: 3 },
      { type: 'post', user: 1, tweetId: 4 },
      { type: 'post', user: 1, tweetId: 5 },
      { type: 'post', user: 1, tweetId: 6 },
      { type: 'feed', user: 1 }
    ]);
  };

  return (
    <div className="bg-slate-900/50 border border-slate-800 rounded-xl px-3 py-1.5 flex flex-wrap items-center justify-between gap-2.5 shrink-0">
      <div className="flex items-center gap-2 flex-wrap">
        <span className="text-[11px] font-semibold uppercase tracking-wider text-slate-400">
          Simulation Script:
        </span>
        <span className="px-2 py-0.5 rounded bg-slate-950 text-indigo-300 font-mono text-xs border border-slate-800">
          {actions.length} commands configured
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
          LeetCode #1 (Post, Follow, Unfollow)
        </button>
        <button
          onClick={applyPreset2}
          className="px-2 py-0.5 text-[11px] rounded bg-cyan-500/10 hover:bg-cyan-500/20 text-cyan-300 border border-cyan-500/30 transition-colors"
        >
          3 Users Network
        </button>
        <button
          onClick={applyPreset3}
          className="px-2 py-0.5 text-[11px] rounded bg-purple-500/10 hover:bg-purple-500/20 text-purple-300 border border-purple-500/30 transition-colors"
        >
          Rapid Posts
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
