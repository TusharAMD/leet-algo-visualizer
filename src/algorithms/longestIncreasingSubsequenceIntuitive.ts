export interface LISStep {
  i: number;
  j: number;
  dp: number[];
  nums: number[];
  canExtend: boolean;
  maxLen: number;
  explanation: string;
  codeLine: number;
  activeChain: number[];
  variableBadges?: { name: string; value: string }[];
}

export const LIS_CODE_LINES = [
  'def lengthOfLIS(nums: List[int]) -> int:',
  '    dp = [1] * len(nums)',
  '    for i in range(len(nums)):',
  '        for j in range(i):',
  '            if nums[j] < nums[i]:',
  '                dp[i] = max(dp[i], 1 + dp[j])',
  '    return max(dp) if nums else 0',
];

export function generateLISSteps(nums: number[]): LISStep[] {
  const steps: LISStep[] = [];
  const n = nums.length;

  if (n === 0) {
    steps.push({
      i: -1,
      j: -1,
      dp: [],
      nums: [],
      canExtend: false,
      maxLen: 0,
      explanation: 'Empty array has LIS length 0.',
      codeLine: 6,
      activeChain: [],
      variableBadges: [{ name: 'max(dp)', value: '0' }],
    });
    return steps;
  }

  const dp: number[] = new Array(n).fill(1);
  const parent: number[] = new Array(n).fill(-1);
  let maxLen = 1;

  steps.push({
    i: 0,
    j: -1,
    dp: [...dp],
    nums: [...nums],
    canExtend: false,
    maxLen: 1,
    explanation: `Initialize dp array of length ${n} with 1 (every single element forms an increasing subsequence of length 1).`,
    codeLine: 1,
    activeChain: [0],
    variableBadges: [{ name: 'dp', value: `[${dp.join(', ')}]` }],
  });

  for (let i = 0; i < n; i++) {
    steps.push({
      i,
      j: -1,
      dp: [...dp],
      nums: [...nums],
      canExtend: false,
      maxLen,
      explanation: `Evaluating element nums[${i}] = ${nums[i]}. Looking back at all previous indices j < ${i}.`,
      codeLine: 2,
      activeChain: [i],
      variableBadges: [
        { name: 'i', value: `${i}` },
        { name: 'nums[i]', value: `${nums[i]}` },
        { name: `dp[${i}]`, value: `${dp[i]}` },
      ],
    });

    for (let j = 0; j < i; j++) {
      const canExtend = nums[j] < nums[i];

      steps.push({
        i,
        j,
        dp: [...dp],
        nums: [...nums],
        canExtend,
        maxLen,
        explanation: `Comparing nums[j=${j}] (${nums[j]}) with nums[i=${i}] (${nums[i]}): ${
          canExtend
            ? `${nums[j]} < ${nums[i]} (Valid extension! Candidate length: 1 + dp[${j}] = ${1 + dp[j]})`
            : `${nums[j]} >= ${nums[i]} (Cannot extend, strictly increasing required)`
        }`,
        codeLine: 4,
        activeChain: canExtend ? [j, i] : [i],
        variableBadges: [
          { name: 'j', value: `${j}` },
          { name: 'nums[j]', value: `${nums[j]}` },
          { name: 'i', value: `${i}` },
          { name: 'nums[i]', value: `${nums[i]}` },
        ],
      });

      if (canExtend) {
        if (1 + dp[j] > dp[i]) {
          dp[i] = 1 + dp[j];
          parent[i] = j;
          maxLen = Math.max(maxLen, dp[i]);

          steps.push({
            i,
            j,
            dp: [...dp],
            nums: [...nums],
            canExtend: true,
            maxLen,
            explanation: `Updated dp[${i}] = 1 + dp[${j}] = ${dp[i]}. Global maximum length is now ${maxLen}.`,
            codeLine: 5,
            activeChain: [j, i],
            variableBadges: [
              { name: `dp[${i}]`, value: `${dp[i]}` },
              { name: 'maxLen', value: `${maxLen}` },
            ],
          });
        }
      }
    }
  }

  // Find best ending index for final chain
  let bestIdx = 0;
  for (let k = 1; k < n; k++) {
    if (dp[k] > dp[bestIdx]) bestIdx = k;
  }
  const finalChain: number[] = [];
  let curr: number = bestIdx;
  while (curr !== -1) {
    finalChain.unshift(curr);
    curr = parent[curr];
  }

  // Final step
  steps.push({
    i: n - 1,
    j: n - 1,
    dp: [...dp],
    nums: [...nums],
    canExtend: true,
    maxLen,
    explanation: `Done! Longest Increasing Subsequence length is ${maxLen} (one such sequence is [${finalChain.map((idx) => nums[idx]).join(', ')}]).`,
    codeLine: 6,
    activeChain: finalChain,
    variableBadges: [{ name: 'max(dp)', value: `${maxLen}` }],
  });

  return steps;
}
