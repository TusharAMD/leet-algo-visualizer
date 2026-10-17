export interface ReverseIntegerStep {
  xRemaining: number;
  extractedDigit: number;
  accumulator: number;
  sign: number;
  overflowDetected: boolean;
  isComplete: boolean;
  explanation: string;
  codeLine: number;
  variableBadges: { name: string; value: string }[];
}

export const REVERSE_INTEGER_CODE_LINES = [
  'def reverse(x: int) -> int:',
  '    INT_MIN, INT_MAX = -2**31, 2**31 - 1',
  '    res, sign = 0, -1 if x < 0 else 1',
  '    x = abs(x)',
  '    while x != 0:',
  '        digit = x % 10; x //= 10',
  '        if res > INT_MAX // 10 or (res == INT_MAX // 10 and digit > 7):',
  '            return 0',
  '        res = res * 10 + digit',
  '    return sign * res',
];

export function generateReverseIntegerSteps(originalX: number): ReverseIntegerStep[] {
  const steps: ReverseIntegerStep[] = [];
  const INT_MAX = 2147483647;
  const sign = originalX < 0 ? -1 : 1;
  let x = Math.abs(originalX);
  let res = 0;

  steps.push({
    xRemaining: x,
    extractedDigit: 0,
    accumulator: 0,
    sign,
    overflowDetected: false,
    isComplete: false,
    explanation: `Start reversing ${originalX}. Sign = ${sign > 0 ? '+' : '-'}. Accumulator res = 0. Range clamp: [-2³¹, 2³¹ - 1].`,
    codeLine: 3,
    variableBadges: [
      { name: 'input', value: `${originalX}` },
      { name: 'sign', value: `${sign}` },
      { name: 'res', value: '0' },
    ],
  });

  while (x !== 0) {
    const digit = x % 10;
    x = Math.floor(x / 10);

    // Overflow check
    const maxDiv10 = Math.floor(INT_MAX / 10);
    if (res > maxDiv10 || (res === maxDiv10 && digit > 7)) {
      steps.push({
        xRemaining: x,
        extractedDigit: digit,
        accumulator: 0,
        sign,
        overflowDetected: true,
        isComplete: true,
        explanation: `32-bit signed integer overflow detected! Multiplying ${res} by 10 exceeds INT_MAX (${INT_MAX}). Clamping to 0.`,
        codeLine: 8,
        variableBadges: [
          { name: 'digit', value: `${digit}` },
          { name: 'overflow', value: 'True' },
          { name: 'result', value: '0' },
        ],
      });
      return steps;
    }

    res = res * 10 + digit;
    steps.push({
      xRemaining: x,
      extractedDigit: digit,
      accumulator: res,
      sign,
      overflowDetected: false,
      isComplete: x === 0,
      explanation: `Extracted digit ${digit}: res = res * 10 + ${digit} -> ${res}. Remaining x = ${x}.`,
      codeLine: 9,
      variableBadges: [
        { name: 'digit', value: `${digit}` },
        { name: 'res', value: `${res}` },
        { name: 'remaining x', value: `${x}` },
      ],
    });
  }

  const finalResult = sign * res;
  steps.push({
    xRemaining: 0,
    extractedDigit: 0,
    accumulator: finalResult,
    sign,
    overflowDetected: false,
    isComplete: true,
    explanation: `Reversal complete! Applied original sign (${sign}) -> final result = ${finalResult}.`,
    codeLine: 10,
    variableBadges: [
      { name: 'final result', value: `${finalResult}` },
      { name: 'status', value: 'Complete' },
    ],
  });

  return steps;
}
