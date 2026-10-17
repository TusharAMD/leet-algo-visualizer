import React from 'react';
import type { MeetingRoomsStep, Interval } from '../../algorithms/meetingRoomsIntuitive';
import { HelpCircle, CheckCircle2, XCircle } from 'lucide-react';

interface MeetingRoomsViewerProps {
  step: MeetingRoomsStep;
  rawIntervals: Interval[];
}

export const MeetingRoomsViewer: React.FC<MeetingRoomsViewerProps> = ({
  step,
  rawIntervals,
}) => {
  const allPoints: number[] = [0];
  rawIntervals.forEach(([s, e]) => allPoints.push(s, e));
  const minCoord = Math.min(0, ...allPoints);
  const maxCoord = Math.max(20, ...allPoints) + 1;
  const range = Math.max(1, maxCoord - minCoord);

  const getPercentLeft = (val: number) => {
    return `${Math.max(2, Math.min(96, ((val - minCoord) / range) * 90 + 5))}%`;
  };

  const getPercentWidth = (start: number, end: number) => {
    const w = ((end - start) / range) * 90;
    return `${Math.max(5, Math.min(95, w))}%`;
  };

  return (
    <div className="flex flex-col h-full gap-3 p-4 select-none">
      {/* Top Status & Variable Badges */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
        <div className="bg-slate-900 border border-slate-800 rounded-xl p-3 flex flex-col justify-center">
          <span className="text-xs text-slate-400 font-medium">Checking Pair</span>
          <span className="text-base font-mono font-bold text-sky-400">
            {step.previousMeeting && step.currentMeeting
              ? `i=${step.currentIndex}`
              : 'Initial / Done'}
          </span>
        </div>
        <div className="bg-slate-900 border border-slate-800 rounded-xl p-3 flex flex-col justify-center">
          <span className="text-xs text-slate-400 font-medium">Adjacent Times</span>
          <span className="text-xs font-mono font-bold text-amber-300">
            {step.previousMeeting && step.currentMeeting
              ? `prev.end=${step.previousMeeting[1]} vs curr.start=${step.currentMeeting[0]}`
              : '—'}
          </span>
        </div>
        <div className="bg-slate-900 border border-slate-800 rounded-xl p-3 flex flex-col justify-center">
          <span className="text-xs text-slate-400 font-medium">Collision?</span>
          <span
            className={`text-sm font-semibold flex items-center gap-1 ${
              step.hasConflict ? 'text-rose-400' : 'text-emerald-400'
            }`}
          >
            {step.hasConflict ? 'Time Collision!' : 'Clear'}
          </span>
        </div>
        <div className="bg-slate-900 border border-slate-800 rounded-xl p-3 flex flex-col justify-center">
          <span className="text-xs text-slate-400 font-medium">Can Attend All?</span>
          <div className="flex items-center gap-1.5 mt-0.5">
            {step.canAttend === null ? (
              <span className="text-sm font-bold text-sky-400">Checking...</span>
            ) : step.canAttend ? (
              <span className="text-sm font-bold text-emerald-400 flex items-center gap-1">
                <CheckCircle2 className="w-4 h-4" /> True (Feasible)
              </span>
            ) : (
              <span className="text-sm font-bold text-rose-400 flex items-center gap-1">
                <XCircle className="w-4 h-4" /> False (Conflict)
              </span>
            )}
          </div>
        </div>
      </div>

      {/* Main Coordinate Canvas */}
      <div className="flex-1 bg-slate-900/60 border border-slate-800 rounded-xl p-5 flex flex-col justify-between gap-5 relative overflow-hidden">
        <div className="flex flex-col gap-6 w-full">
          {/* Axis Ticks */}
          <div className="relative h-6 border-b border-slate-800/80 w-full">
            {Array.from({ length: maxCoord - minCoord + 1 }, (_, idx) => {
              const val = minCoord + idx;
              if (maxCoord > 20 && val % 5 !== 0 && val !== maxCoord) return null;
              return (
                <div
                  key={val}
                  className="absolute flex flex-col items-center -translate-x-1/2"
                  style={{ left: getPercentLeft(val) }}
                >
                  <div className="w-0.5 h-2 bg-slate-700" />
                  <span className="text-[10px] font-mono text-slate-400">{val}</span>
                </div>
              );
            })}
          </div>

          {/* Meeting Schedule Timeline */}
          <div className="flex flex-col gap-2">
            <div className="text-xs font-semibold text-slate-400 uppercase tracking-wider flex items-center justify-between">
              <span>Calendar Schedule (Sorted by Start Time)</span>
              <span className="text-[11px] text-slate-500 font-normal">
                {step.intervals.length} scheduled meetings
              </span>
            </div>
            <div className="relative h-32 bg-slate-950/70 border border-slate-800 rounded-xl flex items-center px-2 overflow-hidden">
              {step.intervals.map(([s, e], idx) => {
                const isCurrent = idx === step.currentIndex;
                const isPrev = idx === step.currentIndex - 1;

                let colorClasses = 'bg-slate-800/80 border-slate-700 text-slate-300';
                if (isCurrent && step.hasConflict) {
                  colorClasses = 'bg-rose-600 border-rose-300 text-white shadow-lg shadow-rose-500/30 scale-105 z-20';
                } else if (isPrev && step.hasConflict) {
                  colorClasses = 'bg-rose-950/90 border-rose-500 text-rose-200 z-10';
                } else if (isCurrent) {
                  colorClasses = 'bg-sky-600 border-sky-300 text-white shadow-lg shadow-sky-500/30 scale-105 z-20';
                } else if (isPrev) {
                  colorClasses = 'bg-indigo-950/80 border-indigo-400 text-indigo-200 z-10';
                } else if (idx < step.currentIndex) {
                  colorClasses = 'bg-emerald-950/60 border-emerald-600 text-emerald-300';
                }

                // Stagger timeline
                const topOffset = (idx % 3) * 34 + 8;

                return (
                  <div
                    key={idx}
                    className={`absolute h-7 rounded-lg border font-mono text-xs font-bold flex items-center justify-center transition-all duration-300 ${colorClasses}`}
                    style={{
                      left: getPercentLeft(s),
                      width: getPercentWidth(s, e),
                      top: `${topOffset}px`,
                    }}
                  >
                    <span>Meeting {idx + 1}: [{s},{e}]</span>
                  </div>
                );
              })}
            </div>
          </div>
        </div>

        {/* Bottom Explanation Banner */}
        <div className="w-full bg-slate-950/80 border border-slate-800/80 rounded-xl px-4 py-2.5 text-xs text-slate-300 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <HelpCircle className="w-4 h-4 text-indigo-400 shrink-0" />
            <span>{step.explanation}</span>
          </div>
          {step.canAttend !== null && (
            <span
              className={`font-semibold flex items-center gap-1 shrink-0 ${
                step.canAttend ? 'text-emerald-400' : 'text-rose-400'
              }`}
            >
              {step.canAttend ? <CheckCircle2 className="w-4 h-4" /> : <XCircle className="w-4 h-4" />}
              {step.canAttend ? 'Feasible' : 'Overlap Conflict'}
            </span>
          )}
        </div>
      </div>
    </div>
  );
};
