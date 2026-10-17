import React from 'react';
import { LongestPalindromeStep } from '../../algorithms/longestPalindromicSubstringIntuitive';
import { Sparkles, CheckCircle2, ArrowLeft, ArrowRight, Repeat } from 'lucide-react';

interface LongestPalindromeViewerProps {
  step: LongestPalindromeStep;
}

export const LongestPalindromicSubstringViewer: React.FC<LongestPalindromeViewerProps> = ({ step }) => {
  const {
    s,
    centerIndex,
    centerType,
    left,
    right,
    currentCandidate,
    longestPalindrome,
    longestSpan,
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
          <span className="p-1.5 rounded-lg bg-pink-500/10 text-pink-400 border border-pink-500/20">
            <Sparkles className="w-4 h-4" />
          </span>
          <div>
            <h3 className="text-xs font-semibold text-white tracking-wide">{headline}</h3>
            <p className="text-[11px] text-slate-400">{subtext}</p>
          </div>
        </div>
        <div className="flex items-center gap-2">
          {isComplete ? (
            <span className="px-2.5 py-0.5 rounded-md bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 text-xs font-mono font-bold flex items-center gap-1">
              <CheckCircle2 className="w-3.5 h-3.5" /> Best: "{longestPalindrome}" ({longestPalindrome.length})
            </span>
          ) : (
            <span className="px-2 py-0.5 rounded-md bg-indigo-500/10 border border-indigo-500/20 text-indigo-400 text-[11px] font-mono">
              Step {stepIndex + 1} / {totalSteps}
            </span>
          )}
        </div>
      </div>

      {/* Main Arena */}
      <div className="flex-1 min-h-0 grid grid-cols-1 md:grid-cols-12 gap-3 py-1 px-1">
        {/* Left: String Tape & Expansion Arrows */}
        <div className="md:col-span-8 flex flex-col items-center justify-center p-4 rounded-xl bg-slate-950/40 border border-slate-800/60 relative overflow-hidden">
          {/* Active Center Indicator */}
          <div className="text-xs font-mono text-slate-400 mb-4 flex items-center gap-2">
            <span className="px-2 py-0.5 rounded bg-slate-900 border border-slate-800">
              Center: {centerType === 'ODD' ? `Index ${centerIndex}` : `Between ${centerIndex} & ${centerIndex + 1}`}
            </span>
            <span className="text-pink-400 font-bold">
              {centerType} SYMMETRY
            </span>
          </div>

          {/* Character Cells */}
          <div className="flex items-center justify-center gap-1.5 flex-wrap max-w-full">
            {s.split('').map((char, idx) => {
              const isInCurrentSpan = idx >= left && idx <= right;
              const isInBestSpan = idx >= longestSpan[0] && idx <= longestSpan[1];
              const isCenterOdd = centerType === 'ODD' && idx === centerIndex;
              const isCenterEvenL = centerType === 'EVEN' && idx === centerIndex;
              const isCenterEvenR = centerType === 'EVEN' && idx === centerIndex + 1;
              const isPointerL = idx === left;
              const isPointerR = idx === right;

              let cellStyle = 'bg-slate-900 text-slate-400 border-slate-800';

              if (isInCurrentSpan) {
                cellStyle = 'bg-pink-500/20 text-pink-200 border-pink-400 shadow-[0_0_10px_rgba(244,114,182,0.3)] font-bold';
              } else if (isInBestSpan && isComplete) {
                cellStyle = 'bg-emerald-500/20 text-emerald-300 border-emerald-500/50 font-bold';
              }

              return (
                <div key={idx} className="flex flex-col items-center gap-1">
                  {/* Top Index & Pointer */}
                  <div className="flex items-center gap-0.5 text-[9px] font-mono text-slate-500">
                    {isPointerL && <ArrowLeft className="w-2.5 h-2.5 text-pink-400" />}
                    <span>{idx}</span>
                    {isPointerR && <ArrowRight className="w-2.5 h-2.5 text-pink-400" />}
                  </div>

                  {/* Character Box */}
                  <div
                    className={`w-11 h-12 rounded-xl border flex flex-col items-center justify-center font-mono font-bold text-lg transition-all duration-200 relative select-none ${cellStyle}`}
                  >
                    <span>{char}</span>

                    {/* Center dot */}
                    {(isCenterOdd || isCenterEvenL || isCenterEvenR) && (
                      <span className="absolute -bottom-1 w-1.5 h-1.5 rounded-full bg-pink-400" />
                    )}
                  </div>
                </div>
              );
            })}
          </div>

          {/* Current Candidate Preview */}
          <div className="mt-6 flex items-center gap-2">
            <span className="text-[11px] text-slate-400">Current Span:</span>
            <span className="px-3 py-1 rounded-lg bg-pink-500/10 border border-pink-500/30 text-pink-300 font-mono text-sm font-bold">
              "{currentCandidate}"
            </span>
            <span className="text-xs text-slate-500 font-mono">
              (len: {currentCandidate.length})
            </span>
          </div>
        </div>

        {/* Right: Best Record & Mechanics */}
        <div className="md:col-span-4 flex flex-col gap-2 min-h-0">
          {/* Best Record Card */}
          <div className="bg-slate-950/40 border border-slate-800/60 rounded-xl p-2.5 flex flex-col gap-1 shrink-0">
            <span className="text-[10px] uppercase font-bold text-slate-400 tracking-wider">
              Longest Palindrome So Far
            </span>
            <div className="p-2.5 rounded-lg bg-emerald-500/10 border border-emerald-500/30 flex items-center justify-between">
              <div>
                <span className="text-lg font-mono font-bold text-emerald-300 block leading-none">
                  "{longestPalindrome}"
                </span>
                <span className="text-[10px] text-slate-400 font-mono mt-1 block">
                  Span: [{longestSpan[0]} .. {longestSpan[1]}]
                </span>
              </div>
              <span className="text-xl font-mono font-bold text-emerald-400">
                {longestPalindrome.length}
              </span>
            </div>
          </div>

          {/* Symmetry Logic */}
          <div className="bg-slate-950/40 border border-slate-800/60 rounded-xl p-2.5 flex flex-col gap-2 flex-1 min-h-0 overflow-y-auto">
            <span className="text-[10px] uppercase font-bold text-slate-400 tracking-wider">
              2N - 1 Centers Strategy
            </span>

            <div className="space-y-1.5 text-xs text-slate-300">
              <div className="p-2 rounded-lg bg-slate-900/60 border border-slate-800">
                <div className="font-semibold text-pink-300 mb-0.5">Odd-Length Palindromes</div>
                <div className="text-[10px] text-slate-400">
                  Starts at single character center (<code>l = i, r = i</code>), expanding as mirror wings.
                </div>
              </div>

              <div className="p-2 rounded-lg bg-slate-900/60 border border-slate-800">
                <div className="font-semibold text-purple-300 mb-0.5">Even-Length Palindromes</div>
                <div className="text-[10px] text-slate-400">
                  Starts between adjacent characters (<code>l = i, r = i + 1</code>).
                </div>
              </div>
            </div>

            <div className="mt-auto p-2 rounded-lg bg-slate-900/60 border border-slate-800 text-[11px] text-slate-300">
              <span className="font-semibold text-emerald-400">O(1) Space Complexity:</span>
              <p className="text-[10px] text-slate-400 mt-0.5">
                Expanding outwards in-place checks palindromes in $O(N^2)$ time with zero extra matrix memory.
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Legend */}
      <div className="flex items-center justify-between bg-slate-950/60 border border-slate-800/60 rounded-xl px-3 py-1.5 shrink-0 text-xs">
        <div className="flex items-center gap-3">
          <div className="flex items-center gap-1.5">
            <span className="w-3 h-3 rounded bg-pink-500/30 border border-pink-500/60" />
            <span className="text-pink-300 text-[11px]">Expanding Wings</span>
          </div>
          <div className="flex items-center gap-1.5">
            <span className="w-3 h-3 rounded bg-emerald-500/30 border border-emerald-500/60" />
            <span className="text-emerald-300 text-[11px]">Longest Substring</span>
          </div>
        </div>

        {isComplete && (
          <div className="flex items-center gap-1 text-emerald-400 font-semibold text-[11px]">
            <CheckCircle2 className="w-3.5 h-3.5" /> Found Maximum Palindrome: "{longestPalindrome}"
          </div>
        )}
      </div>
    </div>
  );
};
