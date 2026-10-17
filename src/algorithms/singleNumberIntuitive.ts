export interface SingleNumberStep {
  currentIndex: number;
  currentNum: number | null;
  prevRes: number;
  newRes: number;
  explanation: string;
  codeLine: number;
  nums: number[];
  variableBadges: { name: string; value: string }[];
}

export const SINGLE_NUMBER_CODE_LINES = [
  'def singleNumber(nums: List[int]) -> int:',
  '    res = 0',
  '    for n in nums:',
  '        res ^= n',
  '    return res',
];

export function generateSingleNumberSteps(nums: number[]): SingleNumberStep[] {
  const steps: SingleNumberStep[] = [];
  let res = 0;

  steps.push({
    currentIndex: -1,
    currentNum: null,
    prevRes: 0,
    newRes: 0,
    explanation: 'Initialize XOR accumulator res = 0. By XOR properties: x ^ x = 0, and x ^ 0 = x.',
    codeLine: 2,
    nums,
    variableBadges: [
      { name: 'res', value: '0' },
      { name: 'nums', value: `[${nums.join(', ')}]` },
    ],
  });

  for (let i = 0; i < nums.length; i++) {
    const n = nums[i];
    const prev = res;
    res ^= n;

    steps.push({
      currentIndex: i,
      currentNum: n,
      prevRes: prev,
      newRes: res,
      explanation: `Index ${i} (value ${n}): res = ${prev} ^ ${n} (b: ${prev.toString(2)} ^ ${n.toString(2)}) = ${res} (b: ${res.toString(2)}).`,
      codeLine: 4,
      nums,
      variableBadges: [
        { name: 'n', value: `${n}` },
        { name: 'prev ^ n', value: `${prev} ^ ${n} = ${res}` },
        { name: 'res (binary)', value: `${res.toString(2)}` },
      ],
    });
  }

  steps.push({
    currentIndex: nums.length,
    currentNum: null,
    prevRes: res,
    newRes: res,
    explanation: `All duplicate numbers cancel out into 0! The single non-duplicate number remaining is ${res}.`,
    codeLine: 5,
    nums,
    variableBadges: [
      { name: 'single number', value: `${res}` },
      { name: 'status', value: 'Found' },
    ],
  });

  return steps;
}
