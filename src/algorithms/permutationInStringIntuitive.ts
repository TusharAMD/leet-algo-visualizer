export interface PermutationInStringStep {
  stepIndex: number;
  totalSteps: number;
  s1: string;
  s2: string;
  windowLeft: number;
  windowRight: number;
  s1Counts: Record<string, number>;
  windowCounts: Record<string, number>;
  isMatch: boolean;
  matchScore: number;
  totalUniqueChars: number;
  foundIndex: number | null;
  headline: string;
  subtext: string;
  codeLine: number;
  variableBadges: { name: string; value: string }[];
  isComplete: boolean;
}

export const PERMUTATION_STRING_CODE_LINES = [
  'def checkInclusion(s1, s2):',
  '    if len(s1) > len(s2): return False',
  '    s1_count = Counter(s1)              # 1. Target signature template',
  '    window_count = Counter(s2[:len(s1)]) # 2. First fixed-size window',
  '    if s1_count == window_count: return True',
  '    for i in range(len(s1), len(s2)):   # 3. Slide fixed window by 1',
  '        window_count[s2[i]] += 1         # Add incoming character',
  '        window_count[s2[i - len(s1)]] -= 1 # Drop outgoing character',
  '        if window_count == s1_count:',
  '            return True                 # Permutation match found!',
  '    return False'
];

export function generatePermutationInStringSteps(s1: string, s2: string): PermutationInStringStep[] {
  const steps: PermutationInStringStep[] = [];
  const k = s1.length;

  const s1Counts: Record<string, number> = {};
  for (const ch of s1) {
    s1Counts[ch] = (s1Counts[ch] || 0) + 1;
  }
  const uniqueChars = Object.keys(s1Counts);

  if (s1.length > s2.length) {
    steps.push({
      stepIndex: 0,
      totalSteps: 1,
      s1,
      s2,
      windowLeft: 0,
      windowRight: -1,
      s1Counts,
      windowCounts: {},
      isMatch: false,
      matchScore: 0,
      totalUniqueChars: uniqueChars.length,
      foundIndex: null,
      headline: `Invalid: len(s1) = ${s1.length} > len(s2) = ${s2.length}`,
      subtext: 's1 is longer than s2, so s2 cannot contain a permutation of s1.',
      codeLine: 2,
      variableBadges: [{ name: 'result', value: 'False' }],
      isComplete: true
    });
    return steps;
  }

  // Initial window
  const windowCounts: Record<string, number> = {};
  for (let i = 0; i < k; i++) {
    const ch = s2[i];
    windowCounts[ch] = (windowCounts[ch] || 0) + 1;
  }

  function checkMatch(w: Record<string, number>): boolean {
    for (const ch of Object.keys(s1Counts)) {
      if ((w[ch] || 0) !== s1Counts[ch]) return false;
    }
    for (const ch of Object.keys(w)) {
      if ((w[ch] || 0) > 0 && (s1Counts[ch] || 0) !== w[ch]) return false;
    }
    return true;
  }

  function getMatchScore(w: Record<string, number>): number {
    let score = 0;
    for (const ch of uniqueChars) {
      if ((w[ch] || 0) === s1Counts[ch]) score++;
    }
    return score;
  }

  const initialMatch = checkMatch(windowCounts);

  steps.push({
    stepIndex: 0,
    totalSteps: 0,
    s1,
    s2,
    windowLeft: 0,
    windowRight: k - 1,
    s1Counts: { ...s1Counts },
    windowCounts: { ...windowCounts },
    isMatch: initialMatch,
    matchScore: getMatchScore(windowCounts),
    totalUniqueChars: uniqueChars.length,
    foundIndex: initialMatch ? 0 : null,
    headline: `Initialize Fixed Window [0..${k - 1}] in s2`,
    subtext: `Target s1 signature: {${Object.entries(s1Counts).map(([c, n]) => `${c}:${n}`).join(', ')}}.`,
    codeLine: 4,
    variableBadges: [
      { name: 'window', value: `'${s2.slice(0, k)}'` },
      { name: 'match', value: initialMatch ? 'True' : 'False' }
    ],
    isComplete: initialMatch
  });

  if (initialMatch) {
    return steps.map((st, idx) => ({ ...st, stepIndex: idx, totalSteps: steps.length }));
  }

  for (let i = k; i < s2.length; i++) {
    const inChar = s2[i];
    const outChar = s2[i - k];

    windowCounts[inChar] = (windowCounts[inChar] || 0) + 1;
    windowCounts[outChar] -= 1;
    if (windowCounts[outChar] === 0) {
      delete windowCounts[outChar];
    }

    const curL = i - k + 1;
    const curR = i;
    const matched = checkMatch(windowCounts);

    steps.push({
      stepIndex: 0,
      totalSteps: 0,
      s1,
      s2,
      windowLeft: curL,
      windowRight: curR,
      s1Counts: { ...s1Counts },
      windowCounts: { ...windowCounts },
      isMatch: matched,
      matchScore: getMatchScore(windowCounts),
      totalUniqueChars: uniqueChars.length,
      foundIndex: matched ? curL : null,
      headline: matched
        ? `Match Found at index [${curL}..${curR}]!`
        : `Slide Window: Dropped '${outChar}', Added '${inChar}'`,
      subtext: matched
        ? `Substring '${s2.slice(curL, curR + 1)}' is a valid anagram permutation of '${s1}'!`
        : `Inspecting window '${s2.slice(curL, curR + 1)}'. Target counts not yet fully matched.`,
      codeLine: matched ? 10 : 8,
      variableBadges: [
        { name: 'l', value: `${curL}` },
        { name: 'r', value: `${curR}` },
        { name: 'window', value: `'${s2.slice(curL, curR + 1)}'` },
        { name: 'is_match', value: matched ? 'True' : 'False' }
      ],
      isComplete: matched
    });

    if (matched) {
      return steps.map((st, idx) => ({ ...st, stepIndex: idx, totalSteps: steps.length }));
    }
  }

  // Not found step
  steps.push({
    stepIndex: 0,
    totalSteps: 0,
    s1,
    s2,
    windowLeft: s2.length - k,
    windowRight: s2.length - 1,
    s1Counts: { ...s1Counts },
    windowCounts: { ...windowCounts },
    isMatch: false,
    matchScore: getMatchScore(windowCounts),
    totalUniqueChars: uniqueChars.length,
    foundIndex: null,
    headline: 'No Permutation Found: Return False',
    subtext: `Swept entire string s2 with fixed window size ${k}. No matching permutation of '${s1}' exists.`,
    codeLine: 11,
    variableBadges: [{ name: 'result', value: 'False' }],
    isComplete: true
  });

  return steps.map((st, idx) => ({ ...st, stepIndex: idx, totalSteps: steps.length }));
}
