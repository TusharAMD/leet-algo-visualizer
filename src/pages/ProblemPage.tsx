import React, { useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { TOP_20_PROBLEMS } from '../data/problems';
import { CoinChangeProblem } from './problems/CoinChangeProblem';
import { TwoSumProblem } from './problems/TwoSumProblem';
import { TrappingRainWaterProblem } from './problems/TrappingRainWaterProblem';
import { Compass, Code, ExternalLink, ArrowLeft, Play, Sparkles, CheckCircle2 } from 'lucide-react';

interface ProblemPageProps {
  uiScale: number;
  setUiScale: (scale: number | ((prev: number) => number)) => void;
}

export const ProblemPage: React.FC<ProblemPageProps> = ({ uiScale }) => {
  const { slug } = useParams<{ slug: string }>();
  const [isExplainerOpen, setIsExplainerOpen] = useState<boolean>(false);

  const problem = TOP_20_PROBLEMS.find((p) => p.slug === slug);

  if (!problem) {
    return (
      <div className="flex-1 flex flex-col items-center justify-center p-6 text-center">
        <h2 className="text-xl font-bold text-white mb-2">Problem Not Found</h2>
        <p className="text-xs text-slate-400 mb-4">The problem with slug "{slug}" does not exist in the curriculum.</p>
        <Link
          to="/"
          className="flex items-center gap-1.5 px-4 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-semibold"
        >
          <ArrowLeft className="w-3.5 h-3.5" /> Back to Catalog
        </Link>
      </div>
    );
  }

  // If Coin Change
  if (slug === 'coin-change') {
    return (
      <CoinChangeProblem
        isExplainerOpen={isExplainerOpen}
        setIsExplainerOpen={setIsExplainerOpen}
        uiScale={uiScale}
      />
    );
  }

  // If Two Sum II (Sorted Array)
  if (slug === 'two-sum-ii') {
    return <TwoSumProblem uiScale={uiScale} />;
  }

  // If Trapping Rain Water
  if (slug === 'trapping-rain-water') {
    return <TrappingRainWaterProblem uiScale={uiScale} />;
  }

  // For other problems, show the Blueprint & Roadmap Page
  return (
    <div className="flex-1 overflow-y-auto p-6 md:p-10 max-w-4xl w-full mx-auto flex flex-col gap-6">
      {/* Back button */}
      <div>
        <Link
          to="/"
          className="inline-flex items-center gap-1.5 text-xs text-slate-400 hover:text-white px-3 py-1.5 rounded-xl bg-slate-900 border border-slate-800 hover:bg-slate-800 transition-colors"
        >
          <ArrowLeft className="w-3.5 h-3.5" /> Back to 20 Problems Catalog
        </Link>
      </div>

      {/* Problem Header Card */}
      <div className="bg-slate-900/60 border border-slate-800 rounded-3xl p-6 md:p-8 flex flex-col gap-4 shadow-xl">
        <div className="flex items-center justify-between flex-wrap gap-2">
          <div className="flex items-center gap-2">
            <span className="text-xs font-mono font-bold text-indigo-400 px-2.5 py-1 rounded-lg bg-indigo-500/10 border border-indigo-500/20">
              LeetCode #{problem.leetcodeNum}
            </span>
            <span
              className={`text-xs font-bold px-2.5 py-1 rounded-lg uppercase tracking-wider ${
                problem.difficulty === 'Easy'
                  ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20'
                  : problem.difficulty === 'Medium'
                  ? 'bg-amber-500/10 text-amber-400 border border-amber-500/20'
                  : 'bg-rose-500/10 text-rose-400 border border-rose-500/20'
              }`}
            >
              {problem.difficulty}
            </span>
            <span className="text-xs text-slate-400 px-2.5 py-1 rounded-lg bg-slate-800">
              {problem.category}
            </span>
          </div>

          <a
            href={`https://leetcode.com/problems/${problem.slug}/`}
            target="_blank"
            rel="noreferrer"
            className="flex items-center gap-1 text-xs text-slate-400 hover:text-indigo-300 font-medium transition-colors"
          >
            LeetCode Link <ExternalLink className="w-3.5 h-3.5" />
          </a>
        </div>

        <div>
          <h1 className="text-2xl font-extrabold text-white">{problem.title}</h1>
          <p className="text-xs text-slate-300 mt-1 leading-relaxed">{problem.description}</p>
        </div>
      </div>

      {/* Mental Model Blueprint */}
      <div className="bg-indigo-950/20 border border-indigo-500/30 rounded-3xl p-6 flex flex-col gap-3">
        <div className="flex items-center gap-2 text-indigo-300 font-bold text-sm">
          <Compass className="w-4 h-4 text-indigo-400" />
          Planned Mental Model Architecture
        </div>
        <p className="text-xs text-slate-200 leading-relaxed font-sans">{problem.mentalModel}</p>
      </div>

      {/* Status & Next Actions */}
      <div className="p-6 rounded-3xl bg-slate-900/40 border border-slate-800 flex flex-col gap-4">
        <div className="flex items-center gap-2">
          <span className="w-2.5 h-2.5 rounded-full bg-amber-400 animate-pulse"></span>
          <span className="text-xs font-bold text-slate-300 uppercase tracking-wider">
            Up Next in Development Queue
          </span>
        </div>
        <p className="text-xs text-slate-400">
          This problem is registered in your multi-page router. We can build its step generator and custom visualizer whenever you're ready!
        </p>

        <div className="flex items-center gap-3 pt-2">
          <Link
            to="/problem/coin-change"
            className="flex items-center gap-2 px-4 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-semibold transition-colors"
          >
            <Play className="w-3.5 h-3.5 fill-white" /> View Live Coin Change Visualizer
          </Link>
          <Link
            to="/"
            className="px-4 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs font-semibold transition-colors"
          >
            Browse All 20 Problems
          </Link>
        </div>
      </div>
    </div>
  );
};
