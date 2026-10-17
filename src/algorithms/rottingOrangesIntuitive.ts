export interface RottingOrangesStep {
  stepIndex: number;
  totalSteps: number;
  grid: number[][]; // 0: empty, 1: fresh, 2: rotten
  freshCount: number;
  time: number;
  queue: [number, number][];
  activeRotten: [number, number] | null;
  justRotted: [number, number][];
  headline: string;
  subtext: string;
  codeLine: number;
  variableBadges: { name: string; value: string }[];
  isComplete: boolean;
  result: number;
}

export const ROTTING_ORANGES_CODE_LINES = [
  'def orangesRotting(grid):',
  '    ROWS, COLS = len(grid), len(grid[0])',
  '    q = deque()',
  '    time, fresh = 0, 0',
  '    # Initialize: count fresh and collect rotten orange coordinates',
  '    for r in range(ROWS):',
  '        for c in range(COLS):',
  '            if grid[r][c] == 1: fresh += 1',
  '            if grid[r][c] == 2: q.append((r, c))',
  '    directions = [[0, 1], [0, -1], [1, 0], [-1, 0]]',
  '    while q and fresh > 0: # Multi-source BFS wave',
  '        for i in range(len(q)):',
  '            r, c = q.popleft()',
  '            for dr, dc in directions:',
  '                row, col = r + dr, c + dc',
  '                if (0 <= row < ROWS and 0 <= col < COLS and',
  '                    grid[row][col] == 1):',
  '                    grid[row][col] = 2',
  '                    q.append((row, col))',
  '                    fresh -= 1',
  '        time += 1',
  '    return time if fresh == 0 else -1'
];

export function generateRottingOrangesSteps(initialGrid: number[][]): RottingOrangesStep[] {
  const steps: RottingOrangesStep[] = [];
  const ROWS = initialGrid.length;
  const COLS = initialGrid[0]?.length || 0;

  const grid: number[][] = initialGrid.map(row => [...row]);
  const cloneGrid = () => grid.map(row => [...row]);

  let fresh = 0;
  let q: [number, number][] = [];

  for (let r = 0; r < ROWS; r++) {
    for (let c = 0; c < COLS; c++) {
      if (grid[r][c] === 1) fresh++;
      if (grid[r][c] === 2) q.push([r, c]);
    }
  }

  let time = 0;

  // Step 0: Init
  steps.push({
    stepIndex: 0,
    totalSteps: 0,
    grid: cloneGrid(),
    freshCount: fresh,
    time: 0,
    queue: [...q],
    activeRotten: null,
    justRotted: [],
    headline: `Initialize Grid: ${fresh} Fresh Oranges, ${q.length} Rotten`,
    subtext: 'Using multi-source BFS where all rotten oranges contaminate neighbors simultaneously each minute.',
    codeLine: 4,
    variableBadges: [
      { name: 'time', value: '0' },
      { name: 'fresh', value: `${fresh}` },
      { name: 'queueLen', value: `${q.length}` }
    ],
    isComplete: false,
    result: 0
  });

  const directions = [[0, 1], [0, -1], [1, 0], [-1, 0]];

  while (q.length > 0 && fresh > 0) {
    const qLen = q.length;
    const nextQ: [number, number][] = [];
    const justRottedThisMinute: [number, number][] = [];

    steps.push({
      stepIndex: 0,
      totalSteps: 0,
      grid: cloneGrid(),
      freshCount: fresh,
      time,
      queue: [...q],
      activeRotten: null,
      justRotted: [],
      headline: `Minute ${time} -> ${time + 1}: Expanding Rotten Wave`,
      subtext: `Processing ${qLen} rotten source(s) in parallel.`,
      codeLine: 11,
      variableBadges: [
        { name: 'minute', value: `${time}` },
        { name: 'sources', value: `${qLen}` },
        { name: 'freshRemaining', value: `${fresh}` }
      ],
      isComplete: false,
      result: 0
    });

    for (let i = 0; i < qLen; i++) {
      const [r, c] = q[i];

      steps.push({
        stepIndex: 0,
        totalSteps: 0,
        grid: cloneGrid(),
        freshCount: fresh,
        time,
        queue: q.slice(i),
        activeRotten: [r, c],
        justRotted: [...justRottedThisMinute],
        headline: `Rotten Orange at (${r}, ${c}) Infects 4-Neighbors`,
        subtext: 'Checking adjacent up/down/left/right cells for fresh oranges.',
        codeLine: 13,
        variableBadges: [
          { name: 'curr', value: `(${r}, ${c})` },
          { name: 'fresh', value: `${fresh}` },
          { name: 'time', value: `${time}` }
        ],
        isComplete: false,
        result: 0
      });

      for (const [dr, dc] of directions) {
        const nr = r + dr;
        const nc = c + dc;
        if (nr >= 0 && nr < ROWS && nc >= 0 && nc < COLS && grid[nr][nc] === 1) {
          grid[nr][nc] = 2;
          nextQ.push([nr, nc]);
          fresh--;
          justRottedThisMinute.push([nr, nc]);

          steps.push({
            stepIndex: 0,
            totalSteps: 0,
            grid: cloneGrid(),
            freshCount: fresh,
            time,
            queue: [...q.slice(i + 1), ...nextQ],
            activeRotten: [r, c],
            justRotted: [[nr, nc]],
            headline: `Fresh Orange at (${nr}, ${nc}) Contaminated!`,
            subtext: `Orange turned rotten; added to queue for next minute. Fresh left: ${fresh}`,
            codeLine: 18,
            variableBadges: [
              { name: 'infected', value: `(${nr}, ${nc})` },
              { name: 'fresh', value: `${fresh}` },
              { name: 'minute', value: `${time}` }
            ],
            isComplete: false,
            result: 0
          });
        }
      }
    }

    q = nextQ;
    time++;
  }

  const finalResult = fresh === 0 ? time : -1;

  steps.push({
    stepIndex: 0,
    totalSteps: 0,
    grid: cloneGrid(),
    freshCount: fresh,
    time,
    queue: [],
    activeRotten: null,
    justRotted: [],
    headline: fresh === 0
      ? `All Oranges Rotted in ${time} Minutes!`
      : `Impossible! ${fresh} fresh orange(s) unreachable (-1).`,
    subtext: fresh === 0
      ? `Successfully simulated multi-source BFS until 0 fresh oranges remain.`
      : `Isolated fresh oranges cannot be reached by rotting contamination wave.`,
    codeLine: 22,
    variableBadges: [
      { name: 'return', value: `${finalResult}` },
      { name: 'freshLeft', value: `${fresh}` },
      { name: 'totalMinutes', value: `${time}` }
    ],
    isComplete: true,
    result: finalResult
  });

  const total = steps.length;
  steps.forEach((s, idx) => {
    s.stepIndex = idx;
    s.totalSteps = total;
  });

  return steps;
}
