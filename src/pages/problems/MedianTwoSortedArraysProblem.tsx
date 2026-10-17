import React, { useState, useMemo, useEffect } from 'react';
import confetti from 'canvas-confetti';
import { generateMedianTwoSortedArraysSteps, MEDIAN_TWO_ARRAYS_CODE_LINES } from '../../algorithms/medianTwoSortedArraysIntuitive';
import { MedianTwoSortedArraysInputPanel } from '../../components/binarySearch/MedianTwoSortedArraysInputPanel';
import { MedianTwoSortedArraysViewer } from '../../components/binarySearch/MedianTwoSortedArraysViewer';
import { CodeViewer } from '../../components/CodeViewer';
import { ControlBar } from '../../components/ControlBar';

interface MedianTwoSortedArraysProblemProps {
  uiScale: number;
}

export const MedianTwoSortedArraysProblem: React.FC<MedianTwoSortedArraysProblemProps> = ({ uiScale }) => {
  const [nums1, setNums1] = useState<number[]>([1, 3]);
  const [nums2, setNums2] = useState<number[]>([2]);

  const [currentStepIndex, setCurrentStepIndex] = useState<number>(0);
  const [isPlaying, setIsPlaying] = useState<boolean>(false);
  const [speed, setSpeed] = useState<number>(1);

  const steps = useMemo(() => {
    return generateMedianTwoSortedArraysSteps(nums1, nums2);
  }, [nums1, nums2]);

  const currentStep = steps[Math.min(currentStepIndex, steps.length - 1)] || steps[0];

  useEffect(() => {
    setCurrentStepIndex(0);
    setIsPlaying(false);
  }, [nums1, nums2]);

  useEffect(() => {
    if (!isPlaying) return;

    const intervalTime = Math.max(300, 1100 / speed);
    const timer = setInterval(() => {
      setCurrentStepIndex((prev) => {
        if (prev >= steps.length - 1) {
          setIsPlaying(false);
          const lastStep = steps[steps.length - 1];
          if (lastStep && lastStep.isComplete && lastStep.median !== null) {
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
      <MedianTwoSortedArraysInputPanel
        currentNums1={nums1}
        currentNums2={nums2}
        onUpdate={(newN1, newN2) => {
          setNums1(newN1);
          setNums2(newN2);
        }}
      />

      {/* Main Content Arena: Visualizer (Left) + Code (Right) */}
      <div className="flex-1 min-h-0 grid grid-cols-1 lg:grid-cols-12 gap-2.5">
        <div className="lg:col-span-8 flex flex-col min-h-0 h-full">
          <MedianTwoSortedArraysViewer step={currentStep} />
        </div>
        <div className="lg:col-span-4 flex flex-col min-h-0 h-full">
          <CodeViewer
            lines={MEDIAN_TWO_ARRAYS_CODE_LINES}
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
