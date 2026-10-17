import React, { useState, useMemo, useEffect } from 'react';
import confetti from 'canvas-confetti';
import { generateGroupAnagramsSteps, GROUP_ANAGRAMS_CODE_LINES } from '../../algorithms/groupAnagramsIntuitive';
import { GroupAnagramsInputPanel } from '../../components/hashing/GroupAnagramsInputPanel';
import { GroupAnagramsViewer } from '../../components/hashing/GroupAnagramsViewer';
import { CodeViewer } from '../../components/CodeViewer';
import { ControlBar } from '../../components/ControlBar';

interface GroupAnagramsProblemProps {
  uiScale: number;
}

export const GroupAnagramsProblem: React.FC<GroupAnagramsProblemProps> = ({ uiScale }) => {
  const [strs, setStrs] = useState<string[]>(['eat', 'tea', 'tan', 'ate', 'nat', 'bat']);
  const [currentStepIndex, setCurrentStepIndex] = useState<number>(0);
  const [isPlaying, setIsPlaying] = useState<boolean>(false);
  const [speed, setSpeed] = useState<number>(1);

  const steps = useMemo(() => {
    return generateGroupAnagramsSteps(strs);
  }, [strs]);

  const currentStep = steps[Math.min(currentStepIndex, steps.length - 1)] || steps[0];

  useEffect(() => {
    setCurrentStepIndex(0);
    setIsPlaying(false);
  }, [strs]);

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
    setStrs(['eat', 'tea', 'tan', 'ate', 'nat', 'bat']);
  };

  return (
    <div
      className="flex-1 min-h-0 flex flex-col p-2.5 max-w-7xl w-full mx-auto gap-2 overflow-hidden"
      style={{ zoom: uiScale }}
    >
      <GroupAnagramsInputPanel
        strs={strs}
        setStrs={setStrs}
        onResetToDefaults={handleResetToDefaults}
      />

      <div className="flex-1 min-h-0 grid grid-cols-1 lg:grid-cols-12 gap-2.5">
        <div className="lg:col-span-8 flex flex-col min-h-0 h-full">
          <GroupAnagramsViewer step={currentStep} strs={strs} />
        </div>
        <div className="lg:col-span-4 flex flex-col min-h-0 h-full">
          <CodeViewer
            lines={GROUP_ANAGRAMS_CODE_LINES}
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
