export interface ProductExceptSelfStep {
  stepIndex: number;
  totalSteps: number;
  nums: number[];
  phase: 'init' | 'prefix' | 'postfix' | 'complete';
  currentIndex: number;
  prefix: number;
  postfix: number;
  res: number[];
  headline: string;
  subtext: string;
  codeLine: number;
  variableBadges: { name: string; value: string }[];
  isComplete: boolean;
}

export const PRODUCT_EXCEPT_SELF_CODE_LINES = [
  'def productExceptSelf(nums):',
  '    res = [1] * len(nums)',
  '    prefix = 1',
  '    for i in range(len(nums)):',
  '        res[i] = prefix      # Store product of all elements to the left',
  '        prefix *= nums[i]',
  '    postfix = 1',
  '    for i in range(len(nums) - 1, -1, -1):',
  '        res[i] *= postfix    # Multiply by product of all elements to the right',
  '        postfix *= nums[i]',
  '    return res'
];

export function generateProductExceptSelfSteps(nums: number[]): ProductExceptSelfStep[] {
  const steps: ProductExceptSelfStep[] = [];
  const n = nums.length;
  const res = new Array(n).fill(1);

  // Step 0: Initialize
  steps.push({
    stepIndex: 0,
    totalSteps: 0,
    nums,
    phase: 'init',
    currentIndex: -1,
    prefix: 1,
    postfix: 1,
    res: [...res],
    headline: `Initialize Output Array: res = [${res.join(', ')}]`,
    subtext: `We will calculate each product in two sweeps: left prefix wave, then right postfix wave without division!`,
    codeLine: 1,
    variableBadges: [
      { name: 'res', value: `[${res.join(', ')}]` },
      { name: 'n', value: `${n}` }
    ],
    isComplete: false
  });

  // Phase 1: Prefix pass (left to right)
  let prefix = 1;
  for (let i = 0; i < n; i++) {
    res[i] = prefix;

    steps.push({
      stepIndex: steps.length,
      totalSteps: 0,
      nums,
      phase: 'prefix',
      currentIndex: i,
      prefix,
      postfix: 1,
      res: [...res],
      headline: `Prefix Wave (Left ➔ Right): res[${i}] = prefix (${prefix})`,
      subtext: `Left product before index ${i} is ${prefix}. Next prefix becomes ${prefix} * ${nums[i]} = ${prefix * nums[i]}.`,
      codeLine: 4,
      variableBadges: [
        { name: 'i', value: `${i}` },
        { name: `res[${i}] (left)`, value: `${prefix}` },
        { name: 'next_prefix', value: `${prefix * nums[i]}` }
      ],
      isComplete: false
    });

    prefix *= nums[i];
  }

  // Phase 2: Postfix pass (right to left)
  let postfix = 1;
  for (let i = n - 1; i >= 0; i--) {
    const leftVal = res[i];
    res[i] *= postfix;

    steps.push({
      stepIndex: steps.length,
      totalSteps: 0,
      nums,
      phase: 'postfix',
      currentIndex: i,
      prefix,
      postfix,
      res: [...res],
      headline: `Postfix Wave (Right ➔ Left): res[${i}] = ${leftVal} (left) * ${postfix} (right) = ${res[i]}`,
      subtext: `Multiplying accumulated rightward product into res[${i}]. Next postfix becomes ${postfix} * ${nums[i]} = ${postfix * nums[i]}.`,
      codeLine: 8,
      variableBadges: [
        { name: 'i', value: `${i}` },
        { name: 'left_prod', value: `${leftVal}` },
        { name: 'right_prod', value: `${postfix}` },
        { name: `res[${i}] (final)`, value: `${res[i]}` }
      ],
      isComplete: false
    });

    postfix *= nums[i];
  }

  // Complete step
  steps.push({
    stepIndex: steps.length,
    totalSteps: 0,
    nums,
    phase: 'complete',
    currentIndex: -1,
    prefix,
    postfix,
    res: [...res],
    headline: `🎉 Product of Array Except Self Complete: [${res.join(', ')}]!`,
    subtext: `Calculated strictly without division in O(n) runtime and O(1) extra output memory.`,
    codeLine: 10,
    variableBadges: [
      { name: 'return', value: `[${res.join(', ')}]` },
      { name: 'time', value: 'O(n)' },
      { name: 'space', value: 'O(1) auxiliary' }
    ],
    isComplete: true
  });

  const total = steps.length;
  steps.forEach((s) => (s.totalSteps = total));
  return steps;
}
