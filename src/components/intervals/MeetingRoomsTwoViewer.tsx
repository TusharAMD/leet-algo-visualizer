import React from 'react';
import type { MeetingRoomsTwoStep, Interval } from '../../algorithms/meetingRoomsTwoIntuitive';
import { HelpCircle, CheckCircle2, ArrowDown, ArrowUp } from 'lucide-react';

interface MeetingRoomsTwoViewerProps {
  step: MeetingRoomsTwoStep;
  rawIntervals: Interval[];
}

export const MeetingRoomsTwoViewer: React.FC<MeetingRoomsTwoViewerProps> = ({
  step,
  rawIntervals,
}) => {
  return (
    <div className="flex flex-col h-full gap-3 p-4 select-none">
      {/* Top Status & Variable Badges */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
        <div className="bg-slate-900 border border-slate-800 rounded-xl p-3 flex flex-col justify-center">
          <span className="text-xs text-slate-400 font-medium">Timeline Event</span>
          <span
            className={`text-base font-mono font-bold flex items-center gap-1 ${
              step.eventType === 'start'
                ? 'text-sky-400'
                : step.eventType === 'end'
                ? 'text-emerald-400'
                : 'text-slate-300'
            }`}
          >
            {step.eventType === 'start' && <ArrowDown className="w-4 h-4 text-sky-400" />}
            {step.eventType === 'end' && <ArrowUp className="w-4 h-4 text-emerald-400" />}
            {step.eventType === 'start'
              ? `Start @ ${step.currentStart}`
              : step.eventType === 'end'
              ? `End @ ${step.currentEnd}`
              : step.eventType === 'init'
              ? 'Initialized'
              : 'Finished'}
          </span>
        </div>
        <div className="bg-slate-900 border border-slate-800 rounded-xl p-3 flex flex-col justify-center">
          <span className="text-xs text-slate-400 font-medium">Currently Active Rooms</span>
          <span className="text-2xl font-mono font-black text-indigo-400">
            {step.activeRooms}
          </span>
        </div>
        <div className="bg-slate-900 border border-slate-800 rounded-xl p-3 flex flex-col justify-center">
          <span className="text-xs text-slate-400 font-medium">Peak Demand (Rooms Req.)</span>
          <span className="text-2xl font-mono font-black text-amber-300">
            {step.peakRooms}
          </span>
        </div>
        <div className="bg-slate-900 border border-slate-800 rounded-xl p-3 flex flex-col justify-center">
          <span className="text-xs text-slate-400 font-medium">Pointer State</span>
          <span className="text-sm font-mono font-bold text-slate-300">
            s: {step.sIndex}/{step.starts.length} | e: {step.eIndex}/{step.ends.length}
          </span>
        </div>
      </div>

      {/* Main Two-Pointer Sweep Canvas */}
      <div className="flex-1 bg-slate-900/60 border border-slate-800 rounded-xl p-5 flex flex-col justify-between gap-5 relative overflow-hidden">
        <div className="flex flex-col gap-5 w-full">
          {/* Sorted Starts Array */}
          <div className="flex flex-col gap-1.5">
            <div className="text-xs font-semibold text-sky-400 uppercase tracking-wider flex items-center justify-between">
              <span>Sorted Starts (Meeting Arrivals)</span>
              <span className="text-[11px] font-mono text-slate-400">Pointer: s = {step.sIndex}</span>
            </div>
            <div className="flex items-center gap-2 flex-wrap">
              {step.starts.map((time, idx) => {
                const isCurrent = idx === step.sIndex - 1 && step.eventType === 'start';
                const isProcessed = idx < step.sIndex;
                return (
                  <div
                    key={idx}
                    className={`px-3 py-2 rounded-xl font-mono text-sm font-bold border transition-all duration-200 flex flex-col items-center ${
                      isCurrent
                        ? 'bg-sky-600 border-sky-300 text-white shadow-lg shadow-sky-500/30 scale-105'
                        : isProcessed
                        ? 'bg-sky-950/40 border-sky-800/60 text-sky-300 opacity-60'
                        : 'bg-slate-950 border-slate-800 text-slate-400'
                    }`}
                  >
                    <span>{time}</span>
                    <span className="text-[9px] font-normal text-slate-400">idx {idx}</span>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Sorted Ends Array */}
          <div className="flex flex-col gap-1.5">
            <div className="text-xs font-semibold text-emerald-400 uppercase tracking-wider flex items-center justify-between">
              <span>Sorted Ends (Meeting Departures)</span>
              <span className="text-[11px] font-mono text-slate-400">Pointer: e = {step.eIndex}</span>
            </div>
            <div className="flex items-center gap-2 flex-wrap">
              {step.ends.map((time, idx) => {
                const isCurrent = idx === step.eIndex - 1 && step.eventType === 'end';
                const isProcessed = idx < step.eIndex;
                return (
                  <div
                    key={idx}
                    className={`px-3 py-2 rounded-xl font-mono text-sm font-bold border transition-all duration-200 flex flex-col items-center ${
                      isCurrent
                        ? 'bg-emerald-600 border-emerald-300 text-white shadow-lg shadow-emerald-500/30 scale-105'
                        : isProcessed
                        ? 'bg-emerald-950/40 border-emerald-800/60 text-emerald-300 opacity-60'
                        : 'bg-slate-950 border-slate-800 text-slate-400'
                    }`}
                  >
                    <span>{time}</span>
                    <span className="text-[9px] font-normal text-slate-400">idx {idx}</span>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Room Allocation Status */}
          <div className="flex flex-col gap-1.5">
            <div className="text-xs font-semibold text-indigo-300 uppercase tracking-wider flex items-center justify-between">
              <span>Concurrent Conference Rooms Visualization</span>
              <span className="text-[11px] font-mono text-indigo-300">
                Peak: {step.peakRooms} Rooms
              </span>
            </div>
            <div className="grid grid-cols-2 sm:grid-cols-4 md:grid-cols-6 gap-2">
              {Array.from({ length: Math.max(step.peakRooms, 4) }, (_, idx) => {
                const isOccupied = idx < step.activeRooms;
                return (
                  <div
                    key={idx}
                    className={`p-3 rounded-xl border flex flex-col items-center justify-center gap-1 transition-all duration-300 ${
                      isOccupied
                        ? 'bg-indigo-600/30 border-indigo-400 text-indigo-200 shadow-md shadow-indigo-500/20'
                        : 'bg-slate-950/60 border-slate-800 text-slate-500'
                    }`}
                  >
                    <span className="text-xs font-semibold">Room {idx + 1}</span>
                    <span
                      className={`text-[10px] font-mono font-bold px-1.5 py-0.5 rounded ${
                        isOccupied ? 'bg-indigo-500 text-white' : 'bg-slate-800 text-slate-400'
                      }`}
                    >
                      {isOccupied ? 'OCCUPIED' : 'VACANT'}
                    </span>
                  </div>
                );
              })}
            </div>
          </div>
        </div>

        {/* Bottom Explanation Banner */}
        <div className="w-full bg-slate-950/80 border border-slate-800/80 rounded-xl px-4 py-2.5 text-xs text-slate-300 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <HelpCircle className="w-4 h-4 text-indigo-400 shrink-0" />
            <span>{step.explanation}</span>
          </div>
          {step.eventType === 'complete' && (
            <span className="text-emerald-400 font-semibold flex items-center gap-1 shrink-0">
              <CheckCircle2 className="w-4 h-4" /> Solved ({step.peakRooms} Rooms)
            </span>
          )}
        </div>
      </div>
    </div>
  );
};
