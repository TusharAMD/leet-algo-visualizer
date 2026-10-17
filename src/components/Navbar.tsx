import React from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { Sparkles, ArrowLeft, BookOpen, ZoomIn, ZoomOut, Maximize2, LayoutGrid, ChevronDown, ExternalLink } from 'lucide-react';
import { TOP_20_PROBLEMS } from '../data/problems';

interface NavbarProps {
  uiScale: number;
  setUiScale: (scale: number | ((prev: number) => number)) => void;
  onOpenExplainer?: () => void;
}

export const Navbar: React.FC<NavbarProps> = ({ uiScale, setUiScale, onOpenExplainer }) => {
  const location = useLocation();
  const navigate = useNavigate();

  const isHome = location.pathname === '/';
  const currentSlug = location.pathname.startsWith('/problem/')
    ? location.pathname.replace('/problem/', '')
    : null;

  const currentProblem = TOP_20_PROBLEMS.find((p) => p.slug === currentSlug);

  return (
    <header className="border-b border-slate-800 bg-slate-900/90 backdrop-blur-md px-5 py-2 flex items-center justify-between gap-3 shrink-0 z-30">
      <div className="flex items-center gap-3">
        {/* Brand / Logo */}
        <Link to="/" className="flex items-center gap-2.5 group">
          <div className="h-8 w-8 rounded-xl bg-gradient-to-tr from-indigo-500 to-purple-600 flex items-center justify-center shadow-md shadow-indigo-500/20 group-hover:scale-105 transition-transform">
            <Sparkles className="w-4 h-4 text-white" />
          </div>
          <div className="hidden sm:block">
            <h1 className="text-sm font-bold text-white group-hover:text-indigo-300 transition-colors">
              DSA Visualized
            </h1>
            <p className="text-[10px] text-slate-400">NeetCode 150 Mental Models</p>
          </div>
        </Link>

        {/* Breadcrumb / Problem Selector */}
        {!isHome && currentProblem && (
          <div className="flex items-center gap-2 pl-3 border-l border-slate-800">
            <Link
              to="/"
              className="flex items-center gap-1 text-xs text-slate-400 hover:text-white px-2 py-1 rounded-lg hover:bg-slate-800 transition-colors"
            >
              <ArrowLeft className="w-3.5 h-3.5" />
              <span className="hidden md:inline">Catalog</span>
            </Link>

            {/* Quick switcher dropdown */}
            <div className="relative">
              <select
                value={currentProblem.slug}
                onChange={(e) => navigate(`/problem/${e.target.value}`)}
                className="bg-slate-950 border border-slate-700/80 rounded-lg px-2.5 py-1 text-xs font-semibold text-indigo-300 focus:outline-none cursor-pointer pr-6 appearance-none shadow-sm"
              >
                {TOP_20_PROBLEMS.map((p) => (
                  <option key={p.slug} value={p.slug}>
                    #{p.leetcodeNum} {p.title} {p.status === 'live' ? '⚡' : ''}
                  </option>
                ))}
              </select>
              <ChevronDown className="w-3 h-3 text-slate-400 absolute right-2 top-2.5 pointer-events-none" />
            </div>

            <span
              className={`px-2 py-0.5 text-[9px] font-bold rounded-full uppercase tracking-wider ${
                currentProblem.difficulty === 'Easy'
                  ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20'
                  : currentProblem.difficulty === 'Medium'
                  ? 'bg-amber-500/10 text-amber-400 border border-amber-500/20'
                  : 'bg-rose-500/10 text-rose-400 border border-rose-500/20'
              }`}
            >
              {currentProblem.difficulty}
            </span>

            {/* LeetCode link */}
            <a
              href={currentProblem.leetcodeUrl}
              target="_blank"
              rel="noreferrer"
              className="hidden sm:flex items-center gap-1 px-2 py-0.5 text-[10px] font-semibold rounded-lg bg-amber-500/10 hover:bg-amber-500/20 text-amber-300 border border-amber-500/30 transition-colors"
              title="Open problem on LeetCode"
            >
              <span>LeetCode #{currentProblem.leetcodeNum}</span>
              <ExternalLink className="w-2.5 h-2.5 text-amber-400" />
            </a>
          </div>
        )}
      </div>

      <div className="flex items-center gap-2.5">
        {/* Zoom / Scale Controls (visible in visualizer) */}
        {!isHome && (
          <div className="flex items-center bg-slate-950/80 border border-slate-800 rounded-xl p-0.5 text-xs text-slate-300">
            <button
              onClick={() => setUiScale((s) => Math.max(0.75, Number((s - 0.05).toFixed(2))))}
              className="p-1 rounded-lg hover:bg-slate-800 text-slate-400 hover:text-white transition-colors"
              title="Zoom Out"
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
              title="Reset to 90% Fit"
            >
              <Maximize2 className="w-3 h-3 text-slate-400" />
              Fit
            </button>
          </div>
        )}

        {/* Explain modal button if present */}
        {onOpenExplainer && !isHome && (
          <button
            onClick={onOpenExplainer}
            className="flex items-center gap-1.5 px-3 py-1 text-xs font-semibold rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 hover:text-white border border-slate-700/60 transition-colors shadow-sm"
          >
            <BookOpen className="w-3.5 h-3.5 text-indigo-400" />
            Guide
          </button>
        )}

        {isHome && (
          <span className="text-xs text-indigo-400 bg-indigo-500/10 border border-indigo-500/20 px-3 py-1 rounded-full font-medium">
            20 Core Archetypes
          </span>
        )}
      </div>
    </header>
  );
};
