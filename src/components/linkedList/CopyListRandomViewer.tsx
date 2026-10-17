import React from 'react';
import { CopyListRandomStep } from '../../algorithms/copyListRandomIntuitive';
import { Copy, ArrowRight, CheckCircle2, Split, GitFork, Sparkles } from 'lucide-react';

interface CopyListRandomViewerProps {
  step: CopyListRandomStep;
}

export const CopyListRandomViewer: React.FC<CopyListRandomViewerProps> = ({ step }) => {
  const { phase, chain, currId, activeCopyId, isComplete } = step;

  const phaseColors: Record<string, { bg: string; border: string; text: string; label: string }> = {
    INIT: { bg: 'bg-indigo-500/10', border: 'border-indigo-500/30', text: 'text-indigo-400', label: 'Initialization' },
    INTERLEAVE: { bg: 'bg-amber-500/10', border: 'border-amber-500/30', text: 'text-amber-400', label: 'Pass 1: Interleave Clones' },
    CONNECT_RANDOM: { bg: 'bg-cyan-500/10', border: 'border-cyan-500/30', text: 'text-cyan-400', label: 'Pass 2: Set Random Pointers' },
    DECOUPLE: { bg: 'bg-purple-500/10', border: 'border-purple-500/30', text: 'text-purple-400', label: 'Pass 3: Decouple Lists' },
    COMPLETE: { bg: 'bg-emerald-500/10', border: 'border-emerald-500/30', text: 'text-emerald-400', label: 'Clone Complete' }
  };

  const currentPhaseInfo = phaseColors[phase] || phaseColors.INIT;

  return (
    <div className="flex-1 min-h-0 flex flex-col bg-slate-900/60 border border-slate-800 rounded-2xl p-3 shadow-xl overflow-hidden justify-between">
      {/* Top Banner */}
      <div className="bg-slate-950/70 border border-slate-800/80 rounded-xl p-2.5 flex items-center justify-between shrink-0">
        <div className="flex items-center gap-2">
          <span className={`p-1.5 rounded-lg ${currentPhaseInfo.bg} ${currentPhaseInfo.text} border ${currentPhaseInfo.border}`}>
            <Copy className="w-4 h-4" />
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
              <CheckCircle2 className="w-3.5 h-3.5" /> Cloned ({chain.length} Nodes)
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
        {/* Legend */}
        <div className="bg-slate-950/60 border border-slate-800/80 rounded-xl p-2 flex items-center justify-between text-xs font-mono">
          <div className="flex items-center gap-4">
            <span className="flex items-center gap-1.5 text-indigo-400">
              <span className="w-3 h-3 rounded bg-indigo-500/20 border border-indigo-400"></span> Original Nodes
            </span>
            <span className="flex items-center gap-1.5 text-amber-400">
              <span className="w-3 h-3 rounded bg-amber-500/20 border border-amber-400"></span> Cloned Nodes (val')
            </span>
          </div>
          <span className="text-[11px] text-slate-400">
            Random pointers shown below each node
          </span>
        </div>

        {/* Chain Display */}
        <div className="bg-slate-950/80 border border-slate-800 rounded-xl p-3 flex flex-col gap-2">
          <span className="text-[10px] uppercase font-mono font-bold tracking-wider text-slate-400">
            {isComplete ? 'Decoupled Deep Copy List:' : 'In-Memory Linked List Sequence:'}
          </span>
          <div className="flex items-center gap-2 overflow-x-auto py-2">
            {chain.map((node, idx) => {
              const isCopy = node.isCopy;
              const isHighlighted = isCopy && activeCopyId !== null && node.id === `copy-${activeCopyId}`;

              let borderClass = isCopy
                ? 'bg-amber-500/10 border-amber-500/30 text-amber-200'
                : 'bg-indigo-500/10 border-indigo-500/30 text-indigo-200';

              if (isHighlighted) {
                borderClass = 'bg-amber-500/30 border-amber-400 text-amber-100 ring-2 ring-amber-400 scale-105 shadow-md shadow-amber-500/20';
              }

              return (
                <React.Fragment key={idx}>
                  <div className="flex flex-col items-center">
                    <div className={`w-12 h-12 rounded-xl border font-mono text-xs font-bold flex flex-col items-center justify-center transition-all ${borderClass}`}>
                      <span className="text-sm">{node.val}{isCopy ? "'" : ''}</span>
                    </div>
                    {/* Random pointer target pill */}
                    <div className="mt-1 px-1.5 py-0.5 rounded text-[9px] font-mono bg-slate-900 border border-slate-700/60 text-slate-400 max-w-[64px] truncate text-center">
                      rnd: {node.randomLabel}
                    </div>
                  </div>
                  {idx < chain.length - 1 && (
                    <ArrowRight className="w-3.5 h-3.5 text-slate-600 shrink-0 mb-5" />
                  )}
                </React.Fragment>
              );
            })}
            <ArrowRight className="w-3.5 h-3.5 text-slate-600 shrink-0 mb-5" />
            <div className="flex flex-col items-center mb-5">
              <span className="font-mono text-xs text-slate-600">None</span>
            </div>
          </div>
        </div>

        {/* Phase Note */}
        <div className="bg-slate-950/70 border border-slate-800 rounded-xl p-2.5 flex items-center gap-2 text-xs text-slate-400 font-mono">
          <Sparkles className="w-3.5 h-3.5 text-amber-400 shrink-0" />
          <span>Notice how no external hash map dictionary is used; interleaved geometry allows $O(1)$ memory cloning!</span>
        </div>
      </div>
    </div>
  );
};
