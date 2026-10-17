export interface SurroundedRegionsStep {
  stepIndex: number;
  totalSteps: number;
  board: string[][];
  phase: 'INIT' | 'BORDER_DFS' | 'CAPTURE_SURROUNDED' | 'RESTORE_SAFE' | 'COMPLETE';
  currentCell: [number, number] | null;
  safeCells: [number, number][];
  capturedCells: [number, number][];
  headline: string;
  subtext: string;
  codeLine: number;
  variableBadges: { name: string; value: string }[];
  isComplete: boolean;
}

export const SURROUNDED_REGIONS_CODE_LINES = [
  'def solve(board):',
  '    ROWS, COLS = len(board), len(board[0])',
  '    def capture(r, c):',
  '        if r < 0 or c < 0 or r == ROWS or c == COLS or board[r][c] != "O":',
  '            return',
  '        board[r][c] = "T"  # Mark safe (unsurrounded)',
  '        for dr, dc in [(1,0), (-1,0), (0,1), (0,-1)]:',
  '            capture(r + dr, c + dc)',
  '    # Phase 1: DFS from all border "O"s -> mark as "T"',
  '    for r in range(ROWS):',
  '        for c in range(COLS):',
  '            if board[r][c] == "O" and (r in [0, ROWS-1] or c in [0, COLS-1]):',
  '                capture(r, c)',
  '    # Phase 2: Capture trapped "O"s -> turn into "X"',
  '    for r in range(ROWS):',
  '        for c in range(COLS):',
  '            if board[r][c] == "O": board[r][c] = "X"',
  '    # Phase 3: Restore safe "T"s back to "O"',
  '    for r in range(ROWS):',
  '        for c in range(COLS):',
  '            if board[r][c] == "T": board[r][c] = "O"'
];

export function generateSurroundedRegionsSteps(initialBoard: string[][]): SurroundedRegionsStep[] {
  const steps: SurroundedRegionsStep[] = [];
  const ROWS = initialBoard.length;
  const COLS = initialBoard[0]?.length || 0;

  // Clone board
  const board: string[][] = initialBoard.map(row => [...row]);
  const safeCells: [number, number][] = [];
  const capturedCells: [number, number][] = [];

  const cloneBoard = () => board.map(row => [...row]);

  // Step 0: Init
  steps.push({
    stepIndex: 0,
    totalSteps: 0,
    board: cloneBoard(),
    phase: 'INIT',
    currentCell: null,
    safeCells: [],
    capturedCells: [],
    headline: `Initialize Board (${ROWS}x${COLS})`,
    subtext: 'Find surrounded regions by protecting boundary-connected "O"s first.',
    codeLine: 1,
    variableBadges: [
      { name: 'phase', value: 'Initialization' },
      { name: 'safeCount', value: '0' }
    ],
    isComplete: false
  });

  // Phase 1: Border DFS
  const capture = (r: number, c: number) => {
    if (r < 0 || c < 0 || r >= ROWS || c >= COLS || board[r][c] !== 'O') {
      return;
    }
    board[r][c] = 'T';
    safeCells.push([r, c]);

    steps.push({
      stepIndex: 0,
      totalSteps: 0,
      board: cloneBoard(),
      phase: 'BORDER_DFS',
      currentCell: [r, c],
      safeCells: [...safeCells],
      capturedCells: [...capturedCells],
      headline: `Phase 1: Mark Safe Cell (${r}, ${c})`,
      subtext: `Connected to border: marked as 'T' (safe from being surrounded).`,
      codeLine: 6,
      variableBadges: [
        { name: 'phase', value: 'Border Protection' },
        { name: 'curr', value: `(${r}, ${c})` },
        { name: 'safeCount', value: `${safeCells.length}` }
      ],
      isComplete: false
    });

    const directions = [[1, 0], [-1, 0], [0, 1], [0, -1]];
    for (const [dr, dc] of directions) {
      capture(r + dr, c + dc);
    }
  };

  for (let r = 0; r < ROWS; r++) {
    for (let c = 0; c < COLS; c++) {
      if (board[r][c] === 'O' && (r === 0 || r === ROWS - 1 || c === 0 || c === COLS - 1)) {
        steps.push({
          stepIndex: 0,
          totalSteps: 0,
          board: cloneBoard(),
          phase: 'BORDER_DFS',
          currentCell: [r, c],
          safeCells: [...safeCells],
          capturedCells: [...capturedCells],
          headline: `Found Border 'O' at (${r}, ${c})`,
          subtext: 'Starting DFS traversal to mark all connected "O"s as safe "T".',
          codeLine: 12,
          variableBadges: [
            { name: 'borderCell', value: `(${r}, ${c})` },
            { name: 'phase', value: 'Border Protection' }
          ],
          isComplete: false
        });
        capture(r, c);
      }
    }
  }

  // Phase 2: Capture trapped 'O's
  steps.push({
    stepIndex: 0,
    totalSteps: 0,
    board: cloneBoard(),
    phase: 'CAPTURE_SURROUNDED',
    currentCell: null,
    safeCells: [...safeCells],
    capturedCells: [...capturedCells],
    headline: 'Phase 2: Capture Trapped Regions (O -> X)',
    subtext: 'Any remaining "O" has no path to any border, so it is fully surrounded.',
    codeLine: 15,
    variableBadges: [
      { name: 'phase', value: 'Capture Surrounded' },
      { name: 'safeCount', value: `${safeCells.length}` }
    ],
    isComplete: false
  });

  for (let r = 0; r < ROWS; r++) {
    for (let c = 0; c < COLS; c++) {
      if (board[r][c] === 'O') {
        board[r][c] = 'X';
        capturedCells.push([r, c]);
        steps.push({
          stepIndex: 0,
          totalSteps: 0,
          board: cloneBoard(),
          phase: 'CAPTURE_SURROUNDED',
          currentCell: [r, c],
          safeCells: [...safeCells],
          capturedCells: [...capturedCells],
          headline: `Capture Trapped Cell (${r}, ${c})`,
          subtext: `Cell is enclosed on all 4 sides -> Flipped 'O' to 'X'.`,
          codeLine: 18,
          variableBadges: [
            { name: 'captured', value: `(${r}, ${c})` },
            { name: 'totalCaptured', value: `${capturedCells.length}` }
          ],
          isComplete: false
        });
      }
    }
  }

  // Phase 3: Restore 'T's back to 'O'
  steps.push({
    stepIndex: 0,
    totalSteps: 0,
    board: cloneBoard(),
    phase: 'RESTORE_SAFE',
    currentCell: null,
    safeCells: [...safeCells],
    capturedCells: [...capturedCells],
    headline: 'Phase 3: Restore Safe Cells (T -> O)',
    subtext: 'Restore temporary "T" markers back to valid "O" cells.',
    codeLine: 20,
    variableBadges: [
      { name: 'phase', value: 'Restore Safe' }
    ],
    isComplete: false
  });

  for (let r = 0; r < ROWS; r++) {
    for (let c = 0; c < COLS; c++) {
      if (board[r][c] === 'T') {
        board[r][c] = 'O';
      }
    }
  }

  steps.push({
    stepIndex: 0,
    totalSteps: 0,
    board: cloneBoard(),
    phase: 'COMPLETE',
    currentCell: null,
    safeCells: [...safeCells],
    capturedCells: [...capturedCells],
    headline: `Board Fully Processed: ${capturedCells.length} Cells Captured`,
    subtext: 'All enclosed "O" regions captured to "X"; border-connected "O"s preserved.',
    codeLine: 23,
    variableBadges: [
      { name: 'status', value: 'Complete' },
      { name: 'capturedCount', value: `${capturedCells.length}` },
      { name: 'safeCount', value: `${safeCells.length}` }
    ],
    isComplete: true
  });

  const total = steps.length;
  steps.forEach((s, idx) => {
    s.stepIndex = idx;
    s.totalSteps = total;
  });

  return steps;
}
