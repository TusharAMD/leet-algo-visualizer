export interface MissingNumberStep {
  currentIndex: number;
  currentNum: number | null;
  prevRes: number;
  newRes: number;
  explanation: string;
  codeLine: number;
  nums: number[];
  variableBadges: { name: string; value: string }[];
}

export const MISSING_NUMBER_CODE_LINES = [
  'def missingNumber(nums: List[int]) -> int:',
  '    res = len(nums)',
  '    for i, n in enumerate(nums):',
  '        res ^= i ^ n',
  '    return res',
];

export function generateMissingNumberSteps(nums: number[]): MissingNumberStep[] {
  const steps: MissingNumberStep[] = [];
  const n = nums.length;
  let res = n;

  steps.push({
    currentIndex: -1,
    currentNum: null,
    prevRes: n,
    newRes: n,
    explanation: `Initialize res = len(nums) = ${n}. We will XOR each index i and nums[i] so duplicate values cancel out.`,
    codeLine: 2,
    nums,
    variableBadges: [
      { name: 'n', value: `${n}` },
      { name: 'res', value: `${res}` },
    ],
  });

  for (let i = 0; i < n; i++) {
    const prev = res;
    res ^= i ^ nums[i];

    steps.push({
      currentIndex: i,
      currentNum: nums[i],
      prevRes: prev,
      newRes: res,
      explanation: `Index ${i}, nums[${i}] = ${nums[i]}: res = ${prev} ^ (${i} ^ ${nums[i]}) = ${res}.`,
      codeLine: 4,
      nums,
      variableBadges: [
        { name: 'i', value: `${i}` },
        { name: 'nums[i]', value: `${nums[i]}` },
        { name: 'res', value: `${res}` },
      ],
    });
  }

  steps.push({
    currentIndex: n,
    currentNum: null,
    prevRes: res,
    newRes: res,
    explanation: `Scan complete! All matched indices and values cancelled out. The missing number in [0..${n}] is ${res}.`,
    codeLine: 5,
    nums,
    variableBadges: [
      { name: 'missing number', value: `${res}` },
      { name: 'status', value: 'Found' },
    ],
  });

  return steps;
}
