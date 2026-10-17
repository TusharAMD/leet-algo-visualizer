import React from 'react';
import { TaskSchedulerStep } from '../../algorithms/taskSchedulerIntuitive';
import { Cpu, CheckCircle2, Clock, Hourglass, Layers, AlertCircle } from 'lucide-react';

interface TaskSchedulerViewerProps {
  step: TaskSchedulerStep;
}

const TASK_COLORS: { [key: string]: { bg: string; border: string; text: string } } = {
  A: { bg: 'bg-indigo-500/20', border: 'border-indigo-500/40', text: 'text-indigo-300' },
  B: { bg: 'bg-cyan-500/20', border: 'border-cyan-500/40', text: 'text-cyan-300' },
  C: { bg: 'bg-emerald-500/20', border: 'border-emerald-500/40', text: 'text-emerald-300' },
  D: { bg: 'bg-amber-500/20', border: 'border-amber-500/40', text: 'text-amber-300' },
  E: { bg: 'bg-rose-500/20', border: 'border-rose-500/40', text: 'text-rose-300' },
  F: { bg: 'bg-purple-500/20', border: 'border-purple-500/40', text: 'text-purple-300' },
  IDLE: { bg: 'bg-slate-800/60', border: 'border-slate-700/60', text: 'text-slate-500' }
};

export const TaskSchedulerViewer: React.FC<TaskSchedulerViewerProps> = ({ step }) => {
  const {
    n,
    time,
    currentTaskExecuted,
    maxHeap,
    cooldownQueue,
    timeline,
    headline,
    subtext,
    isComplete,
    stepIndex,
    totalSteps
  } = step;

  const getColor = (task: string) => {
    return (
      TASK_COLORS[task] || {
        bg: 'bg-slate-700/30',
        border: 'border-slate-600',
        text: 'text-slate-300'
      }
    );
  };

  return (
    <div className="flex-1 min-h-0 flex flex-col bg-slate-900/60 border border-slate-800 rounded-2xl p-3 shadow-xl overflow-hidden justify-between">
      {/* Top Banner */}
      <div className="bg-slate-950/70 border border-slate-800/80 rounded-xl p-2.5 flex items-center justify-between shrink-0">
        <div className="flex items-center gap-2">
          <span className="p-1.5 rounded-lg bg-indigo-500/10 text-indigo-400 border border-indigo-500/20">
            <Cpu className="w-4 h-4" />
          </span>
          <div>
            <h3 className="text-xs font-semibold text-white tracking-wide">{headline}</h3>
            <p className="text-[11px] text-slate-400">{subtext}</p>
          </div>
        </div>
        <div className="flex items-center gap-2">
          {isComplete ? (
            <span className="px-2 py-0.5 rounded-md bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 text-[11px] font-semibold flex items-center gap-1">
              <CheckCircle2 className="w-3.5 h-3.5" /> Total Time: {time}
            </span>
          ) : (
            <span className="px-2 py-0.5 rounded-md bg-indigo-500/10 border border-indigo-500/20 text-indigo-400 text-[11px] font-mono">
              Step {stepIndex + 1} / {totalSteps}
            </span>
          )}
        </div>
      </div>

      {/* CPU Execution Timeline */}
      <div className="bg-slate-950/50 border border-slate-800/70 rounded-xl p-2 shrink-0">
        <div className="flex items-center justify-between mb-1.5">
          <span className="text-[10px] uppercase font-semibold text-slate-400 flex items-center gap-1">
            <Clock className="w-3 h-3 text-cyan-400" /> CPU Timeline (Clock: {time}):
          </span>
          <span className="text-[10px] text-slate-500">
            Idle cycles: {timeline.filter((t) => t.task === 'IDLE').length}
          </span>
        </div>
        <div className="flex items-center gap-1.5 overflow-x-auto pb-1 max-w-full">
          {timeline.length === 0 ? (
            <span className="text-slate-600 text-xs italic">Clock at T=0</span>
          ) : (
            timeline.map((slot, idx) => {
              const c = getColor(slot.task);
              const isLatest = idx === timeline.length - 1;
              return (
                <div
                  key={idx}
                  className={`flex flex-col items-center shrink-0 transition-all ${
                    isLatest ? 'scale-105' : ''
                  }`}
                >
                  <span className="text-[9px] font-mono text-slate-500">T{slot.time}</span>
                  <div
                    className={`w-9 h-9 rounded-lg border flex items-center justify-center font-mono font-bold text-xs ${
                      c.bg
                    } ${c.border} ${c.text} ${
                      isLatest ? 'ring-2 ring-indigo-400 ring-offset-1 ring-offset-slate-950' : ''
                    }`}
                  >
                    {slot.task === 'IDLE' ? '—' : slot.task}
                  </div>
                </div>
              );
            })
          )}
        </div>
      </div>

      {/* Main Bottom Grid: Max-Heap Ready Queue vs Cooldown Queue */}
      <div className="flex-1 min-h-0 grid grid-cols-1 md:grid-cols-12 gap-3 py-1 px-1">
        {/* Max-Heap Ready Tasks */}
        <div className="md:col-span-6 bg-slate-950/60 border border-slate-800 rounded-xl p-2.5 flex flex-col justify-between">
          <div className="flex items-center justify-between border-b border-slate-800/70 pb-1.5 shrink-0">
            <span className="text-xs font-semibold text-slate-300 flex items-center gap-1.5">
              <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
              Max-Heap (Ready to Run)
            </span>
            <span className="text-[10px] font-mono text-slate-400 bg-slate-900 px-2 py-0.5 rounded border border-slate-800">
              {maxHeap.length} distinct
            </span>
          </div>

          <div className="flex-1 flex flex-col justify-center items-center py-2">
            {maxHeap.length === 0 ? (
              <div className="text-center py-3">
                <AlertCircle className="w-6 h-6 text-amber-500/50 mx-auto mb-1" />
                <span className="text-amber-400/80 text-xs font-medium">All tasks in cooldown!</span>
                <p className="text-[10px] text-slate-500">CPU will IDLE if clock ticks</p>
              </div>
            ) : (
              <div className="flex items-center gap-2.5 flex-wrap justify-center">
                {maxHeap.map((item, idx) => {
                  const c = getColor(item.task);
                  const isTop = idx === 0;
                  return (
                    <div
                      key={item.task}
                      className={`relative flex flex-col items-center justify-center rounded-xl p-2 border transition-all ${
                        c.bg
                      } ${c.border} ${isTop ? 'ring-2 ring-emerald-400/60 shadow-lg' : ''}`}
                    >
                      {isTop && (
                        <span className="absolute -top-2 left-1/2 -translate-x-1/2 text-[8px] bg-emerald-500 text-slate-950 font-bold px-1 rounded-full">
                          TOP
                        </span>
                      )}
                      <span className={`text-base font-bold font-mono ${c.text}`}>{item.task}</span>
                      <span className="text-[10px] font-mono text-slate-400 mt-0.5">
                        qty: {item.count}
                      </span>
                    </div>
                  );
                })}
              </div>
            )}
          </div>

          <div className="text-[10px] text-slate-500 bg-slate-900/80 rounded-lg p-1.5 border border-slate-800/60 text-center shrink-0">
            Greedy strategy: Always execute task with highest remaining count first.
          </div>
        </div>

        {/* Cooldown Queue (n = ...) */}
        <div className="md:col-span-6 bg-slate-950/60 border border-slate-800 rounded-xl p-2.5 flex flex-col justify-between">
          <div className="flex items-center justify-between border-b border-slate-800/70 pb-1.5 shrink-0">
            <span className="text-xs font-semibold text-slate-300 flex items-center gap-1.5">
              <Hourglass className="w-3.5 h-3.5 text-amber-400" />
              Cooldown Queue (n = {n})
            </span>
            <span className="text-[10px] font-mono text-slate-400 bg-slate-900 px-2 py-0.5 rounded border border-slate-800">
              {cooldownQueue.length} cooling
            </span>
          </div>

          <div className="flex-1 flex flex-col justify-center items-center py-2">
            {cooldownQueue.length === 0 ? (
              <span className="text-slate-600 text-xs italic">Cooldown queue is empty</span>
            ) : (
              <div className="flex items-center gap-2 flex-wrap justify-center">
                {cooldownQueue.map((cd, idx) => {
                  const c = getColor(cd.task);
                  const isReadyNext = cd.readyTime <= time + 1;
                  return (
                    <div
                      key={idx}
                      className={`flex flex-col items-center justify-center rounded-xl p-2 border bg-slate-900/90 ${
                        isReadyNext ? 'border-amber-500/50' : 'border-slate-800'
                      }`}
                    >
                      <div className="flex items-center gap-1.5">
                        <span className={`text-sm font-bold font-mono ${c.text}`}>{cd.task}</span>
                        <span className="text-[10px] text-slate-400">(rem: {cd.count})</span>
                      </div>
                      <span className="text-[9px] font-mono text-amber-400 mt-1">
                        Ready at T={cd.readyTime + 1}
                      </span>
                    </div>
                  );
                })}
              </div>
            )}
          </div>

          <div className="text-[10px] text-slate-500 bg-slate-900/80 rounded-lg p-1.5 border border-slate-800/60 text-center shrink-0">
            FIFO queue: Re-inserted into heap as soon as time &gt;= readyTime.
          </div>
        </div>
      </div>
    </div>
  );
};
