import React, { useState, useMemo, useEffect } from 'react';
import confetti from 'canvas-confetti';
import { generateTimeMapSteps, TIME_MAP_CODE_LINES, TimeMapOperation } from '../../algorithms/timeMapIntuitive';
import { TimeMapInputPanel } from '../../components/binarySearch/TimeMapInputPanel';
import { TimeMapViewer } from '../../components/binarySearch/TimeMapViewer';
import { CodeViewer } from '../../components/CodeViewer';
import { ControlBar } from '../../components/ControlBar';

interface TimeMapProblemProps {
  uiScale: number;
}

const DEFAULT_SEQUENCE: TimeMapOperation[] = [
  { type: 'SET', key: 'foo', value: 'bar', timestamp: 1 },
  { type: 'GET', key: 'foo', timestamp: 1 },
  { type: 'GET', key: 'foo', timestamp: 3 },
  { type: 'SET', key: 'foo', value: 'bar2', timestamp: 4 },
  { type: 'GET', key: 'foo', timestamp: 4 },
  { type: 'GET', key: 'foo', timestamp: 5 }
];

export const TimeMapProblem: React.FC<TimeMapProblemProps> = ({ uiScale }) => {
  const [sequence, setSequence] = useState<TimeMapOperation[]>(DEFAULT_SEQUENCE);
  const [currentStepIndex, setCurrentStepIndex] = useState<number>(0);
  const [isPlaying, setIsPlaying] = useState<boolean>(false);
  const [speed, setSpeed] = useState<number>(1);

  const steps = useMemo(() => {
    return generateTimeMapSteps(sequence);
  }, [sequence]);

  const currentStep = steps[Math.min(currentStepIndex, steps.length - 1)] || steps[0];

  useEffect(() => {
    setCurrentStepIndex(0);
    setIsPlaying(false);
  }, [sequence]);

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
    setCurrentStepIndex(0);
    setIsPlaying(false);
  };

  return (
    <div
      className="flex-1 min-h-0 flex flex-col p-2.5 max-w-7xl w-full mx-auto gap-2 overflow-hidden"
      style={{ zoom: uiScale }}
    >
      {/* Top Input Bar */}
      <TimeMapInputPanel onSelectSequence={(newSeq) => setSequence(newSeq)} />

      {/* Main Content Arena: Visualizer (Left) + Code (Right) */}
      <div className="flex-1 min-h-0 grid grid-cols-1 lg:grid-cols-12 gap-2.5">
        <div className="lg:col-span-8 flex flex-col min-h-0 h-full">
          <TimeMapViewer step={currentStep} />
        </div>
        <div className="lg:col-span-4 flex flex-col min-h-0 h-full">
          <CodeViewer
            lines={TIME_MAP_CODE_LINES}
            activeLine={currentStep.codeLine}
            variableBadges={currentStep.variableBadges}
          />
        </div>
      </div>

      {/* Persistent Bottom Controls */}
      <ControlBar
        currentStep={currentStepIndex}
        totalSteps={steps.length}
        isPlaying={isPlaying}
        onPlayPause={() => setIsPlaying(!isPlaying)}
        onNext={handleNext}
        onPrev={handlePrev}
        onReset={handleReset}
        onJumpTo={(step) => {
          setCurrentStepIndex(step);
          setIsPlaying(false);
        }}
        speed={speed}
        setSpeed={setSpeed}
      />
    </div>
  );
};
