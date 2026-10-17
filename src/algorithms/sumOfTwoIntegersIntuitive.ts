export interface SumStep {
  iteration: number;
  a: number;
  b: number;
  xorSum: number;
  carry: number;
  aBinary: string;
  bBinary: string;
  isComplete: boolean;
  explanation: string;
  codeLine: number;
  variableBadges: { name: string; value: string }[];
}

export const SUM_OF_TWO_INTEGERS_CODE_LINES = [
  'def getSum(a: int, b: int) -> int:',
  '    while b != 0:',
  '        carry = (a & b) << 1',
  '        a = a ^ b',
  '        b = carry',
  '    return a',
];

export function generateSumSteps(initialA: number, initialB: number): SumStep[] {
  const steps: SumStep[] = [];
  let a = initialA | 0;
  let b = initialB | 0;
  let iter = 0;

  const toBin = (v: number) => (v >>> 0).toString(2).padStart(16, '0');

  steps.push({
    iteration: 0,
    a,
    b,
    xorSum: a ^ b,
    carry: (a & b) << 1,
    aBinary: toBin(a),
    bBinary: toBin(b),
    isComplete: b === 0,
    explanation: `Compute sum of ${initialA} and ${initialB} without + or -. In binary: XOR handles addition without carry; AND shifted by 1 generates the carry.`,
    codeLine: 2,
    variableBadges: [
      { name: 'a', value: `${a}` },
      { name: 'b (carry)', value: `${b}` },
    ],
  });

  while (b !== 0 && iter < 32) {
    iter++;
    const carry = (a & b) << 1;
    const xor = a ^ b;
    a = xor;
    b = carry;

    steps.push({
      iteration: iter,
      a,
      b,
      xorSum: xor,
      carry,
      aBinary: toBin(a),
      bBinary: toBin(b),
      isComplete: b === 0,
      explanation: `Iteration ${iter}: a = a ^ b = ${a}. Carry = (a & b) << 1 = ${b}. ${b === 0 ? 'Carry is 0 -> Final sum reached!' : 'Carry is non-zero -> Continue ripple addition.'}`,
      codeLine: 5,
      variableBadges: [
        { name: 'iter', value: `${iter}` },
        { name: 'a (sum)', value: `${a}` },
        { name: 'b (carry)', value: `${b}` },
      ],
    });
  }

  steps.push({
    iteration: iter + 1,
    a,
    b: 0,
    xorSum: a,
    carry: 0,
    aBinary: toBin(a),
    bBinary: toBin(0),
    isComplete: true,
    explanation: `Sum calculation complete! getSum(${initialA}, ${initialB}) = ${a}.`,
    codeLine: 6,
    variableBadges: [
      { name: 'result', value: `${a}` },
      { name: 'status', value: 'Complete' },
    ],
  });

  return steps;
}
