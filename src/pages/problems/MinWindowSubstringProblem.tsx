import React, { useState, useMemo, useEffect } from 'react';
import confetti from 'canvas-confetti';
import { generateMinWindowSubstringSteps, MIN_WINDOW_CODE_LINES } from '../../algorithms/minWindowSubstringIntuitive';
import { MinWindowSubstringInputPanel } from '../../components/slidingWindow/MinWindowSubstringInputPanel';
import { MinWindowSubstringViewer } from '../../components/slidingWindow/MinWindowSubstringViewer';
import { CodeViewer } from '../../components/CodeViewer';
import { ControlBar } from '../../components/ControlBar';

interface MinWindowSubstringProblemProps {
  uiScale: number;
}

export const MinWindowSubstringProblem: React.FC<MinWindowSubstringProblemProps> = ({ uiScale }) => {
  const [s, setS] = useState<string>('ADOBECODEBANC');
  const [t, setT] = useState<string>('ABC');
  const [currentStepIndex, setCurrentStepIndex] = useState<number>(0);
  const [isPlaying, setIsPlaying] = useState<boolean>(false);
  const [speed, setSpeed] = useState<number>(1);

  const steps = useMemo(() => {
    return generateMinWindowSubstringSteps(s, t);
  }, [s, t]);

  const currentStep = steps[Math.min(currentStepIndex, steps.length - 1)] || steps[0];

  useEffect(() => {
    setCurrentStepIndex(0);
    setIsPlaying(false);
  }, [s, t]);

  useEffect(() => {
    if (!isPlaying) return;

    const intervalTime = Math.max(300, 1100 / speed);
    const timer = setInterval(() => {
      setCurrentStepIndex((prev) => {
        if (prev >= steps.length - 1) {
          setIsPlaying(false);
          const lastStep = steps[steps.length - 1];
          if (lastStep && lastStep.isComplete && lastStep.minLen > 0 && lastStep.minLen !== Infinity) {
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
      className="flex-1 min-h-0 flex flex-col p-2 sm:p-2.5 max-w-7xl w-full mx-auto gap-2 overflow-y-auto lg:overflow-hidden problem-container-responsive"
      style={{ zoom: uiScale }}
    >
      {/* Top Input Bar */}
      <MinWindowSubstringInputPanel
        currentS={s}
        currentT={t}
        onUpdate={(newS, newT) => {
          setS(newS);
          setT(newT);
        }}
      />

      {/* Main Content Arena: Visualizer (Left) + Code (Right) */}
      <div className="flex-1 min-h-0 grid grid-cols-1 lg:grid-cols-12 gap-2.5">
        <div className="lg:col-span-8 flex flex-col min-h-0 h-full">
          <MinWindowSubstringViewer step={currentStep} />
        </div>
        <div className="lg:col-span-4 flex flex-col min-h-0 h-full">
          <CodeViewer
            lines={MIN_WINDOW_CODE_LINES}
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
