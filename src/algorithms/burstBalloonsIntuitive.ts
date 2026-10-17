export interface BurstBalloonsStep {
  l: number;
  r: number;
  k: number; // balloon burst last in (l-1, r+1)
  dp: number[][];
  nums: number[];
  leftBoundary: number;
  rightBoundary: number;
  lastVal: number;
  calcCoins: number;
  explanation: string;
  codeLine: number;
  variableBadges?: { name: string; value: string }[];
}

export const BURST_BALLOONS_CODE_LINES = [
  'def maxCoins(nums: List[int]) -> int:',
  '    nums = [1] + nums + [1]',
  '    n = len(nums)',
  '    dp = [[0] * n for _ in range(n)]',
  '    for length in range(1, n - 1):',
  '        for l in range(1, n - length):',
  '            r = l + length - 1',
  '            for i in range(l, r + 1):',
  '                coins = nums[l - 1] * nums[i] * nums[r + 1]',
  '                coins += dp[l][i - 1] + dp[i + 1][r]',
  '                dp[l][r] = max(dp[l][r], coins)',
  '    return dp[1][n - 2]',
];

export function generateBurstBalloonsSteps(inputNums: number[]): BurstBalloonsStep[] {
  const steps: BurstBalloonsStep[] = [];
  const nums = [1, ...inputNums, 1];
  const n = nums.length;
  const numOriginal = inputNums.length;

  if (numOriginal === 0) {
    steps.push({
      l: 0,
      r: 0,
      k: 0,
      dp: [[0]],
      nums,
      leftBoundary: 1,
      rightBoundary: 1,
      lastVal: 0,
      calcCoins: 0,
      explanation: 'No balloons to burst. Coins = 0.',
      codeLine: 1,
      variableBadges: [{ name: 'result', value: '0' }],
    });
    return steps;
  }

  const dp: number[][] = Array.from({ length: n }, () => new Array(n).fill(0));

  steps.push({
    l: 0,
    r: 0,
    k: 0,
    dp: dp.map((row) => [...row]),
    nums,
    leftBoundary: 1,
    rightBoundary: 1,
    lastVal: 0,
    calcCoins: 0,
    explanation: `Pad array with boundary 1s: [${nums.join(', ')}]. We will solve interval DP: dp[l][r] is max coins from bursting all balloons in [l..r].`,
    codeLine: 4,
    variableBadges: [
      { name: 'padded_nums', value: `[${nums.join(', ')}]` },
      { name: 'n', value: `${numOriginal}` },
    ],
  });

  for (let length = 1; length <= numOriginal; length++) {
    for (let l = 1; l <= numOriginal - length + 1; l++) {
      const r = l + length - 1;

      for (let i = l; i <= r; i++) {
        const leftB = nums[l - 1];
        const rightB = nums[r + 1];
        const lastVal = nums[i];

        const burstCoins = leftB * lastVal * rightB;
        const subLeft = dp[l][i - 1];
        const subRight = dp[i + 1][r];
        const total = burstCoins + subLeft + subRight;

        steps.push({
          l,
          r,
          k: i,
          dp: dp.map((row) => [...row]),
          nums,
          leftBoundary: leftB,
          rightBoundary: rightB,
          lastVal,
          calcCoins: total,
          explanation: `Interval [${l}..${r}]: Test balloon ${i} (val=${lastVal}) as LAST burst balloon. Coins = (${leftB} * ${lastVal} * ${rightB}) + dp[${l}][${i - 1}] (${subLeft}) + dp[${i + 1}][${r}] (${subRight}) = ${total}.`,
          codeLine: 9,
          variableBadges: [
            { name: 'interval', value: `[${l}..${r}]` },
            { name: 'last_balloon', value: `idx ${i} (${lastVal})` },
            { name: 'calc_coins', value: `${total}` },
          ],
        });

        if (total > dp[l][r]) {
          dp[l][r] = total;

          steps.push({
            l,
            r,
            k: i,
            dp: dp.map((row) => [...row]),
            nums,
            leftBoundary: leftB,
            rightBoundary: rightB,
            lastVal,
            calcCoins: total,
            explanation: `Updated dp[${l}][${r}] = ${dp[l][r]}.`,
            codeLine: 10,
            variableBadges: [
              { name: `dp[${l}][${r}]`, value: `${dp[l][r]}` },
            ],
          });
        }
      }
    }
  }

  // Final step
  const finalAns = dp[1][numOriginal];
  steps.push({
    l: 1,
    r: numOriginal,
    k: -1,
    dp: dp.map((row) => [...row]),
    nums,
    leftBoundary: 1,
    rightBoundary: 1,
    lastVal: 0,
    calcCoins: finalAns,
    explanation: `Done! Maximum coins collected by bursting all balloons is dp[1][${numOriginal}] = ${finalAns}.`,
    codeLine: 11,
    variableBadges: [{ name: 'max_coins', value: `${finalAns}` }],
  });

  return steps;
}
