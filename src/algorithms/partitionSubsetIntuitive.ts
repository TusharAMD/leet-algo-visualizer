export interface PartitionStep {
  stepIndex: number;
  totalSteps: number;
  nums: number[];
  totalSum: number;
  target: number;
  isOdd: boolean;
  currIndex: number;
  currNum: number | null;
  attainableSums: number[];
  newSums: number[];
  headline: string;
  subtext: string;
  codeLine: number;
  variableBadges: { name: string; value: string }[];
  isComplete: boolean;
  canPartition: boolean;
}

export const PARTITION_CODE_LINES = [
  'def canPartition(nums):',
  '    total = sum(nums)',
  '    if total % 2 != 0: return False  # Cannot split odd sum',
  '    target = total // 2',
  '    dp = set([0])',
  '    for num in nums:',
  '        next_dp = set(dp)',
  '        for t in dp:',
  '            if t + num == target: return True',
  '            if t + num < target: next_dp.add(t + num)',
  '        dp = next_dp',
  '    return target in dp'
];

export function generatePartitionSteps(nums: number[]): PartitionStep[] {
  const steps: PartitionStep[] = [];
  const totalSum = nums.reduce((a, b) => a + b, 0);

  // If sum is odd, impossible
  if (totalSum % 2 !== 0) {
    return [
      {
        stepIndex: 0,
        totalSteps: 1,
        nums,
        totalSum,
        target: Math.floor(totalSum / 2),
        isOdd: true,
        currIndex: -1,
        currNum: null,
        attainableSums: [0],
        newSums: [],
        headline: `❌ Odd Sum (${totalSum}): Equal Partition Impossible`,
        subtext: `Total sum cannot be split into two equal integer halves. Immediately return False.`,
        codeLine: 2,
        variableBadges: [
          { name: 'total', value: `${totalSum}` },
          { name: 'parity', value: 'ODD' },
          { name: 'return', value: 'False' }
        ],
        isComplete: true,
        canPartition: false
      }
    ];
  }

  const target = totalSum / 2;
  let dp = new Set<number>([0]);

  // Step 0: Initial
  steps.push({
    stepIndex: 0,
    totalSteps: 0,
    nums,
    totalSum,
    target,
    isOdd: false,
    currIndex: -1,
    currNum: null,
    attainableSums: [0],
    newSums: [],
    headline: `Total Sum = ${totalSum} (Even) ➔ Target Subset Sum = ${target}`,
    subtext: `Problem reduced to 0/1 Knapsack: Can we select a subset of nums that sums exactly to ${target}?`,
    codeLine: 4,
    variableBadges: [
      { name: 'total', value: `${totalSum}` },
      { name: 'target', value: `${target}` },
      { name: 'dp', value: '{0}' }
    ],
    isComplete: false,
    canPartition: false
  });

  let found = false;

  for (let i = 0; i < nums.length; i++) {
    const num = nums[i];
    const nextDp = new Set<number>(dp);
    const addedThisStep: number[] = [];

    // Step: Process number
    steps.push({
      stepIndex: steps.length,
      totalSteps: 0,
      nums,
      totalSum,
      target,
      isOdd: false,
      currIndex: i,
      currNum: num,
      attainableSums: Array.from(dp).sort((a, b) => a - b),
      newSums: [],
      headline: `Consider nums[${i}] = ${num}: Test Take vs. Skip for all current sums`,
      subtext: `For each existing sum t in dp, we can either skip ${num} or form sum t + ${num}.`,
      codeLine: 6,
      variableBadges: [
        { name: 'num', value: `${num}` },
        { name: 'dp.size', value: `${dp.size}` },
        { name: 'target', value: `${target}` }
      ],
      isComplete: false,
      canPartition: false
    });

    for (const t of Array.from(dp)) {
      const newSum = t + num;
      if (newSum === target) {
        nextDp.add(newSum);
        addedThisStep.push(newSum);

        steps.push({
          stepIndex: steps.length,
          totalSteps: 0,
          nums,
          totalSum,
          target,
          isOdd: false,
          currIndex: i,
          currNum: num,
          attainableSums: Array.from(nextDp).sort((a, b) => a - b),
          newSums: [newSum],
          headline: `🎯 TARGET ACHIEVED: sum ${t} + num ${num} = ${target}!`,
          subtext: `Found a subset that equals exactly half the total sum (${target}). Return True!`,
          codeLine: 8,
          variableBadges: [
            { name: 'solution', value: `${t} + ${num} = ${target}` },
            { name: 'return', value: 'True' }
          ],
          isComplete: true,
          canPartition: true
        });

        found = true;
        break;
      } else if (newSum < target) {
        if (!dp.has(newSum)) {
          addedThisStep.push(newSum);
        }
        nextDp.add(newSum);
      }
    }

    if (found) break;

    dp = nextDp;

    steps.push({
      stepIndex: steps.length,
      totalSteps: 0,
      nums,
      totalSum,
      target,
      isOdd: false,
      currIndex: i,
      currNum: num,
      attainableSums: Array.from(dp).sort((a, b) => a - b),
      newSums: addedThisStep,
      headline: `Updated Attainable Sums with num=${num}: Added [${addedThisStep.join(', ')}]`,
      subtext: `dp now holds ${dp.size} unique attainable sums under target ${target}.`,
      codeLine: 10,
      variableBadges: [
        { name: 'dp', value: `{${Array.from(dp).sort((a, b) => a - b).join(', ')}}` },
        { name: 'new', value: `[${addedThisStep.join(', ')}]` }
      ],
      isComplete: false,
      canPartition: false
    });
  }

  if (!found) {
    steps.push({
      stepIndex: steps.length,
      totalSteps: 0,
      nums,
      totalSum,
      target,
      isOdd: false,
      currIndex: nums.length - 1,
      currNum: null,
      attainableSums: Array.from(dp).sort((a, b) => a - b),
      newSums: [],
      headline: `❌ Search Exhausted: Target Sum ${target} is Unreachable`,
      subtext: `No subset can sum to ${target}. Return False.`,
      codeLine: 11,
      variableBadges: [
        { name: 'target', value: `${target}` },
        { name: 'return', value: 'False' }
      ],
      isComplete: true,
      canPartition: false
    });
  }

  const total = steps.length;
  steps.forEach((s) => (s.totalSteps = total));
  return steps;
}
