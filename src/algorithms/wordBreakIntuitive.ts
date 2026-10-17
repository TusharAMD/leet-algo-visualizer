export interface WordBreakStep {
  i: number;
  currentWord: string;
  matchedWord: string | null;
  dp: boolean[];
  checkSubstring: string;
  substringRange: [number, number]; // [start, end)
  isMatch: boolean;
  explanation: string;
  codeLine: number;
  variableBadges?: { name: string; value: string }[];
}

export const WORD_BREAK_CODE_LINES = [
  'def wordBreak(s: str, wordDict: List[str]) -> bool:',
  '    dp = [False] * (len(s) + 1)',
  '    dp[0] = True',
  '    for i in range(1, len(s) + 1):',
  '        for w in wordDict:',
  '            if i >= len(w) and dp[i - len(w)] and s[i - len(w) : i] == w:',
  '                dp[i] = True',
  '                break',
  '    return dp[len(s)]',
];

export function generateWordBreakSteps(s: string, wordDict: string[]): WordBreakStep[] {
  const steps: WordBreakStep[] = [];
  const n = s.length;
  const dp: boolean[] = new Array(n + 1).fill(false);
  dp[0] = true;

  steps.push({
    i: 0,
    currentWord: '',
    matchedWord: null,
    dp: [...dp],
    checkSubstring: '',
    substringRange: [0, 0],
    isMatch: false,
    explanation: `Initialize dp array of size ${n + 1} with False. Base case: dp[0] = True (empty string is trivially segmentable).`,
    codeLine: 2,
    variableBadges: [{ name: 'dp[0]', value: 'True' }],
  });

  for (let i = 1; i <= n; i++) {
    let matchedForI: string | null = null;

    for (const w of wordDict) {
      const lenW = w.length;
      if (i >= lenW) {
        const start = i - lenW;
        const sub = s.substring(start, i);
        const prevDp = dp[start];
        const stringMatches = sub === w;

        steps.push({
          i,
          currentWord: w,
          matchedWord: null,
          dp: [...dp],
          checkSubstring: sub,
          substringRange: [start, i],
          isMatch: stringMatches && prevDp,
          explanation: `Checking prefix length ${i} with word "${w}": sub = s[${start}:${i}] ("${sub}"), dp[${start}] = ${prevDp}. Match? ${stringMatches && prevDp ? 'Yes!' : 'No'}`,
          codeLine: 5,
          variableBadges: [
            { name: 'i', value: `${i}` },
            { name: 'word', value: `"${w}"` },
            { name: `dp[${start}]`, value: `${prevDp}` },
          ],
        });

        if (prevDp && stringMatches) {
          dp[i] = true;
          matchedForI = w;
          steps.push({
            i,
            currentWord: w,
            matchedWord: w,
            dp: [...dp],
            checkSubstring: sub,
            substringRange: [start, i],
            isMatch: true,
            explanation: `Found valid match: dp[${start}] is True and "${sub}" == "${w}". Therefore dp[${i}] = True! Moving to next index.`,
            codeLine: 6,
            variableBadges: [
              { name: 'matched', value: `"${w}"` },
              { name: `dp[${i}]`, value: 'True' },
            ],
          });
          break;
        }
      }
    }

    if (!matchedForI && !dp[i]) {
      steps.push({
        i,
        currentWord: '',
        matchedWord: null,
        dp: [...dp],
        checkSubstring: '',
        substringRange: [0, 0],
        isMatch: false,
        explanation: `No dictionary word can complete a valid segmentation ending at index ${i}. dp[${i}] remains False.`,
        codeLine: 3,
        variableBadges: [
          { name: 'i', value: `${i}` },
          { name: `dp[${i}]`, value: 'False' },
        ],
      });
    }
  }

  // Final step
  steps.push({
    i: n,
    currentWord: '',
    matchedWord: null,
    dp: [...dp],
    checkSubstring: '',
    substringRange: [0, 0],
    isMatch: dp[n],
    explanation: `Completed check! dp[${n}] = ${dp[n]}. String "${s}" ${dp[n] ? 'CAN' : 'CANNOT'} be segmented using the dictionary.`,
    codeLine: 8,
    variableBadges: [{ name: `result`, value: `${dp[n] ? 'True' : 'False'}` }],
  });

  return steps;
}
