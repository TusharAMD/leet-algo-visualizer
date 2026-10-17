export interface GraphValidTreeStep {
  stepIndex: number;
  totalSteps: number;
  n: number;
  edges: [number, number][];
  activeEdgeIndex: number | null;
  activeEdge: [number, number] | null;
  parent: number[];
  cycleEdge: [number, number] | null;
  headline: string;
  subtext: string;
  codeLine: number;
  variableBadges: { name: string; value: string }[];
  isComplete: boolean;
  isValid: boolean;
}

export const GRAPH_VALID_TREE_CODE_LINES = [
  'def validTree(n, edges):',
  '    # Condition 1: A valid tree with n nodes must have exactly n - 1 edges',
  '    if len(edges) != n - 1: return False',
  '    par = [i for i in range(n)]',
  '    def find(node):',
  '        if par[node] == node: return node',
  '        par[node] = find(par[node])  # Path compression',
  '        return par[node]',
  '    # Condition 2: No cycles allowed (DSU union check)',
  '    for u, v in edges:',
  '        rootU, rootV = find(u), find(v)',
  '        if rootU == rootV: return False  # Cycle detected',
  '        par[rootU] = rootV',
  '    return True  # Connected and acyclic'
];

export function generateGraphValidTreeSteps(
  n: number,
  edges: [number, number][]
): GraphValidTreeStep[] {
  const steps: GraphValidTreeStep[] = [];
  const par: number[] = Array.from({ length: n }, (_, i) => i);

  const find = (node: number): number => {
    if (par[node] === node) return node;
    par[node] = find(par[node]);
    return par[node];
  };

  // Step 0: Initial Condition 1 Check
  const edgeCountValid = edges.length === n - 1;

  steps.push({
    stepIndex: 0,
    totalSteps: 0,
    n,
    edges,
    activeEdgeIndex: null,
    activeEdge: null,
    parent: [...par],
    cycleEdge: null,
    headline: `Check Condition 1: Edge Count (|E| == |V| - 1)`,
    subtext: edgeCountValid
      ? `Edges count (${edges.length}) equals n - 1 (${n - 1}). Valid candidate!`
      : `Edges count (${edges.length}) != n - 1 (${n - 1}). Disconnected or cyclic!`,
    codeLine: 3,
    variableBadges: [
      { name: 'n', value: `${n}` },
      { name: 'edges', value: `${edges.length}` },
      { name: 'needed', value: `${n - 1}` }
    ],
    isComplete: !edgeCountValid,
    isValid: edgeCountValid
  });

  if (!edgeCountValid) {
    const total = steps.length;
    steps.forEach((s, idx) => {
      s.stepIndex = idx;
      s.totalSteps = total;
    });
    return steps;
  }

  // Condition 2: Union-Find cycle check
  let hasCycle = false;
  let cycleEdge: [number, number] | null = null;

  for (let idx = 0; idx < edges.length; idx++) {
    const [u, v] = edges[idx];
    const rootU = find(u);
    const rootV = find(v);

    steps.push({
      stepIndex: 0,
      totalSteps: 0,
      n,
      edges,
      activeEdgeIndex: idx,
      activeEdge: [u, v],
      parent: [...par],
      cycleEdge: null,
      headline: `Inspect Edge #${idx + 1}: (${u}, ${v})`,
      subtext: `find(${u}) = ${rootU}, find(${v}) = ${rootV}. Checking for common tree root.`,
      codeLine: 11,
      variableBadges: [
        { name: 'edge', value: `(${u},${v})` },
        { name: `root(${u})`, value: `${rootU}` },
        { name: `root(${v})`, value: `${rootV}` }
      ],
      isComplete: false,
      isValid: false
    });

    if (rootU === rootV) {
      hasCycle = true;
      cycleEdge = [u, v];

      steps.push({
        stepIndex: 0,
        totalSteps: 0,
        n,
        edges,
        activeEdgeIndex: idx,
        activeEdge: [u, v],
        parent: [...par],
        cycleEdge: [u, v],
        headline: `Cycle Detected on Edge (${u}, ${v}) -> NOT A VALID TREE`,
        subtext: `Nodes ${u} and ${v} already belong to the same component root (${rootU}).`,
        codeLine: 12,
        variableBadges: [
          { name: 'result', value: 'False' },
          { name: 'cycleEdge', value: `(${u},${v})` }
        ],
        isComplete: true,
        isValid: false
      });
      break;
    } else {
      par[rootU] = rootV;
      steps.push({
        stepIndex: 0,
        totalSteps: 0,
        n,
        edges,
        activeEdgeIndex: idx,
        activeEdge: [u, v],
        parent: [...par],
        cycleEdge: null,
        headline: `Edge (${u}, ${v}) Connected Safely`,
        subtext: `Merged root ${rootU} into root ${rootV}. No cycle formed.`,
        codeLine: 13,
        variableBadges: [
          { name: 'merged', value: `${rootU} -> ${rootV}` },
          { name: 'status', value: 'Acyclic' }
        ],
        isComplete: false,
        isValid: false
      });
    }
  }

  if (!hasCycle) {
    steps.push({
      stepIndex: 0,
      totalSteps: 0,
      n,
      edges,
      activeEdgeIndex: null,
      activeEdge: null,
      parent: [...par],
      cycleEdge: null,
      headline: 'Graph is a VALID TREE! (Connected & Acyclic)',
      subtext: `All ${n} nodes are connected by exactly ${n - 1} acyclic edges.`,
      codeLine: 14,
      variableBadges: [
        { name: 'result', value: 'True' },
        { name: 'treeNodes', value: `${n}` },
        { name: 'treeEdges', value: `${n - 1}` }
      ],
      isComplete: true,
      isValid: true
    });
  }

  const total = steps.length;
  steps.forEach((s, idx) => {
    s.stepIndex = idx;
    s.totalSteps = total;
  });

  return steps;
}
