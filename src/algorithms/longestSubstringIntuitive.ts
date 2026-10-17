export interface SubstringStep {
  stepIndex: number;
  totalSteps: number;
  leftIndex: number;
  rightIndex: number;
  currentChar: string;
  duplicateChar: string | null;
  duplicatePrevIndex: number | null;
  currentWindowStr: string;
  currentWindowLen: number;
  maxLen: number;
  bestWindowStart: number;
  bestWindowEnd: number;
  seenMap: { [char: string]: number }; // char -> last seen index
  action: 'expand' | 'shrink_jump' | 'match';
  headline: string;
  subtext: string;
  codeLine: number;
  variableBadges: { name: string; value: string }[];
  isComplete: boolean;
}

export const SUBSTRING_CODE_LINES = [
  'def lengthOfLongestSubstring(s):',
  '    seen = {}',
  '    left = 0',
  '    max_len = 0',
  '    for right, char in enumerate(s):',
  '        if char in seen and seen[char] >= left:',
  '            left = seen[char] + 1  # Jump left past duplicate',
  '        seen[char] = right',
  '        max_len = max(max_len, right - left + 1)',
  '    return max_len'
];

export function generateSubstringSteps(s: string): SubstringStep[] {
  const steps: SubstringStep[] = [];
  const n = s.length;

  if (n === 0) {
    return [
      {
        stepIndex: 0,
        totalSteps: 1,
        leftIndex: 0,
        rightIndex: 0,
        currentChar: '',
        duplicateChar: null,
        duplicatePrevIndex: null,
        currentWindowStr: '',
        currentWindowLen: 0,
        maxLen: 0,
        bestWindowStart: 0,
        bestWindowEnd: 0,
        seenMap: {},
        action: 'match',
        headline: 'Empty String: Length is 0',
        subtext: 'An empty string contains 0 characters.',
        codeLine: 1,
        variableBadges: [{ name: 'max_len', value: '0' }],
        isComplete: true
      }
    ];
  }

  const seen: { [char: string]: number } = {};
  let left = 0;
  let maxLen = 0;
  let bestStart = 0;
  let bestEnd = 0;

  // Step 0: Initialize
  steps.push({
    stepIndex: 0,
    totalSteps: 0,
    leftIndex: 0,
    rightIndex: 0,
    currentChar: s[0],
    duplicateChar: null,
    duplicatePrevIndex: null,
    currentWindowStr: s[0],
    currentWindowLen: 1,
    maxLen: 0,
    bestWindowStart: 0,
    bestWindowEnd: 0,
    seenMap: {},
    action: 'expand',
    headline: 'Initialize: Elastic Window [left=0, right=0]',
    subtext: 'We expand the right pointer to include characters, and jump the left pointer whenever a duplicate appears.',
    codeLine: 2,
    variableBadges: [
      { name: 'left', value: '0' },
      { name: 'right', value: '0' },
      { name: 'max_len', value: '0' }
    ],
    isComplete: false
  });

  for (let right = 0; right < n; right++) {
    const char = s[right];
    let isDuplicateInWindow = false;
    let prevIdx: number | null = null;

    if (char in seen && seen[char] >= left) {
      isDuplicateInWindow = true;
      prevIdx = seen[char];
      const oldLeft = left;
      left = seen[char] + 1;

      steps.push({
        stepIndex: steps.length,
        totalSteps: 0,
        leftIndex: left,
        rightIndex: right,
        currentChar: char,
        duplicateChar: char,
        duplicatePrevIndex: prevIdx,
        currentWindowStr: s.slice(left, right + 1),
        currentWindowLen: right - left + 1,
        maxLen,
        bestWindowStart: bestStart,
        bestWindowEnd: bestEnd,
        seenMap: { ...seen },
        action: 'shrink_jump',
        headline: `⚠️ Duplicate '${char}' detected at Index ${right}! (Previously at Index ${prevIdx})`,
        subtext: `To keep all characters unique, Left pointer jumps past the previous '${char}': from ${oldLeft} ➔ ${left}.`,
        codeLine: 6,
        variableBadges: [
          { name: 'duplicate', value: `'${char}' (at ${prevIdx})` },
          { name: 'left jump', value: `${left}` },
          { name: 'new window', value: `"${s.slice(left, right + 1)}"` }
        ],
        isComplete: false
      });
    }

    seen[char] = right;
    const windowLen = right - left + 1;
    const isRecord = windowLen > maxLen;

    if (isRecord) {
      maxLen = windowLen;
      bestStart = left;
      bestEnd = right;
    }

    steps.push({
      stepIndex: steps.length,
      totalSteps: 0,
      leftIndex: left,
      rightIndex: right,
      currentChar: char,
      duplicateChar: isDuplicateInWindow ? char : null,
      duplicatePrevIndex: prevIdx,
      currentWindowStr: s.slice(left, right + 1),
      currentWindowLen: windowLen,
      maxLen,
      bestWindowStart: bestStart,
      bestWindowEnd: bestEnd,
      seenMap: { ...seen },
      action: 'expand',
      headline: isRecord
        ? `🌟 New Longest Unique Substring! "${s.slice(left, right + 1)}" (Length ${windowLen})`
        : `Expanded Window to Index ${right} ('${char}'). Current window: "${s.slice(left, right + 1)}" (Length ${windowLen})`,
      subtext: `Saved '${char}' ➔ index ${right} in seen hash map. All characters in current window [${left}..${right}] are strictly unique.`,
      codeLine: 8,
      variableBadges: [
        { name: 'window', value: `"${s.slice(left, right + 1)}"` },
        { name: 'length', value: `${windowLen}` },
        { name: 'max_len', value: `${maxLen}` }
      ],
      isComplete: false
    });
  }

  // Final Step
  steps.push({
    stepIndex: steps.length,
    totalSteps: 0,
    leftIndex: bestStart,
    rightIndex: bestEnd,
    currentChar: s[bestEnd],
    duplicateChar: null,
    duplicatePrevIndex: null,
    currentWindowStr: s.slice(bestStart, bestEnd + 1),
    currentWindowLen: maxLen,
    maxLen,
    bestWindowStart: bestStart,
    bestWindowEnd: bestEnd,
    seenMap: { ...seen },
    action: 'match',
    headline: `🎉 Complete: Longest Substring Without Repeating Characters has Length ${maxLen}!`,
    subtext: `Longest unique substring is "${s.slice(bestStart, bestEnd + 1)}" from index ${bestStart} to ${bestEnd}. Time complexity O(n).`,
    codeLine: 9,
    variableBadges: [
      { name: 'return max_len', value: `${maxLen}` },
      { name: 'substring', value: `"${s.slice(bestStart, bestEnd + 1)}"` },
      { name: 'time complexity', value: 'O(n)' }
    ],
    isComplete: true
  });

  const total = steps.length;
  steps.forEach((s) => (s.totalSteps = total));
  return steps;
}
