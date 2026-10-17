export interface MaxPathNode {
  id: number;
  val: number;
  leftId: number | null;
  rightId: number | null;
  x: number;
  y: number;
  level: number;
}

export interface MaxPathSumStep {
  stepIndex: number;
  totalSteps: number;
  nodes: Record<number, MaxPathNode>;
  activeNodeId: number | null;
  leftGain: number;
  rightGain: number;
  localPathSum: number;
  globalMax: number;
  winningPathNodeIds: number[];
  headline: string;
  subtext: string;
  codeLine: number;
  variableBadges: { name: string; value: string }[];
  isComplete: boolean;
}

export const MAX_PATH_SUM_CODE_LINES = [
  'def maxPathSum(root):',
  '    res = float("-inf")',
  '    def dfs(node):',
  '        nonlocal res',
  '        if not node: return 0',
  '        leftMax = max(0, dfs(node.left))    # Ignore negative branch gain',
  '        rightMax = max(0, dfs(node.right))  # Ignore negative branch gain',
  '        res = max(res, node.val + leftMax + rightMax) # Split path sum',
  '        return node.val + max(leftMax, rightMax)      # Return single branch',
  '    dfs(root)',
  '    return res'
];

export function generateMaxPathSumSteps(treeArr: (number | null)[]): MaxPathSumStep[] {
  const steps: MaxPathSumStep[] = [];

  if (treeArr.length === 0 || treeArr[0] === null) {
    steps.push({
      stepIndex: 0,
      totalSteps: 1,
      nodes: {},
      activeNodeId: null,
      leftGain: 0,
      rightGain: 0,
      localPathSum: 0,
      globalMax: 0,
      winningPathNodeIds: [],
      headline: 'Empty Tree: root is None',
      subtext: 'No path in empty tree.',
      codeLine: 2,
      variableBadges: [{ name: 'res', value: '0' }],
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

  const nodes: Record<number, MaxPathNode> = {};
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

  let globalMax = -Infinity;
  let winningNodeIds: number[] = [];

  // Initial step
  steps.push({
    stepIndex: 0,
    totalSteps: 0,
    nodes,
    activeNodeId: 0,
    leftGain: 0,
    rightGain: 0,
    localPathSum: 0,
    globalMax: -Infinity,
    winningPathNodeIds: [],
    headline: 'Initialize Post-Order DFS for Maximum Path Sum',
    subtext: 'At every node: split sum = node.val + max(0, left) + max(0, right). Branch returned = node.val + max(left, right).',
    codeLine: 2,
    variableBadges: [
      { name: 'res', value: '-inf' },
      { name: 'root', value: `${nodes[0].val}` }
    ],
    isComplete: false
  });

  function dfs(nodeId: number | null): number {
    if (nodeId === null || !nodes[nodeId]) {
      return 0;
    }

    const currNode = nodes[nodeId];

    steps.push({
      stepIndex: 0,
      totalSteps: 0,
      nodes,
      activeNodeId: nodeId,
      leftGain: 0,
      rightGain: 0,
      localPathSum: 0,
      globalMax: globalMax === -Infinity ? currNode.val : globalMax,
      winningPathNodeIds: [...winningNodeIds],
      headline: `Visit Node(${currNode.val}): Recurse Left Subtree`,
      subtext: `Evaluating maximum branch contribution from left child...`,
      codeLine: 6,
      variableBadges: [
        { name: 'node', value: `${currNode.val}` },
        { name: 'left_child', value: currNode.leftId !== null ? `${nodes[currNode.leftId].val}` : 'None' }
      ],
      isComplete: false
    });

    const leftRaw = dfs(currNode.leftId);
    const leftGain = Math.max(0, leftRaw);

    steps.push({
      stepIndex: 0,
      totalSteps: 0,
      nodes,
      activeNodeId: nodeId,
      leftGain,
      rightGain: 0,
      localPathSum: 0,
      globalMax: globalMax === -Infinity ? currNode.val : globalMax,
      winningPathNodeIds: [...winningNodeIds],
      headline: `Node(${currNode.val}): Left Gain = max(0, ${leftRaw}) = ${leftGain} → Recurse Right`,
      subtext: `Evaluating maximum branch contribution from right child...`,
      codeLine: 7,
      variableBadges: [
        { name: 'node', value: `${currNode.val}` },
        { name: 'left_gain', value: `${leftGain}` },
        { name: 'right_child', value: currNode.rightId !== null ? `${nodes[currNode.rightId].val}` : 'None' }
      ],
      isComplete: false
    });

    const rightRaw = dfs(currNode.rightId);
    const rightGain = Math.max(0, rightRaw);

    const localSplitSum = currNode.val + leftGain + rightGain;
    const oldMax = globalMax;

    if (localSplitSum > globalMax) {
      globalMax = localSplitSum;
      const pathIds = [nodeId];
      if (leftGain > 0 && currNode.leftId !== null) pathIds.push(currNode.leftId);
      if (rightGain > 0 && currNode.rightId !== null) pathIds.push(currNode.rightId);
      winningNodeIds = pathIds;
    }

    steps.push({
      stepIndex: 0,
      totalSteps: 0,
      nodes,
      activeNodeId: nodeId,
      leftGain,
      rightGain,
      localPathSum: localSplitSum,
      globalMax,
      winningPathNodeIds: [...winningNodeIds],
      headline: `Split Path at Node(${currNode.val}): ${currNode.val} + ${leftGain} + ${rightGain} = ${localSplitSum}`,
      subtext: localSplitSum > oldMax
        ? `New Global Maximum Path Sum Found: ${globalMax}!`
        : `Global max remains ${globalMax}. Return single branch ${currNode.val + Math.max(leftGain, rightGain)} to parent.`,
      codeLine: 8,
      variableBadges: [
        { name: 'split_sum', value: `${localSplitSum}` },
        { name: 'global_res', value: `${globalMax}` },
        { name: 'return_gain', value: `${currNode.val + Math.max(leftGain, rightGain)}` }
      ],
      isComplete: false
    });

    return currNode.val + Math.max(leftGain, rightGain);
  }

  dfs(0);

  // Complete step
  steps.push({
    stepIndex: 0,
    totalSteps: 0,
    nodes,
    activeNodeId: null,
    leftGain: 0,
    rightGain: 0,
    localPathSum: globalMax,
    globalMax,
    winningPathNodeIds: [...winningNodeIds],
    headline: `Maximum Path Sum Found: ${globalMax}!`,
    subtext: `Computed optimal non-empty tree path sum in O(N) time and O(H) space.`,
    codeLine: 11,
    variableBadges: [
      { name: 'maxPathSum', value: `${globalMax}` },
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
