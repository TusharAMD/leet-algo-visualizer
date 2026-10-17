export interface PlusOneStep {
  currentIndex: number;
  digits: number[];
  carryPropagated: boolean;
  isComplete: boolean;
  explanation: string;
  codeLine: number;
  variableBadges: { name: string; value: string }[];
}

export const PLUS_ONE_CODE_LINES = [
  'def plusOne(digits: List[int]) -> List[int]:',
  '    for i in range(len(digits) - 1, -1, -1):',
  '        if digits[i] < 9:',
  '            digits[i] += 1',
  '            return digits',
  '        digits[i] = 0',
  '    return [1] + digits',
];

export function generatePlusOneSteps(initialDigits: number[]): PlusOneStep[] {
  const steps: PlusOneStep[] = [];
  const digits = [...initialDigits];
  const n = digits.length;

  steps.push({
    currentIndex: n - 1,
    digits: [...digits],
    carryPropagated: false,
    isComplete: false,
    explanation: `Starting right-to-left scan at least significant digit digits[${n - 1}]. Add 1 to number ${digits.join('')}.`,
    codeLine: 2,
    variableBadges: [
      { name: 'i', value: `${n - 1}` },
      { name: 'digits', value: `[${digits.join(', ')}]` },
    ],
  });

  for (let i = n - 1; i >= 0; i--) {
    if (digits[i] < 9) {
      digits[i] += 1;
      steps.push({
        currentIndex: i,
        digits: [...digits],
        carryPropagated: false,
        isComplete: true,
        explanation: `digits[${i}] = ${digits[i] - 1} < 9. Simply increment to ${digits[i]}. No further carry propagation needed! Return [${digits.join(', ')}].`,
        codeLine: 4,
        variableBadges: [
          { name: 'i', value: `${i}` },
          { name: 'incremented', value: `${digits[i]}` },
          { name: 'result', value: `[${digits.join(', ')}]` },
        ],
      });
      return steps;
    } else {
      digits[i] = 0;
      steps.push({
        currentIndex: i,
        digits: [...digits],
        carryPropagated: true,
        isComplete: false,
        explanation: `digits[${i}] was 9! Adding 1 rolls over: digits[${i}] = 0, carry propagates leftwards to index ${i - 1}.`,
        codeLine: 6,
        variableBadges: [
          { name: 'i', value: `${i}` },
          { name: 'digits[i]', value: '0' },
          { name: 'carry', value: '1' },
        ],
      });
    }
  }

  // All were 9s, prepending 1
  const finalDigits = [1, ...digits];
  steps.push({
    currentIndex: -1,
    digits: finalDigits,
    carryPropagated: true,
    isComplete: true,
    explanation: `Carry overflowed past index 0! Prepend 1 to digits -> [${finalDigits.join(', ')}].`,
    codeLine: 7,
    variableBadges: [
      { name: 'result', value: `[${finalDigits.join(', ')}]` },
      { name: 'status', value: 'Prepended 1' },
    ],
  });

  return steps;
}
