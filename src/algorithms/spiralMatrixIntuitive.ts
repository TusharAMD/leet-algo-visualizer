export interface SpiralMatrixStep {
  currentCell: [number, number] | null;
  direction: 'right' | 'down' | 'left' | 'up' | 'none';
  left: number;
  right: number;
  top: number;
  bottom: number;
  result: number[];
  visitedCells: string[]; // "r,c"
  explanation: string;
  codeLine: number;
  matrix: number[][];
  variableBadges: { name: string; value: string }[];
}

export const SPIRAL_MATRIX_CODE_LINES = [
  'def spiralOrder(matrix: List[List[int]]) -> List[int]:',
  '    res = []',
  '    left, right = 0, len(matrix[0]) - 1',
  '    top, bottom = 0, len(matrix) - 1',
  '    while left <= right and top <= bottom:',
  '        for col in range(left, right + 1): res.append(matrix[top][col])',
  '        top += 1',
  '        for row in range(top, bottom + 1): res.append(matrix[row][right])',
  '        right -= 1',
  '        if top <= bottom:',
  '            for col in range(right, left - 1, -1): res.append(matrix[bottom][col])',
  '            bottom -= 1',
  '        if left <= right:',
  '            for row in range(bottom, top - 1, -1): res.append(matrix[row][left])',
  '            left += 1',
  '    return res',
];

export function generateSpiralMatrixSteps(matrix: number[][]): SpiralMatrixStep[] {
  const steps: SpiralMatrixStep[] = [];
  const m = matrix.length;
  if (m === 0) return steps;
  const n = matrix[0].length;

  let left = 0;
  let right = n - 1;
  let top = 0;
  let bottom = m - 1;
  const res: number[] = [];
  const visited: string[] = [];

  steps.push({
    currentCell: null,
    direction: 'none',
    left,
    right,
    top,
    bottom,
    result: [],
    visitedCells: [],
    explanation: `Start spiral traversal on ${m}x${n} grid. Boundaries initialized: left=0, right=${right}, top=0, bottom=${bottom}.`,
    codeLine: 4,
    matrix,
    variableBadges: [
      { name: 'left', value: `${left}` },
      { name: 'right', value: `${right}` },
      { name: 'top', value: `${top}` },
      { name: 'bottom', value: `${bottom}` },
    ],
  });

  while (left <= right && top <= bottom) {
    // 1. Traverse right
    for (let c = left; c <= right; c++) {
      res.push(matrix[top][c]);
      visited.push(`${top},${c}`);
      steps.push({
        currentCell: [top, c],
        direction: 'right',
        left,
        right,
        top,
        bottom,
        result: [...res],
        visitedCells: [...visited],
        explanation: `Moving RIGHT along top row ${top}: read matrix[${top}][${c}] = ${matrix[top][c]}.`,
        codeLine: 5,
        matrix,
        variableBadges: [
          { name: 'val', value: `${matrix[top][c]}` },
          { name: 'dir', value: 'RIGHT' },
          { name: 'res count', value: `${res.length}` },
        ],
      });
    }
    top++;

    // 2. Traverse down
    for (let r = top; r <= bottom; r++) {
      res.push(matrix[r][right]);
      visited.push(`${r},${right}`);
      steps.push({
        currentCell: [r, right],
        direction: 'down',
        left,
        right,
        top,
        bottom,
        result: [...res],
        visitedCells: [...visited],
        explanation: `Moving DOWN along right column ${right}: read matrix[${r}][${right}] = ${matrix[r][right]}.`,
        codeLine: 7,
        matrix,
        variableBadges: [
          { name: 'val', value: `${matrix[r][right]}` },
          { name: 'dir', value: 'DOWN' },
          { name: 'res count', value: `${res.length}` },
        ],
      });
    }
    right--;

    // 3. Traverse left (if still within row bounds)
    if (top <= bottom) {
      for (let c = right; c >= left; c--) {
        res.push(matrix[bottom][c]);
        visited.push(`${bottom},${c}`);
        steps.push({
          currentCell: [bottom, c],
          direction: 'left',
          left,
          right,
          top,
          bottom,
          result: [...res],
          visitedCells: [...visited],
          explanation: `Moving LEFT along bottom row ${bottom}: read matrix[${bottom}][${c}] = ${matrix[bottom][c]}.`,
          codeLine: 10,
          matrix,
          variableBadges: [
            { name: 'val', value: `${matrix[bottom][c]}` },
            { name: 'dir', value: 'LEFT' },
            { name: 'res count', value: `${res.length}` },
          ],
        });
      }
      bottom--;
    }

    // 4. Traverse up (if still within column bounds)
    if (left <= right) {
      for (let r = bottom; r >= top; r--) {
        res.push(matrix[r][left]);
        visited.push(`${r},${left}`);
        steps.push({
          currentCell: [r, left],
          direction: 'up',
          left,
          right,
          top,
          bottom,
          result: [...res],
          visitedCells: [...visited],
          explanation: `Moving UP along left column ${left}: read matrix[${r}][${left}] = ${matrix[r][left]}.`,
          codeLine: 13,
          matrix,
          variableBadges: [
            { name: 'val', value: `${matrix[r][left]}` },
            { name: 'dir', value: 'UP' },
            { name: 'res count', value: `${res.length}` },
          ],
        });
      }
      left++;
    }
  }

  steps.push({
    currentCell: null,
    direction: 'none',
    left,
    right,
    top,
    bottom,
    result: [...res],
    visitedCells: [...visited],
    explanation: `Spiral traversal complete! Collected all ${res.length} elements: [${res.join(', ')}].`,
    codeLine: 15,
    matrix,
    variableBadges: [
      { name: 'result', value: `[${res.join(', ')}]` },
      { name: 'status', value: 'Complete' },
    ],
  });

  return steps;
}
