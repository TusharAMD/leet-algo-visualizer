import React from 'react';
import { GroupAnagramsStep } from '../../algorithms/groupAnagramsIntuitive';
import { Layers, CheckCircle2, FolderKey, Sparkles, ArrowRight } from 'lucide-react';

interface GroupAnagramsViewerProps {
  step: GroupAnagramsStep;
  strs: string[];
}

const BUCKET_COLORS = [
  { border: 'border-indigo-400', bg: 'bg-indigo-950/60', text: 'text-indigo-300', tag: 'bg-indigo-500/20 text-indigo-300 border-indigo-500/30' },
  { border: 'border-emerald-400', bg: 'bg-emerald-950/60', text: 'text-emerald-300', tag: 'bg-emerald-500/20 text-emerald-300 border-emerald-500/30' },
  { border: 'border-amber-400', bg: 'bg-amber-950/60', text: 'text-amber-300', tag: 'bg-amber-500/20 text-amber-300 border-amber-500/30' },
  { border: 'border-cyan-400', bg: 'bg-cyan-950/60', text: 'text-cyan-300', tag: 'bg-cyan-500/20 text-cyan-300 border-cyan-500/30' },
  { border: 'border-rose-400', bg: 'bg-rose-950/60', text: 'text-rose-300', tag: 'bg-rose-500/20 text-rose-300 border-rose-500/30' },
  { border: 'border-purple-400', bg: 'bg-purple-950/60', text: 'text-purple-300', tag: 'bg-purple-500/20 text-purple-300 border-purple-500/30' }
];

export const GroupAnagramsViewer: React.FC<GroupAnagramsViewerProps> = ({ step, strs }) => {
  const { currentIndex, currentWord, currentSignature, groups, activeGroupIndex, isComplete } = step;

  return (
    <div className="flex-1 min-h-0 flex flex-col bg-slate-900/60 border border-slate-800 rounded-2xl p-3 shadow-xl overflow-hidden justify-between">
      {/* Top Banner */}
      <div className="bg-slate-950/70 border border-slate-800/80 rounded-xl p-2.5 flex items-center justify-between shrink-0">
        <div className="flex items-center gap-2">
          <span className="p-1.5 rounded-lg bg-indigo-500/10 text-indigo-400 border border-indigo-500/20">
            <Layers className="w-4 h-4" />
          </span>
          <div>
            <h3 className="text-xs font-semibold text-white tracking-wide">{step.headline}</h3>
            <p className="text-[11px] text-slate-400">{step.subtext}</p>
          </div>
        </div>
        <div className="flex items-center gap-2">
          {isComplete ? (
            <span className="px-2 py-0.5 rounded-md bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 text-[11px] font-semibold flex items-center gap-1">
              <CheckCircle2 className="w-3.5 h-3.5" /> {groups.length} Anagram Groups
            </span>
          ) : (
            <span className="px-2 py-0.5 rounded-md bg-indigo-500/10 border border-indigo-500/20 text-indigo-400 text-[11px] font-mono">
              Step {step.stepIndex + 1} / {step.totalSteps}
            </span>
          )}
        </div>
      </div>

      {/* Main Workbench */}
      <div className="flex-1 min-h-0 flex flex-col justify-center gap-3 py-2 px-3">
        {/* Input Words Stream */}
        <div className="flex flex-col gap-1">
          <span className="text-[10px] uppercase font-mono font-bold tracking-wider text-slate-400">
            Input Words Stream:
          </span>
          <div className="flex items-center gap-2 overflow-x-auto pb-1">
            {strs.map((word, idx) => {
              const isCurrent = currentIndex === idx;
              const isProcessed = idx < currentIndex;

              return (
                <div
                  key={idx}
                  className={`px-3 py-1.5 rounded-xl border font-mono text-xs font-bold transition-all duration-300 flex items-center gap-1.5 ${
                    isCurrent
                      ? 'border-indigo-400 bg-indigo-950/90 text-white scale-110 ring-2 ring-indigo-400 shadow-lg shadow-indigo-500/20'
                      : isProcessed
                      ? 'border-slate-800 bg-slate-900/40 text-slate-500'
                      : 'border-slate-800 bg-slate-950/80 text-slate-300'
                  }`}
                >
                  <span className="text-[9px] text-slate-500">#{idx}</span>
                  <span>"{word}"</span>
                </div>
              );
            })}
          </div>
        </div>

        {/* Word to Signature Conversion Strip */}
        {currentWord !== null && currentSignature !== null && (
          <div className="bg-slate-950/60 border border-indigo-500/30 rounded-xl p-2.5 flex items-center justify-between gap-2 text-xs font-mono">
            <div className="flex items-center gap-2">
              <span className="text-slate-400">Canonical Key:</span>
              <span className="text-white font-bold">"{currentWord}"</span>
              <ArrowRight className="w-3.5 h-3.5 text-slate-500" />
              <span className="text-amber-300 font-bold px-2 py-0.5 rounded bg-amber-500/10 border border-amber-500/30">
                sorted("{currentWord}") ➔ "{currentSignature}"
              </span>
            </div>
            <span className="text-indigo-400 font-semibold">
              Hashing to Bucket key "{currentSignature}"
            </span>
          </div>
        )}

        {/* Signature Buckets Grid */}
        <div className="bg-slate-950/80 border border-slate-800/80 rounded-xl p-3 flex flex-col gap-2">
          <div className="flex items-center justify-between text-xs">
            <span className="text-indigo-400 font-bold font-mono flex items-center gap-1.5">
              <FolderKey className="w-3.5 h-3.5" /> Signature Buckets ({groups.length} clusters):
            </span>
            <span className="text-[11px] font-mono text-slate-500">
              ans[signature] = list of anagrams
            </span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-2 max-h-32 overflow-y-auto p-1">
            {groups.length === 0 ? (
              <span className="text-slate-600 italic text-xs col-span-3">No buckets created yet...</span>
            ) : (
              groups.map((group, idx) => {
                const color = BUCKET_COLORS[idx % BUCKET_COLORS.length];
                const isActive = activeGroupIndex === idx;

                return (
                  <div
                    key={group.signature}
                    className={`rounded-xl border p-2 flex flex-col gap-1.5 transition-all duration-300 ${
                      isActive
                        ? `${color.border} ${color.bg} ring-2 ring-indigo-400/50 shadow-md scale-102`
                        : `${color.border} ${color.bg} opacity-90`
                    }`}
                  >
                    <div className="flex items-center justify-between">
                      <span className={`text-[10px] font-mono font-bold px-1.5 py-0.2 rounded border ${color.tag}`}>
                        key: "{group.signature}"
                      </span>
                      <span className="text-[10px] text-slate-400 font-mono">
                        {group.words.length} items
                      </span>
                    </div>

                    <div className="flex items-center gap-1 flex-wrap">
                      {group.words.map((w, wIdx) => (
                        <span
                          key={wIdx}
                          className="px-2 py-0.5 rounded bg-slate-900/80 border border-slate-700/60 text-white text-xs font-mono"
                        >
                          "{w}"
                        </span>
                      ))}
                    </div>
                  </div>
                );
              })
            )}
          </div>
        </div>
      </div>

      {/* Mental Model Explainer Card */}
      <div className="bg-slate-950/80 border border-slate-800/80 rounded-xl p-2.5 flex items-center justify-between gap-3 text-xs shrink-0">
        <div className="flex items-center gap-2">
          <span className="text-indigo-400 font-bold font-mono">Canonical Key:</span>
          <span className="text-slate-300">
            Sorting characters guarantees that any anagram word produces the exact same hash key (e.g. "ate", "eat", "tea" all become "aet").
          </span>
        </div>
        <div className="flex items-center gap-3 shrink-0 text-[11px] font-mono text-slate-400">
          <span className="text-emerald-400 font-bold">Time: O(m · n log n)</span>
          <span className="text-indigo-400 font-bold">Space: O(m · n)</span>
        </div>
      </div>
    </div>
  );
};
