export interface UniquePathsStep {
  r: number;
  c: number;
  grid: number[][];
  fromTop: number;
  fromLeft: number;
  cellVal: number;
  explanation: string;
  codeLine: number;
  variableBadges?: { name: string; value: string }[];
}

export const UNIQUE_PATHS_CODE_LINES = [
  'def uniquePaths(m: int, n: int) -> int:',
  '    dp = [[1] * n for _ in range(m)]',
  '    for r in range(1, m):',
  '        for c in range(1, n):',
  '            dp[r][c] = dp[r - 1][c] + dp[r][c - 1]',
  '    return dp[m - 1][n - 1]',
];

export function generateUniquePathsSteps(m: number, n: number): UniquePathsStep[] {
  const steps: UniquePathsStep[] = [];
  const grid: number[][] = Array.from({ length: m }, () => new Array(n).fill(1));

  // Initial step: base case
  steps.push({
    r: 0,
    c: 0,
    grid: grid.map((row) => [...row]),
    fromTop: 0,
    fromLeft: 0,
    cellVal: 1,
    explanation: `Initialize ${m}x${n} grid. Any cell along the top row (r=0) or left column (c=0) has exactly 1 unique path (moving only Right or only Down).`,
    codeLine: 1,
    variableBadges: [
      { name: 'm', value: `${m}` },
      { name: 'n', value: `${n}` },
      { name: 'base_cases', value: '1' },
    ],
  });

  for (let r = 1; r < m; r++) {
    for (let c = 1; c < n; c++) {
      const topVal = grid[r - 1][c];
      const leftVal = grid[r][c - 1];

      steps.push({
        r,
        c,
        grid: grid.map((row) => [...row]),
        fromTop: topVal,
        fromLeft: leftVal,
        cellVal: grid[r][c],
        explanation: `Cell (${r}, ${c}): Paths from above = dp[${r - 1}][${c}] (${topVal}), paths from left = dp[${r}][${c - 1}] (${leftVal}).`,
        codeLine: 3,
        variableBadges: [
          { name: 'r', value: `${r}` },
          { name: 'c', value: `${c}` },
          { name: 'top', value: `${topVal}` },
          { name: 'left', value: `${leftVal}` },
        ],
      });

      grid[r][c] = topVal + leftVal;

      steps.push({
        r,
        c,
        grid: grid.map((row) => [...row]),
        fromTop: topVal,
        fromLeft: leftVal,
        cellVal: grid[r][c],
        explanation: `Updated dp[${r}][${c}] = ${topVal} + ${leftVal} = ${grid[r][c]} unique paths.`,
        codeLine: 4,
        variableBadges: [
          { name: `dp[${r}][${c}]`, value: `${grid[r][c]}` },
        ],
      });
    }
  }

  // Final step
  const finalAns = grid[m - 1][n - 1];
  steps.push({
    r: m - 1,
    c: n - 1,
    grid: grid.map((row) => [...row]),
    fromTop: m > 1 ? grid[m - 2][n - 1] : 0,
    fromLeft: n > 1 ? grid[m - 1][n - 2] : 0,
    cellVal: finalAns,
    explanation: `Destination reached at (${m - 1}, ${n - 1})! Total unique paths = ${finalAns}.`,
    codeLine: 5,
    variableBadges: [{ name: 'result', value: `${finalAns}` }],
  });

  return steps;
}
