import React from 'react';
import { SurroundedRegionsStep } from '../../algorithms/surroundedRegionsIntuitive';
import { Shield, ShieldAlert, CheckCircle2, Crosshair, Sparkles } from 'lucide-react';

interface SurroundedRegionsViewerProps {
  step: SurroundedRegionsStep;
}

export const SurroundedRegionsViewer: React.FC<SurroundedRegionsViewerProps> = ({ step }) => {
  const {
    board,
    phase,
    currentCell,
    safeCells,
    capturedCells,
    headline,
    subtext,
    isComplete,
    stepIndex,
    totalSteps
  } = step;

  const isCurrent = (r: number, c: number) => {
    return currentCell !== null && currentCell[0] === r && currentCell[1] === c;
  };

  const isSafe = (r: number, c: number) => {
    return safeCells.some(([sr, sc]) => sr === r && sc === c);
  };

  const isCaptured = (r: number, c: number) => {
    return capturedCells.some(([cr, cc]) => cr === r && cc === c);
  };

  const getPhaseBadge = () => {
    switch (phase) {
      case 'INIT':
        return <span className="px-2 py-0.5 rounded text-[11px] font-mono bg-slate-800 text-slate-300">Phase 0: Init</span>;
      case 'BORDER_DFS':
        return <span className="px-2 py-0.5 rounded text-[11px] font-mono bg-amber-500/20 text-amber-300 border border-amber-500/30">Phase 1: Border DFS (Mark Safe)</span>;
      case 'CAPTURE_SURROUNDED':
        return <span className="px-2 py-0.5 rounded text-[11px] font-mono bg-rose-500/20 text-rose-300 border border-rose-500/30">Phase 2: Capture Trapped (O -&gt; X)</span>;
      case 'RESTORE_SAFE':
        return <span className="px-2 py-0.5 rounded text-[11px] font-mono bg-emerald-500/20 text-emerald-300 border border-emerald-500/30">Phase 3: Restore Safe (T -&gt; O)</span>;
      case 'COMPLETE':
        return <span className="px-2 py-0.5 rounded text-[11px] font-mono bg-emerald-500/20 text-emerald-400 border border-emerald-500/30">Complete</span>;
    }
  };

  return (
    <div className="flex-1 min-h-0 flex flex-col bg-slate-900/60 border border-slate-800 rounded-2xl p-3 shadow-xl overflow-hidden justify-between">
      {/* Top Banner */}
      <div className="bg-slate-950/70 border border-slate-800/80 rounded-xl p-2.5 flex items-center justify-between shrink-0">
        <div className="flex items-center gap-2">
          <span className="p-1.5 rounded-lg bg-indigo-500/10 text-indigo-400 border border-indigo-500/20">
            <Shield className="w-4 h-4" />
          </span>
          <div>
            <h3 className="text-xs font-semibold text-white tracking-wide">{headline}</h3>
            <p className="text-[11px] text-slate-400">{subtext}</p>
          </div>
        </div>
        <div className="flex items-center gap-2">
          {getPhaseBadge()}
          <span className="px-2 py-0.5 rounded-md bg-indigo-500/10 border border-indigo-500/20 text-indigo-400 text-[11px] font-mono">
            Step {stepIndex + 1} / {totalSteps}
          </span>
        </div>
      </div>

      {/* Main Arena */}
      <div className="flex-1 min-h-0 grid grid-cols-1 md:grid-cols-12 gap-3 py-1 px-1">
        {/* Left: Matrix Grid */}
        <div className="md:col-span-8 flex flex-col items-center justify-center p-2 rounded-xl bg-slate-950/40 border border-slate-800/60 relative overflow-hidden">
          <div className="flex flex-col gap-1.5 p-2 rounded-lg bg-slate-900/80 border border-slate-800 shadow-inner">
            {board.map((row, r) => (
              <div key={r} className="flex gap-1.5">
                {row.map((val, c) => {
                  const current = isCurrent(r, c);
                  const captured = isCaptured(r, c);
                  const safe = isSafe(r, c);

                  let cellStyle = 'bg-slate-800/50 text-slate-400 border-slate-700/50';
                  if (val === 'X') {
                    if (captured) {
                      cellStyle = 'bg-rose-500/20 text-rose-300 border-rose-500/50 shadow-[0_0_10px_rgba(244,63,94,0.3)]';
                    } else {
                      cellStyle = 'bg-slate-800 text-slate-500 border-slate-700';
                    }
                  } else if (val === 'T') {
                    cellStyle = 'bg-amber-500/20 text-amber-300 border-amber-500/50 shadow-[0_0_8px_rgba(245,158,11,0.25)]';
                  } else if (val === 'O') {
                    if (safe) {
                      cellStyle = 'bg-emerald-500/20 text-emerald-300 border-emerald-500/50';
                    } else {
                      cellStyle = 'bg-sky-500/20 text-sky-300 border-sky-500/40';
                    }
                  }

                  if (current) {
                    cellStyle += ' ring-2 ring-indigo-400 scale-105 z-10';
                  }

                  return (
                    <div
                      key={c}
                      className={`w-10 h-10 rounded-lg flex flex-col items-center justify-center font-mono font-bold text-sm border transition-all duration-200 relative ${cellStyle}`}
                    >
                      <span>{val}</span>
                      <span className="text-[8px] opacity-40 leading-none">
                        {r},{c}
                      </span>
                      {current && (
                        <span className="absolute -top-1 -right-1 w-2.5 h-2.5 rounded-full bg-indigo-400 animate-ping" />
                      )}
                    </div>
                  );
                })}
              </div>
            ))}
          </div>
        </div>

        {/* Right: Info & Stats */}
        <div className="md:col-span-4 flex flex-col gap-2 min-h-0">
          {/* Phase Explanations */}
          <div className="bg-slate-950/40 border border-slate-800/60 rounded-xl p-2.5 flex flex-col gap-1.5 flex-1 min-h-0 overflow-y-auto">
            <span className="text-[10px] uppercase font-bold text-slate-400 tracking-wider flex items-center gap-1">
              <Crosshair className="w-3 h-3 text-indigo-400" /> 3-Step Strategy
            </span>
            <div className="text-[11px] text-slate-300 space-y-2">
              <div className={`p-1.5 rounded-lg border transition-colors ${phase === 'BORDER_DFS' ? 'bg-amber-500/10 border-amber-500/30 text-amber-200' : 'bg-slate-900/60 border-slate-800 text-slate-400'}`}>
                <div className="font-semibold text-amber-300">1. Border DFS</div>
                <div className="text-[10px]">Start DFS from border 'O's and temporarily mark as 'T' (safe).</div>
              </div>

              <div className={`p-1.5 rounded-lg border transition-colors ${phase === 'CAPTURE_SURROUNDED' ? 'bg-rose-500/10 border-rose-500/30 text-rose-200' : 'bg-slate-900/60 border-slate-800 text-slate-400'}`}>
                <div className="font-semibold text-rose-300">2. Capture Trapped</div>
                <div className="text-[10px]">Remaining 'O's can never touch borders; flip them to 'X'.</div>
              </div>

              <div className={`p-1.5 rounded-lg border transition-colors ${phase === 'RESTORE_SAFE' ? 'bg-emerald-500/10 border-emerald-500/30 text-emerald-200' : 'bg-slate-900/60 border-slate-800 text-slate-400'}`}>
                <div className="font-semibold text-emerald-300">3. Restore Safe</div>
                <div className="text-[10px]">Convert temporary 'T's back to original 'O's.</div>
              </div>
            </div>
          </div>

          {/* Counts Card */}
          <div className="bg-slate-950/40 border border-slate-800/60 rounded-xl p-2.5 shrink-0 flex items-center justify-between">
            <div className="flex flex-col">
              <span className="text-[10px] text-slate-400">Captured 'O's</span>
              <span className="text-base font-bold text-rose-400 font-mono">
                {capturedCells.length}
              </span>
            </div>
            <div className="flex flex-col">
              <span className="text-[10px] text-slate-400">Safe Boundary 'O's</span>
              <span className="text-base font-bold text-emerald-400 font-mono">
                {safeCells.length}
              </span>
            </div>
            <div className="flex flex-col">
              <span className="text-[10px] text-slate-400">Total Cells</span>
              <span className="text-base font-bold text-indigo-400 font-mono">
                {board.length * (board[0]?.length || 0)}
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* Legend */}
      <div className="flex items-center justify-between bg-slate-950/60 border border-slate-800/60 rounded-xl px-3 py-1.5 shrink-0 text-xs">
        <div className="flex items-center gap-3">
          <div className="flex items-center gap-1.5">
            <span className="w-3 h-3 rounded bg-slate-800 border border-slate-700" />
            <span className="text-slate-400 text-[11px]">'X' (Wall)</span>
          </div>
          <div className="flex items-center gap-1.5">
            <span className="w-3 h-3 rounded bg-sky-500/20 border border-sky-500/40" />
            <span className="text-sky-300 text-[11px]">'O' (Candidate)</span>
          </div>
          <div className="flex items-center gap-1.5">
            <span className="w-3 h-3 rounded bg-amber-500/20 border border-amber-500/50" />
            <span className="text-amber-300 text-[11px]">'T' (Safe Temp)</span>
          </div>
          <div className="flex items-center gap-1.5">
            <span className="w-3 h-3 rounded bg-rose-500/20 border border-rose-500/50" />
            <span className="text-rose-300 text-[11px]">Captured to 'X'</span>
          </div>
        </div>

        {isComplete && (
          <div className="flex items-center gap-1 text-emerald-400 font-semibold text-[11px]">
            <Sparkles className="w-3.5 h-3.5" /> All Trapped Regions Captured
          </div>
        )}
      </div>
    </div>
  );
};
