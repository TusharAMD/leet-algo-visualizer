export interface LongestPalindromeStep {
  stepIndex: number;
  totalSteps: number;
  s: string;
  centerIndex: number;
  centerType: 'ODD' | 'EVEN';
  left: number;
  right: number;
  currentCandidate: string;
  longestPalindrome: string;
  longestSpan: [number, number];
  isMatch: boolean;
  headline: string;
  subtext: string;
  codeLine: number;
  variableBadges: { name: string; value: string }[];
  isComplete: boolean;
}

export const LONGEST_PALINDROME_CODE_LINES = [
  'def longestPalindrome(s):',
  '    res, resLen = "", 0',
  '    for i in range(len(s)):',
  '        # 1. Expand around odd-length center (i)',
  '        l, r = i, i',
  '        while l >= 0 and r < len(s) and s[l] == s[r]:',
  '            if (r - l + 1) > resLen:',
  '                res = s[l : r + 1]; resLen = r - l + 1',
  '            l -= 1; r += 1',
  '        # 2. Expand around even-length center (i, i + 1)',
  '        l, r = i, i + 1',
  '        while l >= 0 and r < len(s) and s[l] == s[r]:',
  '            if (r - l + 1) > resLen:',
  '                res = s[l : r + 1]; resLen = r - l + 1',
  '            l -= 1; r += 1',
  '    return res'
];

export function generateLongestPalindromeSteps(s: string): LongestPalindromeStep[] {
  const steps: LongestPalindromeStep[] = [];
  const n = s.length;

  if (n === 0) {
    steps.push({
      stepIndex: 0,
      totalSteps: 1,
      s,
      centerIndex: 0,
      centerType: 'ODD',
      left: 0,
      right: 0,
      currentCandidate: '',
      longestPalindrome: '',
      longestSpan: [0, 0],
      isMatch: true,
      headline: 'Empty String: Longest Palindrome is ""',
      subtext: 'String has length 0.',
      codeLine: 2,
      variableBadges: [{ name: 'return', value: '""' }],
      isComplete: true
    });
    return steps;
  }

  let res = s[0];
  let resLen = 1;
  let longestSpan: [number, number] = [0, 0];

  // Step 0: Init
  steps.push({
    stepIndex: 0,
    totalSteps: 0,
    s,
    centerIndex: 0,
    centerType: 'ODD',
    left: 0,
    right: 0,
    currentCandidate: s[0],
    longestPalindrome: res,
    longestSpan: [0, 0],
    isMatch: true,
    headline: `Initialize Palindrome Search: "${s}"`,
    subtext: `Testing ${2 * n - 1} possible odd & even symmetry centers.`,
    codeLine: 3,
    variableBadges: [
      { name: 's', value: `"${s}"` },
      { name: 'currentBest', value: `"${res}"` },
      { name: 'bestLen', value: '1' }
    ],
    isComplete: false
  });

  for (let i = 0; i < n; i++) {
    // 1. Odd Center (i)
    let l = i;
    let r = i;
    while (l >= 0 && r < n && s[l] === s[r]) {
      const candidateLen = r - l + 1;
      const candidate = s.slice(l, r + 1);

      if (candidateLen > resLen) {
        res = candidate;
        resLen = candidateLen;
        longestSpan = [l, r];
      }

      steps.push({
        stepIndex: 0,
        totalSteps: 0,
        s,
        centerIndex: i,
        centerType: 'ODD',
        left: l,
        right: r,
        currentCandidate: candidate,
        longestPalindrome: res,
        longestSpan: [...longestSpan],
        isMatch: true,
        headline: `Odd Center at Index ${i} ('${s[i]}') -> Span [${l}..${r}]`,
        subtext: `Characters match: s[${l}] == s[${r}] ('${s[l]}'). Palindrome candidate: "${candidate}".`,
        codeLine: 6,
        variableBadges: [
          { name: 'center', value: `Index ${i} ('${s[i]}')` },
          { name: 'candidate', value: `"${candidate}"` },
          { name: 'longest', value: `"${res}"` }
        ],
        isComplete: false
      });

      l--;
      r++;
    }

    // 2. Even Center (i, i + 1)
    l = i;
    r = i + 1;
    while (l >= 0 && r < n && s[l] === s[r]) {
      const candidateLen = r - l + 1;
      const candidate = s.slice(l, r + 1);

      if (candidateLen > resLen) {
        res = candidate;
        resLen = candidateLen;
        longestSpan = [l, r];
      }

      steps.push({
        stepIndex: 0,
        totalSteps: 0,
        s,
        centerIndex: i,
        centerType: 'EVEN',
        left: l,
        right: r,
        currentCandidate: candidate,
        longestPalindrome: res,
        longestSpan: [...longestSpan],
        isMatch: true,
        headline: `Even Center between Index ${i} and ${i + 1} -> Span [${l}..${r}]`,
        subtext: `Symmetric match: s[${l}] == s[${r}] ('${s[l]}'). Palindrome candidate: "${candidate}".`,
        codeLine: 12,
        variableBadges: [
          { name: 'center', value: `Indices ${i},${i + 1}` },
          { name: 'candidate', value: `"${candidate}"` },
          { name: 'longest', value: `"${res}"` }
        ],
        isComplete: false
      });

      l--;
      r++;
    }
  }

  steps.push({
    stepIndex: 0,
    totalSteps: 0,
    s,
    centerIndex: -1,
    centerType: 'ODD',
    left: longestSpan[0],
    right: longestSpan[1],
    currentCandidate: res,
    longestPalindrome: res,
    longestSpan: [...longestSpan],
    isMatch: true,
    headline: `Longest Palindromic Substring Found: "${res}"`,
    subtext: `Maximum symmetry length is ${res.length} spanning indices [${longestSpan[0]}..${longestSpan[1]}].`,
    codeLine: 16,
    variableBadges: [
      { name: 'return', value: `"${res}"` },
      { name: 'length', value: `${res.length}` },
      { name: 'span', value: `[${longestSpan[0]}..${longestSpan[1]}]` }
    ],
    isComplete: true
  });

  const total = steps.length;
  steps.forEach((s, idx) => {
    s.stepIndex = idx;
    s.totalSteps = total;
  });

  return steps;
}
