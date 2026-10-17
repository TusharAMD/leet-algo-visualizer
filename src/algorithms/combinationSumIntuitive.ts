export interface CombinationSumStep {
  stepIndex: number;
  totalSteps: number;
  candidates: number[];
  target: number;
  currentIndex: number;
  currentCombination: number[];
  currentSum: number;
  action: 'CHOOSE' | 'MATCH' | 'OVERFLOW' | 'SKIP' | 'BACKTRACK';
  allCombinations: number[][];
  headline: string;
  subtext: string;
  codeLine: number;
  variableBadges: { name: string; value: string }[];
  isComplete: boolean;
}

export const COMBINATION_SUM_CODE_LINES = [
  'def combinationSum(candidates, target):',
  '    res = []',
  '    def dfs(i, cur, total):',
  '        if total == target:                 # Base case: match found!',
  '            res.append(cur.copy()); return',
  '        if i >= len(candidates) or total > target: # Base case: prune',
  '            return',
  '        # Choice 1: Include candidates[i] (reusable)',
  '        cur.append(candidates[i])',
  '        dfs(i, cur, total + candidates[i])',
  '        cur.pop()                           # Backtrack',
  '        # Choice 2: Skip candidates[i] and advance to i + 1',
  '        dfs(i + 1, cur, total)',
  '    dfs(0, [], 0)',
  '    return res'
];

export function generateCombinationSumSteps(
  candidates: number[],
  target: number
): CombinationSumStep[] {
  const steps: CombinationSumStep[] = [];
  const safeTarget = Math.max(1, Math.min(target, 40));
  const sortedCandidates = [...candidates].sort((a, b) => a - b);

  const res: number[][] = [];
  const cur: number[] = [];

  // Step 0: Initial
  steps.push({
    stepIndex: 0,
    totalSteps: 0,
    candidates: sortedCandidates,
    target: safeTarget,
    currentIndex: 0,
    currentCombination: [],
    currentSum: 0,
    action: 'SKIP',
    allCombinations: [],
    headline: `Initialize Combination Sum (Target = ${safeTarget})`,
    subtext: `Candidates: [${sortedCandidates.join(', ')}]. We can pick each candidate repeatedly until sum >= target.`,
    codeLine: 2,
    variableBadges: [
      { name: 'target', value: `${safeTarget}` },
      { name: 'total', value: '0' }
    ],
    isComplete: false
  });

  const maxSteps = 45;

  function dfs(i: number, total: number) {
    if (steps.length >= maxSteps) return;

    if (total === safeTarget) {
      res.push([...cur]);
      steps.push({
        stepIndex: 0,
        totalSteps: 0,
        candidates: sortedCandidates,
        target: safeTarget,
        currentIndex: i,
        currentCombination: [...cur],
        currentSum: total,
        action: 'MATCH',
        allCombinations: res.map((r) => [...r]),
        headline: `Match Found! Sum = ${total} == ${safeTarget}: [${cur.join(' + ')}]`,
        subtext: `Valid combination added to results! Found so far: ${res.length}.`,
        codeLine: 5,
        variableBadges: [
          { name: 'cur', value: `[${cur.join(', ')}]` },
          { name: 'total', value: `${total}` },
          { name: 'found', value: `${res.length}` }
        ],
        isComplete: false
      });
      return;
    }

    if (i >= sortedCandidates.length || total > safeTarget) {
      if (total > safeTarget) {
        steps.push({
          stepIndex: 0,
          totalSteps: 0,
          candidates: sortedCandidates,
          target: safeTarget,
          currentIndex: i,
          currentCombination: [...cur],
          currentSum: total,
          action: 'OVERFLOW',
          allCombinations: res.map((r) => [...r]),
          headline: `Prune Branch: Sum ${total} > Target ${safeTarget}`,
          subtext: `Sum exceeds target. Pruning recursion branch.`,
          codeLine: 7,
          variableBadges: [
            { name: 'total', value: `${total}` },
            { name: 'target', value: `${safeTarget}` }
          ],
          isComplete: false
        });
      }
      return;
    }

    // Choice 1: Include candidates[i]
    const val = sortedCandidates[i];
    cur.push(val);

    steps.push({
      stepIndex: 0,
      totalSteps: 0,
      candidates: sortedCandidates,
      target: safeTarget,
      currentIndex: i,
      currentCombination: [...cur],
      currentSum: total + val,
      action: 'CHOOSE',
      allCombinations: res.map((r) => [...r]),
      headline: `Include candidates[${i}] = ${val} -> Total = ${total + val}`,
      subtext: `Current path: [${cur.join(' + ')}]. Exploring with repeated choice at index ${i}.`,
      codeLine: 9,
      variableBadges: [
        { name: 'picked', value: `${val}` },
        { name: 'total', value: `${total + val}` },
        { name: 'target', value: `${safeTarget}` }
      ],
      isComplete: false
    });

    dfs(i, total + val);
    if (steps.length >= maxSteps) return;

    cur.pop();

    // Choice 2: Skip candidates[i]
    steps.push({
      stepIndex: 0,
      totalSteps: 0,
      candidates: sortedCandidates,
      target: safeTarget,
      currentIndex: i + 1,
      currentCombination: [...cur],
      currentSum: total,
      action: 'BACKTRACK',
      allCombinations: res.map((r) => [...r]),
      headline: `Backtrack: Pop ${val} -> Skip index ${i} to test index ${i + 1}`,
      subtext: `Exploring alternative paths excluding candidate ${val}.`,
      codeLine: 13,
      variableBadges: [
        { name: 'skipped', value: `${val}` },
        { name: 'nextIndex', value: `${i + 1}` }
      ],
      isComplete: false
    });

    dfs(i + 1, total);
  }

  dfs(0, 0);

  // Done
  steps.push({
    stepIndex: 0,
    totalSteps: 0,
    candidates: sortedCandidates,
    target: safeTarget,
    currentIndex: sortedCandidates.length,
    currentCombination: [],
    currentSum: 0,
    action: 'SKIP',
    allCombinations: res.map((r) => [...r]),
    headline: `Combination Sum Complete! Found ${res.length} Unique Combinations`,
    subtext: `Unique sums matching target ${safeTarget}: ${res.map((r) => `[${r.join(', ')}]`).join(', ')}.`,
    codeLine: 15,
    variableBadges: [
      { name: 'totalCombinations', value: `${res.length}` },
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
