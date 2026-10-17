import React from 'react';
import type { LRUCacheStep } from '../../algorithms/lruCacheIntuitive';
import {
  Database,
  ArrowLeftRight,
  CheckCircle2,
  AlertTriangle,
  ArrowRight,
  Sparkles,
  Scissors,
  PlusCircle,
  HelpCircle,
  CornerDownRight,
} from 'lucide-react';

interface LRUCacheViewerProps {
  step: LRUCacheStep;
}

export const LRUCacheViewer: React.FC<LRUCacheViewerProps> = ({ step }) => {
  const {
    capacity,
    operationText,
    cacheMap,
    dllOrder,
    detachedNode,
    unlinkedInfo,
    evictedNode,
    accessedNode,
    actionType,
    pointerCode,
    isComplete,
  } = step;

  const actionConfig: Record<
    string,
    { bg: string; border: string; text: string; label: string; icon: React.ReactNode }
  > = {
    INIT: {
      bg: 'bg-indigo-500/10',
      border: 'border-indigo-500/30',
      text: 'text-indigo-400',
      label: 'Initialized',
      icon: <Database className="w-4 h-4 text-indigo-400" />,
    },
    GET_LOOKUP: {
      bg: 'bg-sky-500/15',
      border: 'border-sky-500/40',
      text: 'text-sky-300',
      label: '1. O(1) Lookup Found',
      icon: <Database className="w-4 h-4 text-sky-400" />,
    },
    GET_REMOVE: {
      bg: 'bg-amber-500/15',
      border: 'border-amber-500/40',
      text: 'text-amber-300',
      label: '2. self.remove(node) Unlink',
      icon: <Scissors className="w-4 h-4 text-amber-400" />,
    },
    GET_INSERT: {
      bg: 'bg-emerald-500/15',
      border: 'border-emerald-500/40',
      text: 'text-emerald-300',
      label: '3. self.insert(node) at MRU',
      icon: <PlusCircle className="w-4 h-4 text-emerald-400" />,
    },
    GET_RETURN: {
      bg: 'bg-emerald-500/20',
      border: 'border-emerald-500/50',
      text: 'text-emerald-300',
      label: '4. Cache Hit Returned',
      icon: <CheckCircle2 className="w-4 h-4 text-emerald-400" />,
    },
    GET_MISS: {
      bg: 'bg-rose-500/15',
      border: 'border-rose-500/40',
      text: 'text-rose-400',
      label: 'Cache Miss (-1)',
      icon: <AlertTriangle className="w-4 h-4 text-rose-400" />,
    },
    PUT_EXISTING_REMOVE: {
      bg: 'bg-amber-500/15',
      border: 'border-amber-500/40',
      text: 'text-amber-300',
      label: '1. self.remove(old_node)',
      icon: <Scissors className="w-4 h-4 text-amber-400" />,
    },
    PUT_INSERT: {
      bg: 'bg-emerald-500/15',
      border: 'border-emerald-500/40',
      text: 'text-emerald-300',
      label: 'self.insert at MRU',
      icon: <PlusCircle className="w-4 h-4 text-emerald-400" />,
    },
    PUT_EVICT_REMOVE: {
      bg: 'bg-rose-500/20',
      border: 'border-rose-500/50',
      text: 'text-rose-300',
      label: 'Evict: self.remove(LRU)',
      icon: <Scissors className="w-4 h-4 text-rose-400" />,
    },
    PUT_EVICT_DELETE: {
      bg: 'bg-rose-500/20',
      border: 'border-rose-500/50',
      text: 'text-rose-300',
      label: 'Evict: del cache[LRU]',
      icon: <AlertTriangle className="w-4 h-4 text-rose-400" />,
    },
    COMPLETE: {
      bg: 'bg-emerald-500/20',
      border: 'border-emerald-500/50',
      text: 'text-emerald-300',
      label: 'All Ops Complete',
      icon: <CheckCircle2 className="w-4 h-4 text-emerald-400" />,
    },
  };

  const badge = actionConfig[actionType] || actionConfig.INIT;

  return (
    <div className="flex-1 min-h-0 flex flex-col bg-slate-900/60 border border-slate-800 rounded-2xl p-3 shadow-xl overflow-hidden justify-between gap-2.5 select-none">
      {/* Top Banner with Operation and Stage Badge */}
      <div className="bg-slate-950/80 border border-slate-800 rounded-xl p-2.5 flex items-center justify-between shrink-0">
        <div className="flex items-center gap-2.5">
          <span className={`p-2 rounded-xl ${badge.bg} ${badge.text} border ${badge.border}`}>
            {badge.icon}
          </span>
          <div>
            <div className="flex items-center gap-2">
              <h3 className="text-xs font-bold text-white tracking-wide">{step.headline}</h3>
              <span className={`text-[10px] font-mono px-2 py-0.5 rounded-md font-bold ${badge.bg} ${badge.text} border ${badge.border}`}>
                {badge.label}
              </span>
              <span className="text-[10px] font-mono px-2 py-0.5 rounded-md bg-slate-800 text-slate-300 border border-slate-700">
                {operationText}
              </span>
            </div>
            <p className="text-[11px] text-slate-400 mt-0.5">{step.subtext}</p>
          </div>
        </div>

        <div className="flex items-center gap-2">
          {isComplete ? (
            <span className="px-2.5 py-1 rounded-lg bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 text-xs font-semibold flex items-center gap-1">
              <CheckCircle2 className="w-3.5 h-3.5" /> All Done
            </span>
          ) : (
            <span className="px-2.5 py-1 rounded-lg bg-indigo-500/10 border border-indigo-500/20 text-indigo-400 text-xs font-mono font-semibold">
              Step {step.stepIndex + 1} / {step.totalSteps}
            </span>
          )}
        </div>
      </div>

      {/* Main Visual Arena */}
      <div className="flex-1 min-h-0 flex flex-col justify-between gap-2.5">
        {/* Row 1: Hash Map Dictionary & Capacity Meter */}
        <div className="grid grid-cols-1 md:grid-cols-12 gap-2.5">
          {/* Hash Map */}
          <div className="md:col-span-8 bg-slate-950/70 border border-slate-800/80 rounded-xl p-2.5 flex flex-col gap-1.5">
            <div className="flex items-center justify-between">
              <span className="text-[10px] uppercase font-mono font-bold tracking-wider text-indigo-400 flex items-center gap-1">
                <Database className="w-3 h-3" /> Hash Map: self.cache (O(1) Node Address Pointers)
              </span>
              <span className="text-[10px] font-mono text-slate-500">
                {Object.keys(cacheMap).length} entries
              </span>
            </div>
            <div className="flex items-center gap-2 overflow-x-auto min-h-[36px]">
              {Object.keys(cacheMap).length === 0 ? (
                <span className="text-slate-600 font-mono text-xs italic">Cache is empty &#123;&#125;</span>
              ) : (
                Object.entries(cacheMap).map(([k, v]) => {
                  const isCurrent = accessedNode?.key === Number(k);
                  const isEvicted = evictedNode?.key === Number(k);

                  return (
                    <div
                      key={k}
                      className={`px-2.5 py-1 rounded-lg border font-mono text-xs flex items-center gap-1.5 transition-all ${
                        isEvicted
                          ? 'bg-rose-500/20 border-rose-400 text-rose-300 line-through opacity-60'
                          : isCurrent
                          ? 'bg-indigo-600/30 border-indigo-400 text-indigo-100 ring-2 ring-indigo-400/80 shadow-md shadow-indigo-500/30 scale-105'
                          : 'bg-slate-900 border-slate-700/80 text-slate-300'
                      }`}
                    >
                      <span className="text-indigo-400 font-bold">key:{k}</span>
                      <span className="text-slate-500">→</span>
                      <span className="text-cyan-300 font-bold">&Node({v})</span>
                    </div>
                  );
                })
              )}
            </div>
          </div>

          {/* Capacity Meter */}
          <div className="md:col-span-4 bg-slate-950/70 border border-slate-800/80 rounded-xl p-2.5 flex flex-col justify-between">
            <div className="flex items-center justify-between">
              <span className="text-[10px] uppercase font-mono font-bold tracking-wider text-slate-400">
                Cache Capacity:
              </span>
              <span
                className={`text-[10px] font-bold px-1.5 py-0.5 rounded font-mono ${
                  dllOrder.length >= capacity
                    ? 'bg-amber-500/20 text-amber-300 border border-amber-500/30'
                    : 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/30'
                }`}
              >
                {dllOrder.length} / {capacity} Nodes {dllOrder.length >= capacity ? '(FULL)' : '(OK)'}
              </span>
            </div>
            <div className="w-full bg-slate-900 h-2 rounded-full overflow-hidden border border-slate-800 mt-2">
              <div
                className={`h-full transition-all duration-300 ${
                  dllOrder.length >= capacity ? 'bg-amber-500' : 'bg-indigo-500'
                }`}
                style={{ width: `${Math.min(100, (dllOrder.length / capacity) * 100)}%` }}
              />
            </div>
          </div>
        </div>

        {/* Row 2: In-Flight / Detached Node Staging Slot (Crucial for visualizing remove/insert!) */}
        {detachedNode && (
          <div className="bg-amber-950/30 border-2 border-dashed border-amber-500/60 rounded-xl p-2.5 flex items-center justify-between animate-pulse">
            <div className="flex items-center gap-3">
              <span className="p-1.5 rounded-lg bg-amber-500/20 text-amber-300 border border-amber-500/40">
                <Scissors className="w-4 h-4" />
              </span>
              <div>
                <span className="text-xs font-bold text-amber-300 flex items-center gap-1.5">
                  <span>In-Flight Detached Node:</span>
                  <span className="font-mono bg-amber-500/30 text-amber-100 px-2 py-0.5 rounded border border-amber-400">
                    Node(key: {detachedNode.key}, val: {detachedNode.val})
                  </span>
                </span>
                <span className="text-[11px] text-slate-400 block mt-0.5">
                  {unlinkedInfo ? (
                    <>
                      Unlinked from DLL position {unlinkedInfo.originalIndex} (between {unlinkedInfo.prevKey} and {unlinkedInfo.nextKey}).
                      Bypass connection established: {unlinkedInfo.prevKey} ⟷ {unlinkedInfo.nextKey}!
                    </>
                  ) : (
                    'Node detached from doubly linked list and ready for insertion at MRU position.'
                  )}
                </span>
              </div>
            </div>

            <div className="flex items-center gap-1.5 font-mono text-[11px] text-amber-300 font-bold shrink-0">
              <ArrowRight className="w-4 h-4 animate-bounce" />
              <span>Next: self.insert(node) at MRU</span>
            </div>
          </div>
        )}

        {/* Row 3: Doubly Linked List Architecture (LRU Head <-> Nodes <-> MRU Tail) */}
        <div className="bg-slate-950/80 border border-slate-800 rounded-xl p-3 flex flex-col gap-2">
          <div className="flex items-center justify-between">
            <span className="text-[10px] uppercase font-mono font-bold tracking-wider text-slate-400 flex items-center gap-1">
              <span>Doubly Linked List Structure:</span>
              <span className="text-rose-400 font-bold">LEFT Sentinel (LRU)</span>
              <span>⟷ Nodes ⟷</span>
              <span className="text-emerald-400 font-bold">RIGHT Sentinel (MRU)</span>
            </span>
            {evictedNode && (
              <span className="text-[11px] font-mono text-rose-400 flex items-center gap-1">
                <AlertTriangle className="w-3.5 h-3.5" /> Evicted LRU: Node({evictedNode.key}:{evictedNode.val})
              </span>
            )}
          </div>

          <div className="flex items-center gap-2 overflow-x-auto py-2 justify-center min-h-[72px]">
            {/* Left Sentinel (LRU Anchor) */}
            <div className="flex flex-col items-center shrink-0">
              <div className="w-14 h-12 rounded-xl border border-dashed border-rose-500/60 bg-rose-500/10 font-mono text-xs font-bold text-rose-300 flex flex-col items-center justify-center shadow-sm">
                <span>LEFT</span>
                <span className="text-[8px] text-rose-400 uppercase tracking-tight">Sentinel</span>
              </div>
              <span className="text-[9px] font-mono text-rose-400 font-bold mt-1">LRU End</span>
            </div>

            <ArrowLeftRight className="w-4 h-4 text-slate-600 shrink-0" />

            {/* In-Cache DLL Nodes */}
            {dllOrder.length === 0 ? (
              <div className="px-4 py-2 rounded-xl border border-dashed border-slate-800 text-slate-600 font-mono text-xs italic">
                (No data nodes between sentinels)
              </div>
            ) : (
              dllOrder.map((node, idx) => {
                const isAccessed = accessedNode?.key === node.key && !detachedNode;
                const isLRU = idx === 0;
                const isMRU = idx === dllOrder.length - 1;

                let nodeStyle = 'bg-slate-900 border-slate-700/80 text-slate-200';
                if (isAccessed) {
                  nodeStyle = 'bg-cyan-500/25 border-cyan-400 text-cyan-100 ring-2 ring-cyan-400/80 shadow-lg shadow-cyan-500/30 scale-105';
                } else if (isMRU) {
                  nodeStyle = 'bg-emerald-950/70 border-emerald-500/80 text-emerald-200 shadow-md shadow-emerald-500/20';
                }

                return (
                  <React.Fragment key={node.key}>
                    <div className="flex flex-col items-center shrink-0">
                      <div
                        className={`w-16 h-12 rounded-xl border-2 font-mono text-xs font-bold flex flex-col items-center justify-center transition-all ${nodeStyle}`}
                      >
                        <span className="text-white text-xs">{node.key} : {node.val}</span>
                        <span className="text-[8px] text-slate-400">[key:val]</span>
                      </div>
                      <div className="h-3.5 flex items-center gap-1 text-[9px] font-mono mt-1 font-bold">
                        {isLRU && <span className="text-rose-400 bg-rose-950/60 px-1 rounded border border-rose-800/60">LRU</span>}
                        {isMRU && <span className="text-emerald-400 bg-emerald-950/60 px-1 rounded border border-emerald-800/60">MRU 👑</span>}
                        {!isLRU && !isMRU && <span className="text-slate-500">idx {idx}</span>}
                      </div>
                    </div>
                    {idx < dllOrder.length - 1 && (
                      <ArrowLeftRight className="w-4 h-4 text-slate-600 shrink-0 mb-3" />
                    )}
                  </React.Fragment>
                );
              })
            )}

            <ArrowLeftRight className="w-4 h-4 text-slate-600 shrink-0" />

            {/* Right Sentinel (MRU Anchor) */}
            <div className="flex flex-col items-center shrink-0">
              <div className="w-14 h-12 rounded-xl border border-dashed border-emerald-500/60 bg-emerald-500/10 font-mono text-xs font-bold text-emerald-300 flex flex-col items-center justify-center shadow-sm">
                <span>RIGHT</span>
                <span className="text-[8px] text-emerald-400 uppercase tracking-tight">Sentinel</span>
              </div>
              <span className="text-[9px] font-mono text-emerald-400 font-bold mt-1">MRU End</span>
            </div>
          </div>
        </div>

        {/* Row 4: Pointer Operation Terminal */}
        <div className="bg-slate-950/90 border border-slate-800 rounded-xl px-3 py-2 flex items-center justify-between text-xs font-mono shrink-0">
          <div className="flex items-center gap-2">
            <CornerDownRight className="w-3.5 h-3.5 text-indigo-400 shrink-0" />
            <span className="text-slate-400">Pointer Manipulation:</span>
            <span className="text-emerald-300 font-bold bg-slate-900 px-2 py-0.5 rounded border border-slate-700/80">
              {pointerCode}
            </span>
          </div>
          <span className="text-[11px] text-slate-500 flex items-center gap-1">
            <Sparkles className="w-3 h-3 text-amber-400" /> O(1) Time Complexity
          </span>
        </div>
      </div>
    </div>
  );
};
