export interface SwimInWaterStep {
  stepIndex: number;
  totalSteps: number;
  grid: number[][];
  visited: [number, number][];
  currentCell: [number, number] | null;
  currentTime: number;
  heap: { time: number; r: number; c: number }[];
  path: [number, number][];
  headline: string;
  subtext: string;
  codeLine: number;
  variableBadges: { name: string; value: string }[];
  isComplete: boolean;
  result: number;
}

export const SWIM_IN_WATER_CODE_LINES = [
  'def swimInWater(grid):',
  '    N = len(grid)',
  '    visit = {(0, 0)}',
  '    minH = [[grid[0][0], 0, 0]]  # [max_elevation, r, c]',
  '    directions = [[0, 1], [0, -1], [1, 0], [-1, 0]]',
  '    while minH:',
  '        t, r, c = heapq.heappop(minH)',
  '        if r == N - 1 and c == N - 1: return t  # Reached bottom-right',
  '        for dr, dc in directions:',
  '            nr, nc = r + dr, c + dc',
  '            if (0 <= nr < N and 0 <= nc < N and (nr, nc) not in visit):',
  '                visit.add((nr, nc))',
  '                heapq.heappush(minH, [max(t, grid[nr][nc]), nr, nc])'
];

export function generateSwimInWaterSteps(grid: number[][]): SwimInWaterStep[] {
  const steps: SwimInWaterStep[] = [];
  const N = grid.length;

  const visit = new Set<string>(['0,0']);
  const visitedArr: [number, number][] = [[0, 0]];
  let minH: { time: number; r: number; c: number }[] = [
    { time: grid[0][0], r: 0, c: 0 }
  ];

  const parentMap: { [key: string]: [number, number] } = {};

  // Step 0: Init
  steps.push({
    stepIndex: 0,
    totalSteps: 0,
    grid,
    visited: [...visitedArr],
    currentCell: [0, 0],
    currentTime: grid[0][0],
    heap: [...minH],
    path: [[0, 0]],
    headline: `Initialize Swim in Rising Water (${N}x${N} Grid)`,
    subtext: `Starting at (0, 0) with initial water level t = ${grid[0][0]}.`,
    codeLine: 4,
    variableBadges: [
      { name: 'startElevation', value: `${grid[0][0]}` },
      { name: 'gridSize', value: `${N}x${N}` }
    ],
    isComplete: false,
    result: 0
  });

  const directions = [
    [0, 1],
    [0, -1],
    [1, 0],
    [-1, 0]
  ];

  let finalTime = 0;

  function reconstructPath(r: number, c: number): [number, number][] {
    const p: [number, number][] = [];
    let curr: [number, number] | undefined = [r, c];
    while (curr) {
      p.unshift(curr);
      if (curr[0] === 0 && curr[1] === 0) break;
      curr = parentMap[`${curr[0]},${curr[1]}`];
    }
    return p;
  }

  while (minH.length > 0) {
    minH.sort((a, b) => a.time - b.time);
    const { time, r, c } = minH.shift()!;

    const curPath = reconstructPath(r, c);

    steps.push({
      stepIndex: 0,
      totalSteps: 0,
      grid,
      visited: [...visitedArr],
      currentCell: [r, c],
      currentTime: time,
      heap: [...minH],
      path: curPath,
      headline: `Swim to Cell (${r}, ${c}) [Elevation: ${grid[r][c]}, Water: ${time}]`,
      subtext: `Max water elevation required along this path is t = ${time}.`,
      codeLine: 7,
      variableBadges: [
        { name: 'cell', value: `(${r},${c})` },
        { name: 'elevation', value: `${grid[r][c]}` },
        { name: 'waterLevel (t)', value: `${time}` }
      ],
      isComplete: false,
      result: 0
    });

    if (r === N - 1 && c === N - 1) {
      finalTime = time;
      break;
    }

    for (const [dr, dc] of directions) {
      const nr = r + dr;
      const nc = c + dc;
      const key = `${nr},${nc}`;

      if (nr >= 0 && nr < N && nc >= 0 && nc < N && !visit.has(key)) {
        visit.add(key);
        visitedArr.push([nr, nc]);
        parentMap[key] = [r, c];
        const nextTime = Math.max(time, grid[nr][nc]);
        minH.push({ time: nextTime, r: nr, c: nc });

        steps.push({
          stepIndex: 0,
          totalSteps: 0,
          grid,
          visited: [...visitedArr],
          currentCell: [r, c],
          currentTime: time,
          heap: [...minH],
          path: reconstructPath(nr, nc),
          headline: `Inspect Neighbor (${nr}, ${nc}) [Elevation: ${grid[nr][nc]}]`,
          subtext: `To enter (${nr}, ${nc}), water level must rise to max(${time}, ${grid[nr][nc]}) = ${nextTime}.`,
          codeLine: 13,
          variableBadges: [
            { name: 'neighbor', value: `(${nr},${nc})` },
            { name: 'requiredT', value: `${nextTime}` },
            { name: 'heapSize', value: `${minH.length}` }
          ],
          isComplete: false,
          result: 0
        });
      }
    }
  }

  const finalPath = reconstructPath(N - 1, N - 1);

  steps.push({
    stepIndex: 0,
    totalSteps: 0,
    grid,
    visited: [...visitedArr],
    currentCell: [N - 1, N - 1],
    currentTime: finalTime,
    heap: [],
    path: finalPath,
    headline: `Reached Bottom-Right Destination at t = ${finalTime}!`,
    subtext: `Minimum water level to swim from (0, 0) to (${N - 1}, ${N - 1}) is ${finalTime}.`,
    codeLine: 8,
    variableBadges: [
      { name: 'return (minTime)', value: `${finalTime}` },
      { name: 'pathLength', value: `${finalPath.length} cells` }
    ],
    isComplete: true,
    result: finalTime
  });

  const total = steps.length;
  steps.forEach((s, idx) => {
    s.stepIndex = idx;
    s.totalSteps = total;
  });

  return steps;
}
