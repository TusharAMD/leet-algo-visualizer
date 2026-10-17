export interface EditDistanceStep {
  i: number;
  j: number;
  dp: number[][];
  char1: string;
  char2: string;
  isMatch: boolean;
  insertCost: number;
  deleteCost: number;
  replaceCost: number;
  chosenOp: 'match' | 'insert' | 'delete' | 'replace' | 'base';
  explanation: string;
  codeLine: number;
  variableBadges?: { name: string; value: string }[];
}

export const EDIT_DISTANCE_CODE_LINES = [
  'def minDistance(word1: str, word2: str) -> int:',
  '    dp = [[0] * (len(word2) + 1) for _ in range(len(word1) + 1)]',
  '    for i in range(len(word1) + 1): dp[i][0] = i',
  '    for j in range(len(word2) + 1): dp[0][j] = j',
  '    for i in range(1, len(word1) + 1):',
  '        for j in range(1, len(word2) + 1):',
  '            if word1[i - 1] == word2[j - 1]:',
  '                dp[i][j] = dp[i - 1][j - 1]',
  '            else:',
  '                dp[i][j] = 1 + min(dp[i - 1][j], dp[i][j - 1], dp[i - 1][j - 1])',
  '    return dp[len(word1)][len(word2)]',
];

export function generateEditDistanceSteps(
  word1: string,
  word2: string
): EditDistanceStep[] {
  const steps: EditDistanceStep[] = [];
  const m = word1.length;
  const n = word2.length;

  const dp: number[][] = Array.from({ length: m + 1 }, () =>
    new Array(n + 1).fill(0)
  );

  for (let i = 0; i <= m; i++) dp[i][0] = i;
  for (let j = 0; j <= n; j++) dp[0][j] = j;

  steps.push({
    i: 0,
    j: 0,
    dp: dp.map((r) => [...r]),
    char1: '',
    char2: '',
    isMatch: false,
    insertCost: 0,
    deleteCost: 0,
    replaceCost: 0,
    chosenOp: 'base',
    explanation: `Initialize DP table. Base cases: dp[i][0] = i (delete all i chars to reach empty string), dp[0][j] = j (insert j chars from empty string).`,
    codeLine: 3,
    variableBadges: [
      { name: 'len(word1)', value: `${m}` },
      { name: 'len(word2)', value: `${n}` },
    ],
  });

  for (let i = 1; i <= m; i++) {
    for (let j = 1; j <= n; j++) {
      const c1 = word1[i - 1];
      const c2 = word2[j - 1];
      const match = c1 === c2;

      const del = dp[i - 1][j];
      const ins = dp[i][j - 1];
      const rep = dp[i - 1][j - 1];

      let op: 'match' | 'insert' | 'delete' | 'replace' = 'match';
      if (match) {
        op = 'match';
      } else {
        const minVal = Math.min(del, ins, rep);
        if (minVal === rep) op = 'replace';
        else if (minVal === del) op = 'delete';
        else op = 'insert';
      }

      steps.push({
        i,
        j,
        dp: dp.map((r) => [...r]),
        char1: c1,
        char2: c2,
        isMatch: match,
        insertCost: ins,
        deleteCost: del,
        replaceCost: rep,
        chosenOp: op,
        explanation: `Comparing word1[${i - 1}] ('${c1}') with word2[${j - 1}] ('${c2}'). ${
          match
            ? `Same character! No edit operation needed (inherit diagonal dp[${i - 1}][${j - 1}] = ${rep}).`
            : `Mismatch. 1 + min(delete=${del}, insert=${ins}, replace=${rep}) = 1 + ${Math.min(del, ins, rep)}.`
        }`,
        codeLine: 6,
        variableBadges: [
          { name: 'c1', value: `'${c1}'` },
          { name: 'c2', value: `'${c2}'` },
          { name: 'min_op', value: match ? 'None (match)' : op },
        ],
      });

      if (match) {
        dp[i][j] = rep;
      } else {
        dp[i][j] = 1 + Math.min(del, ins, rep);
      }

      steps.push({
        i,
        j,
        dp: dp.map((r) => [...r]),
        char1: c1,
        char2: c2,
        isMatch: match,
        insertCost: ins,
        deleteCost: del,
        replaceCost: rep,
        chosenOp: op,
        explanation: `dp[${i}][${j}] = ${dp[i][j]}.`,
        codeLine: match ? 7 : 9,
        variableBadges: [
          { name: `dp[${i}][${j}]`, value: `${dp[i][j]}` },
        ],
      });
    }
  }

  // Final step
  const finalDistance = dp[m][n];
  steps.push({
    i: m,
    j: n,
    dp: dp.map((r) => [...r]),
    char1: '',
    char2: '',
    isMatch: true,
    insertCost: 0,
    deleteCost: 0,
    replaceCost: 0,
    chosenOp: 'base',
    explanation: `Done! Minimum edit distance to convert "${word1}" to "${word2}" is ${finalDistance}.`,
    codeLine: 10,
    variableBadges: [{ name: 'min_distance', value: `${finalDistance}` }],
  });

  return steps;
}
