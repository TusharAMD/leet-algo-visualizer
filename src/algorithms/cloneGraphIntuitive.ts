export interface GraphNodeInfo {
  id: number;
  val: number;
  neighbors: number[];
  x: number;
  y: number;
}

export interface CloneGraphStep {
  stepIndex: number;
  totalSteps: number;
  originalGraph: GraphNodeInfo[];
  clonedGraph: GraphNodeInfo[];
  oldToNew: { [key: number]: number };
  activeNodeId: number | null;
  activeNeighborId: number | null;
  state: 'CLONE_NODE' | 'CONNECT_EDGE' | 'CACHE_HIT' | 'DONE';
  headline: string;
  subtext: string;
  codeLine: number;
  variableBadges: { name: string; value: string }[];
  isComplete: boolean;
}

export const CLONE_GRAPH_CODE_LINES = [
  'def cloneGraph(node):',
  '    oldToNew = {}                           # Map original node -> cloned node',
  '    def dfs(node):',
  '        if node in oldToNew:                # Already cloned: return cached clone',
  '            return oldToNew[node]',
  '        copy = Node(node.val)               # Create new node instance',
  '        oldToNew[node] = copy',
  '        for nei in node.neighbors:          # Clone all adjacent neighbors',
  '            copy.neighbors.append(dfs(nei))',
  '        return copy',
  '    return dfs(node) if node else None'
];

export function buildPresetGraph1(): GraphNodeInfo[] {
  // 4-cycle graph [[2,4],[1,3],[2,4],[1,3]]
  return [
    { id: 1, val: 1, neighbors: [2, 4], x: 25, y: 30 },
    { id: 2, val: 2, neighbors: [1, 3], x: 75, y: 30 },
    { id: 3, val: 3, neighbors: [2, 4], x: 75, y: 70 },
    { id: 4, val: 4, neighbors: [1, 3], x: 25, y: 70 }
  ];
}

export function buildPresetGraph2(): GraphNodeInfo[] {
  // Triangle with center node
  return [
    { id: 1, val: 1, neighbors: [2, 3], x: 50, y: 25 },
    { id: 2, val: 2, neighbors: [1, 3], x: 30, y: 75 },
    { id: 3, val: 3, neighbors: [1, 2], x: 70, y: 75 }
  ];
}

export function generateCloneGraphSteps(graph: GraphNodeInfo[]): CloneGraphStep[] {
  const steps: CloneGraphStep[] = [];
  const nodeMap = new Map<number, GraphNodeInfo>();
  for (const n of graph) nodeMap.set(n.id, n);

  const oldToNew: { [key: number]: number } = {};
  const clonedGraph: GraphNodeInfo[] = [];

  // Step 0: Initial
  steps.push({
    stepIndex: 0,
    totalSteps: 0,
    originalGraph: graph,
    clonedGraph: [],
    oldToNew: {},
    activeNodeId: graph[0]?.id ?? null,
    activeNeighborId: null,
    state: 'CLONE_NODE',
    headline: 'Initialize Graph Cloning with DFS & Hash Map',
    subtext: 'oldToNew dictionary prevents infinite cycles and ensures each node is only cloned once.',
    codeLine: 2,
    variableBadges: [
      { name: 'oldToNew', value: '{}' },
      { name: 'graphNodes', value: `${graph.length}` }
    ],
    isComplete: false
  });

  const maxSteps = 40;

  function dfs(nodeId: number): number {
    if (steps.length >= maxSteps) return nodeId;

    if (oldToNew[nodeId] !== undefined) {
      steps.push({
        stepIndex: 0,
        totalSteps: 0,
        originalGraph: graph,
        clonedGraph: clonedGraph.map((n) => ({ ...n, neighbors: [...n.neighbors] })),
        oldToNew: { ...oldToNew },
        activeNodeId: nodeId,
        activeNeighborId: null,
        state: 'CACHE_HIT',
        headline: `Node ${nodeId} Already Cloned -> Return Cached Clone ${oldToNew[nodeId]}`,
        subtext: 'Avoids infinite cycle loop in undirected graph.',
        codeLine: 5,
        variableBadges: [
          { name: 'cacheHit', value: `Node(${nodeId})` },
          { name: 'returnClone', value: `Clone(${oldToNew[nodeId]})` }
        ],
        isComplete: false
      });
      return oldToNew[nodeId];
    }

    const orig = nodeMap.get(nodeId)!;
    const clonedId = nodeId;
    oldToNew[nodeId] = clonedId;

    const newClone: GraphNodeInfo = {
      id: clonedId,
      val: orig.val,
      neighbors: [],
      x: orig.x,
      y: orig.y
    };
    clonedGraph.push(newClone);

    steps.push({
      stepIndex: 0,
      totalSteps: 0,
      originalGraph: graph,
      clonedGraph: clonedGraph.map((n) => ({ ...n, neighbors: [...n.neighbors] })),
      oldToNew: { ...oldToNew },
      activeNodeId: nodeId,
      activeNeighborId: null,
      state: 'CLONE_NODE',
      headline: `Instantiate Clone for Node ${nodeId} (val = ${orig.val})`,
      subtext: `Created new Node(${orig.val}) at new memory address. Stored in oldToNew.`,
      codeLine: 7,
      variableBadges: [
        { name: 'cloned', value: `Node(${nodeId})` },
        { name: 'oldToNewSize', value: `${Object.keys(oldToNew).length}` }
      ],
      isComplete: false
    });

    for (const neiId of orig.neighbors) {
      steps.push({
        stepIndex: 0,
        totalSteps: 0,
        originalGraph: graph,
        clonedGraph: clonedGraph.map((n) => ({ ...n, neighbors: [...n.neighbors] })),
        oldToNew: { ...oldToNew },
        activeNodeId: nodeId,
        activeNeighborId: neiId,
        state: 'CONNECT_EDGE',
        headline: `Traverse Neighbor ${neiId} of Node ${nodeId}`,
        subtext: `Recursively cloning neighbor ${neiId} to wire edge between Clone ${nodeId} and Clone ${neiId}.`,
        codeLine: 9,
        variableBadges: [
          { name: 'from', value: `${nodeId}` },
          { name: 'to', value: `${neiId}` }
        ],
        isComplete: false
      });

      const clonedNei = dfs(neiId);
      newClone.neighbors.push(clonedNei);
      if (steps.length >= maxSteps) return clonedId;
    }

    return clonedId;
  }

  if (graph.length > 0) {
    dfs(graph[0].id);
  }

  // Done
  steps.push({
    stepIndex: 0,
    totalSteps: 0,
    originalGraph: graph,
    clonedGraph: clonedGraph.map((n) => ({ ...n, neighbors: [...n.neighbors] })),
    oldToNew: { ...oldToNew },
    activeNodeId: null,
    activeNeighborId: null,
    state: 'DONE',
    headline: 'Graph Deep Copy Fully Complete!',
    subtext: `Replicated all ${clonedGraph.length} nodes and their interconnected adjacency lists with zero shared references.`,
    codeLine: 11,
    variableBadges: [
      { name: 'status', value: 'Complete' },
      { name: 'clonedNodes', value: `${clonedGraph.length}` }
    ],
    isComplete: true
  });

  return steps.map((s, idx) => ({
    ...s,
    stepIndex: idx,
    totalSteps: steps.length
  }));
}
