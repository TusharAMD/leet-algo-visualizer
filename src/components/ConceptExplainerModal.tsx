import React from 'react';
import { X, BookOpen, AlertTriangle, Cpu, Sparkles } from 'lucide-react';

interface ConceptExplainerModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const ConceptExplainerModal: React.FC<ConceptExplainerModalProps> = ({ isOpen, onClose }) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/75 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="bg-slate-900 border border-slate-800 rounded-3xl max-w-2xl w-full max-h-[85vh] overflow-y-auto shadow-2xl p-6 flex flex-col gap-5">
        {/* Modal Header */}
        <div className="flex items-center justify-between border-b border-slate-800 pb-4">
          <div className="flex items-center gap-2.5">
            <div className="p-2 rounded-xl bg-indigo-500/10 text-indigo-400">
              <BookOpen className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-lg font-bold text-white">Understanding Coin Change</h3>
              <p className="text-xs text-slate-400">LeetCode #322 • Dynamic Programming Mental Model</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-xl text-slate-400 hover:text-white hover:bg-slate-800 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content sections */}
        <div className="space-y-4 text-xs text-slate-300 leading-relaxed">
          {/* Section 1: The Greedy Trap */}
          <div className="p-4 rounded-2xl bg-amber-950/20 border border-amber-500/20 flex flex-col gap-2">
            <div className="flex items-center gap-2 text-amber-300 font-bold text-sm">
              <AlertTriangle className="w-4 h-4 text-amber-400" />
              Why Doesn't Greedy Work?
            </div>
            <p>
              In currency systems like standard USD (1¢, 5¢, 10¢, 25¢), greedily picking the largest coin always works.
              However, with arbitrary coin denominations, **greedy fails catastrophically**:
            </p>
            <div className="bg-slate-950/80 p-3 rounded-xl border border-slate-800 font-mono text-[11px] text-amber-200/90">
              Coins = [1, 3, 4], Target = $6<br/>
              • Greedy picks largest first: 4 + 1 + 1 ➔ 3 coins ❌<br/>
              • Optimal DP solution: 3 + 3 ➔ 2 coins ✅
            </div>
          </div>

          {/* Section 2: Bottom-Up vs Top-Down */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            <div className="p-3.5 rounded-xl bg-slate-950/60 border border-slate-800 flex flex-col gap-1.5">
              <span className="font-bold text-indigo-300 text-xs flex items-center gap-1.5">
                <Cpu className="w-4 h-4" /> Bottom-Up (Tabulation)
              </span>
              <p className="text-slate-400 text-[11px]">
                Builds from the smallest amount up: <code className="text-indigo-200 font-mono">dp[0]</code> to <code className="text-indigo-200 font-mono">dp[amount]</code>. Iterative, eliminates recursion call stack overhead, highly cache-friendly.
              </p>
            </div>

            <div className="p-3.5 rounded-xl bg-slate-950/60 border border-slate-800 flex flex-col gap-1.5">
              <span className="font-bold text-purple-300 text-xs flex items-center gap-1.5">
                <Sparkles className="w-4 h-4" /> Top-Down (Memoization)
              </span>
              <p className="text-slate-400 text-[11px]">
                Starts at target amount and branches recursively: <code className="text-purple-200 font-mono">dfs(rem - c)</code>. Caches answers in a hash map to prune identical subtrees. Only computes states reachable by the coins.
              </p>
            </div>
          </div>

          {/* Section 3: Complexity */}
          <div className="p-3.5 rounded-xl bg-slate-950/60 border border-slate-800 flex flex-col gap-2">
            <span className="font-bold text-slate-200 text-xs">Complexity Analysis</span>
            <div className="grid grid-cols-2 gap-2 text-center font-mono text-[11px]">
              <div className="p-2 rounded-lg bg-slate-900 border border-slate-800">
                <span className="text-slate-400 block text-[10px]">Time Complexity</span>
                <span className="text-emerald-400 font-bold">O(amount × coins)</span>
              </div>
              <div className="p-2 rounded-lg bg-slate-900 border border-slate-800">
                <span className="text-slate-400 block text-[10px]">Space Complexity</span>
                <span className="text-cyan-400 font-bold">O(amount)</span>
              </div>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="pt-2 flex justify-end">
          <button
            onClick={onClose}
            className="px-4 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white font-semibold text-xs transition-colors shadow-lg shadow-indigo-600/30"
          >
            Got it, Let's Visualize
          </button>
        </div>
      </div>
    </div>
  );
};
