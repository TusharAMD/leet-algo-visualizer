export interface ThreeSumStep {
  stepIndex: number;
  totalSteps: number;
  sortedNums: number[];
  anchorIndex: number;
  leftIndex: number;
  rightIndex: number;
  currentSum: number | null;
  foundTriplets: [number, number, number][];
  action: 'SORT' | 'ANCHOR' | 'SKIP_ANCHOR' | 'CHECK' | 'FOUND' | 'MOVE_LEFT' | 'MOVE_RIGHT' | 'COMPLETE';
  headline: string;
  subtext: string;
  codeLine: number;
  variableBadges: { name: string; value: string }[];
  isComplete: boolean;
}

export const THREE_SUM_CODE_LINES = [
  'def threeSum(nums):',
  '    nums.sort()                          # 1. Sort array for two-pointer sweep',
  '    res = []',
  '    for i in range(len(nums) - 2):',
  '        if i > 0 and nums[i] == nums[i-1]:',
  '            continue                     # Skip duplicate anchor',
  '        l, r = i + 1, len(nums) - 1',
  '        while l < r:',
  '            three_sum = nums[i] + nums[l] + nums[r]',
  '            if three_sum < 0: l += 1    # Need larger sum',
  '            elif three_sum > 0: r -= 1  # Need smaller sum',
  '            else:',
  '                res.append([nums[i], nums[l], nums[r]])',
  '                l, r = l + 1, r - 1',
  '                while l < r and nums[l] == nums[l-1]: l += 1',
  '    return res'
];

export function generateThreeSumSteps(rawNums: number[]): ThreeSumStep[] {
  const steps: ThreeSumStep[] = [];
  const sorted = [...rawNums].sort((a, b) => a - b);
  const found: [number, number, number][] = [];

  // Step 0: Sort array
  steps.push({
    stepIndex: 0,
    totalSteps: 0,
    sortedNums: sorted,
    anchorIndex: -1,
    leftIndex: -1,
    rightIndex: -1,
    currentSum: null,
    foundTriplets: [],
    action: 'SORT',
    headline: 'Step 1: Sort Input Array nums.sort()',
    subtext: 'Sorting enables two-pointer inward squeeze and clean duplicate skipping in O(N²).',
    codeLine: 1,
    variableBadges: [
      { name: 'sorted', value: `[${sorted.join(', ')}]` }
    ],
    isComplete: false
  });

  if (sorted.length < 3) {
    steps.push({
      stepIndex: 0,
      totalSteps: 0,
      sortedNums: sorted,
      anchorIndex: -1,
      leftIndex: -1,
      rightIndex: -1,
      currentSum: null,
      foundTriplets: [],
      action: 'COMPLETE',
      headline: 'Array Too Short (< 3 elements)',
      subtext: 'Return empty result [].',
      codeLine: 15,
      variableBadges: [{ name: 'res', value: '[]' }],
      isComplete: true
    });
    return steps.map((s, idx) => ({ ...s, stepIndex: idx, totalSteps: steps.length }));
  }

  for (let i = 0; i < sorted.length - 2; i++) {
    // If anchor is positive in sorted array, three positive numbers can never sum to 0
    if (sorted[i] > 0) {
      break;
    }

    if (i > 0 && sorted[i] === sorted[i - 1]) {
      steps.push({
        stepIndex: 0,
        totalSteps: 0,
        sortedNums: sorted,
        anchorIndex: i,
        leftIndex: -1,
        rightIndex: -1,
        currentSum: null,
        foundTriplets: [...found],
        action: 'SKIP_ANCHOR',
        headline: `Skip Duplicate Anchor nums[${i}] = ${sorted[i]}`,
        subtext: `Anchor equals previous value nums[${i - 1}] = ${sorted[i - 1]}. Skipping avoids duplicate triplets.`,
        codeLine: 5,
        variableBadges: [
          { name: 'i', value: `${i}` },
          { name: `nums[i]`, value: `${sorted[i]}` }
        ],
        isComplete: false
      });
      continue;
    }

    let l = i + 1;
    let r = sorted.length - 1;

    steps.push({
      stepIndex: 0,
      totalSteps: 0,
      sortedNums: sorted,
      anchorIndex: i,
      leftIndex: l,
      rightIndex: r,
      currentSum: sorted[i] + sorted[l] + sorted[r],
      foundTriplets: [...found],
      action: 'ANCHOR',
      headline: `Anchor nums[${i}] = ${sorted[i]} with Pointers l=${l}, r=${r}`,
      subtext: `Searching for pair where nums[l] + nums[r] = ${-sorted[i]}.`,
      codeLine: 6,
      variableBadges: [
        { name: 'anchor', value: `${sorted[i]}` },
        { name: 'target pair sum', value: `${-sorted[i]}` },
        { name: 'l', value: `${l}` },
        { name: 'r', value: `${r}` }
      ],
      isComplete: false
    });

    while (l < r) {
      const sum = sorted[i] + sorted[l] + sorted[r];

      if (sum === 0) {
        found.push([sorted[i], sorted[l], sorted[r]]);
        steps.push({
          stepIndex: 0,
          totalSteps: 0,
          sortedNums: sorted,
          anchorIndex: i,
          leftIndex: l,
          rightIndex: r,
          currentSum: 0,
          foundTriplets: [...found],
          action: 'FOUND',
          headline: `Triplet Match Found! (${sorted[i]} + ${sorted[l]} + ${sorted[r]} = 0)`,
          subtext: `Recorded [${sorted[i]}, ${sorted[l]}, ${sorted[r]}]. Advancing l and retreating r.`,
          codeLine: 12,
          variableBadges: [
            { name: 'match', value: `[${sorted[i]}, ${sorted[l]}, ${sorted[r]}]` },
            { name: 'total triplets', value: `${found.length}` }
          ],
          isComplete: false
        });

        l++;
        r--;
        while (l < r && sorted[l] === sorted[l - 1]) {
          l++;
        }
      } else if (sum < 0) {
        steps.push({
          stepIndex: 0,
          totalSteps: 0,
          sortedNums: sorted,
          anchorIndex: i,
          leftIndex: l,
          rightIndex: r,
          currentSum: sum,
          action: 'MOVE_LEFT',
          headline: `Sum = ${sorted[i]} + ${sorted[l]} + ${sorted[r]} = ${sum} (< 0)`,
          subtext: `Sum is too small. Incrementing left pointer l (${l} → ${l + 1}) to increase value.`,
          codeLine: 9,
          variableBadges: [
            { name: 'sum', value: `${sum}` },
            { name: 'decision', value: 'l += 1' }
          ],
          foundTriplets: [...found],
          isComplete: false
        });
        l++;
      } else {
        steps.push({
          stepIndex: 0,
          totalSteps: 0,
          sortedNums: sorted,
          anchorIndex: i,
          leftIndex: l,
          rightIndex: r,
          currentSum: sum,
          action: 'MOVE_RIGHT',
          headline: `Sum = ${sorted[i]} + ${sorted[l]} + ${sorted[r]} = ${sum} (> 0)`,
          subtext: `Sum is too large. Decrementing right pointer r (${r} → ${r - 1}) to decrease value.`,
          codeLine: 10,
          variableBadges: [
            { name: 'sum', value: `${sum}` },
            { name: 'decision', value: 'r -= 1' }
          ],
          foundTriplets: [...found],
          isComplete: false
        });
        r--;
      }
    }
  }

  // Complete step
  steps.push({
    stepIndex: 0,
    totalSteps: 0,
    sortedNums: sorted,
    anchorIndex: -1,
    leftIndex: -1,
    rightIndex: -1,
    currentSum: null,
    foundTriplets: [...found],
    action: 'COMPLETE',
    headline: `Finished! Found ${found.length} Unique Triplet${found.length === 1 ? '' : 's'}`,
    subtext: `Two-pointer sweep completed with all zero-sum non-duplicate triplets recorded.`,
    codeLine: 15,
    variableBadges: [
      { name: 'triplets', value: `${found.length}` }
    ],
    isComplete: true
  });

  return steps.map((s, idx) => ({ ...s, stepIndex: idx, totalSteps: steps.length }));
}
