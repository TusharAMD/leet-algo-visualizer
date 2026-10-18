import React, { useState, useMemo, useEffect } from 'react';
import confetti from 'canvas-confetti';
import {
  generateLRUCacheSteps,
  LRU_CACHE_CODE_LINES,
  LRUCacheOperation
} from '../../algorithms/lruCacheIntuitive';
import { LRUCacheInputPanel } from '../../components/linkedList/LRUCacheInputPanel';
import { LRUCacheViewer } from '../../components/linkedList/LRUCacheViewer';
import { CodeViewer } from '../../components/CodeViewer';
import { ControlBar } from '../../components/ControlBar';

interface LRUCacheProblemProps {
  uiScale: number;
}

const DEFAULT_OPS: LRUCacheOperation[] = [
  { op: 'put', key: 1, val: 1 },
  { op: 'put', key: 2, val: 2 },
  { op: 'get', key: 1 },
  { op: 'put', key: 3, val: 3 },
  { op: 'get', key: 2 },
  { op: 'put', key: 4, val: 4 },
  { op: 'get', key: 1 },
  { op: 'get', key: 3 },
  { op: 'get', key: 4 }
];

export const LRUCacheProblem: React.FC<LRUCacheProblemProps> = ({ uiScale }) => {
  const [capacity, setCapacity] = useState<number>(2);
  const [operations, setOperations] = useState<LRUCacheOperation[]>(DEFAULT_OPS);
  const [currentStepIndex, setCurrentStepIndex] = useState<number>(0);
  const [isPlaying, setIsPlaying] = useState<boolean>(false);
  const [speed, setSpeed] = useState<number>(1);

  const steps = useMemo(() => {
    return generateLRUCacheSteps(capacity, operations);
  }, [capacity, operations]);

  const currentStep = steps[Math.min(currentStepIndex, steps.length - 1)] || steps[0];

  useEffect(() => {
    setCurrentStepIndex(0);
    setIsPlaying(false);
  }, [capacity, operations]);

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
    setCapacity(2);
    setOperations(DEFAULT_OPS);
  };

  return (
    <div
      className="flex-1 min-h-0 flex flex-col p-2 sm:p-2.5 max-w-7xl w-full mx-auto gap-2 overflow-y-auto lg:overflow-hidden problem-container-responsive"
      style={{ zoom: uiScale }}
    >
      <LRUCacheInputPanel
        capacity={capacity}
        operations={operations}
        setCapacity={setCapacity}
        setOperations={setOperations}
        onResetToDefaults={handleResetToDefaults}
      />

      <div className="flex-1 min-h-0 grid grid-cols-1 lg:grid-cols-12 gap-2.5">
        <div className="lg:col-span-8 flex flex-col min-h-0 h-full">
          <LRUCacheViewer step={currentStep} />
        </div>
        <div className="lg:col-span-4 flex flex-col min-h-0 h-full">
          <CodeViewer
            lines={LRU_CACHE_CODE_LINES}
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
