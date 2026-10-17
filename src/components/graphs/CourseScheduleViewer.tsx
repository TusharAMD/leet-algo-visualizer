import React from 'react';
import { CourseScheduleStep } from '../../algorithms/courseScheduleIntuitive';
import { GraduationCap, CheckCircle2, XCircle, ArrowRight, BookOpen, AlertOctagon } from 'lucide-react';

interface CourseScheduleViewerProps {
  step: CourseScheduleStep;
}

export const CourseScheduleViewer: React.FC<CourseScheduleViewerProps> = ({ step }) => {
  const { numCourses, inDegree, queue, takenCourses, activeCourse, decrementedCourse, prerequisites } = step;

  // Node circular layout positions
  const getPosition = (index: number, total: number) => {
    const angle = (index / total) * 2 * Math.PI - Math.PI / 2;
    const rx = 36; // percentage radius
    const ry = 30;
    return {
      x: 50 + rx * Math.cos(angle),
      y: 50 + ry * Math.sin(angle)
    };
  };

  const positions = Array.from({ length: numCourses }).map((_, idx) =>
    getPosition(idx, numCourses)
  );

  return (
    <div className="flex-1 min-h-0 flex flex-col bg-slate-900/60 border border-slate-800 rounded-2xl p-3 shadow-xl overflow-hidden justify-between">
      {/* Top Banner */}
      <div className="bg-slate-950/70 border border-slate-800/80 rounded-xl p-2.5 flex items-center justify-between shrink-0">
        <div className="flex items-center gap-2">
          <span className="p-1.5 rounded-lg bg-indigo-500/10 text-indigo-400 border border-indigo-500/20">
            <GraduationCap className="w-4 h-4" />
          </span>
          <div>
            <h3 className="text-xs font-semibold text-white tracking-wide">{step.headline}</h3>
            <p className="text-[11px] text-slate-400">{step.subtext}</p>
          </div>
        </div>
        <div className="flex items-center gap-2">
          {step.isComplete ? (
            step.canFinish ? (
              <span className="px-2 py-0.5 rounded-md bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 text-[11px] font-semibold flex items-center gap-1">
                <CheckCircle2 className="w-3.5 h-3.5" /> All Courses Finished
              </span>
            ) : (
              <span className="px-2 py-0.5 rounded-md bg-rose-500/10 border border-rose-500/20 text-rose-400 text-[11px] font-semibold flex items-center gap-1">
                <AlertOctagon className="w-3.5 h-3.5" /> Cycle Deadlock
              </span>
            )
          ) : (
            <span className="px-2 py-0.5 rounded-md bg-indigo-500/10 border border-indigo-500/20 text-indigo-400 text-[11px] font-mono">
              Step {step.stepIndex + 1} / {step.totalSteps}
            </span>
          )}
        </div>
      </div>

      {/* Main Graph Canvas */}
      <div className="flex-1 min-h-0 relative w-full flex items-center justify-center p-2">
        <svg className="absolute inset-0 w-full h-full pointer-events-none">
          <defs>
            <marker
              id="arrow"
              viewBox="0 0 10 10"
              refX="18"
              refY="5"
              markerWidth="6"
              markerHeight="6"
              orient="auto-start-reverse"
            >
              <path d="M 0 0 L 10 5 L 0 10 z" fill="#64748b" />
            </marker>
          </defs>

          {prerequisites.map(([crs, pre], idx) => {
            const p1 = positions[pre];
            const p2 = positions[crs];
            if (!p1 || !p2) return null;

            const isEdgeActive = activeCourse === pre && decrementedCourse === crs;

            return (
              <line
                key={`edge-${idx}`}
                x1={`${p1.x}%`}
                y1={`${p1.y}%`}
                x2={`${p2.x}%`}
                y2={`${p2.y}%`}
                stroke={isEdgeActive ? '#818cf8' : '#334155'}
                strokeWidth={isEdgeActive ? '3' : '2'}
                strokeDasharray={isEdgeActive ? '4 2' : 'none'}
                markerEnd="url(#arrow)"
              />
            );
          })}
        </svg>

        {/* Course Nodes */}
        <div className="absolute inset-0">
          {positions.map((pos, idx) => {
            const isTaken = takenCourses.includes(idx);
            const isActive = activeCourse === idx;
            const isDecremented = decrementedCourse === idx;
            const inQ = queue.includes(idx);
            const deg = inDegree[idx];

            return (
              <div
                key={idx}
                style={{
                  left: `${pos.x}%`,
                  top: `${pos.y}%`,
                  transform: 'translate(-50%, -50%)',
                }}
                className={`absolute w-16 h-16 rounded-2xl border-2 flex flex-col items-center justify-center transition-all duration-300 shadow-lg ${
                  isActive
                    ? 'border-indigo-400 bg-indigo-950/90 text-white scale-115 ring-2 ring-indigo-400 z-20 shadow-indigo-500/30'
                    : isTaken
                    ? 'border-emerald-500 bg-emerald-950/70 text-emerald-300 z-10'
                    : isDecremented
                    ? 'border-cyan-400 bg-cyan-950/80 text-cyan-200 scale-105 z-10 animate-pulse'
                    : inQ
                    ? 'border-amber-400 bg-amber-950/60 text-amber-200'
                    : 'border-slate-700 bg-slate-900/90 text-slate-300'
                }`}
              >
                <span className="text-[10px] font-mono text-slate-400">Course</span>
                <span className="text-base font-bold font-mono text-white">{idx}</span>
                <span
                  className={`text-[9px] font-mono px-1 rounded mt-0.5 ${
                    deg === 0 ? 'bg-emerald-500/20 text-emerald-300' : 'bg-slate-800 text-slate-400'
                  }`}
                >
                  in-deg: {deg}
                </span>

                {isTaken && (
                  <span className="absolute -top-2.5 px-1 py-0.2 rounded bg-emerald-500 text-[8px] font-bold text-slate-950 uppercase tracking-wider flex items-center gap-0.5 shadow">
                    ✓ Done
                  </span>
                )}
                {inQ && !isTaken && (
                  <span className="absolute -top-2.5 px-1 py-0.2 rounded bg-amber-500 text-[8px] font-bold text-slate-950 uppercase tracking-wider shadow">
                    Ready
                  </span>
                )}
              </div>
            );
          })}
        </div>
      </div>

      {/* Course Completion Rack & Queue Status */}
      <div className="bg-slate-950/80 border border-slate-800/80 rounded-xl p-2.5 flex items-center justify-between gap-3 text-xs shrink-0">
        <div className="flex items-center gap-2">
          <span className="text-indigo-400 font-bold font-mono flex items-center gap-1">
            <BookOpen className="w-3.5 h-3.5" /> Completed:
          </span>
          <div className="flex items-center gap-1">
            {takenCourses.length === 0 ? (
              <span className="text-slate-500 italic text-[11px]">None taken yet...</span>
            ) : (
              takenCourses.map((crs) => (
                <span
                  key={crs}
                  className="px-2 py-0.5 rounded bg-emerald-500/20 border border-emerald-500/30 text-emerald-300 font-mono font-bold text-[11px]"
                >
                  C{crs}
                </span>
              ))
            )}
          </div>
        </div>

        <div className="flex items-center gap-3 shrink-0 text-[11px] font-mono text-slate-400">
          <span>
            Queue: <strong className="text-white">[{queue.map((c) => `C${c}`).join(', ')}]</strong>
          </span>
          <span className="text-slate-400">
            Progress: <strong className="text-emerald-400">{takenCourses.length}</strong> / {numCourses}
          </span>
        </div>
      </div>
    </div>
  );
};
