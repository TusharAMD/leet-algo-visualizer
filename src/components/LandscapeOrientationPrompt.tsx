import React, { useState } from 'react';
import { RotateCw, Smartphone } from 'lucide-react';

export const LandscapeOrientationPrompt: React.FC = () => {
  const [isDismissed, setIsDismissed] = useState(false);

  if (isDismissed) return null;

  return (
    <div className="fixed inset-0 z-[9999] bg-slate-950/95 backdrop-blur-xl flex flex-col items-center justify-center p-6 text-center select-none portrait-blocker">
      <div className="relative mb-6">
        <div className="w-20 h-20 rounded-2xl bg-indigo-500/10 border border-indigo-500/30 flex items-center justify-center text-indigo-400">
          <Smartphone className="w-10 h-10 animate-pulse" />
        </div>
        <div className="absolute -bottom-2 -right-2 w-8 h-8 rounded-full bg-indigo-600 text-white flex items-center justify-center shadow-lg animate-spin" style={{ animationDuration: '3s' }}>
          <RotateCw className="w-4 h-4" />
        </div>
      </div>

      <span className="px-3 py-1 rounded-full text-xs font-bold bg-indigo-500/20 text-indigo-300 border border-indigo-500/30 mb-3">
        Best Experience in Landscape
      </span>

      <h2 className="text-xl font-extrabold text-white mb-2">
        Please Rotate Your Device
      </h2>

      <p className="text-xs text-slate-300 max-w-xs leading-relaxed mb-6">
        This algorithm visualizer uses a zero-vertical-scroll desktop layout with synchronized code, active decision cards, and variable panels side-by-side.
      </p>

      <button
        onClick={() => setIsDismissed(true)}
        className="text-[11px] text-slate-400 hover:text-slate-200 underline underline-offset-4 py-2 px-4 rounded-lg hover:bg-slate-900 transition-colors"
      >
        Continue anyway in portrait
      </button>
    </div>
  );
};
