export interface LIPStep {
  r: number;
  c: number;
  matrix: number[][];
  memo: number[][];
  activeNeighbor: [number, number] | null;
  isValidStep: boolean;
  maxPath: number;
  explanation: string;
  codeLine: number;
  pathChain: [number, number][];
  variableBadges?: { name: string; value: string }[];
}

export const LIP_CODE_LINES = [
  'def longestIncreasingPath(matrix: List[List[int]]) -> int:',
  '    ROWS, COLS = len(matrix), len(matrix[0])',
  '    dp = {}  # (r, c) -> LIP',
  '    def dfs(r, c, prevVal):',
  '        if r < 0 or r == ROWS or c < 0 or c == COLS or matrix[r][c] <= prevVal:',
  '            return 0',
  '        if (r, c) in dp: return dp[(r, c)]',
  '        res = 1',
  '        for dr, dc in [[1,0], [-1,0], [0,1], [0,-1]]:',
  '            res = max(res, 1 + dfs(r + dr, c + dc, matrix[r][c]))',
  '        dp[(r, c)] = res',
  '        return res',
  '    for r in range(ROWS):',
  '        for c in range(COLS):',
  '            dfs(r, c, -1)',
  '    return max(dp.values())',
];

export function generateLIPSteps(matrix: number[][]): LIPStep[] {
  const steps: LIPStep[] = [];
  const rows = matrix.length;
  const cols = matrix[0]?.length || 0;

  if (rows === 0 || cols === 0) {
    steps.push({
      r: -1,
      c: -1,
      matrix: [],
      memo: [],
      activeNeighbor: null,
      isValidStep: false,
      maxPath: 0,
      explanation: 'Empty matrix has LIP of 0.',
      codeLine: 1,
      pathChain: [],
      variableBadges: [{ name: 'result', value: '0' }],
    });
    return steps;
  }

  const memo: number[][] = Array.from({ length: rows }, () =>
    new Array(cols).fill(0)
  );

  let globalMax = 1;

  steps.push({
    r: 0,
    c: 0,
    matrix,
    memo: memo.map((r) => [...r]),
    activeNeighbor: null,
    isValidStep: false,
    maxPath: 1,
    explanation: `Initialize DFS + Memoization on ${rows}x${cols} grid. dp[r][c] stores length of longest increasing path starting at (r, c).`,
    codeLine: 3,
    pathChain: [],
    variableBadges: [
      { name: 'rows', value: `${rows}` },
      { name: 'cols', value: `${cols}` },
    ],
  });

  // Sort cells by value descending to simulate DP topological order cleanly
  const cells: Array<{ r: number; c: number; val: number }> = [];
  for (let r = 0; r < rows; r++) {
    for (let c = 0; c < cols; c++) {
      cells.push({ r, c, val: matrix[r][c] });
    }
  }
  // Bottom-up topological evaluation: highest numbers first!
  cells.sort((a, b) => b.val - a.val);

  const directions = [
    [0, 1],
    [1, 0],
    [0, -1],
    [-1, 0],
  ];

  for (const cell of cells) {
    const { r, c, val } = cell;

    steps.push({
      r,
      c,
      matrix,
      memo: memo.map((row) => [...row]),
      activeNeighbor: null,
      isValidStep: false,
      maxPath: globalMax,
      explanation: `Evaluating cell (${r}, ${c}) with value ${val}. Testing 4 adjacent neighbors.`,
      codeLine: 8,
      pathChain: [[r, c]],
      variableBadges: [
        { name: 'r', value: `${r}` },
        { name: 'c', value: `${c}` },
        { name: 'val', value: `${val}` },
      ],
    });

    let bestSub = 0;
    let bestNeighbor: [number, number] | null = null;

    for (const [dr, dc] of directions) {
      const nr = r + dr;
      const nc = c + dc;
      if (nr >= 0 && nr < rows && nc >= 0 && nc < cols) {
        const nVal = matrix[nr][nc];
        const canMove = nVal > val;

        steps.push({
          r,
          c,
          matrix,
          memo: memo.map((row) => [...row]),
          activeNeighbor: [nr, nc],
          isValidStep: canMove,
          maxPath: globalMax,
          explanation: `Testing neighbor (${nr}, ${nc}) [val=${nVal}]: ${
            canMove
              ? `${nVal} > ${val} (Strictly increasing! dp[${nr}][${nc}] = ${memo[nr][nc]})`
              : `${nVal} <= ${val} (Not strictly increasing)`
          }`,
          codeLine: 9,
          pathChain: canMove ? [[r, c], [nr, nc]] : [[r, c]],
          variableBadges: [
            { name: 'curr', value: `${val}` },
            { name: 'neighbor', value: `${nVal}` },
            { name: 'increasing', value: canMove ? 'Yes' : 'No' },
          ],
        });

        if (canMove && memo[nr][nc] > bestSub) {
          bestSub = memo[nr][nc];
          bestNeighbor = [nr, nc];
        }
      }
    }

    memo[r][c] = 1 + bestSub;
    if (memo[r][c] > globalMax) {
      globalMax = memo[r][c];
    }

    steps.push({
      r,
      c,
      matrix,
      memo: memo.map((row) => [...row]),
      activeNeighbor: bestNeighbor,
      isValidStep: bestSub > 0,
      maxPath: globalMax,
      explanation: `Cell (${r}, ${c}) computed: dp[${r}][${c}] = 1 + ${bestSub} = ${memo[r][c]}. Global max is now ${globalMax}.`,
      codeLine: 10,
      pathChain: [[r, c]],
      variableBadges: [
        { name: `dp[${r}][${c}]`, value: `${memo[r][c]}` },
        { name: 'global_max', value: `${globalMax}` },
      ],
    });
  }

  // Find cell with globalMax to highlight best path
  let bestR = 0;
  let bestC = 0;
  for (let r = 0; r < rows; r++) {
    for (let c = 0; c < cols; c++) {
      if (memo[r][c] > memo[bestR][bestC]) {
        bestR = r;
        bestC = c;
      }
    }
  }

  const fullChain: [number, number][] = [[bestR, bestC]];
  let currR = bestR;
  let currC = bestC;
  while (memo[currR][currC] > 1) {
    let nextR = currR;
    let nextC = currC;
    for (const [dr, dc] of directions) {
      const nr = currR + dr;
      const nc = currC + dc;
      if (
        nr >= 0 &&
        nr < rows &&
        nc >= 0 &&
        nc < cols &&
        matrix[nr][nc] > matrix[currR][currC] &&
        memo[nr][nc] === memo[currR][currC] - 1
      ) {
        nextR = nr;
        nextC = nc;
        break;
      }
    }
    if (nextR === currR && nextC === currC) break;
    fullChain.push([nextR, nextC]);
    currR = nextR;
    currC = nextC;
  }

  // Final step
  steps.push({
    r: bestR,
    c: bestC,
    matrix,
    memo: memo.map((row) => [...row]),
    activeNeighbor: null,
    isValidStep: true,
    maxPath: globalMax,
    explanation: `Done! Longest increasing path length is ${globalMax} (Path values: [${fullChain.map(([pr, pc]) => matrix[pr][pc]).join(' -> ')}]).`,
    codeLine: 15,
    pathChain: fullChain,
    variableBadges: [{ name: 'max_path_length', value: `${globalMax}` }],
  });

  return steps;
}
