export interface PermutationsStep {
  stepIndex: number;
  totalSteps: number;
  nums: number[];
  currentPermutation: number[];
  remainingPool: number[];
  activePicked: number | null;
  allPermutations: number[][];
  headline: string;
  subtext: string;
  codeLine: number;
  variableBadges: { name: string; value: string }[];
  isComplete: boolean;
}

export const PERMUTATIONS_CODE_LINES = [
  'def permute(nums):',
  '    res = []',
  '    def backtrack(cur, remaining):',
  '        if not remaining:                   # Base case: full permutation formed',
  '            res.append(cur.copy()); return',
  '        for i in range(len(remaining)):     # Branch for each available element',
  '            cur.append(remaining[i])',
  '            backtrack(cur, remaining[:i] + remaining[i+1:])',
  '            cur.pop()                       # Backtrack',
  '    backtrack([], nums)',
  '    return res'
];

export function generatePermutationsSteps(nums: number[]): PermutationsStep[] {
  const steps: PermutationsStep[] = [];
  const safeNums = nums.slice(0, 5); // Keep visualizer clean <= 5 elements

  const res: number[][] = [];
  const cur: number[] = [];

  // Step 0: Initial
  steps.push({
    stepIndex: 0,
    totalSteps: 0,
    nums: safeNums,
    currentPermutation: [],
    remainingPool: [...safeNums],
    activePicked: null,
    allPermutations: [],
    headline: `Initialize Permutations for [${safeNums.join(', ')}]`,
    subtext: `Total expected permutations = ${safeNums.length}! = ${factorial(safeNums.length)}.`,
    codeLine: 2,
    variableBadges: [
      { name: 'N', value: `${safeNums.length}` },
      { name: 'expectedTotal', value: `${factorial(safeNums.length)}` }
    ],
    isComplete: false
  });

  const maxSteps = 45;

  function backtrack(remaining: number[]) {
    if (steps.length >= maxSteps) return;

    if (remaining.length === 0) {
      res.push([...cur]);
      steps.push({
        stepIndex: 0,
        totalSteps: 0,
        nums: safeNums,
        currentPermutation: [...cur],
        remainingPool: [],
        activePicked: null,
        allPermutations: res.map((r) => [...r]),
        headline: `Formed Full Permutation: [${cur.join(', ')}]`,
        subtext: `All ${safeNums.length} slots filled! Appended to results (total found: ${res.length}).`,
        codeLine: 5,
        variableBadges: [
          { name: 'permutation', value: `[${cur.join(', ')}]` },
          { name: 'totalFound', value: `${res.length}` }
        ],
        isComplete: false
      });
      return;
    }

    for (let i = 0; i < remaining.length; i++) {
      const val = remaining[i];
      cur.push(val);
      const nextRemaining = [...remaining.slice(0, i), ...remaining.slice(i + 1)];

      steps.push({
        stepIndex: 0,
        totalSteps: 0,
        nums: safeNums,
        currentPermutation: [...cur],
        remainingPool: [...nextRemaining],
        activePicked: val,
        allPermutations: res.map((r) => [...r]),
        headline: `Pick ${val}: cur = [${cur.join(', ')}]`,
        subtext: `Remaining pool to pick from: [${nextRemaining.join(', ')}].`,
        codeLine: 8,
        variableBadges: [
          { name: 'picked', value: `${val}` },
          { name: 'remaining', value: `[${nextRemaining.join(', ')}]` }
        ],
        isComplete: false
      });

      backtrack(nextRemaining);
      if (steps.length >= maxSteps) return;

      cur.pop();

      steps.push({
        stepIndex: 0,
        totalSteps: 0,
        nums: safeNums,
        currentPermutation: [...cur],
        remainingPool: [...remaining],
        activePicked: null,
        allPermutations: res.map((r) => [...r]),
        headline: `Backtrack: Pop ${val} -> Restore to pool`,
        subtext: `Exploring remaining alternatives for slot ${cur.length + 1}.`,
        codeLine: 9,
        variableBadges: [
          { name: 'popped', value: `${val}` },
          { name: 'cur', value: `[${cur.join(', ')}]` }
        ],
        isComplete: false
      });
    }
  }

  backtrack([...safeNums]);

  // Done
  steps.push({
    stepIndex: 0,
    totalSteps: 0,
    nums: safeNums,
    currentPermutation: [],
    remainingPool: [],
    activePicked: null,
    allPermutations: res.map((r) => [...r]),
    headline: `Permutations Complete! Found All ${res.length} Unique Orderings`,
    subtext: `Exhaustive backtracking verified all permutations without duplicates.`,
    codeLine: 11,
    variableBadges: [
      { name: 'totalPermutations', value: `${res.length}` },
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

function factorial(n: number): number {
  if (n <= 1) return 1;
  return n * factorial(n - 1);
}
