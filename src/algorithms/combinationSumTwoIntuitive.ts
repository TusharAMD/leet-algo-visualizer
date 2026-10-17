export interface CombinationSumTwoStep {
  stepIndex: number;
  totalSteps: number;
  candidates: number[];
  target: number;
  currentIndex: number;
  currentCombination: number[];
  currentSum: number;
  action: 'CHOOSE' | 'MATCH' | 'OVERFLOW' | 'SKIP_DUPLICATE' | 'BACKTRACK';
  skippedVal: number | null;
  allCombinations: number[][];
  headline: string;
  subtext: string;
  codeLine: number;
  variableBadges: { name: string; value: string }[];
  isComplete: boolean;
}

export const COMBINATION_SUM_TWO_CODE_LINES = [
  'def combinationSum2(candidates, target):',
  '    candidates.sort()                       # Sort to group duplicates',
  '    res = []',
  '    def backtrack(cur, pos, remaining):',
  '        if remaining == 0:                  # Target reached exactly!',
  '            res.append(cur.copy()); return',
  '        if remaining < 0: return            # Overflows target -> prune',
  '        prev = -1',
  '        for i in range(pos, len(candidates)):',
  '            if candidates[i] == prev:       # Skip duplicates at same depth',
  '                continue',
  '            cur.append(candidates[i])',
  '            backtrack(cur, i + 1, remaining - candidates[i]) # Advance pos',
  '            cur.pop()                       # Backtrack',
  '            prev = candidates[i]',
  '    backtrack([], 0, target)',
  '    return res'
];

export function generateCombinationSumTwoSteps(
  candidates: number[],
  target: number
): CombinationSumTwoStep[] {
  const steps: CombinationSumTwoStep[] = [];
  const sorted = [...candidates].sort((a, b) => a - b).slice(0, 7);
  const safeTarget = Math.max(1, Math.min(target, 35));

  const res: number[][] = [];
  const cur: number[] = [];

  // Step 0: Initial
  steps.push({
    stepIndex: 0,
    totalSteps: 0,
    candidates: sorted,
    target: safeTarget,
    currentIndex: 0,
    currentCombination: [],
    currentSum: 0,
    action: 'BACKTRACK',
    skippedVal: null,
    allCombinations: [],
    headline: `Initialize Combination Sum II (Target = ${safeTarget})`,
    subtext: `Sorted: [${sorted.join(', ')}]. Each candidate element can only be used ONCE.`,
    codeLine: 2,
    variableBadges: [
      { name: 'target', value: `${safeTarget}` },
      { name: 'len(candidates)', value: `${sorted.length}` }
    ],
    isComplete: false
  });

  const maxSteps = 45;

  function backtrack(pos: number, remaining: number) {
    if (steps.length >= maxSteps) return;

    if (remaining === 0) {
      res.push([...cur]);
      const currentSum = safeTarget;
      steps.push({
        stepIndex: 0,
        totalSteps: 0,
        candidates: sorted,
        target: safeTarget,
        currentIndex: pos,
        currentCombination: [...cur],
        currentSum,
        action: 'MATCH',
        skippedVal: null,
        allCombinations: res.map((r) => [...r]),
        headline: `Match Found! Sum = ${currentSum} == ${safeTarget}: [${cur.join(' + ')}]`,
        subtext: `Valid unique combination added to results (total matches: ${res.length}).`,
        codeLine: 5,
        variableBadges: [
          { name: 'match', value: `[${cur.join(', ')}]` },
          { name: 'remaining', value: '0' }
        ],
        isComplete: false
      });
      return;
    }

    if (remaining < 0) {
      steps.push({
        stepIndex: 0,
        totalSteps: 0,
        candidates: sorted,
        target: safeTarget,
        currentIndex: pos,
        currentCombination: [...cur],
        currentSum: safeTarget - remaining,
        action: 'OVERFLOW',
        skippedVal: null,
        allCombinations: res.map((r) => [...r]),
        headline: `Overflow: Sum (${safeTarget - remaining}) > Target ${safeTarget}`,
        subtext: `Branch exceeds target. Pruning recursion.`,
        codeLine: 7,
        variableBadges: [
          { name: 'currentSum', value: `${safeTarget - remaining}` },
          { name: 'target', value: `${safeTarget}` }
        ],
        isComplete: false
      });
      return;
    }

    let prev = -1;
    for (let i = pos; i < sorted.length; i++) {
      const val = sorted[i];

      if (val === prev) {
        steps.push({
          stepIndex: 0,
          totalSteps: 0,
          candidates: sorted,
          target: safeTarget,
          currentIndex: i,
          currentCombination: [...cur],
          currentSum: safeTarget - remaining,
          action: 'SKIP_DUPLICATE',
          skippedVal: val,
          allCombinations: res.map((r) => [...r]),
          headline: `Skip Duplicate Value '${val}' at index ${i}`,
          subtext: `Since '${val}' was already tried as the first pick at this depth, skipping avoids duplicate combination sets.`,
          codeLine: 10,
          variableBadges: [
            { name: 'duplicate', value: `${val}` },
            { name: 'index', value: `${i}` }
          ],
          isComplete: false
        });
        continue;
      }

      cur.push(val);
      const newSum = safeTarget - remaining + val;

      steps.push({
        stepIndex: 0,
        totalSteps: 0,
        candidates: sorted,
        target: safeTarget,
        currentIndex: i,
        currentCombination: [...cur],
        currentSum: newSum,
        action: 'CHOOSE',
        skippedVal: null,
        allCombinations: res.map((r) => [...r]),
        headline: `Choose candidates[${i}] = ${val} -> Current Sum = ${newSum}`,
        subtext: `cur = [${cur.join(' + ')}]. Advancing to pos = ${i + 1} (each element used at most once).`,
        codeLine: 12,
        variableBadges: [
          { name: 'picked', value: `${val}` },
          { name: 'pos', value: `${i + 1}` },
          { name: 'remaining', value: `${remaining - val}` }
        ],
        isComplete: false
      });

      backtrack(i + 1, remaining - val);
      if (steps.length >= maxSteps) return;

      cur.pop();
      prev = val;
    }
  }

  backtrack(0, safeTarget);

  // Done
  steps.push({
    stepIndex: 0,
    totalSteps: 0,
    candidates: sorted,
    target: safeTarget,
    currentIndex: sorted.length,
    currentCombination: [],
    currentSum: 0,
    action: 'BACKTRACK',
    skippedVal: null,
    allCombinations: res.map((r) => [...r]),
    headline: `Combination Sum II Finished! Found ${res.length} Unique Combinations`,
    subtext: `Results: ${res.map((r) => `[${r.join(', ')}]`).join(', ')}. No duplicate combinations produced.`,
    codeLine: 17,
    variableBadges: [
      { name: 'totalMatches', value: `${res.length}` },
      { name: 'status', value: 'Complete' }
    ],
    isComplete: true
  });

  return steps.map((s, idx) => ({
    ...s,
    stepIndex: idx,
    totalSteps: steps.length
  }));
}
