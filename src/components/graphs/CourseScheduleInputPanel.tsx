import React from 'react';
import { RotateCcw, Lightbulb } from 'lucide-react';

interface CourseScheduleInputPanelProps {
  numCourses: number;
  setNumCourses: (n: number) => void;
  prerequisites: [number, number][];
  setPrerequisites: (p: [number, number][]) => void;
  onResetToDefaults: () => void;
}

export const CourseScheduleInputPanel: React.FC<CourseScheduleInputPanelProps> = ({
  setNumCourses,
  setPrerequisites,
  onResetToDefaults,
}) => {
  const applyPreset = (n: number, p: [number, number][]) => {
    setNumCourses(n);
    setPrerequisites(p);
  };

  return (
    <div className="bg-slate-900/50 border border-slate-800 rounded-xl px-3 py-1.5 flex flex-wrap items-center justify-between gap-2.5 shrink-0">
      <div className="flex items-center gap-2.5 flex-wrap">
        <span className="text-[11px] font-semibold uppercase tracking-wider text-slate-400">
          Course Dependency Graph Presets:
        </span>
      </div>

      {/* Presets */}
      <div className="flex items-center gap-1.5 text-xs">
        <span className="text-slate-500 text-[10px] font-medium flex items-center gap-1">
          <Lightbulb className="w-3 h-3 text-amber-400" /> Presets:
        </span>
        <button
          onClick={() => applyPreset(2, [[1, 0]])}
          className="px-2 py-0.5 text-[11px] rounded bg-indigo-500/10 hover:bg-indigo-500/20 text-indigo-300 border border-indigo-500/30 transition-colors"
        >
          LeetCode #1: 2 Courses [0 ➔ 1] (True)
        </button>
        <button
          onClick={() => applyPreset(2, [[1, 0], [0, 1]])}
          className="px-2 py-0.5 text-[11px] rounded bg-rose-500/10 hover:bg-rose-500/20 text-rose-300 border border-rose-500/30 transition-colors font-medium"
        >
          Cycle Deadlock [0 ⟷ 1] (False)
        </button>
        <button
          onClick={() => applyPreset(4, [[1, 0], [2, 0], [3, 1], [3, 2]])}
          className="px-2 py-0.5 text-[11px] rounded bg-cyan-500/10 hover:bg-cyan-500/20 text-cyan-300 border border-cyan-500/30 transition-colors"
        >
          Diamond DAG (4 Courses)
        </button>
        <button
          onClick={onResetToDefaults}
          className="p-1 rounded text-slate-400 hover:text-white hover:bg-slate-800 transition-colors ml-1"
          title="Reset"
        >
          <RotateCcw className="w-3 h-3" />
        </button>
      </div>
    </div>
  );
};
