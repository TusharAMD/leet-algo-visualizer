export interface MinWindowSubstringStep {
  stepIndex: number;
  totalSteps: number;
  s: string;
  t: string;
  left: number;
  right: number;
  windowCounts: Record<string, number>;
  targetCounts: Record<string, number>;
  have: number;
  need: number;
  minLen: number;
  bestWindow: [number, number];
  action: 'EXPAND' | 'SHRINK' | 'NEW_MIN' | 'INIT' | 'COMPLETE';
  headline: string;
  subtext: string;
  codeLine: number;
  variableBadges: { name: string; value: string }[];
  isComplete: boolean;
}

export const MIN_WINDOW_CODE_LINES = [
  'def minWindow(s, t):',
  '    if not t or not s: return ""',
  '    count_t, window = Counter(t), {}',
  '    have, need = 0, len(count_t)',
  '    res, res_len = [-1, -1], float("inf")',
  '    l = 0',
  '    for r in range(len(s)):',
  '        c = s[r]; window[c] = window.get(c, 0) + 1',
  '        if c in count_t and window[c] == count_t[c]: have += 1',
  '        while have == need:                # All characters satisfied!',
  '            if (r - l + 1) < res_len:      # Record new minimum window',
  '                res, res_len = [l, r], (r - l + 1)',
  '            window[s[l]] -= 1',
  '            if s[l] in count_t and window[s[l]] < count_t[s[l]]: have -= 1',
  '            l += 1                         # Shrink to minimize',
  '    l, r = res',
  '    return s[l : r + 1] if res_len != float("inf") else ""'
];

export function generateMinWindowSubstringSteps(s: string, t: string): MinWindowSubstringStep[] {
  const steps: MinWindowSubstringStep[] = [];
  const targetCounts: Record<string, number> = {};
  for (const ch of t) {
    targetCounts[ch] = (targetCounts[ch] || 0) + 1;
  }
  const need = Object.keys(targetCounts).length;
  const windowCounts: Record<string, number> = {};
  let have = 0;
  let minLen = Infinity;
  let bestWindow: [number, number] = [-1, -1];
  let l = 0;

  // Step 0: Init
  steps.push({
    stepIndex: 0,
    totalSteps: 0,
    s,
    t,
    left: 0,
    right: -1,
    windowCounts: {},
    targetCounts: { ...targetCounts },
    have: 0,
    need,
    minLen: Infinity,
    bestWindow: [-1, -1],
    action: 'INIT',
    headline: `Initialize Minimum Window: Target '${t}'`,
    subtext: `Need to satisfy ${need} unique characters: {${Object.entries(targetCounts).map(([c, n]) => `${c}:${n}`).join(', ')}}.`,
    codeLine: 4,
    variableBadges: [
      { name: 'have', value: '0' },
      { name: 'need', value: `${need}` }
    ],
    isComplete: false
  });

  for (let r = 0; r < s.length; r++) {
    const c = s[r];
    windowCounts[c] = (windowCounts[c] || 0) + 1;

    if (targetCounts[c] && windowCounts[c] === targetCounts[c]) {
      have += 1;
    }

    steps.push({
      stepIndex: 0,
      totalSteps: 0,
      s,
      t,
      left: l,
      right: r,
      windowCounts: { ...windowCounts },
      targetCounts: { ...targetCounts },
      have,
      need,
      minLen,
      bestWindow: [...bestWindow] as [number, number],
      action: 'EXPAND',
      headline: `Expand Right: Added '${c}' at index ${r}`,
      subtext: `Window '${s.slice(l, r + 1)}'. Target satisfaction: have = ${have}/${need}.`,
      codeLine: 9,
      variableBadges: [
        { name: 'l', value: `${l}` },
        { name: 'r', value: `${r}` },
        { name: 'have', value: `${have}/${need}` }
      ],
      isComplete: false
    });

    // While satisfied, shrink left
    while (have === need) {
      const curLen = r - l + 1;
      if (curLen < minLen) {
        minLen = curLen;
        bestWindow = [l, r];

        steps.push({
          stepIndex: 0,
          totalSteps: 0,
          s,
          t,
          left: l,
          right: r,
          windowCounts: { ...windowCounts },
          targetCounts: { ...targetCounts },
          have,
          need,
          minLen,
          bestWindow: [...bestWindow] as [number, number],
          action: 'NEW_MIN',
          headline: `New Minimum Window Recorded: '${s.slice(l, r + 1)}' (len ${minLen})`,
          subtext: `All characters in target '${t}' are satisfied! Trying to shrink from left...`,
          codeLine: 12,
          variableBadges: [
            { name: 'minLen', value: `${minLen}` },
            { name: 'window', value: `'${s.slice(l, r + 1)}'` }
          ],
          isComplete: false
        });
      }

      const leftChar = s[l];
      windowCounts[leftChar] -= 1;
      if (targetCounts[leftChar] && windowCounts[leftChar] < targetCounts[leftChar]) {
        have -= 1;
      }

      l += 1;

      steps.push({
        stepIndex: 0,
        totalSteps: 0,
        s,
        t,
        left: l,
        right: r,
        windowCounts: { ...windowCounts },
        targetCounts: { ...targetCounts },
        have,
        need,
        minLen,
        bestWindow: [...bestWindow] as [number, number],
        action: 'SHRINK',
        headline: `Shrink Left: Contracted past '${leftChar}'`,
        subtext: have < need
          ? `Dropped required char '${leftChar}'. have reduced to ${have}/${need}. Window no longer satisfied, expanding right!`
          : `Window still satisfied (${have}/${need}) after removing '${leftChar}'. Continuing contraction.`,
        codeLine: 15,
        variableBadges: [
          { name: 'l', value: `${l}` },
          { name: 'have', value: `${have}/${need}` }
        ],
        isComplete: false
      });
    }
  }

  // Complete step
  const finalSub = minLen !== Infinity ? s.slice(bestWindow[0], bestWindow[1] + 1) : '';
  steps.push({
    stepIndex: 0,
    totalSteps: 0,
    s,
    t,
    left: bestWindow[0],
    right: bestWindow[1],
    windowCounts: { ...windowCounts },
    targetCounts: { ...targetCounts },
    have,
    need,
    minLen: minLen !== Infinity ? minLen : 0,
    bestWindow: [...bestWindow] as [number, number],
    action: 'COMPLETE',
    headline: minLen !== Infinity
      ? `Minimum Window Substring Found: "${finalSub}"`
      : 'No Valid Window Found: Return ""',
    subtext: minLen !== Infinity
      ? `Shortest substring containing all characters of '${t}' has length ${minLen} at [${bestWindow[0]}..${bestWindow[1]}].`
      : `String s does not contain all letters of t.`,
    codeLine: 17,
    variableBadges: [
      { name: 'result', value: `"${finalSub}"` },
      { name: 'len', value: `${minLen !== Infinity ? minLen : 0}` }
    ],
    isComplete: true
  });

  return steps.map((st, idx) => ({ ...st, stepIndex: idx, totalSteps: steps.length }));
}
