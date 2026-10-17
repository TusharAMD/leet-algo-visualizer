export interface SearchMatrix2DStep {
  stepIndex: number;
  totalSteps: number;
  matrix: number[][];
  target: number;
  left: number;
  right: number;
  mid: number;
  midRow: number;
  midCol: number;
  midVal: number | null;
  found: boolean;
  action: 'INIT' | 'CHECK_MID' | 'MOVE_LEFT' | 'MOVE_RIGHT' | 'FOUND' | 'NOT_FOUND';
  headline: string;
  subtext: string;
  codeLine: number;
  variableBadges: { name: string; value: string }[];
  isComplete: boolean;
}

export const SEARCH_MATRIX_2D_CODE_LINES = [
  'def searchMatrix(matrix, target):',
  '    ROWS, COLS = len(matrix), len(matrix[0])',
  '    l, r = 0, ROWS * COLS - 1           # 1. Virtual 1D array of size M*N',
  '    while l <= r:',
  '        m = (l + r) // 2',
  '        row, col = m // COLS, m % COLS  # 2. Coordinate mapping',
  '        if matrix[row][col] == target:',
  '            return True                 # Target spotted in O(log(M*N))!',
  '        elif matrix[row][col] < target:',
  '            l = m + 1                   # Search right half',
  '        else:',
  '            r = m - 1                   # Search left half',
  '    return False'
];

export function generateSearchMatrix2DSteps(matrix: number[][], target: number): SearchMatrix2DStep[] {
  const steps: SearchMatrix2DStep[] = [];
  const ROWS = matrix.length;
  const COLS = matrix[0].length;
  let l = 0;
  let r = ROWS * COLS - 1;

  // Init step
  steps.push({
    stepIndex: 0,
    totalSteps: 0,
    matrix,
    target,
    left: l,
    right: r,
    mid: -1,
    midRow: -1,
    midCol: -1,
    midVal: null,
    found: false,
    action: 'INIT',
    headline: `Initialize Virtual 1D Binary Search: Target = ${target}`,
    subtext: `Matrix size ${ROWS}x${COLS} = ${ROWS * COLS} cells. Treating as a 1D sorted array [0 .. ${ROWS * COLS - 1}].`,
    codeLine: 2,
    variableBadges: [
      { name: 'target', value: `${target}` },
      { name: 'range', value: `[0 .. ${ROWS * COLS - 1}]` },
      { name: 'time', value: 'O(log(M*N))' }
    ],
    isComplete: false
  });

  while (l <= r) {
    const m = Math.floor((l + r) / 2);
    const row = Math.floor(m / COLS);
    const col = m % COLS;
    const val = matrix[row][col];

    if (val === target) {
      steps.push({
        stepIndex: 0,
        totalSteps: 0,
        matrix,
        target,
        left: l,
        right: r,
        mid: m,
        midRow: row,
        midCol: col,
        midVal: val,
        found: true,
        action: 'FOUND',
        headline: `Target ${target} Found at matrix[${row}][${col}]!`,
        subtext: `1D index ${m} translates to row = ${m} // ${COLS} = ${row}, col = ${m} % ${COLS} = ${col}.`,
        codeLine: 7,
        variableBadges: [
          { name: 'found at', value: `[${row}][${col}]` },
          { name: 'midVal', value: `${val}` }
        ],
        isComplete: true
      });
      return steps.map((st, idx) => ({ ...st, stepIndex: idx, totalSteps: steps.length }));
    } else if (val < target) {
      steps.push({
        stepIndex: 0,
        totalSteps: 0,
        matrix,
        target,
        left: l,
        right: r,
        mid: m,
        midRow: row,
        midCol: col,
        midVal: val,
        found: false,
        action: 'MOVE_RIGHT',
        headline: `matrix[${row}][${col}] = ${val} < ${target}: Search Right Half`,
        subtext: `Value ${val} is smaller than target ${target}. Eliminating left range [${l}..${m}]. Setting l = ${m + 1}.`,
        codeLine: 9,
        variableBadges: [
          { name: 'midVal', value: `${val}` },
          { name: 'target', value: `${target}` },
          { name: 'next l', value: `${m + 1}` }
        ],
        isComplete: false
      });
      l = m + 1;
    } else {
      steps.push({
        stepIndex: 0,
        totalSteps: 0,
        matrix,
        target,
        left: l,
        right: r,
        mid: m,
        midRow: row,
        midCol: col,
        midVal: val,
        found: false,
        action: 'MOVE_LEFT',
        headline: `matrix[${row}][${col}] = ${val} > ${target}: Search Left Half`,
        subtext: `Value ${val} is greater than target ${target}. Eliminating right range [${m}..${r}]. Setting r = ${m - 1}.`,
        codeLine: 11,
        variableBadges: [
          { name: 'midVal', value: `${val}` },
          { name: 'target', value: `${target}` },
          { name: 'next r', value: `${m - 1}` }
        ],
        isComplete: false
      });
      r = m - 1;
    }
  }

  // Not found step
  steps.push({
    stepIndex: 0,
    totalSteps: 0,
    matrix,
    target,
    left: l,
    right: r,
    mid: -1,
    midRow: -1,
    midCol: -1,
    midVal: null,
    found: false,
    action: 'NOT_FOUND',
    headline: `Target ${target} Not Present in Matrix: Return False`,
    subtext: `Pointers crossed (l=${l} > r=${r}) without discovering target ${target}.`,
    codeLine: 12,
    variableBadges: [
      { name: 'result', value: 'False' }
    ],
    isComplete: true
  });

  return steps.map((st, idx) => ({ ...st, stepIndex: idx, totalSteps: steps.length }));
}
