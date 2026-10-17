import React from 'react';
import { SerializeTreeStep } from '../../algorithms/serializeTreeIntuitive';
import { Network, CheckCircle2, ArrowRight, Send, Layers, Binary, Code } from 'lucide-react';

interface SerializeTreeViewerProps {
  step: SerializeTreeStep;
}

export const SerializeTreeViewer: React.FC<SerializeTreeViewerProps> = ({ step }) => {
  const {
    phase,
    originalTree,
    activeNodeId,
    serializedTokens,
    flatString,
    deserializeIndex,
    reconstructedTree,
    headline,
    subtext,
    isComplete,
    stepIndex,
    totalSteps
  } = step;

  const currentDisplayTree =
    phase === 'DESERIALIZE' || phase === 'DONE' ? reconstructedTree : originalTree;

  return (
    <div className="flex-1 min-h-0 flex flex-col bg-slate-900/60 border border-slate-800 rounded-2xl p-3 shadow-xl overflow-hidden justify-between">
      {/* Top Banner */}
      <div className="bg-slate-950/70 border border-slate-800/80 rounded-xl p-2.5 flex items-center justify-between shrink-0">
        <div className="flex items-center gap-2">
          <span className="p-1.5 rounded-lg bg-indigo-500/10 text-indigo-400 border border-indigo-500/20">
            <Network className="w-4 h-4" />
          </span>
          <div>
            <h3 className="text-xs font-semibold text-white tracking-wide">{headline}</h3>
            <p className="text-[11px] text-slate-400">{subtext}</p>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <span
            className={`px-2 py-0.5 rounded-md text-[11px] font-semibold border ${
              phase === 'SERIALIZE'
                ? 'bg-amber-500/10 border-amber-500/30 text-amber-300'
                : phase === 'TRANSIT'
                ? 'bg-sky-500/10 border-sky-500/30 text-sky-300'
                : phase === 'DESERIALIZE'
                ? 'bg-purple-500/10 border-purple-500/30 text-purple-300'
                : 'bg-emerald-500/10 border-emerald-500/30 text-emerald-300'
            }`}
          >
            {phase}
          </span>
          <span className="px-2 py-0.5 rounded-md bg-indigo-500/10 border border-indigo-500/20 text-indigo-400 text-[11px] font-mono">
            Step {stepIndex + 1} / {totalSteps}
          </span>
        </div>
      </div>

      {/* Main Arena: SVG Tree Canvas & Token Stream Wire */}
      <div className="flex-1 min-h-0 flex flex-col gap-2 py-1 justify-between">
        {/* SVG Tree Container */}
        <div className="flex-1 bg-slate-950/60 border border-slate-800 rounded-xl p-2 relative overflow-hidden flex flex-col">
          <div className="flex items-center justify-between text-[10px] text-slate-400 border-b border-slate-800/60 pb-1 mb-1 shrink-0">
            <span className="font-semibold uppercase tracking-wider">
              {phase === 'DESERIALIZE' || phase === 'DONE'
                ? 'Reconstructed Tree State:'
                : 'Original Binary Tree:'}
            </span>
            <span className="font-mono">
              {currentDisplayTree.length} nodes active
            </span>
          </div>

          <div className="flex-1 relative w-full h-full min-h-[140px]">
            <svg className="w-full h-full absolute inset-0">
              {/* Connecting Edges */}
              {currentDisplayTree.map((node) => {
                const leftChild = currentDisplayTree.find((n) => n.id === node.leftId);
                const rightChild = currentDisplayTree.find((n) => n.id === node.rightId);
                return (
                  <React.Fragment key={`edges-${node.id}`}>
                    {leftChild && (
                      <line
                        x1={`${node.x}%`}
                        y1={`${node.y}%`}
                        x2={`${leftChild.x}%`}
                        y2={`${leftChild.y}%`}
                        stroke="#475569"
                        strokeWidth="2"
                        strokeDasharray={phase === 'DESERIALIZE' ? '3 3' : 'none'}
                      />
                    )}
                    {rightChild && (
                      <line
                        x1={`${node.x}%`}
                        y1={`${node.y}%`}
                        x2={`${rightChild.x}%`}
                        y2={`${rightChild.y}%`}
                        stroke="#475569"
                        strokeWidth="2"
                        strokeDasharray={phase === 'DESERIALIZE' ? '3 3' : 'none'}
                      />
                    )}
                  </React.Fragment>
                );
              })}
            </svg>

            {/* Tree Nodes */}
            {currentDisplayTree.map((node) => {
              const isActive = node.id === activeNodeId;
              return (
                <div
                  key={`node-${node.id}`}
                  style={{
                    left: `${node.x}%`,
                    top: `${node.y}%`,
                    transform: 'translate(-50%, -50%)'
                  }}
                  className={`absolute w-10 h-10 rounded-full flex items-center justify-center font-mono font-bold text-xs border shadow-lg transition-all ${
                    isActive
                      ? 'bg-amber-500/25 border-amber-400 text-amber-200 ring-4 ring-amber-400/50 scale-110 z-10'
                      : 'bg-slate-850 border-slate-700 text-slate-100 z-0'
                  }`}
                >
                  {node.val}
                </div>
              );
            })}
          </div>
        </div>

        {/* Wire / Token Stream Row */}
        <div className="bg-slate-950/70 border border-slate-800 rounded-xl p-2.5 shrink-0 flex flex-col gap-1.5">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-slate-300 flex items-center gap-1.5">
              <Send className="w-3.5 h-3.5 text-sky-400" />
              Token Stream: data.split(",")
            </span>
            <span className="text-[10px] font-mono text-slate-400">
              {serializedTokens.length} tokens
            </span>
          </div>

          <div className="flex items-center gap-1.5 overflow-x-auto py-1 min-h-[46px]">
            {serializedTokens.length === 0 ? (
              <span className="text-slate-600 text-xs italic">Awaiting DFS traversal...</span>
            ) : (
              serializedTokens.map((tok, idx) => {
                const isCurrentDeserialize =
                  phase === 'DESERIALIZE' && idx === deserializeIndex;
                const isNull = tok === 'N';
                return (
                  <div key={idx} className="flex flex-col items-center shrink-0">
                    <span className="text-[8px] font-mono text-slate-500">{idx}</span>
                    <div
                      className={`px-2.5 py-1 rounded-lg text-xs font-mono font-bold border transition-all ${
                        isCurrentDeserialize
                          ? 'bg-purple-500/25 border-purple-400 text-purple-200 ring-2 ring-purple-400 scale-105'
                          : isNull
                          ? 'bg-slate-900 border-slate-800 text-rose-400/80'
                          : 'bg-slate-850 border-slate-700/80 text-slate-200'
                      }`}
                    >
                      {tok}
                    </div>
                    {isCurrentDeserialize && (
                      <span className="text-[8px] font-mono text-purple-400 font-bold">self.i</span>
                    )}
                  </div>
                );
              })
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
