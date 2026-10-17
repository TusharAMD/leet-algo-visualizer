export interface MaxAreaOfIslandStep {
  stepIndex: number;
  totalSteps: number;
  grid: number[][];
  currentCell: [number, number] | null;
  activeIslandCells: [number, number][];
  visitedCells: [number, number][];
  currentArea: number;
  maxArea: number;
  islandCount: number;
  headline: string;
  subtext: string;
  codeLine: number;
  variableBadges: { name: string; value: string }[];
  isComplete: boolean;
}

export const MAX_AREA_CODE_LINES = [
  'def maxAreaOfIsland(grid):',
  '    ROWS, COLS = len(grid), len(grid[0])',
  '    visit = set()',
  '    def dfs(r, c):',
  '        if (r < 0 or r == ROWS or c < 0 or c == COLS or',
  '            grid[r][c] == 0 or (r, c) in visit):',
  '            return 0',
  '        visit.add((r, c))',
  '        return 1 + dfs(r + 1, c) + dfs(r - 1, c) + dfs(r, c + 1) + dfs(r, c - 1)',
  '    area = 0',
  '    for r in range(ROWS):',
  '        for c in range(COLS):',
  '            if grid[r][c] == 1 and (r, c) not in visit:',
  '                area = max(area, dfs(r, c))',
  '    return area'
];

export function generateMaxAreaSteps(grid: number[][]): MaxAreaOfIslandStep[] {
  const steps: MaxAreaOfIslandStep[] = [];
  const ROWS = grid.length;
  const COLS = grid[0]?.length || 0;

  const visit = new Set<string>();
  const visitedArr: [number, number][] = [];
  let maxArea = 0;
  let islandCount = 0;

  // Step 0: Initial
  steps.push({
    stepIndex: 0,
    totalSteps: 0,
    grid,
    currentCell: null,
    activeIslandCells: [],
    visitedCells: [],
    currentArea: 0,
    maxArea: 0,
    islandCount: 0,
    headline: `Initialize Max Area of Island (${ROWS}x${COLS} Grid)`,
    subtext: 'Scanning matrix for unvisited land cells (1). Connected components counted via 4-directional DFS.',
    codeLine: 2,
    variableBadges: [
      { name: 'maxArea', value: '0' },
      { name: 'gridSize', value: `${ROWS}x${COLS}` }
    ],
    isComplete: false
  });

  const maxSteps = 45;

  for (let r = 0; r < ROWS; r++) {
    for (let c = 0; c < COLS; c++) {
      if (grid[r][c] === 1 && !visit.has(`${r},${c}`)) {
        islandCount++;
        const currentIsland: [number, number][] = [];

        function dfs(cr: number, cc: number): number {
          if (steps.length >= maxSteps) return 0;
          if (
            cr < 0 ||
            cr >= ROWS ||
            cc < 0 ||
            cc >= COLS ||
            grid[cr][cc] === 0 ||
            visit.has(`${cr},${cc}`)
          ) {
            return 0;
          }

          visit.add(`${cr},${cc}`);
          visitedArr.push([cr, cc]);
          currentIsland.push([cr, cc]);

          steps.push({
            stepIndex: 0,
            totalSteps: 0,
            grid,
            currentCell: [cr, cc],
            activeIslandCells: [...currentIsland],
            visitedCells: [...visitedArr],
            currentArea: currentIsland.length,
            maxArea,
            islandCount,
            headline: `Island #${islandCount}: Explore cell (${cr}, ${cc}) -> Area so far = ${currentIsland.length}`,
            subtext: `Marked land as visited. Searching 4 neighbors (up, down, left, right).`,
            codeLine: 8,
            variableBadges: [
              { name: 'cell', value: `(${cr},${cc})` },
              { name: 'currentArea', value: `${currentIsland.length}` },
              { name: 'maxArea', value: `${maxArea}` }
            ],
            isComplete: false
          });

          return 1 + dfs(cr + 1, cc) + dfs(cr - 1, cc) + dfs(cr, cc + 1) + dfs(cr, cc - 1);
        }

        const area = dfs(r, c);
        const previousMax = maxArea;
        maxArea = Math.max(maxArea, area);

        steps.push({
          stepIndex: 0,
          totalSteps: 0,
          grid,
          currentCell: null,
          activeIslandCells: [...currentIsland],
          visitedCells: [...visitedArr],
          currentArea: area,
          maxArea,
          islandCount,
          headline: `Island #${islandCount} Completed! Total Area = ${area}`,
          subtext:
            area > previousMax
              ? `New Max Area record: ${area} (previous was ${previousMax})!`
              : `Area ${area} does not exceed current record (${maxArea}).`,
          codeLine: 14,
          variableBadges: [
            { name: 'islandArea', value: `${area}` },
            { name: 'maxArea', value: `${maxArea}` }
          ],
          isComplete: false
        });

        if (steps.length >= maxSteps) break;
      }
    }
    if (steps.length >= maxSteps) break;
  }

  // Done
  steps.push({
    stepIndex: 0,
    totalSteps: 0,
    grid,
    currentCell: null,
    activeIslandCells: [],
    visitedCells: [...visitedArr],
    currentArea: 0,
    maxArea,
    islandCount,
    headline: `Finished! Maximum Area of Island = ${maxArea}`,
    subtext: `Analyzed ${islandCount} islands. Returned maximum connected land area of ${maxArea}.`,
    codeLine: 15,
    variableBadges: [
      { name: 'maxArea', value: `${maxArea}` },
      { name: 'totalIslands', value: `${islandCount}` }
    ],
    isComplete: true
  });

  return steps.map((s, idx) => ({
    ...s,
    stepIndex: idx,
    totalSteps: steps.length
  }));
}
