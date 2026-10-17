export const INF = 2147483647;

export interface WallsAndGatesStep {
  stepIndex: number;
  totalSteps: number;
  rooms: number[][];
  queue: [number, number][];
  currentCell: [number, number] | null;
  justFilled: [number, number][];
  distance: number;
  headline: string;
  subtext: string;
  codeLine: number;
  variableBadges: { name: string; value: string }[];
  isComplete: boolean;
}

export const WALLS_AND_GATES_CODE_LINES = [
  'def wallsAndGates(rooms):',
  '    ROWS, COLS = len(rooms), len(rooms[0])',
  '    q = deque()',
  '    INF = 2147483647',
  '    # Step 1: Collect all gates (0) as simultaneous BFS starting points',
  '    for r in range(ROWS):',
  '        for c in range(COLS):',
  '            if rooms[r][c] == 0: q.append((r, c))',
  '    # Step 2: Multi-source BFS spreading outward wave by wave',
  '    directions = [(1, 0), (-1, 0), (0, 1), (0, -1)]',
  '    while q:',
  '        r, c = q.popleft()',
  '        for dr, dc in directions:',
  '            nr, nc = r + dr, c + dc',
  '            if 0 <= nr < ROWS and 0 <= nc < COLS and rooms[nr][nc] == INF:',
  '                rooms[nr][nc] = rooms[r][c] + 1',
  '                q.append((nr, nc))'
];

export function generateWallsAndGatesSteps(initialRooms: number[][]): WallsAndGatesStep[] {
  const steps: WallsAndGatesStep[] = [];
  const ROWS = initialRooms.length;
  const COLS = initialRooms[0]?.length || 0;

  const rooms: number[][] = initialRooms.map(row => [...row]);
  const cloneRooms = () => rooms.map(row => [...row]);

  const q: [number, number][] = [];

  for (let r = 0; r < ROWS; r++) {
    for (let c = 0; c < COLS; c++) {
      if (rooms[r][c] === 0) {
        q.push([r, c]);
      }
    }
  }

  // Step 0: Init
  steps.push({
    stepIndex: 0,
    totalSteps: 0,
    rooms: cloneRooms(),
    queue: [...q],
    currentCell: null,
    justFilled: [],
    distance: 0,
    headline: `Initialize Grid: Found ${q.length} Gate(s)`,
    subtext: 'Using multi-source BFS: all gates expand outward simultaneously with distance increments.',
    codeLine: 5,
    variableBadges: [
      { name: 'gatesCount', value: `${q.length}` },
      { name: 'queueSize', value: `${q.length}` }
    ],
    isComplete: false
  });

  const directions = [
    [1, 0],
    [-1, 0],
    [0, 1],
    [0, -1]
  ];

  while (q.length > 0) {
    const [r, c] = q.shift()!;
    const currDist = rooms[r][c];

    steps.push({
      stepIndex: 0,
      totalSteps: 0,
      rooms: cloneRooms(),
      queue: [...q],
      currentCell: [r, c],
      justFilled: [],
      distance: currDist,
      headline: `Visit Cell (${r}, ${c}) with Distance ${currDist}`,
      subtext: 'Inspecting 4 adjacent neighbors (walls: -1, empty rooms: INF).',
      codeLine: 12,
      variableBadges: [
        { name: 'curr', value: `(${r}, ${c})` },
        { name: 'dist', value: `${currDist}` },
        { name: 'queue', value: `${q.length}` }
      ],
      isComplete: false
    });

    for (const [dr, dc] of directions) {
      const nr = r + dr;
      const nc = c + dc;

      if (nr >= 0 && nr < ROWS && nc >= 0 && nc < COLS && rooms[nr][nc] === INF) {
        rooms[nr][nc] = currDist + 1;
        q.push([nr, nc]);

        steps.push({
          stepIndex: 0,
          totalSteps: 0,
          rooms: cloneRooms(),
          queue: [...q],
          currentCell: [r, c],
          justFilled: [[nr, nc]],
          distance: currDist + 1,
          headline: `Fill Empty Room (${nr}, ${nc}) -> Distance ${currDist + 1}`,
          subtext: `Nearest gate is ${currDist + 1} steps away; enqueued for next expansion wave.`,
          codeLine: 16,
          variableBadges: [
            { name: 'neighbor', value: `(${nr}, ${nc})` },
            { name: 'newDist', value: `${currDist + 1}` },
            { name: 'queue', value: `${q.length}` }
          ],
          isComplete: false
        });
      }
    }
  }

  // Completion
  let filledRooms = 0;
  for (let r = 0; r < ROWS; r++) {
    for (let c = 0; c < COLS; c++) {
      if (rooms[r][c] > 0 && rooms[r][c] < INF) filledRooms++;
    }
  }

  steps.push({
    stepIndex: 0,
    totalSteps: 0,
    rooms: cloneRooms(),
    queue: [],
    currentCell: null,
    justFilled: [],
    distance: 0,
    headline: `Multi-Source BFS Complete! ${filledRooms} Rooms Filled`,
    subtext: 'Every reachable empty room has been labeled with minimum distance to its closest gate.',
    codeLine: 17,
    variableBadges: [
      { name: 'status', value: 'Complete' },
      { name: 'filledRooms', value: `${filledRooms}` }
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
