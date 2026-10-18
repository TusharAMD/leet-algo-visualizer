import React, { useState, useMemo, useEffect } from 'react';
import confetti from 'canvas-confetti';
import { generateMergeSortedListsSteps, MERGE_LISTS_CODE_LINES } from '../../algorithms/mergeSortedListsIntuitive';
import { MergeSortedListsInputPanel } from '../../components/linkedList/MergeSortedListsInputPanel';
import { MergeSortedListsViewer } from '../../components/linkedList/MergeSortedListsViewer';
import { CodeViewer } from '../../components/CodeViewer';
import { ControlBar } from '../../components/ControlBar';

interface MergeSortedListsProblemProps {
  uiScale: number;
}

export const MergeSortedListsProblem: React.FC<MergeSortedListsProblemProps> = ({ uiScale }) => {
  const [list1, setList1] = useState<number[]>([1, 2, 4]);
  const [list2, setList2] = useState<number[]>([1, 3, 4]);
  const [currentStepIndex, setCurrentStepIndex] = useState<number>(0);
  const [isPlaying, setIsPlaying] = useState<boolean>(false);
  const [speed, setSpeed] = useState<number>(1);

  const steps = useMemo(() => {
    return generateMergeSortedListsSteps(list1, list2);
  }, [list1, list2]);

  const currentStep = steps[Math.min(currentStepIndex, steps.length - 1)] || steps[0];

  useEffect(() => {
    setCurrentStepIndex(0);
    setIsPlaying(false);
  }, [list1, list2]);

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
    setList1([1, 2, 4]);
    setList2([1, 3, 4]);
  };

  return (
    <div
      className="flex-1 min-h-0 flex flex-col p-2 sm:p-2.5 max-w-7xl w-full mx-auto gap-2 overflow-y-auto lg:overflow-hidden problem-container-responsive"
      style={{ zoom: uiScale }}
    >
      <MergeSortedListsInputPanel
        list1={list1}
        list2={list2}
        setList1={setList1}
        setList2={setList2}
        onResetToDefaults={handleResetToDefaults}
      />

      <div className="flex-1 min-h-0 grid grid-cols-1 lg:grid-cols-12 gap-2.5">
        <div className="lg:col-span-8 flex flex-col min-h-0 h-full">
          <MergeSortedListsViewer step={currentStep} />
        </div>
        <div className="lg:col-span-4 flex flex-col min-h-0 h-full">
          <CodeViewer
            lines={MERGE_LISTS_CODE_LINES}
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
