export interface MinCostStep {
  stepIndex: number;
  totalSteps: number;
  points: [number, number][];
  visitedPoints: number[];
  mstEdges: [number, number, number][]; // [from, to, cost]
  currentNode: number | null;
  activeEdge: [number, number] | null;
  heap: { cost: number; to: number; from: number }[];
  totalCost: number;
  headline: string;
  subtext: string;
  codeLine: number;
  variableBadges: { name: string; value: string }[];
  isComplete: boolean;
}

export const MIN_COST_CONNECT_CODE_LINES = [
  'def minCostConnectPoints(points):',
  '    N = len(points)',
  '    # Prim\'s Minimum Spanning Tree Algorithm',
  '    res, visit = 0, set()',
  '    minH = [[0, 0, -1]]  # [cost, node, parent]',
  '    while len(visit) < N:',
  '        cost, i, prev = heapq.heappop(minH)',
  '        if i in visit: continue',
  '        res += cost; visit.add(i)',
  '        for nei in range(N):',
  '            if nei not in visit:',
  '                d = abs(points[i][0]-points[nei][0]) + abs(points[i][1]-points[nei][1])',
  '                heapq.heappush(minH, [d, nei, i])',
  '    return res'
];

export function generateMinCostSteps(points: [number, number][]): MinCostStep[] {
  const steps: MinCostStep[] = [];
  const N = points.length;

  const getDist = (i: number, j: number) => {
    return Math.abs(points[i][0] - points[j][0]) + Math.abs(points[i][1] - points[j][1]);
  };

  const visit = new Set<number>();
  let totalCost = 0;
  const mstEdges: [number, number, number][] = [];

  // Heap stores { cost, to, from }
  let heap: { cost: number; to: number; from: number }[] = [
    { cost: 0, to: 0, from: -1 }
  ];

  // Step 0: Init
  steps.push({
    stepIndex: 0,
    totalSteps: 0,
    points,
    visitedPoints: [],
    mstEdges: [],
    currentNode: null,
    activeEdge: null,
    heap: [...heap],
    totalCost: 0,
    headline: `Initialize Prim's MST (${N} 2D Points)`,
    subtext: 'Using Manhattan distance |x1 - x2| + |y1 - y2|; starting at Point 0.',
    codeLine: 5,
    variableBadges: [
      { name: 'pointsCount', value: `${N}` },
      { name: 'startPoint', value: '0' }
    ],
    isComplete: false
  });

  while (visit.size < N && heap.length > 0) {
    // Sort heap to simulate PriorityQueue
    heap.sort((a, b) => a.cost - b.cost);
    const { cost, to, from } = heap.shift()!;

    if (visit.has(to)) {
      continue;
    }

    visit.add(to);
    totalCost += cost;
    if (from !== -1) {
      mstEdges.push([from, to, cost]);
    }

    steps.push({
      stepIndex: 0,
      totalSteps: 0,
      points,
      visitedPoints: Array.from(visit),
      mstEdges: [...mstEdges],
      currentNode: to,
      activeEdge: from !== -1 ? [from, to] : null,
      heap: [...heap],
      totalCost,
      headline: from === -1
        ? `Added Start Point 0 (${points[0].join(',')}) to MST`
        : `Connected Point ${to} from Point ${from} (Distance: ${cost})`,
      subtext: `Total MST cost is now ${totalCost}. Points in tree: ${visit.size}/${N}`,
      codeLine: 9,
      variableBadges: [
        { name: 'addedPoint', value: `${to}` },
        { name: 'edgeCost', value: `${cost}` },
        { name: 'currentTotal', value: `${totalCost}` }
      ],
      isComplete: false
    });

    for (let nei = 0; nei < N; nei++) {
      if (!visit.has(nei)) {
        const d = getDist(to, nei);
        heap.push({ cost: d, to: nei, from: to });
      }
    }
  }

  steps.push({
    stepIndex: 0,
    totalSteps: 0,
    points,
    visitedPoints: Array.from(visit),
    mstEdges: [...mstEdges],
    currentNode: null,
    activeEdge: null,
    heap: [],
    totalCost,
    headline: `Minimum Spanning Tree Complete! Total Cost = ${totalCost}`,
    subtext: `All ${N} points connected with minimal Manhattan distance wire.`,
    codeLine: 14,
    variableBadges: [
      { name: 'minCost', value: `${totalCost}` },
      { name: 'mstEdges', value: `${mstEdges.length}` }
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
