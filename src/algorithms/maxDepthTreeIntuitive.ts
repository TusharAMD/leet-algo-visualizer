export interface TreeDepthNode {
  id: number;
  val: number;
  leftId: number | null;
  rightId: number | null;
  x: number;
  y: number;
  level: number;
}

export interface MaxDepthStep {
  stepIndex: number;
  totalSteps: number;
  nodes: Record<number, TreeDepthNode>;
  activeNodeId: number | null;
  visitedIds: number[];
  computedDepths: Record<number, number>; // nodeId -> depth
  callStack: number[]; // stack of node values
  currentMaxDepth: number;
  headline: string;
  subtext: string;
  codeLine: number;
  variableBadges: { name: string; value: string }[];
  isComplete: boolean;
}

export const MAX_DEPTH_CODE_LINES = [
  'def maxDepth(root):',
  '    if not root:                        # Base case: empty leaf child',
  '        return 0',
  '    left_depth = maxDepth(root.left)    # Recurse left subtree',
  '    right_depth = maxDepth(root.right)  # Recurse right subtree',
  '    return 1 + max(left_depth, right_depth) # Current node depth'
];

export function generateMaxDepthSteps(treeArray: (number | null)[]): MaxDepthStep[] {
  const steps: MaxDepthStep[] = [];

  if (treeArray.length === 0 || treeArray[0] === null) {
    steps.push({
      stepIndex: 0,
      totalSteps: 1,
      nodes: {},
      activeNodeId: null,
      visitedIds: [],
      computedDepths: {},
      callStack: [],
      currentMaxDepth: 0,
      headline: 'Empty Tree: root is None',
      subtext: 'Depth of empty tree is 0.',
      codeLine: 3,
      variableBadges: [{ name: 'depth', value: '0' }],
      isComplete: true
    });
    return steps;
  }

  // Pre-calculate positions for 3 levels (indices 0..6)
  const positions: { x: number; y: number; level: number }[] = [
    { x: 50, y: 15, level: 0 },
    { x: 26, y: 46, level: 1 },
    { x: 74, y: 46, level: 1 },
    { x: 14, y: 78, level: 2 },
    { x: 38, y: 78, level: 2 },
    { x: 62, y: 78, level: 2 },
    { x: 86, y: 78, level: 2 }
  ];

  const nodes: Record<number, TreeDepthNode> = {};
  for (let i = 0; i < treeArray.length && i < positions.length; i++) {
    const val = treeArray[i];
    if (val !== null && val !== undefined) {
      const leftIdx = 2 * i + 1;
      const rightIdx = 2 * i + 2;
      nodes[i] = {
        id: i,
        val,
        leftId: leftIdx < treeArray.length && treeArray[leftIdx] !== null ? leftIdx : null,
        rightId: rightIdx < treeArray.length && treeArray[rightIdx] !== null ? rightIdx : null,
        x: positions[i].x,
        y: positions[i].y,
        level: positions[i].level
      };
    }
  }

  const computedDepths: Record<number, number> = {};
  const visitedIds: number[] = [];
  let currentMax = 0;

  // Initial step
  steps.push({
    stepIndex: 0,
    totalSteps: 0,
    nodes: { ...nodes },
    activeNodeId: 0,
    visitedIds: [],
    computedDepths: {},
    callStack: [nodes[0].val],
    currentMaxDepth: 0,
    headline: `Start DFS Traversal from Root Node(${nodes[0].val})`,
    subtext: 'Compute depth bottom-up: depth = 1 + max(left_depth, right_depth).',
    codeLine: 1,
    variableBadges: [
      { name: 'root', value: `${nodes[0].val}` },
      { name: 'stack', value: `[${nodes[0].val}]` }
    ],
    isComplete: false
  });

  const callStackVals: number[] = [nodes[0].val];

  function dfs(nodeId: number | null): number {
    if (nodeId === null || !nodes[nodeId]) {
      return 0;
    }

    const currNode = nodes[nodeId];

    // Visit node
    steps.push({
      stepIndex: 0,
      totalSteps: 0,
      nodes: { ...nodes },
      activeNodeId: nodeId,
      visitedIds: [...visitedIds],
      computedDepths: { ...computedDepths },
      callStack: [...callStackVals],
      currentMaxDepth: currentMax,
      headline: `Evaluating Node(${currNode.val}): Recurse into Left Child`,
      subtext: currNode.leftId !== null
        ? `Recursing left into Node(${nodes[currNode.leftId].val})...`
        : 'Left child is None (returns 0).',
      codeLine: 4,
      variableBadges: [
        { name: 'node', value: `${currNode.val}` },
        { name: 'left_child', value: currNode.leftId !== null ? `${nodes[currNode.leftId].val}` : 'None' }
      ],
      isComplete: false
    });

    if (currNode.leftId !== null) {
      callStackVals.push(nodes[currNode.leftId].val);
    }
    const leftDepth = dfs(currNode.leftId);
    if (currNode.leftId !== null) {
      callStackVals.pop();
    }

    // Right child
    steps.push({
      stepIndex: 0,
      totalSteps: 0,
      nodes: { ...nodes },
      activeNodeId: nodeId,
      visitedIds: [...visitedIds],
      computedDepths: { ...computedDepths },
      callStack: [...callStackVals],
      currentMaxDepth: currentMax,
      headline: `Node(${currNode.val}): Left returned ${leftDepth} → Recurse Right Child`,
      subtext: currNode.rightId !== null
        ? `Recursing right into Node(${nodes[currNode.rightId].val})...`
        : 'Right child is None (returns 0).',
      codeLine: 5,
      variableBadges: [
        { name: 'node', value: `${currNode.val}` },
        { name: 'left_depth', value: `${leftDepth}` },
        { name: 'right_child', value: currNode.rightId !== null ? `${nodes[currNode.rightId].val}` : 'None' }
      ],
      isComplete: false
    });

    if (currNode.rightId !== null) {
      callStackVals.push(nodes[currNode.rightId].val);
    }
    const rightDepth = dfs(currNode.rightId);
    if (currNode.rightId !== null) {
      callStackVals.pop();
    }

    const depth = 1 + Math.max(leftDepth, rightDepth);
    computedDepths[nodeId] = depth;
    visitedIds.push(nodeId);
    currentMax = Math.max(currentMax, depth);

    steps.push({
      stepIndex: 0,
      totalSteps: 0,
      nodes: { ...nodes },
      activeNodeId: nodeId,
      visitedIds: [...visitedIds],
      computedDepths: { ...computedDepths },
      callStack: [...callStackVals],
      currentMaxDepth: currentMax,
      headline: `Computed Depth for Node(${currNode.val}): 1 + max(${leftDepth}, ${rightDepth}) = ${depth}`,
      subtext: `Subtree at Node(${currNode.val}) has maximum depth of ${depth}.`,
      codeLine: 6,
      variableBadges: [
        { name: 'node', value: `${currNode.val}` },
        { name: 'subtree_depth', value: `${depth}` },
        { name: 'max_depth', value: `${currentMax}` }
      ],
      isComplete: false
    });

    return depth;
  }

  const finalDepth = dfs(0);

  // Complete step
  steps.push({
    stepIndex: 0,
    totalSteps: 0,
    nodes: { ...nodes },
    activeNodeId: 0,
    visitedIds: [...visitedIds],
    computedDepths: { ...computedDepths },
    callStack: [],
    currentMaxDepth: finalDepth,
    headline: `Maximum Depth Found: ${finalDepth}`,
    subtext: `Root subtree depth computation complete. The binary tree has a maximum depth of ${finalDepth}.`,
    codeLine: 6,
    variableBadges: [
      { name: 'result', value: `${finalDepth}` },
      { name: 'status', value: 'Complete' }
    ],
    isComplete: true
  });

  steps.forEach((s, idx) => {
    s.stepIndex = idx;
    s.totalSteps = steps.length;
  });

  return steps;
}
