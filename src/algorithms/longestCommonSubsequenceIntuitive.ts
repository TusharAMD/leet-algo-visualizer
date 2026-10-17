export interface LCSStep {
  i: number;
  j: number;
  dp: number[][];
  char1: string;
  char2: string;
  isMatch: boolean;
  explanation: string;
  codeLine: number;
  lcsSoFar: string;
  variableBadges?: { name: string; value: string }[];
}

export const LCS_CODE_LINES = [
  'def longestCommonSubsequence(text1: str, text2: str) -> int:',
  '    dp = [[0] * (len(text2) + 1) for _ in range(len(text1) + 1)]',
  '    for i in range(1, len(text1) + 1):',
  '        for j in range(1, len(text2) + 1):',
  '            if text1[i - 1] == text2[j - 1]:',
  '                dp[i][j] = 1 + dp[i - 1][j - 1]',
  '            else:',
  '                dp[i][j] = max(dp[i - 1][j], dp[i][j - 1])',
  '    return dp[len(text1)][len(text2)]',
];

export function generateLCSSteps(text1: string, text2: string): LCSStep[] {
  const steps: LCSStep[] = [];
  const m = text1.length;
  const n = text2.length;
  const dp: number[][] = Array.from({ length: m + 1 }, () => new Array(n + 1).fill(0));

  steps.push({
    i: 0,
    j: 0,
    dp: dp.map((r) => [...r]),
    char1: '',
    char2: '',
    isMatch: false,
    explanation: `Initialize DP table of size (${m + 1}) x (${n + 1}) with 0. dp[i][j] stores length of LCS between text1[0..i-1] and text2[0..j-1].`,
    codeLine: 1,
    lcsSoFar: '',
    variableBadges: [
      { name: 'm', value: `${m}` },
      { name: 'n', value: `${n}` },
    ],
  });

  for (let i = 1; i <= m; i++) {
    for (let j = 1; j <= n; j++) {
      const c1 = text1[i - 1];
      const c2 = text2[j - 1];
      const match = c1 === c2;

      steps.push({
        i,
        j,
        dp: dp.map((r) => [...r]),
        char1: c1,
        char2: c2,
        isMatch: match,
        explanation: `Comparing text1[${i - 1}] ('${c1}') with text2[${j - 1}] ('${c2}'). ${
          match
            ? `Characters match! Taking diagonal dp[${i - 1}][${j - 1}] + 1.`
            : `Mismatch. Taking max of top dp[${i - 1}][${j}] and left dp[${i}][${j - 1}].`
        }`,
        codeLine: 4,
        lcsSoFar: '',
        variableBadges: [
          { name: 'c1', value: `'${c1}'` },
          { name: 'c2', value: `'${c2}'` },
          { name: 'match', value: match ? 'True' : 'False' },
        ],
      });

      if (match) {
        dp[i][j] = 1 + dp[i - 1][j - 1];
      } else {
        dp[i][j] = Math.max(dp[i - 1][j], dp[i][j - 1]);
      }

      steps.push({
        i,
        j,
        dp: dp.map((r) => [...r]),
        char1: c1,
        char2: c2,
        isMatch: match,
        explanation: `Updated dp[${i}][${j}] = ${dp[i][j]}.`,
        codeLine: match ? 5 : 7,
        lcsSoFar: '',
        variableBadges: [
          { name: `dp[${i}][${j}]`, value: `${dp[i][j]}` },
        ],
      });
    }
  }

  // Backtrack to find LCS string
  let bi = m;
  let bj = n;
  let lcsChars: string[] = [];
  while (bi > 0 && bj > 0) {
    if (text1[bi - 1] === text2[bj - 1]) {
      lcsChars.unshift(text1[bi - 1]);
      bi--;
      bj--;
    } else if (dp[bi - 1][bj] >= dp[bi][bj - 1]) {
      bi--;
    } else {
      bj--;
    }
  }
  const fullLcs = lcsChars.join('');

  // Final step
  steps.push({
    i: m,
    j: n,
    dp: dp.map((r) => [...r]),
    char1: '',
    char2: '',
    isMatch: true,
    explanation: `Done! Longest Common Subsequence length is ${dp[m][n]} (e.g. "${fullLcs}").`,
    codeLine: 8,
    lcsSoFar: fullLcs,
    variableBadges: [
      { name: 'LCS length', value: `${dp[m][n]}` },
      { name: 'LCS string', value: `"${fullLcs}"` },
    ],
  });

  return steps;
}
