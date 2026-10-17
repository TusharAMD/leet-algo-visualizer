import React, { useState, useEffect, useMemo } from 'react';
import confetti from 'canvas-confetti';
import { ControlBar } from '../../components/ControlBar';
import { CodeViewer } from '../../components/CodeViewer';
import { ReverseIntegerViewer } from '../../components/math/ReverseIntegerViewer';
import { ReverseIntegerInputPanel } from '../../components/math/ReverseIntegerInputPanel';
import {
  generateReverseIntegerSteps,
  REVERSE_INTEGER_CODE_LINES,
} from '../../algorithms/reverseIntegerIntuitive';

interface ProblemProps {
  uiScale: number;
}

export const ReverseIntegerProblem: React.FC<ProblemProps> = ({ uiScale }) => {
  const [x, setX] = useState<number>(123);
  const [currentStepIndex, setCurrentStepIndex] = useState<number>(0);
  const [isPlaying, setIsPlaying] = useState<boolean>(false);
  const [speed, setSpeed] = useState<number>(1);

  const steps = useMemo(() => {
    return generateReverseIntegerSteps(x);
  }, [x]);

  const currentStep = steps[Math.min(currentStepIndex, steps.length - 1)] || steps[0];

  useEffect(() => {
    setCurrentStepIndex(0);
    setIsPlaying(false);
  }, [x]);

  useEffect(() => {
    if (!isPlaying) return;

    const intervalTime = Math.max(200, 1000 / speed);
    const timer = setInterval(() => {
      setCurrentStepIndex((prev) => {
        if (prev >= steps.length - 1) {
          setIsPlaying(false);
          if (!steps[steps.length - 1]?.overflowDetected) {
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
  }, [isPlaying, steps.length, speed]);

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
      <ReverseIntegerInputPanel
        initialX={x}
        onApply={(newX) => {
          setX(newX);
        }}
      />

      <div className="flex-1 min-h-0 grid grid-cols-1 lg:grid-cols-12 gap-2.5">
        <div className="lg:col-span-8 flex flex-col min-h-0 h-full">
          <ReverseIntegerViewer step={currentStep} originalX={x} />
        </div>
        <div className="lg:col-span-4 flex flex-col min-h-0 h-full">
          <CodeViewer
            lines={REVERSE_INTEGER_CODE_LINES}
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
