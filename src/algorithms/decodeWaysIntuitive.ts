export interface DecodeWaysStep {
  i: number;
  dp: number[];
  oneDigitVal: string;
  oneDigitValid: boolean;
  twoDigitVal: string;
  twoDigitValid: boolean;
  activeExplanation: string;
  codeLine: number;
  highlightedIndices: number[];
  variableBadges?: { name: string; value: string }[];
}

export const DECODE_WAYS_CODE_LINES = [
  'def numDecodings(s: str) -> int:',
  '    if not s or s[0] == "0":',
  '        return 0',
  '    dp = [0] * (len(s) + 1)',
  '    dp[0] = 1; dp[1] = 1',
  '    for i in range(2, len(s) + 1):',
  '        # 1-digit decode',
  '        if s[i - 1] != "0":',
  '            dp[i] += dp[i - 1]',
  '        # 2-digit decode',
  '        two_digit = int(s[i - 2 : i])',
  '        if 10 <= two_digit <= 26:',
  '            dp[i] += dp[i - 2]',
  '    return dp[len(s)]',
];

export function generateDecodeWaysSteps(s: string): DecodeWaysStep[] {
  const steps: DecodeWaysStep[] = [];
  const n = s.length;

  if (n === 0 || s[0] === '0') {
    const dp = new Array(n + 1).fill(0);
    dp[0] = 1;
    steps.push({
      i: 1,
      dp,
      oneDigitVal: s[0] || '',
      oneDigitValid: false,
      twoDigitVal: '',
      twoDigitValid: false,
      activeExplanation: s.length === 0 ? 'Empty string has 0 ways to decode.' : `String starts with '0', which cannot map to any letter (A-Z are 1-26). Total ways = 0.`,
      codeLine: 2,
      highlightedIndices: [0],
      variableBadges: [{ name: 'result', value: '0' }],
    });
    return steps;
  }

  const dp: number[] = new Array(n + 1).fill(0);
  dp[0] = 1;
  dp[1] = 1;

  steps.push({
    i: 1,
    dp: [...dp],
    oneDigitVal: s[0],
    oneDigitValid: true,
    twoDigitVal: '',
    twoDigitValid: false,
    activeExplanation: `Initialize dp array of length ${n + 1}. Base cases: dp[0] = 1 (empty prefix), dp[1] = 1 ('${s[0]}' maps to '${String.fromCharCode(64 + parseInt(s[0]))}').`,
    codeLine: 4,
    highlightedIndices: [0],
    variableBadges: [
      { name: 'dp[0]', value: '1' },
      { name: 'dp[1]', value: '1' },
    ],
  });

  for (let i = 2; i <= n; i++) {
    const oneDigit = s[i - 1];
    const twoDigit = s.substring(i - 2, i);
    const oneValid = oneDigit !== '0';
    const twoVal = parseInt(twoDigit, 10);
    const twoValid = twoVal >= 10 && twoVal <= 26;

    let ways = 0;

    steps.push({
      i,
      dp: [...dp],
      oneDigitVal: oneDigit,
      oneDigitValid: oneValid,
      twoDigitVal: twoDigit,
      twoDigitValid: twoValid,
      activeExplanation: `Evaluating prefix length ${i} (at digit '${oneDigit}' at index ${i - 1}). Inspecting single digit and two digit options.`,
      codeLine: 5,
      highlightedIndices: [i - 2, i - 1],
      variableBadges: [
        { name: 'i', value: `${i}` },
        { name: 's[i-1]', value: `'${oneDigit}'` },
        { name: 's[i-2:i]', value: `"${twoDigit}"` },
      ],
    });

    if (oneValid) {
      ways += dp[i - 1];
    }
    if (twoValid) {
      ways += dp[i - 2];
    }

    dp[i] = ways;

    const oneMsg = oneValid
      ? `Single '${oneDigit}' is valid ('${String.fromCharCode(64 + parseInt(oneDigit))}') -> +dp[${i - 1}] (${dp[i - 1]})`
      : `Single '${oneDigit}' is '0' (invalid on its own)`;
    const twoMsg = twoValid
      ? `Two digits "${twoDigit}" in [10..26] ('${String.fromCharCode(64 + twoVal)}') -> +dp[${i - 2}] (${dp[i - 2]})`
      : `Two digits "${twoDigit}" not in [10..26]`;

    steps.push({
      i,
      dp: [...dp],
      oneDigitVal: oneDigit,
      oneDigitValid: oneValid,
      twoDigitVal: twoDigit,
      twoDigitValid: twoValid,
      activeExplanation: `dp[${i}] = ${dp[i]}. ${oneMsg}. ${twoMsg}.`,
      codeLine: 12,
      highlightedIndices: [i - 2, i - 1],
      variableBadges: [
        { name: 'i', value: `${i}` },
        { name: `dp[${i}]`, value: `${dp[i]}` },
      ],
    });
  }

  // Final step
  steps.push({
    i: n,
    dp: [...dp],
    oneDigitVal: '',
    oneDigitValid: true,
    twoDigitVal: '',
    twoDigitValid: true,
    activeExplanation: `Decoding complete! Total valid decodings for "${s}" is dp[${n}] = ${dp[n]}.`,
    codeLine: 13,
    highlightedIndices: [],
    variableBadges: [{ name: 'result', value: `${dp[n]}` }],
  });

  return steps;
}
