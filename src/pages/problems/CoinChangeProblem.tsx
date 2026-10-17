import React, { useState, useMemo, useEffect } from 'react';
import confetti from 'canvas-confetti';
import { generateIntuitiveSteps, CODE_LINES } from '../../algorithms/coinChangeIntuitive';
import { InputPanel } from '../../components/InputPanel';
import { ControlBar } from '../../components/ControlBar';
import { CodeViewer } from '../../components/CodeViewer';
import { IntuitiveChoiceViewer } from '../../components/IntuitiveChoiceViewer';
import { ConceptExplainerModal } from '../../components/ConceptExplainerModal';

interface CoinChangeProblemProps {
  isExplainerOpen: boolean;
  setIsExplainerOpen: (open: boolean) => void;
  uiScale: number;
}

export const CoinChangeProblem: React.FC<CoinChangeProblemProps> = ({
  isExplainerOpen,
  setIsExplainerOpen,
  uiScale
}) => {
  const [coins, setCoins] = useState<number[]>([1, 2, 5]);
  const [amount, setAmount] = useState<number>(7);
  const [currentStepIndex, setCurrentStepIndex] = useState<number>(0);
  const [isPlaying, setIsPlaying] = useState<boolean>(false);
  const [speed, setSpeed] = useState<number>(1);

  // Generate steps using the intuitive mental model generator
  const steps = useMemo(() => {
    return generateIntuitiveSteps(coins, amount);
  }, [coins, amount]);

  const currentStep = steps[Math.min(currentStepIndex, steps.length - 1)] || steps[0];

  // Reset playback when input parameters change
  useEffect(() => {
    setCurrentStepIndex(0);
    setIsPlaying(false);
  }, [coins, amount]);

  // Automated playback timer
  useEffect(() => {
    if (!isPlaying) return;

    const intervalTime = Math.max(250, 1200 / speed);
    const timer = setInterval(() => {
      setCurrentStepIndex((prev) => {
        if (prev >= steps.length - 1) {
          setIsPlaying(false);
          const lastStep = steps[steps.length - 1];
          if (lastStep && lastStep.optimalCoinsForTarget && lastStep.optimalCoinsForTarget > 0) {
            confetti({
              particleCount: 70,
              spread: 60,
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
    setCoins([1, 2, 5]);
    setAmount(7);
  };

  return (
    <div
      className="flex-1 min-h-0 flex flex-col p-2.5 max-w-7xl w-full mx-auto gap-2 overflow-hidden"
      style={{ zoom: uiScale }}
    >
      {/* Top: Compact input parameters & presets */}
      <InputPanel
        coins={coins}
        setCoins={setCoins}
        amount={amount}
        setAmount={setAmount}
        onResetToDefaults={handleResetToDefaults}
      />

      {/* Center: Side-by-Side Visual Decision Cards vs Python Code */}
      <div className="flex-1 min-h-0 grid grid-cols-1 lg:grid-cols-12 gap-2.5">
        <div className="lg:col-span-8 flex flex-col min-h-0 h-full">
          <IntuitiveChoiceViewer step={currentStep} amount={amount} />
        </div>
        <div className="lg:col-span-4 flex flex-col min-h-0 h-full">
          <CodeViewer
            lines={CODE_LINES}
            activeLine={currentStep.codeLine}
            variableBadges={currentStep.variableBadges}
          />
        </div>
      </div>

      {/* Bottom: Playback timeline and scrubber controls */}
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

      <ConceptExplainerModal
        isOpen={isExplainerOpen}
        onClose={() => setIsExplainerOpen(false)}
      />
    </div>
  );
};
