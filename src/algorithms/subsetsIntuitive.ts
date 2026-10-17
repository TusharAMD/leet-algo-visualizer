export interface SubsetsStep {
  stepIndex: number;
  totalSteps: number;
  nums: number[];
  currentIndex: number;
  currentSubset: number[];
  decisionType: 'start' | 'include' | 'backtrack' | 'leaf';
  collectedSubsets: number[][];
  headline: string;
  subtext: string;
  codeLine: number;
  variableBadges: { name: string; value: string }[];
  isComplete: boolean;
}

export const SUBSETS_CODE_LINES = [
  'def subsets(nums):',
  '    res = []',
  '    subset = []',
  '    def dfs(i):',
  '        if i >= len(nums):',
  '            res.append(list(subset))  # Found leaf subset',
  '            return',
  '        subset.append(nums[i])        # 1. Include nums[i]',
  '        dfs(i + 1)',
  '        subset.pop()                  # 2. Backtrack & Exclude nums[i]',
  '        dfs(i + 1)',
  '    dfs(0)',
  '    return res'
];

export function generateSubsetsSteps(nums: number[]): SubsetsStep[] {
  const steps: SubsetsStep[] = [];
  const res: number[][] = [];
  const subset: number[] = [];

  // Step 0: Initial
  steps.push({
    stepIndex: 0,
    totalSteps: 0,
    nums,
    currentIndex: 0,
    currentSubset: [],
    decisionType: 'start',
    collectedSubsets: [],
    headline: `Start Subsets Backtracking for [${nums.join(', ')}]`,
    subtext: `For each of the ${nums.length} elements, we branch into 2 decisions: Include or Exclude (2^n = ${Math.pow(2, nums.length)} total subsets).`,
    codeLine: 1,
    variableBadges: [
      { name: 'nums', value: `[${nums.join(', ')}]` },
      { name: 'subset', value: '[]' },
      { name: 'res.length', value: '0' }
    ],
    isComplete: false
  });

  function dfs(i: number) {
    if (i >= nums.length) {
      res.push([...subset]);
      steps.push({
        stepIndex: steps.length,
        totalSteps: 0,
        nums,
        currentIndex: i,
        currentSubset: [...subset],
        decisionType: 'leaf',
        collectedSubsets: JSON.parse(JSON.stringify(res)),
        headline: `Leaf Reached! Append subset [${subset.join(', ')}] to Result`,
        subtext: `All ${nums.length} include/exclude decisions made for this branch.`,
        codeLine: 5,
        variableBadges: [
          { name: 'i', value: `${i}` },
          { name: 'added', value: `[${subset.join(', ')}]` },
          { name: 'total_subsets', value: `${res.length}/${Math.pow(2, nums.length)}` }
        ],
        isComplete: false
      });
      return;
    }

    const val = nums[i];

    // 1. Include
    subset.push(val);
    steps.push({
      stepIndex: steps.length,
      totalSteps: 0,
      nums,
      currentIndex: i,
      currentSubset: [...subset],
      decisionType: 'include',
      collectedSubsets: JSON.parse(JSON.stringify(res)),
      headline: `Decision 1: INCLUDE nums[${i}] = ${val} ➔ subset = [${subset.join(', ')}]`,
      subtext: `Pushing ${val} onto subset stack and descending to index ${i + 1}.`,
      codeLine: 7,
      variableBadges: [
        { name: 'i', value: `${i}` },
        { name: 'choice', value: `+${val}` },
        { name: 'subset', value: `[${subset.join(', ')}]` }
      ],
      isComplete: false
    });

    dfs(i + 1);

    // 2. Backtrack & Exclude
    subset.pop();
    steps.push({
      stepIndex: steps.length,
      totalSteps: 0,
      nums,
      currentIndex: i,
      currentSubset: [...subset],
      decisionType: 'backtrack',
      collectedSubsets: JSON.parse(JSON.stringify(res)),
      headline: `Decision 2: BACKTRACK (EXCLUDE) nums[${i}] = ${val} ➔ subset = [${subset.join(', ')}]`,
      subtext: `Popped ${val} off subset stack to explore alternative branch without it.`,
      codeLine: 9,
      variableBadges: [
        { name: 'i', value: `${i}` },
        { name: 'choice', value: `-${val}` },
        { name: 'subset', value: `[${subset.join(', ')}]` }
      ],
      isComplete: false
    });

    dfs(i + 1);
  }

  dfs(0);

  // Complete step
  steps.push({
    stepIndex: steps.length,
    totalSteps: 0,
    nums,
    currentIndex: nums.length,
    currentSubset: [],
    decisionType: 'leaf',
    collectedSubsets: JSON.parse(JSON.stringify(res)),
    headline: `🎉 All ${res.length} Subsets Generated (Power Set of 2^${nums.length})!`,
    subtext: `Explored entire binary decision tree in O(n * 2^n) time.`,
    codeLine: 12,
    variableBadges: [
      { name: 'total_subsets', value: `${res.length}` },
      { name: 'time', value: 'O(n · 2ⁿ)' },
      { name: 'space', value: 'O(n)' }
    ],
    isComplete: true
  });

  const total = steps.length;
  steps.forEach((s) => (s.totalSteps = total));
  return steps;
}
