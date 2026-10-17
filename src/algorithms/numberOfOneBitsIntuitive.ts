export interface NumberOfOneBitsStep {
  currentN: number;
  nMinusOne: number;
  clearedBitPos: number;
  resCount: number;
  binaryString: string;
  isComplete: boolean;
  explanation: string;
  codeLine: number;
  variableBadges: { name: string; value: string }[];
}

export const NUMBER_OF_ONE_BITS_CODE_LINES = [
  'def hammingWeight(n: int) -> int:',
  '    res = 0',
  '    while n:',
  '        n &= n - 1  # Drops lowest set bit',
  '        res += 1',
  '    return res',
];

export function generateNumberOfOneBitsSteps(initialN: number): NumberOfOneBitsStep[] {
  const steps: NumberOfOneBitsStep[] = [];
  let n = initialN >>> 0; // treat as 32-bit unsigned
  let res = 0;

  steps.push({
    currentN: n,
    nMinusOne: n > 0 ? n - 1 : 0,
    clearedBitPos: -1,
    resCount: 0,
    binaryString: n.toString(2).padStart(32, '0'),
    isComplete: false,
    explanation: `Start counting set bits for n = ${n}. Binary: ${n.toString(2)}. We use Brian Kernighan's trick: n &= (n - 1) clears the lowest 1-bit in O(1) per set bit.`,
    codeLine: 2,
    variableBadges: [
      { name: 'n', value: `${n}` },
      { name: 'res', value: '0' },
    ],
  });

  while (n > 0) {
    const nMinusOne = (n - 1) >>> 0;
    const lowestBit = n & -n;
    const bitPos = Math.log2(lowestBit);
    n = (n & (n - 1)) >>> 0;
    res++;

    steps.push({
      currentN: n,
      nMinusOne,
      clearedBitPos: bitPos,
      resCount: res,
      binaryString: n.toString(2).padStart(32, '0'),
      isComplete: n === 0,
      explanation: `Cleared lowest set bit (2^${bitPos}): n & (n - 1) -> n is now ${n}. Count incremented to res = ${res}.`,
      codeLine: 4,
      variableBadges: [
        { name: 'cleared bit', value: `2^${bitPos}` },
        { name: 'res', value: `${res}` },
        { name: 'remaining n', value: `${n}` },
      ],
    });
  }

  steps.push({
    currentN: 0,
    nMinusOne: 0,
    clearedBitPos: -1,
    resCount: res,
    binaryString: (0).toString(2).padStart(32, '0'),
    isComplete: true,
    explanation: `All set bits cleared (n = 0)! Total number of 1-bits (Hamming Weight): ${res}.`,
    codeLine: 6,
    variableBadges: [
      { name: 'result', value: `${res}` },
      { name: 'status', value: 'Complete' },
    ],
  });

  return steps;
}
