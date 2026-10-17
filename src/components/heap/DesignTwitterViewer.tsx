import React from 'react';
import { DesignTwitterStep } from '../../algorithms/designTwitterIntuitive';
import { MessageCircle, CheckCircle2, Users, MessageSquare, Layers, Send, UserPlus, UserMinus } from 'lucide-react';

interface DesignTwitterViewerProps {
  step: DesignTwitterStep;
}

export const DesignTwitterViewer: React.FC<DesignTwitterViewerProps> = ({ step }) => {
  const {
    currentAction,
    tweetMap,
    followMap,
    heap,
    feedResult,
    headline,
    subtext,
    isComplete,
    stepIndex,
    totalSteps
  } = step;

  const userIds = Array.from(
    new Set([
      ...Object.keys(tweetMap).map((k) => parseInt(k, 10)),
      ...Object.keys(followMap).map((k) => parseInt(k, 10)),
      1,
      2
    ])
  ).sort((a, b) => a - b);

  return (
    <div className="flex-1 min-h-0 flex flex-col bg-slate-900/60 border border-slate-800 rounded-2xl p-3 shadow-xl overflow-hidden justify-between">
      {/* Top Banner */}
      <div className="bg-slate-950/70 border border-slate-800/80 rounded-xl p-2.5 flex items-center justify-between shrink-0">
        <div className="flex items-center gap-2">
          <span className="p-1.5 rounded-lg bg-sky-500/10 text-sky-400 border border-sky-500/20">
            <MessageCircle className="w-4 h-4" />
          </span>
          <div>
            <h3 className="text-xs font-semibold text-white tracking-wide">{headline}</h3>
            <p className="text-[11px] text-slate-400">{subtext}</p>
          </div>
        </div>
        <div className="flex items-center gap-2">
          {isComplete ? (
            <span className="px-2 py-0.5 rounded-md bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 text-[11px] font-semibold flex items-center gap-1">
              <CheckCircle2 className="w-3.5 h-3.5" /> Simulation Finished
            </span>
          ) : (
            <span className="px-2 py-0.5 rounded-md bg-sky-500/10 border border-sky-500/20 text-sky-400 text-[11px] font-mono">
              Step {stepIndex + 1} / {totalSteps}
            </span>
          )}
        </div>
      </div>

      {/* Main Area: Newsfeed & Heap vs User State */}
      <div className="flex-1 min-h-0 grid grid-cols-1 md:grid-cols-12 gap-3 py-1 px-1">
        {/* Left: Active Feed & Min-Heap */}
        <div className="md:col-span-7 flex flex-col gap-2 min-h-0 justify-between">
          {/* News Feed Stream Card */}
          <div className="bg-slate-950/60 border border-slate-800 rounded-xl p-2.5 shrink-0 flex flex-col gap-1.5">
            <div className="flex items-center justify-between">
              <span className="text-xs font-semibold text-slate-300 flex items-center gap-1.5">
                <MessageSquare className="w-3.5 h-3.5 text-sky-400" />
                Aggregated News Feed
              </span>
              <span className="text-[10px] font-mono text-slate-400">
                {feedResult.length} / 10 tweets
              </span>
            </div>

            <div className="flex items-center gap-2 overflow-x-auto min-h-[46px] py-1">
              {feedResult.length === 0 ? (
                <span className="text-slate-600 text-xs italic">
                  Feed is empty or awaiting getNewsFeed() call
                </span>
              ) : (
                feedResult.map((tid, idx) => (
                  <div
                    key={idx}
                    className="flex flex-col items-center shrink-0 px-2.5 py-1 rounded-xl bg-sky-500/10 border border-sky-500/30 shadow-md"
                  >
                    <span className="text-[9px] text-sky-400 font-mono">#{idx + 1}</span>
                    <span className="text-sm font-mono font-bold text-sky-200">Tweet {tid}</span>
                  </div>
                ))
              )}
            </div>
          </div>

          {/* Heap Priority Merge Area */}
          <div className="flex-1 bg-slate-950/60 border border-slate-800 rounded-xl p-2.5 flex flex-col justify-between overflow-hidden">
            <div className="flex items-center justify-between border-b border-slate-800/70 pb-1 shrink-0">
              <span className="text-xs font-semibold text-slate-300 flex items-center gap-1.5">
                <Layers className="w-3.5 h-3.5 text-amber-400" />
                Newsfeed Min-Heap (K-Way Merge)
              </span>
              <span className="text-[10px] font-mono text-slate-400 bg-slate-900 px-1.5 py-0.5 rounded border border-slate-800">
                Candidates: {heap.length}
              </span>
            </div>

            <div className="flex-1 flex items-center justify-center gap-2 flex-wrap py-2">
              {heap.length === 0 ? (
                <span className="text-slate-600 text-xs italic">
                  Heap inactive (used during feed queries)
                </span>
              ) : (
                heap.map((item, idx) => {
                  const isTop = idx === 0;
                  return (
                    <div
                      key={idx}
                      className={`relative flex flex-col items-center justify-center p-2 rounded-xl border transition-all ${
                        isTop
                          ? 'bg-amber-500/20 border-amber-400 ring-2 ring-amber-400/50 scale-105'
                          : 'bg-slate-900 border-slate-800'
                      }`}
                    >
                      {isTop && (
                        <span className="absolute -top-2 left-1/2 -translate-x-1/2 text-[8px] bg-amber-500 text-slate-950 font-bold px-1 rounded-full">
                          NEWEST
                        </span>
                      )}
                      <span className="text-xs font-mono font-bold text-white">
                        Tweet {item.tweetId}
                      </span>
                      <span className="text-[9px] font-mono text-slate-400">
                        User {item.followeeId}
                      </span>
                    </div>
                  );
                })
              )}
            </div>

            <div className="text-[10px] text-slate-500 bg-slate-900/80 rounded-lg p-1.5 border border-slate-800/60 text-center shrink-0">
              Each followee contributes their latest tweet. Popping yields newest tweet, then fetches the followee's next older tweet.
            </div>
          </div>
        </div>

        {/* Right: User Network & Posts State */}
        <div className="md:col-span-5 bg-slate-950/60 border border-slate-800 rounded-xl p-2.5 flex flex-col justify-between overflow-hidden">
          <div className="flex items-center justify-between border-b border-slate-800/70 pb-1.5 shrink-0">
            <span className="text-xs font-semibold text-slate-300 flex items-center gap-1.5">
              <Users className="w-3.5 h-3.5 text-indigo-400" />
              Users & Social Graph
            </span>
          </div>

          <div className="flex-1 overflow-y-auto py-2 flex flex-col gap-2">
            {userIds.map((uid) => {
              const tweets = tweetMap[uid] || [];
              const follows = followMap[uid] || [];
              return (
                <div
                  key={uid}
                  className="bg-slate-900/80 border border-slate-800/80 rounded-xl p-2 flex flex-col gap-1"
                >
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-bold font-mono text-indigo-300">
                      User {uid}
                    </span>
                    <span className="text-[10px] text-slate-500">
                      Follows: {follows.length > 0 ? follows.join(', ') : 'None'}
                    </span>
                  </div>

                  <div className="text-[10px] text-slate-400">
                    Tweets: {tweets.length === 0 ? (
                      <span className="italic text-slate-600">No tweets</span>
                    ) : (
                      <span className="font-mono text-slate-200">
                        {tweets.map((t) => `#${t.tweetId}`).join(', ')}
                      </span>
                    )}
                  </div>
                </div>
              );
            })}
          </div>

          <div className="text-[10px] text-slate-500 bg-slate-900/80 rounded-lg p-1.5 border border-slate-800/60 text-center shrink-0">
            Twitter Graph: followMap stores directed follower-followee relationships.
          </div>
        </div>
      </div>
    </div>
  );
};
