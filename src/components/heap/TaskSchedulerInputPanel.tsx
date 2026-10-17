import React, { useState } from 'react';
import { Lightbulb, RotateCcw } from 'lucide-react';

interface TaskSchedulerInputPanelProps {
  tasks: string[];
  setTasks: (tasks: string[]) => void;
  n: number;
  setN: (n: number) => void;
  onResetToDefaults: () => void;
}

export const TaskSchedulerInputPanel: React.FC<TaskSchedulerInputPanelProps> = ({
  tasks,
  setTasks,
  n,
  setN,
  onResetToDefaults,
}) => {
  const [tasksStr, setTasksStr] = useState<string>(tasks.join(', '));
  const [nVal, setNVal] = useState<number>(n);

  const applyCustomInputs = () => {
    const parsed = tasksStr
      .split(',')
      .map((s) => s.trim().toUpperCase())
      .filter((s) => s.length === 1 && s >= 'A' && s <= 'Z');

    if (parsed.length >= 1) {
      setTasks(parsed);
      const validN = Math.max(0, Math.min(nVal, 6));
      setN(validN);
      setNVal(validN);
      setTasksStr(parsed.join(', '));
    }
  };

  const applyPreset = (presetTasks: string[], presetN: number) => {
    setTasks(presetTasks);
    setN(presetN);
    setNVal(presetN);
    setTasksStr(presetTasks.join(', '));
  };

  return (
    <div className="bg-slate-900/50 border border-slate-800 rounded-xl px-3 py-1.5 flex flex-wrap items-center justify-between gap-2.5 shrink-0">
      <div className="flex items-center gap-2.5 flex-wrap">
        <div className="flex items-center gap-1.5">
          <span className="text-[11px] font-semibold uppercase tracking-wider text-slate-400">
            Tasks:
          </span>
          <input
            type="text"
            value={tasksStr}
            onChange={(e) => setTasksStr(e.target.value)}
            onBlur={applyCustomInputs}
            onKeyDown={(e) => e.key === 'Enter' && applyCustomInputs()}
            placeholder="A, A, A, B, B, B"
            className="w-52 bg-slate-950/80 border border-slate-700/70 rounded-lg px-2.5 py-0.5 text-xs text-white font-mono focus:outline-none focus:border-indigo-500"
          />
        </div>

        <div className="flex items-center gap-1.5">
          <span className="text-[11px] font-semibold uppercase tracking-wider text-slate-400">
            Cooldown (n):
          </span>
          <input
            type="number"
            min={0}
            max={6}
            value={nVal}
            onChange={(e) => {
              const val = parseInt(e.target.value, 10);
              if (!isNaN(val)) {
                setNVal(val);
                setN(Math.max(0, Math.min(val, 6)));
              }
            }}
            className="w-14 bg-slate-950/80 border border-slate-700/70 rounded-lg px-2 py-0.5 text-xs text-white font-mono focus:outline-none focus:border-indigo-500"
          />
        </div>
      </div>

      {/* Presets */}
      <div className="flex items-center gap-1.5 text-xs">
        <span className="text-slate-500 text-[10px] font-medium flex items-center gap-1">
          <Lightbulb className="w-3 h-3 text-amber-400" /> Presets:
        </span>
        <button
          onClick={() => applyPreset(['A', 'A', 'A', 'B', 'B', 'B'], 2)}
          className="px-2 py-0.5 text-[11px] rounded bg-indigo-500/10 hover:bg-indigo-500/20 text-indigo-300 border border-indigo-500/30 transition-colors"
        >
          LC #1 [3A, 3B, n=2]
        </button>
        <button
          onClick={() => applyPreset(['A', 'C', 'A', 'B', 'D', 'B'], 1)}
          className="px-2 py-0.5 text-[11px] rounded bg-cyan-500/10 hover:bg-cyan-500/20 text-cyan-300 border border-cyan-500/30 transition-colors"
        >
          LC #2 [Mixed, n=1]
        </button>
        <button
          onClick={() => applyPreset(['A', 'A', 'A', 'B', 'B', 'B'], 0)}
          className="px-2 py-0.5 text-[11px] rounded bg-purple-500/10 hover:bg-purple-500/20 text-purple-300 border border-purple-500/30 transition-colors"
        >
          No Cooldown (n=0)
        </button>
        <button
          onClick={onResetToDefaults}
          className="p-1 rounded bg-slate-800 hover:bg-slate-700 text-slate-400 hover:text-white transition-colors ml-1"
          title="Reset Defaults"
        >
          <RotateCcw className="w-3.5 h-3.5" />
        </button>
      </div>
    </div>
  );
};
