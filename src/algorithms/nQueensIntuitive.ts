export interface QueenPos {
  r: number;
  c: number;
}

export interface NQueensStep {
  stepIndex: number;
  totalSteps: number;
  n: number;
  queens: QueenPos[];
  currRow: number;
  currCol: number;
  action: 'test' | 'place' | 'conflict' | 'backtrack' | 'solution';
  conflictReason?: string;
  cols: number[];
  posDiag: number[]; // r + c
  negDiag: number[]; // r - c
  solutionsCount: number;
  headline: string;
  subtext: string;
  codeLine: number;
  variableBadges: { name: string; value: string }[];
  isComplete: boolean;
}

export const N_QUEENS_CODE_LINES = [
  'def solveNQueens(n):',
  '    cols, posDiag, negDiag = set(), set(), set()',
  '    board = [["."]*n for _ in range(n)]',
  '    res = []',
  '    def backtrack(r):',
  '        if r == n: res.append(...); return',
  '        for c in range(n):',
  '            if c in cols or (r+c) in posDiag or (r-c) in negDiag:',
  '                continue  # Conflict! Queen attacked',
  '            cols.add(c); posDiag.add(r+c); negDiag.add(r-c)',
  '            board[r][c] = "Q"',
  '            backtrack(r + 1)',
  '            cols.remove(c); posDiag.remove(r+c); negDiag.remove(r-c)',
  '            board[r][c] = "."',
  '    backtrack(0)'
];

export function generateNQueensSteps(n: number = 4): NQueensStep[] {
  const steps: NQueensStep[] = [];
  const queens: QueenPos[] = [];
  const cols = new Set<number>();
  const posDiag = new Set<number>();
  const negDiag = new Set<number>();
  let solutionsCount = 0;

  // Step 0: Initial
  steps.push({
    stepIndex: 0,
    totalSteps: 0,
    n,
    queens: [],
    currRow: 0,
    currCol: 0,
    action: 'test',
    cols: [],
    posDiag: [],
    negDiag: [],
    solutionsCount: 0,
    headline: `Start N-Queens on a ${n}x${n} Chessboard`,
    subtext: `Place ${n} non-attacking queens row-by-row. No two queens may share row, col, or diagonal.`,
    codeLine: 1,
    variableBadges: [{ name: 'n', value: `${n}` }, { name: 'solutions', value: '0' }],
    isComplete: false
  });

  function backtrack(r: number) {
    if (r === n) {
      solutionsCount++;
      steps.push({
        stepIndex: steps.length,
        totalSteps: 0,
        n,
        queens: [...queens],
        currRow: r,
        currCol: -1,
        action: 'solution',
        cols: Array.from(cols),
        posDiag: Array.from(posDiag),
        negDiag: Array.from(negDiag),
        solutionsCount,
        headline: `👑 Valid Solution #${solutionsCount} Discovered!`,
        subtext: `Successfully placed all ${n} queens without conflicts across any rank, file, or diagonal!`,
        codeLine: 5,
        variableBadges: [
          { name: 'solutions', value: `${solutionsCount}` },
          { name: 'queens', value: `${n}/${n}` }
        ],
        isComplete: false
      });
      return;
    }

    for (let c = 0; c < n; c++) {
      const colConflict = cols.has(c);
      const posConflict = posDiag.has(r + c);
      const negConflict = negDiag.has(r - c);

      if (colConflict || posConflict || negConflict) {
        let reason = '';
        if (colConflict) reason = `Column ${c} already under attack`;
        else if (posConflict) reason = `Positive diagonal (r+c=${r + c}) under attack`;
        else reason = `Negative diagonal (r-c=${r - c}) under attack`;

        steps.push({
          stepIndex: steps.length,
          totalSteps: 0,
          n,
          queens: [...queens],
          currRow: r,
          currCol: c,
          action: 'conflict',
          conflictReason: reason,
          cols: Array.from(cols),
          posDiag: Array.from(posDiag),
          negDiag: Array.from(negDiag),
          solutionsCount,
          headline: `Cannot place at (${r}, ${c}): ${reason}`,
          subtext: `Attacked by an existing queen. Pruning this branch.`,
          codeLine: 8,
          variableBadges: [
            { name: `cell(${r},${c})`, value: 'ATTACKED' },
            { name: 'cols', value: `[${Array.from(cols).join(',')}]` }
          ],
          isComplete: false
        });
        continue;
      }

      // Safe! Place Queen
      cols.add(c);
      posDiag.add(r + c);
      negDiag.add(r - c);
      queens.push({ r, c });

      steps.push({
        stepIndex: steps.length,
        totalSteps: 0,
        n,
        queens: [...queens],
        currRow: r,
        currCol: c,
        action: 'place',
        cols: Array.from(cols),
        posDiag: Array.from(posDiag),
        negDiag: Array.from(negDiag),
        solutionsCount,
        headline: `Safe! Place Queen at (${r}, ${c})`,
        subtext: `Locking column ${c}, pos-diagonal ${r + c}, neg-diagonal ${r - c} and moving to row ${r + 1}.`,
        codeLine: 10,
        variableBadges: [
          { name: 'queen', value: `(${r}, ${c})` },
          { name: 'row', value: `${r}` },
          { name: 'col', value: `${c}` }
        ],
        isComplete: false
      });

      backtrack(r + 1);

      // Backtrack
      cols.delete(c);
      posDiag.delete(r + c);
      negDiag.delete(r - c);
      queens.pop();

      steps.push({
        stepIndex: steps.length,
        totalSteps: 0,
        n,
        queens: [...queens],
        currRow: r,
        currCol: c,
        action: 'backtrack',
        cols: Array.from(cols),
        posDiag: Array.from(posDiag),
        negDiag: Array.from(negDiag),
        solutionsCount,
        headline: `Backtrack: Remove Queen from (${r}, ${c})`,
        subtext: `Branch exhausted; unmasking locks to try the next column.`,
        codeLine: 12,
        variableBadges: [
          { name: 'removed', value: `(${r}, ${c})` },
          { name: 'queens_remaining', value: `${queens.length}` }
        ],
        isComplete: false
      });
    }
  }

  backtrack(0);

  // Complete step
  steps.push({
    stepIndex: steps.length,
    totalSteps: 0,
    n,
    queens: [],
    currRow: 0,
    currCol: 0,
    action: 'solution',
    cols: [],
    posDiag: [],
    negDiag: [],
    solutionsCount,
    headline: `🎉 N-Queens Search Complete: Found ${solutionsCount} Valid Configurations!`,
    subtext: `Every branch verified with O(n!) worst-case bounded by aggressive diagonal pruning.`,
    codeLine: 14,
    variableBadges: [
      { name: 'total_solutions', value: `${solutionsCount}` },
      { name: 'board_size', value: `${n}x${n}` },
      { name: 'space', value: 'O(n)' }
    ],
    isComplete: true
  });

  const total = steps.length;
  steps.forEach((s) => (s.totalSteps = total));
  return steps;
}
