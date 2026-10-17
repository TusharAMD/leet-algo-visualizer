import React from 'react';
import { EncodeDecodeStep } from '../../algorithms/encodeDecodeStringsIntuitive';
import { Binary, CheckCircle2, ArrowRight, ArrowDown, Send, ShieldCheck, Hash } from 'lucide-react';

interface EncodeDecodeStringsViewerProps {
  step: EncodeDecodeStep;
}

export const EncodeDecodeStringsViewer: React.FC<EncodeDecodeStringsViewerProps> = ({ step }) => {
  const {
    phase,
    originalStrs,
    encodedStr,
    encodedChunks,
    encodeIndex,
    decodeI,
    decodeJ,
    currentDecodedLength,
    decodedStrs,
    headline,
    subtext,
    isComplete,
    stepIndex,
    totalSteps
  } = step;

  return (
    <div className="flex-1 min-h-0 flex flex-col bg-slate-900/60 border border-slate-800 rounded-2xl p-3 shadow-xl overflow-hidden justify-between">
      {/* Top Banner */}
      <div className="bg-slate-950/70 border border-slate-800/80 rounded-xl p-2.5 flex items-center justify-between shrink-0">
        <div className="flex items-center gap-2">
          <span className="p-1.5 rounded-lg bg-indigo-500/10 text-indigo-400 border border-indigo-500/20">
            <Binary className="w-4 h-4" />
          </span>
          <div>
            <h3 className="text-xs font-semibold text-white tracking-wide">{headline}</h3>
            <p className="text-[11px] text-slate-400">{subtext}</p>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <span
            className={`px-2 py-0.5 rounded-md text-[11px] font-semibold border ${
              phase === 'ENCODING'
                ? 'bg-amber-500/10 border-amber-500/30 text-amber-300'
                : phase === 'TRANSIT'
                ? 'bg-sky-500/10 border-sky-500/30 text-sky-300'
                : phase === 'DECODING'
                ? 'bg-purple-500/10 border-purple-500/30 text-purple-300'
                : 'bg-emerald-500/10 border-emerald-500/30 text-emerald-300'
            }`}
          >
            Phase: {phase}
          </span>
          <span className="px-2 py-0.5 rounded-md bg-indigo-500/10 border border-indigo-500/20 text-indigo-400 text-[11px] font-mono">
            Step {stepIndex + 1} / {totalSteps}
          </span>
        </div>
      </div>

      {/* Main Arena: 3 stacked tiers (Original -> Wire -> Decoded) */}
      <div className="flex-1 min-h-0 flex flex-col gap-2.5 py-1 justify-between">
        {/* Tier 1: Original Strings */}
        <div className="bg-slate-950/60 border border-slate-800 rounded-xl p-2.5 shrink-0 flex flex-col gap-1.5">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-slate-300 flex items-center gap-1.5">
              <Hash className="w-3.5 h-3.5 text-indigo-400" />
              Original Strings: encode(strs)
            </span>
            <span className="text-[10px] font-mono text-slate-400">
              {originalStrs.length} item(s)
            </span>
          </div>

          <div className="flex items-center gap-2 overflow-x-auto py-1">
            {originalStrs.map((str, idx) => {
              const isCurrentEncoding = phase === 'ENCODING' && idx === encodeIndex;
              const isAlreadyEncoded =
                phase !== 'ENCODING' || idx <= encodeIndex;
              return (
                <div
                  key={idx}
                  className={`flex items-center gap-1.5 px-2.5 py-1 rounded-xl border font-mono text-xs transition-all ${
                    isCurrentEncoding
                      ? 'bg-amber-500/20 border-amber-400 text-amber-200 ring-2 ring-amber-400/50 scale-105'
                      : isAlreadyEncoded
                      ? 'bg-indigo-500/10 border-indigo-500/30 text-indigo-300'
                      : 'bg-slate-900 border-slate-800 text-slate-400'
                  }`}
                >
                  <span className="text-[9px] px-1 py-0.2 rounded bg-slate-800 text-slate-400 font-bold">
                    len: {str.length}
                  </span>
                  <span className="font-bold">"{str}"</span>
                </div>
              );
            })}
          </div>
        </div>

        {/* Tier 2: The Wire / Serialized String */}
        <div className="flex-1 bg-slate-950/70 border border-slate-800 rounded-xl p-2.5 flex flex-col justify-between overflow-hidden">
          <div className="flex items-center justify-between border-b border-slate-800/70 pb-1 shrink-0">
            <span className="text-xs font-semibold text-sky-300 flex items-center gap-1.5">
              <Send className="w-3.5 h-3.5 text-sky-400" />
              Serialized Wire Stream: string `s`
            </span>
            <span className="text-[10px] font-mono text-slate-400">
              Length: {encodedStr.length} chars
            </span>
          </div>

          <div className="flex-1 flex flex-col items-center justify-center py-2 overflow-x-auto">
            {encodedStr.length === 0 ? (
              <span className="text-slate-600 text-xs italic">Awaiting serialization...</span>
            ) : (
              <div className="flex items-center gap-1 overflow-x-auto py-2 px-1 max-w-full">
                {encodedStr.split('').map((char, cIdx) => {
                  const isI = phase === 'DECODING' && cIdx === decodeI;
                  const isJ = phase === 'DECODING' && cIdx === decodeJ;
                  const isDelimiter = char === '#';
                  const isInCurrentSlice =
                    phase === 'DECODING' &&
                    currentDecodedLength !== null &&
                    cIdx > decodeJ &&
                    cIdx <= decodeJ + currentDecodedLength;

                  return (
                    <div key={cIdx} className="flex flex-col items-center shrink-0">
                      <span className="text-[8px] font-mono text-slate-500">{cIdx}</span>
                      <div
                        className={`w-7 h-8 rounded-lg flex items-center justify-center font-mono font-bold text-xs border transition-all ${
                          isI
                            ? 'bg-amber-500/25 border-amber-400 text-amber-200 ring-2 ring-amber-400'
                            : isJ
                            ? 'bg-rose-500/25 border-rose-400 text-rose-200 ring-2 ring-rose-400'
                            : isInCurrentSlice
                            ? 'bg-purple-500/25 border-purple-400 text-purple-200'
                            : isDelimiter
                            ? 'bg-slate-800 border-slate-600 text-slate-300'
                            : 'bg-slate-900 border-slate-800 text-slate-200'
                        }`}
                      >
                        {char}
                      </div>
                      <span className="text-[8px] font-mono font-bold">
                        {isI ? (
                          <span className="text-amber-400">i</span>
                        ) : isJ ? (
                          <span className="text-rose-400">j (#)</span>
                        ) : (
                          ''
                        )}
                      </span>
                    </div>
                  );
                })}
              </div>
            )}
          </div>

          <div className="text-[10px] text-slate-500 bg-slate-900/80 rounded-lg p-1.5 border border-slate-800/60 text-center shrink-0">
            Decoding algorithm: Pointer i marks length start; j scans for delimiter '#'; slice takes exactly length chars!
          </div>
        </div>

        {/* Tier 3: Decoded Strings */}
        <div className="bg-slate-950/60 border border-slate-800 rounded-xl p-2.5 shrink-0 flex flex-col gap-1.5">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-emerald-400 flex items-center gap-1.5">
              <ShieldCheck className="w-3.5 h-3.5" />
              Decoded Output: decode(s)
            </span>
            <span className="text-[10px] font-mono text-slate-400">
              {decodedStrs.length} item(s) recovered
            </span>
          </div>

          <div className="flex items-center gap-2 overflow-x-auto py-1 min-h-[38px]">
            {decodedStrs.length === 0 ? (
              <span className="text-slate-600 text-xs italic">No strings decoded yet</span>
            ) : (
              decodedStrs.map((str, idx) => (
                <div
                  key={idx}
                  className="flex items-center gap-1.5 px-2.5 py-1 rounded-xl bg-emerald-500/10 border border-emerald-500/30 text-emerald-300 font-mono text-xs font-bold shadow"
                >
                  <CheckCircle2 className="w-3 h-3 text-emerald-400" />
                  <span>"{str}"</span>
                </div>
              ))
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
