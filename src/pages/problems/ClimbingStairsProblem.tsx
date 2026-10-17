import React, { useState, useMemo, useEffect } from 'react';
import confetti from 'canvas-confetti';
import { generateClimbingStairsSteps, CLIMBING_STAIRS_CODE_LINES } from '../../algorithms/climbingStairsIntuitive';
import { ClimbingStairsInputPanel } from '../../components/dp/ClimbingStairsInputPanel';
import { ClimbingStairsViewer } from '../../components/dp/ClimbingStairsViewer';
import { CodeViewer } from '../../components/CodeViewer';
import { ControlBar } from '../../components/ControlBar';

interface ClimbingStairsProblemProps {
  uiScale: number;
}

export const ClimbingStairsProblem: React.FC<ClimbingStairsProblemProps> = ({ uiScale }) => {
  const [n, setN] = useState<number>(5);
  const [currentStepIndex, setCurrentStepIndex] = useState<number>(0);
  const [isPlaying, setIsPlaying] = useState<boolean>(false);
  const [speed, setSpeed] = useState<number>(1);

  const steps = useMemo(() => {
    return generateClimbingStairsSteps(n);
  }, [n]);

  const currentStep = steps[Math.min(currentStepIndex, steps.length - 1)] || steps[0];

  useEffect(() => {
    setCurrentStepIndex(0);
    setIsPlaying(false);
  }, [n]);

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

  const handleResetToDefaults = () => {
    setN(5);
  };

  return (
    <div
      className="flex-1 min-h-0 flex flex-col p-2.5 max-w-7xl w-full mx-auto gap-2 overflow-hidden"
      style={{ zoom: uiScale }}
    >
      <ClimbingStairsInputPanel
        n={n}
        setN={setN}
        onResetToDefaults={handleResetToDefaults}
      />

      <div className="flex-1 min-h-0 grid grid-cols-1 lg:grid-cols-12 gap-2.5">
        <div className="lg:col-span-8 flex flex-col min-h-0 h-full">
          <ClimbingStairsViewer step={currentStep} />
        </div>
        <div className="lg:col-span-4 flex flex-col min-h-0 h-full">
          <CodeViewer
            lines={CLIMBING_STAIRS_CODE_LINES}
            activeLine={currentStep.codeLine}
            variableBadges={currentStep.variableBadges}
          />
        </div>
      </div>

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
