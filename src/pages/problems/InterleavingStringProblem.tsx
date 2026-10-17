import React, { useState, useEffect, useMemo } from 'react';
import confetti from 'canvas-confetti';
import { ControlBar } from '../../components/ControlBar';
import { CodeViewer } from '../../components/CodeViewer';
import { InterleavingStringViewer } from '../../components/dp/InterleavingStringViewer';
import { InterleavingStringInputPanel } from '../../components/dp/InterleavingStringInputPanel';
import {
  generateInterleavingStringSteps,
  INTERLEAVING_STRING_CODE_LINES,
} from '../../algorithms/interleavingStringIntuitive';

interface ProblemProps {
  uiScale: number;
}

export const InterleavingStringProblem: React.FC<ProblemProps> = ({ uiScale }) => {
  const [s1, setS1] = useState<string>('aabcc');
  const [s2, setS2] = useState<string>('dbbca');
  const [s3, setS3] = useState<string>('aadbbcbcac');
  const [currentStepIndex, setCurrentStepIndex] = useState<number>(0);
  const [isPlaying, setIsPlaying] = useState<boolean>(false);
  const [speed, setSpeed] = useState<number>(1);

  const steps = useMemo(() => {
    return generateInterleavingStringSteps(s1, s2, s3);
  }, [s1, s2, s3]);

  const currentStep = steps[Math.min(currentStepIndex, steps.length - 1)] || steps[0];

  useEffect(() => {
    setCurrentStepIndex(0);
    setIsPlaying(false);
  }, [s1, s2, s3]);

  useEffect(() => {
    if (!isPlaying) return;

    const intervalTime = Math.max(200, 1000 / speed);
    const timer = setInterval(() => {
      setCurrentStepIndex((prev) => {
        if (prev >= steps.length - 1) {
          setIsPlaying(false);
          if (steps[steps.length - 1]?.canInterleave) {
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
      <InterleavingStringInputPanel
        initialS1={s1}
        initialS2={s2}
        initialS3={s3}
        onApply={(newS1, newS2, newS3) => {
          setS1(newS1);
          setS2(newS2);
          setS3(newS3);
        }}
      />

      <div className="flex-1 min-h-0 grid grid-cols-1 lg:grid-cols-12 gap-2.5">
        <div className="lg:col-span-8 flex flex-col min-h-0 h-full">
          <InterleavingStringViewer
            step={currentStep}
            s1={s1}
            s2={s2}
            s3={s3}
          />
        </div>
        <div className="lg:col-span-4 flex flex-col min-h-0 h-full">
          <CodeViewer
            lines={INTERLEAVING_STRING_CODE_LINES}
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
