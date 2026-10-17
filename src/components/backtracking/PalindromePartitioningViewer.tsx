import React from 'react';
import { PalindromePartitionStep } from '../../algorithms/palindromePartitioningIntuitive';
import { Scissors, CheckCircle2, XCircle, ArrowRight, Layers, Sparkles, Split } from 'lucide-react';

interface PalindromePartitioningViewerProps {
  step: PalindromePartitionStep;
}

export const PalindromePartitioningViewer: React.FC<PalindromePartitioningViewerProps> = ({ step }) => {
  const {
    s,
    startIndex,
    endIndex,
    candidateSubstring,
    isPalindrome,
    currentPartition,
    allPartitions,
    headline,
    subtext,
    isComplete,
    stepIndex,
    totalSteps
  } = step;

  return (
    <div className="flex-1 min-h-0 flex flex-col bg-slate-900/60 border border-slate-800 rounded-2xl p-3 shadow-xl overflow-hidden justify-between">
      {/* Top Banner */}
      <div className="bg-slate-950/70 border border-slate-800/80 rounded-xl p-2.5 flex items-center justify-between shrink-0">
        <div className="flex items-center gap-2">
          <span className="p-1.5 rounded-lg bg-indigo-500/10 text-indigo-400 border border-indigo-500/20">
            <Scissors className="w-4 h-4" />
          </span>
          <div>
            <h3 className="text-xs font-semibold text-white tracking-wide">{headline}</h3>
            <p className="text-[11px] text-slate-400">{subtext}</p>
          </div>
        </div>
        <div className="flex items-center gap-2">
          {allPartitions.length > 0 && (
            <span className="px-2 py-0.5 rounded-md bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 text-[11px] font-semibold flex items-center gap-1">
              <CheckCircle2 className="w-3.5 h-3.5" /> {allPartitions.length} Partitions
            </span>
          )}
          <span className="px-2 py-0.5 rounded-md bg-indigo-500/10 border border-indigo-500/20 text-indigo-400 text-[11px] font-mono">
            Step {stepIndex + 1} / {totalSteps}
          </span>
        </div>
      </div>

      {/* Main Arena: Left = String & Candidate Slices, Right = Discovered Partitions */}
      <div className="flex-1 min-h-0 grid grid-cols-1 md:grid-cols-12 gap-3 py-1 px-1">
        {/* Left Arena */}
        <div className="md:col-span-7 bg-slate-950/60 border border-slate-800 rounded-xl p-2.5 flex flex-col justify-between overflow-hidden">
          {/* String Tokens with Cut Boundaries */}
          <div>
            <div className="flex items-center justify-between text-[10px] text-slate-400 font-semibold uppercase mb-1.5">
              <span>Original String: "{s}"</span>
              <span className="font-mono">Pointers [i={startIndex}..j={endIndex}]</span>
            </div>

            <div className="flex items-center gap-1.5 py-1 justify-center">
              {s.split('').map((ch, idx) => {
                const inCandidate = idx >= startIndex && idx <= endIndex;
                return (
                  <div key={idx} className="flex flex-col items-center">
                    <span className="text-[8px] font-mono text-slate-500">{idx}</span>
                    <div
                      className={`w-10 h-10 rounded-xl flex items-center justify-center font-mono font-bold text-sm border transition-all ${
                        inCandidate
                          ? isPalindrome
                            ? 'bg-emerald-500/25 border-emerald-400 text-emerald-200 ring-2 ring-emerald-400'
                            : 'bg-rose-500/20 border-rose-400 text-rose-200 ring-1 ring-rose-400'
                          : idx < startIndex
                          ? 'bg-indigo-500/10 border-indigo-500/30 text-indigo-300'
                          : 'bg-slate-900 border-slate-800 text-slate-400'
                      }`}
                    >
                      {ch}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Candidate Palindrome Inspection Box */}
          <div className="bg-slate-900/70 border border-slate-800 rounded-xl p-2.5 flex items-center justify-between shrink-0">
            <div>
              <span className="text-[10px] text-slate-500 uppercase font-semibold block">
                Testing Substring s[{startIndex}..{endIndex}]:
              </span>
              <span className="font-mono font-bold text-base text-white">
                "{candidateSubstring || '—'}"
              </span>
            </div>

            {candidateSubstring && (
              <span
                className={`px-2.5 py-1 rounded-lg text-xs font-mono font-bold flex items-center gap-1 border ${
                  isPalindrome
                    ? 'bg-emerald-500/20 border-emerald-400 text-emerald-300'
                    : 'bg-rose-500/20 border-rose-400 text-rose-300'
                }`}
              >
                {isPalindrome ? (
                  <>
                    <CheckCircle2 className="w-3.5 h-3.5" /> Palindrome
                  </>
                ) : (
                  <>
                    <XCircle className="w-3.5 h-3.5" /> Not Palindrome
                  </>
                )}
              </span>
            )}
          </div>

          {/* Active Partition State */}
          <div className="bg-slate-900/50 border border-slate-800 rounded-xl p-2 shrink-0">
            <span className="text-[10px] uppercase font-semibold text-slate-400 block mb-1">
              Active Partition (`part`):
            </span>
            <div className="flex items-center gap-1.5 flex-wrap min-h-[30px]">
              {currentPartition.length === 0 ? (
                <span className="text-slate-600 text-xs italic">Empty partition []</span>
              ) : (
                currentPartition.map((sub, idx) => (
                  <div
                    key={idx}
                    className="px-2.5 py-0.5 rounded-lg bg-indigo-500/20 border border-indigo-400 text-indigo-200 font-mono font-bold text-xs"
                  >
                    "{sub}"
                  </div>
                ))
              )}
            </div>
          </div>

          <div className="text-[10px] text-slate-500 bg-slate-900/80 rounded-lg p-1.5 border border-slate-800/60 text-center shrink-0">
            Every segment chosen must satisfy s[l] == s[r] for all symmetric pointer pairs.
          </div>
        </div>

        {/* Right: Collected Partitions */}
        <div className="md:col-span-5 bg-slate-950/60 border border-slate-800 rounded-xl p-2.5 flex flex-col justify-between overflow-hidden">
          <div className="flex items-center justify-between border-b border-slate-800/70 pb-1.5 shrink-0">
            <span className="text-xs font-semibold text-emerald-400 flex items-center gap-1.5">
              <Sparkles className="w-3.5 h-3.5" />
              Valid Partitions Found
            </span>
            <span className="text-[10px] font-mono text-slate-400">
              {allPartitions.length} decompositions
            </span>
          </div>

          <div className="flex-1 overflow-y-auto py-2 flex flex-col gap-1.5">
            {allPartitions.length === 0 ? (
              <span className="text-slate-600 text-xs italic text-center py-4">
                No full palindrome partitions completed yet
              </span>
            ) : (
              allPartitions.map((partItem, idx) => (
                <div
                  key={idx}
                  className="flex items-center justify-between px-3 py-1.5 rounded-xl bg-emerald-500/10 border border-emerald-500/30 text-emerald-300 font-mono text-xs font-bold shadow"
                >
                  <span className="text-slate-500 text-[9px]">#{idx + 1}</span>
                  <span>[{partItem.map((p) => `"${p}"`).join(', ')}]</span>
                </div>
              ))
            )}
          </div>

          <div className="text-[10px] text-slate-500 bg-slate-900/80 rounded-lg p-1.5 border border-slate-800/60 text-center shrink-0">
            Worst-case complexity: O(2^N * N) when all substrings are palindromes (e.g. "aaaa").
          </div>
        </div>
      </div>
    </div>
  );
};
