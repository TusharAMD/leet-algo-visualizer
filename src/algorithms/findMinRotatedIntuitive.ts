export interface FindMinRotatedStep {
  stepIndex: number;
  totalSteps: number;
  nums: number[];
  left: number;
  right: number;
  mid: number;
  midVal: number | null;
  rightVal: number | null;
  foundMin: number | null;
  action: 'INIT' | 'COMPARE' | 'MOVE_LEFT' | 'MOVE_RIGHT' | 'COMPLETE';
  headline: string;
  subtext: string;
  codeLine: number;
  variableBadges: { name: string; value: string }[];
  isComplete: boolean;
}

export const FIND_MIN_ROTATED_CODE_LINES = [
  'def findMin(nums):',
  '    l, r = 0, len(nums) - 1',
  '    while l < r:',
  '        m = (l + r) // 2',
  '        if nums[m] > nums[r]:',
  '            l = m + 1       # Inflection pivot is strictly in right half',
  '        else:',
  '            r = m           # Minimum is at m or to its left',
  '    return nums[l]          # l points to the minimum element'
];

export function generateFindMinRotatedSteps(nums: number[]): FindMinRotatedStep[] {
  const steps: FindMinRotatedStep[] = [];
  let l = 0;
  let r = nums.length - 1;

  // Init step
  steps.push({
    stepIndex: 0,
    totalSteps: 0,
    nums,
    left: l,
    right: r,
    mid: -1,
    midVal: null,
    rightVal: nums[r],
    foundMin: null,
    action: 'INIT',
    headline: 'Initialize Binary Search for Inflection Pivot',
    subtext: `Target: Find rotation inflection point in O(log N) time without linear scanning.`,
    codeLine: 2,
    variableBadges: [
      { name: 'l', value: `${l}` },
      { name: 'r', value: `${r}` },
      { name: 'nums[r]', value: `${nums[r]}` }
    ],
    isComplete: false
  });

  while (l < r) {
    const m = Math.floor((l + r) / 2);
    const midVal = nums[m];
    const rightVal = nums[r];

    if (midVal > rightVal) {
      steps.push({
        stepIndex: 0,
        totalSteps: 0,
        nums,
        left: l,
        right: r,
        mid: m,
        midVal,
        rightVal,
        foundMin: null,
        action: 'MOVE_RIGHT',
        headline: `nums[m=${m}]=${midVal} > nums[r=${r}]=${rightVal}: Inflection Drop in Right Half`,
        subtext: `Mid element is greater than rightmost element, so the minimum must be strictly to the right. l = ${m + 1}.`,
        codeLine: 5,
        variableBadges: [
          { name: 'mid', value: `nums[${m}]=${midVal}` },
          { name: 'right', value: `nums[${r}]=${rightVal}` },
          { name: 'next l', value: `${m + 1}` }
        ],
        isComplete: false
      });
      l = m + 1;
    } else {
      steps.push({
        stepIndex: 0,
        totalSteps: 0,
        nums,
        left: l,
        right: r,
        mid: m,
        midVal,
        rightVal,
        foundMin: null,
        action: 'MOVE_LEFT',
        headline: `nums[m=${m}]=${midVal} ≤ nums[r=${r}]=${rightVal}: Minimum is at m or Left`,
        subtext: `Right half [m..r] is strictly sorted. The smallest element is either at m or to the left. r = ${m}.`,
        codeLine: 7,
        variableBadges: [
          { name: 'mid', value: `nums[${m}]=${midVal}` },
          { name: 'right', value: `nums[${r}]=${rightVal}` },
          { name: 'next r', value: `${m}` }
        ],
        isComplete: false
      });
      r = m;
    }
  }

  // Complete step
  const minVal = nums[l];
  steps.push({
    stepIndex: 0,
    totalSteps: 0,
    nums,
    left: l,
    right: r,
    mid: l,
    midVal: minVal,
    rightVal: nums[r],
    foundMin: minVal,
    action: 'COMPLETE',
    headline: `Minimum Element Discovered: nums[${l}] = ${minVal}`,
    subtext: `Pointers converged onto inflection point index ${l} in strict O(log N) comparisons!`,
    codeLine: 9,
    variableBadges: [
      { name: 'min', value: `${minVal}` },
      { name: 'index', value: `${l}` }
    ],
    isComplete: true
  });

  return steps.map((st, idx) => ({ ...st, stepIndex: idx, totalSteps: steps.length }));
}
