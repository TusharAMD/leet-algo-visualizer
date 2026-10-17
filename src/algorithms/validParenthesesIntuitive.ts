export interface ParenthesesStep {
  stepIndex: number;
  totalSteps: number;
  currentIndex: number;
  currentChar: string;
  stack: { char: string; index: number }[];
  action: 'push' | 'match_pop' | 'mismatch' | 'empty_pop';
  matchedPair: { open: string; close: string; openIdx: number; closeIdx: number } | null;
  isValidSoFar: boolean;
  headline: string;
  subtext: string;
  codeLine: number;
  variableBadges: { name: string; value: string }[];
  isComplete: boolean;
  finalResult: boolean;
}

export const PARENTHESES_CODE_LINES = [
  'def isValid(s):',
  '    stack = []',
  '    mapping = {")": "(", "}": "{", "]": "["}',
  '    for i, char in enumerate(s):',
  '        if char in mapping:',
  '            top = stack.pop() if stack else "#"',
  '            if mapping[char] != top:',
  '                return False  # Mismatch or empty stack',
  '        else:',
  '            stack.append(char)  # Opening bracket',
  '    return len(stack) == 0'
];

export function generateParenthesesSteps(s: string): ParenthesesStep[] {
  const steps: ParenthesesStep[] = [];
  const n = s.length;
  const mapping: { [key: string]: string } = { ')': '(', '}': '{', ']': '[' };
  const stack: { char: string; index: number }[] = [];

  if (n === 0) {
    return [
      {
        stepIndex: 0,
        totalSteps: 1,
        currentIndex: 0,
        currentChar: '',
        stack: [],
        action: 'match_pop',
        matchedPair: null,
        isValidSoFar: true,
        headline: 'Empty String is Valid',
        subtext: 'No unclosed brackets.',
        codeLine: 1,
        variableBadges: [{ name: 'isValid', value: 'True' }],
        isComplete: true,
        finalResult: true
      }
    ];
  }

  // Step 0: Initialize
  steps.push({
    stepIndex: 0,
    totalSteps: 0,
    currentIndex: 0,
    currentChar: s[0],
    stack: [],
    action: 'push',
    matchedPair: null,
    isValidSoFar: true,
    headline: 'Initialize: Empty LIFO Stack',
    subtext: 'We scan each bracket from left to right. Opening brackets wait in the stack; closing brackets must match the most recent opener.',
    codeLine: 1,
    variableBadges: [
      { name: 'stack', value: '[]' },
      { name: 's', value: `"${s}"` }
    ],
    isComplete: false,
    finalResult: false
  });

  let valid = true;

  for (let i = 0; i < n; i++) {
    const char = s[i];

    if (char in mapping) {
      // Closing bracket
      const expectedOpener = mapping[char];

      if (stack.length === 0) {
        valid = false;
        steps.push({
          stepIndex: steps.length,
          totalSteps: 0,
          currentIndex: i,
          currentChar: char,
          stack: [...stack],
          action: 'empty_pop',
          matchedPair: null,
          isValidSoFar: false,
          headline: `❌ Invalid: Closing bracket '${char}' at Index ${i} has no opening bracket!`,
          subtext: 'Stack is empty. Cannot close a bracket that was never opened. String is immediately invalid.',
          codeLine: 7,
          variableBadges: [
            { name: 'char', value: `'${char}'` },
            { name: 'stack', value: '[]' },
            { name: 'result', value: 'False' }
          ],
          isComplete: true,
          finalResult: false
        });
        break;
      }

      const top = stack[stack.length - 1];

      if (top.char !== expectedOpener) {
        valid = false;
        steps.push({
          stepIndex: steps.length,
          totalSteps: 0,
          currentIndex: i,
          currentChar: char,
          stack: [...stack],
          action: 'mismatch',
          matchedPair: null,
          isValidSoFar: false,
          headline: `❌ Mismatch! '${char}' at Index ${i} does not match '${top.char}' from Index ${top.index}`,
          subtext: `Expected '${expectedOpener}' to close '${top.char}', but found '${char}'. LIFO order violated.`,
          codeLine: 7,
          variableBadges: [
            { name: 'closing', value: `'${char}'` },
            { name: 'stack top', value: `'${top.char}'` },
            { name: 'result', value: 'False' }
          ],
          isComplete: true,
          finalResult: false
        });
        break;
      } else {
        // Matched!
        const popped = stack.pop()!;
        steps.push({
          stepIndex: steps.length,
          totalSteps: 0,
          currentIndex: i,
          currentChar: char,
          stack: [...stack],
          action: 'match_pop',
          matchedPair: { open: popped.char, close: char, openIdx: popped.index, closeIdx: i },
          isValidSoFar: true,
          headline: `✨ Match! '${popped.char}' (Index ${popped.index}) & '${char}' (Index ${i}) cancelled out!`,
          subtext: `Popped '${popped.char}' from stack. Sub-expression between ${popped.index} and ${i} is completely valid.`,
          codeLine: 5,
          variableBadges: [
            { name: 'matched', value: `'${popped.char}' ➔ '${char}'` },
            { name: 'remaining in stack', value: `${stack.length}` }
          ],
          isComplete: false,
          finalResult: false
        });
      }
    } else {
      // Opening bracket
      stack.push({ char, index: i });
      steps.push({
        stepIndex: steps.length,
        totalSteps: 0,
        currentIndex: i,
        currentChar: char,
        stack: [...stack],
        action: 'push',
        matchedPair: null,
        isValidSoFar: true,
        headline: `Push '${char}' (Index ${i}) into Stack Chamber`,
        subtext: `Waiting for its matching closing bracket '${char === '(' ? ')' : char === '{' ? '}' : ']'}' in future positions.`,
        codeLine: 9,
        variableBadges: [
          { name: 'pushed', value: `'${char}'` },
          { name: 'stack depth', value: `${stack.length}` }
        ],
        isComplete: false,
        finalResult: false
      });
    }
  }

  // Final check
  if (valid) {
    const isClean = stack.length === 0;
    steps.push({
      stepIndex: steps.length,
      totalSteps: 0,
      currentIndex: n - 1,
      currentChar: s[n - 1],
      stack: [...stack],
      action: isClean ? 'match_pop' : 'mismatch',
      matchedPair: null,
      isValidSoFar: isClean,
      headline: isClean
        ? '🎉 Valid Parentheses! Stack is completely empty.'
        : `❌ Invalid! ${stack.length} opening bracket(s) remained unclosed at the end.`,
      subtext: isClean
        ? 'Every bracket was closed in proper LIFO nested order.'
        : `Unclosed: [${stack.map((s) => `'${s.char}'`).join(', ')}]`,
      codeLine: 10,
      variableBadges: [
        { name: 'stack length', value: `${stack.length}` },
        { name: 'return', value: `${isClean ? 'True' : 'False'}` }
      ],
      isComplete: true,
      finalResult: isClean
    });
  }

  const total = steps.length;
  steps.forEach((s) => (s.totalSteps = total));
  return steps;
}
