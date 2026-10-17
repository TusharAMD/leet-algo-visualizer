import React from 'react';
import { Code, Variable } from 'lucide-react';

interface CodeViewerProps {
  lines: string[];
  activeLine: number;
  variableBadges?: { name: string; value: string }[];
}

export const CodeViewer: React.FC<CodeViewerProps> = ({
  lines,
  activeLine,
  variableBadges = []
}) => {
  return (
    <div className="flex flex-col h-full bg-slate-900/60 border border-slate-800 rounded-2xl overflow-hidden shadow-lg">
      {/* Code Header */}
      <div className="px-3.5 py-2 bg-slate-950/80 border-b border-slate-800/80 flex items-center justify-between shrink-0">
        <div className="flex items-center gap-1.5">
          <Code className="w-3.5 h-3.5 text-indigo-400" />
          <span className="text-xs font-bold text-slate-200">Exact Python Code</span>
        </div>
        <span className="text-[10px] font-mono px-2 py-0.2 rounded bg-indigo-500/10 text-indigo-300 border border-indigo-500/20">
          Line {activeLine + 1}
        </span>
      </div>

      {/* Code Listing */}
      <div className="p-2.5 font-mono text-[11px] overflow-y-auto flex-1 bg-slate-950/50 space-y-0.5">
        {lines.map((codeText, idx) => {
          const isActive = idx === activeLine;
          return (
            <div
              key={idx}
              className={`flex items-center gap-2 px-2 py-0.5 rounded transition-all ${
                isActive
                  ? 'bg-indigo-600/30 text-white font-semibold border-l-2 border-indigo-400 shadow-sm'
                  : 'text-slate-400 hover:bg-slate-900/40'
              }`}
            >
              <span className="w-4 text-right text-[10px] text-slate-600 select-none">
                {idx + 1}
              </span>
              <pre className="whitespace-pre leading-relaxed">{codeText}</pre>
            </div>
          );
        })}
      </div>

      {/* Live Variable Inspector Panel */}
      <div className="p-2.5 bg-slate-950/90 border-t border-slate-800 flex flex-col gap-1.5 shrink-0">
        <div className="flex items-center justify-between">
          <span className="text-[9px] font-bold text-slate-400 uppercase tracking-wider flex items-center gap-1">
            <Variable className="w-3 h-3 text-indigo-400" />
            Live State at Line {activeLine + 1}
          </span>
        </div>

        <div className="flex flex-wrap gap-1.5 max-h-20 overflow-y-auto">
          {variableBadges.length === 0 ? (
            <span className="text-[10px] text-slate-500 italic">No variables active</span>
          ) : (
            variableBadges.map((badge, idx) => (
              <div
                key={idx}
                className="flex items-center gap-1 px-2 py-0.5 rounded-md bg-slate-900 border border-slate-800 font-mono text-[10px]"
              >
                <span className="text-slate-400">{badge.name} =</span>
                <span className="text-indigo-300 font-bold">{badge.value}</span>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
};
