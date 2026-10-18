import React, { useEffect } from 'react';
import { Play, Pause, SkipBack, SkipForward, RotateCcw, FastForward } from 'lucide-react';

interface ControlBarProps {
  currentStep: number;
  totalSteps: number;
  isPlaying: boolean;
  onPlayPause: () => void;
  onNext: () => void;
  onPrev: () => void;
  onReset: () => void;
  onJumpTo: (step: number) => void;
  speed: number;
  setSpeed: (speed: number) => void;
}

export const ControlBar: React.FC<ControlBarProps> = ({
  currentStep,
  totalSteps,
  isPlaying,
  onPlayPause,
  onNext,
  onPrev,
  onReset,
  onJumpTo,
  speed,
  setSpeed
}) => {
  // Global spacebar listener for play/pause
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.target instanceof HTMLInputElement || e.target instanceof HTMLTextAreaElement) return;
      if (e.code === 'Space') {
        e.preventDefault();
        onPlayPause();
      } else if (e.code === 'ArrowRight') {
        e.preventDefault();
        onNext();
      } else if (e.code === 'ArrowLeft') {
        e.preventDefault();
        onPrev();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [onPlayPause, onNext, onPrev]);

  const speeds = [0.5, 1, 2, 4];

  return (
    <div className="bg-slate-900/95 border border-slate-800 rounded-xl px-2.5 sm:px-3 py-1.5 shadow-lg backdrop-blur flex flex-wrap sm:flex-nowrap items-center justify-between gap-2 sm:gap-3 shrink-0">
      {/* Playback action buttons */}
      <div className="flex items-center gap-1 sm:gap-1.5">
        <button
          onClick={onReset}
          className="p-1 sm:p-1.5 rounded-lg bg-slate-800/80 hover:bg-slate-700 text-slate-300 hover:text-white transition-colors"
          title="Reset"
        >
          <RotateCcw className="w-3.5 h-3.5" />
        </button>
        <button
          onClick={onPrev}
          disabled={currentStep === 0}
          className="p-1 sm:p-1.5 rounded-lg bg-slate-800/80 hover:bg-slate-700 text-slate-300 hover:text-white disabled:opacity-30 disabled:cursor-not-allowed transition-colors"
          title="Previous Step (Left Arrow)"
        >
          <SkipBack className="w-3.5 h-3.5" />
        </button>

        {/* Primary Play/Pause */}
        <button
          onClick={onPlayPause}
          className="flex items-center gap-1 sm:gap-1.5 px-2.5 sm:px-3.5 py-1 sm:py-1.5 rounded-lg bg-gradient-to-r from-indigo-500 to-purple-600 hover:from-indigo-600 hover:to-purple-700 text-white font-bold text-xs shadow-md shadow-indigo-500/25 transition-all"
          title="Play/Pause (Spacebar)"
        >
          {isPlaying ? (
            <>
              <Pause className="w-3.5 h-3.5 fill-white" /> <span className="hidden xs:inline">Pause</span>
            </>
          ) : (
            <>
              <Play className="w-3.5 h-3.5 fill-white" /> <span className="hidden xs:inline">Play</span>
            </>
          )}
        </button>

        <button
          onClick={onNext}
          disabled={currentStep >= totalSteps - 1}
          className="p-1 sm:p-1.5 rounded-lg bg-slate-800/80 hover:bg-slate-700 text-slate-300 hover:text-white disabled:opacity-30 disabled:cursor-not-allowed transition-colors"
          title="Next Step (Right Arrow)"
        >
          <SkipForward className="w-3.5 h-3.5" />
        </button>
      </div>

      {/* Middle Scrubber slider */}
      <div className="flex-1 flex items-center gap-1.5 sm:gap-2.5 min-w-[140px] max-w-xl order-3 sm:order-2 w-full sm:w-auto">
        <span className="text-[10px] sm:text-[11px] font-mono font-medium text-slate-400 w-12 sm:w-14 text-right shrink-0">
          {currentStep + 1}/{totalSteps || 1}
        </span>
        <div className="relative flex-1 flex items-center">
          <input
            type="range"
            min="0"
            max={Math.max(0, totalSteps - 1)}
            value={currentStep}
            onChange={(e) => onJumpTo(Number(e.target.value))}
            className="w-full accent-indigo-500 h-1.5 bg-slate-800 rounded-lg cursor-pointer"
          />
        </div>
        <span className="text-[10px] sm:text-[11px] font-mono text-indigo-400 font-semibold w-8 sm:w-10 shrink-0">
          {Math.round(((currentStep + 1) / (totalSteps || 1)) * 100)}%
        </span>
      </div>

      {/* Speed Toggles */}
      <div className="flex items-center gap-0.5 sm:gap-1 bg-slate-950 px-1 py-0.5 rounded-lg border border-slate-800 order-2 sm:order-3 ml-auto sm:ml-0">
        <FastForward className="w-3 h-3 text-slate-500 hidden sm:inline ml-1" />
        {speeds.map((s) => (
          <button
            key={s}
            onClick={() => setSpeed(s)}
            className={`px-1 sm:px-1.5 py-0.5 text-[9px] sm:text-[10px] font-mono font-medium rounded transition-all ${
              speed === s
                ? 'bg-indigo-600 text-white font-bold'
                : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            {s}x
          </button>
        ))}
      </div>
    </div>
  );
};
