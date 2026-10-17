export interface GenerateParenthesesStep {
  stepIndex: number;
  totalSteps: number;
  n: number;
  openCount: number;
  closeCount: number;
  currentPath: string;
  action: 'ADD_OPEN' | 'ADD_CLOSE' | 'SOLUTION' | 'BACKTRACK' | 'INIT' | 'COMPLETE';
  solutions: string[];
  headline: string;
  subtext: string;
  codeLine: number;
  variableBadges: { name: string; value: string }[];
  isComplete: boolean;
}

export const GENERATE_PARENTHESES_CODE_LINES = [
  'def generateParenthesis(n):',
  '    res = []',
  '    def backtrack(open_n, close_n, path):',
  '        if open_n == n and close_n == n:    # Valid combination reached',
  '            res.append("".join(path)); return',
  '        if open_n < n:                      # Rule 1: Add ( if under n',
  '            path.append("(")',
  '            backtrack(open_n + 1, close_n, path)',
  '            path.pop()                      # Backtrack',
  '        if close_n < open_n:                # Rule 2: Add ) if close < open',
  '            path.append(")")',
  '            backtrack(open_n, close_n + 1, path)',
  '            path.pop()                      # Backtrack',
  '    backtrack(0, 0, [])',
  '    return res'
];

export function generateGenerateParenthesesSteps(n: number): GenerateParenthesesStep[] {
  const steps: GenerateParenthesesStep[] = [];
  const solutions: string[] = [];
  const path: string[] = [];

  // Init step
  steps.push({
    stepIndex: 0,
    totalSteps: 0,
    n,
    openCount: 0,
    closeCount: 0,
    currentPath: '',
    action: 'INIT',
    solutions: [],
    headline: `Initialize Parentheses Backtracking for n = ${n}`,
    subtext: `Target: All valid combinations of length 2n = ${2 * n}. Rule 1: open < n. Rule 2: close < open.`,
    codeLine: 2,
    variableBadges: [
      { name: 'n', value: `${n}` },
      { name: 'open', value: '0' },
      { name: 'close', value: '0' }
    ],
    isComplete: false
  });

  function backtrack(openN: number, closeN: number) {
    if (openN === n && closeN === n) {
      const sol = path.join('');
      solutions.push(sol);

      steps.push({
        stepIndex: 0,
        totalSteps: 0,
        n,
        openCount: openN,
        closeCount: closeN,
        currentPath: sol,
        action: 'SOLUTION',
        solutions: [...solutions],
        headline: `Valid Combination Formed: "${sol}"`,
        subtext: `Reached length ${2 * n} with ${n} matching pairs. Added to solutions gallery!`,
        codeLine: 5,
        variableBadges: [
          { name: 'solution', value: `"${sol}"` },
          { name: 'total', value: `${solutions.length}` }
        ],
        isComplete: false
      });
      return;
    }

    if (openN < n) {
      path.push('(');
      steps.push({
        stepIndex: 0,
        totalSteps: 0,
        n,
        openCount: openN + 1,
        closeCount: closeN,
        currentPath: path.join(''),
        action: 'ADD_OPEN',
        solutions: [...solutions],
        headline: `Rule 1 (open < ${n}): Append '(' -> "${path.join('')}"`,
        subtext: `Available open parentheses: ${n - (openN + 1)} remaining.`,
        codeLine: 7,
        variableBadges: [
          { name: 'open', value: `${openN + 1}/${n}` },
          { name: 'close', value: `${closeN}/${n}` }
        ],
        isComplete: false
      });

      backtrack(openN + 1, closeN);
      path.pop();

      steps.push({
        stepIndex: 0,
        totalSteps: 0,
        n,
        openCount: openN,
        closeCount: closeN,
        currentPath: path.join(''),
        action: 'BACKTRACK',
        solutions: [...solutions],
        headline: `Backtrack: Pop '(' -> Returning to "${path.join('') || 'root'}"`,
        subtext: `Undoing branch to explore closing parentheses alternate path.`,
        codeLine: 9,
        variableBadges: [
          { name: 'open', value: `${openN}/${n}` },
          { name: 'close', value: `${closeN}/${n}` }
        ],
        isComplete: false
      });
    }

    if (closeN < openN) {
      path.push(')');
      steps.push({
        stepIndex: 0,
        totalSteps: 0,
        n,
        openCount: openN,
        closeCount: closeN + 1,
        currentPath: path.join(''),
        action: 'ADD_CLOSE',
        solutions: [...solutions],
        headline: `Rule 2 (close < open): Append ')' -> "${path.join('')}"`,
        subtext: `Balancing existing opens: close = ${closeN + 1}, open = ${openN}.`,
        codeLine: 11,
        variableBadges: [
          { name: 'open', value: `${openN}/${n}` },
          { name: 'close', value: `${closeN + 1}/${n}` }
        ],
        isComplete: false
      });

      backtrack(openN, closeN + 1);
      path.pop();

      steps.push({
        stepIndex: 0,
        totalSteps: 0,
        n,
        openCount: openN,
        closeCount: closeN,
        currentPath: path.join(''),
        action: 'BACKTRACK',
        solutions: [...solutions],
        headline: `Backtrack: Pop ')' -> Returning to "${path.join('') || 'root'}"`,
        subtext: `Branch complete. Returning up recursive decision tree.`,
        codeLine: 13,
        variableBadges: [
          { name: 'open', value: `${openN}/${n}` },
          { name: 'close', value: `${closeN}/${n}` }
        ],
        isComplete: false
      });
    }
  }

  backtrack(0, 0);

  // Complete step
  steps.push({
    stepIndex: 0,
    totalSteps: 0,
    n,
    openCount: n,
    closeCount: n,
    currentPath: '',
    action: 'COMPLETE',
    solutions: [...solutions],
    headline: `Backtracking Complete! Found All ${solutions.length} Valid Combinations`,
    subtext: `Total Catalan number C_${n} = ${solutions.length} unique well-formed combinations.`,
    codeLine: 15,
    variableBadges: [
      { name: 'total combinations', value: `${solutions.length}` }
    ],
    isComplete: true
  });

  return steps.map((st, idx) => ({ ...st, stepIndex: idx, totalSteps: steps.length }));
}
