import React from 'react';
import { FindDuplicateStep } from '../../algorithms/findDuplicateIntuitive';
import { Search, ArrowRight, CheckCircle2, RefreshCw, Compass, AlertCircle } from 'lucide-react';

interface FindDuplicateViewerProps {
  step: FindDuplicateStep;
}

export const FindDuplicateViewer: React.FC<FindDuplicateViewerProps> = ({ step }) => {
  const { phase, nums, slowIdx, fastIdx, slow2Idx, duplicateVal, isComplete } = step;

  const phaseColors: Record<string, { bg: string; border: string; text: string; label: string }> = {
    INIT: { bg: 'bg-indigo-500/10', border: 'border-indigo-500/30', text: 'text-indigo-400', label: 'Initialization' },
    PHASE1_CYCLE_DETECT: { bg: 'bg-cyan-500/10', border: 'border-cyan-500/30', text: 'text-cyan-400', label: 'Phase 1: Hunting Cycle' },
    CYCLE_FOUND: { bg: 'bg-amber-500/10', border: 'border-amber-500/30', text: 'text-amber-400', label: 'Intersection Found' },
    PHASE2_ENTRANCE_FIND: { bg: 'bg-purple-500/10', border: 'border-purple-500/30', text: 'text-purple-400', label: 'Phase 2: Finding Entrance' },
    COMPLETE: { bg: 'bg-emerald-500/10', border: 'border-emerald-500/30', text: 'text-emerald-400', label: 'Duplicate Located' }
  };

  const currentPhaseInfo = phaseColors[phase] || phaseColors.INIT;

  return (
    <div className="flex-1 min-h-0 flex flex-col bg-slate-900/60 border border-slate-800 rounded-2xl p-3 shadow-xl overflow-hidden justify-between">
      {/* Top Banner */}
      <div className="bg-slate-950/70 border border-slate-800/80 rounded-xl p-2.5 flex items-center justify-between shrink-0">
        <div className="flex items-center gap-2">
          <span className={`p-1.5 rounded-lg ${currentPhaseInfo.bg} ${currentPhaseInfo.text} border ${currentPhaseInfo.border}`}>
            <Search className="w-4 h-4" />
          </span>
          <div>
            <div className="flex items-center gap-2">
              <h3 className="text-xs font-semibold text-white tracking-wide">{step.headline}</h3>
              <span className={`text-[10px] font-mono px-2 py-0.5 rounded-full ${currentPhaseInfo.bg} ${currentPhaseInfo.text} border ${currentPhaseInfo.border}`}>
                {currentPhaseInfo.label}
              </span>
            </div>
            <p className="text-[11px] text-slate-400">{step.subtext}</p>
          </div>
        </div>
        <div className="flex items-center gap-2">
          {isComplete ? (
            <span className="px-2 py-0.5 rounded-md bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 text-[11px] font-semibold flex items-center gap-1">
              <CheckCircle2 className="w-3.5 h-3.5" /> Duplicate = {duplicateVal}
            </span>
          ) : (
            <span className="px-2 py-0.5 rounded-md bg-indigo-500/10 border border-indigo-500/20 text-indigo-400 text-[11px] font-mono">
              Step {step.stepIndex + 1} / {step.totalSteps}
            </span>
          )}
        </div>
      </div>

      {/* Main Arena */}
      <div className="flex-1 min-h-0 flex flex-col justify-around gap-2 py-2 px-3">
        {/* Pointer Tracker Pill Bar */}
        <div className="bg-slate-950/60 border border-slate-800/80 rounded-xl p-2 flex items-center justify-between text-xs font-mono">
          <div className="flex items-center gap-4">
            <span className="flex items-center gap-1.5 text-indigo-400">
              <span className="w-2.5 h-2.5 rounded-full bg-indigo-500"></span>
              <span>slow: index {slowIdx} (points to {nums[slowIdx]})</span>
            </span>
            {fastIdx !== null && (
              <span className="flex items-center gap-1.5 text-pink-400">
                <span className="w-2.5 h-2.5 rounded-full bg-pink-500"></span>
                <span>fast: index {fastIdx} (points to {nums[fastIdx]})</span>
              </span>
            )}
            {slow2Idx !== null && (
              <span className="flex items-center gap-1.5 text-amber-400">
                <span className="w-2.5 h-2.5 rounded-full bg-amber-500"></span>
                <span>slow2: index {slow2Idx} (points to {nums[slow2Idx]})</span>
              </span>
            )}
          </div>
          <span className="text-[11px] text-slate-400">
            Mapping: i → nums[i]
          </span>
        </div>

        {/* Array Virtual Pointer Graph Display */}
        <div className="bg-slate-950/80 border border-slate-800 rounded-xl p-3 flex flex-col gap-2">
          <span className="text-[10px] uppercase font-mono font-bold tracking-wider text-slate-400">
            Array Index Graph (Indices 0 to {nums.length - 1}):
          </span>
          <div className="flex items-center gap-2 overflow-x-auto py-2">
            {nums.map((val, idx) => {
              const isSlow = slowIdx === idx;
              const isFast = fastIdx === idx;
              const isSlow2 = slow2Idx === idx;
              const isDuplicate = duplicateVal === idx;

              let nodeClass = 'bg-slate-900/80 border-slate-800 text-slate-200';
              if (isDuplicate) {
                nodeClass = 'bg-emerald-500/25 border-emerald-400 text-emerald-100 ring-2 ring-emerald-400 scale-110 shadow-lg shadow-emerald-500/20';
              } else if (isSlow && isFast) {
                nodeClass = 'bg-amber-500/25 border-amber-400 text-amber-200 ring-2 ring-amber-400';
              } else if (isSlow && isSlow2) {
                nodeClass = 'bg-emerald-500/20 border-emerald-400 text-emerald-200 ring-2 ring-emerald-400';
              } else if (isSlow) {
                nodeClass = 'bg-indigo-500/25 border-indigo-400 text-indigo-200 ring-2 ring-indigo-400';
              } else if (isFast) {
                nodeClass = 'bg-pink-500/25 border-pink-400 text-pink-200 ring-2 ring-pink-400';
              } else if (isSlow2) {
                nodeClass = 'bg-amber-500/25 border-amber-400 text-amber-200 ring-2 ring-amber-400';
              }

              return (
                <div key={idx} className="flex flex-col items-center">
                  <span className="text-[10px] font-mono text-slate-500 mb-1">i={idx}</span>
                  <div className={`w-11 h-11 rounded-xl border font-mono text-sm font-bold flex flex-col items-center justify-center transition-all ${nodeClass}`}>
                    <span>{val}</span>
                  </div>
                  <div className="h-4 flex items-center gap-1 text-[9px] font-mono mt-1 font-bold">
                    {isSlow && <span className="text-indigo-400">S1</span>}
                    {isFast && <span className="text-pink-400">F</span>}
                    {isSlow2 && <span className="text-amber-400">S2</span>}
                    {isDuplicate && <span className="text-emerald-400 font-extrabold">DUP!</span>}
                  </div>
                  <span className="text-[9px] font-mono text-slate-600 mt-0.5">→ {val}</span>
                </div>
              );
            })}
          </div>
        </div>

        {/* Explanation Card */}
        <div className="bg-slate-950/70 border border-slate-800 rounded-xl p-2.5 flex items-center gap-2 text-xs text-slate-400 font-mono">
          <AlertCircle className="w-4 h-4 text-cyan-400 shrink-0" />
          <span>
            Because each integer is in [1, n] and there are n+1 items, index 0 is never pointed to by any value, guaranteeing it starts outside the cycle!
          </span>
        </div>
      </div>
    </div>
  );
};
