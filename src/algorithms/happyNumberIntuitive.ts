export interface HappyNumberStep {
  currentNum: number;
  digits: number[];
  squareSum: number;
  history: number[];
  cycleDetected: boolean;
  isHappy: boolean | null;
  explanation: string;
  codeLine: number;
  variableBadges: { name: string; value: string }[];
}

export const HAPPY_NUMBER_CODE_LINES = [
  'def isHappy(n: int) -> bool:',
  '    def get_next(num):',
  '        return sum(int(d)**2 for d in str(num))',
  '    seen = set()',
  '    while n != 1 and n not in seen:',
  '        seen.add(n)',
  '        n = get_next(n)',
  '    return n == 1',
];

export function generateHappyNumberSteps(startN: number): HappyNumberStep[] {
  const steps: HappyNumberStep[] = [];
  const seen = new Set<number>();
  let n = startN;
  const history: number[] = [startN];

  const getDigitsAndSum = (num: number): { digits: number[]; sum: number } => {
    const digits = String(num)
      .split('')
      .map(Number);
    const sum = digits.reduce((acc, d) => acc + d * d, 0);
    return { digits, sum };
  };

  const initial = getDigitsAndSum(n);
  steps.push({
    currentNum: n,
    digits: initial.digits,
    squareSum: initial.sum,
    history: [n],
    cycleDetected: false,
    isHappy: n === 1 ? true : null,
    explanation: `Starting with n = ${n}. Digits squared sum: ${initial.digits.map((d) => `${d}²`).join(' + ')} = ${initial.sum}.`,
    codeLine: 4,
    variableBadges: [
      { name: 'n', value: `${n}` },
      { name: 'seen count', value: '0' },
    ],
  });

  if (n === 1) {
    steps.push({
      currentNum: 1,
      digits: [1],
      squareSum: 1,
      history: [1],
      cycleDetected: false,
      isHappy: true,
      explanation: 'n = 1 immediately! The number is Happy 🎉',
      codeLine: 7,
      variableBadges: [
        { name: 'n', value: '1' },
        { name: 'result', value: 'True' },
      ],
    });
    return steps;
  }

  while (n !== 1 && !seen.has(n)) {
    seen.add(n);
    const { digits, sum } = getDigitsAndSum(n);
    const nextN = sum;

    if (seen.has(nextN)) {
      history.push(nextN);
      steps.push({
        currentNum: nextN,
        digits: getDigitsAndSum(nextN).digits,
        squareSum: getDigitsAndSum(nextN).sum,
        history: [...history],
        cycleDetected: true,
        isHappy: false,
        explanation: `Cycle detected! Number ${nextN} has already been seen in history. Loop entered without reaching 1. Not a Happy Number ❌`,
        codeLine: 7,
        variableBadges: [
          { name: 'cycle at', value: `${nextN}` },
          { name: 'result', value: 'False' },
        ],
      });
      return steps;
    }

    n = nextN;
    history.push(n);

    const isNowHappy = n === 1;
    steps.push({
      currentNum: n,
      digits: getDigitsAndSum(n).digits,
      squareSum: getDigitsAndSum(n).sum,
      history: [...history],
      cycleDetected: false,
      isHappy: isNowHappy ? true : null,
      explanation: isNowHappy
        ? `Reached 1! ${history[history.length - 2]} -> 1. Success! The number is Happy 🎉`
        : `Sum of squared digits of ${history[history.length - 2]} is ${n}. Continue cycle checking...`,
      codeLine: 6,
      variableBadges: [
        { name: 'n', value: `${n}` },
        { name: 'seen size', value: `${seen.size}` },
      ],
    });
  }

  return steps;
}
