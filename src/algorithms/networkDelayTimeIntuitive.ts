export interface NetworkDelayStep {
  stepIndex: number;
  totalSteps: number;
  n: number;
  k: number;
  times: [number, number, number][] ; // [u, v, w]
  distances: { [node: number]: number };
  visited: number[];
  minHeap: { time: number; node: number }[];
  currentNode: number | null;
  activeEdge: [number, number] | null;
  maxTime: number;
  headline: string;
  subtext: string;
  codeLine: number;
  variableBadges: { name: string; value: string }[];
  isComplete: boolean;
  result: number;
}

export const NETWORK_DELAY_CODE_LINES = [
  'def networkDelayTime(times, n, k):',
  '    # Dijkstra\'s Shortest Path Algorithm',
  '    edges = collections.defaultdict(list)',
  '    for u, v, w in times: edges[u].append((v, w))',
  '    minHeap = [(0, k)]  # (time_cost, node)',
  '    visit = {}',
  '    while minHeap:',
  '        t, u = heapq.heappop(minHeap)',
  '        if u in visit: continue',
  '        visit[u] = t',
  '        for v, weight in edges[u]:',
  '            if v not in visit:',
  '                heapq.heappush(minHeap, (t + weight, v))',
  '    return max(visit.values()) if len(visit) == n else -1'
];

export function generateNetworkDelaySteps(
  times: [number, number, number][],
  n: number,
  k: number
): NetworkDelayStep[] {
  const steps: NetworkDelayStep[] = [];

  const edges: { [u: number]: [number, number][] } = {};
  for (let i = 1; i <= n; i++) edges[i] = [];
  for (const [u, v, w] of times) {
    if (!edges[u]) edges[u] = [];
    edges[u].push([v, w]);
  }

  const distances: { [node: number]: number } = {};
  for (let i = 1; i <= n; i++) distances[i] = Infinity;
  distances[k] = 0;

  const visit = new Map<number, number>();
  let minHeap: { time: number; node: number }[] = [{ time: 0, node: k }];
  let maxTime = 0;

  // Step 0: Init
  steps.push({
    stepIndex: 0,
    totalSteps: 0,
    n,
    k,
    times,
    distances: { ...distances },
    visited: [],
    minHeap: [...minHeap],
    currentNode: null,
    activeEdge: null,
    maxTime: 0,
    headline: `Initialize Dijkstra: Signal broadcasts from Node ${k}`,
    subtext: `Starting with Node ${k} at time 0; all other ${n - 1} nodes initially at ∞ distance.`,
    codeLine: 5,
    variableBadges: [
      { name: 'source', value: `${k}` },
      { name: 'totalNodes', value: `${n}` },
      { name: 'heapSize', value: '1' }
    ],
    isComplete: false,
    result: 0
  });

  while (minHeap.length > 0) {
    minHeap.sort((a, b) => a.time - b.time);
    const { time, node } = minHeap.shift()!;

    if (visit.has(node)) {
      continue;
    }

    visit.set(node, time);
    distances[node] = time;
    maxTime = Math.max(maxTime, time);

    steps.push({
      stepIndex: 0,
      totalSteps: 0,
      n,
      k,
      times,
      distances: { ...distances },
      visited: Array.from(visit.keys()),
      minHeap: [...minHeap],
      currentNode: node,
      activeEdge: null,
      maxTime,
      headline: `Node ${node} Reached in ${time} ms`,
      subtext: `Shortest travel time to node ${node} locked in. Visited: ${visit.size}/${n}`,
      codeLine: 9,
      variableBadges: [
        { name: 'visitedNode', value: `${node}` },
        { name: 'timeToNode', value: `${time} ms` },
        { name: 'maxTimeSoFar', value: `${maxTime} ms` }
      ],
      isComplete: false,
      result: 0
    });

    for (const [neighbor, weight] of edges[node] || []) {
      if (!visit.has(neighbor)) {
        const newDist = time + weight;
        minHeap.push({ time: newDist, node: neighbor });

        if (newDist < distances[neighbor]) {
          distances[neighbor] = newDist;
        }

        steps.push({
          stepIndex: 0,
          totalSteps: 0,
          n,
          k,
          times,
          distances: { ...distances },
          visited: Array.from(visit.keys()),
          minHeap: [...minHeap],
          currentNode: node,
          activeEdge: [node, neighbor],
          maxTime,
          headline: `Propagate Signal: ${node} &rarr; ${neighbor} (Travel +${weight} ms)`,
          subtext: `Candidate arrival at Node ${neighbor} is ${newDist} ms; pushed to priority queue.`,
          codeLine: 12,
          variableBadges: [
            { name: 'edge', value: `${node}&rarr;${neighbor}` },
            { name: 'arrivalCandidate', value: `${newDist} ms` },
            { name: 'heapSize', value: `${minHeap.length}` }
          ],
          isComplete: false,
          result: 0
        });
      }
    }
  }

  const allReached = visit.size === n;
  const finalResult = allReached ? maxTime : -1;

  steps.push({
    stepIndex: 0,
    totalSteps: 0,
    n,
    k,
    times,
    distances: { ...distances },
    visited: Array.from(visit.keys()),
    minHeap: [],
    currentNode: null,
    activeEdge: null,
    maxTime,
    headline: allReached
      ? `All ${n} Nodes Received Signal in ${finalResult} ms!`
      : `Signal Unreachable! Only ${visit.size}/${n} nodes received signal (-1).`,
    subtext: allReached
      ? `Network delay is the maximum shortest-path time across all nodes.`
      : `Disconnected nodes exist that cannot be reached from source Node ${k}.`,
    codeLine: 14,
    variableBadges: [
      { name: 'return', value: `${finalResult}` },
      { name: 'nodesReached', value: `${visit.size}/${n}` },
      { name: 'totalDelay', value: allReached ? `${finalResult} ms` : 'Unreachable' }
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
