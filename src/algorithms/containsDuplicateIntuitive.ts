export interface ContainsDuplicateStep {
  stepIndex: number;
  totalSteps: number;
  nums: number[];
  currentIndex: number;
  currentNum: number | null;
  seen: number[];
  isDuplicate: boolean;
  duplicateNum: number | null;
  collisionIndex: number | null;
  headline: string;
  subtext: string;
  codeLine: number;
  variableBadges: { name: string; value: string }[];
  isComplete: boolean;
}

export const CONTAINS_DUPLICATE_CODE_LINES = [
  'def containsDuplicate(nums):',
  '    seen = set()',
  '    for num in nums:',
  '        if num in seen:',
  '            return True  # Duplicate detected!',
  '        seen.add(num)    # Store in hash vault',
  '    return False         # All numbers unique'
];

export function generateContainsDuplicateSteps(nums: number[]): ContainsDuplicateStep[] {
  const steps: ContainsDuplicateStep[] = [];
  const seen = new Set<number>();
  const firstSeenIndexMap = new Map<number, number>();

  // Step 0: Initialize
  steps.push({
    stepIndex: 0,
    totalSteps: 0,
    nums,
    currentIndex: -1,
    currentNum: null,
    seen: [],
    isDuplicate: false,
    duplicateNum: null,
    collisionIndex: null,
    headline: 'Initialize Empty Hash Set: seen = set()',
    subtext: 'We scan nums linearly and check if each element already exists in O(1) average lookup time.',
    codeLine: 1,
    variableBadges: [
      { name: 'seen', value: 'set()' },
      { name: 'nums.length', value: `${nums.length}` }
    ],
    isComplete: false
  });

  let duplicateFound = false;

  for (let i = 0; i < nums.length; i++) {
    const num = nums[i];

    if (seen.has(num)) {
      const prevIdx = firstSeenIndexMap.get(num)!;

      // Duplicate step
      steps.push({
        stepIndex: steps.length,
        totalSteps: 0,
        nums,
        currentIndex: i,
        currentNum: num,
        seen: Array.from(seen),
        isDuplicate: true,
        duplicateNum: num,
        collisionIndex: prevIdx,
        headline: `💥 COLLISION FOUND: nums[${i}] = ${num} already in seen vault (first at index ${prevIdx})!`,
        subtext: `Duplicate discovered! Immediately return True in O(n) time and O(n) space.`,
        codeLine: 4,
        variableBadges: [
          { name: 'duplicate', value: `${num}` },
          { name: 'index_1', value: `${prevIdx}` },
          { name: 'index_2', value: `${i}` },
          { name: 'return', value: 'True' }
        ],
        isComplete: true
      });

      duplicateFound = true;
      break;
    }

    // Normal check & add
    firstSeenIndexMap.set(num, i);
    seen.add(num);

    steps.push({
      stepIndex: steps.length,
      totalSteps: 0,
      nums,
      currentIndex: i,
      currentNum: num,
      seen: Array.from(seen),
      isDuplicate: false,
      duplicateNum: null,
      collisionIndex: null,
      headline: `Inspect nums[${i}] = ${num}: Not in seen ➔ Add to Vault`,
      subtext: `No collision. Storing ${num} into the hash set.`,
      codeLine: 5,
      variableBadges: [
        { name: 'num', value: `${num}` },
        { name: 'seen.size', value: `${seen.size}` },
        { name: 'seen', value: `{${Array.from(seen).join(', ')}}` }
      ],
      isComplete: false
    });
  }

  if (!duplicateFound) {
    steps.push({
      stepIndex: steps.length,
      totalSteps: 0,
      nums,
      currentIndex: nums.length - 1,
      currentNum: null,
      seen: Array.from(seen),
      isDuplicate: false,
      duplicateNum: null,
      collisionIndex: null,
      headline: `🏁 Scan Complete: All ${nums.length} Elements are Distinct!`,
      subtext: `Every element was unique. Return False.`,
      codeLine: 6,
      variableBadges: [
        { name: 'return', value: 'False' },
        { name: 'time', value: 'O(n)' },
        { name: 'space', value: 'O(n)' }
      ],
      isComplete: true
    });
  }

  const total = steps.length;
  steps.forEach((s) => (s.totalSteps = total));
  return steps;
}
