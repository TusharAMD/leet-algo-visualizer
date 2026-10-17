export interface LetterCombinationsStep {
  stepIndex: number;
  totalSteps: number;
  digits: string;
  digitIndex: number;
  currentDigit: string | null;
  currentLetters: string;
  activeChar: string | null;
  currentCombination: string;
  allCombinations: string[];
  headline: string;
  subtext: string;
  codeLine: number;
  variableBadges: { name: string; value: string }[];
  isComplete: boolean;
}

export const PHONE_MAP: { [key: string]: string } = {
  '2': 'abc',
  '3': 'def',
  '4': 'ghi',
  '5': 'jkl',
  '6': 'mno',
  '7': 'pqrs',
  '8': 'tuv',
  '9': 'wxyz'
};

export const LETTER_COMBINATIONS_CODE_LINES = [
  'def letterCombinations(digits):',
  '    if not digits: return []',
  '    digitToChar = {"2": "abc", "3": "def", "4": "ghi", "5": "jkl",',
  '                   "6": "mno", "7": "pqrs", "8": "tuv", "9": "wxyz"}',
  '    res = []',
  '    def backtrack(i, curStr):',
  '        if len(curStr) == len(digits):       # Base case: word length matched',
  '            res.append(curStr); return',
  '        for c in digitToChar[digits[i]]:    # Branch for each mapped letter',
  '            backtrack(i + 1, curStr + c)',
  '    backtrack(0, "")',
  '    return res'
];

export function generateLetterCombinationsSteps(digits: string): LetterCombinationsStep[] {
  const steps: LetterCombinationsStep[] = [];
  const safeDigits = digits.replace(/[^2-9]/g, '').slice(0, 4);

  const res: string[] = [];

  // Step 0: Initial
  steps.push({
    stepIndex: 0,
    totalSteps: 0,
    digits: safeDigits,
    digitIndex: 0,
    currentDigit: safeDigits[0] || null,
    currentLetters: safeDigits[0] ? PHONE_MAP[safeDigits[0]] : '',
    activeChar: null,
    currentCombination: '',
    allCombinations: [],
    headline: safeDigits.length > 0
      ? `Initialize Letter Combinations for Digits "${safeDigits}"`
      : 'Empty Digits -> Return []',
    subtext: `Cartesian mapping across phone keypad letters. Total combinations: ${
      safeDigits.length === 0
        ? 0
        : safeDigits.split('').reduce((acc, d) => acc * PHONE_MAP[d].length, 1)
    }.`,
    codeLine: 2,
    variableBadges: [
      { name: 'digits', value: `"${safeDigits}"` },
      { name: 'length', value: `${safeDigits.length}` }
    ],
    isComplete: safeDigits.length === 0
  });

  if (safeDigits.length === 0) {
    return steps.map((s, idx) => ({ ...s, stepIndex: idx, totalSteps: steps.length }));
  }

  const maxSteps = 45;

  function backtrack(i: number, curStr: string) {
    if (steps.length >= maxSteps) return;

    if (curStr.length === safeDigits.length) {
      res.push(curStr);
      steps.push({
        stepIndex: 0,
        totalSteps: 0,
        digits: safeDigits,
        digitIndex: i,
        currentDigit: null,
        currentLetters: '',
        activeChar: curStr[curStr.length - 1] || null,
        currentCombination: curStr,
        allCombinations: [...res],
        headline: `Formed Combination: "${curStr}"`,
        subtext: `Appended "${curStr}" to results (total matches: ${res.length}).`,
        codeLine: 8,
        variableBadges: [
          { name: 'combination', value: `"${curStr}"` },
          { name: 'totalFound', value: `${res.length}` }
        ],
        isComplete: false
      });
      return;
    }

    const d = safeDigits[i];
    const letters = PHONE_MAP[d];

    for (let cIdx = 0; cIdx < letters.length; cIdx++) {
      const ch = letters[cIdx];
      const nextStr = curStr + ch;

      steps.push({
        stepIndex: 0,
        totalSteps: 0,
        digits: safeDigits,
        digitIndex: i,
        currentDigit: d,
        currentLetters: letters,
        activeChar: ch,
        currentCombination: nextStr,
        allCombinations: [...res],
        headline: `Digit '${d}' -> Pick letter '${ch}' (${cIdx + 1}/${letters.length})`,
        subtext: `curStr is now "${nextStr}". Advancing to digit index ${i + 1}.`,
        codeLine: 10,
        variableBadges: [
          { name: 'digit', value: `'${d}'` },
          { name: 'letter', value: `'${ch}'` },
          { name: 'curStr', value: `"${nextStr}"` }
        ],
        isComplete: false
      });

      backtrack(i + 1, nextStr);
      if (steps.length >= maxSteps) return;
    }
  }

  backtrack(0, '');

  // Done
  steps.push({
    stepIndex: 0,
    totalSteps: 0,
    digits: safeDigits,
    digitIndex: safeDigits.length,
    currentDigit: null,
    currentLetters: '',
    activeChar: null,
    currentCombination: '',
    allCombinations: [...res],
    headline: `Letter Combinations Complete! Generated ${res.length} Words`,
    subtext: `All keypad branches explored: [${res.map((r) => `"${r}"`).join(', ')}].`,
    codeLine: 12,
    variableBadges: [
      { name: 'totalWords', value: `${res.length}` },
      { name: 'status', value: 'Complete' }
    ],
    isComplete: true
  });

  return steps.map((s, idx) => ({
    ...s,
    stepIndex: idx,
    totalSteps: steps.length
  }));
}
