import React, { useState, useMemo, useEffect } from 'react';
import confetti from 'canvas-confetti';
import { generateTemperatureSteps, TEMPERATURES_CODE_LINES } from '../../algorithms/dailyTemperaturesIntuitive';
import { TemperaturesInputPanel } from '../../components/temperatures/TemperaturesInputPanel';
import { TemperaturesViewer } from '../../components/temperatures/TemperaturesViewer';
import { CodeViewer } from '../../components/CodeViewer';
import { ControlBar } from '../../components/ControlBar';

interface TemperaturesProblemProps {
  uiScale: number;
}

export const TemperaturesProblem: React.FC<TemperaturesProblemProps> = ({ uiScale }) => {
  const [temperatures, setTemperatures] = useState<number[]>([73, 74, 75, 71, 69, 72, 76, 73]);
  const [currentStepIndex, setCurrentStepIndex] = useState<number>(0);
  const [isPlaying, setIsPlaying] = useState<boolean>(false);
  const [speed, setSpeed] = useState<number>(1);

  const steps = useMemo(() => {
    return generateTemperatureSteps(temperatures);
  }, [temperatures]);

  const currentStep = steps[Math.min(currentStepIndex, steps.length - 1)] || steps[0];

  useEffect(() => {
    setCurrentStepIndex(0);
    setIsPlaying(false);
  }, [temperatures]);

  useEffect(() => {
    if (!isPlaying) return;

    const intervalTime = Math.max(300, 1200 / speed);
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
    setTemperatures([73, 74, 75, 71, 69, 72, 76, 73]);
  };

  return (
    <div
      className="flex-1 min-h-0 flex flex-col p-2.5 max-w-7xl w-full mx-auto gap-2 overflow-hidden"
      style={{ zoom: uiScale }}
    >
      <TemperaturesInputPanel
        temperatures={temperatures}
        setTemperatures={setTemperatures}
        onResetToDefaults={handleResetToDefaults}
      />

      <div className="flex-1 min-h-0 grid grid-cols-1 lg:grid-cols-12 gap-2.5">
        <div className="lg:col-span-8 flex flex-col min-h-0 h-full">
          <TemperaturesViewer step={currentStep} temperatures={temperatures} />
        </div>
        <div className="lg:col-span-4 flex flex-col min-h-0 h-full">
          <CodeViewer
            lines={TEMPERATURES_CODE_LINES}
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
