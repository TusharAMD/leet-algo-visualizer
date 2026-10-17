export interface ReconstructItineraryStep {
  stepIndex: number;
  totalSteps: number;
  tickets: [string, string][];
  adj: { [src: string]: string[] };
  currentAirport: string | null;
  stack: string[];
  itinerary: string[];
  headline: string;
  subtext: string;
  codeLine: number;
  variableBadges: { name: string; value: string }[];
  isComplete: boolean;
}

export const RECONSTRUCT_ITINERARY_CODE_LINES = [
  'def findItinerary(tickets):',
  '    # Hierholzer\'s Algorithm: Lexicographical Eulerian Path',
  '    adj = collections.defaultdict(list)',
  '    for src, dst in sorted(tickets, reverse=True):',
  '        adj[src].append(dst)',
  '    res = []',
  '    def dfs(src):',
  '        while adj[src]:',
  '            dfs(adj[src].pop())',
  '        res.append(src)  # Postorder append',
  '    dfs("JFK")',
  '    return res[::-1]    # Reverse postorder for forward path'
];

export function generateReconstructItinerarySteps(
  tickets: [string, string][]
): ReconstructItineraryStep[] {
  const steps: ReconstructItineraryStep[] = [];

  // Build sorted adjacency list
  const adj: { [src: string]: string[] } = {};
  for (const [src, dst] of tickets) {
    if (!adj[src]) adj[src] = [];
    adj[src].push(dst);
  }
  for (const src in adj) {
    adj[src].sort();
  }

  const cloneAdj = (graph: { [src: string]: string[] }) => {
    const res: { [src: string]: string[] } = {};
    for (const k in graph) {
      res[k] = [...graph[k]];
    }
    return res;
  };

  const currAdj = cloneAdj(adj);
  const res: string[] = [];
  const stack: string[] = [];

  // Step 0: Initial
  steps.push({
    stepIndex: 0,
    totalSteps: 0,
    tickets,
    adj: cloneAdj(currAdj),
    currentAirport: 'JFK',
    stack: [],
    itinerary: [],
    headline: 'Initialize Itinerary: Starting at "JFK"',
    subtext: 'Built lexicographically sorted flight adjacency lists from tickets.',
    codeLine: 4,
    variableBadges: [
      { name: 'start', value: '"JFK"' },
      { name: 'totalTickets', value: `${tickets.length}` }
    ],
    isComplete: false
  });

  const dfs = (src: string) => {
    stack.push(src);

    steps.push({
      stepIndex: 0,
      totalSteps: 0,
      tickets,
      adj: cloneAdj(currAdj),
      currentAirport: src,
      stack: [...stack],
      itinerary: [...res].reverse(),
      headline: `Visit Airport "${src}"`,
      subtext: `Outgoing available flights: [${(currAdj[src] || []).join(', ') || 'None'}]`,
      codeLine: 8,
      variableBadges: [
        { name: 'currentAirport', value: `"${src}"` },
        { name: 'remainingFlights', value: `${(currAdj[src] || []).length}` },
        { name: 'stackDepth', value: `${stack.length}` }
      ],
      isComplete: false
    });

    while (currAdj[src] && currAdj[src].length > 0) {
      const nextDst = currAdj[src].shift()!;

      steps.push({
        stepIndex: 0,
        totalSteps: 0,
        tickets,
        adj: cloneAdj(currAdj),
        currentAirport: src,
        stack: [...stack],
        itinerary: [...res].reverse(),
        headline: `Fly Flight "${src}" -> "${nextDst}"`,
        subtext: `Taking lexicographically smallest available ticket to "${nextDst}".`,
        codeLine: 9,
        variableBadges: [
          { name: 'flightTaken', value: `"${src}" -> "${nextDst}"` },
          { name: 'nextDestination', value: `"${nextDst}"` }
        ],
        isComplete: false
      });

      dfs(nextDst);
    }

    // Postorder append
    res.push(src);
    stack.pop();

    steps.push({
      stepIndex: 0,
      totalSteps: 0,
      tickets,
      adj: cloneAdj(currAdj),
      currentAirport: src,
      stack: [...stack],
      itinerary: [...res].reverse(),
      headline: `Backtrack: Append "${src}" to Eulerian Postorder`,
      subtext: `No more outgoing flights from "${src}". Appended to reverse Eulerian path.`,
      codeLine: 10,
      variableBadges: [
        { name: 'postorderAppended', value: `"${src}"` },
        { name: 'itineraryLen', value: `${res.length}` }
      ],
      isComplete: false
    });
  };

  dfs('JFK');

  const finalItinerary = [...res].reverse();

  steps.push({
    stepIndex: 0,
    totalSteps: 0,
    tickets,
    adj: cloneAdj(currAdj),
    currentAirport: null,
    stack: [],
    itinerary: finalItinerary,
    headline: `Complete Eulerian Itinerary: ${finalItinerary.join(' -> ')}`,
    subtext: `All ${tickets.length} tickets used exactly once in lexicographical order.`,
    codeLine: 12,
    variableBadges: [
      { name: 'totalStops', value: `${finalItinerary.length}` },
      { name: 'itinerary', value: `[${finalItinerary.join(',')}]` }
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
