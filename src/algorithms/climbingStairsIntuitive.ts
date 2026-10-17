export interface ClimbingStairsStep {
  stepIndex: number;
  totalSteps: number;
  n: number;
  dp: (number | null)[];
  currentStair: number;
  prev1: number | null;
  prev2: number | null;
  headline: string;
  subtext: string;
  codeLine: number;
  variableBadges: { name: string; value: string }[];
  isComplete: boolean;
}

export const CLIMBING_STAIRS_CODE_LINES = [
  'def climbStairs(n):',
  '    if n <= 2: return n',
  '    dp = [0] * (n + 1)',
  '    dp[1] = 1   # 1 way to reach step 1: [1]',
  '    dp[2] = 2   # 2 ways to reach step 2: [1+1, 2]',
  '    for i in range(3, n + 1):',
  '        dp[i] = dp[i - 1] + dp[i - 2]  # Leap from (i-1) or (i-2)',
  '    return dp[n]'
];

export function generateClimbingStairsSteps(n: number): ClimbingStairsStep[] {
  const steps: ClimbingStairsStep[] = [];
  const dp: (number | null)[] = new Array(n + 1).fill(null);

  if (n <= 2) {
    dp[1] = 1;
    if (n >= 2) dp[2] = 2;
    return [
      {
        stepIndex: 0,
        totalSteps: 1,
        n,
        dp,
        currentStair: n,
        prev1: null,
        prev2: null,
        headline: `Base Case: n = ${n} ➔ Return ${n}`,
        subtext: n === 1 ? 'Only 1 way: [1 step]' : '2 ways: [1+1] or [2]',
        codeLine: 1,
        variableBadges: [{ name: 'return', value: `${n}` }],
        isComplete: true
      }
    ];
  }

  // Step 0: Initialize base cases
  dp[1] = 1;
  dp[2] = 2;

  steps.push({
    stepIndex: 0,
    totalSteps: 0,
    n,
    dp: [...dp],
    currentStair: 2,
    prev1: null,
    prev2: null,
    headline: `Base Cases: dp[1] = 1, dp[2] = 2`,
    subtext: `Stair 1 has 1 path: [1]. Stair 2 has 2 paths: [1+1] or [2].`,
    codeLine: 4,
    variableBadges: [
      { name: 'dp[1]', value: '1' },
      { name: 'dp[2]', value: '2' },
      { name: 'n', value: `${n}` }
    ],
    isComplete: false
  });

  for (let i = 3; i <= n; i++) {
    const val1 = dp[i - 1]!;
    const val2 = dp[i - 2]!;
    const sum = val1 + val2;
    dp[i] = sum;

    steps.push({
      stepIndex: steps.length,
      totalSteps: 0,
      n,
      dp: [...dp],
      currentStair: i,
      prev1: i - 1,
      prev2: i - 2,
      headline: `Step ${i}: dp[${i}] = dp[${i - 1}] (${val1}) + dp[${i - 2}] (${val2}) = ${sum} ways`,
      subtext: `Any journey ending at stair ${i} must arrive via a 1-step leap from stair ${i - 1} OR a 2-step leap from stair ${i - 2}.`,
      codeLine: 6,
      variableBadges: [
        { name: `i`, value: `${i}` },
        { name: `dp[${i - 1}]`, value: `${val1}` },
        { name: `dp[${i - 2}]`, value: `${val2}` },
        { name: `dp[${i}]`, value: `${sum}` }
      ],
      isComplete: false
    });
  }

  // Complete step
  steps.push({
    stepIndex: steps.length,
    totalSteps: 0,
    n,
    dp: [...dp],
    currentStair: n,
    prev1: null,
    prev2: null,
    headline: `🎉 Reached Top: Distinct Ways to Climb ${n} Stairs = ${dp[n]}!`,
    subtext: `Calculated in O(n) time and O(1) auxiliary space (Fibonacci recurrence).`,
    codeLine: 7,
    variableBadges: [
      { name: `return`, value: `${dp[n]}` },
      { name: 'time', value: 'O(n)' },
      { name: 'space', value: 'O(1)' }
    ],
    isComplete: true
  });

  const total = steps.length;
  steps.forEach((s) => (s.totalSteps = total));
  return steps;
}
