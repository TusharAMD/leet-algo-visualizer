export interface CountingBitsStep {
  currentI: number;
  halfI: number;
  lastBit: number;
  dpArray: number[];
  isComplete: boolean;
  explanation: string;
  codeLine: number;
  variableBadges: { name: string; value: string }[];
}

export const COUNTING_BITS_CODE_LINES = [
  'def countBits(n: int) -> List[int]:',
  '    dp = [0] * (n + 1)',
  '    for i in range(1, n + 1):',
  '        dp[i] = dp[i >> 1] + (i & 1)',
  '    return dp',
];

export function generateCountingBitsSteps(n: number): CountingBitsStep[] {
  const steps: CountingBitsStep[] = [];
  const dp = new Array(n + 1).fill(0);

  steps.push({
    currentI: 0,
    halfI: 0,
    lastBit: 0,
    dpArray: [...dp],
    isComplete: n === 0,
    explanation: 'Initialize DP table of size n + 1 with base case dp[0] = 0 (0 has zero set bits).',
    codeLine: 2,
    variableBadges: [
      { name: 'n', value: `${n}` },
      { name: 'dp[0]', value: '0' },
    ],
  });

  for (let i = 1; i <= n; i++) {
    const half = i >> 1;
    const lsb = i & 1;
    dp[i] = dp[half] + lsb;

    steps.push({
      currentI: i,
      halfI: half,
      lastBit: lsb,
      dpArray: [...dp],
      isComplete: i === n,
      explanation: `i = ${i} (b: ${i.toString(2)}): dp[${i}] = dp[${i} >> 1] + (${i} & 1) = dp[${half}] (${dp[half]}) + ${lsb} = ${dp[i]}.`,
      codeLine: 4,
      variableBadges: [
        { name: 'i', value: `${i}` },
        { name: 'i >> 1', value: `${half}` },
        { name: 'i & 1', value: `${lsb}` },
        { name: 'dp[i]', value: `${dp[i]}` },
      ],
    });
  }

  return steps;
}
