export interface RegexStep {
  i: number;
  j: number;
  dp: boolean[][];
  charS: string;
  charP: string;
  isMatch: boolean;
  starZeroMatch: boolean;
  starOneMatch: boolean;
  explanation: string;
  codeLine: number;
  variableBadges?: { name: string; value: string }[];
}

export const REGEX_CODE_LINES = [
  'def isMatch(s: str, p: str) -> bool:',
  '    dp = [[False] * (len(p) + 1) for _ in range(len(s) + 1)]',
  '    dp[0][0] = True',
  '    for j in range(2, len(p) + 1):',
  '        if p[j - 1] == "*": dp[0][j] = dp[0][j - 2]',
  '    for i in range(1, len(s) + 1):',
  '        for j in range(1, len(p) + 1):',
  '            if p[j - 1] == "*":',
  '                dp[i][j] = dp[i][j - 2]',
  '                if p[j - 2] == s[i - 1] or p[j - 2] == ".":',
  '                    dp[i][j] = dp[i][j] or dp[i - 1][j]',
  '            elif p[j - 1] == "." or p[j - 1] == s[i - 1]:',
  '                dp[i][j] = dp[i - 1][j - 1]',
  '    return dp[len(s)][len(p)]',
];

export function generateRegexSteps(s: string, p: string): RegexStep[] {
  const steps: RegexStep[] = [];
  const m = s.length;
  const n = p.length;

  const dp: boolean[][] = Array.from({ length: m + 1 }, () =>
    new Array(n + 1).fill(false)
  );
  dp[0][0] = true;

  // Initialize empty s against patterns like a*, a*b*, etc.
  for (let j = 2; j <= n; j++) {
    if (p[j - 1] === '*') {
      dp[0][j] = dp[0][j - 2];
    }
  }

  steps.push({
    i: 0,
    j: 0,
    dp: dp.map((r) => [...r]),
    charS: '',
    charP: '',
    isMatch: true,
    starZeroMatch: false,
    starOneMatch: false,
    explanation: `Initialize DP grid (${m + 1}) x (${n + 1}). dp[0][0] = True. Star patterns against empty string resolved (e.g. "a*" matches "" with zero count).`,
    codeLine: 4,
    variableBadges: [
      { name: 'len(s)', value: `${m}` },
      { name: 'len(p)', value: `${n}` },
      { name: 'dp[0][0]', value: 'True' },
    ],
  });

  for (let i = 1; i <= m; i++) {
    for (let j = 1; j <= n; j++) {
      const charS = s[i - 1];
      const charP = p[j - 1];

      let starZero = false;
      let starOne = false;

      if (charP === '*') {
        starZero = dp[i][j - 2] || false;
        const prevP = p[j - 2];
        const canExtend = prevP === charS || prevP === '.';
        starOne = canExtend && dp[i - 1][j];

        steps.push({
          i,
          j,
          dp: dp.map((r) => [...r]),
          charS,
          charP,
          isMatch: dp[i][j],
          starZeroMatch: starZero,
          starOneMatch: starOne,
          explanation: `Pattern has '*': evaluate '${p[j - 2]}*'. Zero occurrences: dp[${i}][${j - 2}] (${starZero}). One+ occurrences: match '${prevP}' with '${charS}'? ${canExtend} (from top dp[${i - 1}][${j}] = ${dp[i - 1][j]}).`,
          codeLine: 8,
          variableBadges: [
            { name: 'p[j-1]', value: `'*'` },
            { name: 's[i-1]', value: `'${charS}'` },
            { name: 'zero_count', value: starZero ? 'Valid' : 'No' },
            { name: 'repeat_count', value: starOne ? 'Valid' : 'No' },
          ],
        });

        dp[i][j] = starZero || starOne;
      } else if (charP === '.' || charP === charS) {
        const diag = dp[i - 1][j - 1];

        steps.push({
          i,
          j,
          dp: dp.map((r) => [...r]),
          charS,
          charP,
          isMatch: dp[i][j],
          starZeroMatch: false,
          starOneMatch: false,
          explanation: `Char '${charP}' matches '${charS}' (via ${charP === '.' ? 'wildcard .' : 'exact match'}). Taking diagonal dp[${i - 1}][${j - 1}] (${diag}).`,
          codeLine: 12,
          variableBadges: [
            { name: 'p[j-1]', value: `'${charP}'` },
            { name: 's[i-1]', value: `'${charS}'` },
            { name: 'diag', value: diag ? 'True' : 'False' },
          ],
        });

        dp[i][j] = diag;
      } else {
        steps.push({
          i,
          j,
          dp: dp.map((r) => [...r]),
          charS,
          charP,
          isMatch: false,
          starZeroMatch: false,
          starOneMatch: false,
          explanation: `Mismatch: p[${j - 1}] ('${charP}') != s[${i - 1}] ('${charS}'). dp[${i}][${j}] = False.`,
          codeLine: 12,
          variableBadges: [
            { name: 'p[j-1]', value: `'${charP}'` },
            { name: 's[i-1]', value: `'${charS}'` },
          ],
        });

        dp[i][j] = false;
      }

      steps.push({
        i,
        j,
        dp: dp.map((r) => [...r]),
        charS,
        charP,
        isMatch: dp[i][j],
        starZeroMatch: starZero,
        starOneMatch: starOne,
        explanation: `dp[${i}][${j}] = ${dp[i][j] ? 'True' : 'False'}.`,
        codeLine: charP === '*' ? 10 : 13,
        variableBadges: [
          { name: `dp[${i}][${j}]`, value: `${dp[i][j] ? 'True' : 'False'}` },
        ],
      });
    }
  }

  // Final step
  const finalMatch = dp[m][n];
  steps.push({
    i: m,
    j: n,
    dp: dp.map((r) => [...r]),
    charS: '',
    charP: '',
    isMatch: finalMatch,
    starZeroMatch: false,
    starOneMatch: false,
    explanation: `Done! dp[${m}][${n}] = ${finalMatch ? 'True' : 'False'}. String "${s}" ${finalMatch ? 'MATCHES' : 'DOES NOT MATCH'} pattern "${p}".`,
    codeLine: 14,
    variableBadges: [{ name: 'result', value: `${finalMatch ? 'True' : 'False'}` }],
  });

  return steps;
}
