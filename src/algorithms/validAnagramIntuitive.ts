export interface ValidAnagramStep {
  stepIndex: number;
  totalSteps: number;
  s: string;
  t: string;
  phase: 'init' | 'count_s' | 'deduct_t' | 'complete';
  currChar: string | null;
  currIndex: number;
  activeString: 's' | 't' | null;
  counts: Record<string, number>;
  mismatchReason?: string;
  headline: string;
  subtext: string;
  codeLine: number;
  variableBadges: { name: string; value: string }[];
  isComplete: boolean;
  isAnagram: boolean;
}

export const VALID_ANAGRAM_CODE_LINES = [
  'def isAnagram(s, t):',
  '    if len(s) != len(t): return False',
  '    count = {}',
  '    for char in s:',
  '        count[char] = count.get(char, 0) + 1  # Add weight from s',
  '    for char in t:',
  '        if char not in count or count[char] == 0:',
  '            return False  # Unbalanced letter!',
  '        count[char] -= 1  # Deduct weight from t',
  '    return True           # Perfect zero-balance!'
];

export function generateValidAnagramSteps(s: string, t: string): ValidAnagramStep[] {
  const steps: ValidAnagramStep[] = [];

  // Step 0: Initial length check
  if (s.length !== t.length) {
    return [
      {
        stepIndex: 0,
        totalSteps: 1,
        s,
        t,
        phase: 'complete',
        currChar: null,
        currIndex: -1,
        activeString: null,
        counts: {},
        mismatchReason: `Length mismatch: len(s)=${s.length} vs len(t)=${t.length}`,
        headline: `❌ Length Mismatch: len("${s}") != len("${t}")`,
        subtext: 'Anagrams must have identical character lengths. Immediately return False.',
        codeLine: 1,
        variableBadges: [
          { name: 'len(s)', value: `${s.length}` },
          { name: 'len(t)', value: `${t.length}` },
          { name: 'return', value: 'False' }
        ],
        isComplete: true,
        isAnagram: false
      }
    ];
  }

  const counts: Record<string, number> = {};

  steps.push({
    stepIndex: 0,
    totalSteps: 0,
    s,
    t,
    phase: 'init',
    currChar: null,
    currIndex: -1,
    activeString: null,
    counts: {},
    headline: `Start Anagram Verification for "${s}" and "${t}" (Length: ${s.length})`,
    subtext: `Phase 1: Count letter frequencies in s. Phase 2: Deduct letters in t. All buckets must balance to zero.`,
    codeLine: 2,
    variableBadges: [
      { name: 'len', value: `${s.length}` },
      { name: 'counts', value: '{}' }
    ],
    isComplete: false,
    isAnagram: false
  });

  // Phase 1: Count chars in s
  for (let i = 0; i < s.length; i++) {
    const ch = s[i];
    counts[ch] = (counts[ch] || 0) + 1;

    steps.push({
      stepIndex: steps.length,
      totalSteps: 0,
      s,
      t,
      phase: 'count_s',
      currChar: ch,
      currIndex: i,
      activeString: 's',
      counts: { ...counts },
      headline: `Phase 1 (Count s): s[${i}] = '${ch}' ➔ count['${ch}'] = ${counts[ch]}`,
      subtext: `Incrementing frequency balance for '${ch}'.`,
      codeLine: 4,
      variableBadges: [
        { name: 'char', value: `'${ch}'` },
        { name: `count['${ch}']`, value: `${counts[ch]}` }
      ],
      isComplete: false,
      isAnagram: false
    });
  }

  // Phase 2: Deduct chars in t
  let failed = false;

  for (let i = 0; i < t.length; i++) {
    const ch = t[i];

    if (!counts[ch] || counts[ch] === 0) {
      steps.push({
        stepIndex: steps.length,
        totalSteps: 0,
        s,
        t,
        phase: 'complete',
        currChar: ch,
        currIndex: i,
        activeString: 't',
        counts: { ...counts },
        mismatchReason: !counts[ch] ? `Character '${ch}' does not exist in string s` : `Too many '${ch}' in string t`,
        headline: `❌ Balance Broken at t[${i}] = '${ch}': Extra or missing letter!`,
        subtext: `Cannot deduct '${ch}' because count is already 0. Return False.`,
        codeLine: 7,
        variableBadges: [
          { name: 'unbalanced_char', value: `'${ch}'` },
          { name: 'return', value: 'False' }
        ],
        isComplete: true,
        isAnagram: false
      });

      failed = true;
      break;
    }

    counts[ch]--;

    steps.push({
      stepIndex: steps.length,
      totalSteps: 0,
      s,
      t,
      phase: 'deduct_t',
      currChar: ch,
      currIndex: i,
      activeString: 't',
      counts: { ...counts },
      headline: `Phase 2 (Deduct t): t[${i}] = '${ch}' ➔ count['${ch}'] = ${counts[ch]}`,
      subtext: `Decremented '${ch}' toward zero balance.`,
      codeLine: 8,
      variableBadges: [
        { name: 'char', value: `'${ch}'` },
        { name: `count['${ch}']`, value: `${counts[ch]}` }
      ],
      isComplete: false,
      isAnagram: false
    });
  }

  if (!failed) {
    steps.push({
      stepIndex: steps.length,
      totalSteps: 0,
      s,
      t,
      phase: 'complete',
      currChar: null,
      currIndex: t.length - 1,
      activeString: null,
      counts: { ...counts },
      headline: `🎉 Perfect Zero Balance: "${s}" & "${t}" are Valid Anagrams!`,
      subtext: `All character counts returned exactly to zero in O(n) time and O(1) alphabet space.`,
      codeLine: 9,
      variableBadges: [
        { name: 'return', value: 'True' },
        { name: 'time', value: 'O(n)' },
        { name: 'space', value: 'O(1) [26 chars]' }
      ],
      isComplete: true,
      isAnagram: true
    });
  }

  const total = steps.length;
  steps.forEach((s) => (s.totalSteps = total));
  return steps;
}
