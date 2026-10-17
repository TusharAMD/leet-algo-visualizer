export interface MinCostClimbingStairsStep {
  stepIndex: number;
  totalSteps: number;
  cost: number[];
  dp: number[];
  currentStepIndex: number;
  comparingSteps: [number, number] | null;
  choice1Cost: number | null;
  choice2Cost: number | null;
  bestChoice: 1 | 2 | null;
  headline: string;
  subtext: string;
  codeLine: number;
  variableBadges: { name: string; value: string }[];
  isComplete: boolean;
  result: number;
}

export const MIN_COST_CLIMBING_CODE_LINES = [
  'def minCostClimbingStairs(cost):',
  '    n = len(cost)',
  '    # dp[i] = min cost to reach step i',
  '    dp = [0] * (n + 1)  # dp[0] = 0, dp[1] = 0 (free to start)',
  '    for i in range(2, n + 1):',
  '        take1 = dp[i - 1] + cost[i - 1]  # 1-step hop',
  '        take2 = dp[i - 2] + cost[i - 2]  # 2-step jump',
  '        dp[i] = min(take1, take2)',
  '    return dp[n]'
];

export function generateMinCostClimbingStairsSteps(
  cost: number[]
): MinCostClimbingStairsStep[] {
  const steps: MinCostClimbingStairsStep[] = [];
  const n = cost.length;
  const dp: number[] = new Array(n + 1).fill(0);

  // Step 0: Init
  steps.push({
    stepIndex: 0,
    totalSteps: 0,
    cost,
    dp: [...dp],
    currentStepIndex: 0,
    comparingSteps: null,
    choice1Cost: null,
    choice2Cost: null,
    bestChoice: null,
    headline: `Initialize DP Staircase (${n} Steps to Top)`,
    subtext: 'Free to start at Step 0 or Step 1 (dp[0] = 0, dp[1] = 0).',
    codeLine: 4,
    variableBadges: [
      { name: 'dp[0]', value: '0' },
      { name: 'dp[1]', value: '0' },
      { name: 'totalSteps', value: `${n}` }
    ],
    isComplete: false,
    result: 0
  });

  for (let i = 2; i <= n; i++) {
    const take1 = dp[i - 1] + cost[i - 1];
    const take2 = dp[i - 2] + cost[i - 2];
    const best = take1 <= take2 ? 1 : 2;
    dp[i] = Math.min(take1, take2);

    // Sub-step: compare options
    steps.push({
      stepIndex: 0,
      totalSteps: 0,
      cost,
      dp: [...dp],
      currentStepIndex: i,
      comparingSteps: [i - 1, i - 2],
      choice1Cost: take1,
      choice2Cost: take2,
      bestChoice: best,
      headline: `Evaluate Step ${i}: Option 1 vs Option 2`,
      subtext: `From step ${i - 1}: dp[${i - 1}] + cost[${i - 1}] = ${take1} | From step ${i - 2}: dp[${i - 2}] + cost[${i - 2}] = ${take2}.`,
      codeLine: 8,
      variableBadges: [
        { name: 'step', value: `${i}` },
        { name: 'hop1 (1-step)', value: `${take1}` },
        { name: 'hop2 (2-step)', value: `${take2}` },
        { name: `dp[${i}]`, value: `${dp[i]}` }
      ],
      isComplete: false,
      result: 0
    });
  }

  // Completion
  const finalMinCost = dp[n];
  steps.push({
    stepIndex: 0,
    totalSteps: 0,
    cost,
    dp: [...dp],
    currentStepIndex: n,
    comparingSteps: null,
    choice1Cost: null,
    choice2Cost: null,
    bestChoice: null,
    headline: `Reached Top of Staircase! Min Cost = ${finalMinCost}`,
    subtext: `Optimal climb requires a total accumulated cost of ${finalMinCost}.`,
    codeLine: 9,
    variableBadges: [
      { name: 'return (minCost)', value: `${finalMinCost}` },
      { name: `topFloor`, value: `dp[${n}] = ${finalMinCost}` }
    ],
    isComplete: true,
    result: finalMinCost
  });

  const total = steps.length;
  steps.forEach((s, idx) => {
    s.stepIndex = idx;
    s.totalSteps = total;
  });

  return steps;
}
