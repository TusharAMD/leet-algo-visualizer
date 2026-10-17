export interface DistinctSubsequencesStep {
  i: number;
  j: number;
  dp: number[][];
  charS: string;
  charT: string;
  isMatch: boolean;
  takeCount: number;
  skipCount: number;
  explanation: string;
  codeLine: number;
  variableBadges?: { name: string; value: string }[];
}

export const DISTINCT_SUBSEQUENCES_CODE_LINES = [
  'def numDistinct(s: str, t: str) -> int:',
  '    dp = [[0] * (len(t) + 1) for _ in range(len(s) + 1)]',
  '    for i in range(len(s) + 1):',
  '        dp[i][0] = 1',
  '    for i in range(1, len(s) + 1):',
  '        for j in range(1, len(t) + 1):',
  '            if s[i - 1] == t[j - 1]:',
  '                dp[i][j] = dp[i - 1][j - 1] + dp[i - 1][j]',
  '            else:',
  '                dp[i][j] = dp[i - 1][j]',
  '    return dp[len(s)][len(t)]',
];

export function generateDistinctSubsequencesSteps(
  s: string,
  t: string
): DistinctSubsequencesStep[] {
  const steps: DistinctSubsequencesStep[] = [];
  const m = s.length;
  const n = t.length;

  const dp: number[][] = Array.from({ length: m + 1 }, () =>
    new Array(n + 1).fill(0)
  );
  for (let i = 0; i <= m; i++) {
    dp[i][0] = 1;
  }

  steps.push({
    i: 0,
    j: 0,
    dp: dp.map((r) => [...r]),
    charS: '',
    charT: '',
    isMatch: false,
    takeCount: 0,
    skipCount: 0,
    explanation: `Initialize DP table (${m + 1}) x (${n + 1}). dp[i][0] = 1 for all i because empty target "" can always be formed by picking 0 characters.`,
    codeLine: 3,
    variableBadges: [
      { name: 'len(s)', value: `${m}` },
      { name: 'len(t)', value: `${n}` },
      { name: 'base_case', value: 'dp[i][0] = 1' },
    ],
  });

  for (let i = 1; i <= m; i++) {
    for (let j = 1; j <= n; j++) {
      const charS = s[i - 1];
      const charT = t[j - 1];
      const match = charS === charT;
      const skipCount = dp[i - 1][j];
      const takeCount = match ? dp[i - 1][j - 1] : 0;

      steps.push({
        i,
        j,
        dp: dp.map((r) => [...r]),
        charS,
        charT,
        isMatch: match,
        takeCount,
        skipCount,
        explanation: `Comparing s[${i - 1}] ('${charS}') with t[${j - 1}] ('${charT}'). ${
          match
            ? `Characters match! We can USE s[${i - 1}] (dp[${i - 1}][${j - 1}] = ${takeCount}) OR SKIP s[${i - 1}] (dp[${i - 1}][${j}] = ${skipCount}).`
            : `Mismatch. Must skip s[${i - 1}] (inherit dp[${i - 1}][${j}] = ${skipCount}).`
        }`,
        codeLine: 6,
        variableBadges: [
          { name: 's[i-1]', value: `'${charS}'` },
          { name: 't[j-1]', value: `'${charT}'` },
          { name: 'match', value: match ? 'True' : 'False' },
        ],
      });

      if (match) {
        dp[i][j] = takeCount + skipCount;
      } else {
        dp[i][j] = skipCount;
      }

      steps.push({
        i,
        j,
        dp: dp.map((r) => [...r]),
        charS,
        charT,
        isMatch: match,
        takeCount,
        skipCount,
        explanation: `dp[${i}][${j}] = ${dp[i][j]}.`,
        codeLine: match ? 7 : 9,
        variableBadges: [
          { name: `dp[${i}][${j}]`, value: `${dp[i][j]}` },
        ],
      });
    }
  }

  // Final step
  const finalWays = dp[m][n];
  steps.push({
    i: m,
    j: n,
    dp: dp.map((r) => [...r]),
    charS: '',
    charT: '',
    isMatch: true,
    takeCount: 0,
    skipCount: 0,
    explanation: `Done! Total distinct subsequences of "${s}" that equal "${t}" is dp[${m}][${n}] = ${finalWays}.`,
    codeLine: 10,
    variableBadges: [{ name: 'total_distinct_subsequences', value: `${finalWays}` }],
  });

  return steps;
}
