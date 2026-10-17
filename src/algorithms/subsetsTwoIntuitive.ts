export interface SubsetsTwoStep {
  stepIndex: number;
  totalSteps: number;
  nums: number[];
  currentIndex: number;
  currentSubset: number[];
  action: 'INCLUDE' | 'SKIP_DUPLICATES' | 'COLLECT' | 'BACKTRACK';
  skippedValue: number | null;
  allSubsets: number[][];
  headline: string;
  subtext: string;
  codeLine: number;
  variableBadges: { name: string; value: string }[];
  isComplete: boolean;
}

export const SUBSETS_TWO_CODE_LINES = [
  'def subsetsWithDup(nums):',
  '    res = []',
  '    nums.sort()                              # Group duplicates together',
  '    def backtrack(i, subset):',
  '        if i == len(nums):                   # Leaf reached: collect subset',
  '            res.append(subset.copy()); return',
  '        # Branch 1: Include nums[i]',
  '        subset.append(nums[i])',
  '        backtrack(i + 1, subset)',
  '        subset.pop()',
  '        # Branch 2: Exclude nums[i] and all its duplicates',
  '        while i + 1 < len(nums) and nums[i] == nums[i + 1]:',
  '            i += 1                           # Skip identical adjacent numbers',
  '        backtrack(i + 1, subset)',
  '    backtrack(0, [])',
  '    return res'
];

export function generateSubsetsTwoSteps(nums: number[]): SubsetsTwoStep[] {
  const steps: SubsetsTwoStep[] = [];
  const sorted = [...nums].sort((a, b) => a - b).slice(0, 5);

  const res: number[][] = [];
  const subset: number[] = [];

  // Step 0: Initial
  steps.push({
    stepIndex: 0,
    totalSteps: 0,
    nums: sorted,
    currentIndex: 0,
    currentSubset: [],
    action: 'BACKTRACK',
    skippedValue: null,
    allSubsets: [],
    headline: `Initialize Subsets II with Sorted Array: [${sorted.join(', ')}]`,
    subtext: 'Sorting places duplicate values together so we can skip repeated inclusion trees.',
    codeLine: 3,
    variableBadges: [
      { name: 'sortedNums', value: `[${sorted.join(', ')}]` },
      { name: 'length', value: `${sorted.length}` }
    ],
    isComplete: false
  });

  const maxSteps = 45;

  function backtrack(i: number) {
    if (steps.length >= maxSteps) return;

    if (i === sorted.length) {
      res.push([...subset]);
      steps.push({
        stepIndex: 0,
        totalSteps: 0,
        nums: sorted,
        currentIndex: i,
        currentSubset: [...subset],
        action: 'COLLECT',
        skippedValue: null,
        allSubsets: res.map((r) => [...r]),
        headline: `Collect Subset: [${subset.join(', ')}]`,
        subtext: `Leaf reached. Appended to unique subsets (total: ${res.length}).`,
        codeLine: 6,
        variableBadges: [
          { name: 'subset', value: `[${subset.join(', ')}]` },
          { name: 'totalCollected', value: `${res.length}` }
        ],
        isComplete: false
      });
      return;
    }

    // Branch 1: Include sorted[i]
    const val = sorted[i];
    subset.push(val);

    steps.push({
      stepIndex: 0,
      totalSteps: 0,
      nums: sorted,
      currentIndex: i,
      currentSubset: [...subset],
      action: 'INCLUDE',
      skippedValue: null,
      allSubsets: res.map((r) => [...r]),
      headline: `Include nums[${i}] = ${val}: subset = [${subset.join(', ')}]`,
      subtext: `Exploring left branch that contains ${val}.`,
      codeLine: 8,
      variableBadges: [
        { name: 'included', value: `${val}` },
        { name: 'subsetLen', value: `${subset.length}` }
      ],
      isComplete: false
    });

    backtrack(i + 1);
    if (steps.length >= maxSteps) return;

    subset.pop();

    // Branch 2: Exclude sorted[i] and all its duplicates
    let nextI = i;
    let skipped = false;
    while (nextI + 1 < sorted.length && sorted[nextI] === sorted[nextI + 1]) {
      nextI++;
      skipped = true;
    }

    if (skipped) {
      steps.push({
        stepIndex: 0,
        totalSteps: 0,
        nums: sorted,
        currentIndex: nextI,
        currentSubset: [...subset],
        action: 'SKIP_DUPLICATES',
        skippedValue: val,
        allSubsets: res.map((r) => [...r]),
        headline: `Skip Duplicate Copies of '${val}' -> Advance to index ${nextI + 1}`,
        subtext: `Skipping identical elements guarantees no duplicate subsets like [${val}] will be regenerated.`,
        codeLine: 13,
        variableBadges: [
          { name: 'skippedVal', value: `${val}` },
          { name: 'advancedIndex', value: `${nextI + 1}` }
        ],
        isComplete: false
      });
    }

    backtrack(nextI + 1);
  }

  backtrack(0);

  // Done
  steps.push({
    stepIndex: 0,
    totalSteps: 0,
    nums: sorted,
    currentIndex: sorted.length,
    currentSubset: [],
    action: 'COLLECT',
    skippedValue: null,
    allSubsets: res.map((r) => [...r]),
    headline: `Subsets II Finished! Generated ${res.length} Unique Subsets`,
    subtext: `Zero duplicate subsets generated. Power set cardinality strictly bounded by duplicate counts.`,
    codeLine: 16,
    variableBadges: [
      { name: 'totalSubsets', value: `${res.length}` },
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
