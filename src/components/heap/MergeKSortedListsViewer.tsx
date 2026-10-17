import React from 'react';
import { MergeKSortedListsStep } from '../../algorithms/mergeKSortedListsIntuitive';
import { GitMerge, CheckCircle2, ArrowRight, Layers, Database } from 'lucide-react';

interface MergeKSortedListsViewerProps {
  step: MergeKSortedListsStep;
}

const LIST_COLORS = [
  { bg: 'bg-indigo-500/20', border: 'border-indigo-500/40', text: 'text-indigo-300', dot: 'bg-indigo-400' },
  { bg: 'bg-cyan-500/20', border: 'border-cyan-500/40', text: 'text-cyan-300', dot: 'bg-cyan-400' },
  { bg: 'bg-amber-500/20', border: 'border-amber-500/40', text: 'text-amber-300', dot: 'bg-amber-400' },
  { bg: 'bg-rose-500/20', border: 'border-rose-500/40', text: 'text-rose-300', dot: 'bg-rose-400' },
  { bg: 'bg-purple-500/20', border: 'border-purple-500/40', text: 'text-purple-300', dot: 'bg-purple-400' }
];

export const MergeKSortedListsViewer: React.FC<MergeKSortedListsViewerProps> = ({ step }) => {
  const {
    lists,
    pointers,
    minHeap,
    mergedList,
    activeItem,
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
            <GitMerge className="w-4 h-4" />
          </span>
          <div>
            <h3 className="text-xs font-semibold text-white tracking-wide">{headline}</h3>
            <p className="text-[11px] text-slate-400">{subtext}</p>
          </div>
        </div>
        <div className="flex items-center gap-2">
          {isComplete ? (
            <span className="px-2 py-0.5 rounded-md bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 text-[11px] font-semibold flex items-center gap-1">
              <CheckCircle2 className="w-3.5 h-3.5" /> Merged {mergedList.length} Nodes
            </span>
          ) : (
            <span className="px-2 py-0.5 rounded-md bg-indigo-500/10 border border-indigo-500/20 text-indigo-400 text-[11px] font-mono">
              Step {stepIndex + 1} / {totalSteps}
            </span>
          )}
        </div>
      </div>

      {/* Arena: Top = Input K Lists, Middle = Min-Heap, Bottom = Merged Result */}
      <div className="flex-1 min-h-0 flex flex-col gap-2 py-1 overflow-hidden justify-between">
        {/* K Lists Container */}
        <div className="bg-slate-950/60 border border-slate-800 rounded-xl p-2 shrink-0 flex flex-col gap-1.5">
          <div className="text-[10px] uppercase font-semibold text-slate-400 flex items-center gap-1">
            <Database className="w-3 h-3 text-indigo-400" /> K Input Linked Lists:
          </div>
          <div className="flex flex-col gap-1 overflow-y-auto max-h-24">
            {lists.map((lst, lIdx) => {
              const color = LIST_COLORS[lIdx % LIST_COLORS.length];
              const curPointer = pointers[lIdx];
              return (
                <div key={lIdx} className="flex items-center gap-2">
                  <span className={`text-[10px] font-mono font-bold w-12 shrink-0 ${color.text}`}>
                    List {lIdx + 1}:
                  </span>
                  <div className="flex items-center gap-1 overflow-x-auto">
                    {lst.map((val, nIdx) => {
                      const isMerged = nIdx < curPointer;
                      const isNextInLine = nIdx === curPointer;
                      return (
                        <React.Fragment key={nIdx}>
                          <div
                            className={`relative px-2 py-0.5 rounded text-xs font-mono font-bold border transition-all ${
                              isNextInLine
                                ? `${color.bg} ${color.border} ${color.text} ring-1 ring-amber-400`
                                : isMerged
                                ? 'bg-slate-900 border-slate-800/80 text-slate-500 line-through opacity-50'
                                : 'bg-slate-850 border-slate-700/80 text-slate-300'
                            }`}
                          >
                            {val}
                          </div>
                          {nIdx < lst.length - 1 && (
                            <span className="text-[10px] text-slate-600">→</span>
                          )}
                        </React.Fragment>
                      );
                    })}
                    <span className="text-[10px] text-slate-600">→ NULL</span>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Min-Heap Center Chamber */}
        <div className="bg-slate-950/60 border border-slate-800 rounded-xl p-2 shrink-0 flex flex-col gap-1">
          <div className="flex items-center justify-between border-b border-slate-800/70 pb-1 shrink-0">
            <span className="text-[11px] font-semibold text-slate-300 flex items-center gap-1.5">
              <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
              Min-Heap (Stores up to K heads)
            </span>
            <span className="text-[10px] font-mono text-slate-400 bg-slate-900 px-1.5 py-0.5 rounded border border-slate-800">
              Heap Size: {minHeap.length}
            </span>
          </div>

          <div className="flex items-center justify-center gap-2 py-1 min-h-[44px]">
            {minHeap.length === 0 ? (
              <span className="text-slate-600 text-xs italic">Heap is empty</span>
            ) : (
              minHeap.map((node, idx) => {
                const color = LIST_COLORS[node.listIdx % LIST_COLORS.length];
                const isRoot = idx === 0;
                return (
                  <div
                    key={`${node.listIdx}-${node.nodeIdx}`}
                    className={`relative flex items-center gap-1 px-2.5 py-1 rounded-xl border transition-all ${
                      color.bg
                    } ${color.border} ${
                      isRoot ? 'ring-2 ring-emerald-400 shadow-lg shadow-emerald-500/20 scale-105' : ''
                    }`}
                  >
                    {isRoot && (
                      <span className="absolute -top-2 left-1/2 -translate-x-1/2 text-[8px] bg-emerald-500 text-slate-950 font-bold px-1 rounded-full">
                        MIN
                      </span>
                    )}
                    <span className={`text-sm font-mono font-bold ${color.text}`}>{node.val}</span>
                    <span className="text-[9px] text-slate-400 font-mono">(L{node.listIdx + 1})</span>
                  </div>
                );
              })
            )}
          </div>
        </div>

        {/* Merged Result List */}
        <div className="bg-slate-950/60 border border-slate-800 rounded-xl p-2 shrink-0 flex flex-col gap-1">
          <div className="flex items-center justify-between border-b border-slate-800/70 pb-1 shrink-0">
            <span className="text-[11px] font-semibold text-emerald-400 flex items-center gap-1.5">
              <CheckCircle2 className="w-3.5 h-3.5" />
              Merged Sorted Linked List (dummy.next)
            </span>
            <span className="text-[10px] font-mono text-slate-400">
              Length: {mergedList.length}
            </span>
          </div>

          <div className="flex items-center gap-1.5 overflow-x-auto py-1 min-h-[44px]">
            {mergedList.length === 0 ? (
              <span className="text-slate-600 text-xs italic">No nodes merged yet</span>
            ) : (
              mergedList.map((val, idx) => {
                const isLatest = idx === mergedList.length - 1;
                return (
                  <React.Fragment key={idx}>
                    <div
                      className={`px-2.5 py-1 rounded-lg text-xs font-mono font-bold border transition-all ${
                        isLatest
                          ? 'bg-emerald-500/20 border-emerald-400 text-emerald-200 ring-1 ring-emerald-400 shadow-md scale-105'
                          : 'bg-slate-850 border-slate-700 text-slate-200'
                      }`}
                    >
                      {val}
                    </div>
                    {idx < mergedList.length - 1 && (
                      <span className="text-[10px] text-slate-500">→</span>
                    )}
                  </React.Fragment>
                );
              })
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
