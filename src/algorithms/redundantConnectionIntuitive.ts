export interface RedundantConnectionStep {
  stepIndex: number;
  totalSteps: number;
  edges: [number, number][];
  activeEdgeIndex: number | null;
  activeEdge: [number, number] | null;
  parent: number[];
  rank: number[];
  redundantEdge: [number, number] | null;
  headline: string;
  subtext: string;
  codeLine: number;
  variableBadges: { name: string; value: string }[];
  isComplete: boolean;
}

export const REDUNDANT_CONNECTION_CODE_LINES = [
  'def findRedundantConnection(edges):',
  '    par = [i for i in range(len(edges) + 1)]',
  '    rank = [1] * (len(edges) + 1)',
  '    def find(n):',
  '        p = par[n]',
  '        while p != par[p]:',
  '            par[p] = par[par[p]]  # Path compression',
  '            p = par[p]',
  '        return p',
  '    def union(n1, n2):',
  '        p1, p2 = find(n1), find(n2)',
  '        if p1 == p2: return False  # Already in same set -> cycle!',
  '        if rank[p1] > rank[p2]: par[p2] = p1; rank[p1] += rank[p2]',
  '        else:                   par[p1] = p2; rank[p2] += rank[p1]',
  '        return True',
  '    for n1, n2 in edges:',
  '        if not union(n1, n2): return [n1, n2]'
];

export function generateRedundantConnectionSteps(edges: [number, number][]): RedundantConnectionStep[] {
  const steps: RedundantConnectionStep[] = [];
  const n = edges.length;

  const par: number[] = Array.from({ length: n + 1 }, (_, i) => i);
  const rank: number[] = Array.from({ length: n + 1 }, () => 1);

  const find = (node: number): number => {
    let p = par[node];
    while (p !== par[p]) {
      par[p] = par[par[p]];
      p = par[p];
    }
    return p;
  };

  // Step 0: Init
  steps.push({
    stepIndex: 0,
    totalSteps: 0,
    edges,
    activeEdgeIndex: null,
    activeEdge: null,
    parent: [...par],
    rank: [...rank],
    redundantEdge: null,
    headline: `Initialize Disjoint Set Union (${n} Nodes, ${edges.length} Edges)`,
    subtext: 'Every node starts as its own representative root in Union-Find.',
    codeLine: 2,
    variableBadges: [
      { name: 'nodesCount', value: `${n}` },
      { name: 'edgesCount', value: `${edges.length}` }
    ],
    isComplete: false
  });

  let redundant: [number, number] | null = null;

  for (let idx = 0; idx < edges.length; idx++) {
    const [u, v] = edges[idx];

    // Find roots
    const rootU = find(u);
    const rootV = find(v);

    steps.push({
      stepIndex: 0,
      totalSteps: 0,
      edges,
      activeEdgeIndex: idx,
      activeEdge: [u, v],
      parent: [...par],
      rank: [...rank],
      redundantEdge: null,
      headline: `Inspect Edge #${idx + 1}: [${u}, ${v}]`,
      subtext: `find(${u}) = ${rootU}, find(${v}) = ${rootV}. Checking if both nodes share the same root.`,
      codeLine: 16,
      variableBadges: [
        { name: 'edge', value: `[${u},${v}]` },
        { name: `root(${u})`, value: `${rootU}` },
        { name: `root(${v})`, value: `${rootV}` }
      ],
      isComplete: false
    });

    if (rootU === rootV) {
      // Cycle found!
      redundant = [u, v];

      steps.push({
        stepIndex: 0,
        totalSteps: 0,
        edges,
        activeEdgeIndex: idx,
        activeEdge: [u, v],
        parent: [...par],
        rank: [...rank],
        redundantEdge: [u, v],
        headline: `CYCLE DETECTED! Edge [${u}, ${v}] is Redundant!`,
        subtext: `Both ${u} and ${v} already belong to tree component root ${rootU}. Adding this edge forms a cycle.`,
        codeLine: 12,
        variableBadges: [
          { name: 'cycleEdge', value: `[${u},${v}]` },
          { name: 'commonRoot', value: `${rootU}` },
          { name: 'status', value: 'Cycle Found' }
        ],
        isComplete: true
      });
      break;
    } else {
      // Union
      if (rank[rootU] > rank[rootV]) {
        par[rootV] = rootU;
        rank[rootU] += rank[rootV];
      } else {
        par[rootU] = rootV;
        rank[rootV] += rank[rootU];
      }

      steps.push({
        stepIndex: 0,
        totalSteps: 0,
        edges,
        activeEdgeIndex: idx,
        activeEdge: [u, v],
        parent: [...par],
        rank: [...rank],
        redundantEdge: null,
        headline: `Union Components: Merged Root ${rootU} with Root ${rootV}`,
        subtext: `Edge [${u}, ${v}] safely connected two disjoint trees without creating a cycle.`,
        codeLine: 13,
        variableBadges: [
          { name: 'merged', value: `${rootU} & ${rootV}` },
          { name: `par[${rootU}]`, value: `${par[rootU]}` },
          { name: `par[${rootV}]`, value: `${par[rootV]}` }
        ],
        isComplete: false
      });
    }
  }

  const total = steps.length;
  steps.forEach((s, idx) => {
    s.stepIndex = idx;
    s.totalSteps = total;
  });

  return steps;
}
