import React from 'react';
import { GenerateParenthesesStep } from '../../algorithms/generateParenthesesIntuitive';
import { GitBranch, CheckCircle2, ShieldCheck, Trophy, Sparkles } from 'lucide-react';

interface GenerateParenthesesViewerProps {
  step: GenerateParenthesesStep;
}

export const GenerateParenthesesViewer: React.FC<GenerateParenthesesViewerProps> = ({ step }) => {
  const { n, openCount, closeCount, currentPath, action, solutions, isComplete } = step;

  const canAddOpen = openCount < n;
  const canAddClose = closeCount < openCount;

  return (
    <div className="flex-1 min-h-0 flex flex-col bg-slate-900/60 border border-slate-800 rounded-2xl p-3 shadow-xl overflow-hidden justify-between">
      {/* Top Banner */}
      <div className="bg-slate-950/70 border border-slate-800/80 rounded-xl p-2.5 flex items-center justify-between shrink-0">
        <div className="flex items-center gap-2">
          <span className="p-1.5 rounded-lg bg-indigo-500/10 text-indigo-400 border border-indigo-500/20">
            <GitBranch className="w-4 h-4" />
          </span>
          <div>
            <h3 className="text-xs font-semibold text-white tracking-wide">{step.headline}</h3>
            <p className="text-[11px] text-slate-400">{step.subtext}</p>
          </div>
        </div>
        <div className="flex items-center gap-2">
          {isComplete ? (
            <span className="px-2 py-0.5 rounded-md bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 text-[11px] font-semibold flex items-center gap-1">
              <CheckCircle2 className="w-3.5 h-3.5" /> Total: {solutions.length}
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
        {/* Row 1: Current Path String Build & Progress */}
        <div className="bg-slate-950/60 border border-slate-800/80 rounded-xl p-3 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <span className="text-[10px] uppercase font-mono font-bold tracking-wider text-slate-400">
              Current Recursive Path:
            </span>
            <div className="flex items-center gap-1">
              {currentPath.length === 0 ? (
                <span className="text-xs text-slate-600 italic font-mono">"" (root)</span>
              ) : (
                Array.from(currentPath).map((ch, idx) => (
                  <span
                    key={idx}
                    className={`w-7 h-8 rounded-lg flex items-center justify-center font-mono text-sm font-bold border transition-all ${
                      ch === '('
                        ? 'bg-cyan-500/20 border-cyan-500/40 text-cyan-300'
                        : 'bg-indigo-500/20 border-indigo-500/40 text-indigo-300'
                    }`}
                  >
                    {ch}
                  </span>
                ))
              )}
            </div>
          </div>
          <span className="text-xs font-mono text-slate-400">
            Length: <span className="text-white font-bold">{currentPath.length}</span> / {2 * n}
          </span>
        </div>

        {/* Row 2: Invariant Rules Radar Cards */}
        <div className="grid grid-cols-2 gap-3 min-h-0">
          {/* Rule 1 Card */}
          <div
            className={`p-2.5 rounded-xl border flex flex-col justify-between transition-all ${
              canAddOpen
                ? 'bg-cyan-500/10 border-cyan-500/30'
                : 'bg-slate-950/60 border-slate-800/80 opacity-60'
            }`}
          >
            <div className="flex items-center justify-between">
              <span className="text-[10px] uppercase font-mono font-bold text-cyan-400">
                Rule 1: Append '('
              </span>
              <span className="text-xs font-mono font-bold text-white">
                open ({openCount}) &lt; n ({n})
              </span>
            </div>
            <div className="flex items-center justify-between mt-2">
              <span className="text-[11px] text-slate-400">Can branch left with '('?</span>
              <span
                className={`text-[10px] px-2 py-0.5 rounded font-bold ${
                  canAddOpen ? 'bg-cyan-500/20 text-cyan-300' : 'bg-slate-800 text-slate-500'
                }`}
              >
                {canAddOpen ? 'YES (Valid)' : 'NO (Limit Reached)'}
              </span>
            </div>
          </div>

          {/* Rule 2 Card */}
          <div
            className={`p-2.5 rounded-xl border flex flex-col justify-between transition-all ${
              canAddClose
                ? 'bg-indigo-500/10 border-indigo-500/30'
                : 'bg-slate-950/60 border-slate-800/80 opacity-60'
            }`}
          >
            <div className="flex items-center justify-between">
              <span className="text-[10px] uppercase font-mono font-bold text-indigo-400">
                Rule 2: Append ')'
              </span>
              <span className="text-xs font-mono font-bold text-white">
                close ({closeCount}) &lt; open ({openCount})
              </span>
            </div>
            <div className="flex items-center justify-between mt-2">
              <span className="text-[11px] text-slate-400">Can branch right with ')'?</span>
              <span
                className={`text-[10px] px-2 py-0.5 rounded font-bold ${
                  canAddClose ? 'bg-indigo-500/20 text-indigo-300' : 'bg-slate-800 text-slate-500'
                }`}
              >
                {canAddClose ? 'YES (Valid)' : 'NO (Unbalanced)'}
              </span>
            </div>
          </div>
        </div>

        {/* Row 3: Discovered Solutions Shelf */}
        <div className="bg-slate-950/60 border border-slate-800/80 rounded-xl p-2.5 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Trophy className="w-4 h-4 text-emerald-400" />
            <span className="text-xs font-mono font-bold text-slate-300">
              Valid Combinations Gallery:
            </span>
          </div>
          <div className="flex items-center gap-1.5 overflow-x-auto max-h-16">
            {solutions.length === 0 ? (
              <span className="text-xs text-slate-500 italic">Exploring branches...</span>
            ) : (
              solutions.map((sol, idx) => (
                <div
                  key={idx}
                  className="px-2.5 py-1 rounded-lg bg-emerald-500/20 border border-emerald-400/40 text-emerald-300 font-mono text-xs font-bold shadow-md shadow-emerald-500/10"
                >
                  "{sol}"
                </div>
              ))
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
