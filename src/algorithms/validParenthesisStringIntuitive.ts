export interface ValidParenthesisStep {
  index: number;
  char: string;
  cmin: number;
  cmax: number;
  prevCmin: number;
  prevCmax: number;
  isValidSoFar: boolean;
  isComplete: boolean;
  result?: boolean;
  explanation: string;
  codeLine: number;
  variableBadges: { name: string; value: string }[];
}

export const VALID_PARENTHESIS_STRING_CODE_LINES = [
  'def checkValidString(s: str) -> bool:',
  '    cmin = cmax = 0',
  '    for c in s:',
  '        if c == "(": ',
  '            cmin += 1; cmax += 1',
  '        elif c == ")":',
  '            cmin = max(cmin - 1, 0)',
  '            cmax -= 1',
  '        else: # c == "*"',
  '            cmin = max(cmin - 1, 0)',
  '            cmax += 1',
  '        if cmax < 0:',
  '            return False',
  '    return cmin == 0',
];

export function generateValidParenthesisStringSteps(s: string): ValidParenthesisStep[] {
  const steps: ValidParenthesisStep[] = [];
  const n = s.length;

  if (n === 0) {
    steps.push({
      index: -1,
      char: '',
      cmin: 0,
      cmax: 0,
      prevCmin: 0,
      prevCmax: 0,
      isValidSoFar: true,
      isComplete: true,
      result: true,
      explanation: 'Empty string is trivially valid.',
      codeLine: 1,
      variableBadges: [
        { name: 'cmin', value: '0' },
        { name: 'cmax', value: '0' },
        { name: 'result', value: 'True' },
      ],
    });
    return steps;
  }

  let cmin = 0;
  let cmax = 0;

  steps.push({
    index: -1,
    char: '',
    cmin: 0,
    cmax: 0,
    prevCmin: 0,
    prevCmax: 0,
    isValidSoFar: true,
    isComplete: false,
    explanation: 'Initialize min and max possible open parenthesis balance: cmin = 0, cmax = 0.',
    codeLine: 1,
    variableBadges: [
      { name: 'cmin', value: '0' },
      { name: 'cmax', value: '0' },
    ],
  });

  for (let i = 0; i < n; i++) {
    const char = s[i];
    const prevCmin = cmin;
    const prevCmax = cmax;
    let codeLine = 2;

    if (char === '(') {
      cmin += 1;
      cmax += 1;
      codeLine = 4;
    } else if (char === ')') {
      cmin = Math.max(cmin - 1, 0);
      cmax -= 1;
      codeLine = 6;
    } else if (char === '*') {
      cmin = Math.max(cmin - 1, 0);
      cmax += 1;
      codeLine = 9;
    }

    if (cmax < 0) {
      steps.push({
        index: i,
        char,
        cmin,
        cmax,
        prevCmin,
        prevCmax,
        isValidSoFar: false,
        isComplete: true,
        result: false,
        explanation: `At index ${i} ('${char}'): cmax dropped below 0 (${cmax}). Too many closing brackets ')' even if all '*' were '('. Invalid string!`,
        codeLine: 12,
        variableBadges: [
          { name: 'index', value: `${i}` },
          { name: 'char', value: `'${char}'` },
          { name: 'cmin', value: `${cmin}` },
          { name: 'cmax', value: `${cmax}` },
          { name: 'result', value: 'False' },
        ],
      });
      return steps;
    }

    let detail = '';
    if (char === '(') {
      detail = `Open bracket '(': both cmin and cmax increment by 1 -> range [${cmin}, ${cmax}].`;
    } else if (char === ')') {
      detail = `Close bracket ')': cmin decreases to ${cmin} (cannot go below 0), cmax drops to ${cmax} -> range [${cmin}, ${cmax}].`;
    } else {
      detail = `Wildcard '*': can be ')' (cmin -> ${cmin}), or '(' (cmax -> ${cmax}), or '' (neutral) -> range [${cmin}, ${cmax}].`;
    }

    steps.push({
      index: i,
      char,
      cmin,
      cmax,
      prevCmin,
      prevCmax,
      isValidSoFar: true,
      isComplete: false,
      explanation: `Index ${i} ('${char}'): ${detail}`,
      codeLine,
      variableBadges: [
        { name: 'index', value: `${i}` },
        { name: 'char', value: `'${char}'` },
        { name: 'cmin', value: `${cmin}` },
        { name: 'cmax', value: `${cmax}` },
      ],
    });
  }

  const isFinalValid = cmin === 0;
  steps.push({
    index: n,
    char: '',
    cmin,
    cmax,
    prevCmin: cmin,
    prevCmax: cmax,
    isValidSoFar: isFinalValid,
    isComplete: true,
    result: isFinalValid,
    explanation: isFinalValid
      ? `End of string reached! cmin = 0, meaning all open brackets can be balanced. Result: True ✅`
      : `End of string reached! cmin = ${cmin} > 0, meaning some open '(' could not be closed. Result: False ❌`,
    codeLine: 13,
    variableBadges: [
      { name: 'cmin', value: `${cmin}` },
      { name: 'cmax', value: `${cmax}` },
      { name: 'result', value: isFinalValid ? 'True' : 'False' },
    ],
  });

  return steps;
}
