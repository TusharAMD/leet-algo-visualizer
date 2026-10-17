import React, { useState, useMemo, useEffect } from 'react';
import confetti from 'canvas-confetti';
import { generateTaskSchedulerSteps, TASK_SCHEDULER_CODE_LINES } from '../../algorithms/taskSchedulerIntuitive';
import { TaskSchedulerInputPanel } from '../../components/heap/TaskSchedulerInputPanel';
import { TaskSchedulerViewer } from '../../components/heap/TaskSchedulerViewer';
import { CodeViewer } from '../../components/CodeViewer';
import { ControlBar } from '../../components/ControlBar';

interface TaskSchedulerProblemProps {
  uiScale: number;
}

export const TaskSchedulerProblem: React.FC<TaskSchedulerProblemProps> = ({ uiScale }) => {
  const [tasks, setTasks] = useState<string[]>(['A', 'A', 'A', 'B', 'B', 'B']);
  const [n, setN] = useState<number>(2);
  const [currentStepIndex, setCurrentStepIndex] = useState<number>(0);
  const [isPlaying, setIsPlaying] = useState<boolean>(false);
  const [speed, setSpeed] = useState<number>(1);

  const steps = useMemo(() => {
    return generateTaskSchedulerSteps(tasks, n);
  }, [tasks, n]);

  const currentStep = steps[Math.min(currentStepIndex, steps.length - 1)] || steps[0];

  useEffect(() => {
    setCurrentStepIndex(0);
    setIsPlaying(false);
  }, [tasks, n]);

  useEffect(() => {
    if (!isPlaying) return;

    const intervalTime = Math.max(300, 1100 / speed);
    const timer = setInterval(() => {
      setCurrentStepIndex((prev) => {
        if (prev >= steps.length - 1) {
          setIsPlaying(false);
          const lastStep = steps[steps.length - 1];
          if (lastStep && lastStep.isComplete) {
            confetti({
              particleCount: 80,
              spread: 65,
              origin: { y: 0.7 }
            });
          }
          return prev;
        }
        return prev + 1;
      });
    }, intervalTime);

    return () => clearInterval(timer);
  }, [isPlaying, speed, steps]);

  const handleNext = () => {
    if (currentStepIndex < steps.length - 1) {
      setCurrentStepIndex((prev) => prev + 1);
    }
  };

  const handlePrev = () => {
    if (currentStepIndex > 0) {
      setCurrentStepIndex((prev) => prev - 1);
    }
  };

  const handleReset = () => {
    setIsPlaying(false);
    setCurrentStepIndex(0);
  };

  const handleResetToDefaults = () => {
    setTasks(['A', 'A', 'A', 'B', 'B', 'B']);
    setN(2);
    setCurrentStepIndex(0);
    setIsPlaying(false);
  };

  return (
    <div
      className="flex-1 min-h-0 flex flex-col p-2.5 max-w-7xl w-full mx-auto gap-2 overflow-hidden"
      style={{ zoom: uiScale }}
    >
      {/* Interactive Controls Bar */}
      <TaskSchedulerInputPanel
        tasks={tasks}
        setTasks={setTasks}
        n={n}
        setN={setN}
        onResetToDefaults={handleResetToDefaults}
      />

      {/* Main Grid: Visualizer & Code Side-by-Side */}
      <div className="flex-1 min-h-0 grid grid-cols-1 lg:grid-cols-12 gap-2.5">
        <div className="lg:col-span-8 flex flex-col min-h-0 h-full">
          {currentStep && <TaskSchedulerViewer step={currentStep} />}
        </div>
        <div className="lg:col-span-4 flex flex-col min-h-0 h-full">
          <CodeViewer
            lines={TASK_SCHEDULER_CODE_LINES}
            activeLine={currentStep?.codeLine ?? 1}
            variableBadges={currentStep?.variableBadges ?? []}
          />
        </div>
      </div>

      {/* Control Bar */}
      <ControlBar
        currentStep={currentStepIndex}
        totalSteps={steps.length}
        isPlaying={isPlaying}
        onPlayPause={() => setIsPlaying(!isPlaying)}
        onNext={handleNext}
        onPrev={handlePrev}
        onReset={handleReset}
        onJumpTo={(idx) => setCurrentStepIndex(idx)}
        speed={speed}
        setSpeed={setSpeed}
      />
    </div>
  );
};
