import React from 'react';
import { EvalRpnStep } from '../../algorithms/evalRpnIntuitive';
import { Calculator, CheckCircle2, ArrowDown, Sparkles, Trophy } from 'lucide-react';

interface EvalRpnViewerProps {
  step: EvalRpnStep;
}

export const EvalRpnViewer: React.FC<EvalRpnViewerProps> = ({ step }) => {
  const { tokens, currentTokenIdx, currentToken, stack, operandA, operandB, operator, evalResult, action, isComplete } = step;

  const isOperator = currentToken === '+' || currentToken === '-' || currentToken === '*' || currentToken === '/';

  return (
    <div className="flex-1 min-h-0 flex flex-col bg-slate-900/60 border border-slate-800 rounded-2xl p-3 shadow-xl overflow-hidden justify-between">
      {/* Top Banner */}
      <div className="bg-slate-950/70 border border-slate-800/80 rounded-xl p-2.5 flex items-center justify-between shrink-0">
        <div className="flex items-center gap-2">
          <span className="p-1.5 rounded-lg bg-indigo-500/10 text-indigo-400 border border-indigo-500/20">
            <Calculator className="w-4 h-4" />
          </span>
          <div>
            <h3 className="text-xs font-semibold text-white tracking-wide">{step.headline}</h3>
            <p className="text-[11px] text-slate-400">{step.subtext}</p>
          </div>
        </div>
        <div className="flex items-center gap-2">
          {isComplete ? (
            <span className="px-2 py-0.5 rounded-md bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 text-[11px] font-semibold flex items-center gap-1">
              <CheckCircle2 className="w-3.5 h-3.5" /> Result: {evalResult}
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
        {/* Row 1: Token Strip */}
        <div className="flex flex-col gap-1.5">
          <span className="text-[10px] uppercase font-mono font-bold tracking-wider text-slate-400">
            Token Stream:
          </span>

          <div className="flex items-center gap-1.5 overflow-x-auto py-2.5 px-3 bg-slate-950/60 rounded-xl border border-slate-800/80">
            {tokens.map((tok, idx) => {
              const isCurrent = idx === currentTokenIdx;
              const isTokOp = tok === '+' || tok === '-' || tok === '*' || tok === '/';

              let tokStyle = isTokOp
                ? 'bg-amber-500/15 border-amber-500/30 text-amber-300 font-bold'
                : 'bg-slate-900 border-slate-800 text-slate-300';

              if (isCurrent) {
                tokStyle = isTokOp
                  ? 'bg-amber-500/30 border-amber-400 text-amber-200 scale-110 shadow-lg shadow-amber-500/30 font-bold'
                  : 'bg-indigo-500/30 border-indigo-400 text-indigo-200 scale-110 shadow-lg shadow-indigo-500/30 font-bold';
              }

              return (
                <div key={idx} className="flex flex-col items-center gap-1 shrink-0">
                  <div
                    className={`px-3 py-1.5 rounded-lg border font-mono text-xs transition-all ${tokStyle}`}
                  >
                    {tok}
                  </div>
                  <span className="text-[9px] font-mono text-slate-500">{idx}</span>
                </div>
              );
            })}
          </div>
        </div>

        {/* Row 2: Stack & Operation Spotlight Grid */}
        <div className="grid grid-cols-2 gap-3 min-h-0">
          {/* Operand Stack */}
          <div className="bg-slate-950/60 border border-slate-800/80 rounded-xl p-2.5 flex flex-col gap-1.5">
            <span className="text-[10px] uppercase font-mono font-bold tracking-wider text-indigo-400 flex items-center gap-1">
              <ArrowDown className="w-3 h-3" /> Operand Stack:
            </span>

            <div className="flex-1 flex flex-col-reverse gap-1 overflow-y-auto max-h-28 p-1">
              {stack.length === 0 ? (
                <span className="text-xs text-slate-600 italic my-auto">Stack empty</span>
              ) : (
                stack.map((val, idx) => {
                  const isTop = idx === stack.length - 1;
                  return (
                    <div
                      key={idx}
                      className={`px-3 py-1 rounded-lg border font-mono text-xs font-bold text-center transition-all ${
                        isTop
                          ? 'bg-indigo-500/25 border-indigo-400 text-indigo-200 shadow-md shadow-indigo-500/20'
                          : 'bg-slate-900 border-slate-800 text-slate-300'
                      }`}
                    >
                      {val} {isTop && <span className="text-[9px] text-indigo-400 uppercase ml-1">(top)</span>}
                    </div>
                  );
                })
              )}
            </div>
          </div>

          {/* Operation Spotlight */}
          <div className="bg-slate-950/60 border border-slate-800/80 rounded-xl p-2.5 flex flex-col justify-between">
            <span className="text-[10px] uppercase font-mono font-bold tracking-wider text-slate-400">
              Arithmetic Spotlight:
            </span>

            {action === 'EVAL_OP' && operandA !== null && operandB !== null && operator !== null ? (
              <div className="flex flex-col items-center justify-center gap-2 my-auto">
                <div className="flex items-center gap-2 text-sm font-mono font-bold">
                  <span className="px-2.5 py-1 rounded bg-indigo-500/20 border border-indigo-400 text-indigo-300">
                    {operandA}
                  </span>
                  <span className="text-amber-400 font-extrabold text-base">{operator}</span>
                  <span className="px-2.5 py-1 rounded bg-indigo-500/20 border border-indigo-400 text-indigo-300">
                    {operandB}
                  </span>
                  <span className="text-slate-500 font-bold">=</span>
                  <span className="px-2.5 py-1 rounded bg-emerald-500/25 border border-emerald-400 text-emerald-300 shadow-md shadow-emerald-500/20">
                    {evalResult}
                  </span>
                </div>
                <span className="text-[10px] text-slate-400 font-mono">
                  Result pushed back onto stack
                </span>
              </div>
            ) : action === 'PUSH_NUM' ? (
              <div className="flex flex-col items-center justify-center my-auto gap-1">
                <span className="text-xs font-mono text-slate-400">Pushed number to stack</span>
                <span className="text-lg font-mono font-bold text-indigo-300">
                  {currentToken}
                </span>
              </div>
            ) : (
              <div className="flex items-center justify-center my-auto text-xs text-slate-500 italic">
                Awaiting operator evaluation...
              </div>
            )}
          </div>
        </div>

        {/* Row 3: Result Banner */}
        <div className="bg-slate-950/60 border border-slate-800/80 rounded-xl p-2.5 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Trophy className="w-4 h-4 text-emerald-400" />
            <span className="text-xs font-mono font-bold text-slate-300">
              Evaluated RPN Expression Value:
            </span>
          </div>
          <div className="flex items-center gap-2">
            <span className="px-3 py-0.5 rounded-lg bg-emerald-500/20 border border-emerald-400/40 text-emerald-300 font-mono text-sm font-bold shadow-md shadow-emerald-500/10">
              {evalResult !== null ? evalResult : 'In Progress...'}
            </span>
          </div>
        </div>
      </div>
    </div>
  );
};
