import React, { useState, useMemo, useEffect } from 'react';
import confetti from 'canvas-confetti';
import {
  generateCourseScheduleTwoSteps,
  COURSE_SCHEDULE_TWO_CODE_LINES
} from '../../algorithms/courseScheduleTwoIntuitive';
import { CourseScheduleTwoInputPanel } from '../../components/graphs/CourseScheduleTwoInputPanel';
import { CourseScheduleTwoViewer } from '../../components/graphs/CourseScheduleTwoViewer';
import { CodeViewer } from '../../components/CodeViewer';
import { ControlBar } from '../../components/ControlBar';

interface CourseScheduleTwoProblemProps {
  uiScale: number;
}

export const CourseScheduleTwoProblem: React.FC<CourseScheduleTwoProblemProps> = ({ uiScale }) => {
  const [numCourses, setNumCourses] = useState<number>(4);
  const [prerequisites, setPrerequisites] = useState<[number, number][]>([
    [1, 0],
    [2, 0],
    [3, 1],
    [3, 2]
  ]);
  const [currentStepIndex, setCurrentStepIndex] = useState<number>(0);
  const [isPlaying, setIsPlaying] = useState<boolean>(false);
  const [speed, setSpeed] = useState<number>(1);

  const steps = useMemo(() => {
    return generateCourseScheduleTwoSteps(numCourses, prerequisites);
  }, [numCourses, prerequisites]);

  const currentStep = steps[Math.min(currentStepIndex, steps.length - 1)] || steps[0];

  useEffect(() => {
    setCurrentStepIndex(0);
    setIsPlaying(false);
  }, [numCourses, prerequisites]);

  useEffect(() => {
    if (!isPlaying) return;

    const intervalTime = Math.max(300, 1000 / speed);
    const timer = setInterval(() => {
      setCurrentStepIndex((prev) => {
        if (prev >= steps.length - 1) {
          setIsPlaying(false);
          const lastStep = steps[steps.length - 1];
          if (lastStep && lastStep.isComplete && !lastStep.hasCycle) {
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
    setNumCourses(4);
    setPrerequisites([
      [1, 0],
      [2, 0],
      [3, 1],
      [3, 2]
    ]);
    setCurrentStepIndex(0);
    setIsPlaying(false);
  };

  return (
    <div
      className="flex-1 min-h-0 flex flex-col p-2.5 max-w-7xl w-full mx-auto gap-2 overflow-hidden"
      style={{ zoom: uiScale }}
    >
      {/* Interactive Controls Bar */}
      <CourseScheduleTwoInputPanel
        numCourses={numCourses}
        prerequisites={prerequisites}
        setNumCourses={setNumCourses}
        setPrerequisites={setPrerequisites}
        onResetToDefaults={handleResetToDefaults}
      />

      {/* Main Grid: Visualizer & Code Side-by-Side */}
      <div className="flex-1 min-h-0 grid grid-cols-1 lg:grid-cols-12 gap-2.5">
        <div className="lg:col-span-8 flex flex-col min-h-0 h-full">
          {currentStep && <CourseScheduleTwoViewer step={currentStep} />}
        </div>
        <div className="lg:col-span-4 flex flex-col min-h-0 h-full">
          <CodeViewer
            lines={COURSE_SCHEDULE_TWO_CODE_LINES}
            activeLine={currentStep?.codeLine ?? 1}
            variableBadges={currentStep?.variableBadges ?? []}
          />
        </div>
      </div>

      {/* Navigation / Playback Bar */}
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
