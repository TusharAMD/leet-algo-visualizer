export interface ValidPalindromeStep {
  stepIndex: number;
  totalSteps: number;
  rawStr: string;
  left: number;
  right: number;
  leftChar: string | null;
  rightChar: string | null;
  isMatch: boolean | null;
  action: 'INIT' | 'SKIP_LEFT' | 'SKIP_RIGHT' | 'COMPARE' | 'FAIL' | 'SUCCESS';
  headline: string;
  subtext: string;
  codeLine: number;
  variableBadges: { name: string; value: string }[];
  isComplete: boolean;
  isValid: boolean | null;
}

export const VALID_PALINDROME_CODE_LINES = [
  'def isPalindrome(s):',
  '    l, r = 0, len(s) - 1',
  '    while l < r:',
  '        while l < r and not s[l].isalnum():',
  '            l += 1    # Skip punctuation / spaces on left',
  '        while l < r and not s[r].isalnum():',
  '            r -= 1    # Skip punctuation / spaces on right',
  '        if s[l].lower() != s[r].lower():',
  '            return False  # Mismatch detected!',
  '        l, r = l + 1, r - 1',
  '    return True           # Symmetric palindrome confirmed'
];

function isAlphaNumeric(ch: string): boolean {
  return /^[a-z0-9]$/i.test(ch);
}

export function generateValidPalindromeSteps(s: string): ValidPalindromeStep[] {
  const steps: ValidPalindromeStep[] = [];
  let l = 0;
  let r = s.length - 1;

  // Initial Step
  steps.push({
    stepIndex: 0,
    totalSteps: 0,
    rawStr: s,
    left: l,
    right: r,
    leftChar: s[l] ?? null,
    rightChar: s[r] ?? null,
    isMatch: null,
    action: 'INIT',
    headline: 'Initialize Two Pointers: Left = 0, Right = len(s) - 1',
    subtext: 'We pinch inward from both ends in O(1) extra space, ignoring non-alphanumeric noise.',
    codeLine: 1,
    variableBadges: [
      { name: 'l', value: `${l}` },
      { name: 'r', value: `${r}` }
    ],
    isComplete: false,
    isValid: null
  });

  while (l < r) {
    // Advance left if not alphanumeric
    while (l < r && !isAlphaNumeric(s[l])) {
      steps.push({
        stepIndex: 0,
        totalSteps: 0,
        rawStr: s,
        left: l,
        right: r,
        leftChar: s[l],
        rightChar: s[r],
        isMatch: null,
        action: 'SKIP_LEFT',
        headline: `Skip Non-Alphanumeric at Left: '${s[l]}'`,
        subtext: `Left character '${s[l]}' is punctuation or space. Incrementing l to ${l + 1}.`,
        codeLine: 4,
        variableBadges: [
          { name: 'l', value: `${l}` },
          { name: `s[l]`, value: `'${s[l]}'` }
        ],
        isComplete: false,
        isValid: null
      });
      l++;
    }

    // Retreat right if not alphanumeric
    while (l < r && !isAlphaNumeric(s[r])) {
      steps.push({
        stepIndex: 0,
        totalSteps: 0,
        rawStr: s,
        left: l,
        right: r,
        leftChar: s[l],
        rightChar: s[r],
        isMatch: null,
        action: 'SKIP_RIGHT',
        headline: `Skip Non-Alphanumeric at Right: '${s[r]}'`,
        subtext: `Right character '${s[r]}' is punctuation or space. Decrementing r to ${r - 1}.`,
        codeLine: 6,
        variableBadges: [
          { name: 'r', value: `${r}` },
          { name: `s[r]`, value: `'${s[r]}'` }
        ],
        isComplete: false,
        isValid: null
      });
      r--;
    }

    if (l < r) {
      const leftCharLower = s[l].toLowerCase();
      const rightCharLower = s[r].toLowerCase();
      const match = leftCharLower === rightCharLower;

      if (!match) {
        steps.push({
          stepIndex: 0,
          totalSteps: 0,
          rawStr: s,
          left: l,
          right: r,
          leftChar: s[l],
          rightChar: s[r],
          isMatch: false,
          action: 'FAIL',
          headline: `Mismatch Found: '${s[l]}' ≠ '${s[r]}'`,
          subtext: `Symmetry broken! Characters at indices ${l} and ${r} do not match when lowercased.`,
          codeLine: 8,
          variableBadges: [
            { name: `s[l].lower()`, value: `'${leftCharLower}'` },
            { name: `s[r].lower()`, value: `'${rightCharLower}'` }
          ],
          isComplete: true,
          isValid: false
        });
        return steps.map((st, idx) => ({ ...st, stepIndex: idx, totalSteps: steps.length }));
      }

      // Match step
      steps.push({
        stepIndex: 0,
        totalSteps: 0,
        rawStr: s,
        left: l,
        right: r,
        leftChar: s[l],
        rightChar: s[r],
        isMatch: true,
        action: 'COMPARE',
        headline: `Match: '${s[l]}' == '${s[r]}'`,
        subtext: `Symmetric pair confirmed! Advancing l: ${l} → ${l + 1}, retreating r: ${r} → ${r - 1}.`,
        codeLine: 9,
        variableBadges: [
          { name: `s[l]`, value: `'${leftCharLower}'` },
          { name: `s[r]`, value: `'${rightCharLower}'` }
        ],
        isComplete: false,
        isValid: null
      });

      l++;
      r--;
    }
  }

  // Success
  steps.push({
    stepIndex: 0,
    totalSteps: 0,
    rawStr: s,
    left: l,
    right: r,
    leftChar: s[l] ?? null,
    rightChar: s[r] ?? null,
    isMatch: true,
    action: 'SUCCESS',
    headline: 'Valid Palindrome Confirmed! (True)',
    subtext: 'Pointers crossed successfully with every valid alphanumeric character mirrored perfectly.',
    codeLine: 10,
    variableBadges: [
      { name: 'result', value: 'True' },
      { name: 'space', value: 'O(1)' }
    ],
    isComplete: true,
    isValid: true
  });

  return steps.map((st, idx) => ({ ...st, stepIndex: idx, totalSteps: steps.length }));
}
