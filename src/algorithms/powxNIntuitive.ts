export interface PowStep {
  nRemaining: number;
  currentProduct: number;
  result: number;
  isBitOne: boolean;
  explanation: string;
  codeLine: number;
  variableBadges: { name: string; value: string }[];
}

export const POWX_N_CODE_LINES = [
  'def myPow(x: float, n: int) -> float:',
  '    if n < 0: x, n = 1 / x, -n',
  '    res = 1',
  '    curr = x',
  '    while n > 0:',
  '        if n % 2 == 1:',
  '            res *= curr',
  '        curr *= curr',
  '        n //= 2',
  '    return res',
];

export function generatePowSteps(initialX: number, initialN: number): PowStep[] {
  const steps: PowStep[] = [];
  let x = initialX;
  let n = initialN;

  if (n === 0) {
    steps.push({
      nRemaining: 0,
      currentProduct: x,
      result: 1,
      isBitOne: false,
      explanation: 'Any number to the power of 0 equals 1.',
      codeLine: 9,
      variableBadges: [{ name: 'result', value: '1' }],
    });
    return steps;
  }

  let isNegative = false;
  if (n < 0) {
    isNegative = true;
    x = 1 / x;
    n = -n;
  }

  let res = 1;
  let curr = x;
  let remainingN = n;

  steps.push({
    nRemaining: remainingN,
    currentProduct: curr,
    result: res,
    isBitOne: false,
    explanation: `Initialize binary exponentiation: ${isNegative ? `negative power -> inverted x to ${curr.toFixed(4)}, ` : ''}res = 1, curr = ${curr}, n = ${remainingN} (binary: ${remainingN.toString(2)}).`,
    codeLine: 4,
    variableBadges: [
      { name: 'res', value: `${res}` },
      { name: 'curr', value: `${curr}` },
      { name: 'n', value: `${remainingN}` },
    ],
  });

  while (remainingN > 0) {
    const isOdd = remainingN % 2 === 1;
    if (isOdd) {
      res *= curr;
      steps.push({
        nRemaining: remainingN,
        currentProduct: curr,
        result: res,
        isBitOne: true,
        explanation: `n=${remainingN} is ODD (lowest bit is 1): multiply res by curr (${curr.toFixed(4)}) -> res = ${res.toFixed(4)}.`,
        codeLine: 7,
        variableBadges: [
          { name: 'n % 2', value: '1' },
          { name: 'res', value: `${res.toFixed(4)}` },
          { name: 'curr', value: `${curr.toFixed(4)}` },
        ],
      });
    }

    curr *= curr;
    remainingN = Math.floor(remainingN / 2);

    steps.push({
      nRemaining: remainingN,
      currentProduct: curr,
      result: res,
      isBitOne: false,
      explanation: `Square curr -> ${curr.toFixed(4)}, halve n -> ${remainingN} (shifted right).`,
      codeLine: 9,
      variableBadges: [
        { name: 'n', value: `${remainingN}` },
        { name: 'squared curr', value: `${curr.toFixed(4)}` },
        { name: 'res', value: `${res.toFixed(4)}` },
      ],
    });
  }

  steps.push({
    nRemaining: 0,
    currentProduct: curr,
    result: res,
    isBitOne: false,
    explanation: `Exponentiation complete! myPow(${initialX}, ${initialN}) = ${res.toFixed(5)}.`,
    codeLine: 9,
    variableBadges: [
      { name: 'final result', value: `${res.toFixed(5)}` },
      { name: 'status', value: 'Complete' },
    ],
  });

  return steps;
}
