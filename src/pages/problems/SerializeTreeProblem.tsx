import React, { useState, useMemo, useEffect } from 'react';
import confetti from 'canvas-confetti';
import {
  generateSerializeTreeSteps,
  SERIALIZE_TREE_CODE_LINES,
  TreeNodeInfo,
  buildPresetTree1
} from '../../algorithms/serializeTreeIntuitive';
import { SerializeTreeInputPanel } from '../../components/tree/SerializeTreeInputPanel';
import { SerializeTreeViewer } from '../../components/tree/SerializeTreeViewer';
import { CodeViewer } from '../../components/CodeViewer';
import { ControlBar } from '../../components/ControlBar';

interface SerializeTreeProblemProps {
  uiScale: number;
}

export const SerializeTreeProblem: React.FC<SerializeTreeProblemProps> = ({ uiScale }) => {
  const [tree, setTree] = useState<TreeNodeInfo[]>(buildPresetTree1());
  const [currentStepIndex, setCurrentStepIndex] = useState<number>(0);
  const [isPlaying, setIsPlaying] = useState<boolean>(false);
  const [speed, setSpeed] = useState<number>(1);

  const steps = useMemo(() => {
    return generateSerializeTreeSteps(tree);
  }, [tree]);

  const currentStep = steps[Math.min(currentStepIndex, steps.length - 1)] || steps[0];

  useEffect(() => {
    setCurrentStepIndex(0);
    setIsPlaying(false);
  }, [tree]);

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
    setTree(buildPresetTree1());
    setCurrentStepIndex(0);
    setIsPlaying(false);
  };

  return (
    <div
      className="flex-1 min-h-0 flex flex-col p-2.5 max-w-7xl w-full mx-auto gap-2 overflow-hidden"
      style={{ zoom: uiScale }}
    >
      {/* Interactive Controls Bar */}
      <SerializeTreeInputPanel
        tree={tree}
        setTree={setTree}
        onResetToDefaults={handleResetToDefaults}
      />

      {/* Main Grid: Visualizer & Code Side-by-Side */}
      <div className="flex-1 min-h-0 grid grid-cols-1 lg:grid-cols-12 gap-2.5">
        <div className="lg:col-span-8 flex flex-col min-h-0 h-full">
          {currentStep && <SerializeTreeViewer step={currentStep} />}
        </div>
        <div className="lg:col-span-4 flex flex-col min-h-0 h-full">
          <CodeViewer
            lines={SERIALIZE_TREE_CODE_LINES}
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
