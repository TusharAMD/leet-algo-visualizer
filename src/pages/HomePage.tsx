import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { Sparkles, Play, Search, CheckCircle2, Clock, Compass, ArrowRight, ExternalLink } from 'lucide-react';
import { TOP_20_PROBLEMS } from '../data/problems';

export const HomePage: React.FC = () => {
  const [selectedCategory, setSelectedCategory] = useState<string>('All');
  const [searchQuery, setSearchQuery] = useState<string>('');

  const categories = [
    'All',
    'Dynamic Programming',
    'Two Pointers',
    'Sliding Window',
    'Stack',
    'Binary Search',
    'Linked List',
    'Trees',
    'Backtracking',
    'Graphs'
  ];

  const filteredProblems = TOP_20_PROBLEMS.filter((p) => {
    const matchesCategory = selectedCategory === 'All' || p.category === selectedCategory;
    const matchesSearch =
      p.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      p.mentalModel.toLowerCase().includes(searchQuery.toLowerCase()) ||
      p.leetcodeNum.toString().includes(searchQuery);
    return matchesCategory && matchesSearch;
  });

  const liveCount = TOP_20_PROBLEMS.filter((p) => p.status === 'live').length;

  return (
    <div className="flex-1 min-h-0 overflow-y-auto p-4 md:p-6 max-w-7xl w-full mx-auto flex flex-col gap-6">
      {/* Hero Section */}
      <div className="shrink-0 flex flex-col md:flex-row items-stretch md:items-center justify-between gap-6 p-6 md:p-7 rounded-3xl bg-gradient-to-br from-indigo-950/70 via-slate-900 to-slate-900 border border-indigo-500/30 shadow-2xl relative overflow-hidden">
        <div className="absolute top-0 right-0 -mr-20 -mt-20 w-80 h-80 bg-indigo-500/10 rounded-full blur-3xl pointer-events-none"></div>

        <div className="flex flex-col gap-3 max-w-2xl z-10">
          <div className="flex items-center gap-2 flex-wrap">
            <span className="px-3 py-1 rounded-full text-xs font-bold bg-indigo-500/20 text-indigo-300 border border-indigo-500/30">
              NeetCode 150 Core Curriculum
            </span>
            <span className="px-3 py-1 rounded-full text-xs font-semibold bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 flex items-center gap-1">
              <CheckCircle2 className="w-3.5 h-3.5" /> {liveCount} Live Interactive Engine
            </span>
          </div>

          <h1 className="text-2xl md:text-3xl font-extrabold text-white tracking-tight leading-snug">
            Stop Memorizing Code. <br />
            <span className="bg-clip-text text-transparent bg-gradient-to-r from-indigo-400 via-purple-300 to-pink-400">
              Visualize the Core Mental Models.
            </span>
          </h1>

          <p className="text-xs md:text-sm text-slate-300 leading-relaxed">
            Instead of abstract graph dots or cryptic variable lines, each visualizer renders the
            <strong> exact human decision story</strong> behind the problem. Master these 20 canonical archetypes and 80% of LeetCode patterns click instantly.
          </p>
        </div>

        {/* Featured Live Visualizer CTA */}
        <div className="shrink-0 bg-slate-950/90 p-5 rounded-2xl border border-indigo-500/40 flex flex-col justify-between gap-3 min-w-[280px] shadow-xl z-10">
          <div className="flex items-center justify-between">
            <span className="text-[10px] font-bold text-emerald-400 uppercase tracking-wider flex items-center gap-1">
              <Sparkles className="w-3.5 h-3.5" /> Featured Visualizer
            </span>
            <span className="text-xs font-mono text-slate-400">LeetCode #322</span>
          </div>
          <div>
            <h3 className="text-base font-bold text-white">Coin Change</h3>
            <p className="text-xs text-slate-400 mt-0.5">
              Side-by-side coin choice comparison & DP memory shelf.
            </p>
          </div>
          <Link
            to="/problem/coin-change"
            className="flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl bg-gradient-to-r from-indigo-500 to-purple-600 hover:from-indigo-600 hover:to-purple-700 text-white font-bold text-xs shadow-lg shadow-indigo-500/25 transition-all group"
          >
            <Play className="w-4 h-4 fill-white" /> Launch Visualizer
            <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" />
          </Link>
        </div>
      </div>

      {/* Filter and Search Bar */}
      <div className="shrink-0 flex flex-col md:flex-row items-center justify-between gap-3">
        {/* Category Pills */}
        <div className="flex items-center gap-1.5 overflow-x-auto w-full pb-1 no-scrollbar">
          {categories.map((cat) => (
            <button
              key={cat}
              onClick={() => setSelectedCategory(cat)}
              className={`px-3 py-1.5 rounded-xl text-xs font-medium whitespace-nowrap transition-all ${
                selectedCategory === cat
                  ? 'bg-indigo-600 text-white font-bold shadow-md shadow-indigo-600/30'
                  : 'bg-slate-900 hover:bg-slate-800 text-slate-400 hover:text-white border border-slate-800'
              }`}
            >
              {cat}
            </button>
          ))}
        </div>

        {/* Search Input */}
        <div className="relative w-full md:w-72 shrink-0">
          <Search className="w-4 h-4 text-slate-500 absolute left-3 top-2.5 pointer-events-none" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search problems, patterns, #..."
            className="w-full bg-slate-900 border border-slate-800 rounded-xl pl-9 pr-3 py-1.5 text-xs text-white placeholder:text-slate-500 focus:outline-none focus:border-indigo-500 transition-colors"
          />
        </div>
      </div>

      {/* 20 Problems Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 pb-12">
        {filteredProblems.map((problem) => {
          const isLive = problem.status === 'live';

          return (
            <div
              key={problem.id}
              className={`p-5 rounded-2xl border transition-all flex flex-col justify-between gap-4 relative group ${
                isLive
                  ? 'bg-slate-900/90 border-indigo-500/50 hover:border-indigo-400 shadow-lg shadow-indigo-500/5 hover:shadow-indigo-500/15'
                  : 'bg-slate-900/40 border-slate-800/80 hover:border-slate-700'
              }`}
            >
              {/* Card Header */}
              <div className="flex flex-col gap-2">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <a
                      href={problem.leetcodeUrl}
                      target="_blank"
                      rel="noreferrer"
                      className="inline-flex items-center gap-1 text-xs font-mono font-bold text-slate-400 hover:text-amber-300 transition-colors group/link bg-slate-950/80 px-2 py-0.5 rounded-md border border-slate-800 hover:border-amber-500/40"
                      title={`Open LeetCode #${problem.leetcodeNum} in new tab`}
                    >
                      <span>#{problem.leetcodeNum}</span>
                      <ExternalLink className="w-2.5 h-2.5 text-slate-500 group-hover/link:text-amber-400 transition-colors" />
                    </a>
                    <span
                      className={`text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-full ${
                        problem.difficulty === 'Easy'
                          ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20'
                          : problem.difficulty === 'Medium'
                          ? 'bg-amber-500/10 text-amber-400 border border-amber-500/20'
                          : 'bg-rose-500/10 text-rose-400 border border-rose-500/20'
                      }`}
                    >
                      {problem.difficulty}
                    </span>
                  </div>

                  {isLive ? (
                    <span className="px-2 py-0.5 rounded-full bg-emerald-500/20 text-emerald-300 border border-emerald-500/40 text-[10px] font-bold flex items-center gap-1 shadow-sm">
                      <Sparkles className="w-3 h-3 text-emerald-400" /> Live
                    </span>
                  ) : (
                    <span className="px-2 py-0.5 rounded-full bg-slate-800 text-slate-400 text-[10px] font-medium flex items-center gap-1">
                      <Clock className="w-3 h-3" /> Up Next
                    </span>
                  )}
                </div>

                <h3 className="text-base font-bold text-white group-hover:text-indigo-300 transition-colors">
                  {problem.title}
                </h3>
                <span className="text-[11px] font-medium text-indigo-400">
                  {problem.category}
                </span>

                <p className="text-xs text-slate-400 line-clamp-2">
                  {problem.description}
                </p>
              </div>

              {/* Mental Model Callout */}
              <div className="p-3 rounded-xl bg-slate-950/70 border border-slate-800/80 flex flex-col gap-1">
                <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider flex items-center gap-1">
                  <Compass className="w-3 h-3 text-indigo-400" /> Mental Model
                </span>
                <p className="text-[11px] text-slate-300 leading-snug">
                  {problem.mentalModel}
                </p>
              </div>

              {/* Card Action */}
              <div className="pt-1">
                {isLive ? (
                  <Link
                    to={`/problem/${problem.slug}`}
                    className="w-full flex items-center justify-center gap-2 py-2 px-3 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white font-bold text-xs transition-colors shadow-md shadow-indigo-600/20"
                  >
                    <Play className="w-3.5 h-3.5 fill-white" /> Open Interactive Visualizer
                  </Link>
                ) : (
                  <Link
                    to={`/problem/${problem.slug}`}
                    className="w-full flex items-center justify-center gap-1.5 py-2 px-3 rounded-xl bg-slate-800/80 hover:bg-slate-800 text-slate-300 hover:text-white font-semibold text-xs border border-slate-700/60 transition-colors"
                  >
                    <span>Inspect Blueprint & Roadmap</span>
                    <ArrowRight className="w-3 h-3 text-slate-400" />
                  </Link>
                )}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
