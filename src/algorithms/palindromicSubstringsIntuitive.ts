export interface PalindromicSubstringsStep {
  currentCenter: number;
  centerType: 'odd' | 'even';
  left: number;
  right: number;
  match: boolean;
  totalCount: number;
  foundPalindromes: string[];
  activeSubstring: string;
  explanation: string;
  highlightedIndices: number[];
  codeLine: number;
  variableBadges?: { name: string; value: string }[];
}

export const PALINDROMIC_SUBSTRINGS_CODE_LINES = [
  'def countSubstrings(s: str) -> int:',
  '    count = 0',
  '    for i in range(len(s)):',
  '        # Odd-length palindromes',
  '        l, r = i, i',
  '        while l >= 0 and r < len(s) and s[l] == s[r]:',
  '            count += 1',
  '            l -= 1; r += 1',
  '        # Even-length palindromes',
  '        l, r = i, i + 1',
  '        while l >= 0 and r < len(s) and s[l] == s[r]:',
  '            count += 1',
  '            l -= 1; r += 1',
  '    return count',
];

export function generatePalindromicSubstringsSteps(s: string): PalindromicSubstringsStep[] {
  const steps: PalindromicSubstringsStep[] = [];
  const n = s.length;
  let totalCount = 0;
  const foundPalindromes: string[] = [];

  if (n === 0) {
    steps.push({
      currentCenter: 0,
      centerType: 'odd',
      left: 0,
      right: 0,
      match: false,
      totalCount: 0,
      foundPalindromes: [],
      activeSubstring: '',
      explanation: 'Empty string has 0 palindromic substrings.',
      highlightedIndices: [],
      codeLine: 1,
      variableBadges: [{ name: 'count', value: '0' }],
    });
    return steps;
  }

  steps.push({
    currentCenter: 0,
    centerType: 'odd',
    left: 0,
    right: 0,
    match: false,
    totalCount: 0,
    foundPalindromes: [],
    activeSubstring: '',
    explanation: 'Initialize total count = 0. We will expand around each possible center (odd length and even length).',
    highlightedIndices: [],
    codeLine: 1,
    variableBadges: [{ name: 'count', value: '0' }],
  });

  for (let i = 0; i < n; i++) {
    // 1. Odd length palindromes centered at i
    let l = i;
    let r = i;
    steps.push({
      currentCenter: i,
      centerType: 'odd',
      left: l,
      right: r,
      match: true,
      totalCount,
      foundPalindromes: [...foundPalindromes],
      activeSubstring: s.substring(l, r + 1),
      explanation: `Odd center at index ${i} ('${s[i]}'). Start expanding with left = ${l}, right = ${r}.`,
      highlightedIndices: [i],
      codeLine: 4,
      variableBadges: [
        { name: 'i', value: `${i}` },
        { name: 'l', value: `${l}` },
        { name: 'r', value: `${r}` },
        { name: 'count', value: `${totalCount}` },
      ],
    });

    while (l >= 0 && r < n && s[l] === s[r]) {
      const sub = s.substring(l, r + 1);
      totalCount++;
      foundPalindromes.push(sub);
      const highlighted: number[] = [];
      for (let k = l; k <= r; k++) highlighted.push(k);

      steps.push({
        currentCenter: i,
        centerType: 'odd',
        left: l,
        right: r,
        match: true,
        totalCount,
        foundPalindromes: [...foundPalindromes],
        activeSubstring: sub,
        explanation: `s[${l}] ('${s[l]}') == s[${r}] ('${s[r]}') -> "${sub}" is a palindrome! Count becomes ${totalCount}.`,
        highlightedIndices: highlighted,
        codeLine: 6,
        variableBadges: [
          { name: 'match', value: `"${sub}"` },
          { name: 'count', value: `${totalCount}` },
        ],
      });

      l--;
      r++;
    }

    if (l >= 0 && r < n) {
      steps.push({
        currentCenter: i,
        centerType: 'odd',
        left: l,
        right: r,
        match: false,
        totalCount,
        foundPalindromes: [...foundPalindromes],
        activeSubstring: s.substring(l, r + 1),
        explanation: `Mismatch at left = ${l} ('${s[l]}') and right = ${r} ('${s[r]}'). Stop expanding odd center ${i}.`,
        highlightedIndices: [l, r],
        codeLine: 5,
        variableBadges: [
          { name: 'mismatch', value: `${s[l]} != ${s[r]}` },
          { name: 'count', value: `${totalCount}` },
        ],
      });
    }

    // 2. Even length palindromes centered between i and i+1
    l = i;
    r = i + 1;
    if (r < n) {
      steps.push({
        currentCenter: i,
        centerType: 'even',
        left: l,
        right: r,
        match: s[l] === s[r],
        totalCount,
        foundPalindromes: [...foundPalindromes],
        activeSubstring: s.substring(l, r + 1),
        explanation: `Even center between indices ${i} and ${r} ('${s[l]}', '${s[r]}'). Expand with left = ${l}, right = ${r}.`,
        highlightedIndices: [l, r],
        codeLine: 9,
        variableBadges: [
          { name: 'i', value: `${i}` },
          { name: 'r', value: `${r}` },
          { name: 'count', value: `${totalCount}` },
        ],
      });

      while (l >= 0 && r < n && s[l] === s[r]) {
        const sub = s.substring(l, r + 1);
        totalCount++;
        foundPalindromes.push(sub);
        const highlighted: number[] = [];
        for (let k = l; k <= r; k++) highlighted.push(k);

        steps.push({
          currentCenter: i,
          centerType: 'even',
          left: l,
          right: r,
          match: true,
          totalCount,
          foundPalindromes: [...foundPalindromes],
          activeSubstring: sub,
          explanation: `s[${l}] ('${s[l]}') == s[${r}] ('${s[r]}') -> "${sub}" is a palindrome! Count becomes ${totalCount}.`,
          highlightedIndices: highlighted,
          codeLine: 11,
          variableBadges: [
            { name: 'match', value: `"${sub}"` },
            { name: 'count', value: `${totalCount}` },
          ],
        });

        l--;
        r++;
      }

      if (l >= 0 && r < n) {
        steps.push({
          currentCenter: i,
          centerType: 'even',
          left: l,
          right: r,
          match: false,
          totalCount,
          foundPalindromes: [...foundPalindromes],
          activeSubstring: s.substring(l, r + 1),
          explanation: `Mismatch at left = ${l} ('${s[l]}') and right = ${r} ('${s[r]}'). Stop expanding even center ${i}-${i + 1}.`,
          highlightedIndices: [l, r],
          codeLine: 10,
          variableBadges: [
            { name: 'mismatch', value: `${s[l]} != ${s[r]}` },
            { name: 'count', value: `${totalCount}` },
          ],
        });
      }
    }
  }

  // Final step
  steps.push({
    currentCenter: n - 1,
    centerType: 'even',
    left: -1,
    right: n,
    match: true,
    totalCount,
    foundPalindromes: [...foundPalindromes],
    activeSubstring: '',
    explanation: `Done! Found total of ${totalCount} palindromic substrings in "${s}".`,
    highlightedIndices: [],
    codeLine: 13,
    variableBadges: [{ name: 'totalCount', value: `${totalCount}` }],
  });

  return steps;
}
