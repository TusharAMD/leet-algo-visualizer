export interface TwoSumHashStep {
  stepIndex: number;
  totalSteps: number;
  nums: number[];
  target: number;
  currIndex: number;
  currNum: number | null;
  diff: number | null;
  prevMap: { key: number; index: number }[];
  matchedIndices: [number, number] | null;
  headline: string;
  subtext: string;
  codeLine: number;
  variableBadges: { name: string; value: string }[];
  isComplete: boolean;
}

export const TWO_SUM_HASH_CODE_LINES = [
  'def twoSum(nums, target):',
  '    prevMap = {}  # val -> index',
  '    for i, n in enumerate(nums):',
  '        diff = target - n',
  '        if diff in prevMap:',
  '            return [prevMap[diff], i]  # Match found!',
  '        prevMap[n] = i',
  '    return []'
];

export function generateTwoSumHashSteps(nums: number[], target: number): TwoSumHashStep[] {
  const steps: TwoSumHashStep[] = [];
  const map = new Map<number, number>();

  // Step 0: Initialize
  steps.push({
    stepIndex: 0,
    totalSteps: 0,
    nums,
    target,
    currIndex: -1,
    currNum: null,
    diff: null,
    prevMap: [],
    matchedIndices: null,
    headline: `Start Two Sum: Target = ${target}`,
    subtext: `We will look back into our hash map at each step to see if (target - num) was already visited.`,
    codeLine: 1,
    variableBadges: [
      { name: 'target', value: `${target}` },
      { name: 'prevMap', value: '{}' }
    ],
    isComplete: false
  });

  let matchFound = false;

  for (let i = 0; i < nums.length; i++) {
    const n = nums[i];
    const diff = target - n;

    if (map.has(diff)) {
      const prevIdx = map.get(diff)!;

      steps.push({
        stepIndex: steps.length,
        totalSteps: 0,
        nums,
        target,
        currIndex: i,
        currNum: n,
        diff,
        prevMap: Array.from(map.entries()).map(([key, index]) => ({ key, index })),
        matchedIndices: [prevIdx, i],
        headline: `🎯 MATCH FOUND: nums[${i}] (${n}) + nums[${prevIdx}] (${diff}) = ${target}!`,
        subtext: `Found complement ${diff} in hash map at index ${prevIdx}. Return [${prevIdx}, ${i}]!`,
        codeLine: 5,
        variableBadges: [
          { name: 'n', value: `${n}` },
          { name: 'diff', value: `${diff}` },
          { name: 'match', value: `[${prevIdx}, ${i}]` },
          { name: 'return', value: `[${prevIdx}, ${i}]` }
        ],
        isComplete: true
      });

      matchFound = true;
      break;
    }

    // Not found, record in map
    const mapBefore = Array.from(map.entries()).map(([key, index]) => ({ key, index }));
    map.set(n, i);

    steps.push({
      stepIndex: steps.length,
      totalSteps: 0,
      nums,
      target,
      currIndex: i,
      currNum: n,
      diff,
      prevMap: mapBefore,
      matchedIndices: null,
      headline: `Inspect nums[${i}] = ${n}: Need complement ${target} - ${n} = ${diff} (Not yet in map)`,
      subtext: `Complement ${diff} not found. Saving prevMap[${n}] = ${i} for future numbers.`,
      codeLine: 6,
      variableBadges: [
        { name: 'i', value: `${i}` },
        { name: 'n', value: `${n}` },
        { name: 'needed_diff', value: `${diff}` },
        { name: `prevMap[${n}]`, value: `${i}` }
      ],
      isComplete: false
    });
  }

  if (!matchFound) {
    steps.push({
      stepIndex: steps.length,
      totalSteps: 0,
      nums,
      target,
      currIndex: nums.length - 1,
      currNum: null,
      diff: null,
      prevMap: Array.from(map.entries()).map(([key, index]) => ({ key, index })),
      matchedIndices: null,
      headline: `❌ Array Exhausted: No Two Numbers Sum to ${target}`,
      subtext: 'Return [] in O(n) runtime.',
      codeLine: 7,
      variableBadges: [{ name: 'return', value: '[]' }],
      isComplete: true
    });
  }

  const total = steps.length;
  steps.forEach((s) => (s.totalSteps = total));
  return steps;
}
