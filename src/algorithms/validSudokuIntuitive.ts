export interface ValidSudokuStep {
  stepIndex: number;
  totalSteps: number;
  board: string[][];
  currentRow: number;
  currentCol: number;
  currentVal: string;
  boxKey: string | null;
  conflictType: 'ROW' | 'COL' | 'BOX' | null;
  conflictPos: [number, number] | null;
  isValid: boolean;
  headline: string;
  subtext: string;
  codeLine: number;
  variableBadges: { name: string; value: string }[];
  isComplete: boolean;
}

export const VALID_SUDOKU_CODE_LINES = [
  'def isValidSudoku(board):',
  '    rows = collections.defaultdict(set)',
  '    cols = collections.defaultdict(set)',
  '    boxes = collections.defaultdict(set)   # key: (r // 3, c // 3)',
  '    for r in range(9):',
  '        for c in range(9):',
  '            val = board[r][c]',
  '            if val == ".": continue',
  '            box = (r // 3, c // 3)',
  '            if (val in rows[r] or',
  '                val in cols[c] or',
  '                val in boxes[box]):',
  '                return False               # Duplicate conflict!',
  '            rows[r].add(val); cols[c].add(val); boxes[box].add(val)',
  '    return True                            # All rows, cols & 3x3 boxes valid'
];

export function generateValidSudokuSteps(board: string[][]): ValidSudokuStep[] {
  const steps: ValidSudokuStep[] = [];
  const rows: Record<number, Set<string>> = {};
  const cols: Record<number, Set<string>> = {};
  const boxes: Record<string, Set<string>> = {};

  const rowValPos: Record<string, [number, number]> = {};
  const colValPos: Record<string, [number, number]> = {};
  const boxValPos: Record<string, [number, number]> = {};

  for (let i = 0; i < 9; i++) {
    rows[i] = new Set();
    cols[i] = new Set();
  }
  for (let r = 0; r < 3; r++) {
    for (let c = 0; c < 3; c++) {
      boxes[`${r},${c}`] = new Set();
    }
  }

  // Step 0: Init
  steps.push({
    stepIndex: 0,
    totalSteps: 0,
    board,
    currentRow: -1,
    currentCol: -1,
    currentVal: '',
    boxKey: null,
    conflictType: null,
    conflictPos: null,
    isValid: true,
    headline: 'Initialize 9x9 Sudoku Validator Hash Vaults',
    subtext: 'We verify rows 0..8, columns 0..8, and the 9 sub-boxes (r//3, c//3) in single-pass O(1) space.',
    codeLine: 4,
    variableBadges: [
      { name: 'board', value: '9x9' },
      { name: 'status', value: 'Valid so far' }
    ],
    isComplete: false
  });

  for (let r = 0; r < 9; r++) {
    for (let c = 0; c < 9; c++) {
      const val = board[r][c];
      if (val === '.') continue;

      const boxKey = `${Math.floor(r / 3)},${Math.floor(c / 3)}`;

      // Check conflict
      if (rows[r].has(val)) {
        const conf = rowValPos[`${r}_${val}`];
        steps.push({
          stepIndex: 0,
          totalSteps: 0,
          board,
          currentRow: r,
          currentCol: c,
          currentVal: val,
          boxKey,
          conflictType: 'ROW',
          conflictPos: conf,
          isValid: false,
          headline: `Row Collision! Duplicate '${val}' in Row ${r}`,
          subtext: `Digit '${val}' already exists at col ${conf[1]} in row ${r}. Invalid board!`,
          codeLine: 13,
          variableBadges: [
            { name: 'conflict', value: `Row ${r}` },
            { name: 'val', value: `'${val}'` }
          ],
          isComplete: true
        });
        return steps.map((st, idx) => ({ ...st, stepIndex: idx, totalSteps: steps.length }));
      }

      if (cols[c].has(val)) {
        const conf = colValPos[`${c}_${val}`];
        steps.push({
          stepIndex: 0,
          totalSteps: 0,
          board,
          currentRow: r,
          currentCol: c,
          currentVal: val,
          boxKey,
          conflictType: 'COL',
          conflictPos: conf,
          isValid: false,
          headline: `Column Collision! Duplicate '${val}' in Col ${c}`,
          subtext: `Digit '${val}' already exists at row ${conf[0]} in col ${c}. Invalid board!`,
          codeLine: 13,
          variableBadges: [
            { name: 'conflict', value: `Col ${c}` },
            { name: 'val', value: `'${val}'` }
          ],
          isComplete: true
        });
        return steps.map((st, idx) => ({ ...st, stepIndex: idx, totalSteps: steps.length }));
      }

      if (boxes[boxKey].has(val)) {
        const conf = boxValPos[`${boxKey}_${val}`];
        steps.push({
          stepIndex: 0,
          totalSteps: 0,
          board,
          currentRow: r,
          currentCol: c,
          currentVal: val,
          boxKey,
          conflictType: 'BOX',
          conflictPos: conf,
          isValid: false,
          headline: `3x3 Sub-box Collision! Duplicate '${val}' in Box (${boxKey})`,
          subtext: `Digit '${val}' already exists inside the same 3x3 block at (${conf[0]}, ${conf[1]}). Invalid board!`,
          codeLine: 13,
          variableBadges: [
            { name: 'conflict', value: `Box (${boxKey})` },
            { name: 'val', value: `'${val}'` }
          ],
          isComplete: true
        });
        return steps.map((st, idx) => ({ ...st, stepIndex: idx, totalSteps: steps.length }));
      }

      // Add to vaults
      rows[r].add(val);
      cols[c].add(val);
      boxes[boxKey].add(val);
      rowValPos[`${r}_${val}`] = [r, c];
      colValPos[`${c}_${val}`] = [r, c];
      boxValPos[`${boxKey}_${val}`] = [r, c];

      steps.push({
        stepIndex: 0,
        totalSteps: 0,
        board,
        currentRow: r,
        currentCol: c,
        currentVal: val,
        boxKey,
        conflictType: null,
        conflictPos: null,
        isValid: true,
        headline: `Valid Digit '${val}' at Cell (${r}, ${c})`,
        subtext: `Unique in Row ${r}, Col ${c}, and 3x3 Box (${boxKey}). Added to hash sets.`,
        codeLine: 14,
        variableBadges: [
          { name: 'cell', value: `(${r}, ${c})` },
          { name: 'val', value: `'${val}'` },
          { name: 'box', value: `(${boxKey})` }
        ],
        isComplete: false
      });
    }
  }

  // Complete step
  steps.push({
    stepIndex: 0,
    totalSteps: 0,
    board,
    currentRow: -1,
    currentCol: -1,
    currentVal: '',
    boxKey: null,
    conflictType: null,
    conflictPos: null,
    isValid: true,
    headline: 'Sudoku Board Validated Successfully! (True)',
    subtext: 'All rows, columns, and 3x3 sub-grids are completely free of duplicate digits.',
    codeLine: 15,
    variableBadges: [
      { name: 'result', value: 'True (Valid Sudoku)' }
    ],
    isComplete: true
  });

  return steps.map((st, idx) => ({ ...st, stepIndex: idx, totalSteps: steps.length }));
}
