export interface TargetSumStep {
  index: number;
  currentNum: number;
  waysMap: Record<number, number>; // sum -> number of ways
  explanation: string;
  codeLine: number;
  target: number;
  nums: number[];
  variableBadges?: { name: string; value: string }[];
}

export const TARGET_SUM_CODE_LINES = [
  'def findTargetSumWays(nums: List[int], target: int) -> int:',
  '    dp = {0: 1}',
  '    for n in nums:',
  '        next_dp = defaultdict(int)',
  '        for cur_sum, count in dp.items():',
  '            next_dp[cur_sum + n] += count',
  '            next_dp[cur_sum - n] += count',
  '        dp = next_dp',
  '    return dp[target]',
];

export function generateTargetSumSteps(nums: number[], target: number): TargetSumStep[] {
  const steps: TargetSumStep[] = [];
  let dp: Record<number, number> = { 0: 1 };

  steps.push({
    index: -1,
    currentNum: 0,
    waysMap: { ...dp },
    explanation: `Initialize DP hash map with { 0: 1 } (1 way to achieve sum 0 with 0 elements).`,
    codeLine: 1,
    target,
    nums: [...nums],
    variableBadges: [
      { name: 'target', value: `${target}` },
      { name: 'dp[0]', value: '1' },
    ],
  });

  for (let i = 0; i < nums.length; i++) {
    const n = nums[i];
    const nextDp: Record<number, number> = {};

    steps.push({
      index: i,
      currentNum: n,
      waysMap: { ...dp },
      explanation: `Evaluating nums[${i}] = ${n}. Branching each existing sum with +${n} and -${n}.`,
      codeLine: 3,
      target,
      nums: [...nums],
      variableBadges: [
        { name: 'index', value: `${i}` },
        { name: 'num', value: `${n}` },
        { name: 'distinct_sums', value: `${Object.keys(dp).length}` },
      ],
    });

    for (const [sumStr, count] of Object.entries(dp)) {
      const curSum = parseInt(sumStr, 10);
      nextDp[curSum + n] = (nextDp[curSum + n] || 0) + count;
      nextDp[curSum - n] = (nextDp[curSum - n] || 0) + count;
    }

    dp = nextDp;

    steps.push({
      index: i,
      currentNum: n,
      waysMap: { ...dp },
      explanation: `After processing nums[${i}] (${n}), we have ${Object.keys(dp).length} reachable sums.`,
      codeLine: 7,
      target,
      nums: [...nums],
      variableBadges: [
        { name: 'index', value: `${i}` },
        { name: 'ways to target so far', value: `${dp[target] || 0}` },
      ],
    });
  }

  const finalWays = dp[target] || 0;
  steps.push({
    index: nums.length - 1,
    currentNum: nums[nums.length - 1],
    waysMap: { ...dp },
    explanation: `Done! Total ways to assign +/- symbols to reach target ${target} is dp[${target}] = ${finalWays}.`,
    codeLine: 8,
    target,
    nums: [...nums],
    variableBadges: [
      { name: 'target', value: `${target}` },
      { name: 'total_ways', value: `${finalWays}` },
    ],
  });

  return steps;
}
