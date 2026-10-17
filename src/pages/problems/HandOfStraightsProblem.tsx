import React, { useState, useEffect, useMemo } from 'react';
import confetti from 'canvas-confetti';
import { ControlBar } from '../../components/ControlBar';
import { CodeViewer } from '../../components/CodeViewer';
import { HandOfStraightsViewer } from '../../components/greedy/HandOfStraightsViewer';
import { HandOfStraightsInputPanel } from '../../components/greedy/HandOfStraightsInputPanel';
import {
  generateHandOfStraightsSteps,
  HAND_OF_STRAIGHTS_CODE_LINES,
} from '../../algorithms/handOfStraightsIntuitive';

interface ProblemProps {
  uiScale: number;
}

export const HandOfStraightsProblem: React.FC<ProblemProps> = ({ uiScale }) => {
  const [hand, setHand] = useState<number[]>([1, 2, 3, 6, 2, 3, 4, 7, 8]);
  const [groupSize, setGroupSize] = useState<number>(3);
  const [currentStepIndex, setCurrentStepIndex] = useState<number>(0);
  const [isPlaying, setIsPlaying] = useState<boolean>(false);
  const [speed, setSpeed] = useState<number>(1);

  const steps = useMemo(() => {
    return generateHandOfStraightsSteps(hand, groupSize);
  }, [hand, groupSize]);

  const currentStep = steps[Math.min(currentStepIndex, steps.length - 1)] || steps[0];

  useEffect(() => {
    setCurrentStepIndex(0);
    setIsPlaying(false);
  }, [hand, groupSize]);

  useEffect(() => {
    if (!isPlaying) return;

    const intervalTime = Math.max(200, 1000 / speed);
    const timer = setInterval(() => {
      setCurrentStepIndex((prev) => {
        if (prev >= steps.length - 1) {
          setIsPlaying(false);
          if (steps[steps.length - 1]?.isPossible) {
            confetti({
              particleCount: 70,
              spread: 60,
              origin: { y: 0.7 },
            });
          }
          return prev;
        }
        return prev + 1;
      });
    }, intervalTime);

    return () => clearInterval(timer);
  }, [isPlaying, steps.length, speed, steps]);

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
      <HandOfStraightsInputPanel
        initialHand={hand}
        initialGroupSize={groupSize}
        onApply={(newHand, newGroupSize) => {
          setHand(newHand);
          setGroupSize(newGroupSize);
        }}
      />

      <div className="flex-1 min-h-0 grid grid-cols-1 lg:grid-cols-12 gap-2.5">
        <div className="lg:col-span-8 flex flex-col min-h-0 h-full">
          <HandOfStraightsViewer step={currentStep} groupSize={groupSize} />
        </div>
        <div className="lg:col-span-4 flex flex-col min-h-0 h-full">
          <CodeViewer
            lines={HAND_OF_STRAIGHTS_CODE_LINES}
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
        onJumpTo={(idx) => setCurrentStepIndex(idx)}
        speed={speed}
        setSpeed={setSpeed}
      />
    </div>
  );
};
