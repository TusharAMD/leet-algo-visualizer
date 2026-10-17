export interface PacificAtlanticStep {
  stepIndex: number;
  totalSteps: number;
  heights: number[][];
  pacCells: [number, number][];
  atlCells: [number, number][];
  intersectionCells: [number, number][];
  currentCell: [number, number] | null;
  currentOcean: 'PACIFIC' | 'ATLANTIC' | 'INTERSECTION';
  headline: string;
  subtext: string;
  codeLine: number;
  variableBadges: { name: string; value: string }[];
  isComplete: boolean;
}

export const PACIFIC_ATLANTIC_CODE_LINES = [
  'def pacificAtlantic(heights):',
  '    ROWS, COLS = len(heights), len(heights[0])',
  '    pac, atl = set(), set()',
  '    def dfs(r, c, visit, prevHeight):',
  '        if ((r, c) in visit or r < 0 or c < 0 or r == ROWS or c == COLS or',
  '            heights[r][c] < prevHeight):     # Flow uphill: heights[r][c] >= prevHeight',
  '            return',
  '        visit.add((r, c))',
  '        for dr, dc in [(1,0), (-1,0), (0,1), (0,-1)]:',
  '            dfs(r + dr, c + dc, visit, heights[r][c])',
  '    # Flow uphill from Pacific (top & left) and Atlantic (bottom & right)',
  '    for c in range(COLS): dfs(0, c, pac, heights[0][c]); dfs(ROWS-1, c, atl, heights[ROWS-1][c])',
  '    for r in range(ROWS): dfs(r, 0, pac, heights[r][0]); dfs(r, COLS-1, atl, heights[r][COLS-1])',
  '    return [[r, c] for r in range(ROWS) for c in range(COLS) if (r, c) in pac and (r, c) in atl]'
];

export function generatePacificAtlanticSteps(heights: number[][]): PacificAtlanticStep[] {
  const steps: PacificAtlanticStep[] = [];
  const ROWS = heights.length;
  const COLS = heights[0]?.length || 0;

  const pac = new Set<string>();
  const pacArr: [number, number][] = [];
  const atl = new Set<string>();
  const atlArr: [number, number][] = [];

  // Step 0: Initial
  steps.push({
    stepIndex: 0,
    totalSteps: 0,
    heights,
    pacCells: [],
    atlCells: [],
    intersectionCells: [],
    currentCell: null,
    currentOcean: 'PACIFIC',
    headline: `Initialize Pacific Atlantic Water Flow (${ROWS}x${COLS} Grid)`,
    subtext: 'Using reverse-flow DFS: water flows uphill (>=) from ocean borders inward.',
    codeLine: 3,
    variableBadges: [
      { name: 'pacCount', value: '0' },
      { name: 'atlCount', value: '0' }
    ],
    isComplete: false
  });

  const maxSteps = 45;

  function dfs(
    r: number,
    c: number,
    visit: Set<string>,
    visitArr: [number, number][],
    prevHeight: number,
    oceanName: 'PACIFIC' | 'ATLANTIC'
  ) {
    if (steps.length >= maxSteps) return;
    if (
      r < 0 ||
      c < 0 ||
      r >= ROWS ||
      c >= COLS ||
      visit.has(`${r},${c}`) ||
      heights[r][c] < prevHeight
    ) {
      return;
    }

    visit.add(`${r},${c}`);
    visitArr.push([r, c]);

    steps.push({
      stepIndex: 0,
      totalSteps: 0,
      heights,
      pacCells: [...pacArr],
      atlCells: [...atlArr],
      intersectionCells: [],
      currentCell: [r, c],
      currentOcean: oceanName,
      headline: `${oceanName}: Reach Cell (${r}, ${c}) [height = ${heights[r][c]} >= ${prevHeight}]`,
      subtext: `Uphill flow confirmed. Cell (${r}, ${c}) can drain to ${oceanName} Ocean.`,
      codeLine: 8,
      variableBadges: [
        { name: 'ocean', value: oceanName },
        { name: 'cell', value: `(${r},${c})` },
        { name: 'height', value: `${heights[r][c]}` }
      ],
      isComplete: false
    });

    const directions = [
      [1, 0],
      [-1, 0],
      [0, 1],
      [0, -1]
    ];
    for (const [dr, dc] of directions) {
      dfs(r + dr, c + dc, visit, visitArr, heights[r][c], oceanName);
      if (steps.length >= maxSteps) return;
    }
  }

  // Pacific BFS / DFS from top row & left col
  for (let c = 0; c < COLS; c++) {
    dfs(0, c, pac, pacArr, heights[0][c], 'PACIFIC');
    if (steps.length >= 22) break;
  }
  for (let r = 0; r < ROWS; r++) {
    dfs(r, 0, pac, pacArr, heights[r][0], 'PACIFIC');
    if (steps.length >= 24) break;
  }

  // Atlantic BFS / DFS from bottom row & right col
  for (let c = 0; c < COLS; c++) {
    dfs(ROWS - 1, c, atl, atlArr, heights[ROWS - 1][c], 'ATLANTIC');
    if (steps.length >= 35) break;
  }
  for (let r = 0; r < ROWS; r++) {
    dfs(r, COLS - 1, atl, atlArr, heights[r][COLS - 1], 'ATLANTIC');
    if (steps.length >= 38) break;
  }

  // Intersection
  const intersection: [number, number][] = [];
  for (let r = 0; r < ROWS; r++) {
    for (let c = 0; c < COLS; c++) {
      if (pac.has(`${r},${c}`) && atl.has(`${r},${c}`)) {
        intersection.push([r, c]);
      }
    }
  }

  steps.push({
    stepIndex: 0,
    totalSteps: 0,
    heights,
    pacCells: [...pacArr],
    atlCells: [...atlArr],
    intersectionCells: [...intersection],
    currentCell: null,
    currentOcean: 'INTERSECTION',
    headline: `Compute Intersection: Found ${intersection.length} Cells Flowing to BOTH Oceans!`,
    subtext: `Cells in pac ∩ atl can drain rain water to both Pacific and Atlantic oceans.`,
    codeLine: 13,
    variableBadges: [
      { name: 'bothOceans', value: `${intersection.length}` },
      { name: 'pacTotal', value: `${pac.size}` },
      { name: 'atlTotal', value: `${atl.size}` }
    ],
    isComplete: true
  });

  return steps.map((s, idx) => ({
    ...s,
    stepIndex: idx,
    totalSteps: steps.length
  }));
}
