export interface BinarySearchStep {
  stepIndex: number;
  totalSteps: number;
  left: number;
  right: number;
  mid: number;
  midVal: number;
  target: number;
  discardedIndices: number[]; // indices outside [left..right]
  comparison: 'match' | 'target_smaller' | 'target_larger';
  headline: string;
  subtext: string;
  codeLine: number;
  variableBadges: { name: string; value: string }[];
  isComplete: boolean;
  resultIndex: number;
}

export const BINARY_SEARCH_CODE_LINES = [
  'def search(nums, target):',
  '    left, right = 0, len(nums) - 1',
  '    while left <= right:',
  '        mid = (left + right) // 2',
  '        if nums[mid] == target:',
  '            return mid  # Found target!',
  '        elif nums[mid] < target:',
  '            left = mid + 1   # Discard left half',
  '        else:',
  '            right = mid - 1  # Discard right half',
  '    return -1'
];

export function generateBinarySearchSteps(nums: number[], target: number): BinarySearchStep[] {
  const steps: BinarySearchStep[] = [];
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
        discardedIndices: [],
        comparison: 'target_smaller',
        headline: 'Empty Array: Target Not Found (-1)',
        subtext: 'Array has length 0.',
        codeLine: 10,
        variableBadges: [{ name: 'result', value: '-1' }],
        isComplete: true,
        resultIndex: -1
      }
    ];
  }

  let left = 0;
  let right = n - 1;
  const discarded: number[] = [];

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
    discardedIndices: [],
    comparison: nums[mid0] === target ? 'match' : nums[mid0] < target ? 'target_larger' : 'target_smaller',
    headline: `Initialize Pointers: Left=0, Right=${right}, Target=${target}`,
    subtext: `Search range spans entire array (${n} elements). We will calculate midpoint to eliminate half the array.`,
    codeLine: 1,
    variableBadges: [
      { name: 'left', value: '0' },
      { name: 'right', value: `${right}` },
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
        discardedIndices: getDiscarded(left, right),
        comparison: 'match',
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
    } else if (midVal < target) {
      steps.push({
        stepIndex: steps.length,
        totalSteps: 0,
        left,
        right,
        mid,
        midVal,
        target,
        discardedIndices: getDiscarded(left, right),
        comparison: 'target_larger',
        headline: `nums[${mid}] (${midVal}) < Target (${target}) ➔ Discard Left Half!`,
        subtext: `Because array is sorted, every element at or before index ${mid} is ≤ ${midVal} < ${target}. Setting left = mid + 1 (${mid + 1}).`,
        codeLine: 7,
        variableBadges: [
          { name: 'mid', value: `${mid} (val: ${midVal})` },
          { name: 'action', value: `left = ${mid + 1}` },
          { name: 'halved', value: `Discarded indices [${left}..${mid}]` }
        ],
        isComplete: false,
        resultIndex: -1
      });
      left = mid + 1;
    } else {
      steps.push({
        stepIndex: steps.length,
        totalSteps: 0,
        left,
        right,
        mid,
        midVal,
        target,
        discardedIndices: getDiscarded(left, right),
        comparison: 'target_smaller',
        headline: `nums[${mid}] (${midVal}) > Target (${target}) ➔ Discard Right Half!`,
        subtext: `Because array is sorted, every element at or after index ${mid} is ≥ ${midVal} > ${target}. Setting right = mid - 1 (${mid - 1}).`,
        codeLine: 9,
        variableBadges: [
          { name: 'mid', value: `${mid} (val: ${midVal})` },
          { name: 'action', value: `right = ${mid - 1}` },
          { name: 'halved', value: `Discarded indices [${mid}..${right}]` }
        ],
        isComplete: false,
        resultIndex: -1
      });
      right = mid - 1;
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
      discardedIndices: Array.from({ length: n }, (_, i) => i),
      comparison: 'target_smaller',
      headline: `❌ Search Range Exhausted: left (${left}) > right (${right})`,
      subtext: `Target ${target} does not exist in array. Returning -1.`,
      codeLine: 10,
      variableBadges: [
        { name: 'search space', value: '0 elements' },
        { name: 'return', value: '-1' }
      ],
      isComplete: true,
      resultIndex: -1
    });
  }

  const total = steps.length;
  steps.forEach((s) => (s.totalSteps = total));
  return steps;
}
