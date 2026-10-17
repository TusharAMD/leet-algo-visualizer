export interface RotateImageStep {
  phase: 'init' | 'transpose' | 'reverse_rows' | 'complete';
  matrix: number[][];
  activeCellA: [number, number] | null;
  activeCellB: [number, number] | null;
  activeRow: number | null;
  explanation: string;
  codeLine: number;
  variableBadges: { name: string; value: string }[];
}

export const ROTATE_IMAGE_CODE_LINES = [
  'def rotate(matrix: List[List[int]]) -> None:',
  '    n = len(matrix)',
  '    # Step 1: Transpose matrix (swap across main diagonal)',
  '    for i in range(n):',
  '        for j in range(i + 1, n):',
  '            matrix[i][j], matrix[j][i] = matrix[j][i], matrix[i][j]',
  '    # Step 2: Reverse each row horizontally',
  '    for i in range(n):',
  '        matrix[i].reverse()',
];

export function generateRotateImageSteps(initialMatrix: number[][]): RotateImageStep[] {
  const steps: RotateImageStep[] = [];
  const n = initialMatrix.length;
  const mat = initialMatrix.map((r) => [...r]);

  steps.push({
    phase: 'init',
    matrix: mat.map((r) => [...r]),
    activeCellA: null,
    activeCellB: null,
    activeRow: null,
    explanation: `Original ${n}x${n} matrix. We will rotate 90° clockwise in two intuitive stages: Transpose then Horizontal Reflection.`,
    codeLine: 1,
    variableBadges: [
      { name: 'n', value: `${n}` },
      { name: 'phase', value: 'Init' },
    ],
  });

  // Step 1: Transpose
  for (let i = 0; i < n; i++) {
    for (let j = i + 1; j < n; j++) {
      const temp = mat[i][j];
      mat[i][j] = mat[j][i];
      mat[j][i] = temp;

      steps.push({
        phase: 'transpose',
        matrix: mat.map((r) => [...r]),
        activeCellA: [i, j],
        activeCellB: [j, i],
        activeRow: null,
        explanation: `Transpose: Swap matrix[${i}][${j}] (${mat[j][i]}) with matrix[${j}][${i}] (${mat[i][j]}) across diagonal.`,
        codeLine: 5,
        variableBadges: [
          { name: 'i', value: `${i}` },
          { name: 'j', value: `${j}` },
          { name: 'swap', value: `(${i},${j}) <-> (${j},${i})` },
        ],
      });
    }
  }

  // Step 2: Reverse each row
  for (let i = 0; i < n; i++) {
    mat[i].reverse();
    steps.push({
      phase: 'reverse_rows',
      matrix: mat.map((r) => [...r]),
      activeCellA: null,
      activeCellB: null,
      activeRow: i,
      explanation: `Reverse row ${i}: Flip row horizontally -> [${mat[i].join(', ')}].`,
      codeLine: 8,
      variableBadges: [
        { name: 'row', value: `${i}` },
        { name: 'phase', value: 'Row Reflection' },
      ],
    });
  }

  steps.push({
    phase: 'complete',
    matrix: mat.map((r) => [...r]),
    activeCellA: null,
    activeCellB: null,
    activeRow: null,
    explanation: 'Rotation complete! Matrix is now rotated 90 degrees clockwise.',
    codeLine: 9,
    variableBadges: [
      { name: 'status', value: 'Rotated 90°' },
    ],
  });

  return steps;
}
