import React from 'react';
import { TimeMapStep } from '../../algorithms/timeMapIntuitive';
import { Database, Clock, CheckCircle2, Search, Sparkles } from 'lucide-react';

interface TimeMapViewerProps {
  step: TimeMapStep;
}

export const TimeMapViewer: React.FC<TimeMapViewerProps> = ({ step }) => {
  const { operation, store, currentKey, queryTimestamp, left, right, mid, activeCandidate, foundValue, isComplete } = step;

  const records = store[currentKey] || [];

  return (
    <div className="flex-1 min-h-0 flex flex-col bg-slate-900/60 border border-slate-800 rounded-2xl p-3 shadow-xl overflow-hidden justify-between">
      {/* Top Banner */}
      <div className="bg-slate-950/70 border border-slate-800/80 rounded-xl p-2.5 flex items-center justify-between shrink-0">
        <div className="flex items-center gap-2">
          <span className="p-1.5 rounded-lg bg-indigo-500/10 text-indigo-400 border border-indigo-500/20">
            <Clock className="w-4 h-4" />
          </span>
          <div>
            <h3 className="text-xs font-semibold text-white tracking-wide">{step.headline}</h3>
            <p className="text-[11px] text-slate-400">{step.subtext}</p>
          </div>
        </div>
        <div className="flex items-center gap-2">
          {isComplete ? (
            <span className="px-2 py-0.5 rounded-md bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 text-[11px] font-semibold flex items-center gap-1">
              <CheckCircle2 className="w-3.5 h-3.5" /> O(log N) Queries Verified
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
        {/* Row 1: Key Directory & Active Key Timeline */}
        <div className="bg-slate-950/60 border border-slate-800/80 rounded-xl p-2.5 flex flex-col gap-2">
          <div className="flex items-center justify-between">
            <span className="text-[10px] uppercase font-mono font-bold tracking-wider text-slate-400 flex items-center gap-1.5">
              <Database className="w-3.5 h-3.5 text-indigo-400" /> Active Key Timeline: "{currentKey}"
            </span>
            <span className="text-[10px] font-mono text-slate-400">
              Query Timestamp: <span className="text-amber-400 font-bold">t = {queryTimestamp}</span>
            </span>
          </div>

          {/* Timeline Cards */}
          <div className="flex items-center gap-2 overflow-x-auto py-2">
            {records.length === 0 ? (
              <span className="text-xs text-slate-500 italic">No records for key "{currentKey}"</span>
            ) : (
              records.map((rec, idx) => {
                const isMid = mid === idx;
                const inRange = idx >= left && idx <= right;
                const isMatchCandidate = activeCandidate === rec.value;

                let cardStyle = 'bg-slate-900 border-slate-800 text-slate-500 opacity-40';
                if (inRange) {
                  cardStyle = 'bg-slate-900 border-slate-700 text-slate-300';
                }

                if (isMid) {
                  cardStyle = 'bg-amber-500/30 border-amber-400 text-amber-200 scale-105 shadow-lg shadow-amber-500/20 ring-2 ring-amber-400';
                } else if (isMatchCandidate && !isMid) {
                  cardStyle = 'bg-emerald-500/25 border-emerald-400 text-emerald-200';
                }

                return (
                  <div key={idx} className="flex flex-col items-center gap-1 shrink-0">
                    {/* Pointer Tag */}
                    <div className="h-4 flex items-center justify-center text-[10px] font-mono font-bold">
                      {isMid ? (
                        <span className="text-amber-400">MID</span>
                      ) : idx === left ? (
                        <span className="text-cyan-400">L</span>
                      ) : idx === right ? (
                        <span className="text-pink-400">R</span>
                      ) : null}
                    </div>

                    {/* Timeline Node */}
                    <div
                      className={`px-3 py-2 rounded-xl border font-mono text-xs flex flex-col items-center transition-all ${cardStyle}`}
                    >
                      <span className="text-[9px] text-slate-400 font-bold">t = {rec.timestamp}</span>
                      <span className="text-white font-bold text-sm mt-0.5">"{rec.value}"</span>
                    </div>

                    <span className="text-[9px] font-mono text-slate-500">{idx}</span>
                  </div>
                );
              })
            )}
          </div>
        </div>

        {/* Row 2: Spotlight Result Card */}
        <div className="bg-slate-950/60 border border-slate-800/80 rounded-xl p-2.5 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Search className="w-4 h-4 text-emerald-400" />
            <span className="text-xs font-mono font-bold text-slate-300">
              Retrieved Value for get("{currentKey}", t={queryTimestamp}):
            </span>
          </div>

          <div className="flex items-center gap-2">
            <span className="px-3 py-0.5 rounded-lg bg-emerald-500/20 border border-emerald-400/40 text-emerald-300 font-mono text-sm font-bold shadow-md shadow-emerald-500/10">
              "{foundValue || (activeCandidate ? activeCandidate : '""')}"
            </span>
          </div>
        </div>
      </div>
    </div>
  );
};
