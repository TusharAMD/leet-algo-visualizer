export interface IslandCell {
  r: number;
  c: number;
  val: '1' | '0';
  status: 'water' | 'land' | 'scanning' | 'sinking' | 'sunken';
  islandId?: number;
}

export interface NumIslandsStep {
  stepIndex: number;
  totalSteps: number;
  grid: IslandCell[][];
  currR: number;
  currC: number;
  action: 'scan' | 'found_land' | 'sinking' | 'complete';
  islandsCount: number;
  headline: string;
  subtext: string;
  codeLine: number;
  variableBadges: { name: string; value: string }[];
  isComplete: boolean;
}

export const NUM_ISLANDS_CODE_LINES = [
  'def numIslands(grid):',
  '    if not grid: return 0',
  '    rows, cols = len(grid), len(grid[0])',
  '    islands = 0',
  '    def dfs(r, c):',
  '        if r < 0 or r >= rows or c < 0 or c >= cols or grid[r][c] != "1":',
  '            return',
  '        grid[r][c] = "0"  # Sink this land cell into water',
  '        dfs(r + 1, c); dfs(r - 1, c); dfs(r, c + 1); dfs(r, c - 1)',
  '    for r in range(rows):',
  '        for c in range(cols):',
  '            if grid[r][c] == "1":',
  '                islands += 1  # Found brand new island!',
  '                dfs(r, c)     # Flood fill sink connected land',
  '    return islands'
];

export function generateNumIslandsSteps(initialMatrix: string[][]): NumIslandsStep[] {
  const steps: NumIslandsStep[] = [];
  const rows = initialMatrix.length;
  const cols = initialMatrix[0].length;

  let gridState: IslandCell[][] = initialMatrix.map((row, r) =>
    row.map((val, c) => ({
      r,
      c,
      val: val as '1' | '0',
      status: val === '1' ? 'land' : 'water'
    }))
  );

  let islandsCount = 0;

  // Step 0: Initial
  steps.push({
    stepIndex: 0,
    totalSteps: 0,
    grid: JSON.parse(JSON.stringify(gridState)),
    currR: 0,
    currC: 0,
    action: 'scan',
    islandsCount: 0,
    headline: `Initialize Grid Scan (${rows}x${cols})`,
    subtext: `We iterate row-by-row. When we discover an unvisited '1', we increment islands count and flood-fill sink the entire landmass.`,
    codeLine: 1,
    variableBadges: [
      { name: 'rows', value: `${rows}` },
      { name: 'cols', value: `${cols}` },
      { name: 'islands', value: '0' }
    ],
    isComplete: false
  });

  function cloneGrid(): IslandCell[][] {
    return JSON.parse(JSON.stringify(gridState));
  }

  function dfs(r: number, c: number, islandId: number) {
    if (r < 0 || r >= rows || c < 0 || c >= cols || gridState[r][c].val !== '1') {
      return;
    }

    // Sink cell
    gridState[r][c].val = '0';
    gridState[r][c].status = 'sunken';
    gridState[r][c].islandId = islandId;

    steps.push({
      stepIndex: steps.length,
      totalSteps: 0,
      grid: cloneGrid(),
      currR: r,
      currC: c,
      action: 'sinking',
      islandsCount,
      headline: `Flood Fill Sink: cell (${r}, ${c}) of Island #${islandId}`,
      subtext: `Converted land '1' to sunken '0' so it cannot be counted multiple times. Expanding 4 neighbors.`,
      codeLine: 7,
      variableBadges: [
        { name: 'sunk_cell', value: `(${r}, ${c})` },
        { name: 'island_id', value: `#${islandId}` }
      ],
      isComplete: false
    });

    dfs(r + 1, c, islandId);
    dfs(r - 1, c, islandId);
    dfs(r, c + 1, islandId);
    dfs(r, c - 1, islandId);
  }

  for (let r = 0; r < rows; r++) {
    for (let c = 0; c < cols; c++) {
      if (gridState[r][c].val === '1') {
        islandsCount++;

        steps.push({
          stepIndex: steps.length,
          totalSteps: 0,
          grid: cloneGrid(),
          currR: r,
          currC: c,
          action: 'found_land',
          islandsCount,
          headline: `🏝️ Found New Island #${islandsCount} at (${r}, ${c})!`,
          subtext: `Unvisited land detected. Incrementing island count to ${islandsCount} and starting DFS flood fill.`,
          codeLine: 12,
          variableBadges: [
            { name: 'new_island', value: `#${islandsCount}` },
            { name: 'root_cell', value: `(${r}, ${c})` }
          ],
          isComplete: false
        });

        dfs(r, c, islandsCount);
      }
    }
  }

  // Complete step
  steps.push({
    stepIndex: steps.length,
    totalSteps: 0,
    grid: cloneGrid(),
    currR: rows - 1,
    currC: cols - 1,
    action: 'complete',
    islandsCount,
    headline: `🎉 Grid Traversal Complete: Total ${islandsCount} Distinct Islands!`,
    subtext: `Each cell visited at most once for O(m * n) time and O(m * n) recursion stack space.`,
    codeLine: 14,
    variableBadges: [
      { name: 'total_islands', value: `${islandsCount}` },
      { name: 'time', value: 'O(m · n)' },
      { name: 'space', value: 'O(m · n)' }
    ],
    isComplete: true
  });

  const total = steps.length;
  steps.forEach((s) => (s.totalSteps = total));
  return steps;
}
