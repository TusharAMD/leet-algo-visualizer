export interface CharReplacementStep {
  stepIndex: number;
  totalSteps: number;
  rawStr: string;
  k: number;
  left: number;
  right: number;
  counts: Record<string, number>;
  maxFreq: number;
  windowLen: number;
  replacementsNeeded: number;
  isValid: boolean;
  longest: number;
  bestWindow: { left: number; right: number };
  headline: string;
  subtext: string;
  codeLine: number;
  variableBadges: { name: string; value: string }[];
  isComplete: boolean;
}

export const CHAR_REPLACEMENT_CODE_LINES = [
  'def characterReplacement(s, k):',
  '    count = {}',
  '    l = 0',
  '    max_f = 0',
  '    longest = 0',
  '    for r in range(len(s)):',
  '        count[s[r]] = count.get(s[r], 0) + 1',
  '        max_f = max(max_f, count[s[r]])    # Track dominant letter frequency',
  '        while (r - l + 1) - max_f > k:    # Too many replacements needed!',
  '            count[s[l]] -= 1',
  '            l += 1                        # Shrink window from left',
  '        longest = max(longest, r - l + 1)',
  '    return longest'
];

export function generateCharReplacementSteps(s: string, k: number): CharReplacementStep[] {
  const steps: CharReplacementStep[] = [];
  const count: Record<string, number> = {};
  let l = 0;
  let maxF = 0;
  let longest = 0;
  let bestWindow = { left: 0, right: 0 };

  // Step 0: Init
  steps.push({
    stepIndex: 0,
    totalSteps: 0,
    rawStr: s,
    k,
    left: 0,
    right: -1,
    counts: {},
    maxFreq: 0,
    windowLen: 0,
    replacementsNeeded: 0,
    isValid: true,
    longest: 0,
    bestWindow: { left: 0, right: 0 },
    headline: `Initialize Sliding Window: k = ${k}`,
    subtext: 'Window is valid if (length - max_f) <= k, meaning at most k characters need replacement.',
    codeLine: 1,
    variableBadges: [
      { name: 'k', value: `${k}` },
      { name: 's.length', value: `${s.length}` }
    ],
    isComplete: false
  });

  for (let r = 0; r < s.length; r++) {
    const charR = s[r];
    count[charR] = (count[charR] || 0) + 1;
    maxF = Math.max(maxF, count[charR]);
    let windowLen = r - l + 1;
    let needed = windowLen - maxF;

    // Step: Expand right
    steps.push({
      stepIndex: 0,
      totalSteps: 0,
      rawStr: s,
      k,
      left: l,
      right: r,
      counts: { ...count },
      maxFreq: maxF,
      windowLen,
      replacementsNeeded: needed,
      isValid: needed <= k,
      longest,
      bestWindow: { ...bestWindow },
      headline: `Expand Right: Include '${charR}' at idx ${r}`,
      subtext: `Window '${s.slice(l, r + 1)}' (len ${windowLen}). Max freq = ${maxF}. Replacements needed: ${windowLen} - ${maxF} = ${needed}.`,
      codeLine: 7,
      variableBadges: [
        { name: 'l', value: `${l}` },
        { name: 'r', value: `${r}` },
        { name: 'max_f', value: `${maxF}` },
        { name: 'needed', value: `${needed}` }
      ],
      isComplete: false
    });

    // While invalid, shrink left
    while (r - l + 1 - maxF > k) {
      const charL = s[l];
      count[charL] -= 1;
      l += 1;
      windowLen = r - l + 1;
      needed = windowLen - maxF;

      steps.push({
        stepIndex: 0,
        totalSteps: 0,
        rawStr: s,
        k,
        left: l,
        right: r,
        counts: { ...count },
        maxFreq: maxF,
        windowLen,
        replacementsNeeded: needed,
        isValid: needed <= k,
        longest,
        bestWindow: { ...bestWindow },
        headline: `Shrink Left: Dropped '${charL}' from idx ${l - 1}`,
        subtext: `Window required ${needed + 1} replacements > k (${k}). Contracted left pointer to ${l}.`,
        codeLine: 10,
        variableBadges: [
          { name: 'l', value: `${l}` },
          { name: 'r', value: `${r}` },
          { name: 'new len', value: `${windowLen}` }
        ],
        isComplete: false
      });
    }

    if (r - l + 1 > longest) {
      longest = r - l + 1;
      bestWindow = { left: l, right: r };
    }

    steps.push({
      stepIndex: 0,
      totalSteps: 0,
      rawStr: s,
      k,
      left: l,
      right: r,
      counts: { ...count },
      maxFreq: maxF,
      windowLen: r - l + 1,
      replacementsNeeded: r - l + 1 - maxF,
      isValid: true,
      longest,
      bestWindow: { ...bestWindow },
      headline: `Valid Window: '${s.slice(l, r + 1)}' (len ${r - l + 1})`,
      subtext: `Current max valid repeating length = ${longest}.`,
      codeLine: 11,
      variableBadges: [
        { name: 'longest', value: `${longest}` },
        { name: 'window', value: `'${s.slice(l, r + 1)}'` }
      ],
      isComplete: false
    });
  }

  // Completion step
  steps.push({
    stepIndex: 0,
    totalSteps: 0,
    rawStr: s,
    k,
    left: bestWindow.left,
    right: bestWindow.right,
    counts: { ...count },
    maxFreq: maxF,
    windowLen: longest,
    replacementsNeeded: longest - maxF,
    isValid: true,
    longest,
    bestWindow: { ...bestWindow },
    headline: `Complete! Longest Repeating Substring Length = ${longest}`,
    subtext: `Optimal window '${s.slice(bestWindow.left, bestWindow.right + 1)}' can be made fully uniform with at most ${k} replacements.`,
    codeLine: 12,
    variableBadges: [
      { name: 'result', value: `${longest}` },
      { name: 'best window', value: `[${bestWindow.left}, ${bestWindow.right}]` }
    ],
    isComplete: true
  });

  return steps.map((st, idx) => ({ ...st, stepIndex: idx, totalSteps: steps.length }));
}
