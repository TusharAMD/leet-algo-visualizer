export interface InterleavingStringStep {
  i: number;
  j: number;
  dp: boolean[][];
  char1: string;
  char2: string;
  char3: string;
  match1: boolean;
  match2: boolean;
  canInterleave: boolean;
  explanation: string;
  codeLine: number;
  variableBadges?: { name: string; value: string }[];
}

export const INTERLEAVING_STRING_CODE_LINES = [
  'def isInterleave(s1: str, s2: str, s3: str) -> bool:',
  '    if len(s1) + len(s2) != len(s3):',
  '        return False',
  '    dp = [[False] * (len(s2) + 1) for _ in range(len(s1) + 1)]',
  '    dp[0][0] = True',
  '    for i in range(len(s1) + 1):',
  '        for j in range(len(s2) + 1):',
  '            if i > 0 and s1[i - 1] == s3[i + j - 1] and dp[i - 1][j]:',
  '                dp[i][j] = True',
  '            if j > 0 and s2[j - 1] == s3[i + j - 1] and dp[i][j - 1]:',
  '                dp[i][j] = True',
  '    return dp[len(s1)][len(s2)]',
];

export function generateInterleavingStringSteps(
  s1: string,
  s2: string,
  s3: string
): InterleavingStringStep[] {
  const steps: InterleavingStringStep[] = [];
  const m = s1.length;
  const n = s2.length;

  if (m + n !== s3.length) {
    const dp = [[false]];
    steps.push({
      i: 0,
      j: 0,
      dp,
      char1: '',
      char2: '',
      char3: '',
      match1: false,
      match2: false,
      canInterleave: false,
      explanation: `Length mismatch: len(s1) [${m}] + len(s2) [${n}] != len(s3) [${s3.length}]. Impossible to interleave.`,
      codeLine: 2,
      variableBadges: [
        { name: 'len(s1)+len(s2)', value: `${m + n}` },
        { name: 'len(s3)', value: `${s3.length}` },
        { name: 'result', value: 'False' },
      ],
    });
    return steps;
  }

  const dp: boolean[][] = Array.from({ length: m + 1 }, () =>
    new Array(n + 1).fill(false)
  );
  dp[0][0] = true;

  steps.push({
    i: 0,
    j: 0,
    dp: dp.map((r) => [...r]),
    char1: '',
    char2: '',
    char3: '',
    match1: false,
    match2: false,
    canInterleave: true,
    explanation: `Initialize DP grid of size (${m + 1}) x (${n + 1}). dp[0][0] = True (empty prefixes trivially interleave to form empty s3).`,
    codeLine: 4,
    variableBadges: [{ name: 'dp[0][0]', value: 'True' }],
  });

  for (let i = 0; i <= m; i++) {
    for (let j = 0; j <= n; j++) {
      if (i === 0 && j === 0) continue;

      const targetChar = s3[i + j - 1];
      const c1 = i > 0 ? s1[i - 1] : '';
      const c2 = j > 0 ? s2[j - 1] : '';

      const match1 = i > 0 && c1 === targetChar && dp[i - 1][j];
      const match2 = j > 0 && c2 === targetChar && dp[i][j - 1];

      steps.push({
        i,
        j,
        dp: dp.map((r) => [...r]),
        char1: c1,
        char2: c2,
        char3: targetChar,
        match1,
        match2,
        canInterleave: dp[i][j],
        explanation: `Inspecting cell (${i}, ${j}) for s3[${i + j - 1}] ('${targetChar}'). Match s1[${i - 1}]? ${i > 0 && c1 === targetChar} (from top: ${i > 0 && dp[i - 1][j]}). Match s2[${j - 1}]? ${j > 0 && c2 === targetChar} (from left: ${j > 0 && dp[i][j - 1]}).`,
        codeLine: 6,
        variableBadges: [
          { name: 's3_char', value: `'${targetChar}'` },
          { name: 'from_s1', value: match1 ? 'Valid' : 'No' },
          { name: 'from_s2', value: match2 ? 'Valid' : 'No' },
        ],
      });

      if (match1 || match2) {
        dp[i][j] = true;
      }

      steps.push({
        i,
        j,
        dp: dp.map((r) => [...r]),
        char1: c1,
        char2: c2,
        char3: targetChar,
        match1,
        match2,
        canInterleave: dp[i][j],
        explanation: `dp[${i}][${j}] = ${dp[i][j] ? 'True' : 'False'}.`,
        codeLine: dp[i][j] ? 8 : 10,
        variableBadges: [
          { name: `dp[${i}][${j}]`, value: `${dp[i][j] ? 'True' : 'False'}` },
        ],
      });
    }
  }

  // Final step
  const finalResult = dp[m][n];
  steps.push({
    i: m,
    j: n,
    dp: dp.map((r) => [...r]),
    char1: '',
    char2: '',
    char3: '',
    match1: false,
    match2: false,
    canInterleave: finalResult,
    explanation: `Done! dp[${m}][${n}] = ${finalResult ? 'True' : 'False'}. "${s3}" ${finalResult ? 'IS' : 'IS NOT'} a valid interleaving of "${s1}" and "${s2}".`,
    codeLine: 11,
    variableBadges: [{ name: 'result', value: `${finalResult ? 'True' : 'False'}` }],
  });

  return steps;
}
