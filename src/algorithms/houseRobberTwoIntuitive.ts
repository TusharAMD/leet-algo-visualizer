export interface HouseRobberTwoStep {
  stepIndex: number;
  totalSteps: number;
  nums: number[];
  phase: 'PLAN' | 'SUB_A' | 'SUB_B' | 'COMPLETE';
  subSlice: 'EXCLUDE_LAST' | 'EXCLUDE_FIRST' | 'NONE';
  currentHouseIndex: number;
  subALoot: number;
  subBLoot: number;
  robbedHouses: number[];
  headline: string;
  subtext: string;
  codeLine: number;
  variableBadges: { name: string; value: string }[];
  isComplete: boolean;
  result: number;
}

export const HOUSE_ROBBER_TWO_CODE_LINES = [
  'def rob(nums):',
  '    if len(nums) == 1: return nums[0]',
  '    def helper(sub):',
  '        rob1, rob2 = 0, 0',
  '        for n in sub:',
  '            temp = max(n + rob1, rob2)',
  '            rob1 = rob2; rob2 = temp',
  '        return rob2',
  '    # Circular Street: First and Last houses are adjacent neighbors!',
  '    planA = helper(nums[:-1])  # Exclude last house',
  '    planB = helper(nums[1:])   # Exclude first house',
  '    return max(planA, planB)'
];

export function generateHouseRobberTwoSteps(nums: number[]): HouseRobberTwoStep[] {
  const steps: HouseRobberTwoStep[] = [];
  const n = nums.length;

  if (n === 1) {
    steps.push({
      stepIndex: 0,
      totalSteps: 1,
      nums,
      phase: 'COMPLETE',
      subSlice: 'NONE',
      currentHouseIndex: 0,
      subALoot: nums[0],
      subBLoot: 0,
      robbedHouses: [0],
      headline: `Single House Street: Loot $${nums[0]}`,
      subtext: 'Only 1 house exists; rob it directly.',
      codeLine: 2,
      variableBadges: [{ name: 'return', value: `$${nums[0]}` }],
      isComplete: true,
      result: nums[0]
    });
    return steps;
  }

  // Step 0: Plan
  steps.push({
    stepIndex: 0,
    totalSteps: 0,
    nums,
    phase: 'PLAN',
    subSlice: 'NONE',
    currentHouseIndex: -1,
    subALoot: 0,
    subBLoot: 0,
    robbedHouses: [],
    headline: `Circular Neighborhood: House 0 & House ${n - 1} are Neighbors!`,
    subtext: 'Break the circular dependency by testing two subplans: Plan A (exclude last) vs Plan B (exclude first).',
    codeLine: 9,
    variableBadges: [
      { name: 'totalHouses', value: `${n}` },
      { name: 'constraint', value: 'First & Last Adjacent' }
    ],
    isComplete: false,
    result: 0
  });

  // Helper function simulation
  const runSub = (sub: number[], offset: number, label: 'EXCLUDE_LAST' | 'EXCLUDE_FIRST'): number => {
    let r1 = 0;
    let r2 = 0;
    const chosen: number[] = [];

    for (let idx = 0; idx < sub.length; idx++) {
      const realIdx = idx + offset;
      const val = sub[idx];
      const robThis = val + r1;
      const skipThis = r2;
      const best = Math.max(robThis, skipThis);

      if (robThis > skipThis) {
        if (chosen.includes(realIdx - 1)) chosen.pop();
        chosen.push(realIdx);
      }

      r1 = r2;
      r2 = best;

      steps.push({
        stepIndex: 0,
        totalSteps: 0,
        nums,
        phase: label === 'EXCLUDE_LAST' ? 'SUB_A' : 'SUB_B',
        subSlice: label,
        currentHouseIndex: realIdx,
        subALoot: label === 'EXCLUDE_LAST' ? r2 : 0,
        subBLoot: label === 'EXCLUDE_FIRST' ? r2 : 0,
        robbedHouses: [...chosen],
        headline: `${label === 'EXCLUDE_LAST' ? 'Plan A (Exclude Last)' : 'Plan B (Exclude First)'}: House #${realIdx}`,
        subtext: `Value: $${val}. Best loot so far in this subproblem: $${r2}.`,
        codeLine: 6,
        variableBadges: [
          { name: 'plan', value: label === 'EXCLUDE_LAST' ? 'Plan A' : 'Plan B' },
          { name: 'house', value: `H${realIdx} ($${val})` },
          { name: 'subTotal', value: `$${r2}` }
        ],
        isComplete: false,
        result: 0
      });
    }

    return r2;
  };

  const planA = runSub(nums.slice(0, n - 1), 0, 'EXCLUDE_LAST');
  const planB = runSub(nums.slice(1), 1, 'EXCLUDE_FIRST');
  const finalResult = Math.max(planA, planB);

  steps.push({
    stepIndex: 0,
    totalSteps: 0,
    nums,
    phase: 'COMPLETE',
    subSlice: planA >= planB ? 'EXCLUDE_LAST' : 'EXCLUDE_FIRST',
    currentHouseIndex: -1,
    subALoot: planA,
    subBLoot: planB,
    robbedHouses: [],
    headline: `Heist Decision Complete: Max Loot = $${finalResult}`,
    subtext: `Plan A (Exclude Last) = $${planA} | Plan B (Exclude First) = $${planB} -> Winner: $${finalResult}.`,
    codeLine: 12,
    variableBadges: [
      { name: 'Plan A', value: `$${planA}` },
      { name: 'Plan B', value: `$${planB}` },
      { name: 'return (Max)', value: `$${finalResult}` }
    ],
    isComplete: true,
    result: finalResult
  });

  const total = steps.length;
  steps.forEach((s, idx) => {
    s.stepIndex = idx;
    s.totalSteps = total;
  });

  return steps;
}
