import React from 'react';
import { TrieStep } from '../../algorithms/trieIntuitive';
import { FileText, CheckCircle2, XCircle, ArrowRight, CornerDownRight } from 'lucide-react';

interface TrieViewerProps {
  step: TrieStep;
}

export const TrieViewer: React.FC<TrieViewerProps> = ({ step }) => {
  const nodeList = Object.values(step.nodes);

  // Group nodes by depth
  const depthGroups: Record<number, typeof nodeList> = {};
  nodeList.forEach((n) => {
    if (!depthGroups[n.depth]) depthGroups[n.depth] = [];
    depthGroups[n.depth].push(n);
  });

  return (
    <div className="flex-1 min-h-0 flex flex-col bg-slate-900/60 border border-slate-800 rounded-2xl p-3 shadow-xl overflow-hidden justify-between">
      {/* Top Banner */}
      <div className="bg-slate-950/70 border border-slate-800/80 rounded-xl p-2.5 flex items-center justify-between shrink-0">
        <div className="flex items-center gap-2">
          <span className="p-1.5 rounded-lg bg-indigo-500/10 text-indigo-400 border border-indigo-500/20">
            <FileText className="w-4 h-4" />
          </span>
          <div>
            <div className="flex items-center gap-2">
              <h3 className="text-xs font-semibold text-white tracking-wide">{step.headline}</h3>
              <span className="text-[10px] font-mono px-2 py-0.5 rounded-full bg-indigo-500/10 border border-indigo-500/30 text-indigo-300">
                {step.currentOp.op}("{step.currentOp.word}")
              </span>
            </div>
            <p className="text-[11px] text-slate-400">{step.subtext}</p>
          </div>
        </div>
        <div className="flex items-center gap-2">
          {step.opResult !== null && (
            <span
              className={`px-2 py-0.5 rounded-md border text-[11px] font-semibold flex items-center gap-1 ${
                step.opResult
                  ? 'bg-emerald-500/10 border-emerald-500/20 text-emerald-400'
                  : 'bg-rose-500/10 border-rose-500/20 text-rose-400'
              }`}
            >
              {step.opResult ? (
                <>
                  <CheckCircle2 className="w-3.5 h-3.5" /> Result: True
                </>
              ) : (
                <>
                  <XCircle className="w-3.5 h-3.5" /> Result: False
                </>
              )}
            </span>
          )}
          <span className="px-2 py-0.5 rounded-md bg-indigo-500/10 border border-indigo-500/20 text-indigo-400 text-[11px] font-mono">
            Step {step.stepIndex + 1} / {step.totalSteps}
          </span>
        </div>
      </div>

      {/* Main Trie Tree Visualizer */}
      <div className="flex-1 min-h-0 flex flex-col justify-around gap-2 py-2 px-3 overflow-y-auto">
        <div className="bg-slate-950/80 border border-slate-800 rounded-xl p-3 flex flex-col gap-3">
          <div className="flex items-center justify-between text-[10px] uppercase font-mono font-bold tracking-wider text-slate-400">
            <span>Trie Node Hierarchy:</span>
            <span className="text-slate-500">Depth-Organized Prefix Tree</span>
          </div>

          <div className="flex flex-col gap-3">
            {Object.keys(depthGroups)
              .map(Number)
              .sort((a, b) => a - b)
              .map((depth) => {
                const group = depthGroups[depth];
                return (
                  <div key={depth} className="flex items-center gap-2">
                    <span className="w-12 text-[10px] font-mono text-slate-500 shrink-0">
                      {depth === 0 ? 'Root:' : `Depth ${depth}:`}
                    </span>
                    <div className="flex items-center gap-2 overflow-x-auto py-0.5">
                      {group.map((node) => {
                        const isActive = step.activeNodeId === node.id;
                        let nodeStyle = 'bg-slate-900 border-slate-700 text-slate-300';
                        if (isActive) {
                          nodeStyle = 'bg-cyan-600 border-cyan-400 text-white ring-4 ring-cyan-500/40 scale-105 shadow-lg shadow-cyan-500/20';
                        } else if (node.isEnd) {
                          nodeStyle = 'bg-emerald-950/80 border-emerald-500 text-emerald-200 ring-2 ring-emerald-500/30';
                        }

                        return (
                          <div
                            key={node.id}
                            className={`px-3 py-1.5 rounded-xl border font-mono text-xs font-bold flex items-center gap-1.5 transition-all ${nodeStyle}`}
                          >
                            <span className="text-sm">{node.char}</span>
                            {node.isEnd && (
                              <span className="text-[9px] px-1 py-0.2 rounded bg-emerald-500/20 text-emerald-300 font-normal">
                                end
                              </span>
                            )}
                          </div>
                        );
                      })}
                    </div>
                  </div>
                );
              })}
          </div>
        </div>
      </div>

      {/* Bottom status bar */}
      <div className="bg-slate-950/70 border border-slate-800/80 rounded-xl p-2.5 flex items-center justify-between text-xs font-mono shrink-0">
        <div className="flex items-center gap-2 text-slate-400">
          <CornerDownRight className="w-3.5 h-3.5 text-indigo-400" />
          <span>Active Path:</span>
          <span className="text-white font-bold">{step.currentWord ? step.currentWord.slice(0, step.charIdx + 1) : '*'}</span>
        </div>

        <span className="text-slate-400">
          Total Trie Nodes: <span className="text-indigo-400 font-bold">{nodeList.length}</span>
        </span>
      </div>
    </div>
  );
};
