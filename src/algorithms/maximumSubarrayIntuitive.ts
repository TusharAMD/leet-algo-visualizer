export interface MaximumSubarrayStep {
  index: number;
  currentNum: number;
  curSum: number;
  maxSum: number;
  resetOccurred: boolean;
  currentWindow: [number, number]; // [start, end]
  bestWindow: [number, number];
  explanation: string;
  codeLine: number;
  variableBadges?: { name: string; value: string }[];
}

export const MAXIMUM_SUBARRAY_CODE_LINES = [
  'def maxSubArray(nums: List[int]) -> int:',
  '    max_sum = nums[0]',
  '    cur_sum = 0',
  '    for n in nums:',
  '        if cur_sum < 0:',
  '            cur_sum = 0',
  '        cur_sum += n',
  '        max_sum = max(max_sum, cur_sum)',
  '    return max_sum',
];

export function generateMaximumSubarraySteps(nums: number[]): MaximumSubarrayStep[] {
  const steps: MaximumSubarrayStep[] = [];
  const n = nums.length;

  if (n === 0) {
    steps.push({
      index: -1,
      currentNum: 0,
      curSum: 0,
      maxSum: 0,
      resetOccurred: false,
      currentWindow: [0, 0],
      bestWindow: [0, 0],
      explanation: 'Empty array has maximum subarray sum 0.',
      codeLine: 1,
      variableBadges: [{ name: 'result', value: '0' }],
    });
    return steps;
  }

  let maxSum = nums[0];
  let curSum = 0;
  let start = 0;
  let bestStart = 0;
  let bestEnd = 0;

  steps.push({
    index: 0,
    currentNum: nums[0],
    curSum: 0,
    maxSum,
    resetOccurred: false,
    currentWindow: [0, 0],
    bestWindow: [0, 0],
    explanation: `Initialize Kadane's Algorithm: max_sum = ${maxSum}, cur_sum = 0.`,
    codeLine: 2,
    variableBadges: [
      { name: 'max_sum', value: `${maxSum}` },
      { name: 'cur_sum', value: '0' },
    ],
  });

  for (let i = 0; i < n; i++) {
    const num = nums[i];
    let reset = false;

    if (curSum < 0) {
      curSum = 0;
      start = i;
      reset = true;

      steps.push({
        index: i,
        currentNum: num,
        curSum,
        maxSum,
        resetOccurred: true,
        currentWindow: [start, i],
        bestWindow: [bestStart, bestEnd],
        explanation: `cur_sum was negative! Greedy choice: drop negative prefix and reset cur_sum to 0 starting at index ${i}.`,
        codeLine: 5,
        variableBadges: [
          { name: 'cur_sum', value: '0' },
          { name: 'greedy_reset', value: 'True' },
        ],
      });
    }

    curSum += num;

    steps.push({
      index: i,
      currentNum: num,
      curSum,
      maxSum,
      resetOccurred: reset,
      currentWindow: [start, i],
      bestWindow: [bestStart, bestEnd],
      explanation: `Adding nums[${i}] (${num}) to window [${start}..${i}]: cur_sum becomes ${curSum}.`,
      codeLine: 6,
      variableBadges: [
        { name: 'n', value: `${num}` },
        { name: 'cur_sum', value: `${curSum}` },
      ],
    });

    if (curSum > maxSum) {
      maxSum = curSum;
      bestStart = start;
      bestEnd = i;

      steps.push({
        index: i,
        currentNum: num,
        curSum,
        maxSum,
        resetOccurred: false,
        currentWindow: [start, i],
        bestWindow: [bestStart, bestEnd],
        explanation: `New maximum found! max_sum updated to ${maxSum} with subarray [${nums.slice(bestStart, bestEnd + 1).join(', ')}].`,
        codeLine: 7,
        variableBadges: [
          { name: 'max_sum', value: `${maxSum}` },
          { name: 'best_window', value: `[${bestStart}..${bestEnd}]` },
        ],
      });
    }
  }

  // Final step
  steps.push({
    index: n - 1,
    currentNum: nums[n - 1],
    curSum,
    maxSum,
    resetOccurred: false,
    currentWindow: [bestStart, bestEnd],
    bestWindow: [bestStart, bestEnd],
    explanation: `Done! Maximum subarray sum is ${maxSum} (subarray [${nums.slice(bestStart, bestEnd + 1).join(', ')}]).`,
    codeLine: 8,
    variableBadges: [{ name: 'max_sum', value: `${maxSum}` }],
  });

  return steps;
}
