import React from 'react';
import { Sparkles, BookOpen, ZoomIn, ZoomOut, Maximize2 } from 'lucide-react';

interface HeaderProps {
  onOpenExplainer: () => void;
  uiScale: number;
  setUiScale: (scale: number | ((prev: number) => number)) => void;
}

export const Header: React.FC<HeaderProps> = ({ onOpenExplainer, uiScale, setUiScale }) => {
  return (
    <header className="border-b border-slate-800 bg-slate-900/80 backdrop-blur-md px-5 py-2.5 flex items-center justify-between gap-3 shrink-0 z-30">
      <div className="flex items-center gap-3">
        <div className="h-8 w-8 rounded-xl bg-gradient-to-tr from-indigo-500 to-purple-600 flex items-center justify-center shadow-md shadow-indigo-500/20">
          <Sparkles className="w-4 h-4 text-white" />
        </div>
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-sm font-bold text-white">
              DSA Visualized: <span className="text-indigo-400">Coin Change</span>
            </h1>
            <span className="px-2 py-0.2 text-[9px] font-semibold rounded-full bg-indigo-500/10 text-indigo-300 border border-indigo-500/20">
              LeetCode #322
            </span>
          </div>
          <p className="text-[10px] text-slate-400">
            Comparing coin choices side-by-side to make Dynamic Programming click
          </p>
        </div>
      </div>

      <div className="flex items-center gap-2.5">
        {/* Zoom / Scale Controls */}
        <div className="flex items-center bg-slate-950/80 border border-slate-800 rounded-xl p-0.5 text-xs text-slate-300">
          <button
            onClick={() => setUiScale((s) => Math.max(0.75, Number((s - 0.05).toFixed(2))))}
            className="p-1 rounded-lg hover:bg-slate-800 text-slate-400 hover:text-white transition-colors"
            title="Zoom Out (Fit more on screen)"
          >
            <ZoomOut className="w-3.5 h-3.5" />
          </button>
          <span className="font-mono text-[11px] px-1.5 font-semibold text-indigo-300 min-w-10 text-center">
            {Math.round(uiScale * 100)}%
          </span>
          <button
            onClick={() => setUiScale((s) => Math.min(1.25, Number((s + 0.05).toFixed(2))))}
            className="p-1 rounded-lg hover:bg-slate-800 text-slate-400 hover:text-white transition-colors"
            title="Zoom In"
          >
            <ZoomIn className="w-3.5 h-3.5" />
          </button>
          <button
            onClick={() => setUiScale(0.9)}
            className="ml-1 px-1.5 py-0.5 text-[10px] font-medium rounded-md hover:bg-slate-800 text-slate-400 hover:text-slate-200 border-l border-slate-800 flex items-center gap-1"
            title="Reset to 90% Screen Fit"
          >
            <Maximize2 className="w-3 h-3 text-slate-400" />
            Fit
          </button>
        </div>

        <button
          onClick={onOpenExplainer}
          className="flex items-center gap-1.5 px-3 py-1 text-xs font-semibold rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 hover:text-white border border-slate-700/60 transition-colors shadow-sm"
        >
          <BookOpen className="w-3.5 h-3.5 text-indigo-400" />
          Why DP?
        </button>
      </div>
    </header>
  );
};
