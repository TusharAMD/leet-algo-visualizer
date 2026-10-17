import React from 'react';
import { AlienDictionaryStep } from '../../algorithms/alienDictionaryIntuitive';
import { Languages, CheckCircle2, AlertTriangle, ArrowRight, BookOpen, Sparkles } from 'lucide-react';

interface AlienDictionaryViewerProps {
  step: AlienDictionaryStep;
}

export const AlienDictionaryViewer: React.FC<AlienDictionaryViewerProps> = ({ step }) => {
  const {
    words,
    uniqueLetters,
    adj,
    activePair,
    activeChar,
    order,
    hasCycle,
    isInvalidPrefix,
    headline,
    subtext,
    isComplete,
    result,
    stepIndex,
    totalSteps
  } = step;

  // Node positions on circle
  const radius = 120;
  const centerX = 200;
  const centerY = 150;

  const nodePositions: { [char: string]: { x: number; y: number } } = {};
  uniqueLetters.forEach((char, i) => {
    const angle = (2 * Math.PI * i) / uniqueLetters.length - Math.PI / 2;
    nodePositions[char] = {
      x: centerX + radius * Math.cos(angle),
      y: centerY + radius * Math.sin(angle)
    };
  });

  return (
    <div className="flex-1 min-h-0 flex flex-col bg-slate-900/60 border border-slate-800 rounded-2xl p-3 shadow-xl overflow-hidden justify-between">
      {/* Top Banner */}
      <div className="bg-slate-950/70 border border-slate-800/80 rounded-xl p-2.5 flex items-center justify-between shrink-0">
        <div className="flex items-center gap-2">
          <span className="p-1.5 rounded-lg bg-purple-500/10 text-purple-400 border border-purple-500/20">
            <Languages className="w-4 h-4" />
          </span>
          <div>
            <h3 className="text-xs font-semibold text-white tracking-wide">{headline}</h3>
            <p className="text-[11px] text-slate-400">{subtext}</p>
          </div>
        </div>
        <div className="flex items-center gap-2">
          {isComplete ? (
            result !== '' ? (
              <span className="px-2.5 py-0.5 rounded-md bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 text-xs font-mono font-bold flex items-center gap-1">
                <CheckCircle2 className="w-3.5 h-3.5" /> Alphabet: "{result}"
              </span>
            ) : (
              <span className="px-2.5 py-0.5 rounded-md bg-rose-500/10 border border-rose-500/20 text-rose-400 text-xs font-mono font-bold flex items-center gap-1">
                <AlertTriangle className="w-3.5 h-3.5" /> Invalid Lexicon ("")
              </span>
            )
          ) : (
            <span className="px-2 py-0.5 rounded-md bg-indigo-500/10 border border-indigo-500/20 text-indigo-400 text-[11px] font-mono">
              Step {stepIndex + 1} / {totalSteps}
            </span>
          )}
        </div>
      </div>

      {/* Main Arena */}
      <div className="flex-1 min-h-0 grid grid-cols-1 md:grid-cols-12 gap-3 py-1 px-1">
        {/* Left: SVG Character DAG */}
        <div className="md:col-span-8 flex flex-col items-center justify-center p-2 rounded-xl bg-slate-950/40 border border-slate-800/60 relative overflow-hidden">
          <svg className="w-full h-full max-h-[300px]" viewBox="0 0 400 300">
            <defs>
              <marker
                id="alien-arrow"
                viewBox="0 0 10 10"
                refX="22"
                refY="5"
                markerWidth="6"
                markerHeight="6"
                orient="auto-start-reverse"
              >
                <path d="M 0 1 L 10 5 L 0 9 z" fill="#a855f7" />
              </marker>
            </defs>

            {/* Precedence Edges */}
            {uniqueLetters.map((c1) =>
              (adj[c1] || []).map((c2, idx) => {
                const p1 = nodePositions[c1];
                const p2 = nodePositions[c2];
                if (!p1 || !p2) return null;

                const isActive = activeChar === c1;

                const dx = p2.x - p1.x;
                const dy = p2.y - p1.y;
                const cx = (p1.x + p2.x) / 2 - dy * 0.12;
                const cy = (p1.y + p2.y) / 2 + dx * 0.12;

                return (
                  <path
                    key={`${c1}-${c2}-${idx}`}
                    d={`M ${p1.x} ${p1.y} Q ${cx} ${cy} ${p2.x} ${p2.y}`}
                    fill="none"
                    stroke={isActive ? '#d8b4fe' : '#a855f7'}
                    strokeWidth={isActive ? '2.5' : '1.5'}
                    markerEnd="url(#alien-arrow)"
                    className="transition-all duration-300"
                  />
                );
              })
            )}

            {/* Glyphs */}
            {uniqueLetters.map((char) => {
              const pos = nodePositions[char];
              if (!pos) return null;

              const isActive = activeChar === char;
              const isSettled = order.includes(char);

              let fillColor = '#0f172a';
              let strokeColor = '#475569';
              let textColor = '#e2e8f0';

              if (isActive) {
                fillColor = '#581c87';
                strokeColor = '#c084fc';
                textColor = '#ffffff';
              } else if (isSettled) {
                fillColor = '#064e3b';
                strokeColor = '#10b981';
                textColor = '#6ee7b7';
              }

              return (
                <g key={char} className="transition-all duration-300">
                  <circle
                    cx={pos.x}
                    cy={pos.y}
                    r="18"
                    fill={fillColor}
                    stroke={strokeColor}
                    strokeWidth={isActive ? '3' : '2'}
                  />
                  <text
                    x={pos.x}
                    y={pos.y + 4}
                    textAnchor="middle"
                    fill={textColor}
                    fontSize="13"
                    fontFamily="monospace"
                    fontWeight="bold"
                  >
                    {char}
                  </text>
                </g>
              );
            })}
          </svg>
        </div>

        {/* Right: Lexicon & Order Sequence */}
        <div className="md:col-span-4 flex flex-col gap-2 min-h-0">
          {/* Alphabet Decoded Tape */}
          <div className="bg-slate-950/40 border border-slate-800/60 rounded-xl p-2.5 flex flex-col gap-1.5 shrink-0">
            <span className="text-[10px] uppercase font-bold text-slate-400 tracking-wider flex items-center gap-1">
              <Sparkles className="w-3 h-3 text-purple-400" /> Deciphered Alphabet
            </span>
            <div className="flex items-center gap-1 overflow-x-auto p-1.5 bg-slate-900/70 border border-slate-800 rounded-lg min-h-[36px]">
              {order.length === 0 ? (
                <span className="text-[11px] text-slate-500 italic">No letters ordered yet</span>
              ) : (
                order.map((c, idx) => (
                  <React.Fragment key={idx}>
                    <span className="px-2 py-0.5 rounded bg-purple-500/20 text-purple-300 border border-purple-500/40 text-xs font-mono font-bold shrink-0">
                      {c}
                    </span>
                    {idx < order.length - 1 && (
                      <ArrowRight className="w-3 h-3 text-slate-600 shrink-0" />
                    )}
                  </React.Fragment>
                ))
              )}
            </div>
          </div>

          {/* Lexicon Words */}
          <div className="bg-slate-950/40 border border-slate-800/60 rounded-xl p-2.5 flex flex-col gap-1.5 flex-1 min-h-0 overflow-y-auto">
            <span className="text-[10px] uppercase font-bold text-slate-400 tracking-wider flex items-center gap-1">
              <BookOpen className="w-3 h-3 text-indigo-400" /> Dictionary Words
            </span>

            <div className="space-y-1 mt-0.5">
              {words.map((w, wIdx) => {
                const isPair1 = activePair && activePair[0] === w;
                const isPair2 = activePair && activePair[1] === w;
                const isExamining = isPair1 || isPair2;

                return (
                  <div
                    key={wIdx}
                    className={`px-2 py-1 rounded text-xs font-mono flex items-center justify-between border ${
                      isExamining
                        ? 'bg-purple-500/20 text-purple-200 border-purple-500/40 font-bold'
                        : 'bg-slate-900/60 text-slate-400 border-slate-800'
                    }`}
                  >
                    <span>{w}</span>
                    {isPair1 && <span className="text-[9px] text-purple-400">Word i</span>}
                    {isPair2 && <span className="text-[9px] text-purple-400">Word i+1</span>}
                  </div>
                );
              })}
            </div>

            <div className="mt-auto p-2 rounded-lg bg-slate-900/60 border border-slate-800 text-[11px] text-slate-300">
              <span className="font-semibold text-purple-400">Alien Grammar:</span>
              <p className="text-[10px] text-slate-400 mt-0.5">
                Adjacent word comparisons define strict order: first non-matching character pair <code>w1[j] &rarr; w2[j]</code> generates a DAG edge.
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Legend */}
      <div className="flex items-center justify-between bg-slate-950/60 border border-slate-800/60 rounded-xl px-3 py-1.5 shrink-0 text-xs">
        <div className="flex items-center gap-3">
          <div className="flex items-center gap-1.5">
            <span className="w-3 h-3 rounded-full bg-purple-950 border border-purple-400" />
            <span className="text-purple-300 text-[11px]">Active Glyph</span>
          </div>
          <div className="flex items-center gap-1.5">
            <span className="w-3 h-3 rounded-full bg-emerald-950 border border-emerald-500" />
            <span className="text-emerald-300 text-[11px]">Ordered Glyph</span>
          </div>
          <div className="flex items-center gap-1.5">
            <span className="w-4 h-0.5 bg-purple-400 rounded" />
            <span className="text-purple-300 text-[11px]">Precedence Rule</span>
          </div>
        </div>

        {isComplete && (
          <div className="flex items-center gap-1 text-[11px] font-semibold">
            {result !== '' ? (
              <span className="text-emerald-400 flex items-center gap-1">
                <CheckCircle2 className="w-3.5 h-3.5" /> Alien Order: "{result}"
              </span>
            ) : (
              <span className="text-rose-400 flex items-center gap-1">
                <AlertTriangle className="w-3.5 h-3.5" /> Contradiction Detected
              </span>
            )}
          </div>
        )}
      </div>
    </div>
  );
};
