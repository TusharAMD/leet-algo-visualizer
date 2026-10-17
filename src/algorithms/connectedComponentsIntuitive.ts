export interface ConnectedComponentsStep {
  stepIndex: number;
  totalSteps: number;
  n: number;
  edges: [number, number][];
  activeEdgeIndex: number | null;
  activeEdge: [number, number] | null;
  parent: number[];
  rank: number[];
  componentCount: number;
  componentGroups: { [root: number]: number[] };
  headline: string;
  subtext: string;
  codeLine: number;
  variableBadges: { name: string; value: string }[];
  isComplete: boolean;
}

export const CONNECTED_COMPONENTS_CODE_LINES = [
  'def countComponents(n, edges):',
  '    par = [i for i in range(n)]',
  '    rank = [1] * n',
  '    def find(node):',
  '        while node != par[node]:',
  '            par[node] = par[par[node]]  # Path compression',
  '            node = par[node]',
  '        return node',
  '    def union(n1, n2):',
  '        p1, p2 = find(n1), find(n2)',
  '        if p1 == p2: return 0  # Already in same component',
  '        if rank[p2] > rank[p1]: par[p1] = p2; rank[p2] += rank[p1]',
  '        else:                   par[p2] = p1; rank[p1] += rank[p2]',
  '        return 1',
  '    res = n',
  '    for n1, n2 in edges: res -= union(n1, n2)',
  '    return res'
];

export function generateConnectedComponentsSteps(
  n: number,
  edges: [number, number][]
): ConnectedComponentsStep[] {
  const steps: ConnectedComponentsStep[] = [];
  const par: number[] = Array.from({ length: n }, (_, i) => i);
  const rank: number[] = Array.from({ length: n }, () => 1);

  const find = (node: number): number => {
    let curr = node;
    while (curr !== par[curr]) {
      par[curr] = par[par[curr]];
      curr = par[curr];
    }
    return curr;
  };

  const getGroups = (): { [root: number]: number[] } => {
    const groups: { [root: number]: number[] } = {};
    for (let i = 0; i < n; i++) {
      const r = find(i);
      if (!groups[r]) groups[r] = [];
      groups[r].push(i);
    }
    return groups;
  };

  let componentCount = n;

  // Step 0: Initial
  steps.push({
    stepIndex: 0,
    totalSteps: 0,
    n,
    edges,
    activeEdgeIndex: null,
    activeEdge: null,
    parent: [...par],
    rank: [...rank],
    componentCount,
    componentGroups: getGroups(),
    headline: `Initialize Disjoint Set: ${n} Isolated Components`,
    subtext: 'Each node starts as its own independent component (res = n = ' + n + ').',
    codeLine: 15,
    variableBadges: [
      { name: 'res (components)', value: `${componentCount}` },
      { name: 'totalEdges', value: `${edges.length}` }
    ],
    isComplete: false
  });

  for (let idx = 0; idx < edges.length; idx++) {
    const [u, v] = edges[idx];
    const p1 = find(u);
    const p2 = find(v);

    steps.push({
      stepIndex: 0,
      totalSteps: 0,
      n,
      edges,
      activeEdgeIndex: idx,
      activeEdge: [u, v],
      parent: [...par],
      rank: [...rank],
      componentCount,
      componentGroups: getGroups(),
      headline: `Process Edge #${idx + 1}: (${u}, ${v})`,
      subtext: `find(${u}) = ${p1}, find(${v}) = ${p2}.`,
      codeLine: 16,
      variableBadges: [
        { name: 'edge', value: `(${u},${v})` },
        { name: `root(${u})`, value: `${p1}` },
        { name: `root(${v})`, value: `${p2}` }
      ],
      isComplete: false
    });

    if (p1 === p2) {
      steps.push({
        stepIndex: 0,
        totalSteps: 0,
        n,
        edges,
        activeEdgeIndex: idx,
        activeEdge: [u, v],
        parent: [...par],
        rank: [...rank],
        componentCount,
        componentGroups: getGroups(),
        headline: `Nodes ${u} and ${v} Already in Same Component`,
        subtext: `Redundant edge in component ${p1}; component count remains ${componentCount}.`,
        codeLine: 11,
        variableBadges: [
          { name: 'res', value: `${componentCount}` },
          { name: 'merged', value: 'None (cycle)' }
        ],
        isComplete: false
      });
    } else {
      if (rank[p2] > rank[p1]) {
        par[p1] = p2;
        rank[p2] += rank[p1];
      } else {
        par[p2] = p1;
        rank[p1] += rank[p2];
      }
      componentCount--;

      steps.push({
        stepIndex: 0,
        totalSteps: 0,
        n,
        edges,
        activeEdgeIndex: idx,
        activeEdge: [u, v],
        parent: [...par],
        rank: [...rank],
        componentCount,
        componentGroups: getGroups(),
        headline: `Merged Components: ${p1} + ${p2} -> Remaining: ${componentCount}`,
        subtext: `Connected two disparate clusters into one larger component.`,
        codeLine: 13,
        variableBadges: [
          { name: 'res', value: `${componentCount}` },
          { name: 'merged', value: `${p1} & ${p2}` }
        ],
        isComplete: false
      });
    }
  }

  // Completion
  steps.push({
    stepIndex: 0,
    totalSteps: 0,
    n,
    edges,
    activeEdgeIndex: null,
    activeEdge: null,
    parent: [...par],
    rank: [...rank],
    componentCount,
    componentGroups: getGroups(),
    headline: `Graph Analysis Complete: ${componentCount} Connected Component(s)`,
    subtext: `Final disjoint sets partition all ${n} nodes into ${componentCount} distinct connected clusters.`,
    codeLine: 17,
    variableBadges: [
      { name: 'return', value: `${componentCount}` },
      { name: 'totalNodes', value: `${n}` },
      { name: 'clusters', value: `${componentCount}` }
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
