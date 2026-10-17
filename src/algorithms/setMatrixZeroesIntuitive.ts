export interface SetMatrixZeroesStep {
  phase: 'init' | 'scan_mark' | 'fill_inner' | 'fill_first_col' | 'fill_first_row' | 'complete';
  matrix: number[][];
  activeCell: [number, number] | null;
  rowZero: boolean;
  explanation: string;
  codeLine: number;
  variableBadges: { name: string; value: string }[];
}

export const SET_MATRIX_ZEROES_CODE_LINES = [
  'def setZeroes(matrix: List[List[int]]) -> None:',
  '    ROWS, COLS = len(matrix), len(matrix[0])',
  '    row_zero = False',
  '    # 1. Flag rows & cols using first row and first col',
  '    for r in range(ROWS):',
  '        for c in range(COLS):',
  '            if matrix[r][c] == 0:',
  '                matrix[0][c] = 0',
  '                if r > 0: matrix[r][0] = 0',
  '                else: row_zero = True',
  '    # 2. Zero out inner cells based on boundary markers',
  '    for r in range(1, ROWS):',
  '        for c in range(1, COLS):',
  '            if matrix[0][c] == 0 or matrix[r][0] == 0: matrix[r][c] = 0',
  '    # 3. Zero out first column if marked',
  '    if matrix[0][0] == 0: ...',
  '    # 4. Zero out first row if row_zero is True',
  '    if row_zero: ...',
];

export function generateSetMatrixZeroesSteps(initialMatrix: number[][]): SetMatrixZeroesStep[] {
  const steps: SetMatrixZeroesStep[] = [];
  const ROWS = initialMatrix.length;
  if (ROWS === 0) return steps;
  const COLS = initialMatrix[0].length;
  const mat = initialMatrix.map((r) => [...r]);
  let rowZero = false;

  steps.push({
    phase: 'init',
    matrix: mat.map((r) => [...r]),
    activeCell: null,
    rowZero: false,
    explanation: `Scan ${ROWS}x${COLS} matrix in-place. We will use the 1st row and 1st col as our scratch space markers, plus rowZero boolean.`,
    codeLine: 2,
    variableBadges: [
      { name: 'ROWS', value: `${ROWS}` },
      { name: 'COLS', value: `${COLS}` },
      { name: 'rowZero', value: 'False' },
    ],
  });

  // 1. Scan and mark
  for (let r = 0; r < ROWS; r++) {
    for (let c = 0; c < COLS; c++) {
      if (mat[r][c] === 0) {
        mat[0][c] = 0;
        if (r > 0) {
          mat[r][0] = 0;
        } else {
          rowZero = true;
        }
        steps.push({
          phase: 'scan_mark',
          matrix: mat.map((row) => [...row]),
          activeCell: [r, c],
          rowZero,
          explanation: `Zero found at (${r}, ${c})! Mark header matrix[0][${c}] = 0 and ${r > 0 ? `matrix[${r}][0] = 0` : 'rowZero = True'}.`,
          codeLine: 7,
          variableBadges: [
            { name: 'zero found', value: `(${r}, ${c})` },
            { name: 'rowZero', value: `${rowZero}` },
          ],
        });
      }
    }
  }

  // 2. Zero out inner cells
  for (let r = 1; r < ROWS; r++) {
    for (let c = 1; c < COLS; c++) {
      if (mat[0][c] === 0 || mat[r][0] === 0) {
        mat[r][c] = 0;
        steps.push({
          phase: 'fill_inner',
          matrix: mat.map((row) => [...row]),
          activeCell: [r, c],
          rowZero,
          explanation: `Inner cell (${r}, ${c}) has header matrix[0][${c}]=0 or matrix[${r}][0]=0. Set matrix[${r}][${c}] = 0.`,
          codeLine: 13,
          variableBadges: [
            { name: 'zeroed inner', value: `(${r}, ${c})` },
          ],
        });
      }
    }
  }

  // 3. First col
  if (mat[0][0] === 0) {
    for (let r = 0; r < ROWS; r++) {
      mat[r][0] = 0;
    }
    steps.push({
      phase: 'fill_first_col',
      matrix: mat.map((row) => [...row]),
      activeCell: [0, 0],
      rowZero,
      explanation: 'First column marker matrix[0][0] was 0. Zeroed out entire column 0.',
      codeLine: 15,
      variableBadges: [{ name: 'col 0', value: 'Zeroed' }],
    });
  }

  // 4. First row
  if (rowZero) {
    for (let c = 0; c < COLS; c++) {
      mat[0][c] = 0;
    }
    steps.push({
      phase: 'fill_first_row',
      matrix: mat.map((row) => [...row]),
      activeCell: [0, 0],
      rowZero,
      explanation: 'rowZero was True. Zeroed out entire row 0.',
      codeLine: 17,
      variableBadges: [{ name: 'row 0', value: 'Zeroed' }],
    });
  }

  steps.push({
    phase: 'complete',
    matrix: mat.map((row) => [...row]),
    activeCell: null,
    rowZero,
    explanation: 'Matrix zeroing complete in O(1) space!',
    codeLine: 17,
    variableBadges: [{ name: 'status', value: 'Complete' }],
  });

  return steps;
}
