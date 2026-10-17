export interface MultiplyStep {
  i1: number;
  i2: number;
  digit1: number;
  digit2: number;
  product: number;
  resArray: number[];
  num1Str: string;
  num2Str: string;
  explanation: string;
  codeLine: number;
  variableBadges: { name: string; value: string }[];
}

export const MULTIPLY_STRINGS_CODE_LINES = [
  'def multiply(num1: str, num2: str) -> str:',
  '    if "0" in [num1, num2]: return "0"',
  '    res = [0] * (len(num1) + len(num2))',
  '    num1, num2 = num1[::-1], num2[::-1]',
  '    for i1 in range(len(num1)):',
  '        for i2 in range(len(num2)):',
  '            digit = int(num1[i1]) * int(num2[i2])',
  '            res[i1 + i2] += digit',
  '            res[i1 + i2 + 1] += res[i1 + i2] // 10',
  '            res[i1 + i2] %= 10',
  '    return "".join(map(str, res[::-1])).lstrip("0") or "0"',
];

export function generateMultiplyStringsSteps(num1: string, num2: string): MultiplyStep[] {
  const steps: MultiplyStep[] = [];
  if (num1 === '0' || num2 === '0') {
    steps.push({
      i1: 0,
      i2: 0,
      digit1: 0,
      digit2: 0,
      product: 0,
      resArray: [0],
      num1Str: num1,
      num2Str: num2,
      explanation: 'Multiplying by 0 yields 0.',
      codeLine: 2,
      variableBadges: [{ name: 'result', value: '"0"' }],
    });
    return steps;
  }

  const res = new Array(num1.length + num2.length).fill(0);
  const r1 = num1.split('').reverse();
  const r2 = num2.split('').reverse();

  steps.push({
    i1: -1,
    i2: -1,
    digit1: 0,
    digit2: 0,
    product: 0,
    resArray: [...res],
    num1Str: num1,
    num2Str: num2,
    explanation: `Initialize grade-school column array of size ${res.length} for ${num1} x ${num2}.`,
    codeLine: 3,
    variableBadges: [
      { name: 'num1', value: `"${num1}"` },
      { name: 'num2', value: `"${num2}"` },
      { name: 'res len', value: `${res.length}` },
    ],
  });

  for (let i1 = 0; i1 < r1.length; i1++) {
    const d1 = parseInt(r1[i1], 10);
    for (let i2 = 0; i2 < r2.length; i2++) {
      const d2 = parseInt(r2[i2], 10);
      const prod = d1 * d2;
      res[i1 + i2] += prod;
      const carry = Math.floor(res[i1 + i2] / 10);
      res[i1 + i2 + 1] += carry;
      res[i1 + i2] %= 10;

      steps.push({
        i1,
        i2,
        digit1: d1,
        digit2: d2,
        product: prod,
        resArray: [...res],
        num1Str: num1,
        num2Str: num2,
        explanation: `Multiply ${d1} x ${d2} = ${prod}. Add to column ${i1 + i2}, carry ${carry} to column ${i1 + i2 + 1}.`,
        codeLine: 9,
        variableBadges: [
          { name: 'd1 x d2', value: `${d1} x ${d2} = ${prod}` },
          { name: 'col', value: `${i1 + i2}` },
          { name: 'carry', value: `${carry}` },
        ],
      });
    }
  }

  // Remove leading zeros
  while (res.length > 1 && res[res.length - 1] === 0) {
    res.pop();
  }
  const finalStr = res.slice().reverse().join('');

  steps.push({
    i1: r1.length,
    i2: r2.length,
    digit1: 0,
    digit2: 0,
    product: 0,
    resArray: [...res],
    num1Str: num1,
    num2Str: num2,
    explanation: `Column multiplication complete! Final product is "${finalStr}".`,
    codeLine: 11,
    variableBadges: [
      { name: 'result', value: `"${finalStr}"` },
      { name: 'status', value: 'Complete' },
    ],
  });

  return steps;
}
