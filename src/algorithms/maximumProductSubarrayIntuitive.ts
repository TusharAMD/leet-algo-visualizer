export interface MaximumProductSubarrayStep {
  currentIndex: number;
  currentNum: number;
  prevMax: number;
  prevMin: number;
  curMax: number;
  curMin: number;
  globalMax: number;
  candidates: {
    num: number;
    numTimesPrevMax: number;
    numTimesPrevMin: number;
  };
  explanation: string;
  codeLine: number;
  history: Array<{ index: number; num: number; maxProd: number; minProd: number }>;
  variableBadges?: { name: string; value: string }[];
}

export const MAX_PRODUCT_SUBARRAY_CODE_LINES = [
  'def maxProduct(nums: List[int]) -> int:',
  '    res = nums[0]',
  '    cur_min, cur_max = 1, 1',
  '    for n in nums:',
  '        tmp = cur_max * n',
  '        cur_max = max(n, n * cur_max, n * cur_min)',
  '        cur_min = min(n, tmp, n * cur_min)',
  '        res = max(res, cur_max)',
  '    return res',
];

export function generateMaximumProductSubarraySteps(nums: number[]): MaximumProductSubarrayStep[] {
  const steps: MaximumProductSubarrayStep[] = [];
  const n = nums.length;

  if (n === 0) {
    steps.push({
      currentIndex: -1,
      currentNum: 0,
      prevMax: 0,
      prevMin: 0,
      curMax: 0,
      curMin: 0,
      globalMax: 0,
      candidates: { num: 0, numTimesPrevMax: 0, numTimesPrevMin: 0 },
      explanation: 'Empty array has no product.',
      codeLine: 1,
      history: [],
      variableBadges: [{ name: 'res', value: '0' }],
    });
    return steps;
  }

  let curMax = nums[0];
  let curMin = nums[0];
  let globalMax = nums[0];

  const history = [
    { index: 0, num: nums[0], maxProd: nums[0], minProd: nums[0] },
  ];

  steps.push({
    currentIndex: 0,
    currentNum: nums[0],
    prevMax: nums[0],
    prevMin: nums[0],
    curMax,
    curMin,
    globalMax,
    candidates: {
      num: nums[0],
      numTimesPrevMax: nums[0],
      numTimesPrevMin: nums[0],
    },
    explanation: `Initialize curMax = ${nums[0]}, curMin = ${nums[0]}, globalMax = ${nums[0]} at index 0.`,
    codeLine: 1,
    history: [...history],
    variableBadges: [
      { name: 'cur_max', value: `${curMax}` },
      { name: 'cur_min', value: `${curMin}` },
      { name: 'res', value: `${globalMax}` },
    ],
  });

  for (let i = 1; i < n; i++) {
    const num = nums[i];
    const prevMax = curMax;
    const prevMin = curMin;

    const c1 = num;
    const c2 = num * prevMax;
    const c3 = num * prevMin;

    steps.push({
      currentIndex: i,
      currentNum: num,
      prevMax,
      prevMin,
      curMax: prevMax,
      curMin: prevMin,
      globalMax,
      candidates: {
        num: c1,
        numTimesPrevMax: c2,
        numTimesPrevMin: c3,
      },
      explanation: `Evaluating index ${i} (num = ${num}). Candidates: num (${c1}), num * prevMax (${c2}), num * prevMin (${c3}).`,
      codeLine: 4,
      history: [...history],
      variableBadges: [
        { name: 'n', value: `${num}` },
        { name: 'prev_max', value: `${prevMax}` },
        { name: 'prev_min', value: `${prevMin}` },
      ],
    });

    curMax = Math.max(c1, c2, c3);
    curMin = Math.min(c1, c2, c3);
    globalMax = Math.max(globalMax, curMax);

    history.push({ index: i, num, maxProd: curMax, minProd: curMin });

    steps.push({
      currentIndex: i,
      currentNum: num,
      prevMax,
      prevMin,
      curMax,
      curMin,
      globalMax,
      candidates: {
        num: c1,
        numTimesPrevMax: c2,
        numTimesPrevMin: c3,
      },
      explanation: `Updated: curMax = max(${c1}, ${c2}, ${c3}) = ${curMax}, curMin = min(${c1}, ${c2}, ${c3}) = ${curMin}. globalMax = ${globalMax}.`,
      codeLine: 7,
      history: [...history],
      variableBadges: [
        { name: 'cur_max', value: `${curMax}` },
        { name: 'cur_min', value: `${curMin}` },
        { name: 'res', value: `${globalMax}` },
      ],
    });
  }

  // Final step
  steps.push({
    currentIndex: n - 1,
    currentNum: nums[n - 1],
    prevMax: curMax,
    prevMin: curMin,
    curMax,
    curMin,
    globalMax,
    candidates: {
      num: nums[n - 1],
      numTimesPrevMax: nums[n - 1] * curMax,
      numTimesPrevMin: nums[n - 1] * curMin,
    },
    explanation: `Finished processing array! Maximum product contiguous subarray product is ${globalMax}.`,
    codeLine: 8,
    history: [...history],
    variableBadges: [{ name: 'res', value: `${globalMax}` }],
  });

  return steps;
}
