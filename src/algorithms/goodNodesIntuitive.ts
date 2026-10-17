export interface GoodTreeNode {
  id: number;
  val: number;
  leftId: number | null;
  rightId: number | null;
  x: number;
  y: number;
  level: number;
}

export interface GoodNodesStep {
  stepIndex: number;
  totalSteps: number;
  nodes: Record<number, GoodTreeNode>;
  activeNodeId: number | null;
  maxValAlongPath: number;
  isCurrentGood: boolean;
  goodNodeIds: number[];
  pathValues: number[];
  totalGoodCount: number;
  headline: string;
  subtext: string;
  codeLine: number;
  variableBadges: { name: string; value: string }[];
  isComplete: boolean;
}

export const GOOD_NODES_CODE_LINES = [
  'def goodNodes(root):',
  '    def dfs(node, maxVal):',
  '        if not node: return 0',
  '        res = 1 if node.val >= maxVal else 0  # Good if val >= ancestor max',
  '        maxVal = max(maxVal, node.val)       # Propagate new path maximum',
  '        res += dfs(node.left, maxVal)         # Recurse left',
  '        res += dfs(node.right, maxVal)        # Recurse right',
  '        return res',
  '    return dfs(root, root.val)'
];

export function generateGoodNodesSteps(treeArr: (number | null)[]): GoodNodesStep[] {
  const steps: GoodNodesStep[] = [];

  if (treeArr.length === 0 || treeArr[0] === null) {
    steps.push({
      stepIndex: 0,
      totalSteps: 1,
      nodes: {},
      activeNodeId: null,
      maxValAlongPath: 0,
      isCurrentGood: false,
      goodNodeIds: [],
      pathValues: [],
      totalGoodCount: 0,
      headline: 'Empty Tree: root is None',
      subtext: 'No good nodes in empty tree.',
      codeLine: 3,
      variableBadges: [{ name: 'count', value: '0' }],
      isComplete: true
    });
    return steps;
  }

  const positions: { x: number; y: number; level: number }[] = [
    { x: 50, y: 18, level: 0 },
    { x: 26, y: 52, level: 1 },
    { x: 74, y: 52, level: 1 },
    { x: 14, y: 82, level: 2 },
    { x: 38, y: 82, level: 2 },
    { x: 62, y: 82, level: 2 },
    { x: 86, y: 82, level: 2 }
  ];

  const nodes: Record<number, GoodTreeNode> = {};
  for (let i = 0; i < treeArr.length && i < positions.length; i++) {
    const val = treeArr[i];
    if (val !== null && val !== undefined) {
      const leftIdx = 2 * i + 1;
      const rightIdx = 2 * i + 2;
      nodes[i] = {
        id: i,
        val,
        leftId: leftIdx < treeArr.length && treeArr[leftIdx] !== null ? leftIdx : null,
        rightId: rightIdx < treeArr.length && treeArr[rightIdx] !== null ? rightIdx : null,
        x: positions[i].x,
        y: positions[i].y,
        level: positions[i].level
      };
    }
  }

  const goodNodeIds: number[] = [];
  const currentPath: number[] = [];
  let goodCount = 0;

  // Initial step
  steps.push({
    stepIndex: 0,
    totalSteps: 0,
    nodes,
    activeNodeId: 0,
    maxValAlongPath: nodes[0].val,
    isCurrentGood: true,
    goodNodeIds: [],
    pathValues: [nodes[0].val],
    totalGoodCount: 0,
    headline: `Start DFS Traversal from Root Node(${nodes[0].val})`,
    subtext: 'A node is "Good" if no ancestor on the path from root has a strictly greater value.',
    codeLine: 1,
    variableBadges: [
      { name: 'root', value: `${nodes[0].val}` },
      { name: 'initial_max', value: `${nodes[0].val}` }
    ],
    isComplete: false
  });

  function dfs(nodeId: number | null, maxVal: number): number {
    if (nodeId === null || !nodes[nodeId]) {
      return 0;
    }

    const currNode = nodes[nodeId];
    currentPath.push(currNode.val);
    const isGood = currNode.val >= maxVal;
    if (isGood) {
      goodNodeIds.push(nodeId);
      goodCount++;
    }

    steps.push({
      stepIndex: 0,
      totalSteps: 0,
      nodes,
      activeNodeId: nodeId,
      maxValAlongPath: maxVal,
      isCurrentGood: isGood,
      goodNodeIds: [...goodNodeIds],
      pathValues: [...currentPath],
      totalGoodCount: goodCount,
      headline: isGood
        ? `Node(${currNode.val}) is a GOOD NODE! (${currNode.val} >= ancestor max ${maxVal})`
        : `Node(${currNode.val}) is NOT Good (${currNode.val} < ancestor max ${maxVal})`,
      subtext: isGood
        ? `No ancestor along path [${currentPath.join(' -> ')}] is greater. Count increments to ${goodCount}.`
        : `Ancestor with value ${maxVal} is strictly greater. Count remains ${goodCount}.`,
      codeLine: 4,
      variableBadges: [
        { name: 'node_val', value: `${currNode.val}` },
        { name: 'path_max', value: `${maxVal}` },
        { name: 'is_good', value: isGood ? 'True' : 'False' },
        { name: 'total_good', value: `${goodCount}` }
      ],
      isComplete: false
    });

    const newMax = Math.max(maxVal, currNode.val);

    let res = isGood ? 1 : 0;
    res += dfs(currNode.leftId, newMax);
    res += dfs(currNode.rightId, newMax);

    currentPath.pop();
    return res;
  }

  dfs(0, nodes[0].val);

  // Complete step
  steps.push({
    stepIndex: 0,
    totalSteps: 0,
    nodes,
    activeNodeId: null,
    maxValAlongPath: nodes[0].val,
    isCurrentGood: false,
    goodNodeIds: [...goodNodeIds],
    pathValues: [],
    totalGoodCount: goodCount,
    headline: `Completed DFS! Found ${goodCount} Good Nodes`,
    subtext: `Evaluated all tree branches in single-pass O(N) time with O(H) recursive call stack.`,
    codeLine: 9,
    variableBadges: [
      { name: 'total_good_nodes', value: `${goodCount}` },
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
