import React, { useState, useMemo, useEffect } from 'react';
import confetti from 'canvas-confetti';
import {
  generateKthLargestStreamSteps,
  KTH_LARGEST_STREAM_CODE_LINES
} from '../../algorithms/kthLargestStreamIntuitive';
import { KthLargestStreamInputPanel } from '../../components/heap/KthLargestStreamInputPanel';
import { KthLargestStreamViewer } from '../../components/heap/KthLargestStreamViewer';
import { CodeViewer } from '../../components/CodeViewer';
import { ControlBar } from '../../components/ControlBar';

interface KthLargestStreamProblemProps {
  uiScale: number;
}

export const KthLargestStreamProblem: React.FC<KthLargestStreamProblemProps> = ({ uiScale }) => {
  const [k, setK] = useState<number>(3);
  const [initialNums, setInitialNums] = useState<number[]>([4, 5, 8, 2]);
  const [stream, setStream] = useState<number[]>([3, 5, 10, 9, 4]);
  const [currentStepIndex, setCurrentStepIndex] = useState<number>(0);
  const [isPlaying, setIsPlaying] = useState<boolean>(false);
  const [speed, setSpeed] = useState<number>(1);

  const steps = useMemo(() => {
    return generateKthLargestStreamSteps(k, initialNums, stream);
  }, [k, initialNums, stream]);

  const currentStep = steps[Math.min(currentStepIndex, steps.length - 1)] || steps[0];

  useEffect(() => {
    setCurrentStepIndex(0);
    setIsPlaying(false);
  }, [k, initialNums, stream]);

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
    setIsPlaying(false);
    setCurrentStepIndex(0);
  };

  const handleResetToDefaults = () => {
    setK(3);
    setInitialNums([4, 5, 8, 2]);
    setStream([3, 5, 10, 9, 4]);
    setCurrentStepIndex(0);
    setIsPlaying(false);
  };

  return (
    <div
      className="flex-1 min-h-0 flex flex-col p-2.5 max-w-7xl w-full mx-auto gap-2 overflow-hidden"
      style={{ zoom: uiScale }}
    >
      {/* Interactive Controls Bar */}
      <KthLargestStreamInputPanel
        k={k}
        setK={setK}
        initialNums={initialNums}
        setInitialNums={setInitialNums}
        stream={stream}
        setStream={setStream}
        onResetToDefaults={handleResetToDefaults}
      />

      {/* Main Grid: Visualizer & Code Side-by-Side */}
      <div className="flex-1 min-h-0 grid grid-cols-1 lg:grid-cols-12 gap-2.5">
        <div className="lg:col-span-8 flex flex-col min-h-0 h-full">
          {currentStep && <KthLargestStreamViewer step={currentStep} />}
        </div>
        <div className="lg:col-span-4 flex flex-col min-h-0 h-full">
          <CodeViewer
            lines={KTH_LARGEST_STREAM_CODE_LINES}
            activeLine={currentStep?.codeLine ?? 1}
            variableBadges={currentStep?.variableBadges ?? []}
          />
        </div>
      </div>

      {/* Control Bar */}
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
