import React from 'react';
import { CourseScheduleTwoStep } from '../../algorithms/courseScheduleTwoIntuitive';
import { GraduationCap, CheckCircle2, AlertTriangle, Layers, ArrowRight, BookOpen } from 'lucide-react';

interface CourseScheduleTwoViewerProps {
  step: CourseScheduleTwoStep;
}

export const CourseScheduleTwoViewer: React.FC<CourseScheduleTwoViewerProps> = ({ step }) => {
  const {
    numCourses,
    prerequisites,
    inDegree,
    queue,
    order,
    activeCourse,
    activeNeighbor,
    headline,
    subtext,
    isComplete,
    hasCycle,
    stepIndex,
    totalSteps
  } = step;

  // Node layout in circle or 2 rows
  const radius = 130;
  const centerX = 200;
  const centerY = 150;

  const nodePositions = Array.from({ length: numCourses }).map((_, i) => {
    const angle = (2 * Math.PI * i) / numCourses - Math.PI / 2;
    return {
      id: i,
      x: centerX + radius * Math.cos(angle),
      y: centerY + radius * Math.sin(angle)
    };
  });

  const isTaken = (c: number) => order.includes(c);
  const isInQueue = (c: number) => queue.includes(c);

  return (
    <div className="flex-1 min-h-0 flex flex-col bg-slate-900/60 border border-slate-800 rounded-2xl p-3 shadow-xl overflow-hidden justify-between">
      {/* Top Banner */}
      <div className="bg-slate-950/70 border border-slate-800/80 rounded-xl p-2.5 flex items-center justify-between shrink-0">
        <div className="flex items-center gap-2">
          <span className="p-1.5 rounded-lg bg-indigo-500/10 text-indigo-400 border border-indigo-500/20">
            <GraduationCap className="w-4 h-4" />
          </span>
          <div>
            <h3 className="text-xs font-semibold text-white tracking-wide">{headline}</h3>
            <p className="text-[11px] text-slate-400">{subtext}</p>
          </div>
        </div>
        <div className="flex items-center gap-2">
          {isComplete ? (
            !hasCycle ? (
              <span className="px-2.5 py-0.5 rounded-md bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 text-xs font-mono font-bold flex items-center gap-1">
                <CheckCircle2 className="w-3.5 h-3.5" /> All {numCourses} Scheduled
              </span>
            ) : (
              <span className="px-2.5 py-0.5 rounded-md bg-rose-500/10 border border-rose-500/20 text-rose-400 text-xs font-mono font-bold flex items-center gap-1">
                <AlertTriangle className="w-3.5 h-3.5" /> Cycle Detected
              </span>
            )
          ) : (
            <span className="px-2 py-0.5 rounded-md bg-indigo-500/10 border border-indigo-500/20 text-indigo-400 text-[11px] font-mono">
              Step {stepIndex + 1} / {totalSteps}
            </span>
          )}
        </div>
      </div>

      {/* Main Arena */}
      <div className="flex-1 min-h-0 grid grid-cols-1 md:grid-cols-12 gap-3 py-1 px-1">
        {/* Left: DAG SVG Visualizer */}
        <div className="md:col-span-8 flex flex-col items-center justify-center p-2 rounded-xl bg-slate-950/40 border border-slate-800/60 relative overflow-hidden">
          <svg className="w-full h-full max-h-[300px]" viewBox="0 0 400 300">
            <defs>
              <marker
                id="arrow"
                viewBox="0 0 10 10"
                refX="22"
                refY="5"
                markerWidth="6"
                markerHeight="6"
                orient="auto-start-reverse"
              >
                <path d="M 0 1 L 10 5 L 0 9 z" fill="#64748b" />
              </marker>
              <marker
                id="arrow-active"
                viewBox="0 0 10 10"
                refX="22"
                refY="5"
                markerWidth="6"
                markerHeight="6"
                orient="auto-start-reverse"
              >
                <path d="M 0 1 L 10 5 L 0 9 z" fill="#818cf8" />
              </marker>
            </defs>

            {/* Directed Edges (pre -> crs) */}
            {prerequisites.map(([crs, pre], idx) => {
              const fromNode = nodePositions[pre];
              const toNode = nodePositions[crs];
              if (!fromNode || !toNode) return null;

              const isEdgeActive = activeCourse === pre && activeNeighbor === crs;
              const isSourceDone = isTaken(pre);

              return (
                <line
                  key={idx}
                  x1={fromNode.x}
                  y1={fromNode.y}
                  x2={toNode.x}
                  y2={toNode.y}
                  stroke={isEdgeActive ? '#818cf8' : isSourceDone ? '#10b981' : '#334155'}
                  strokeWidth={isEdgeActive ? '3' : '1.5'}
                  strokeDasharray={isSourceDone && !isEdgeActive ? '3 3' : undefined}
                  markerEnd={isEdgeActive ? 'url(#arrow-active)' : 'url(#arrow)'}
                  className="transition-all duration-300"
                />
              );
            })}

            {/* Nodes */}
            {nodePositions.map((node) => {
              const id = node.id;
              const isActive = activeCourse === id;
              const isNeighbor = activeNeighbor === id;
              const taken = isTaken(id);
              const queued = isInQueue(id);
              const deg = inDegree[id] ?? 0;

              let fillColor = '#0f172a';
              let strokeColor = '#334155';
              let textColor = '#94a3b8';

              if (taken) {
                fillColor = '#064e3b';
                strokeColor = '#10b981';
                textColor = '#6ee7b7';
              } else if (isActive) {
                fillColor = '#312e81';
                strokeColor = '#6366f1';
                textColor = '#ffffff';
              } else if (queued) {
                fillColor = '#1e1b4b';
                strokeColor = '#818cf8';
                textColor = '#c7d2fe';
              } else if (isNeighbor) {
                fillColor = '#451a03';
                strokeColor = '#f59e0b';
                textColor = '#fde68a';
              }

              return (
                <g key={id} className="transition-all duration-300">
                  {/* Outer circle */}
                  <circle
                    cx={node.x}
                    cy={node.y}
                    r="20"
                    fill={fillColor}
                    stroke={strokeColor}
                    strokeWidth={isActive ? '3' : '2'}
                  />

                  {/* Course Number */}
                  <text
                    x={node.x}
                    y={node.y + 4}
                    textAnchor="middle"
                    fill={textColor}
                    fontSize="13"
                    fontFamily="monospace"
                    fontWeight="bold"
                  >
                    {id}
                  </text>

                  {/* In-Degree Badge */}
                  <rect
                    x={node.x + 10}
                    y={node.y - 20}
                    width="18"
                    height="14"
                    rx="4"
                    fill={deg === 0 ? '#10b981' : '#475569'}
                  />
                  <text
                    x={node.x + 19}
                    y={node.y - 9}
                    textAnchor="middle"
                    fill="#ffffff"
                    fontSize="9"
                    fontFamily="monospace"
                    fontWeight="bold"
                  >
                    {deg}
                  </text>
                </g>
              );
            })}
          </svg>
        </div>

        {/* Right: Order Timeline & Queue */}
        <div className="md:col-span-4 flex flex-col gap-2 min-h-0">
          {/* Order Sequence Card */}
          <div className="bg-slate-950/40 border border-slate-800/60 rounded-xl p-2.5 flex flex-col gap-1.5 shrink-0">
            <span className="text-[10px] uppercase font-bold text-slate-400 tracking-wider flex items-center gap-1">
              <BookOpen className="w-3 h-3 text-emerald-400" /> Topological Graduation Order
            </span>
            <div className="flex items-center gap-1.5 overflow-x-auto p-1.5 bg-slate-900/70 border border-slate-800 rounded-lg min-h-[38px]">
              {order.length === 0 ? (
                <span className="text-[11px] text-slate-500 italic">No courses taken yet</span>
              ) : (
                order.map((c, idx) => (
                  <React.Fragment key={c}>
                    <span className="px-2 py-0.5 rounded bg-emerald-500/20 text-emerald-300 border border-emerald-500/40 text-xs font-mono font-bold shrink-0">
                      {c}
                    </span>
                    {idx < order.length - 1 && (
                      <ArrowRight className="w-3 h-3 text-slate-600 shrink-0" />
                    )}
                  </React.Fragment>
                ))
              )}
            </div>
          </div>

          {/* BFS Queue */}
          <div className="bg-slate-950/40 border border-slate-800/60 rounded-xl p-2.5 flex flex-col gap-1.5 flex-1 min-h-0 overflow-y-auto">
            <div className="flex items-center justify-between">
              <span className="text-[10px] uppercase font-bold text-slate-400 tracking-wider flex items-center gap-1">
                <Layers className="w-3 h-3 text-indigo-400" /> In-Degree 0 Ready Queue
              </span>
              <span className="text-[10px] font-mono text-indigo-300">
                {queue.length} ready
              </span>
            </div>

            <div className="flex flex-wrap gap-1.5">
              {queue.length === 0 ? (
                <span className="text-[11px] text-slate-500 italic">Queue is empty</span>
              ) : (
                queue.map((c, idx) => (
                  <span
                    key={c}
                    className={`px-2 py-0.5 rounded text-[11px] font-mono border ${
                      idx === 0
                        ? 'bg-indigo-500/20 text-indigo-300 border-indigo-500/40 ring-1 ring-indigo-400'
                        : 'bg-slate-800 text-slate-400 border-slate-700'
                    }`}
                  >
                    Course {c}
                  </span>
                ))
              )}
            </div>

            <div className="mt-auto p-2 rounded-lg bg-slate-900/60 border border-slate-800 text-[11px] text-slate-300 space-y-1">
              <div className="font-semibold text-indigo-300">Kahn's Principle:</div>
              <div className="text-[10px] text-slate-400">
                Courses whose prerequisite count drops to 0 are unlocked and immediately scheduled.
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Legend */}
      <div className="flex items-center justify-between bg-slate-950/60 border border-slate-800/60 rounded-xl px-3 py-1.5 shrink-0 text-xs">
        <div className="flex items-center gap-3">
          <div className="flex items-center gap-1.5">
            <span className="w-3 h-3 rounded-full bg-emerald-950 border border-emerald-500" />
            <span className="text-emerald-300 text-[11px]">Completed</span>
          </div>
          <div className="flex items-center gap-1.5">
            <span className="w-3 h-3 rounded-full bg-indigo-900 border border-indigo-400" />
            <span className="text-indigo-300 text-[11px]">Active</span>
          </div>
          <div className="flex items-center gap-1.5">
            <span className="w-3 h-3 rounded-full bg-slate-900 border border-slate-700" />
            <span className="text-slate-400 text-[11px]">Pending (In-degree &gt; 0)</span>
          </div>
        </div>

        {isComplete && (
          <div className="flex items-center gap-1 text-[11px] font-semibold">
            {!hasCycle ? (
              <span className="text-emerald-400 flex items-center gap-1">
                <CheckCircle2 className="w-3.5 h-3.5" /> Valid Topological Order Found
              </span>
            ) : (
              <span className="text-rose-400 flex items-center gap-1">
                <AlertTriangle className="w-3.5 h-3.5" /> Cycle Prevents Graduation
              </span>
            )}
          </div>
        )}
      </div>
    </div>
  );
};
