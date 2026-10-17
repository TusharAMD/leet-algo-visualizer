export interface RotatedSearchStep {
  stepIndex: number;
  totalSteps: number;
  left: number;
  right: number;
  mid: number;
  midVal: number;
  target: number;
  sortedHalf: 'left' | 'right';
  targetInSortedHalf: boolean;
  discardedIndices: number[];
  headline: string;
  subtext: string;
  codeLine: number;
  variableBadges: { name: string; value: string }[];
  isComplete: boolean;
  resultIndex: number;
}

export const ROTATED_SEARCH_CODE_LINES = [
  'def search(nums, target):',
  '    left, right = 0, len(nums) - 1',
  '    while left <= right:',
  '        mid = (left + right) // 2',
  '        if nums[mid] == target:',
  '            return mid  # Found target!',
  '        if nums[left] <= nums[mid]:  # Left half is sorted',
  '            if nums[left] <= target < nums[mid]:',
  '                right = mid - 1',
  '            else:',
  '                left = mid + 1',
  '        else:  # Right half is sorted',
  '            if nums[mid] < target <= nums[right]:',
  '                left = mid + 1',
  '            else:',
  '                right = mid - 1',
  '    return -1'
];

export function generateRotatedSearchSteps(nums: number[], target: number): RotatedSearchStep[] {
  const steps: RotatedSearchStep[] = [];
  const n = nums.length;

  if (n === 0) {
    return [
      {
        stepIndex: 0,
        totalSteps: 1,
        left: 0,
        right: -1,
        mid: 0,
        midVal: 0,
        target,
        sortedHalf: 'left',
        targetInSortedHalf: false,
        discardedIndices: [],
        headline: 'Empty Array: Target Not Found (-1)',
        subtext: 'Array is empty.',
        codeLine: 16,
        variableBadges: [{ name: 'result', value: '-1' }],
        isComplete: true,
        resultIndex: -1
      }
    ];
  }

  let left = 0;
  let right = n - 1;

  function getDiscarded(l: number, r: number): number[] {
    const list: number[] = [];
    for (let i = 0; i < n; i++) {
      if (i < l || i > r) list.push(i);
    }
    return list;
  }

  // Step 0: Initialize
  const mid0 = Math.floor((left + right) / 2);
  steps.push({
    stepIndex: 0,
    totalSteps: 0,
    left,
    right,
    mid: mid0,
    midVal: nums[mid0],
    target,
    sortedHalf: nums[left] <= nums[mid0] ? 'left' : 'right',
    targetInSortedHalf: false,
    discardedIndices: [],
    headline: `Initialize Rotated Binary Search: Target = ${target}`,
    subtext: 'In any rotated sorted array, splitting at midpoint always guarantees at least one half is strictly sorted!',
    codeLine: 1,
    variableBadges: [
      { name: 'left', value: `0 (val: ${nums[0]})` },
      { name: 'right', value: `${right} (val: ${nums[right]})` },
      { name: 'target', value: `${target}` }
    ],
    isComplete: false,
    resultIndex: -1
  });

  let found = false;

  while (left <= right) {
    const mid = Math.floor((left + right) / 2);
    const midVal = nums[mid];

    if (midVal === target) {
      found = true;
      steps.push({
        stepIndex: steps.length,
        totalSteps: 0,
        left,
        right,
        mid,
        midVal,
        target,
        sortedHalf: nums[left] <= midVal ? 'left' : 'right',
        targetInSortedHalf: true,
        discardedIndices: getDiscarded(left, right),
        headline: `🎯 TARGET FOUND! nums[${mid}] == ${target}`,
        subtext: `Target ${target} located at index ${mid} in O(log n) time!`,
        codeLine: 5,
        variableBadges: [
          { name: 'mid', value: `${mid}` },
          { name: `nums[${mid}]`, value: `${midVal}` },
          { name: 'return', value: `${mid}` }
        ],
        isComplete: true,
        resultIndex: mid
      });
      break;
    }

    if (nums[left] <= midVal) {
      // Left half is sorted
      const inLeft = nums[left] <= target && target < midVal;
      steps.push({
        stepIndex: steps.length,
        totalSteps: 0,
        left,
        right,
        mid,
        midVal,
        target,
        sortedHalf: 'left',
        targetInSortedHalf: inLeft,
        discardedIndices: getDiscarded(left, right),
        headline: `Left Half [${left}..${mid}] is STRICTLY SORTED (${nums[left]} ➔ ${midVal})`,
        subtext: inLeft
          ? `Target ${target} falls inside [${nums[left]} .. ${midVal}]. Setting right = mid - 1 (${mid - 1}).`
          : `Target ${target} is outside [${nums[left]} .. ${midVal}]. Setting left = mid + 1 (${mid + 1}).`,
        codeLine: inLeft ? 8 : 10,
        variableBadges: [
          { name: 'sorted half', value: `Left [${nums[left]}..${midVal}]` },
          { name: 'target in range', value: inLeft ? 'Yes ➔ search left' : 'No ➔ search right' }
        ],
        isComplete: false,
        resultIndex: -1
      });

      if (inLeft) {
        right = mid - 1;
      } else {
        left = mid + 1;
      }
    } else {
      // Right half is sorted
      const inRight = midVal < target && target <= nums[right];
      steps.push({
        stepIndex: steps.length,
        totalSteps: 0,
        left,
        right,
        mid,
        midVal,
        target,
        sortedHalf: 'right',
        targetInSortedHalf: inRight,
        discardedIndices: getDiscarded(left, right),
        headline: `Right Half [${mid}..${right}] is STRICTLY SORTED (${midVal} ➔ ${nums[right]})`,
        subtext: inRight
          ? `Target ${target} falls inside [${midVal} .. ${nums[right]}]. Setting left = mid + 1 (${mid + 1}).`
          : `Target ${target} is outside [${midVal} .. ${nums[right]}]. Setting right = mid - 1 (${mid - 1}).`,
        codeLine: inRight ? 13 : 15,
        variableBadges: [
          { name: 'sorted half', value: `Right [${midVal}..${nums[right]}]` },
          { name: 'target in range', value: inRight ? 'Yes ➔ search right' : 'No ➔ search left' }
        ],
        isComplete: false,
        resultIndex: -1
      });

      if (inRight) {
        left = mid + 1;
      } else {
        right = mid - 1;
      }
    }
  }

  if (!found) {
    steps.push({
      stepIndex: steps.length,
      totalSteps: 0,
      left,
      right,
      mid: 0,
      midVal: 0,
      target,
      sortedHalf: 'left',
      targetInSortedHalf: false,
      discardedIndices: Array.from({ length: n }, (_, i) => i),
      headline: `❌ Search Range Exhausted: Target ${target} does not exist in array`,
      subtext: 'Returning -1 in O(log n) runtime.',
      codeLine: 16,
      variableBadges: [{ name: 'return', value: '-1' }],
      isComplete: true,
      resultIndex: -1
    });
  }

  const total = steps.length;
  steps.forEach((s) => (s.totalSteps = total));
  return steps;
}
