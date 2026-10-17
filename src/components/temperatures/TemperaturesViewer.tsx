import React from 'react';
import { TemperatureStep } from '../../algorithms/dailyTemperaturesIntuitive';
import { Thermometer, ArrowDown, Layers, Trophy, Sun, ShieldCheck } from 'lucide-react';

interface TemperaturesViewerProps {
  step: TemperatureStep;
  temperatures: number[];
}

export const TemperaturesViewer: React.FC<TemperaturesViewerProps> = ({ step, temperatures }) => {
  const {
    currentDay,
    currentTemp,
    stack,
    poppedDay,
    answer,
    action,
    headline,
    subtext,
    isComplete,
  } = step;

  const maxTemp = Math.max(...temperatures, 100);
  const minTemp = Math.min(...temperatures, 50);
  const chartHeightPx = 140;

  return (
    <div className="flex flex-col justify-between gap-3 p-4 bg-slate-900/40 border border-slate-800 rounded-2xl h-full overflow-hidden">
      {/* 1. Header Banner */}
      <div className="bg-gradient-to-r from-slate-900 via-indigo-950/40 to-slate-900 border border-indigo-500/20 rounded-xl p-3 shadow shrink-0">
        <div className="flex items-center justify-between gap-2 flex-wrap">
          <div className="flex items-center gap-2.5">
            <div className="w-9 h-9 rounded-xl bg-orange-500/20 border border-orange-500/40 flex items-center justify-center text-orange-300 font-bold font-mono text-sm shrink-0">
              <Thermometer className="w-5 h-5 text-orange-400" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="text-[9px] uppercase font-bold tracking-wider px-1.5 py-0.2 rounded bg-indigo-500/10 text-indigo-400 border border-indigo-500/20">
                  {isComplete ? 'Analysis Finished' : `Today: Day ${currentDay}`}
                </span>
                <span className="text-xs font-mono font-bold text-orange-300">
                  {currentTemp}°F
                </span>
              </div>
              <h2 className="text-xs font-bold text-white leading-tight mt-0.5">{headline}</h2>
            </div>
          </div>

          {/* Stack Size Badge */}
          <div className="flex items-center gap-2 shrink-0">
            <div className="flex items-center gap-1.5 px-3 py-1 rounded-xl bg-indigo-500/20 border border-indigo-500/40 text-indigo-300 text-xs font-mono">
              <Layers className="w-3.5 h-3.5 text-indigo-400" />
              <span>Waiting in Stack: {stack.length} day(s)</span>
            </div>
          </div>
        </div>
        <p className="text-[11px] text-slate-300 mt-1.5 leading-normal font-sans line-clamp-2">{subtext}</p>
      </div>

      {/* 2. Temperature Bars & Stack Chamber */}
      <div className="flex-1 min-h-0 grid grid-cols-1 md:grid-cols-12 gap-3 items-end">
        {/* Daily Bars */}
        <div className="md:col-span-8 flex flex-col justify-end gap-2">
          <div className="flex items-center justify-between text-xs text-slate-400 px-1">
            <span className="text-[11px] font-semibold text-slate-300 flex items-center gap-1">
              <Sun className="w-3.5 h-3.5 text-amber-400" />
              Daily Temperatures Timeline
            </span>
          </div>

          <div className="overflow-x-auto pt-8 pb-1">
            <div className="flex items-end gap-2 min-w-max px-4 justify-center" style={{ height: `${chartHeightPx + 30}px` }}>
              {temperatures.map((temp, day) => {
                const isCurrent = day === currentDay && !isComplete;
                const inStack = stack.some((s) => s.day === day);
                const isResolvedJustNow = poppedDay && poppedDay.day === day;
                const barHeightPx = ((temp - minTemp + 10) / (maxTemp - minTemp + 15)) * chartHeightPx;

                return (
                  <div key={day} className="relative flex flex-col items-center">
                    {/* Floating Pointer */}
                    {isCurrent && (
                      <div className="absolute -top-7 flex flex-col items-center animate-bounce text-orange-400 z-20 whitespace-nowrap pointer-events-none">
                        <span className="text-[9px] font-extrabold uppercase tracking-wider bg-orange-950/90 text-orange-300 px-2 py-0.5 rounded-full border border-orange-500/60 shadow-lg backdrop-blur">
                          Today
                        </span>
                        <ArrowDown className="w-3 h-3 text-orange-400" />
                      </div>
                    )}

                    {/* Bar */}
                    <div
                      className={`w-9 rounded-t flex flex-col items-center justify-between pb-1 border transition-all ${
                        isResolvedJustNow
                          ? 'border-emerald-400 bg-emerald-500/30 text-white shadow-lg shadow-emerald-500/20 scale-105 z-10'
                          : isCurrent
                          ? 'border-orange-400 bg-orange-500/30 text-white shadow-md shadow-orange-500/20 scale-105 z-10'
                          : inStack
                          ? 'border-indigo-400 bg-indigo-500/20 text-indigo-200'
                          : 'border-slate-800 bg-slate-900/40 text-slate-500'
                      }`}
                      style={{ height: `${Math.max(barHeightPx, 20)}px` }}
                    >
                      <span className="text-[9px] font-mono font-bold pt-0.5">{temp}°</span>
                      <span className="text-[8px] font-mono text-slate-400">D{day}</span>
                    </div>

                    {/* Answer Badge Below Bar */}
                    <div className="mt-1 text-center">
                      <span
                        className={`text-[9px] font-mono font-bold px-1.5 py-0.2 rounded ${
                          answer[day] > 0
                            ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/40'
                            : 'text-slate-500'
                        }`}
                      >
                        {answer[day]}d
                      </span>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>

        {/* The Monotonic Stack Chamber */}
        <div className="md:col-span-4 flex flex-col items-center justify-end">
          <div className="text-[10px] font-semibold text-slate-300 mb-1 flex items-center gap-1">
            <Layers className="w-3 h-3 text-indigo-400" />
            Monotonic Waiting Stack
          </div>

          <div className="w-full h-32 bg-slate-950/80 border-b-2 border-x-2 border-t-0 border-indigo-500/40 rounded-b-xl p-1.5 flex flex-col-reverse gap-1 overflow-y-auto shadow-inner">
            {stack.length === 0 ? (
              <div className="flex-1 flex items-center justify-center text-[10px] text-slate-600 italic">
                Stack Empty
              </div>
            ) : (
              stack.map((item, idx) => {
                const isTop = idx === stack.length - 1;
                return (
                  <div
                    key={item.day}
                    className={`w-full py-0.5 rounded border flex items-center justify-between px-2 text-[10px] font-mono font-bold ${
                      isTop
                        ? 'border-orange-400 bg-orange-500/20 text-white shadow-sm'
                        : 'border-slate-800 bg-slate-900 text-slate-300'
                    }`}
                  >
                    <span>Day {item.day} ({item.temp}°)</span>
                    <span className="text-[8px] text-slate-500">{isTop ? 'TOP' : 'WAITS'}</span>
                  </div>
                );
              })
            )}
          </div>
        </div>
      </div>

      {/* 3. Output Array & Guarantee Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-3 pt-1 border-t border-slate-800/80 shrink-0">
        <div className="p-2.5 rounded-xl bg-slate-950/70 border border-slate-800 flex flex-col justify-between gap-1">
          <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">
            Output Array: <code className="text-emerald-300 font-mono">answer[0 .. {temperatures.length - 1}]</code>
          </span>
          <div className="flex items-center gap-1.5 overflow-x-auto p-1 font-mono text-xs">
            {answer.map((ans, i) => (
              <span
                key={i}
                className={`px-2 py-0.5 rounded border text-[11px] font-bold ${
                  ans > 0
                    ? 'bg-emerald-500/10 border-emerald-500/30 text-emerald-300'
                    : 'bg-slate-900 border-slate-800 text-slate-500'
                }`}
              >
                {ans}
              </span>
            ))}
          </div>
        </div>

        <div className="p-2.5 rounded-xl bg-slate-950/70 border border-slate-800 flex flex-col justify-between gap-1">
          <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider flex items-center gap-1.5">
            <ShieldCheck className="w-3.5 h-3.5 text-indigo-400" />
            Monotonic Stack Invariant
          </span>
          <p className="text-[11px] text-slate-300 leading-snug">
            {isComplete ? (
              <span className="text-emerald-300 font-semibold flex items-center gap-1">
                <Trophy className="w-3.5 h-3.5 text-emerald-400" /> Solved in linear O(n) runtime!
              </span>
            ) : (
              <>
                Temperatures in stack strictly decrease. A warmer day pops all colder days before it, instantly calculating their exact wait in $O(1)$ amortized time.
              </>
            )}
          </p>
        </div>
      </div>
    </div>
  );
};
