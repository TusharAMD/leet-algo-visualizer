import React, { useState, useMemo, useEffect } from 'react';
import confetti from 'canvas-confetti';
import { generateCarFleetSteps, CAR_FLEET_CODE_LINES } from '../../algorithms/carFleetIntuitive';
import { CarFleetInputPanel } from '../../components/stack/CarFleetInputPanel';
import { CarFleetViewer } from '../../components/stack/CarFleetViewer';
import { CodeViewer } from '../../components/CodeViewer';
import { ControlBar } from '../../components/ControlBar';

interface CarFleetProblemProps {
  uiScale: number;
}

export const CarFleetProblem: React.FC<CarFleetProblemProps> = ({ uiScale }) => {
  const [target, setTarget] = useState<number>(12);
  const [position, setPosition] = useState<number[]>([10, 8, 0, 5, 3]);
  const [speed, setSpeed] = useState<number[]>([2, 4, 1, 1, 3]);

  const [currentStepIndex, setCurrentStepIndex] = useState<number>(0);
  const [isPlaying, setIsPlaying] = useState<boolean>(false);
  const [animSpeed, setAnimSpeed] = useState<number>(1);

  const steps = useMemo(() => {
    return generateCarFleetSteps(target, position, speed);
  }, [target, position, speed]);

  const currentStep = steps[Math.min(currentStepIndex, steps.length - 1)] || steps[0];

  useEffect(() => {
    setCurrentStepIndex(0);
    setIsPlaying(false);
  }, [target, position, speed]);

  useEffect(() => {
    if (!isPlaying) return;

    const intervalTime = Math.max(300, 1100 / animSpeed);
    const timer = setInterval(() => {
      setCurrentStepIndex((prev) => {
        if (prev >= steps.length - 1) {
          setIsPlaying(false);
          const lastStep = steps[steps.length - 1];
          if (lastStep && lastStep.isComplete && lastStep.fleetTimesStack.length > 0) {
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
  }, [isPlaying, animSpeed, steps]);

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
      className="flex-1 min-h-0 flex flex-col p-2 sm:p-2.5 max-w-7xl w-full mx-auto gap-2 overflow-y-auto lg:overflow-hidden problem-container-responsive"
      style={{ zoom: uiScale }}
    >
      {/* Top Input Bar */}
      <CarFleetInputPanel
        currentTarget={target}
        currentPosition={position}
        currentSpeed={speed}
        onUpdate={(newTarget, newPos, newSpeed) => {
          setTarget(newTarget);
          setPosition(newPos);
          setSpeed(newSpeed);
        }}
      />

      {/* Main Content Arena: Visualizer (Left) + Code (Right) */}
      <div className="flex-1 min-h-0 grid grid-cols-1 lg:grid-cols-12 gap-2.5">
        <div className="lg:col-span-8 flex flex-col min-h-0 h-full">
          <CarFleetViewer step={currentStep} />
        </div>
        <div className="lg:col-span-4 flex flex-col min-h-0 h-full">
          <CodeViewer
            lines={CAR_FLEET_CODE_LINES}
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
        speed={animSpeed}
        setSpeed={setAnimSpeed}
      />
    </div>
  );
};
