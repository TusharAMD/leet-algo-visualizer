import React from 'react';
import { ProductExceptSelfStep } from '../../algorithms/productExceptSelfIntuitive';
import { Repeat, CheckCircle2, ArrowRight, ArrowLeft, Calculator } from 'lucide-react';

interface ProductExceptSelfViewerProps {
  step: ProductExceptSelfStep;
  nums: number[];
}

export const ProductExceptSelfViewer: React.FC<ProductExceptSelfViewerProps> = ({ step, nums }) => {
  const { phase, currentIndex, prefix, postfix, res, isComplete } = step;

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
              <CheckCircle2 className="w-3.5 h-3.5" /> Output Ready
            </span>
          ) : (
            <span className="px-2 py-0.5 rounded-md bg-indigo-500/10 border border-indigo-500/20 text-indigo-400 text-[11px] font-mono">
              Step {step.stepIndex + 1} / {step.totalSteps}
            </span>
          )}
        </div>
      </div>

      {/* Main Dual Waves Arena */}
      <div className="flex-1 min-h-0 flex flex-col justify-center gap-3 py-2 px-3">
        {/* Input Array Strip */}
        <div className="flex flex-col gap-1">
          <div className="flex items-center justify-between">
            <span className="text-[10px] uppercase font-mono font-bold tracking-wider text-slate-400">
              Input Array nums:
            </span>
            {phase === 'prefix' && (
              <span className="text-[10px] font-mono font-bold text-cyan-400 flex items-center gap-1">
                <ArrowRight className="w-3 h-3" /> Prefix Wave Passing (Left ➔ Right)
              </span>
            )}
            {phase === 'postfix' && (
              <span className="text-[10px] font-mono font-bold text-amber-400 flex items-center gap-1">
                <ArrowLeft className="w-3 h-3" /> Postfix Wave Passing (Right ➔ Left)
              </span>
            )}
          </div>

          <div className="flex items-center gap-2 overflow-x-auto pb-1">
            {nums.map((num, idx) => {
              const isActive = currentIndex === idx;

              return (
                <div key={idx} className="flex flex-col items-center">
                  <div
                    className={`w-12 h-12 md:w-14 md:h-14 rounded-2xl border-2 flex flex-col items-center justify-center transition-all duration-300 relative ${
                      isActive
                        ? phase === 'prefix'
                          ? 'border-cyan-400 bg-cyan-950/80 ring-2 ring-cyan-400 scale-105 shadow-md shadow-cyan-500/20'
                          : 'border-amber-400 bg-amber-950/80 ring-2 ring-amber-400 scale-105 shadow-md shadow-amber-500/20'
                        : 'border-slate-800 bg-slate-950/80 text-slate-400'
                    }`}
                  >
                    <span className="text-[9px] font-mono text-slate-500">[{idx}]</span>
                    <span className="text-base font-bold font-mono text-white">{num}</span>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Accumulators Gauge Strip */}
        <div className="bg-slate-950/60 border border-slate-800/80 rounded-xl p-2.5 flex items-center justify-between gap-3 text-xs font-mono">
          <div className="flex items-center gap-2">
            <span className="text-slate-400">Current Left Prefix Accumulator:</span>
            <span className="text-cyan-400 font-bold px-2 py-0.5 rounded bg-cyan-500/10 border border-cyan-500/30">
              {prefix}
            </span>
          </div>
          <div className="flex items-center gap-2">
            <span className="text-slate-400">Current Right Postfix Accumulator:</span>
            <span className="text-amber-400 font-bold px-2 py-0.5 rounded bg-amber-500/10 border border-amber-500/30">
              {postfix}
            </span>
          </div>
        </div>

        {/* Output Array Result Rack */}
        <div className="bg-slate-950/80 border border-slate-800/80 rounded-xl p-3 flex flex-col gap-2">
          <div className="flex items-center justify-between text-xs">
            <span className="text-indigo-400 font-bold font-mono flex items-center gap-1.5">
              <Repeat className="w-3.5 h-3.5" /> Output Array (res[i] = Left × Right):
            </span>
            <span className="text-[11px] font-mono text-slate-500">
              No division operator used
            </span>
          </div>

          <div className="flex items-center gap-2 overflow-x-auto pb-1">
            {res.map((val, idx) => {
              const isActive = currentIndex === idx;
              return (
                <div key={idx} className="flex flex-col items-center">
                  <div
                    className={`w-12 h-12 md:w-14 md:h-14 rounded-2xl border-2 flex flex-col items-center justify-center font-mono transition-all duration-300 ${
                      isActive
                        ? 'border-indigo-400 bg-indigo-950/90 text-white scale-110 ring-2 ring-indigo-400 shadow-lg shadow-indigo-500/30'
                        : isComplete
                        ? 'border-emerald-500/60 bg-emerald-950/40 text-emerald-300'
                        : 'border-slate-800 bg-slate-900/60 text-slate-300'
                    }`}
                  >
                    <span className="text-[9px] text-slate-500">res[{idx}]</span>
                    <span className="text-sm font-bold">{val}</span>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>

      {/* Mental Model Explainer Card */}
      <div className="bg-slate-950/80 border border-slate-800/80 rounded-xl p-2.5 flex items-center justify-between gap-3 text-xs shrink-0">
        <div className="flex items-center gap-2">
          <span className="text-indigo-400 font-bold font-mono">Two Waves:</span>
          <span className="text-slate-300">
            Every element's product is simply (everything to its left) $\times$ (everything to its right). Two simple linear sweeps calculate all entries without dividing!
          </span>
        </div>
        <div className="flex items-center gap-3 shrink-0 text-[11px] font-mono text-slate-400">
          <span className="text-emerald-400 font-bold">Time: O(n)</span>
          <span className="text-indigo-400 font-bold">Space: O(1) extra</span>
        </div>
      </div>
    </div>
  );
};
