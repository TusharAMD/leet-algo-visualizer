import React from 'react';
import { HouseRobberTwoStep } from '../../algorithms/houseRobberTwoIntuitive';
import { ShieldAlert, CheckCircle2, DollarSign, Sparkles, CircleAlert, Trophy } from 'lucide-react';

interface HouseRobberTwoViewerProps {
  step: HouseRobberTwoStep;
}

export const HouseRobberTwoViewer: React.FC<HouseRobberTwoViewerProps> = ({ step }) => {
  const {
    nums,
    phase,
    subSlice,
    currentHouseIndex,
    subALoot,
    subBLoot,
    robbedHouses,
    headline,
    subtext,
    isComplete,
    result,
    stepIndex,
    totalSteps
  } = step;

  const n = nums.length;

  // Circular layout of houses
  const radius = 110;
  const centerX = 200;
  const centerY = 145;

  const housePositions = Array.from({ length: n }).map((_, i) => {
    const angle = (2 * Math.PI * i) / n - Math.PI / 2;
    return {
      id: i,
      x: centerX + radius * Math.cos(angle),
      y: centerY + radius * Math.sin(angle)
    };
  });

  return (
    <div className="flex-1 min-h-0 flex flex-col bg-slate-900/60 border border-slate-800 rounded-2xl p-3 shadow-xl overflow-hidden justify-between">
      {/* Top Banner */}
      <div className="bg-slate-950/70 border border-slate-800/80 rounded-xl p-2.5 flex items-center justify-between shrink-0">
        <div className="flex items-center gap-2">
          <span className="p-1.5 rounded-lg bg-amber-500/10 text-amber-400 border border-amber-500/20">
            <ShieldAlert className="w-4 h-4" />
          </span>
          <div>
            <h3 className="text-xs font-semibold text-white tracking-wide">{headline}</h3>
            <p className="text-[11px] text-slate-400">{subtext}</p>
          </div>
        </div>
        <div className="flex items-center gap-2">
          {isComplete ? (
            <span className="px-2.5 py-0.5 rounded-md bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 text-xs font-mono font-bold flex items-center gap-1">
              <CheckCircle2 className="w-3.5 h-3.5" /> Best Loot: ${result}
            </span>
          ) : (
            <span className="px-2 py-0.5 rounded-md bg-indigo-500/10 border border-indigo-500/20 text-indigo-400 text-[11px] font-mono">
              Step {stepIndex + 1} / {totalSteps}
            </span>
          )}
        </div>
      </div>

      {/* Main Arena */}
      <div className="flex-1 min-h-0 grid grid-cols-1 md:grid-cols-12 gap-3 py-1 px-1">
        {/* Left: Circular Street SVG */}
        <div className="md:col-span-8 flex flex-col items-center justify-center p-2 rounded-xl bg-slate-950/40 border border-slate-800/60 relative overflow-hidden">
          <svg className="w-full h-full max-h-[290px]" viewBox="0 0 400 290">
            {/* Alarm wire between adjacent houses */}
            {housePositions.map((pos, idx) => {
              const nextPos = housePositions[(idx + 1) % n];
              const isBetweenFirstAndLast = (idx === 0 && (idx + 1) % n === n - 1) || (idx === n - 1 && (idx + 1) % n === 0);

              return (
                <line
                  key={idx}
                  x1={pos.x}
                  y1={pos.y}
                  x2={nextPos.x}
                  y2={nextPos.y}
                  stroke={isBetweenFirstAndLast ? '#f43f5e' : '#334155'}
                  strokeWidth={isBetweenFirstAndLast ? '2.5' : '1.5'}
                  strokeDasharray={isBetweenFirstAndLast ? '3 3' : undefined}
                />
              );
            })}

            {/* Circular House Nodes */}
            {housePositions.map((pos) => {
              const id = pos.id;
              const val = nums[id];
              const isCurrent = currentHouseIndex === id;
              const isRobbed = robbedHouses.includes(id);

              const isExcluded =
                (subSlice === 'EXCLUDE_LAST' && id === n - 1) ||
                (subSlice === 'EXCLUDE_FIRST' && id === 0);

              let fillColor = '#0f172a';
              let strokeColor = '#475569';
              let textColor = '#e2e8f0';

              if (isExcluded) {
                fillColor = '#1e1b4b';
                strokeColor = '#475569';
                textColor = '#64748b';
              } else if (isRobbed) {
                fillColor = '#064e3b';
                strokeColor = '#10b981';
                textColor = '#6ee7b7';
              } else if (isCurrent) {
                fillColor = '#78350f';
                strokeColor = '#f59e0b';
                textColor = '#ffffff';
              }

              return (
                <g key={id} className="transition-all duration-300">
                  <circle
                    cx={pos.x}
                    cy={pos.y}
                    r="22"
                    fill={fillColor}
                    stroke={strokeColor}
                    strokeWidth={isCurrent || isRobbed ? '3' : '2'}
                  />
                  {/* House ID */}
                  <text
                    x={pos.x}
                    y={pos.y - 4}
                    textAnchor="middle"
                    fill={isExcluded ? '#64748b' : textColor}
                    fontSize="10"
                    fontFamily="monospace"
                  >
                    H{id}
                  </text>
                  {/* Loot Value */}
                  <text
                    x={pos.x}
                    y={pos.y + 10}
                    textAnchor="middle"
                    fill={isExcluded ? '#64748b' : '#f59e0b'}
                    fontSize="11"
                    fontFamily="monospace"
                    fontWeight="bold"
                  >
                    ${val}
                  </text>

                  {/* Excluded Slash Badge */}
                  {isExcluded && (
                    <text
                      x={pos.x + 12}
                      y={pos.y - 12}
                      textAnchor="middle"
                      fontSize="14"
                    >
                      🚫
                    </text>
                  )}
                </g>
              );
            })}
          </svg>
        </div>

        {/* Right: Plan A vs Plan B Comparison */}
        <div className="md:col-span-4 flex flex-col gap-2 min-h-0">
          {/* Plan A Card */}
          <div
            className={`p-2.5 rounded-xl border flex flex-col gap-1 transition-all ${
              subSlice === 'EXCLUDE_LAST'
                ? 'bg-amber-500/10 border-amber-500/40 text-amber-200 ring-1 ring-amber-400'
                : 'bg-slate-950/40 border-slate-800/60 text-slate-400'
            }`}
          >
            <div className="flex items-center justify-between text-xs font-bold">
              <span className="flex items-center gap-1">
                <CircleAlert className="w-3.5 h-3.5" /> Plan A: Exclude Last House (H{n - 1})
              </span>
              <span className="text-sm font-mono font-bold text-amber-400">
                ${subALoot}
              </span>
            </div>
            <div className="text-[10px] text-slate-400">
              Rob slice [0 .. {n - 2}] as standard House Robber 1.
            </div>
          </div>

          {/* Plan B Card */}
          <div
            className={`p-2.5 rounded-xl border flex flex-col gap-1 transition-all ${
              subSlice === 'EXCLUDE_FIRST'
                ? 'bg-purple-500/10 border-purple-500/40 text-purple-200 ring-1 ring-purple-400'
                : 'bg-slate-950/40 border-slate-800/60 text-slate-400'
            }`}
          >
            <div className="flex items-center justify-between text-xs font-bold">
              <span className="flex items-center gap-1">
                <CircleAlert className="w-3.5 h-3.5" /> Plan B: Exclude First House (H0)
              </span>
              <span className="text-sm font-mono font-bold text-purple-400">
                ${subBLoot}
              </span>
            </div>
            <div className="text-[10px] text-slate-400">
              Rob slice [1 .. {n - 1}] as standard House Robber 1.
            </div>
          </div>

          {/* Winner Showcase */}
          <div className="bg-slate-950/40 border border-slate-800/60 rounded-xl p-2.5 flex-1 min-h-0 flex flex-col justify-between">
            <span className="text-[10px] uppercase font-bold text-slate-400 tracking-wider flex items-center gap-1">
              <Trophy className="w-3.5 h-3.5 text-amber-400" /> Optimal Circular Selection
            </span>

            <div className="my-auto text-center">
              <div className="text-2xl font-mono font-bold text-emerald-400">
                ${isComplete ? result : Math.max(subALoot, subBLoot)}
              </div>
              <div className="text-[10px] text-slate-400 mt-1">
                {isComplete
                  ? subALoot >= subBLoot
                    ? 'Plan A (Excluding Last) won the heist!'
                    : 'Plan B (Excluding First) won the heist!'
                  : 'Evaluating two independent linear DP slices...'}
              </div>
            </div>

            <div className="p-2 rounded-lg bg-slate-900/60 border border-slate-800 text-[11px] text-slate-300">
              <span className="font-semibold text-emerald-400">Cycle Decoupling:</span>
              <p className="text-[10px] text-slate-400 mt-0.5">
                Because house 0 and house {n - 1} are adjacent, any optimal solution cannot pick both. Testing both exclusions guarantees finding the global maximum.
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Legend */}
      <div className="flex items-center justify-between bg-slate-950/60 border border-slate-800/60 rounded-xl px-3 py-1.5 shrink-0 text-xs">
        <div className="flex items-center gap-3">
          <div className="flex items-center gap-1.5">
            <span className="w-3 h-3 rounded-full bg-emerald-950 border border-emerald-500" />
            <span className="text-emerald-300 text-[11px]">Robbed in Current Plan</span>
          </div>
          <div className="flex items-center gap-1.5">
            <span className="w-4 h-0.5 bg-rose-500 rounded" />
            <span className="text-rose-400 text-[11px]">Circular Alarm Link (H0 &lt;-&gt; H{n - 1})</span>
          </div>
          <div className="flex items-center gap-1.5">
            <span className="text-[11px]">🚫</span>
            <span className="text-slate-400 text-[11px]">Excluded House</span>
          </div>
        </div>

        {isComplete && (
          <div className="flex items-center gap-1 text-emerald-400 font-semibold text-[11px]">
            <CheckCircle2 className="w-3.5 h-3.5" /> Best Circular Loot: ${result}
          </div>
        )}
      </div>
    </div>
  );
};
