export interface HouseRobberStep {
  stepIndex: number;
  totalSteps: number;
  nums: number[];
  currentHouseIndex: number;
  rob1: number;
  rob2: number;
  currentLootIfRobbed: number;
  currentLootIfSkipped: number;
  robbedIndices: number[];
  headline: string;
  subtext: string;
  codeLine: number;
  variableBadges: { name: string; value: string }[];
  isComplete: boolean;
  result: number;
}

export const HOUSE_ROBBER_CODE_LINES = [
  'def rob(nums):',
  '    # rob1 = max loot up to house i - 2',
  '    # rob2 = max loot up to house i - 1',
  '    rob1, rob2 = 0, 0',
  '    for n in nums:',
  '        # Option 1: Rob this house (n + rob1)',
  '        # Option 2: Skip this house (rob2)',
  '        temp = max(n + rob1, rob2)',
  '        rob1 = rob2',
  '        rob2 = temp',
  '    return rob2'
];

export function generateHouseRobberSteps(nums: number[]): HouseRobberStep[] {
  const steps: HouseRobberStep[] = [];
  const n = nums.length;

  let rob1 = 0;
  let rob2 = 0;
  const robbedHouses: number[] = [];

  // Step 0: Init
  steps.push({
    stepIndex: 0,
    totalSteps: 0,
    nums,
    currentHouseIndex: -1,
    rob1: 0,
    rob2: 0,
    currentLootIfRobbed: 0,
    currentLootIfSkipped: 0,
    robbedIndices: [],
    headline: `Initialize Heist Planner (${n} Houses on Street)`,
    subtext: 'No two adjacent houses can be robbed without triggering neighborhood alarms.',
    codeLine: 4,
    variableBadges: [
      { name: 'rob1 (i-2)', value: '$0' },
      { name: 'rob2 (i-1)', value: '$0' }
    ],
    isComplete: false,
    result: 0
  });

  for (let i = 0; i < n; i++) {
    const val = nums[i];
    const robThis = val + rob1;
    const skipThis = rob2;
    const best = Math.max(robThis, skipThis);

    steps.push({
      stepIndex: 0,
      totalSteps: 0,
      nums,
      currentHouseIndex: i,
      rob1,
      rob2,
      currentLootIfRobbed: robThis,
      currentLootIfSkipped: skipThis,
      robbedIndices: [...robbedHouses],
      headline: `House #${i}: Loot $${val} | Rob vs Skip?`,
      subtext: `Option 1 (Rob): $${val} + $${rob1} = $${robThis} | Option 2 (Skip): $${skipThis}`,
      codeLine: 8,
      variableBadges: [
        { name: 'houseVal', value: `$${val}` },
        { name: 'ifRobbed', value: `$${robThis}` },
        { name: 'ifSkipped', value: `$${skipThis}` },
        { name: 'decision', value: robThis > skipThis ? 'ROB' : 'SKIP' }
      ],
      isComplete: false,
      result: 0
    });

    if (robThis > skipThis) {
      // If we rob this house, remove adjacent i-1 if present
      if (robbedHouses.includes(i - 1)) {
        robbedHouses.pop();
      }
      robbedHouses.push(i);
    }

    rob1 = rob2;
    rob2 = best;
  }

  // Completion
  steps.push({
    stepIndex: 0,
    totalSteps: 0,
    nums,
    currentHouseIndex: n,
    rob1,
    rob2,
    currentLootIfRobbed: 0,
    currentLootIfSkipped: 0,
    robbedIndices: [...robbedHouses],
    headline: `Heist Complete! Maximum Loot = $${rob2}`,
    subtext: `Optimal non-adjacent selection yields maximum haul of $${rob2}.`,
    codeLine: 11,
    variableBadges: [
      { name: 'maxLoot', value: `$${rob2}` },
      { name: 'robbedCount', value: `${robbedHouses.length}` }
    ],
    isComplete: true,
    result: rob2
  });

  const total = steps.length;
  steps.forEach((s, idx) => {
    s.stepIndex = idx;
    s.totalSteps = total;
  });

  return steps;
}
