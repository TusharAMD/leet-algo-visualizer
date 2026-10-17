export interface ReverseBitsStep {
  bitIndex: number;
  extractedBit: number;
  targetPos: number;
  currentRes: number;
  inputBinary: string;
  resBinary: string;
  isComplete: boolean;
  explanation: string;
  codeLine: number;
  variableBadges: { name: string; value: string }[];
}

export const REVERSE_BITS_CODE_LINES = [
  'def reverseBits(n: int) -> int:',
  '    res = 0',
  '    for i in range(32):',
  '        bit = (n >> i) & 1',
  '        res |= (bit << (31 - i))',
  '    return res',
];

export function generateReverseBitsSteps(initialN: number): ReverseBitsStep[] {
  const steps: ReverseBitsStep[] = [];
  const n = initialN >>> 0;
  let res = 0;
  const inBin = n.toString(2).padStart(32, '0');

  steps.push({
    bitIndex: -1,
    extractedBit: 0,
    targetPos: -1,
    currentRes: 0,
    inputBinary: inBin,
    resBinary: (0).toString(2).padStart(32, '0'),
    isComplete: false,
    explanation: `Starting 32-bit reversal of n = ${n}. Binary input: ${inBin}.`,
    codeLine: 2,
    variableBadges: [
      { name: 'n', value: `${n}` },
      { name: 'res', value: '0' },
    ],
  });

  // To keep steps intuitive and not overly verbose (32 steps maximum)
  for (let i = 0; i < 32; i++) {
    const bit = (n >>> i) & 1;
    const targetPos = 31 - i;
    res = (res | (bit << targetPos)) >>> 0;

    steps.push({
      bitIndex: i,
      extractedBit: bit,
      targetPos,
      currentRes: res,
      inputBinary: inBin,
      resBinary: res.toString(2).padStart(32, '0'),
      isComplete: i === 31,
      explanation: `Step ${i + 1}/32: Extract bit at index ${i} (${bit}). Place at mirrored position ${targetPos}. Current reversed value = ${res}.`,
      codeLine: 5,
      variableBadges: [
        { name: 'bit', value: `${bit}` },
        { name: 'targetPos', value: `${targetPos}` },
        { name: 'res', value: `${res}` },
      ],
    });
  }

  return steps;
}
